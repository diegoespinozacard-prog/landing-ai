/* ── Payment modal ─────────────────────────────────────── */
(function () {
  const overlay = document.getElementById('modal');
  if (!overlay) return;

  function openModal() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    // Reset form state for next open
    setTimeout(function() {
      var form = document.getElementById('lead-form-state');
      var success = document.getElementById('lead-success-state');
      var err = document.getElementById('lead-error');
      var btn = document.getElementById('lead-submit-btn');
      if (form) form.style.display = '';
      if (success) success.style.display = 'none';
      if (err) { err.style.display = 'none'; err.textContent = ''; }
      if (btn) { btn.disabled = false; btn.textContent = 'Solicitar acceso →'; }
      overlay.querySelectorAll('.pay-field').forEach(function(f){ f.value = ''; });
    }, 300);
  }

  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Expose globally
  window.openModal  = openModal;
  window.closeModal = closeModal;
})();
