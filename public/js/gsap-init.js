/* ══════════════════════════════════════════════════════════
   MultIA — GSAP Animation Engine
   Requires: gsap.min.js + ScrollTrigger.min.js loaded before this
══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* ─────────────────────────────────────────────────────────
     HERO entrance timeline (runs on page load)
  ───────────────────────────────────────────────────────── */
  var heroTl = gsap.timeline({ delay: 0.1 });
  heroTl
    .from('.hv-eyebrow', {
      opacity: 0, y: 28, filter: 'blur(6px)',
      duration: 0.75, ease: 'power3.out'
    })
    .from('.hv-title', {
      opacity: 0, y: 40, filter: 'blur(8px)',
      duration: 0.85, ease: 'power3.out'
    }, '-=0.45')
    .from('.hv-sub', {
      opacity: 0, y: 20,
      duration: 0.7, ease: 'power3.out'
    }, '-=0.5')
    .from('.hv-actions', {
      opacity: 0, y: 16,
      duration: 0.6, ease: 'power3.out'
    }, '-=0.45')
    .from('.hv-scroll-hint', {
      opacity: 0, duration: 0.5
    }, '-=0.2');

  /* ─────────────────────────────────────────────────────────
     Sell-strip float-in
  ───────────────────────────────────────────────────────── */
  ScrollTrigger.create({
    trigger: '#sell-strip',
    start: 'top 85%',
    once: true,
    onEnter: function () {
      gsap.from('#sell-strip .sell-logo-side', { opacity: 0, x: -40, duration: 0.7, ease: 'power3.out' });
      gsap.from('#sell-strip .sell-tagline',   { opacity: 0, y: 20,  duration: 0.7, ease: 'power3.out', delay: 0.12 });
      gsap.from('#sell-strip .sell-desc',      { opacity: 0, y: 20,  duration: 0.7, ease: 'power3.out', delay: 0.22 });
    }
  });

  /* ─────────────────────────────────────────────────────────
     Features — cards stagger
  ───────────────────────────────────────────────────────── */
  ScrollTrigger.create({
    trigger: '#features',
    start: 'top 78%',
    once: true,
    onEnter: function () {
      gsap.from('.feat-card', {
        opacity: 0, y: 36, scale: 0.95,
        stagger: 0.07, duration: 0.65,
        ease: 'back.out(1.3)'
      });
    }
  });

  /* ─────────────────────────────────────────────────────────
     Benefits — card stagger + GSAP counters
  ───────────────────────────────────────────────────────── */
  ScrollTrigger.create({
    trigger: '#benefits',
    start: 'top 78%',
    once: true,
    onEnter: function () {
      gsap.from('.ben-card', {
        opacity: 0, y: 40, scale: 0.93,
        stagger: { each: 0.1, from: 'start' },
        duration: 0.7, ease: 'back.out(1.2)'
      });

      /* Animated counters for benefit stats */
      document.querySelectorAll('[data-count]').forEach(function (el) {
        var raw   = el.getAttribute('data-count') || '';
        var num   = parseFloat(raw.replace(/[^0-9.]/g, ''));
        var prefix = raw.match(/^[^0-9]*/)[0];
        var suffix = raw.match(/[^0-9]*$/)[0];
        if (isNaN(num)) return;
        var obj = { val: 0 };
        gsap.to(obj, {
          val: num,
          duration: 1.8,
          delay: 0.3,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = prefix + (Number.isInteger(num) ? Math.round(obj.val) : obj.val.toFixed(1)) + suffix;
          }
        });
      });
    }
  });

  /* ─────────────────────────────────────────────────────────
     Profiles — stagger
  ───────────────────────────────────────────────────────── */
  ScrollTrigger.create({
    trigger: '#profiles',
    start: 'top 78%',
    once: true,
    onEnter: function () {
      gsap.from('.prof-card', {
        opacity: 0, y: 32, scale: 0.95,
        stagger: 0.1, duration: 0.65,
        ease: 'back.out(1.2)'
      });
    }
  });

  /* ─────────────────────────────────────────────────────────
     Pricing — stagger
  ───────────────────────────────────────────────────────── */
  ScrollTrigger.create({
    trigger: '#pricing',
    start: 'top 78%',
    once: true,
    onEnter: function () {
      gsap.from('.pricing-card', {
        opacity: 0, y: 36, scale: 0.95,
        stagger: 0.12, duration: 0.7,
        ease: 'back.out(1.2)'
      });
    }
  });

  /* ─────────────────────────────────────────────────────────
     WORLD-REAL section header
  ───────────────────────────────────────────────────────── */
  ScrollTrigger.create({
    trigger: '#world-real .sec-header',
    start: 'top 82%',
    once: true,
    onEnter: function () {
      gsap.from('#world-real .sec-header', {
        opacity: 0, y: 30,
        duration: 0.7, ease: 'power3.out'
      });
    }
  });

  /* ─────────────────────────────────────────────────────────
     CARD 1: Motor — columns + infinity fade-in
  ───────────────────────────────────────────────────────── */
  ScrollTrigger.create({
    trigger: '.wr-motor-layout',
    start: 'top 80%',
    once: true,
    onEnter: function () {
      var tl = gsap.timeline();
      tl.from('.gsap-motor-col', {
        opacity: 0, y: 32, filter: 'blur(4px)',
        stagger: 0.18, duration: 0.7,
        ease: 'power3.out'
      })
      .from('.gsap-motor-inf', {
        opacity: 0, scale: 0.3, rotation: -90,
        duration: 0.6, ease: 'back.out(2)'
      }, '-=0.5')
      .from('.wr-model-chip', {
        opacity: 0, x: -16, scale: 0.7,
        stagger: 0.08, duration: 0.4,
        ease: 'back.out(1.5)'
      }, '-=0.4');
    }
  });

  /* ─────────────────────────────────────────────────────────
     CARD 2: Fragmentación vs Solución
  ───────────────────────────────────────────────────────── */
  ScrollTrigger.create({
    trigger: '.wr-vs-layout',
    start: 'top 80%',
    once: true,
    onEnter: function () {
      var tl = gsap.timeline();
      tl.from('.gsap-chaos-panel', {
        opacity: 0, x: -50,
        duration: 0.7, ease: 'power3.out'
      })
      .from('.gsap-chaos-node', {
        opacity: 0, scale: 0,
        stagger: { each: 0.07, from: 'random' },
        duration: 0.45, ease: 'back.out(2)'
      }, '-=0.4')
      .from('.gsap-vs-arrow', {
        opacity: 0, scale: 0,
        duration: 0.4, ease: 'back.out(1.5)'
      }, '-=0.2')
      .from('.gsap-hub-panel', {
        opacity: 0, x: 50,
        duration: 0.7, ease: 'power3.out'
      }, '-=0.3')
      .from('.gsap-hub-center', {
        opacity: 0, scale: 0,
        duration: 0.5, ease: 'back.out(2.5)'
      }, '-=0.4')
      .from('.gsap-hub-spoke', {
        opacity: 0, scale: 0,
        stagger: 0.09, duration: 0.4,
        ease: 'back.out(1.8)'
      }, '-=0.25');
    }
  });

  /* ─────────────────────────────────────────────────────────
     CARD 3: Stairs — grow up sequentially
  ───────────────────────────────────────────────────────── */
  ScrollTrigger.create({
    trigger: '.wr-stairs-layout',
    start: 'top 80%',
    once: true,
    onEnter: function () {
      var tl = gsap.timeline();
      document.querySelectorAll('.gsap-stair').forEach(function (el, i) {
        tl.from(el, {
          opacity: 0,
          clipPath: 'inset(100% 0 0 0)',
          duration: 0.65,
          ease: 'power3.out'
        }, i * 0.18);
      });
      tl.from('.gsap-stairs-footer', {
        opacity: 0, x: -30,
        duration: 0.6, ease: 'power3.out'
      }, '-=0.2');
    }
  });

  /* ─────────────────────────────────────────────────────────
     CARD 4: Zero Trust Vault — assembly animation
  ───────────────────────────────────────────────────────── */
  ScrollTrigger.create({
    trigger: '.wr-vault-layout',
    start: 'top 80%',
    once: true,
    onEnter: function () {
      var tl = gsap.timeline();
      tl.from('.gsap-vault-center', {
        opacity: 0, scale: 0.75,
        duration: 0.7, ease: 'back.out(1.5)'
      })
      .from('.gsap-beam', {
        scaleY: 0, transformOrigin: 'top',
        duration: 0.4, ease: 'power2.out'
      }, '-=0.2')
      .from('.gsap-vault-models .wr-vault-cloud', {
        opacity: 0, x: 20,
        stagger: 0.1, duration: 0.4,
        ease: 'power3.out'
      }, '-=0.1')
      .from('.gsap-vault-badges .wr-vault-badge', {
        opacity: 0, y: 12,
        stagger: 0.1, duration: 0.4,
        ease: 'power3.out'
      }, '-=0.3')
      /* corner boxes fly in from edges */
      .from('.wr-vault-col:first-child .gsap-vault-box', {
        opacity: 0, x: -40,
        stagger: 0.12, duration: 0.6,
        ease: 'power3.out'
      }, 0.05)
      .from('.wr-vault-col:last-child .gsap-vault-box', {
        opacity: 0, x: 40,
        stagger: 0.12, duration: 0.6,
        ease: 'power3.out'
      }, 0.05);
    }
  });

  /* ─────────────────────────────────────────────────────────
     Floating / pulse micro-animations (ambient, non-scroll)
  ───────────────────────────────────────────────────────── */
  gsap.to('.wr-vault-glow', {
    opacity: 0.4, scale: 1.15,
    duration: 2.5, repeat: -1, yoyo: true,
    ease: 'sine.inOut'
  });

  gsap.to('.wr-inf-char', {
    textShadow: '0 0 40px rgba(245,166,35,0.7)',
    opacity: 1,
    duration: 1.8, repeat: -1, yoyo: true,
    ease: 'sine.inOut'
  });

  /* Hub center pulse */
  gsap.to('.wr-hub-center', {
    boxShadow: '0 0 0 8px rgba(245,166,35,0.12), 0 0 40px rgba(245,166,35,0.2)',
    duration: 1.6, repeat: -1, yoyo: true,
    ease: 'sine.inOut'
  });

  /* Vault dial slow spin */
  gsap.to('.wr-vault-dial', {
    rotation: 360,
    duration: 8, repeat: -1,
    ease: 'none',
    transformOrigin: 'center center'
  });

  /* Stair KPI number pulse on hover — handled via CSS, no need */

  /* ─────────────────────────────────────────────────────────
     Parallax: feature section background glow
  ───────────────────────────────────────────────────────── */
  gsap.to('#features::before', {
    scrollTrigger: {
      trigger: '#features',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2
    },
    y: -60, ease: 'none'
  });

  /* ─────────────────────────────────────────────────────────
     Footer fade-in
  ───────────────────────────────────────────────────────── */
  ScrollTrigger.create({
    trigger: 'footer',
    start: 'top 88%',
    once: true,
    onEnter: function () {
      gsap.from('footer', {
        opacity: 0, y: 20,
        duration: 0.8, ease: 'power3.out'
      });
    }
  });

})();
