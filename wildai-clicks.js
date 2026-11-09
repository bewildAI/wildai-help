// Record outbound WildAI links without transmitting credentials or URL queries.
(() => {
  if (!['wildai.help', 'www.wildai.help'].includes(location.hostname)) return;

  document.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link || typeof window.gtag !== 'function') return;

    const target = new URL(link.href, location.href);
    if (!['bewild.ai', 'www.bewild.ai'].includes(target.hostname)) return;

    let position = 'body';
    if (link.closest('header')) position = 'header';
    else if (link.closest('.article-cta')) position = 'article_bottom';
    else if (link.closest('footer')) position = 'footer';
    else if (link.closest('.hero')) position = 'hero';
    else if (link.closest('#faq')) position = 'faq';

    window.gtag('event', 'wildai_click', {
      send_to: 'G-CPHH1FDD2L',
      article_path: location.pathname,
      button_position: position,
      link_type: link.matches('.button, .nav-cta') ? 'button' : 'text_link',
      link_url: target.origin + target.pathname,
      transport_type: 'beacon'
    });
  });
})();
