// Simulador de impacto da doação, construído com Alpine.js (framework reativo via CDN).
// O componente é registrado no evento "alpine:init", disparado antes de o Alpine
// processar a página, e fica isolado no objeto Alpine: não cria variáveis globais.

const CUSTOS = [
  { singular: 'cesta básica para uma família', plural: 'cestas básicas para famílias', valor: 120 },
  { singular: 'vaga em oficina profissionalizante', plural: 'vagas em oficinas profissionalizantes', valor: 60 },
  { singular: 'aula de reforço escolar', plural: 'aulas de reforço escolar', valor: 15 }
];

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function registrarSimulador() {
  document.addEventListener('alpine:init', () => {
    // Prefixo "data-x-": mantém o HTML válido no W3C (atributos data-*).
    window.Alpine.prefix('data-x-');

    window.Alpine.data('simuladorDoacao', () => ({
      valor: 100,
      sugestoes: [50, 100, 250, 500],
      get valorValido() {
        return Number.isFinite(this.valor) && this.valor >= 10;
      },
      get valorFormatado() {
        return moeda.format(this.valor || 0);
      },
      get impacto() {
        return CUSTOS
          .map((item) => {
            const quantidade = Math.floor((this.valor || 0) / item.valor);
            return { quantidade, nome: quantidade === 1 ? item.singular : item.plural };
          })
          .filter((item) => item.quantidade > 0);
      }
    }));
  });
}
