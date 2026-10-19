import { initNav } from './nav.js';
import { validateForm, todayIso, showStatus } from './form-utils.js';

initNav();
initDemoForms();
initDemoOrder();

/**
 * Formulários das páginas-conceito: validam os dados, mas deixam claro que nada
 * é enviado — são apenas demonstrações.
 */
function initDemoForms() {
  document.querySelectorAll('[data-demo-form]').forEach((form) => {
    const status = form.querySelector('[data-form-status]');
    form.querySelectorAll('input[type="date"]').forEach((input) => {
      input.min = todayIso();
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      status.replaceChildren();
      if (!validateForm(form)) return;
      showStatus(
        status,
        'Demonstração: nenhuma solicitação foi enviada.',
        form.dataset.demoMessage || 'Este é um projeto-conceito fictício da JC Marketing.',
      );
    });
  });
}

/** Montagem de pedido demonstrativa da Burger House. */
function initDemoOrder() {
  const order = document.querySelector('[data-order]');
  if (!order) return;

  const items = new Map();
  const list = order.querySelector('[data-order-list]');
  const empty = order.querySelector('[data-order-empty]');
  const counters = document.querySelectorAll('[data-order-count]');
  const finish = order.querySelector('[data-order-finish]');
  const status = order.querySelector('[data-form-status]');
  const live = document.querySelector('[data-order-live]');

  const render = () => {
    list.replaceChildren();
    let total = 0;
    items.forEach((qty, name) => {
      total += qty;
      const li = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = name;
      const controls = document.createElement('span');
      controls.className = 'qty';
      const output = document.createElement('output');
      output.textContent = String(qty);
      controls.append(
        qtyButton('−', `Remover uma unidade de ${name}`, () => change(name, -1)),
        output,
        qtyButton('+', `Adicionar uma unidade de ${name}`, () => change(name, 1)),
      );
      li.append(label, controls);
      list.append(li);
    });
    empty.hidden = total > 0;
    finish.disabled = total === 0;
    counters.forEach((el) => {
      el.textContent = String(total);
    });
    status.replaceChildren();
  };

  const change = (name, delta) => {
    const next = (items.get(name) || 0) + delta;
    if (next <= 0) items.delete(name);
    else items.set(name, next);
    render();
    live.textContent = next <= 0 ? `${name} removido do pedido.` : `${name}: ${next} no pedido.`;
  };

  document.querySelectorAll('[data-add-item]').forEach((button) => {
    button.addEventListener('click', () => change(button.dataset.addItem, 1));
  });

  finish.addEventListener('click', () => {
    showStatus(
      status,
      'Demonstração: nenhum pedido foi enviado.',
      'A Burger House é um projeto-conceito fictício. Em um site real, este botão enviaria o pedido ao WhatsApp ou ao sistema do restaurante.',
    );
  });

  render();
}

function qtyButton(text, label, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.setAttribute('aria-label', label);
  button.addEventListener('click', onClick);
  return button;
}
