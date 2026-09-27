// Roteador da SPA: navegação por hash (#/rota) sem recarregar a página.
import { iniciarInicio } from './modules/paginaInicio.js';
import { iniciarProjetos } from './modules/paginaProjetos.js';
import { iniciarCadastro } from './modules/paginaCadastro.js';
import { paginaNaoEncontrada } from './templates/componentes.js';

const rotas = {
  '/inicio':   { arquivo: 'html/inicio.html',   titulo: 'Início',           iniciar: iniciarInicio },
  '/projetos': { arquivo: 'html/projetos.html', titulo: 'Projetos Sociais', iniciar: iniciarProjetos },
  '/cadastro': { arquivo: 'html/cadastro.html', titulo: 'Cadastro',         iniciar: iniciarCadastro }
};

const app = document.getElementById('app');
const cache = new Map();
let primeiraCarga = true;

// Busca o fragmento HTML uma única vez e reaproveita nas próximas visitas.
async function carregarFragmento(arquivo) {
  if (!cache.has(arquivo)) {
    const resposta = await fetch(arquivo);
    if (!resposta.ok) throw new Error(`Falha ao carregar ${arquivo} (${resposta.status})`);
    cache.set(arquivo, await resposta.text());
  }
  return cache.get(arquivo);
}

// "#/projetos/cesta-solidaria" → { caminho: "/projetos", ancora: "cesta-solidaria" }
function lerHash() {
  const [, pagina = 'inicio', ancora] = location.hash.split('/');
  return { caminho: `/${pagina}`, ancora };
}

function atualizarMenu(caminho) {
  document.querySelectorAll('[data-rota]').forEach((link) => {
    if (link.dataset.rota === caminho) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  const menu = document.getElementById('menu-principal');
  if (menu.matches(':popover-open')) menu.hidePopover();
}

async function renderizar() {
  // Hashes sem "/" (ex.: #app, #cpf) são âncoras internas, não rotas.
  if (location.hash && !location.hash.startsWith('#/')) return;
  const { caminho, ancora } = lerHash();
  const rota = rotas[caminho];

  try {
    if (!rota) throw new Error('rota-inexistente');
    app.innerHTML = await carregarFragmento(rota.arquivo);
    rota.iniciar?.(app);
    document.title = `${rota.titulo} | ONG Mãos que Ajudam`;
  } catch (erro) {
    if (erro.message !== 'rota-inexistente') console.error(erro);
    app.innerHTML = paginaNaoEncontrada();
    document.title = 'Página não encontrada | ONG Mãos que Ajudam';
  }

  atualizarMenu(caminho);

  // Leva o usuário ao início do novo conteúdo e move o foco para o título,
  // para que leitores de tela anunciem a troca de página.
  const destino = ancora ? document.getElementById(ancora) : null;
  const titulo = (destino ?? app).querySelector('h1, h2, h3');
  if (destino) destino.scrollIntoView();
  else window.scrollTo(0, 0);
  if (!primeiraCarga && titulo) {
    titulo.tabIndex = -1;
    titulo.focus({ preventScroll: true });
  }
  primeiraCarga = false;
}

// Links para âncoras da própria página (pular conteúdo, resumo de erros)
// não podem alterar o hash, senão o roteador perderia a rota atual.
function tratarAncorasInternas(evento) {
  const link = evento.target.closest('a[href^="#"]');
  if (!link || link.getAttribute('href').startsWith('#/')) return;
  const alvo = document.getElementById(link.getAttribute('href').slice(1));
  if (!alvo) return;
  evento.preventDefault();
  if (!alvo.matches('a, button, input, select, textarea, [tabindex]')) alvo.tabIndex = -1;
  alvo.focus();
  alvo.scrollIntoView({ block: 'center' });
}

export function iniciarRoteador() {
  document.addEventListener('click', tratarAncorasInternas);
  window.addEventListener('hashchange', renderizar);
  if (!location.hash) history.replaceState(null, '', '#/inicio');
  renderizar();
}
