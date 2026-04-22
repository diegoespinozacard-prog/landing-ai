(function () {
  'use strict';

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
