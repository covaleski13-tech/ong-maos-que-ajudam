// Modal acessível com <dialog> e showModal(): o foco vai para dentro da janela,
// o restante da página fica inerte, Esc fecha e o foco volta ao botão de origem.
export function iniciarModais() {
  document.addEventListener('click', (evento) => {
    const abrir = evento.target.closest('[data-abrir-modal]');
    if (abrir) {
      document.getElementById(abrir.dataset.abrirModal)?.showModal();
      return;
    }
    const fechar = evento.target.closest('[data-fechar-modal]');
    if (fechar) fechar.closest('dialog')?.close();
  });

  // Clique no fundo escurecido (fora da caixa) também fecha.
  document.querySelectorAll('dialog.modal').forEach((dialogo) => {
    dialogo.addEventListener('click', (evento) => {
      if (evento.target === dialogo) dialogo.close();
    });
  });
}
