# ONG Mãos que Ajudam — Plataforma Web

Plataforma web para uma organização do terceiro setor divulgar seus projetos sociais, captar doações e cadastrar voluntários. Desenvolvida como projeto prático da disciplina **Desenvolvimento Front-end para Web** (Ciência da Computação).

**Site publicado:** https://covaleski13-tech.github.io/ong-maos-que-ajudam/

\---

## Funcionalidades

* **Single Page Application (SPA)** com navegação por hash, sem recarregar a página, e suporte ao botão "voltar" do navegador.
* **Projetos gerados por templates JavaScript** a partir de um arquivo de dados, com filtro por categoria.
* **Cadastro de voluntários** com máscaras de CPF, telefone e CEP, validação dos dígitos do CPF, bloqueio de CPF duplicado e idade mínima de 16 anos.
* **Preenchimento automático do endereço** pelo CEP, via API pública ViaCEP.
* **Persistência no `localStorage`:** lista de voluntários e rascunho automático do formulário.
* **Simulador de impacto da doação** construído com Alpine.js.
* **Interface responsiva e acessível**, seguindo as diretrizes WCAG 2.1 nível AA.

## Tecnologias

|Camada|Tecnologia|
|-|-|
|Estrutura|HTML5 semântico|
|Estilo|CSS3 com variáveis, Flexbox e Grid (metodologia BEM, mobile-first)|
|Comportamento|JavaScript (ES6 Modules, sem bundler)|
|Framework|Alpine.js 3 (via CDN, com SRI)|
|API externa|ViaCEP|
|Versionamento|Git e GitHub (GitFlow + Conventional Commits)|
|Hospedagem|GitHub Pages|
| Build | esbuild, html-minifier-terser, sharp e SVGO |

## Estrutura de pastas

```
ong-maos-que-ajudam/
├── index.html              # Ponto de entrada único da SPA
├── html/                   # Fragmentos de conteúdo carregados pelo roteador
│   ├── inicio.html
│   ├── projetos.html
│   └── cadastro.html
├── css/
│   └── style.css           # Design system, layout e componentes
├── imagens/                # Logotipo (SVG/PNG) e fotos (JPG/WebP)
├── fontes/                 # Atkinson Hyperlegible (hospedada localmente)
└── js/
    ├── main.js             # Inicialização da aplicação
    ├── router.js           # Rotas e renderização das páginas
    ├── data/               # Dados dos projetos
    ├── templates/          # Funções que geram componentes HTML
    └── modules/            # Validação, máscaras, armazenamento, CEP, feedback e páginas
```

## Como executar localmente

A aplicação usa módulos ES e `fetch`, que os navegadores bloqueiam ao abrir o arquivo diretamente (`file://`). É preciso servir a pasta por HTTP. Escolha uma das opções:

**Opção 1: VS Code**

1. Instale a extensão **Live Server**.
2. Abra a pasta do projeto, clique com o botão direito em `index.html` e escolha **Open with Live Server**.

**Opção 2: terminal (Node.js)**

```bash
git clone https://github.com/covaleski13-tech/ong-maos-que-ajudam.git
cd ong-maos-que-ajudam
npx serve .
```

**Opção 3: terminal (Python)**

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Como usar

|Rota|Conteúdo|
|-|-|
|`#/inicio`|Apresentação da ONG, missão, contato e total de voluntários|
|`#/projetos`|Projetos com filtro por categoria, formas de doação e simulador|
|`#/cadastro`|Formulário de voluntários e lista de cadastros salvos|

Os dados ficam salvos apenas no navegador utilizado. Para apagá-los, abra o console (F12) e execute `localStorage.clear()`.

## Build de produção

Pré-requisito: Node.js 20 ou superior.

```bash
npm install        # instala as ferramentas de build
npm run build      # gera a pasta dist/ otimizada
npm run preview    # serve a pasta dist/ em http://localhost:3000
```

O build une os módulos JavaScript em um único arquivo minificado, minifica o CSS e o HTML e recomprime as imagens. Resultado medido com o Lighthouse: performance de 88 para 100, requisições de 25 para 11 e peso total de 67,7 KB para 54,2 KB.

## Deploy

O site é publicado automaticamente no GitHub Pages pelo workflow `.github/workflows/deploy.yml` a cada push na branch `main`, ou seja, a cada nova release. O workflow instala as dependências, executa o build e publica a pasta `dist/`.

## Manutenção

**Adicionar um projeto:** inclua um objeto em `js/data/projetos.js`. O card, o submenu e o filtro são gerados automaticamente.

```js
{
  id: 'horta-comunitaria',
  titulo: 'Horta Comunitária',
  categoria: { tipo: 'alimentacao', rotulo: 'Alimentação' },
  status: { tipo: 'aberto', rotulo: 'Inscrições abertas' },
  imagem: 'horta',            // imagens/horta.jpg e imagens/horta.webp
  alt: 'Descrição da imagem para leitores de tela',
  legenda: 'Legenda exibida abaixo da foto.',
  descricao: 'Texto do card.'
}
```

**Adicionar uma página:** crie o fragmento em `html/`, registre a rota no objeto `rotas` de `js/router.js` e inclua o link no menu do `index.html`.

**Alterar cores, fontes ou espaçamentos:** edite as variáveis em `:root`, no início de `css/style.css`. Toda a interface é atualizada.

**Trocar o `localStorage` por uma API:** altere apenas `js/modules/armazenamento.js`. Os demais módulos não acessam o armazenamento diretamente.

## Acessibilidade

- Contraste mínimo de 4,5:1 em todos os textos e de 3:1 no indicador de foco, verificados pela fórmula da WCAG.
- Modo de alto contraste (preto, branco e amarelo, acima de 7:1), ativado pelo botão no cabeçalho ou automaticamente pela preferência `prefers-contrast` do sistema.
- Navegação completa por teclado, com foco visível e link "Pular para o conteúdo".
- Modal com `<dialog>` e `showModal()`: foco preso na janela, fechamento com Esc e retorno do foco ao botão de origem.
- Notificações de erro permanecem até serem fechadas; as de sucesso pausam enquanto recebem foco ou mouse.
- Foco movido para o título a cada troca de página, para que leitores de tela anunciem a navegação.
- Mensagens de erro associadas aos campos por `aria-describedby` e estado `aria-invalid`.
- Animações desativadas quando o sistema operacional solicita movimento reduzido.
- Fonte Atkinson Hyperlegible, desenvolvida para leitores com baixa visão.
- Auditoria com axe-core e Lighthouse (acessibilidade 100) nos modos padrão e alto contraste, complementada por testes manuais de teclado.

## Fluxo de contribuição

O projeto segue o **GitFlow**:

|Branch|Função|
|-|-|
|`main`|Versões publicadas em produção|
|`develop`|Integração das funcionalidades concluídas|
|`feature/\*`|Uma branch por funcionalidade, criada a partir de `develop`|
|`release/\*`|Preparação de uma nova versão antes de ir para `main`|
|`hotfix/\*`|Correções urgentes a partir de `main`|

Passos para contribuir:

1. Crie uma branch a partir de `develop`: `git checkout -b feature/nome-da-funcionalidade develop`
2. Faça commits no padrão **Conventional Commits**:

   * `feat:` nova funcionalidade
   * `fix:` correção de erro
   * `docs:` documentação
   * `style:` formatação, sem mudança de lógica
   * `refactor:` reorganização de código
   * `perf:` melhoria de performance
   * `chore:` configuração e tarefas de manutenção
3. Abra um pull request para `develop` descrevendo a mudança e aguarde a revisão.

## Autor

**Gustavo Covaleski** — Ciência da Computação

## Licença

Projeto acadêmico, distribuído sob a licença MIT. A fonte Atkinson Hyperlegible é distribuída sob a SIL Open Font License.

