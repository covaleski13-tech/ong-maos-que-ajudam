// Feedback ao usuário: notificações toast não obstrutivas.
let temporizador;

export function mostrarToast(mensagem, tipo = 'sucesso', duracao = 5000) {
  const toast = document.getElementById('toast');
  const texto = document.getElementById('toast-texto');
  texto.innerHTML = mensagem;
  toast.classList.toggle('toast--erro', tipo === 'erro');
  if (toast.matches(':popover-open')) toast.hidePopover();
  toast.showPopover();
  clearTimeout(temporizador);
  temporizador = setTimeout(() => {
    if (toast.matches(':popover-open')) toast.hidePopover();
  }, duracao);
}
