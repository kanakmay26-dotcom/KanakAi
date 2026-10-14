
  // ---- Theme toggle ----
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const iconSun = document.getElementById('iconSun');
  const iconMoon = document.getElementById('iconMoon');
  const tvFrame = document.getElementById('tvFrame');

  function buildChartUrl(theme){
    const toolbarbg = theme === 'dark' ? '0A1310' : 'FFFFFF';
    return 'https://s.tradingview.com/widgetembed/?frameElementId=tvFrame&symbol=TVC%3AGOLD&interval=15'
      + '&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=' + toolbarbg
      + '&studies=%5B%5D&theme=' + theme + '&style=1&timezone=Etc%2FUTC&withdateranges=0'
      + '&hidevolume=1&hide_top_toolbar=0&hide_legend=0&studies_overrides=%7B%7D';
  }
  function applyTheme(theme, skipChartReload){
    root.setAttribute('data-theme', theme);
    iconSun.style.display = theme === 'dark' ? 'none' : 'block';
    iconMoon.style.display = theme === 'dark' ? 'block' : 'none';
    try { localStorage.setItem('kanak-theme', theme); } catch(e) {}
    if (!skipChartReload && tvFrame) tvFrame.src = buildChartUrl(theme);
  }
  let savedTheme = 'light';
  try {
    savedTheme = localStorage.getItem('kanak-theme')
      || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  } catch(e) {}
  applyTheme(savedTheme, true);
  if (tvFrame) tvFrame.src = buildChartUrl(savedTheme);

  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });

  // ---- Nav routing ----
  const views = document.querySelectorAll('.view');
  const navBtns = document.querySelectorAll('.navlinks [data-view], .hero-ctas [data-view], [data-view]');
  function showView(name){
    views.forEach(v => v.classList.toggle('active', v.id === 'view-' + name));
    document.querySelectorAll('.navlinks button[data-view]').forEach(b => {
      b.classList.toggle('active', b.dataset.view === name);
    });
    document.getElementById('navLinks').classList.remove('open');
    window.scrollTo({top:0, behavior:'smooth'});
  }
  document.querySelectorAll('[data-view]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      showView(el.dataset.view);
    });
  });

  document.getElementById('navToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });

  // ---- Scroll-reveal animation ----
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }
  // Re-check reveals whenever a hidden product-detail becomes visible
  // (elements inside display:none sections don't intersect until shown)
  function recheckReveals(){
    document.querySelectorAll('.reveal:not(.in-view)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('in-view');
      }
    });
  }

  // ---- Product folder navigation ----
  const productFolders = document.getElementById('productFolders');
  const productDetails = document.querySelectorAll('.product-detail');
  function openProductDetail(key){
    productFolders.style.display = 'none';
    productDetails.forEach(d => d.style.display = (d.id === 'detail-' + key) ? 'block' : 'none');
    window.scrollTo({top: 0, behavior:'smooth'});
    setTimeout(recheckReveals, 50);
  }
  function backToFolders(){
    productDetails.forEach(d => d.style.display = 'none');
    productFolders.style.display = 'grid';
    window.scrollTo({top: 0, behavior:'smooth'});
  }
  document.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', () => openProductDetail(btn.dataset.open));
  });
  document.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', backToFolders);
  });
  // Reset to folder view whenever the Products nav tab is opened
  document.querySelectorAll('[data-view="product"]').forEach(el => {
    el.addEventListener('click', backToFolders);
  });

  // Fake candle mock removed — hero now uses a live TradingView embed for TVC:GOLD.

  // ---- Stat count-up animation ----
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function formatCount(value, decimals, prefix, suffix){
    const fixed = value.toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (prefix || '') + parts.join('.') + (suffix || '');
  }
  function animateCount(el){
    const target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    const decimals = parseInt(el.dataset.countDecimals || '0', 10);
    const prefix = el.dataset.countPrefix || '';
    const suffix = el.dataset.countSuffix || '';
    if (prefersReducedMotion) { el.textContent = formatCount(target, decimals, prefix, suffix); return; }
    const duration = 1400;
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatCount(target * eased, decimals, prefix, suffix);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const countEls = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && countEls.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    countEls.forEach(el => countObserver.observe(el));
  }

  // ---- FAQ accordion ----
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      q.parentElement.classList.toggle('open');
    });
  });

  // ---- Legal modal ----
  const legalContent = {
    terms: {
      title: 'Terms of Service',
      body: `<p>By purchasing or using Kanak AI you agree to run it solely on MT5 accounts you own or are authorized to trade on. Licenses are issued per the tier purchased (1-month trial or lifetime) and are non-transferable without written consent from Kanak Algo's.</p>
             <p>Kanak Algo's provides trade-execution software only. We do not manage funds, execute trades on your behalf outside your own terminal, or guarantee any trading outcome.</p>
             <p><b>No refunds.</b> All sales are final on every tier (1-Month Trial and Lifetime Access) once payment is verified and the license delivered. Trading results depend on market conditions, broker execution, and the risk settings you configure — they are inherently subjective to each user's setup, and losses from live or trial use are not grounds for a refund, chargeback, or credit.</p>`
    },
    privacy: {
      title: 'Privacy Policy',
      body: `<p>We collect the contact details you provide (name, email) to deliver your license and respond to support requests. Payment is a USDT (TRC20) transaction processed and verified automatically via NOWPayments — we do not collect or store card or bank details.</p>
             <p>We do not sell contact information to third parties.</p>`
    },
    risk: {
      title: 'Risk Disclosure',
      body: `<p>Trading foreign exchange and CFDs on margin carries a high level of risk and may not be suitable for all investors. Automated execution removes manual hesitation but does not remove market risk — losing trades will still occur.</p>
             <p>No performance, win-rate, or return figures are published or implied by Kanak Algo's. Any results shown are illustrative of engine logic, not a promise of future performance. Only trade with capital you can afford to lose.</p>`
    }
  };
  document.querySelectorAll('[data-legal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const c = legalContent[btn.dataset.legal];
      document.getElementById('legalTitle').textContent = c.title;
      document.getElementById('legalBody').innerHTML = c.body;
      document.getElementById('legalModal').classList.add('open');
    });
  });
  document.getElementById('legalClose').addEventListener('click', () => {
    document.getElementById('legalModal').classList.remove('open');
  });

  // ---- Checkout modal (automated NOWPayments flow only) ----
  async function startCheckout(tier, priceStr){
    document.getElementById('modalSub').textContent = tier;
    document.getElementById('modalAmount').textContent = priceStr + ' USDT';
    document.getElementById('modalStatus').style.display = 'flex';
    document.getElementById('modalError').style.display = 'none';
    document.getElementById('checkoutModal').classList.add('open');

    try {
      const resp = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price_amount: priceStr, order_description: tier }),
      });
      const data = await resp.json();
      if (data && data.automated && data.invoice_url) {
        window.location.href = data.invoice_url;
      } else {
        document.getElementById('modalStatus').style.display = 'none';
        document.getElementById('modalError').style.display = 'block';
      }
    } catch (e) {
      document.getElementById('modalStatus').style.display = 'none';
      document.getElementById('modalError').style.display = 'block';
    }
  }

  document.querySelectorAll('.tier-buy').forEach(btn => {
    btn.addEventListener('click', () => {
      const tier = btn.dataset.tier;
      const price = parseFloat(btn.dataset.price).toFixed(2);
      startCheckout(tier, price);
    });
  });
  document.getElementById('modalClose').addEventListener('click', () => {
    document.getElementById('checkoutModal').classList.remove('open');
  });

  // ---- Owner-only one-time test payment ----
  // Visit the site with ?admin_test=1 in the URL to reveal this. Not shown to
  // regular visitors. Runs a real $1 NOWPayments invoice so you can verify the
  // full checkout + webhook flow before customers use it. Disables itself
  // after one use in this browser (not a strict security control — just a
  // safeguard against accidentally re-running it).
  if (new URLSearchParams(window.location.search).get('admin_test') === '1') {
    if (!localStorage.getItem('kanak-admin-test-used')) {
      const testBtn = document.createElement('button');
      testBtn.textContent = 'Run $1 test payment (owner only, one-time)';
      testBtn.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:150; background:var(--red); color:#fff; border:none; padding:12px 18px; border-radius:6px; font-size:0.82rem; font-weight:600; cursor:pointer;';
      testBtn.addEventListener('click', () => {
        localStorage.setItem('kanak-admin-test-used', '1');
        testBtn.remove();
        startCheckout('ADMIN TEST PAYMENT — DO NOT FULFILL', '1.00');
      });
      document.body.appendChild(testBtn);
    }
  }

  [document.getElementById('checkoutModal'), document.getElementById('legalModal')].forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });

  // ---- Contact form ----
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const subject = encodeURIComponent('Inquiry from ' + name);
    const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
    window.location.href = 'mailto:Kanakmay26@gmail.com?subject=' + subject + '&body=' + body;
    document.getElementById('formStatus').style.display = 'block';
  });
