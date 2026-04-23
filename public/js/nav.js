/* ── Nav — hover dropdowns + blur overlay ───────────────── */
(function () {
  var nav      = document.getElementById('nav');
  var overlay  = document.getElementById('nav-overlay');
  var openId   = null;
  var closeTimer = null;

  function showOverlay() {
    if (overlay) overlay.classList.add('active');
    if (nav) nav.classList.add('dd-open');
  }
  function hideOverlay() {
    if (overlay) overlay.classList.remove('active');
    if (nav) nav.classList.remove('dd-open');
  }

  function openDD(id) {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    if (openId && openId !== id) closeDD(openId, true);

    var panel = document.getElementById('panel-' + id);
    var btn   = document.querySelector('#dd-' + id + ' .nav-dd-btn');
    if (!panel || !btn) return;
    panel.classList.add('open');
    btn.classList.add('open');
    openId = id;
    showOverlay();
  }

  function closeDD(id, immediate) {
    var panel = document.getElementById('panel-' + id);
    var btn   = document.querySelector('#dd-' + id + ' .nav-dd-btn');
    if (!panel || !btn) return;
    if (immediate) {
      panel.classList.remove('open');
      btn.classList.remove('open');
    } else {
      closeTimer = setTimeout(function () {
        panel.classList.remove('open');
        btn.classList.remove('open');
        if (openId === id) {
          openId = null;
          hideOverlay();
        }
        closeTimer = null;
      }, 150);
    }
  }

  function closeAll() {
    document.querySelectorAll('.nav-dd-panel').forEach(function (p) { p.classList.remove('open'); });
    document.querySelectorAll('.nav-dd-btn').forEach(function (b) { b.classList.remove('open'); });
    openId = null;
    hideOverlay();
  }

  /* Attach hover listeners to each nav-dd */
  document.querySelectorAll('.nav-dd').forEach(function (dd) {
    var id = dd.id.replace('dd-', '');
    dd.addEventListener('mouseenter', function () { openDD(id); });
    dd.addEventListener('mouseleave', function () { closeDD(id); });
  });

  /* Keep open when hovering the panel itself */
  document.querySelectorAll('.nav-dd-panel').forEach(function (panel) {
    panel.addEventListener('mouseenter', function () {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    });
  });

  /* Close on overlay click */
  if (overlay) {
    overlay.addEventListener('click', closeAll);
  }

  /* Close on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });

  /* ── Hamburger (mobile) ─────────────────────────────────── */
  var hamburger  = document.querySelector('.nav-hamburger');
  var mobileMenu = document.querySelector('.nav-mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });
    mobileMenu.querySelectorAll('.mob-link, .mob-sub-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 640) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
})();
