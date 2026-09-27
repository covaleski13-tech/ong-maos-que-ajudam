// Dados dos projetos: adicionar um projeto novo é só incluir um objeto aqui.
export const projetos = [
  {
    id: 'reforco-escolar',
    titulo: 'Reforço Escolar',
    categoria: { tipo: 'educacao', rotulo: 'Educação' },
    status: { tipo: 'aberto', rotulo: 'Inscrições abertas' },
    imagem: 'reforco-escolar',
    alt: 'Crianças estudando em grupo com o apoio de uma voluntária em sala de aula',
    legenda: 'Aulas de reforço no contraturno escolar.',
    descricao: 'Aulas gratuitas de português e matemática para crianças do ensino fundamental, duas vezes por semana.'
  },
  {
    id: 'cesta-solidaria',
    titulo: 'Cesta Solidária',
    categoria: { tipo: 'alimentacao', rotulo: 'Alimentação' },
    status: { tipo: 'urgente', rotulo: 'Precisa de doações' },
    imagem: 'cesta-solidaria',
    alt: 'Voluntários organizando cestas básicas sobre mesas em um galpão',
    legenda: 'Montagem mensal das cestas básicas.',
    descricao: 'Arrecadação e distribuição mensal de cestas básicas para famílias cadastradas na comunidade.'
  },
  {
    id: 'oficinas',
    titulo: 'Oficinas Profissionalizantes',
    categoria: { tipo: 'capacitacao', rotulo: 'Capacitação' },
    status: { tipo: 'aberto', rotulo: 'Inscrições abertas' },
    imagem: 'oficina-profissional',
    alt: 'Jovens participando de uma oficina prática de informática',
    legenda: 'Oficina de informática básica para jovens.',
    descricao: 'Cursos de informática, culinária e empreendedorismo para jovens e adultos em busca de emprego.'
  }
];
