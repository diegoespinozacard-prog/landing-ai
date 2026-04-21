(function () {
  'use strict';

  /* ── Custom cursor — logo MultIA ── */
  var cur = document.createElement('img');
  cur.src = '/img/logoMultia.webp';
  cur.style.cssText = [
    'position:fixed',
    'width:36px',
    'height:36px',
    'object-fit:contain',
    'pointer-events:none',
    'z-index:99999',
    'transform:translate(-50%,-50%)',
    'will-change:transform',
    'filter:drop-shadow(0 0 6px rgba(245,166,35,0.7))',
    'transition:width .15s ease,height .15s ease',
    'display:none'
  ].join(';');
  document.body.appendChild(cur);

  var cx = -999, cy = -999;

  window.addEventListener('mousemove', function (e) {
    cx = e.clientX; cy = e.clientY;
    cur.style.display = 'block';
    cur.style.left = cx + 'px';
    cur.style.top  = cy + 'px';
  }, { passive: true });

  window.addEventListener('mouseleave', function () {
    cur.style.display = 'none';
  });

  /* slight scale on hover over interactive elements */
  var interactives = 'a,button,.feat-card,.ben-card,.pc-card,.btn,.btn-amber';
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(interactives)) {
      cur.style.width  = '44px';
      cur.style.height = '44px';
    }
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(interactives)) {
      cur.style.width  = '36px';
      cur.style.height = '36px';
    }
  });


  /* ── Neon spotlight — solo feat-card y ben-card ── */
  var SMALL_CARDS = '.feat-card,.ben-card';

  document.querySelectorAll(SMALL_CARDS).forEach(function (card) {
    var shine = document.createElement('span');
    shine.style.cssText = [
      'position:absolute',
      'inset:0',
      'border-radius:inherit',
      'pointer-events:none',
      'z-index:4',
      'opacity:0',
      'transition:opacity .25s ease'
    ].join(';');
    if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
    card.appendChild(shine);

    card.addEventListener('mousemove', function (e) {
      var r  = card.getBoundingClientRect();
      var mx = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      var my = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      shine.style.background =
        'radial-gradient(circle at ' + mx + '% ' + my + '%,' +
        'rgba(245,166,35,0.28) 0%,' +
        'rgba(245,166,35,0.10) 35%,' +
        'transparent 65%)';
      shine.style.opacity = '1';
      card.style.transform  = 'translateY(-3px)';
      card.style.boxShadow  =
        '0 8px 32px rgba(0,0,0,0.4),' +
        '0 0 0 1px rgba(245,166,35,0.3),' +
        '0 0 18px rgba(245,166,35,0.18),' +
        '0 0 40px rgba(245,166,35,0.08)';
      card.style.transition = 'transform .2s ease,box-shadow .2s ease';
    }, { passive: true });

    card.addEventListener('mouseleave', function () {
      shine.style.opacity  = '0';
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });

})();
