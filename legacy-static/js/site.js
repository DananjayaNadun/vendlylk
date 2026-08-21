/* ==========================================================================
   Vendly OrderFlow — site behaviour
   Ported from the Claude Design prototype logic in "Vendly OrderFlow.dc.html"
   and "Site Nav.dc.html".
   ========================================================================== */
(function () {
  'use strict';

  var MOBILE_QUERY = '(max-width: 940px)';
  var mobileMQ = window.matchMedia(MOBILE_QUERY);
  var reducedMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

  var isMobile = function () { return mobileMQ.matches; };
  var isReduced = function () { return reducedMQ.matches; };

  var clamp01 = function (v) { return Math.min(1, Math.max(0, v)); };
  var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
  var seg = function (p, a, b) { return clamp01((p - a) / (b - a)); };

  /* ------------------------------------------------------------------------
     Hero video — some browsers refuse autoplay until muted is set in script.
     ------------------------------------------------------------------------ */
  function initHeroVideo() {
    var video = document.getElementById('hero-video');
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    if (isReduced()) {
      video.pause();
      return;
    }
    var playing = video.play();
    if (playing && playing.catch) playing.catch(function () { /* autoplay blocked */ });
  }

  /* ------------------------------------------------------------------------
     Nav — glass backdrop after 20px, hover/focus mega panels, mobile sheet.
     ------------------------------------------------------------------------ */
  function initNav() {
    var nav = document.getElementById('site-nav');
    if (!nav) return;

    var solidByDefault = nav.dataset.navTheme === 'solid';

    /* Backdrop */
    var onScroll = function () {
      nav.classList.toggle('is-solid', solidByDefault || window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Mega panels */
    var items = Array.prototype.slice.call(nav.querySelectorAll('.site-nav__item'));
    var panels = {};
    Array.prototype.forEach.call(nav.querySelectorAll('[data-mega]'), function (panel) {
      panels[panel.dataset.mega] = panel;
    });

    var openKey = null;
    var closeTimer = null;

    function setMenu(key) {
      if (openKey === key) return;
      openKey = key;
      Object.keys(panels).forEach(function (k) {
        panels[k].hidden = k !== key;
      });
      items.forEach(function (item) {
        var button = item.querySelector('.site-nav__link');
        if (button) button.setAttribute('aria-expanded', String(item.dataset.menu === key));
      });
    }

    function open(key) {
      window.clearTimeout(closeTimer);
      if (isMobile()) return;
      setMenu(key);
    }

    function scheduleClose() {
      window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(function () { setMenu(null); }, 120);
    }

    items.forEach(function (item) {
      var key = item.dataset.menu;
      var button = item.querySelector('.site-nav__link');

      item.addEventListener('mouseenter', function () { open(key); });
      item.addEventListener('mouseleave', scheduleClose);

      if (!button) return;
      button.addEventListener('click', function (event) {
        event.preventDefault();
        window.clearTimeout(closeTimer);
        if (isMobile()) return;
        setMenu(openKey === key ? null : key);
      });
      button.addEventListener('focus', function () { open(key); });
    });

    Object.keys(panels).forEach(function (key) {
      panels[key].addEventListener('mouseenter', function () { open(key); });
      panels[key].addEventListener('mouseleave', scheduleClose);
    });

    nav.addEventListener('focusout', function (event) {
      if (!nav.contains(event.relatedTarget)) setMenu(null);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || openKey === null) return;
      var active = document.querySelector('.site-nav__item[data-menu="' + openKey + '"] .site-nav__link');
      setMenu(null);
      if (active) active.focus();
    });

    /* Mobile sheet */
    var sheet = document.getElementById('site-sheet');
    var openButton = document.getElementById('sheet-open');
    var closeButton = document.getElementById('sheet-close');
    if (!sheet || !openButton || !closeButton) return;

    function openSheet() {
      sheet.hidden = false;
      openButton.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      closeButton.focus();
    }

    function closeSheet(returnFocus) {
      if (sheet.hidden) return;
      sheet.hidden = true;
      openButton.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (returnFocus) openButton.focus();
    }

    openButton.addEventListener('click', openSheet);
    closeButton.addEventListener('click', function () { closeSheet(true); });

    sheet.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeSheet(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeSheet(true);
    });

    /* The sheet only exists below 940px — drop it if the viewport grows. */
    var onBreakpoint = function () { if (!isMobile()) closeSheet(false); };
    if (mobileMQ.addEventListener) mobileMQ.addEventListener('change', onBreakpoint);
    else if (mobileMQ.addListener) mobileMQ.addListener(onBreakpoint);
  }

  /* ------------------------------------------------------------------------
     Section reveals — rise 24px / fade over 820ms, staggered 80ms, once.
     ------------------------------------------------------------------------ */
  function initReveals() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    if (isReduced() || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });

    Array.prototype.forEach.call(targets, function (el) {
      var index = parseFloat(el.dataset.reveal) || 0;
      el.style.transitionDelay = index * 80 + 'ms';
      el.classList.add('is-armed');
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     Transformation scene — 380vh section, 100vh sticky stage.
     Scroll progress p drives chaos cards, the OrderFlow window, module chips
     and the before/after headline cross-fade.
     ------------------------------------------------------------------------ */
  function initScene() {
    var scene = document.getElementById('transform-scene');
    if (!scene) return;

    var rail = document.getElementById('scene-progress');
    var windowEl = document.getElementById('scene-window');
    var before = document.getElementById('scene-before');
    var after = document.getElementById('scene-after');
    var cards = Array.prototype.slice.call(scene.querySelectorAll('[data-chaos]'));
    var chips = Array.prototype.slice.call(scene.querySelectorAll('[data-chip]'));

    var frame = null;

    function tick() {
      /* Below 940px the stacked composition replaces the pin entirely. */
      if (isMobile() || isReduced()) return;

      var rect = scene.getBoundingClientRect();
      var span = rect.height - window.innerHeight;
      var p = clamp01(-rect.top / (span || 1));

      if (rail) rail.style.height = p * 100 + '%';

      /* Scale the scatter down on smaller viewports so nothing clips. */
      var k = Math.min(1, window.innerWidth / 1380) * Math.min(1, window.innerHeight / 820);

      cards.forEach(function (el) {
        var i = parseFloat(el.dataset.chaos) || 0;
        var x = (parseFloat(el.dataset.x) || 0) * k;
        var y = (parseFloat(el.dataset.y) || 0) * k;
        var rot = parseFloat(el.dataset.rot) || 0;
        var t = ease(seg(p, 0.02 + i * 0.035, 0.46 + i * 0.035));

        el.style.transform =
          'translate3d(' + x * (1 - t) + 'px,' + y * (1 - t) + 'px,0) ' +
          'rotate(' + rot * (1 - t) + 'deg) ' +
          'scale(' + (1 - t * 0.42) + ')';
        el.style.opacity = String(clamp01(1 - t * 1.35));
        el.style.filter = 'blur(' + t * 3 + 'px)';
      });

      if (windowEl) {
        var tw = ease(seg(p, 0.3, 0.68));
        windowEl.style.opacity = String(tw);
        windowEl.style.transform = 'scale(' + (0.9 + tw * 0.1) + ') translateY(' + (1 - tw) * 26 + 'px)';
      }

      chips.forEach(function (el) {
        var i = parseFloat(el.dataset.chip) || 0;
        var t = ease(seg(p, 0.58 + i * 0.028, 0.72 + i * 0.028));
        el.style.opacity = String(t);
        el.style.transform = 'translateY(' + (1 - t) * 14 + 'px)';
      });

      if (before) {
        var tb = seg(p, 0.06, 0.3);
        before.style.opacity = String(1 - tb);
        before.style.transform = 'translateY(' + tb * -18 + 'px)';
      }

      if (after) {
        var ta = ease(seg(p, 0.34, 0.6));
        after.style.opacity = String(ta);
        after.style.transform = 'translateY(' + (1 - ta) * 18 + 'px)';
      }
    }

    function schedule() {
      if (frame) return;
      frame = window.requestAnimationFrame(function () {
        frame = null;
        tick();
      });
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    tick();
  }

  /* ------------------------------------------------------------------------
     Customers / Products / Inventory tabs.
     ------------------------------------------------------------------------ */
  function initTabs() {
    var list = document.querySelector('[role="tablist"]');
    if (!list) return;

    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;

    function select(tab, focus) {
      tabs.forEach(function (item) {
        var selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        var panel = document.getElementById(item.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      });
      if (focus) tab.focus();
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () { select(tab, false); });
    });

    list.addEventListener('keydown', function (event) {
      var current = tabs.indexOf(document.activeElement);
      if (current === -1) return;

      var next = null;
      if (event.key === 'ArrowRight') next = (current + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      if (next === null) return;

      event.preventDefault();
      select(tabs[next], true);
    });
  }

  /* ------------------------------------------------------------------------
     Business categories — the picker drives the configured-for panel.
     ------------------------------------------------------------------------ */
  var CATEGORIES = [
    {
      name: 'Food & Beverages',
      img: 'assets/products/burger.png',
      product: 'Signature Cheeseburger',
      price: 'Rs. 1,450',
      variant: 'Regular · Large · Add cheese',
      note: 'Prep time, daily menu limits and same-day delivery windows.',
      stock: 'Kitchen limit · 40 / day',
      order: '2 × Cheeseburger · Colombo 05'
    },
    {
      name: 'Fashion & Apparel',
      img: 'assets/products/hoodie.png',
      product: 'Heavyweight Hoodie',
      price: 'Rs. 6,900',
      variant: 'S · M · L · XL · XXL',
      note: 'Stock tracked per size and colour, with exchange history.',
      stock: 'XL · 4 left',
      order: '1 × Hoodie XL · Nugegoda'
    },
    {
      name: 'Beauty & Health',
      img: 'assets/products/facial-oil.png',
      product: 'Facial Oil 30ml',
      price: 'Rs. 4,250',
      variant: '30ml · 50ml · Refill',
      note: 'Batch numbers, expiry dates and repeat-purchase reminders.',
      stock: 'Batch B-24 · 18 left',
      order: '1 × Facial Oil · Dehiwala'
    },
    {
      name: 'Electronics',
      img: 'assets/products/headphones.png',
      product: 'Studio Headphones',
      price: 'Rs. 18,900',
      variant: 'Black · Warranty 12 mo',
      note: 'Serial numbers, warranty records and high-value COD checks.',
      stock: 'In stock · 7',
      order: '1 × Headphones · Kandy'
    },
    {
      name: 'Home & Lifestyle',
      img: 'assets/products/table-lamp.png',
      product: 'Oak Table Lamp',
      price: 'Rs. 9,400',
      variant: 'Oak · Walnut',
      note: 'Bulky and fragile parcels, with courier handling notes.',
      stock: 'Oak · 3 left',
      order: '1 × Table Lamp · Galle'
    },
    {
      name: 'General Retail',
      img: 'assets/products/gift-bag.png',
      product: 'Gift Bag (Medium)',
      price: 'Rs. 780',
      variant: 'S · M · L · Bundle of 10',
      note: 'Bundles, bulk pricing and one-tap reorder for regulars.',
      stock: 'Medium · 120',
      order: '10 × Gift Bag · Wattala'
    }
  ];

  function initCategories() {
    var list = document.getElementById('cat-list');
    var detail = document.getElementById('cat-detail');
    if (!list || !detail) return;

    var buttons = Array.prototype.slice.call(list.querySelectorAll('[data-cat]'));
    var fields = {};
    Array.prototype.forEach.call(detail.querySelectorAll('[data-field]'), function (el) {
      fields[el.dataset.field] = el;
    });

    var current = -1;

    function pick(index) {
      var category = CATEGORIES[index];
      if (!category || index === current) return;
      current = index;

      buttons.forEach(function (button) {
        button.setAttribute('aria-pressed', String(Number(button.dataset.cat) === index));
      });

      if (fields.name) fields.name.textContent = category.name;
      if (fields.img) {
        fields.img.src = category.img;
        fields.img.alt = category.product;
      }
      if (fields.product) fields.product.textContent = category.product;
      if (fields.variant) fields.variant.textContent = category.variant;
      if (fields.price) fields.price.textContent = category.price;
      if (fields.stock) fields.stock.textContent = category.stock;
      if (fields.order) fields.order.textContent = category.order;
      if (fields.note) fields.note.textContent = category.note;
    }

    buttons.forEach(function (button) {
      var index = Number(button.dataset.cat);
      button.addEventListener('click', function () { pick(index); });
      button.addEventListener('mouseenter', function () { pick(index); });
      button.addEventListener('focus', function () { pick(index); });
    });

    pick(0);
  }

  /* ---------------------------------------------------------------------- */
  function init() {
    initHeroVideo();
    initNav();
    initReveals();
    initScene();
    initTabs();
    initCategories();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
