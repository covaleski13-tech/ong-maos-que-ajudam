// Camada de acesso ao localStorage: o resto do código não manipula chaves diretamente.
const CHAVE_VOLUNTARIOS = 'ong:voluntarios';
const CHAVE_RASCUNHO = 'ong:rascunho-cadastro';

function ler(chave, padrao) {
  try {
    const valor = localStorage.getItem(chave);
    return valor ? JSON.parse(valor) : padrao;
  } catch (erro) {
    console.warn(`Dados corrompidos em "${chave}". Usando valor padrão.`, erro);
    return padrao;
  }
}

function gravar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch (erro) {
    console.error(`Não foi possível salvar "${chave}".`, erro);
    return false;
  }
}

const gerarId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const listarVoluntarios = () => ler(CHAVE_VOLUNTARIOS, []);

export function salvarVoluntario(dados) {
  const lista = listarVoluntarios();
  lista.push({ ...dados, id: gerarId(), criadoEm: new Date().toISOString() });
  return gravar(CHAVE_VOLUNTARIOS, lista);
}

export function removerVoluntario(id) {
  return gravar(CHAVE_VOLUNTARIOS, listarVoluntarios().filter((v) => v.id !== id));
}

export const cpfJaCadastrado = (cpf) => listarVoluntarios().some((v) => v.cpf === cpf);

export const lerRascunho = () => ler(CHAVE_RASCUNHO, null);
export const salvarRascunho = (dados) => gravar(CHAVE_RASCUNHO, dados);
export const limparRascunho = () => localStorage.removeItem(CHAVE_RASCUNHO);
