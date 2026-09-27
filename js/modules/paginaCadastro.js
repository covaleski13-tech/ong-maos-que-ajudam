import { aplicarMascaras, mascaraCPF } from './mascaras.js';
import { validarCampo, validarFormulario } from './validacao.js';
import {
  salvarVoluntario, listarVoluntarios, removerVoluntario,
  lerRascunho, salvarRascunho, limparRascunho
} from './armazenamento.js';
import { buscarCEP } from './cep.js';
import { mostrarToast } from './feedback.js';
import { alerta, itemVoluntario, listaVazia, escaparHTML } from '../templates/componentes.js';

const ocultarCPF = (cpf) => `***.${cpf.slice(4, 11)}-**`;

function renderizarLista(container) {
  const voluntarios = listarVoluntarios();
  container.innerHTML = voluntarios.length
    ? `<ul class="lista-voluntarios">${voluntarios
        .map((v) => itemVoluntario({ ...v, cpfMascarado: ocultarCPF(v.cpf) }))
        .join('')}</ul>`
    : listaVazia();
}

function restaurarRascunho(formulario) {
  const rascunho = lerRascunho();
  if (!rascunho) return;
  Object.entries(rascunho).forEach(([nome, valor]) => {
    const campo = formulario.elements[nome];
    if (!campo) return;
    if (campo instanceof RadioNodeList) {
      campo.forEach((opcao) => { opcao.checked = opcao.value === valor; });
    } else {
      campo.value = valor;
    }
  });
}

export function iniciarCadastro(raiz) {
  const formulario = raiz.querySelector('#form-cadastro');
  const resumo = raiz.querySelector('#resumo-erros');
  const lista = raiz.querySelector('#lista-voluntarios');

  formulario.noValidate = true; // o JavaScript assume a validação e as mensagens
  aplicarMascaras(formulario);
  restaurarRascunho(formulario);
  renderizarLista(lista);

  // Valida ao sair do campo; revalida enquanto digita se já estava com erro.
  formulario.addEventListener('focusout', (e) => {
    if (e.target.willValidate && e.target.value) validarCampo(e.target);
  });
  formulario.addEventListener('input', (e) => {
    if (e.target.getAttribute('aria-invalid') === 'true') validarCampo(e.target);
    salvarRascunho(Object.fromEntries(new FormData(formulario)));
  });
  formulario.addEventListener('change', (e) => {
    if (e.target.type === 'radio') validarCampo(e.target);
  });

  // CEP completo: busca o endereço e preenche os campos.
  formulario.elements.cep.addEventListener('input', async (e) => {
    if (e.target.value.length !== 9) return;
    const endereco = await buscarCEP(e.target.value);
    if (!endereco) return;
    formulario.elements.endereco.value = endereco.logradouro;
    formulario.elements.cidade.value = endereco.localidade;
    formulario.elements.estado.value = endereco.uf;
    ['endereco', 'cidade', 'estado'].forEach((n) => validarCampo(formulario.elements[n]));
    formulario.elements.numero.focus();
  });

  formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const invalidos = validarFormulario(formulario);

    if (invalidos.length) {
      const itens = invalidos
        .map((c) => `<li><a href="#${c.id}">${escaparHTML(formulario.querySelector(`label[for="${c.id}"]`)?.textContent.replace(' *', '') ?? c.name)}</a></li>`)
        .join('');
      resumo.innerHTML = alerta('erro', `Corrija ${invalidos.length} campo(s) antes de enviar:`, `<ul>${itens}</ul>`);
      invalidos[0].focus();
      return;
    }

    const dados = Object.fromEntries(new FormData(formulario));
    dados.cpf = mascaraCPF(dados.cpf);

    if (!salvarVoluntario(dados)) {
      mostrarToast('<strong>Não foi possível salvar.</strong><br>O armazenamento do navegador está indisponível.', 'erro');
      return;
    }

    resumo.innerHTML = '';
    limparRascunho();
    formulario.reset();
    formulario.querySelectorAll('.campo--valido, .campo--invalido')
      .forEach((el) => el.classList.remove('campo--valido', 'campo--invalido'));
    renderizarLista(lista);
    mostrarToast(`<strong>Cadastro enviado!</strong><br>Obrigado, ${escaparHTML(dados.nome.split(' ')[0])}. Entraremos em contato por e-mail.`);
  });

  formulario.addEventListener('reset', () => {
    limparRascunho();
    resumo.innerHTML = '';
    formulario.querySelectorAll('.campo__erro').forEach((el) => { el.textContent = ''; });
    formulario.querySelectorAll('.campo--valido, .campo--invalido')
      .forEach((el) => el.classList.remove('campo--valido', 'campo--invalido'));
  });

  lista.addEventListener('click', (e) => {
    const botao = e.target.closest('[data-remover]');
    if (!botao) return;
    removerVoluntario(botao.dataset.remover);
    renderizarLista(lista);
    mostrarToast('Cadastro removido.');
  });
}
