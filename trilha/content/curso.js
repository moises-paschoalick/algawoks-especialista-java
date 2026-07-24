/**
 * Índice do curso + registro das unidades da trilha.
 * `MODULOS` usa exatamente o nome da pasta no repositório, para que a lição
 * consiga apontar onde está o vídeo e onde está o código que você commitou.
 */
const Curso = {
  /**
   * Base dos links para docs/*.md.
   * Dentro do repositório do curso, '../' resolve para a pasta docs local.
   * No bundle estático publicado no GitHub Pages, o build troca por uma URL
   * absoluta do repositório — ver bundle/build.sh.
   */
  docBase: '../',

  MODULOS: {
    2:  'Fundamentos da linguagem Java',
    3:  'Estrutura de controle e operadores',
    4:  'Produtividade com IDE IntelliJ IDEA',
    5:  'Mergulhando em orientacao a objetos',
    6:  'Começando com boas práticas e código limpo',
    7:  'Wrappers e boxing',
    8:  'Trabalhando com arrays',
    9:  'Gerenciamento de memoria da JVM',
    10: 'Construtores, pacotes e visibilidade',
    11: 'Encapsulamento, JavaBens e Recoreds',
    12: 'Heranca',
    13: 'Polimorfismo e classes abstratas',
    14: 'Interfaces',
    15: 'Boas Praticas de Heranca e Interfaces',
    16: 'Introducao as excecoes',
    17: 'Generics',
    18: 'Collections',
    19: 'Enumeracoes',
    20: 'Trabalhando com strings',
    21: 'Trabalhando com numeros',
    22: 'Date e Calendar apis legadas',
    23: 'Date-Time-API',
    24: 'Classes-aninhadas',
    25: 'Expressoes-lambda-method-reference',
    26: 'Optional',
    27: 'Streams API',
    28: 'Manipulando Arquivo API IO',
    29: 'Arquivos NIO2',
    30: 'Serialização de objetos',
    31: 'Arquivos JAR e Apache Maven',
    32: 'Java Logging',
    33: 'Banco de dados',
    34: 'Padrao repository',
    35: 'Reflection API',
  },

  nome(n) {
    return this.MODULOS[n] || `Módulo ${n}`;
  },

  /** Caminho da pasta no repositório — o separador do módulo 26 é diferente. */
  pasta(n) {
    return n === 26 ? '26 - Optional' : `${n}. ${this.nome(n)}`;
  },
};

const Trilha = (() => {
  const unidades = [];

  function add(unidade) {
    unidade.licoes.forEach((l, i) => {
      l.unidade = unidade;
      l.indice = i;
    });
    unidades.push(unidade);
  }

  function todas() { return unidades; }

  /** Todas as lições, na ordem da trilha — a sequência de desbloqueio. */
  function sequencia() {
    return unidades.flatMap(u => u.licoes);
  }

  function licao(id) {
    return sequencia().find(l => l.id === id) || null;
  }

  /** Uma lição está liberada se a anterior da sequência foi concluída. */
  function liberada(id) {
    if (Progress.modoLivre()) return true;
    const seq = sequencia();
    const i = seq.findIndex(l => l.id === id);
    if (i <= 0) return true;
    return Progress.concluida(seq[i - 1].id);
  }

  function proxima() {
    return sequencia().find(l => !Progress.concluida(l.id)) || null;
  }

  return { add, todas, sequencia, licao, liberada, proxima };
})();
