// Consulta de CEP (ViaCEP) para preencher o endereço automaticamente.
import { somenteDigitos } from './mascaras.js';

export async function buscarCEP(cep) {
  const digitos = somenteDigitos(cep);
  if (digitos.length !== 8) return null;
  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${digitos}/json/`);
    if (!resposta.ok) return null;
    const dados = await resposta.json();
    return dados.erro ? null : dados;
  } catch {
    return null; // sem conexão: o usuário preenche manualmente
  }
}
