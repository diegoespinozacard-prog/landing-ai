/* ── Scroll Story — twin.so style chat accumulation ──────── */
(function () {
  const TOTAL   = 5;
  let current   = 0;
  let animating = false;
  let isMobile  = window.matchMedia('(max-width: 640px)').matches;

  var storyEl = document.getElementById('scroll-story');

  /* ── Helpers: seg class management ─────────────────────── */
  function segsOut(step) {
    step.querySelectorAll('.step-seg-l,.step-seg-r,.step-seg-b').forEach(function (s) {
      s.classList.remove('seg-in');
      s.classList.add('seg-out');
    });
  }
  function segsIn(step) {
    var segs = step.querySelectorAll('.step-seg-l,.step-seg-r,.step-seg-b');
    segs.forEach(function (s, i) {
      s.classList.remove('seg-out');
      setTimeout(function () {
        s.classList.add('seg-in');
      }, i * 70);
    });
  }

  /* ── Core: change step ─────────────────────────────────── */
  function goStep(n) {
    if (n === current || animating) return;
    animating = true;

    var steps = document.querySelectorAll('.ss-step');
    var dir   = n > current ? 1 : -1;

    /* Exit current */
    segsOut(steps[current]);
    steps[current].classList.remove('active');
    var exitIdx = current;
    setTimeout(function () {
      steps[exitIdx].querySelectorAll('.step-seg-l,.step-seg-r,.step-seg-b').forEach(function (s) {
        s.classList.remove('seg-out');
      });
    }, 250);

    /* Enter new */
    steps[n].classList.add('active');
    segsIn(steps[n]);

    if (!isMobile) updateChat(n, dir);

    current = n;
    syncDots();
    setTimeout(function () { animating = false; }, 700);
  }

  /* ── Chat: accumulate messages twin.so style ──────────── */
  function updateChat(step, dir) {
    var msgs = document.querySelectorAll('.ss-chat-msg');

    if (dir > 0) {
      msgs.forEach(function (msg) {
        if (parseInt(msg.dataset.step) !== step) return;
        msg.style.opacity = '0';
        msg.style.transform = 'translateY(18px)';
        msg.classList.remove('msg-hidden');
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            msg.style.transition = 'opacity 0.38s ease-out, transform 0.46s cubic-bezier(0.16,1,0.3,1)';
            msg.style.opacity    = '1';
            msg.style.transform  = 'none';
            setTimeout(function () {
              msg.style.transition = '';
              msg.style.opacity    = '';
              msg.style.transform  = '';
            }, 520);
          });
        });
      });
    } else {
      msgs.forEach(function (msg) {
        if (parseInt(msg.dataset.step) <= step) return;
        msg.style.transition = 'opacity 0.18s ease-in, transform 0.2s cubic-bezier(0.55,0,1,1)';
        msg.style.opacity    = '0';
        msg.style.transform  = 'translateY(14px)';
        setTimeout(function () {
          msg.classList.add('msg-hidden');
          msg.style.transition = '';
          msg.style.opacity    = '';
          msg.style.transform  = '';
        }, 230);
      });
    }

    setTimeout(function () {
      var stream = document.getElementById('chat-stream');
      if (stream) stream.scrollTop = stream.scrollHeight;
    }, 90);
  }

  /* ── Sync navigation dots across all steps ─────────────── */
  function syncDots() {
    document.querySelectorAll('.ss-dots').forEach(function (row) {
      row.querySelectorAll('.ss-dot').forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    });
  }

  /* ── Desktop: scroll-driven ────────────────────────────── */
  var scrollBound = false;

  function enableScrollDriver() {
    if (scrollBound) return;
    scrollBound = true;
    window.addEventListener('scroll', onStoryScroll, { passive: true });
  }
  function disableScrollDriver() {
    window.removeEventListener('scroll', onStoryScroll);
    scrollBound = false;
  }

  function onStoryScroll() {
    if (!storyEl) return;
    var rect     = storyEl.getBoundingClientRect();
    var total    = storyEl.offsetHeight - window.innerHeight;
    var scrolled = -rect.top;
    if (scrolled < 0 || scrolled > total) return;
    var target = Math.min(Math.floor((scrolled / total) * TOTAL), TOTAL - 1);
    if (target !== current) goStep(target);
  }

  /* ── Mobile: swipe ─────────────────────────────────────── */
  var touchStartX = 0;

  function enableMobile() {
    var left = document.querySelector('.ss-left');
    if (!left) return;
    left.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    left.addEventListener('touchend', function (e) {
      var delta = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(delta) < 50) return;
      if (delta > 0 && current < TOTAL - 1) goStep(current + 1);
      if (delta < 0 && current > 0)         goStep(current - 1);
    }, { passive: true });
  }

  /* ── matchMedia ─────────────────────────────────────────── */
  var mq = window.matchMedia('(max-width: 640px)');
  function onMQ(e) {
    isMobile = e.matches;
    if (isMobile) { disableScrollDriver(); goStep(0); }
    else          { enableScrollDriver(); }
  }
  mq.addEventListener('change', onMQ);

  /* ── Init: mostrar step 0 de inmediato ─────────────────── */
  (function () {
    var first = document.querySelector('.ss-step.active');
    if (first) segsIn(first);
  })();

  if (isMobile) { enableMobile(); }
  else          { enableScrollDriver(); }

  window.goStep = goStep;
})();
