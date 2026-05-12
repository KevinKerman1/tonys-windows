(() => {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('is-open'));
    });
    nav.querySelectorAll('.nav__links a').forEach(a =>
      a.addEventListener('click', () => nav.classList.remove('is-open'))
    );
  }

  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const params = new URLSearchParams(window.location.search);
  const presetService = params.get('service');
  if (presetService) {
    const select = document.querySelector('select[name="project_type"]');
    if (select) {
      const match = Array.from(select.options).find(o =>
        o.value.toLowerCase() === presetService.toLowerCase()
      );
      if (match) select.value = match.value;
    }
  }

  const form = document.querySelector('.form');
  if (form) {
    const formBody = form.querySelector('.form__body');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.querySelector('input[name="botcheck"]').value) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      const data = Object.fromEntries(new FormData(form).entries());
      const accessKey = form.dataset.accessKey;

      try {
        if (accessKey && accessKey !== 'REPLACE_WITH_WEB3FORMS_KEY') {
          const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              access_key: accessKey,
              subject: `New Quote Request from ${data.name || 'website'}`,
              ...data,
            }),
          });
          if (!res.ok) throw new Error('Network error');
        } else {
          await new Promise(r => setTimeout(r, 600));
          console.warn('Form submitted in demo mode — set data-access-key on the form to enable Web3Forms delivery.');
        }
        form.classList.add('is-submitted');
        window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        alert("Sorry — something went wrong. Please call (602) 908-9807 or email admin@baldncurlyglass.com.");
      }
    });
  }
})();
