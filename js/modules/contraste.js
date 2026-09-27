// Modo de alto contraste: respeita a preferência do sistema (prefers-contrast)
// e a escolha do usuário, que fica salva no localStorage.
const CHAVE = 'ong:alto-contraste';

function aplicar(ativo) {
  document.documentElement.dataset.contraste = ativo ? 'alto' : 'padrao';
  const botao = document.getElementById('botao-contraste');
  botao?.setAttribute('aria-pressed', String(ativo));
}

export function iniciarContraste() {
  const salvo = localStorage.getItem(CHAVE);
  const preferenciaSistema = window.matchMedia('(prefers-contrast: more)').matches;
  aplicar(salvo !== null ? salvo === 'true' : preferenciaSistema);

  document.getElementById('botao-contraste')?.addEventListener('click', () => {
    const ativo = document.documentElement.dataset.contraste !== 'alto';
    aplicar(ativo);
    localStorage.setItem(CHAVE, String(ativo));
  });
}
