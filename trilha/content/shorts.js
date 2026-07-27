/**
 * Java em 30 segundos — roteiros dos shorts.
 * Fonte única: alimenta o player do hub (js/shorts-player.js) e é espelhada
 * no projeto Remotion (../remotion/src/java-shorts/shorts.ts) para renderizar
 * os vídeos. Formato de cada short: gancho -> beats (roteiro) -> dica.
 */
window.SHORTS = [
  {
    id: 'hook-2026', numero: '🔥', cor: '#ff4b4b',
    titulo: 'Por que Java em 2026 (carreira backend)',
    gancho: 'Todo mundo fala que Java morreu...',
    beats: [
      'Java é a que mais paga em vaga sênior de backend: infraestrutura crítica.',
      'Spring Boot, virtual threads, GraalVM: madura, mas moderna de verdade.',
      'Aprender Java é aprender arquitetura: pensar como engenheiro.',
    ],
    dica: 'Comenta JAVA que eu te mando por onde começar.',
    videoUrl: 'videos/hook-2026.mp4',   // hook de carreira (~85s), Remotion
  },
  {
    id: 'short-01', numero: 1, cor: '#58cc02',
    titulo: 'O que torna o Java especial?',
    gancho: 'Por que aprender Java em 2024?',
    beats: [
      'Java é fortemente tipada e orientada a objetos: sua lógica gira em torno de classes e objetos.',
      'O tipo de uma variável nunca muda durante a execução: menos surpresa, mais segurança.',
      'E é independente de plataforma: escreva uma vez, rode em qualquer sistema, graças à JVM.',
    ],
    codigo: 'System.out.println("Olá, mundo!");',
    dica: 'Java é portabilidade e segurança.',
  },
  {
    id: 'short-02', numero: 2, cor: '#1cb0f6',
    titulo: 'Classe e objeto: o molde e a peça',
    gancho: 'Qual a diferença entre classe e objeto?',
    beats: [
      'A classe é o molde: define quais dados e comportamentos algo vai ter.',
      'O objeto é a peça feita a partir do molde, com valores próprios.',
      'De uma classe Carro você cria mil objetos carro, cada um com sua cor e placa.',
    ],
    codigo: 'Carro meu = new Carro("preto");',
    dica: 'Classe é a receita; objeto é o bolo.',
    videoUrl: 'videos/short-02.mp4',   // versão rica renderizada no Remotion
  },
  {
    id: 'short-03', numero: 3, cor: '#ffc800',
    titulo: 'Os 8 tipos primitivos',
    gancho: 'Quantos tipos básicos o Java tem?',
    beats: [
      'São 8 primitivos: byte, short, int, long, float, double, boolean e char.',
      'Cada um é uma gaveta de tamanho fixo: int guarda inteiros, double guarda decimais.',
      'Eles não são objetos: são o valor cru, rápidos e diretos.',
    ],
    codigo: 'int idade = 30;\ndouble preco = 9.90;',
    dica: 'Na dúvida entre inteiros, use int.',
  },
  {
    id: 'short-04', numero: 4, cor: '#ce82ff',
    titulo: 'Variáveis e tipagem forte',
    gancho: 'Por que o Java não deixa misturar tipos?',
    beats: [
      'Toda variável declara o seu tipo, e ele não muda: isso é tipagem forte.',
      'Um int guarda inteiro; tentar pôr um texto ali nem compila.',
      'O compilador vira sua rede de segurança: pega o erro antes de rodar.',
    ],
    codigo: 'int n = 10;\nn = "dez"; // não compila',
    dica: 'Erro na compilação é melhor que erro em produção.',
  },
  {
    id: 'short-05', numero: 5, cor: '#ff9600',
    titulo: 'Métodos: o que os objetos fazem',
    gancho: 'Onde mora o comportamento no Java?',
    beats: [
      'Método é uma ação que o objeto sabe executar, com nome de verbo.',
      'Ele recebe parâmetros, faz algo e pode devolver um resultado.',
      'Todo programa começa pelo método main: a porta de entrada.',
    ],
    codigo: 'public static void main(String[] args) { }',
    dica: 'Classe é substantivo; método é verbo.',
  },
  {
    id: 'short-06', numero: 6, cor: '#4ecdc4',
    titulo: 'Decisões: if, else e ternário',
    gancho: 'Como o Java toma decisões?',
    beats: [
      'O if executa um bloco só quando a condição é verdadeira; o else cobre o resto.',
      'Para escolhas rápidas existe o ternário: condição, valor se sim, valor se não.',
      'E o switch moderno decide entre vários casos sem repetir if.',
    ],
    codigo: 'String r = (idade >= 18) ? "adulto" : "menor";',
    dica: 'Ternário é um if de uma linha.',
  },
  {
    id: 'short-07', numero: 7, cor: '#f78c6c',
    titulo: 'Laços: repetir sem repetir código',
    gancho: 'Como repetir uma ação mil vezes?',
    beats: [
      'O for repete com um contador conhecido: início, condição e passo.',
      'O while repete enquanto uma condição for verdadeira.',
      'E o for-each percorre uma coleção inteira, item por item.',
    ],
    codigo: 'for (int i = 0; i < 10; i++) { }',
    dica: 'Contador conhecido? for. Condição aberta? while.',
  },
  {
    id: 'short-08', numero: 8, cor: '#ff4b4b',
    titulo: '== vs equals: a pegadinha nº 1',
    gancho: 'Por que "Java" == "Java" pode dar false?',
    beats: [
      'O == compara referências: se é o mesmo objeto na memória.',
      'O equals compara o conteúdo: se o valor é igual.',
      'Para textos e objetos, use sempre equals; o == engana.',
    ],
    codigo: 'a.equals(b); // conteúdo\na == b;      // referência',
    dica: 'Compare objetos com equals, nunca com ==.',
  },
];
