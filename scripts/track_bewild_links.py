"""Add article attribution to BeWild links in generated HTML."""
from html import escape
from html.parser import HTMLParser
from pathlib import Path
import argparse
import re
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

HOSTS = {"bewild.ai", "www.bewild.ai"}
ATTRIBUTES = re.compile(r"""([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?""")


def page_slug(path):
    slug = path.parent.name if path.name == "index.html" else path.stem
    slug = re.sub(r"[^A-Za-z0-9_.-]", "-", slug)[:100]
    return slug or "home"


def tracked_url(href, slug):
    try:
        url = urlsplit(href)
    except ValueError:
        return None
    if url.hostname not in HOSTS or url.scheme not in ("", "http", "https"):
        return None

    params = parse_qsl(url.query, keep_blank_values=True)
    sponsored = ("code", "AIG") in params
    tracking = {"utm_source": "wildai_help", "utm_medium": "referral", "utm_content": slug}
    query = "&".join(
        part for part in url.query.split("&")
        if part and not any(key in tracking for key, _ in parse_qsl(part, keep_blank_values=True))
    )
    query = "&".join(filter(None, (query, urlencode(tracking))))
    path = url.path or "/"
    return urlunsplit((url.scheme, url.netloc, path, query, url.fragment)), sponsored


class LinkRewriter(HTMLParser):
    def __init__(self, markup, slug):
        super().__init__(convert_charrefs=False)
        self.slug = slug
        self.line_offsets = [0, *(m.end() for m in re.finditer("\n", markup))]
        self.edits = []

    def handle_starttag(self, tag, attrs):
        if tag != "a":
            return
        href = dict(attrs).get("href")
        result = tracked_url(href, self.slug) if href else None
        if result is None:
            return

        url, sponsored = result
        rel = "sponsored noopener" if sponsored else "noopener"
        start_tag = self.get_starttag_text()
        found_rel = False

        def replace(match):
            nonlocal found_rel
            name = match[1].lower()
            if name == "href":
                return f'href="{escape(url, quote=True)}"'
            if name == "rel":
                found_rel = True
                return f'rel="{rel}"'
            return match[0]

        updated = start_tag[:2] + ATTRIBUTES.sub(replace, start_tag[2:])
        if not found_rel:
            updated = updated[:-1] + f' rel="{rel}">'
        if updated != start_tag:
            line, column = self.getpos()
            start = self.line_offsets[line - 1] + column
            self.edits.append((start, start + len(start_tag), updated))


def rewrite_html(markup, slug):
    parser = LinkRewriter(markup, slug)
    parser.feed(markup)
    parser.close()
    chunks = []
    cursor = 0
    for start, end, replacement in parser.edits:
        chunks.extend((markup[cursor:start], replacement))
        cursor = end
    return "".join((*chunks, markup[cursor:]))


def rewrite_site(root):
    for page in root.rglob("*.html"):
        relative = page.relative_to(root)
        if any(part.startswith(".") for part in relative.parts):
            continue
        original = page.read_text(encoding="utf-8")
        updated = rewrite_html(original, page_slug(relative))
        if original != updated:
            page.write_text(updated, encoding="utf-8")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("site_root", type=Path)
    rewrite_site(parser.parse_args().site_root)
