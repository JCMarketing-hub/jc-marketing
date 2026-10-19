import site from '../../site.config.js';
import { initNav, initHeaderScroll } from './nav.js';
import { validateForm, showStatus } from './form-utils.js';

initNav();
initHeaderScroll();
initContactForm();
initServiceLinks();

/** Botões dos serviços já selecionam o serviço correspondente no formulário. */
function initServiceLinks() {
  const select = document.querySelector('#cf-servico');
  if (!select) return;
  document.querySelectorAll('[data-servico]').forEach((link) => {
    link.addEventListener('click', () => {
      select.value = link.dataset.servico;
    });
  });
}

/**
 * O formulário não envia dados para servidor algum: ele monta a mensagem e abre
 * o canal real configurado em site.config.js (WhatsApp ou e-mail). Sem canal
 * configurado, o envio fica desabilitado e o visitante é avisado.
 */
function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const submit = form.querySelector('[data-form-submit]');
  const note = form.querySelector('[data-form-note]');
  const status = form.querySelector('[data-form-status]');
  const whatsapp = site.contact.whatsapp.replace(/\D/g, '');
  const email = site.contact.email.trim();
  const channel = whatsapp ? 'whatsapp' : email ? 'email' : null;

  if (!channel) {
    submit.disabled = true;
    note.textContent =
      'O envio estará disponível assim que os canais de atendimento da JC Marketing forem configurados.';
    return;
  }

  submit.textContent = channel === 'whatsapp' ? 'Enviar pelo WhatsApp' : 'Enviar por e-mail';
  note.textContent =
    channel === 'whatsapp'
      ? 'O WhatsApp abre com a sua mensagem pronta. É só confirmar o envio.'
      : 'Ao enviar, seu aplicativo de e-mail será aberto com a mensagem pronta para você confirmar.';

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.replaceChildren();
    if (!validateForm(form)) return;

    const data = new FormData(form);
    const text = [
      `Olá, ${site.name}! Meu nome é ${data.get('nome')}.`,
      data.get('empresa') ? `Empresa: ${data.get('empresa')}` : null,
      `Preciso de: ${data.get('servico')}`,
      '',
      String(data.get('mensagem')),
    ]
      .filter((line) => line !== null)
      .join('\n');

    if (channel === 'whatsapp') {
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      showStatus(status, 'Abrimos o WhatsApp em uma nova aba.', 'Confirme o envio da mensagem por lá.');
    } else {
      const subject = `Contato pelo site — ${data.get('servico')}`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      showStatus(status, 'Abrimos seu aplicativo de e-mail.', 'Confirme o envio da mensagem por lá.');
    }
  });
}
