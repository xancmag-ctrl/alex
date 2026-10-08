import { BookOpen, Utensils, CalendarClock, Brain, ShieldCheck, type LucideIcon } from 'lucide-react'

export type ArticleCategory = 'fundamentos' | 'alimentacao' | 'rotina' | 'mentalidade' | 'seguranca'

export interface ArticleSection {
  heading?: string
  text?: string[]
  list?: string[]
}

export interface Article {
  slug: string
  category: ArticleCategory
  title: string
  summary: string
  minutes: number
  sections: ArticleSection[]
  /** Quando definido, abre uma experiência interativa em vez de texto. */
  interactive?: 'mitos'
}

export const ARTICLE_CATEGORIES: { id: ArticleCategory; label: string; description: string; icon: LucideIcon }[] = [
  { id: 'fundamentos', label: 'Fundamentos', description: 'O essencial para entender o jejum', icon: BookOpen },
  { id: 'alimentacao', label: 'Alimentação', description: 'Refeições, fome e saciedade', icon: Utensils },
  { id: 'rotina', label: 'Rotina', description: 'Organização para a vida real', icon: CalendarClock },
  { id: 'mentalidade', label: 'Mentalidade', description: 'Constância sem cobrança', icon: Brain },
  { id: 'seguranca', label: 'Segurança', description: 'Cuidados e limites importantes', icon: ShieldCheck },
]

export const SAFETY_DISCLAIMER =
  'Este aplicativo possui finalidade educativa e não substitui avaliação ou acompanhamento de profissionais de saúde.'

export const ARTICLES: Article[] = [
  // ───────────── FUNDAMENTOS ─────────────
  {
    slug: 'o-que-e-jejum-intermitente',
    category: 'fundamentos',
    title: 'O que é jejum intermitente',
    summary: 'Uma forma de organizar os horários das refeições — não uma dieta específica.',
    minutes: 3,
    sections: [
      {
        text: [
          'Jejum intermitente é uma forma de organizar a alimentação alternando períodos em que você se alimenta com períodos em que não come. Em vez de definir o que comer, ele trata principalmente de quando comer.',
          'Na prática, muitas pessoas já fazem uma versão leve disso sem perceber: o intervalo entre o jantar e o café da manhã é um período sem alimentação.',
        ],
      },
      {
        heading: 'O que ele não é',
        list: [
          'Não é uma dieta mágica nem um atalho.',
          'Não é passar fome ou ignorar sinais do corpo.',
          'Não é obrigatório para ter uma alimentação saudável.',
          'Não é adequado para todas as pessoas.',
        ],
      },
      {
        heading: 'Por que algumas pessoas gostam',
        text: [
          'Para algumas pessoas, ter horários definidos simplifica a rotina: menos decisões ao longo do dia, refeições mais planejadas e mais atenção à fome real. Para outras, não funciona bem — e tudo bem.',
          'A qualidade do que você come continua sendo importante. Organizar horários não compensa uma alimentação desequilibrada.',
        ],
      },
      {
        heading: 'Antes de começar',
        text: [
          'Se você tem alguma condição de saúde, usa medicamentos contínuos, está gestante ou amamentando, ou tem histórico de transtornos alimentares, converse com um profissional de saúde antes de fazer mudanças. Veja a seção Segurança.',
        ],
      },
    ],
  },
  {
    slug: 'como-funciona',
    category: 'fundamentos',
    title: 'Como funciona',
    summary: 'Janela de alimentação, período sem alimentação e o que acontece entre eles.',
    minutes: 3,
    sections: [
      {
        text: [
          'O jejum intermitente divide o dia (ou a semana) em dois momentos: a janela de alimentação, quando você faz suas refeições, e o período sem alimentação, quando você não consome alimentos com calorias.',
        ],
      },
      {
        heading: 'Durante o período sem alimentação',
        text: [
          'Em geral, água é liberada e importante. Muitas pessoas também consomem café ou chá sem açúcar. Caso tenha dúvidas sobre o que é adequado para você, um profissional pode orientar.',
          'O corpo passa a usar as reservas de energia que já possui. Isso é um processo natural — acontece todas as noites enquanto você dorme.',
        ],
      },
      {
        heading: 'Durante a janela de alimentação',
        text: [
          'É quando você faz suas refeições normalmente. O objetivo não é "compensar" o tempo sem comer, e sim fazer refeições completas, com calma e com alimentos que te deixem satisfeito(a).',
        ],
      },
      {
        heading: 'O que realmente faz diferença',
        list: [
          'Constância ao longo das semanas, não um dia perfeito.',
          'Qualidade das refeições.',
          'Sono, hidratação e movimento.',
          'Escolher horários que caibam na sua vida.',
        ],
      },
    ],
  },
  {
    slug: 'principais-abordagens',
    category: 'fundamentos',
    title: 'Principais abordagens',
    summary: 'Os formatos mais comuns e como pensar em qual faz sentido para você.',
    minutes: 4,
    sections: [
      {
        text: [
          'Existem vários formatos de jejum intermitente. Eles são descritos aqui apenas para fins educativos — não são recomendações. O formato adequado (inclusive nenhum) depende da sua saúde, rotina e preferências.',
        ],
      },
      {
        heading: '12:12',
        text: [
          '12 horas de período sem alimentação e 12 horas de janela de alimentação. Por exemplo: jantar às 20h e café da manhã às 8h. É o formato mais próximo da rotina de muitas pessoas.',
        ],
      },
      {
        heading: '14:10',
        text: ['14 horas sem alimentação e 10 horas de janela. Por exemplo: refeições entre 9h e 19h.'],
      },
      {
        heading: '16:8',
        text: [
          '16 horas sem alimentação e 8 horas de janela. Por exemplo: refeições entre 12h e 20h. É um dos formatos mais conhecidos, mas não é o "melhor" para todos.',
        ],
      },
      {
        heading: 'Como pensar na escolha',
        list: [
          'Comece pelo que já é parecido com sua rotina atual.',
          'Respeite seus horários de trabalho, sono e família.',
          'Prefira o que você consegue manter com tranquilidade.',
          'Converse com um profissional antes de mudanças maiores.',
        ],
      },
    ],
  },
  {
    slug: 'mitos-e-verdades',
    category: 'fundamentos',
    title: 'Mitos e verdades',
    summary: 'Teste o que você sabe: 15 afirmações comuns sobre jejum e alimentação.',
    minutes: 4,
    interactive: 'mitos',
    sections: [],
  },

  // ───────────── ALIMENTAÇÃO ─────────────
  {
    slug: 'como-organizar-refeicoes',
    category: 'alimentacao',
    title: 'Como organizar refeições',
    summary: 'Um jeito simples de montar pratos completos sem contar calorias.',
    minutes: 3,
    sections: [
      {
        text: [
          'Organizar as refeições evita decisões apressadas e ajuda a chegar à janela de alimentação com um plano. Não é preciso nada complicado.',
        ],
      },
      {
        heading: 'Um prato equilibrado, sem fórmulas',
        list: [
          'Uma fonte de proteína: ovos, frango, peixe, carne, feijões, tofu.',
          'Vegetais variados: folhas, legumes, verduras.',
          'Uma fonte de carboidrato: arroz, batata, mandioca, pães, frutas.',
          'Uma gordura boa: azeite, abacate, castanhas.',
        ],
      },
      {
        heading: 'Planejamento leve',
        list: [
          'Escolha 2 ou 3 receitas para a semana.',
          'Monte a lista de compras a partir delas (o app ajuda nisso).',
          'Cozinhe porções extras para o dia seguinte.',
          'Deixe lanches práticos prontos: ovos cozidos, frutas, homus.',
        ],
      },
      {
        heading: 'Lembre-se',
        text: ['A primeira refeição após o período sem alimentação pode ser tranquila e completa. Não há necessidade de exagerar nem de restringir.'],
      },
    ],
  },
  {
    slug: 'fome-e-saciedade',
    category: 'alimentacao',
    title: 'Fome e saciedade',
    summary: 'Como reconhecer a fome real e perceber quando você já está satisfeito(a).',
    minutes: 3,
    sections: [
      {
        text: [
          'Fome e saciedade são sinais do corpo. Aprender a percebê-los ajuda a comer com mais tranquilidade — com ou sem jejum.',
        ],
      },
      {
        heading: 'Fome física costuma…',
        list: [
          'Surgir aos poucos.',
          'Aceitar diferentes tipos de alimento.',
          'Diminuir depois de comer.',
        ],
      },
      {
        heading: 'Vontade emocional costuma…',
        list: [
          'Surgir de repente, muitas vezes ligada a uma emoção.',
          'Pedir um alimento específico.',
          'Não passar mesmo depois de comer.',
        ],
      },
      {
        heading: 'Uma escala simples',
        text: [
          'No Diário do app, você pode registrar sua fome de 1 (pouca) a 5 (muita). Com o tempo, isso ajuda a perceber padrões — sem julgamento.',
          'Se a fome estiver intensa, desconfortável ou acompanhada de mal-estar, coma. Ouvir o corpo é mais importante do que cumprir um horário.',
        ],
      },
    ],
  },
  {
    slug: 'alimentacao-consciente',
    category: 'alimentacao',
    title: 'Alimentação consciente',
    summary: 'Comer com atenção, sem pressa e sem culpa.',
    minutes: 3,
    sections: [
      {
        text: [
          'Alimentação consciente é prestar atenção ao momento da refeição: sabor, textura, fome e saciedade. É uma prática, não uma regra.',
        ],
      },
      {
        heading: 'Pequenas práticas',
        list: [
          'Sente-se para comer, sempre que possível.',
          'Afaste o celular durante parte da refeição.',
          'Mastigue com calma e perceba os sabores.',
          'Faça uma pausa no meio do prato e observe como está sua fome.',
          'Coma algo de que você goste — prazer também faz parte.',
        ],
      },
      {
        heading: 'Sem culpa',
        text: [
          'Não existe "comida proibida" neste app. Uma refeição diferente do planejado é só uma refeição — não diz nada sobre seu valor ou sua capacidade.',
        ],
      },
    ],
  },

  // ───────────── ROTINA ─────────────
  {
    slug: 'como-se-organizar',
    category: 'rotina',
    title: 'Como se organizar',
    summary: 'Um passo a passo curto para encaixar o jejum na sua semana.',
    minutes: 3,
    sections: [
      {
        heading: '1. Observe sua rotina atual',
        text: ['Que horas você acorda, trabalha, treina e dorme? Quando costuma sentir mais fome? Comece pelo que já existe.'],
      },
      {
        heading: '2. Defina horários possíveis',
        text: ['Em Meu Plano, registre a primeira e a última refeição que fazem sentido para você. Ajuste quando precisar — o plano é seu.'],
      },
      {
        heading: '3. Prepare o ambiente',
        list: [
          'Tenha uma garrafa de água por perto.',
          'Faça a lista de compras com antecedência.',
          'Deixe algumas refeições ou lanches semi-prontos.',
        ],
      },
      {
        heading: '4. Revise sem cobrança',
        text: ['Ao fim da semana, pergunte-se: o que funcionou? O que foi difícil? Ajuste um detalhe por vez.'],
      },
    ],
  },
  {
    slug: 'viagens',
    category: 'rotina',
    title: 'Como lidar com viagens',
    summary: 'Fuso horário, horários diferentes e menos controle — sem estresse.',
    minutes: 2,
    sections: [
      {
        text: ['Viagens mudam horários, opções de comida e sono. É natural que a rotina fique diferente. Flexibilidade é parte do processo.'],
      },
      {
        heading: 'Dicas práticas',
        list: [
          'Leve água e um lanche prático (frutas, castanhas, sanduíche).',
          'Em mudanças de fuso, priorize sono e hidratação antes de horários.',
          'Escolha refeições com proteína e vegetais quando possível.',
          'Considere pausar o jejum durante a viagem e retomar ao voltar.',
        ],
      },
      {
        text: ['Pausar não é desistir. É adaptar.'],
      },
    ],
  },
  {
    slug: 'eventos-sociais',
    category: 'rotina',
    title: 'Como lidar com eventos sociais',
    summary: 'Aniversários, almoços de família e encontros com amigos.',
    minutes: 2,
    sections: [
      {
        text: ['Momentos sociais são importantes para a saúde e o bem-estar. Nenhum plano alimentar deveria te afastar deles.'],
      },
      {
        heading: 'Algumas ideias',
        list: [
          'Se souber do evento antes, ajuste seus horários naquele dia.',
          'Coma com calma e aproveite a companhia.',
          'Não é preciso justificar suas escolhas para ninguém.',
          'No dia seguinte, simplesmente siga sua rotina normal.',
        ],
      },
      {
        text: ['Não existe "compensar" um evento. Um dia diferente não muda o que você constrói ao longo das semanas.'],
      },
    ],
  },
  {
    slug: 'manter-consistencia',
    category: 'rotina',
    title: 'Como manter consistência',
    summary: 'Hábitos pequenos e repetíveis vencem planos perfeitos.',
    minutes: 3,
    sections: [
      {
        text: ['A consistência vem de tornar as coisas fáceis, não de força de vontade.'],
      },
      {
        heading: 'O que ajuda',
        list: [
          'Horários parecidos na maior parte dos dias.',
          'Refeições que você gosta e sabe preparar.',
          'Usar o Checklist diário como lembrete, não como cobrança.',
          'Dormir bem: cansaço aumenta a vontade de comer por impulso.',
        ],
      },
      {
        heading: 'O que atrapalha',
        list: [
          'Mudar tudo de uma vez.',
          'Metas rígidas demais.',
          'Pensamento "tudo ou nada".',
        ],
      },
    ],
  },

  // ───────────── MENTALIDADE ─────────────
  {
    slug: 'consistencia',
    category: 'mentalidade',
    title: 'Consistência é melhor que intensidade',
    summary: 'Por que fazer o possível todos os dias vale mais do que o perfeito às vezes.',
    minutes: 2,
    sections: [
      {
        text: [
          'Planos muito intensos costumam durar pouco. Hábitos moderados que você repete por meses tendem a fazer mais diferença do que semanas de esforço extremo.',
          'Pense em "o que eu consigo manter?" em vez de "qual é o máximo que eu consigo fazer?".',
        ],
      },
      {
        heading: 'Experimente',
        list: [
          'Escolha um único hábito para a semana.',
          'Marque no Checklist quando fizer.',
          'Celebre a repetição, não a perfeição.',
        ],
      },
    ],
  },
  {
    slug: 'perfeccionismo',
    category: 'mentalidade',
    title: 'Perfeccionismo',
    summary: 'Quando a busca pelo perfeito atrapalha o progresso.',
    minutes: 2,
    sections: [
      {
        text: [
          'O perfeccionismo transforma qualquer desvio em fracasso. Na alimentação, isso costuma gerar um ciclo de rigidez, frustração e abandono.',
        ],
      },
      {
        heading: 'Troque',
        list: [
          '"Errei, perdi tudo" → "Foi um dia diferente, sigo amanhã".',
          '"Preciso fazer certo" → "Preciso fazer o possível".',
          '"Nunca mais vou comer isso" → "Posso comer com atenção".',
        ],
      },
      {
        text: ['Flexibilidade não é falta de disciplina. É o que permite continuar.'],
      },
    ],
  },
  {
    slug: 'dia-fora-da-rotina',
    category: 'mentalidade',
    title: 'Como lidar com um dia fora da rotina',
    summary: 'O que fazer (e o que não fazer) depois de um dia diferente.',
    minutes: 2,
    sections: [
      {
        text: ['Todo mundo tem dias fora da rotina. Eles fazem parte da vida e não apagam o que você construiu.'],
      },
      {
        heading: 'No dia seguinte',
        list: [
          'Retome seus horários normais.',
          'Não tente "compensar" ficando mais tempo sem comer.',
          'Beba água, durma bem e faça refeições completas.',
          'Observe sem julgar: o que levou àquele dia? Há algo a ajustar?',
        ],
      },
      {
        text: ['Se você perceber que dias assim vêm acompanhados de culpa intensa ou perda de controle frequente, vale conversar com um profissional de saúde.'],
      },
    ],
  },
  {
    slug: 'relacao-saudavel-com-alimentacao',
    category: 'mentalidade',
    title: 'Relação saudável com a alimentação',
    summary: 'Comida é nutrição, prazer, cultura e convivência.',
    minutes: 3,
    sections: [
      {
        text: [
          'Uma relação saudável com a comida inclui comer sem medo, sem culpa e sem regras que causem sofrimento. Ela importa mais do que qualquer formato de jejum.',
        ],
      },
      {
        heading: 'Sinais de que algo não vai bem',
        list: [
          'Pensar em comida o tempo todo, com ansiedade.',
          'Sentir culpa intensa depois de comer.',
          'Evitar eventos sociais por causa da alimentação.',
          'Usar o jejum para "compensar" o que comeu.',
        ],
      },
      {
        text: [
          'Se você se identificar com esses sinais, o jejum intermitente provavelmente não é indicado para você agora. Procure apoio de um profissional de saúde — isso é um cuidado, não uma derrota.',
        ],
      },
    ],
  },

  // ───────────── SEGURANÇA ─────────────
  {
    slug: 'quem-deve-conversar-com-profissional',
    category: 'seguranca',
    title: 'Quem deve conversar com um profissional',
    summary: 'O jejum intermitente não é adequado para todas as pessoas.',
    minutes: 2,
    sections: [
      {
        text: ['Antes de fazer mudanças na alimentação, converse com um profissional de saúde (médico ou nutricionista) se você:'],
      },
      {
        list: [
          'Está gestante, tentando engravidar ou amamentando.',
          'Tem diabetes ou alterações de glicemia.',
          'Usa medicamentos contínuos, principalmente para glicemia ou pressão arterial.',
          'Tem ou teve algum transtorno alimentar.',
          'Tem doenças cardíacas, renais, hepáticas ou outras condições crônicas.',
          'Tem baixo peso ou está em recuperação de alguma doença.',
          'É menor de 18 anos ou idoso(a) com necessidades nutricionais específicas.',
        ],
      },
      {
        text: ['Essa lista não é completa. Na dúvida, procure orientação profissional.'],
      },
    ],
  },
  {
    slug: 'quando-interromper',
    category: 'seguranca',
    title: 'Quando interromper',
    summary: 'Seu bem-estar vem antes de qualquer horário.',
    minutes: 2,
    sections: [
      {
        text: ['Interrompa o período sem alimentação e faça uma refeição se você sentir:'],
      },
      {
        list: [
          'Tontura, fraqueza ou sensação de desmaio.',
          'Dor de cabeça forte ou persistente.',
          'Tremores, suor frio ou palpitações.',
          'Náusea, confusão ou dificuldade de concentração intensa.',
          'Irritabilidade ou ansiedade fora do comum.',
        ],
      },
      {
        text: [
          'Interromper não é falhar. É ouvir o corpo. Se os sintomas forem intensos ou não melhorarem após comer, procure atendimento de saúde.',
        ],
      },
    ],
  },
  {
    slug: 'sinais-de-alerta',
    category: 'seguranca',
    title: 'Sinais de alerta',
    summary: 'Quando o jejum pode não estar fazendo bem.',
    minutes: 2,
    sections: [
      {
        heading: 'Fique atento(a) se, ao longo das semanas, perceber:',
        list: [
          'Cansaço constante ou queda de energia frequente.',
          'Piora do sono.',
          'Episódios de comer de forma descontrolada depois do jejum.',
          'Alterações no ciclo menstrual.',
          'Queda de cabelo ou unhas fracas.',
          'Pensamentos obsessivos sobre comida ou horários.',
        ],
      },
      {
        text: ['Esses sinais indicam que vale pausar e conversar com um profissional de saúde.'],
      },
    ],
  },
  {
    slug: 'cuidados-importantes',
    category: 'seguranca',
    title: 'Cuidados importantes',
    summary: 'Boas práticas para quem decide experimentar, com orientação.',
    minutes: 2,
    sections: [
      {
        list: [
          'Hidrate-se ao longo do dia.',
          'Faça refeições completas na janela de alimentação.',
          'Evite começar com períodos longos — mudanças graduais são mais confortáveis.',
          'Evite treinos intensos sem saber como seu corpo reage; peça orientação.',
          'Não use o jejum para compensar o que comeu.',
          'Priorize o sono.',
          'Mantenha consultas e exames de rotina em dia.',
        ],
      },
      { text: [SAFETY_DISCLAIMER] },
    ],
  },
]

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug)
}
