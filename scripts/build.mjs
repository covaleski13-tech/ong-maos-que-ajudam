// Build de produção: gera a pasta dist/ com arquivos minificados e imagens otimizadas.
// Uso: npm run build
import { build } from 'esbuild';
import { minify } from 'html-minifier-terser';
import { optimize } from 'svgo';
import sharp from 'sharp';
import { rm, mkdir, readFile, writeFile, readdir, copyFile, stat } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const DIST = 'dist';
const tamanhos = { antes: 0, depois: 0 };

async function registrar(origem, destino) {
  tamanhos.antes += (await stat(origem)).size;
  tamanhos.depois += (await stat(destino)).size;
}

async function limpar() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(join(DIST, 'html'), { recursive: true });
  await mkdir(join(DIST, 'imagens'), { recursive: true });
  await mkdir(join(DIST, 'fontes'), { recursive: true });
}

// JavaScript: une todos os módulos em um único arquivo minificado (menos requisições).
async function gerarJS() {
  await build({
    entryPoints: ['js/main.js'],
    bundle: true,
    minify: true,
    format: 'esm',
    target: ['es2020'],
    outfile: join(DIST, 'js/main.js'),
    legalComments: 'none'
  });
  const arquivos = (await readdir('js', { recursive: true })).filter((f) => f.endsWith('.js'));
  for (const f of arquivos) tamanhos.antes += (await stat(join('js', f))).size;
  tamanhos.depois += (await stat(join(DIST, 'js/main.js'))).size;
}

// CSS: minificado pelo esbuild; as fontes referenciadas são copiadas.
async function gerarCSS() {
  await build({
    entryPoints: ['css/style.css'],
    bundle: true,
    minify: true,
    outfile: join(DIST, 'css/style.css'),
    loader: { '.woff2': 'file' },
    assetNames: '../fontes/[name]'
  });
  await registrar('css/style.css', join(DIST, 'css/style.css'));
}

// HTML: remove espaços, comentários e atributos redundantes.
const opcoesHTML = {
  collapseWhitespace: true,
  conservativeCollapse: true,
  removeComments: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
  minifyCSS: true
};

async function gerarHTML() {
  const paginas = ['index.html', ...(await readdir('html')).map((f) => join('html', f))];
  for (const pagina of paginas) {
    const html = await readFile(pagina, 'utf8');
    await writeFile(join(DIST, pagina), await minify(html, opcoesHTML));
    await registrar(pagina, join(DIST, pagina));
  }
}

// Imagens: JPG e WebP recomprimidos com limite de 800px de largura; SVG otimizado com SVGO.
async function gerarImagens() {
  for (const arquivo of await readdir('imagens')) {
    const origem = join('imagens', arquivo);
    const destino = join(DIST, 'imagens', arquivo);
    const tipo = extname(arquivo).toLowerCase();
    const imagem = sharp(origem).resize({ width: 800, withoutEnlargement: true });

    if (tipo === '.jpg' || tipo === '.jpeg') await imagem.jpeg({ quality: 75, mozjpeg: true }).toFile(destino);
    else if (tipo === '.webp') await imagem.webp({ quality: 70, effort: 6 }).toFile(destino);
    else if (tipo === '.png') await imagem.png({ compressionLevel: 9, palette: true }).toFile(destino);
    else if (tipo === '.svg') {
      const { data } = optimize(await readFile(origem, 'utf8'), { multipass: true });
      await writeFile(destino, data);
    } else await copyFile(origem, destino);

    // Mantém o original se a recompressão não trouxer ganho.
    if ((await stat(destino)).size > (await stat(origem)).size) await copyFile(origem, destino);
    await registrar(origem, destino);
  }
}

async function copiarFontes() {
  for (const arquivo of await readdir('fontes')) {
    await copyFile(join('fontes', arquivo), join(DIST, 'fontes', basename(arquivo)));
  }
}

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

await limpar();
await Promise.all([gerarJS(), gerarCSS(), gerarHTML(), gerarImagens(), copiarFontes()]);
const economia = ((1 - tamanhos.depois / tamanhos.antes) * 100).toFixed(1);
console.log(`Build concluído em ${DIST}/: ${kb(tamanhos.antes)} → ${kb(tamanhos.depois)} (${economia}% menor)`);
