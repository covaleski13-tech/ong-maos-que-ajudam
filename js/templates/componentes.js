// Templates reutilizáveis: funções que recebem dados e devolvem HTML.

// Evita injeção de HTML ao exibir dados digitados pelo usuário.
export function escaparHTML(texto) {
  const mapa = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(texto).replace(/[&<>"']/g, (c) => mapa[c]);
}

export const badge = ({ tipo, rotulo }) =>
  `<span class="badge badge--${tipo}">${escaparHTML(rotulo)}</span>`;

export const imagem = ({ imagem, alt, legenda }) => `
  <figure>
    <picture>
      <source srcset="imagens/${imagem}.webp" type="image/webp">
      <img src="imagens/${imagem}.jpg" alt="${escaparHTML(alt)}" width="800" height="450" loading="lazy">
    </picture>
    <figcaption>${escaparHTML(legenda)}</figcaption>
  </figure>`;

export const cardProjeto = (projeto) => `
  <article class="col-12 col-md-6 col-lg-4" id="${projeto.id}">
    <div class="card">
      ${imagem(projeto)}
      <div class="card__conteudo">
        <div class="card__badges">${badge(projeto.categoria)}${badge(projeto.status)}</div>
        <h3>${escaparHTML(projeto.titulo)}</h3>
        <p>${escaparHTML(projeto.descricao)}</p>
        <a class="btn btn--primario" href="#/cadastro">Quero participar</a>
      </div>
    </div>
  </article>`;

export const botaoFiltro = ({ tipo, rotulo }, ativo) =>
  `<button class="btn btn--contorno filtro__botao" type="button" data-filtro="${tipo}" aria-pressed="${ativo}">${escaparHTML(rotulo)}</button>`;

export const itemSubmenu = (projeto) =>
  `<li><a class="submenu__link" href="#/projetos/${projeto.id}">${escaparHTML(projeto.titulo)}</a></li>`;

export const alerta = (tipo, titulo, conteudo) => `
  <div class="alerta alerta--${tipo}" role="${tipo === 'erro' ? 'alert' : 'status'}">
    <div><span class="alerta__titulo">${escaparHTML(titulo)}</span>${conteudo}</div>
  </div>`;

export const itemVoluntario = (v) => `
  <li class="voluntario">
    <div>
      <strong>${escaparHTML(v.nome)}</strong>
      <span class="voluntario__detalhe">${escaparHTML(v.cidade)}/${escaparHTML(v.estado)} · CPF ${escaparHTML(v.cpfMascarado)}</span>
    </div>
    <span class="badge badge--${v.interesse === 'doacao' ? 'alimentacao' : 'educacao'}">${v.interesse === 'doacao' ? 'Doação' : 'Voluntariado'}</span>
    <button class="btn btn--contorno btn--pequeno" type="button" data-remover="${escaparHTML(v.id)}" aria-label="Remover ${escaparHTML(v.nome)}">Remover</button>
  </li>`;

export const listaVazia = () =>
  `<p class="lista-vazia">Nenhum voluntário cadastrado ainda. Seja o primeiro!</p>`;

export const paginaNaoEncontrada = () => `
  <section class="secao">
    <div class="container">
      <h1>Página não encontrada</h1>
      <p>O endereço acessado não existe. Use o menu ou volte para o início.</p>
      <a class="btn btn--primario" href="#/inicio">Ir para o início</a>
    </div>
  </section>`;
