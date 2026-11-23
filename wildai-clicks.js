// Add article attribution to BeWild links inserted after HTML generation.
(() => {
  const pagePath = location.pathname.replace(/\/index\.html$/, '/');
  const slug = (pagePath.split('/').filter(Boolean).pop() || 'home')
    .replace(/\.html$/, '').replace(/[^A-Za-z0-9_.-]/g, '-').slice(0, 100);
  const tracking = {
    utm_source: 'wildai_help',
    utm_medium: 'referral',
    utm_content: slug
  };

  const updateLink = link => {
    const target = new URL(link.href, location.href);
    if (!['http:', 'https:'].includes(target.protocol) ||
        !['bewild.ai', 'www.bewild.ai'].includes(target.hostname)) return;

    const rel = target.searchParams.getAll('code').includes('AIG')
      ? 'sponsored noopener' : 'noopener';
    if (Object.entries(tracking).some(([key, value]) =>
      target.searchParams.getAll(key).length !== 1 || target.searchParams.get(key) !== value)) {
      const params = target.search.slice(1).split('&').filter(part =>
        part && !Object.hasOwn(tracking, new URLSearchParams(part).keys().next().value));
      params.push(new URLSearchParams(tracking).toString());
      target.search = params.join('&');
      link.href = target.href;
    }
    if (link.rel !== rel) link.rel = rel;
  };

  const scan = element => {
    if (element.matches('a[href]')) updateLink(element);
    element.querySelectorAll('a[href]').forEach(updateLink);
  };

  scan(document.documentElement);
  new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node instanceof Element) scan(node);
      }
    }
  }).observe(document.documentElement, {childList: true, subtree: true});
})();

// Keep the newest help articles visible on the generated home page.
(() => {
  const cardsContainer = document.querySelector('.cards');
  if (!cardsContainer) return;

  if (!cardsContainer.querySelector('[href="/guides/wildai-claude-renewal-failed/"]')) {
    cardsContainer.insertAdjacentHTML('afterbegin', `
    <a class="article-card" data-new-help-card="true" data-category="问题排查" data-search="WildAI Claude 续费失败 Overdue 逾期账单 有效订阅 原订单 Free 客服" href="/guides/wildai-claude-renewal-failed/">
      <div class="card-top"><span class="article-icon icon-0">C</span><span class="category category-yellow">问题排查</span></div>
      <h3>WildAI Claude 续费失败怎么办？有效订阅与 Overdue 账单排查</h3>
      <p>按付款、原订单、有效订阅和逾期账单状态处理 Claude 续费失败。</p>
      <div class="card-bottom"><span>约 7 分钟阅读</span><span aria-hidden="true" class="article-arrow">↗</span></div>
    </a>`);
  }

  if (!cardsContainer.querySelector('[href="/guides/wildai-gemini-renewal/"]')) {
    cardsContainer.insertAdjacentHTML('afterbegin', `
    <a class="article-card" data-new-help-card="true" data-category="订阅指南" data-search="WildAI Gemini 怎么续费 提前续费 自动续订 升档 Google 账号 Pro Ultra" href="/guides/wildai-gemini-renewal/">
      <div class="card-top"><span class="article-icon icon-1">G</span><span class="category category-green">订阅指南</span></div>
      <h3>WildAI Gemini 怎么续费？提前续费、自动续订和升档说明</h3>
      <p>核对原订单和 Google 账号，查看续订、异常订单与升档处理方法。</p>
      <div class="card-bottom"><span>约 7 分钟阅读</span><span aria-hidden="true" class="article-arrow">↗</span></div>
    </a>`);
  }

  if (!cardsContainer.querySelector('[href="/guides/wildai-refund/"]')) {

    cardsContainer.insertAdjacentHTML('afterbegin', `
    <a class="article-card" data-new-help-card="true" data-category="问题排查" data-search="WildAI 能开发票吗 收据下载 抬头修改 报销 receipt 国内发票 对公账号" href="/guides/wildai-invoice-receipt/">
      <div class="card-top"><span class="article-icon icon-2">▤</span><span class="category category-yellow">问题排查</span></div>
      <h3>WildAI 能开发票吗？收据下载、抬头修改与报销前核对</h3>
      <p>说明海外 receipt 的下载位置、抬头修改和报销前核对事项。</p>
      <div class="card-bottom"><span>约 4 分钟阅读</span><span aria-hidden="true" class="article-arrow">↗</span></div>
    </a>
    <a class="article-card" data-new-help-card="true" data-category="问题排查" data-search="WildAI 退款怎么申请 订阅失败 未到账 账号被封 全额退款 剩余天数 客服" href="/guides/wildai-refund/">
      <div class="card-top"><span class="article-icon icon-0">↩</span><span class="category category-yellow">问题排查</span></div>
      <h3>WildAI 退款怎么申请？订阅失败、未到账、账号被封分别处理</h3>
      <p>按订单状态查看退款入口、计算方式、处理时间和所需材料。</p>
      <div class="card-bottom"><span>约 6 分钟阅读</span><span aria-hidden="true" class="article-arrow">↗</span></div>
    </a>
    `);
  }

  if (!cardsContainer.querySelector('[href="/guides/wildai-official-site/"]')) {
    cardsContainer.insertAdjacentHTML('afterbegin', `
    <a class="article-card" data-new-help-card="true" data-category="入门指南" data-search="WildAI 官网是哪个 BeWild.ai bewildai 登录 订阅 客服 订单入口 AIG" href="/guides/wildai-official-site/">
      <div class="card-top"><span class="article-icon icon-1">⌂</span><span class="category category-green">入门指南</span></div>
      <h3>WildAI 官网是哪个？BeWild.ai 登录、订阅与客服入口</h3>
      <p>汇总官网、登录、订阅、订单和客服入口，并说明首次订阅步骤。</p>
      <div class="card-bottom"><span>约 6 分钟阅读</span><span aria-hidden="true" class="article-arrow">↗</span></div>
    </a>`);
  }

  const editorialNote = document.querySelector('.editorial-note');
  if (editorialNote) editorialNote.textContent = '最近更新：2026 年 11 月 18 日 · 新增 Claude 续费失败排查与 Gemini 续订说明；套餐、费用及售后以订单页面为准。';

  const updateNewCards = () => {
    const input = document.querySelector('#search');
    const terms = (input?.value || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
    const category = document.querySelector('[data-filter].active')?.dataset.filter || '全部文章';
    document.querySelectorAll('[data-new-help-card]').forEach(card => {
      card.hidden = !((category === '全部文章' || card.dataset.category === category) && terms.every(term => card.dataset.search.toLowerCase().includes(term)));
    });
    const status = document.querySelector('#results-status');
    if (status && terms.length) status.textContent = `“${input.value.trim()}” · 找到 ${document.querySelectorAll('.article-card:not([hidden])').length} 篇文章`;
  };
  const scheduleUpdate = () => queueMicrotask(updateNewCards);
  document.querySelector('#search')?.addEventListener('input', scheduleUpdate);
  document.querySelector('#search-form')?.addEventListener('submit', scheduleUpdate);
  document.querySelectorAll('[data-filter]').forEach(filter => filter.addEventListener('click', scheduleUpdate));
  document.querySelector('#reset-search')?.addEventListener('click', scheduleUpdate);
  updateNewCards();
})();

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
