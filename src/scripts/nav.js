/** Menu responsivo acessível: alterna aria-expanded, fecha com Esc e ao navegar. */
export function initNav(root = document) {
  const toggle = root.querySelector('[data-nav-toggle]');
  const nav = root.querySelector('[data-nav]');
  if (!toggle || !nav) return;

  const label = toggle.querySelector('.visually-hidden');
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    if (label) label.textContent = open ? 'Fechar menu' : 'Abrir menu';
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', (mq) => {
    if (mq.matches) setOpen(false);
  });
}

/** Marca o cabeçalho quando a página rola, para exibir a borda inferior. */
export function initHeaderScroll(selector = '[data-header]') {
  const header = document.querySelector(selector);
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  update();
  window.addEventListener('scroll', update, { passive: true });
}
