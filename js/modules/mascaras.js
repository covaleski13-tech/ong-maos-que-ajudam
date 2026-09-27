// Máscaras de entrada: formatam o valor enquanto o usuário digita.
export const somenteDigitos = (valor) => valor.replace(/\D/g, '');

export function mascaraCPF(valor) {
  return somenteDigitos(valor).slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function mascaraTelefone(valor) {
  const d = somenteDigitos(valor).slice(0, 11);
  if (!d) return '';
  if (d.length < 3) return `(${d}`;
  const resto = d.slice(2);
  const corte = resto.length > 8 ? 5 : 4; // celular (9 dígitos) ou fixo (8)
  const fim = resto.slice(corte);
  return `(${d.slice(0, 2)}) ${resto.slice(0, corte)}${fim ? '-' + fim : ''}`;
}

export function mascaraCEP(valor) {
  return somenteDigitos(valor).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
}

const mascaras = { cpf: mascaraCPF, telefone: mascaraTelefone, cep: mascaraCEP };

export function aplicarMascaras(formulario) {
  Object.entries(mascaras).forEach(([nome, mascara]) => {
    const campo = formulario.elements[nome];
    campo?.addEventListener('input', () => { campo.value = mascara(campo.value); });
  });
}
