import { listarVoluntarios } from './armazenamento.js';

export function iniciarInicio(raiz) {
  raiz.querySelector('#contador-voluntarios').textContent = listarVoluntarios().length;
}
