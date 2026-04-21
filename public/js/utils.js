/* ══════════════════════════════════════════════════════════
   MultIA Animation Engine — reversible scroll animations
══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 1. Scroll progress bar ─────────────────────────── */
  var progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    if (!progressBar) return;
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH > 0) progressBar.style.transform = 'scaleX(' + (window.scrollY / docH) + ')';
  }

  /* ── 2. Directional reveals — reversible ─────────────── */
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      /* Toggle: add on enter, remove on exit → fully reversible */
      e.target.classList.toggle('on', e.isIntersecting);
    });
  }, { threshold: 0.12 });

  /* Observe standalone rv + hd-zoom elements (skip stagger-grid children) */
  document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-u,.hd-zoom').forEach(function (el) {
    if (!el.closest('.stagger-grid')) revealObs.observe(el);
  });

  /* ── 3. Word-by-word reveal — reversible ─────────────── */
  var wordObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      e.target.classList.toggle('word-revealed', e.isIntersecting);
    });
  }, { threshold: 0.2 });

  function countWords(node) {
    if (node.nodeType === 3) {
      return node.textContent.split(/\s+/).filter(function (w) { return w.length > 0; }).length;
    }
    var c = 0;
    node.childNodes.forEach(function (n) { c += countWords(n); });
    return c;
  }

  function wrapWords(node, ctr, total) {
    if (node.nodeType === 3) {
      var parts = node.textContent.split(/(\s+)/);
      var frag  = document.createDocumentFragment();
      parts.forEach(function (p) {
        if (!p.trim()) { frag.appendChild(document.createTextNode(p)); return; }
        var s = document.createElement('span');
        s.className  = 'word-span';
        s.style.cssText = '--wi:' + ctr.i + ';--wi-r:' + (total - 1 - ctr.i);
        ctr.i++;
        s.textContent = p;
        frag.appendChild(s);
      });
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === 1) {
      Array.from(node.childNodes).forEach(function (child) { wrapWords(child, ctr, total); });
    }
  }

  document.querySelectorAll('[data-word-reveal]').forEach(function (el) {
    var total = countWords(el);
    wrapWords(el, { i: 0 }, total);
    wordObs.observe(el);
  });

  /* ── 4. Counter animations — reversible, replays each time ── */
  var counterFrames = new WeakMap();

  var counterObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var prev = counterFrames.get(e.target);
      if (prev) cancelAnimationFrame(prev);

      if (e.isIntersecting) {
        runCounter(e.target);
      } else {
        counterFrames.delete(e.target);
        var rawFrom = e.target.dataset.countFrom || e.target.dataset.count || '';
        if (rawFrom) e.target.textContent = rawFrom;
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('[data-count]').forEach(function (el) {
    counterObs.observe(el);
  });

  function runCounter(el) {
    var rawTo   = el.dataset.count     || '';
    var rawFrom = el.dataset.countFrom || '';

    /* Parse "prefix + number + suffix" from a string like "x10", "+60%", "<120s" */
    function parse(str) {
      var m = str.match(/^([^0-9]*)([0-9]+(?:\.[0-9]*)?)([^0-9]*)$/);
      return m ? { prefix: m[1], num: parseFloat(m[2]), suffix: m[3] } : null;
    }

    var to   = parse(rawTo);
    var from = rawFrom ? parse(rawFrom) : null;
    if (!to) return;

    var fromNum   = from ? from.num : 0;
    var toNum     = to.num;
    var prefix    = to.prefix;
    var suffix    = to.suffix;
    var isFloat   = rawTo.indexOf('.') !== -1;
    var direction = toNum >= fromNum ? 1 : -1;
    var steps     = Math.abs(toNum - fromNum);
    /* ms per step: fast for big ranges, slower for small ones */
    var msPerStep = Math.max(8, Math.min(40, 700 / steps));
    var current   = fromNum;
    var lastTime  = null;

    el.textContent = prefix + (isFloat ? fromNum.toFixed(1) : fromNum) + suffix;

    function tick(now) {
      if (lastTime === null) lastTime = now;
      var elapsed = now - lastTime;
      if (elapsed >= msPerStep) {
        var advance = Math.floor(elapsed / msPerStep);
        lastTime    = now - (elapsed % msPerStep);
        current    += direction * advance;
        if (direction > 0 && current >= toNum) current = toNum;
        if (direction < 0 && current <= toNum) current = toNum;
        el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
      }
      if (current !== toNum) {
        counterFrames.set(el, requestAnimationFrame(tick));
      } else {
        el.textContent = rawTo;
        counterFrames.delete(el);
      }
    }
    counterFrames.set(el, requestAnimationFrame(tick));
  }

  /* ── 5. Gradient text reveals on scroll ─────────────── */
  var gradEls = Array.from(document.querySelectorAll('[data-grad-reveal]'));
  gradEls.forEach(function (el) {
    el.style.webkitBackgroundClip = 'text';
    el.style.backgroundClip       = 'text';
    el.style.webkitTextFillColor  = 'transparent';
    el.style.color                = 'transparent';
  });

  function updateGradReveal() {
    var winH = window.innerHeight;
    gradEls.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var pct  = Math.round(Math.min(1, Math.max(0, (winH * 0.88 - rect.top) / (winH * 0.45))) * 100);
      el.style.backgroundImage = 'linear-gradient(90deg,var(--amber) ' + pct + '%,var(--ink2) ' + pct + '%)';
    });
  }

  /* ── 6. Hero parallax ───────────────────────────────── */
  var heroEl        = document.getElementById('hero-video');
  var heroVideo     = heroEl && heroEl.querySelector('.hv-video-wrap');
  var heroScrollHint = heroEl && heroEl.querySelector('.hv-scroll-hint');

  function updateHero(scrollY) {
    if (!heroEl) return;
    var prog = Math.min(1, scrollY / heroEl.offsetHeight);
    if (heroVideo)     heroVideo.style.transform     = 'scale(' + (1 + prog * 0.05) + ')';
    if (heroScrollHint) heroScrollHint.style.opacity = String(Math.max(0, 1 - prog * 8));
  }

  /* ── 7. Stagger grids — reversible with stagger-in ───── */
  var staggerTimers = new WeakMap();

  var staggerObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var grid     = e.target;
      var children = Array.from(grid.querySelectorAll('.rv,.rv-l,.rv-r,.rv-u'));

      /* Clear any pending stagger timeouts */
      var prev = staggerTimers.get(grid);
      if (prev) { prev.forEach(clearTimeout); }

      if (e.isIntersecting) {
        /* Stagger in: left cards slide right, right cards slide left */
        var timers = children.map(function (child, i) {
          return setTimeout(function () { child.classList.add('on'); }, i * 70);
        });
        staggerTimers.set(grid, timers);
      } else {
        /* Instant out: reset all to hidden */
        children.forEach(function (child) { child.classList.remove('on'); });
        staggerTimers.set(grid, []);
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.stagger-grid').forEach(function (g) {
    staggerObs.observe(g);
  });

  /* ── 8. Card tilt ───────────────────────────────────── */
  document.querySelectorAll('.tilt-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width  - 0.5;
      var y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = 'perspective(600px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) scale(1.02)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  /* ── 9. Scroll driver ──────────────────────────────── */
  var navEl = document.getElementById('nav');

  function updateNav(scrollY) {}

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var scrollY = window.scrollY;
      updateProgress();
      updateNav(scrollY);
      updateHero(scrollY);
      if (gradEls.length) updateGradReveal();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── 10. Section sec-enter (reversible) ─────────────── */
  var sectionObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      e.target.classList.toggle('sec-visible', e.isIntersecting);
    });
  }, { threshold: 0.05 });
  document.querySelectorAll('.sec-enter').forEach(function (s) {
    sectionObs.observe(s);
  });

  /* ── 11. Dramatic section zoom — direction-aware ─────── */
  var sectionZoomObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var el = e.target;
      if (e.isIntersecting) {
        el.classList.remove('sz-above');
        el.classList.add('sz-in');
      } else {
        el.classList.remove('sz-in');
        if (e.boundingClientRect.top < 0) {
          /* Exited above — scale up and vanish */
          el.classList.add('sz-above');
        }
        /* Exited below — stays at default scale-down hidden state */
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.sec-zoom').forEach(function (s) {
    sectionZoomObs.observe(s);
  });


})();
