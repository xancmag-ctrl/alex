export interface Myth {
  statement: string
  answer: 'mito' | 'verdade'
  explanation: string
}

export const MYTHS: Myth[] = [
  {
    statement: 'Jejum intermitente é indicado para todas as pessoas.',
    answer: 'mito',
    explanation:
      'Não é. Gestantes, lactantes, pessoas com histórico de transtornos alimentares, com algumas condições de saúde ou que usam certos medicamentos devem conversar com um profissional antes.',
  },
  {
    statement: 'Durante o período sem alimentação, beber água é importante.',
    answer: 'verdade',
    explanation: 'A hidratação continua essencial em qualquer momento do dia, inclusive durante o jejum.',
  },
  {
    statement: 'Quanto mais horas sem comer, melhor.',
    answer: 'mito',
    explanation:
      'Mais tempo não significa mais resultado. Períodos longos podem causar desconforto e dificultar a constância. O que importa é o que é seguro e sustentável para você.',
  },
  {
    statement: 'A qualidade da alimentação continua importante no jejum.',
    answer: 'verdade',
    explanation: 'Organizar horários não compensa refeições desequilibradas. O que você come segue fazendo diferença.',
  },
  {
    statement: 'Pular o café da manhã sempre faz mal.',
    answer: 'mito',
    explanation:
      'Não há uma regra única para todos. Algumas pessoas se sentem bem sem o café da manhã, outras não. O mais importante é a alimentação ao longo do dia como um todo.',
  },
  {
    statement: 'É normal sentir um pouco de fome nos primeiros dias de adaptação.',
    answer: 'verdade',
    explanation:
      'Uma fome leve pode acontecer enquanto o corpo se acostuma a novos horários. Mas fome intensa, tontura ou mal-estar são sinais para interromper e comer.',
  },
  {
    statement: 'Na janela de alimentação, pode-se comer qualquer coisa em qualquer quantidade.',
    answer: 'mito',
    explanation:
      'O jejum não "libera" excessos. A ideia é fazer refeições completas e satisfatórias, com atenção à fome e à saciedade.',
  },
  {
    statement: 'O jejum intermitente funciona como uma dieta mágica.',
    answer: 'mito',
    explanation:
      'Não existe solução mágica. O jejum é apenas uma forma de organizar horários; sono, qualidade alimentar, movimento e constância continuam fazendo diferença.',
  },
  {
    statement: 'Dormir mal pode aumentar a vontade de comer.',
    answer: 'verdade',
    explanation: 'Noites mal dormidas costumam afetar o apetite e as escolhas alimentares no dia seguinte. Cuidar do sono ajuda.',
  },
  {
    statement: 'Se eu sair da rotina um dia, preciso compensar ficando mais tempo sem comer.',
    answer: 'mito',
    explanation: 'Não é preciso compensar. Basta retomar a rotina normal no dia seguinte, com tranquilidade.',
  },
  {
    statement: 'Existem diferentes formatos de jejum intermitente.',
    answer: 'verdade',
    explanation:
      'Há formatos como 12:12, 14:10 e 16:8, entre outros. Nenhum é obrigatório ou melhor para todos.',
  },
  {
    statement: 'Fazer jejum dispensa acompanhamento de saúde.',
    answer: 'mito',
    explanation:
      'Consultas e exames de rotina continuam importantes. Este app é educativo e não substitui profissionais de saúde.',
  },
  {
    statement: 'Comer com atenção ajuda a perceber a saciedade.',
    answer: 'verdade',
    explanation: 'Comer devagar e com menos distrações facilita perceber quando você já está satisfeito(a).',
  },
  {
    statement: 'Sentir tontura durante o jejum é normal e deve ser ignorado.',
    answer: 'mito',
    explanation:
      'Tontura, fraqueza ou mal-estar são sinais para interromper e se alimentar. Se persistirem, procure atendimento.',
  },
  {
    statement: 'Constância costuma ser mais importante do que perfeição.',
    answer: 'verdade',
    explanation: 'Hábitos possíveis, repetidos ao longo do tempo, tendem a ser mais sustentáveis do que planos perfeitos e rígidos.',
  },
]
