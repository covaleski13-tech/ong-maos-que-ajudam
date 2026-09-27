// Feedback ao usuário: notificações toast não obstrutivas.
// Mensagens de erro ficam na tela até o usuário fechar; as de sucesso somem
// após 8 segundos, mas o tempo pausa enquanto o mouse ou o foco estão no toast
// (WCAG 2.2.1 - Tempo ajustável).
const DURACAO_SUCESSO = 8000;
let temporizador;

const toast = () => document.getElementById('toast');

function agendarFechamento() {
  clearTimeout(temporizador);
  temporizador = setTimeout(() => {
    if (toast().matches(':popover-open')) toast().hidePopover();
  }, DURACAO_SUCESSO);
}

export function iniciarToast() {
  const elemento = toast();
  ['mouseenter', 'focusin'].forEach((ev) => elemento.addEventListener(ev, () => clearTimeout(temporizador)));
  ['mouseleave', 'focusout'].forEach((ev) =>
    elemento.addEventListener(ev, () => {
      if (!elemento.classList.contains('toast--erro')) agendarFechamento();
    })
  );
}

export function mostrarToast(mensagem, tipo = 'sucesso') {
  const elemento = toast();
  document.getElementById('toast-texto').innerHTML = mensagem;
  elemento.classList.toggle('toast--erro', tipo === 'erro');
  elemento.setAttribute('role', tipo === 'erro' ? 'alert' : 'status');
  if (elemento.matches(':popover-open')) elemento.hidePopover();
  elemento.showPopover();
  clearTimeout(temporizador);
  if (tipo !== 'erro') agendarFechamento();
}
