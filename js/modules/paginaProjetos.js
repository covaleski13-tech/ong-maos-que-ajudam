import { projetos } from '../data/projetos.js';
import { cardProjeto, botaoFiltro } from '../templates/componentes.js';

export function iniciarProjetos(raiz) {
  const lista = raiz.querySelector('#lista-projetos');
  const filtro = raiz.querySelector('#filtro-projetos');

  const categorias = [
    { tipo: 'todos', rotulo: 'Todos' },
    ...new Map(projetos.map((p) => [p.categoria.tipo, p.categoria])).values()
  ];

  function renderizar(tipo = 'todos') {
    const visiveis = tipo === 'todos' ? projetos : projetos.filter((p) => p.categoria.tipo === tipo);
    lista.innerHTML = visiveis.map(cardProjeto).join('');
    filtro.innerHTML = categorias.map((c) => botaoFiltro(c, c.tipo === tipo)).join('');
  }

  // Delegação de eventos: um único ouvinte para todos os botões de filtro.
  filtro.addEventListener('click', (evento) => {
    const botao = evento.target.closest('[data-filtro]');
    if (botao) renderizar(botao.dataset.filtro);
  });

  renderizar();
}
