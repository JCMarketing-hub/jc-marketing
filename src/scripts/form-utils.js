/**
 * Valida campos obrigatórios nativamente e exibe mensagens acessíveis.
 * Retorna true quando o formulário está válido.
 */
export function validateForm(form) {
  let firstInvalid = null;
  form.querySelectorAll('input, select, textarea').forEach((field) => {
    const wrapper = field.closest('.field');
    wrapper?.querySelector('.error')?.remove();
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');

    if (!field.checkValidity()) {
      firstInvalid ??= field;
      field.setAttribute('aria-invalid', 'true');
      if (wrapper) {
        const error = document.createElement('p');
        error.className = 'error';
        error.id = `${field.id}-erro`;
        error.textContent = errorMessage(field);
        wrapper.append(error);
        field.setAttribute('aria-describedby', error.id);
      }
    }
  });
  firstInvalid?.focus();
  return !firstInvalid;
}

function errorMessage(field) {
  if (field.validity.valueMissing) {
    return field.tagName === 'SELECT' ? 'Selecione uma opção.' : 'Preencha este campo.';
  }
  if (field.validity.typeMismatch) return 'Verifique o formato informado.';
  if (field.validity.rangeUnderflow || field.validity.rangeOverflow) return 'Escolha uma data válida.';
  if (field.validity.patternMismatch) return 'Verifique o formato informado.';
  return 'Verifique este campo.';
}

/** Data de hoje no formato aceito por <input type="date">. */
export function todayIso() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

/** Exibe uma mensagem de status com título e texto, sem usar innerHTML com dados. */
export function showStatus(status, title, text) {
  status.replaceChildren();
  const strong = document.createElement('strong');
  strong.textContent = title;
  status.append(strong);
  if (text) {
    const p = document.createElement('p');
    p.textContent = text;
    status.append(p);
  }
}
