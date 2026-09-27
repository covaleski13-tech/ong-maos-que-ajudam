// Regras de validação e mensagens de erro exibidas abaixo de cada campo.
import { somenteDigitos } from './mascaras.js';
import { cpfJaCadastrado } from './armazenamento.js';

export function cpfValido(cpf) {
  const d = somenteDigitos(cpf);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const digito = (base) => {
    const soma = [...base].reduce((total, n, i) => total + Number(n) * (base.length + 1 - i), 0);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(d.slice(0, 9)) === Number(d[9]) && digito(d.slice(0, 10)) === Number(d[10]);
}

export function calcularIdade(dataISO) {
  const nascimento = new Date(dataISO + 'T00:00:00');
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
  return aindaNaoFezAniversario ? idade - 1 : idade;
}

const IDADE_MINIMA = 16;

const formatos = {
  cpf: 'Use o formato 000.000.000-00.',
  telefone: 'Use o formato (00) 00000-0000.',
  cep: 'Use o formato 00000-000.'
};

// Regras extras que o HTML não consegue verificar sozinho.
function regrasPersonalizadas(campo) {
  if (campo.name === 'cpf' && campo.validity.valid) {
    if (!cpfValido(campo.value)) return 'CPF inválido. Confira os dígitos.';
    if (cpfJaCadastrado(campo.value)) return 'Este CPF já está cadastrado.';
  }
  if (campo.name === 'nascimento' && campo.value) {
    const idade = calcularIdade(campo.value);
    if (idade < 0) return 'A data não pode estar no futuro.';
    if (idade < IDADE_MINIMA) return `É preciso ter pelo menos ${IDADE_MINIMA} anos.`;
  }
  return '';
}

function mensagemDeErro(campo) {
  const v = campo.validity;
  if (v.valueMissing) return campo.type === 'radio' ? 'Escolha uma opção.' : 'Este campo é obrigatório.';
  if (v.typeMismatch) return 'Informe um e-mail válido, como nome@exemplo.com.';
  if (v.patternMismatch) return formatos[campo.name] ?? 'Formato inválido.';
  if (v.tooShort) return `Digite pelo menos ${campo.minLength} caracteres.`;
  if (v.rangeUnderflow || v.rangeOverflow) return 'Informe uma data válida.';
  return campo.validationMessage;
}

// Valida um campo, atualiza a mensagem e as classes visuais. Retorna true se válido.
export function validarCampo(campo) {
  campo.setCustomValidity('');
  campo.setCustomValidity(regrasPersonalizadas(campo));

  const valido = campo.checkValidity();
  const container = campo.closest('.campo') ?? campo.closest('fieldset');
  const erro = document.getElementById(`${campo.name}-erro`);

  container?.classList.toggle('campo--invalido', !valido);
  container?.classList.toggle('campo--valido', valido);
  campo.setAttribute('aria-invalid', String(!valido));
  if (erro) erro.textContent = valido ? '' : mensagemDeErro(campo);
  return valido;
}

// Valida o formulário inteiro e devolve a lista de campos com erro.
export function validarFormulario(formulario) {
  const campos = [...formulario.elements].filter((el) => el.willValidate);
  const vistos = new Set();
  return campos.filter((campo) => {
    if (campo.type === 'radio') {
      if (vistos.has(campo.name)) return false;
      vistos.add(campo.name);
    }
    return !validarCampo(campo);
  });
}
