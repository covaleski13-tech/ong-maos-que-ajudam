// Ponto de entrada da aplicação.
import { iniciarRoteador } from './router.js';
import { projetos } from './data/projetos.js';
import { itemSubmenu } from './templates/componentes.js';
import { mostrarToast, iniciarToast } from './modules/feedback.js';
import { iniciarModais } from './modules/modal.js';
import { iniciarContraste } from './modules/contraste.js';
import { registrarSimulador } from './modules/simulador.js';

// Registra o componente Alpine antes de o framework iniciar.
registrarSimulador();

// Submenu "Projetos" gerado a partir dos mesmos dados dos cards.
document.getElementById('submenu-projetos').innerHTML = projetos.map(itemSubmenu).join('');

// Botão "Copiar chave" do modal de doação.
document.addEventListener('click', async (evento) => {
  const botao = evento.target.closest('[data-copiar]');
  if (!botao) return;
  const texto = document.getElementById(botao.dataset.copiar).textContent;
  try {
    await navigator.clipboard.writeText(texto);
    mostrarToast('Chave PIX copiada.');
  } catch {
    mostrarToast('Não foi possível copiar. Selecione a chave manualmente.', 'erro');
  }
});

iniciarContraste();
iniciarModais();
iniciarToast();
iniciarRoteador();
