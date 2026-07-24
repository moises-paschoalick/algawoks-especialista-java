/* Unidade 1 · Fundamentos da Linguagem (docs/page_06.md · módulos 2, 3, 7, 9, 20) */
Trilha.add({
  numero: 1,
  titulo: 'Fundamentos da Linguagem',
  icone: '🧪',
  cor: '#9ae65a',
  prioridade: 'base',
  doc: 'docs/page_06.md',
  modulos: [2, 3, 7, 9],
  resumo: 'A base que sustenta todo o resto: tipos, memória e as armadilhas clássicas de entrevista.',
  licoes: [

    /* ------------------------------------------------------------------ */
    {
      id: 'fund-primitivos',
      titulo: 'Primitivos e conversões',
      icone: '🔢',
      modulo: 2,
      aula: 'primitivos',      // aula guiada interativa em aula.html?id=primitivos
      ancora: '#1-tipos-primitivos',
      teoria: [
        { p: 'Java tem **8 tipos primitivos**. Eles não são objetos, vivem na stack e têm valor padrão quando são campos de classe.' },
        { tabela: {
          head: ['Tipo', 'Tamanho', 'Padrão', 'Faixa'],
          rows: [
            ['`byte`', '8 bits', '0', '-128 a 127'],
            ['`short`', '16 bits', '0', '-32.768 a 32.767'],
            ['`int`', '32 bits', '0', '±2,1 bilhões'],
            ['`long`', '64 bits', '0L', 'muito grande'],
            ['`float`', '32 bits', '0.0f', 'decimal, precisão simples'],
            ['`double`', '64 bits', '0.0d', 'decimal, precisão dupla'],
            ['`boolean`', 'n/a', 'false', 'true / false'],
            ['`char`', '16 bits', "'\\u0000'", 'um caractere Unicode'],
          ] } },
        { h: 'Sufixos de literais' },
        { code: `long grande = 9_999_999_999L;   // sem o L, o literal é int e não compila
float taxa   = 1.5f;               // sem o f, o literal é double
double valor = 1.5;                // double é o padrão dos decimais
int hex      = 0xFF;               // 255
int binario  = 0b1010;             // 10` },
        { h: 'Promoção aritmética' },
        { p: 'Toda operação com `byte`, `short` ou `char` **promove o resultado para `int`**. Por isso somar dois `byte` e guardar em `byte` não compila.' },
        { code: `byte a = 10, b = 20;
byte c = a + b;          // ERRO: a + b é int
byte d = (byte)(a + b);  // OK: cast explícito (narrowing)

int i = 5;
double dd = i;           // widening: automático e seguro
int j = (int) 3.99;      // narrowing: 3: a parte decimal é descartada` },
        { nota: 'Widening (menor → maior) é automático. Narrowing (maior → menor) exige cast e pode perder dados.' },
      ],
      passos: [
        { tipo: 'quiz',
          pergunta: 'Por que este código não compila?',
          codigo: `byte a = 10;
byte b = 20;
byte c = a + b;`,
          opcoes: [
            '`byte` não suporta o operador `+`',
            'O resultado de `a + b` é promovido para `int`, e `int` não cabe em `byte` sem cast',
            'Falta inicializar `c` antes de somar',
            'A soma estoura o limite de `byte` (127)',
          ],
          correta: 1,
          explicacao: 'Promoção aritmética: operandos menores que int viram int. 30 caberia em byte, mas o tipo da expressão é int, e o compilador reclama do tipo, não do valor.' },

        { tipo: 'completar',
          enunciado: 'Complete para o código compilar',
          sub: 'Um literal grande demais para `int` precisa do sufixo certo.',
          codigo: `long populacao = 8000000000___;
float aliquota  = 7.5___;`,
          respostas: [['L', 'l'], ['f', 'F']],
          dica: 'Sem sufixo, inteiros são `int` e decimais são `double`.',
          explicacao: 'O compilador avalia o literal antes de atribuir: 8000000000 sem L já estoura int.' },

        { tipo: 'flashcard',
          frente: { titulo: 'O que este código imprime?', blocos: [
            { code: `int total = 7;
int divisor = 2;
System.out.println(total / divisor);
System.out.println(total % divisor);
System.out.println((double) total / divisor);` },
          ] },
          verso: [
            { p: '**3**, **1** e **3.5**' },
            { p: 'Divisão entre dois `int` é divisão inteira: o resto é descartado. `%` devolve o resto. O cast em um dos operandos promove a expressão inteira para `double`.' },
          ] },

        { tipo: 'qa',
          pergunta: 'Qual a diferença entre widening e narrowing? Quando cada um exige cast?',
          resposta: [
            { p: '**Widening** (alargamento) vai de um tipo menor para um maior: `byte → short → int → long → float → double`. É automático porque não há perda de dados.' },
            { p: '**Narrowing** (estreitamento) vai do maior para o menor. Exige **cast explícito** porque pode truncar valor ou precisão.' },
            { code: `int i = 100;
long l = i;        // widening automático
int volta = (int) l;   // narrowing: cast obrigatório
int truncado = (int) 3.99;  // 3: perde a parte decimal` },
          ] },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'fund-wrappers',
      titulo: 'Wrappers, boxing e o cache do Integer',
      icone: '📦',
      modulo: 7,
      aula: 'wrappers',        // aula guiada interativa em aula.html?id=wrappers
      ancora: '#3-wrappers-e-boxing',
      teoria: [
        { p: 'Cada primitivo tem uma classe **wrapper** correspondente: `int → Integer`, `double → Double`, `char → Character`, `boolean → Boolean`. Wrappers são objetos: vivem na heap e podem ser `null`.' },
        { h: 'Autoboxing e unboxing' },
        { code: `Integer objeto = 10;      // autoboxing: int -> Integer
int primitivo = objeto;   // unboxing: Integer -> int

List<Integer> numeros = new ArrayList<>();
numeros.add(42);          // autoboxing implícito: coleções só guardam objetos` },
        { h: 'A armadilha do cache' },
        { p: 'A JVM mantém em cache os objetos `Integer` de **-128 a 127**. Dentro dessa faixa, dois autoboxings do mesmo valor devolvem a **mesma referência**; fora dela, objetos diferentes.' },
        { code: `Integer a = 127, b = 127;
System.out.println(a == b);       // true: mesmo objeto do cache

Integer c = 128, d = 128;
System.out.println(c == d);       // false: objetos diferentes!
System.out.println(c.equals(d));  // true: comparação por valor` },
        { nota: 'Regra prática: nunca compare wrappers com `==`. Use `equals()`, ou trabalhe com primitivos.' },
        { h: 'NullPointerException silencioso' },
        { code: `Integer valor = null;
int x = valor;   // NPE no unboxing: não no acesso a método` },
      ],
      passos: [
        { tipo: 'quiz',
          pergunta: 'Qual é a saída?',
          codigo: `Integer a = 127, b = 127;
Integer c = 128, d = 128;
System.out.println(a == b);
System.out.println(c == d);`,
          opcoes: ['true / true', 'true / false', 'false / false', 'false / true'],
          correta: 1,
          explicacao: 'O cache de Integer cobre -128 a 127. Acima disso o autoboxing cria objetos novos, e == compara referências.' },

        { tipo: 'quiz',
          pergunta: 'O que acontece na linha 2?',
          codigo: `Integer quantidade = null;
int total = quantidade + 1;`,
          opcoes: [
            'Compila e `total` fica 1',
            'Erro de compilação',
            '`NullPointerException` em tempo de execução, no unboxing',
            '`total` fica com o valor padrão 0',
          ],
          correta: 2,
          explicacao: 'Para somar, o compilador insere quantidade.intValue(): chamar um método em null lança NPE. É a causa mais comum de NPE "invisível" em Java.' },

        { tipo: 'flashcard',
          frente: { titulo: 'Métodos de wrapper que caem em entrevista', blocos: [
            { p: 'O que fazem `Integer.parseInt`, `Integer.valueOf` e `Integer.MAX_VALUE`?' },
          ] },
          verso: [
            { code: `int n1 = Integer.parseInt("42");     // devolve primitivo int
Integer n2 = Integer.valueOf("42");  // devolve objeto Integer (usa cache)
int max = Integer.MAX_VALUE;         // 2147483647
String bin = Integer.toBinaryString(10); // "1010"` },
            { p: '`parseInt` devolve primitivo; `valueOf` devolve wrapper e aproveita o cache. Ambos lançam `NumberFormatException` se a String não for numérica.' },
          ] },

        { tipo: 'qa',
          pergunta: 'Quando usar wrapper em vez de primitivo?',
          resposta: [
            { ul: [
              'Em **coleções e generics**: `List<int>` não existe, só `List<Integer>`.',
              'Quando o campo pode ser **ausente**: `Integer desconto = null` distingue "sem desconto" de "desconto zero".',
              'Quando precisa dos **métodos utilitários** (`parseInt`, `compare`, `MAX_VALUE`).',
            ] },
            { p: 'Nos demais casos prefira primitivos: sem alocação na heap, sem risco de NPE e sem custo de boxing em loops.' },
          ] },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'fund-strings',
      titulo: 'String, pool e StringBuilder',
      icone: '🧵',
      modulo: 20,
      aula: 'strings',         // aula guiada interativa em aula.html?id=strings
      ancora: '#4-strings',
      teoria: [
        { p: 'String é **imutável**. Toda operação que "modifica" uma String na verdade cria um objeto novo.' },
        { h: 'String Pool' },
        { code: `String a = "Java";
String b = "Java";
System.out.println(a == b);        // true: mesmo objeto no pool

String c = new String("Java");
System.out.println(a == c);        // false: new força objeto fora do pool
System.out.println(a.equals(c));   // true: mesmo conteúdo` },
        { nota: 'Compare Strings sempre com `equals()` (ou `equalsIgnoreCase`). `==` só coincide por causa do pool, e falha assim que a String vier de input, banco ou concatenação em runtime.' },
        { h: 'Métodos essenciais' },
        { code: `String texto = "  Java Especialista  ";
texto.trim();                 // remove espaços das pontas
texto.strip();                // Java 11+, entende Unicode
texto.isBlank();              // Java 11+, true se vazio ou só espaços
texto.replace("Java", "JVM");
texto.contains("Espec");
"a,b,c".split(",");           // ["a","b","c"]
String.join("-", "a", "b");   // "a-b"
"abc".charAt(1);              // 'b'
"%s tem %d anos".formatted("Ana", 30);  // Java 15+` },
        { h: 'StringBuilder em loops' },
        { code: `// ruim: cria um objeto novo por iteração
String out = "";
for (String parte : partes) out += parte;

// bom: um único buffer mutável
StringBuilder sb = new StringBuilder();
for (String parte : partes) sb.append(parte);
String out2 = sb.toString();` },
        { tabela: {
          head: ['Classe', 'Mutável', 'Thread-safe', 'Quando usar'],
          rows: [
            ['`String`', 'não', 'sim', 'padrão'],
            ['`StringBuilder`', 'sim', 'não', 'concatenação em loop'],
            ['`StringBuffer`', 'sim', 'sim', 'raro, só multithread'],
          ] } },
      ],
      passos: [
        { tipo: 'quiz',
          pergunta: 'Qual é a saída?',
          codigo: `String a = "Java";
String b = new String("Java");
System.out.println(a == b);
System.out.println(a.equals(b));`,
          opcoes: ['true / true', 'false / true', 'false / false', 'true / false'],
          correta: 1,
          explicacao: '`new String(...)` cria um objeto fora do pool: referências diferentes (== false), mesmo conteúdo (equals true).' },

        { tipo: 'completar',
          enunciado: 'Concatene sem criar lixo na heap',
          codigo: `___ sb = new StringBuilder();
for (String parte : partes) {
    sb.___(parte).append(", ");
}
String resultado = sb.___();`,
          respostas: [['StringBuilder'], ['append'], ['toString']],
          dica: 'O buffer mutável é montado com append e fechado com toString.',
          explicacao: 'Com String + em loop você aloca um objeto por iteração: O(n²) de cópia. StringBuilder reaproveita o mesmo array interno.' },

        { tipo: 'codigo',
          enunciado: 'Inverta uma frase palavra por palavra',
          sub: 'Receba `"java e muito bom"` e devolva `"bom muito e java"`. Use `split`, um laço decrescente e `StringBuilder`.',
          arquivo: 'InverterFrase.java',
          base: `public class InverterFrase {

    public static String inverter(String frase) {
        // 1. quebre a frase em palavras com split
        // 2. percorra do fim para o começo
        // 3. monte o resultado com StringBuilder
        return null;
    }

    public static void main(String[] args) {
        System.out.println(inverter("java e muito bom"));
    }
}`,
          testes: [
            { desc: 'Quebra a frase com `split`', re: /\.split\s*\(/ },
            { desc: 'Usa `StringBuilder` em vez de concatenar com +', re: /new\s+StringBuilder\s*\(/ },
            { desc: 'Percorre o array de trás para frente', re: /for\s*\([^)]*length\s*-\s*1[^)]*--\s*\)/ },
            { desc: 'Devolve a String montada com `toString()` ou `trim()`', re: /\.toString\s*\(\)|\.trim\s*\(\)/ },
            { desc: 'Não deixou o `return null` original', nao: /return\s+null\s*;/ },
          ],
          solucao: `public static String inverter(String frase) {
    String[] palavras = frase.split(" ");
    StringBuilder sb = new StringBuilder();
    for (int i = palavras.length - 1; i >= 0; i--) {
        sb.append(palavras[i]);
        if (i > 0) sb.append(" ");
    }
    return sb.toString();
}`,
          explicacao: 'Alternativa funcional: dividir, coletar numa lista, usar Collections.reverse e String.join.' },

        { tipo: 'qa',
          pergunta: 'Por que String é imutável em Java? Cite dois benefícios.',
          resposta: [
            { ul: [
              '**String Pool**: só é possível compartilhar o mesmo objeto entre variáveis porque ninguém pode alterá-lo.',
              '**Thread-safety grátis**: imutável nunca tem estado corrompido por concorrência.',
              '**hashCode em cache**: como o conteúdo não muda, o hash é calculado uma vez, por isso String é chave ideal de `HashMap`.',
              '**Segurança**: caminhos de arquivo, URLs e credenciais passados como String não podem ser alterados depois da validação.',
            ] },
          ] },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'fund-fluxo',
      titulo: 'Controle de fluxo e switch moderno',
      icone: '🔀',
      modulo: 3,
      ancora: '#5-controle-de-fluxo',
      teoria: [
        { h: 'Switch clássico vs moderno' },
        { code: `// clássico: precisa de break, tem fall-through
switch (dia) {
    case 1:
    case 2:
        tipo = "Dia util";
        break;
    default:
        tipo = "Fim de semana";
}

// moderno (Java 14+): sem break, pode ser expressão
String tipo = switch (dia) {
    case 1, 2, 3, 4, 5 -> "Dia util";
    case 6, 7          -> "Fim de semana";
    default            -> throw new IllegalArgumentException("Dia invalido");
};` },
        { p: 'Quando o case precisa de várias linhas, use bloco e `yield` para devolver o valor:' },
        { code: `int desconto = switch (categoria) {
    case "OURO" -> {
        registrarAuditoria(categoria);
        yield 20;
    }
    case "PRATA" -> 10;
    default      -> 0;
};` },
        { h: 'Laços' },
        { code: `for (int i = 0; i < 10; i++) { }             // contador conhecido
for (String nome : nomes) { }                 // percorrer coleção
while (temMais()) { }                         // condição no início
do { processar(); } while (temMais());        // executa ao menos uma vez

for (String nome : nomes) {
    if (nome.isBlank()) continue;   // pula esta iteração
    if (nome.equals("FIM")) break;  // sai do laço
}` },
        { nota: 'Um switch de expressão sobre enum sem `default` é validado pelo compilador: se você adicionar um valor no enum e esquecer de tratá-lo, o código não compila. É uma rede de segurança que o if/else não dá.' },
      ],
      passos: [
        { tipo: 'quiz',
          pergunta: 'Qual a principal vantagem do switch de expressão (Java 14+)?',
          opcoes: [
            'É mais rápido em tempo de execução',
            'Não tem fall-through, devolve valor e o compilador exige que todos os casos de um enum sejam cobertos',
            'Aceita qualquer tipo, inclusive `double`',
            'Substitui completamente o `if`',
          ],
          correta: 1,
          explicacao: 'A exaustividade verificada em compilação é o ganho maior: adicionar um valor no enum quebra a compilação em vez de cair silenciosamente no default.' },

        { tipo: 'completar',
          enunciado: 'Converta para switch de expressão',
          codigo: `String faixa = switch (idade / 10) {
    case 0, 1 ___ "Crianca/Adolescente";
    case 2, 3, 4, 5 -> "Adulto";
    ___ -> "Idoso";
};`,
          respostas: [['->'], ['default']],
          dica: 'A seta substitui os dois-pontos e o break.',
          explicacao: 'Como switch de expressão precisa devolver um valor sempre, o default é obrigatório quando o tipo não é um enum exaustivo.' },

        { tipo: 'flashcard',
          frente: { titulo: 'O que este código imprime?', blocos: [
            { code: `int x = 2;
switch (x) {
    case 1: System.out.print("um");
    case 2: System.out.print("dois");
    case 3: System.out.print("tres");
    default: System.out.print("outro");
}` },
          ] },
          verso: [
            { p: '**doistresoutro**' },
            { p: 'Sem `break`, o switch clássico executa em cascata (**fall-through**) a partir do case que casou. É exatamente o bug que o switch com `->` elimina.' },
          ] },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'fund-memoria',
      titulo: 'Stack, Heap e Garbage Collector',
      icone: '🧠',
      modulo: 9,
      ancora: '#6-stack-e-heap--gerenciamento-de-memória',
      teoria: [
        { tabela: {
          head: ['Stack', 'Heap'],
          rows: [
            ['Uma por thread', 'Compartilhada por toda a JVM'],
            ['Primitivos locais e **referências**', 'Todos os **objetos** e arrays'],
            ['Liberada ao sair do método', 'Liberada pelo Garbage Collector'],
            ['Muito rápida, tamanho fixo', 'Maior e mais lenta'],
            ['`StackOverflowError`', '`OutOfMemoryError`'],
          ] } },
        { code: `public void exemplo() {
    int idade = 30;                      // valor 30 na STACK
    String nome = "Ana";                 // objeto no pool (HEAP), referência na STACK
    Cliente c = new Cliente(nome, idade);// objeto na HEAP, referência na STACK
}   // ao sair, as referências somem; o objeto Cliente vira lixo coletável` },
        { h: 'Garbage Collector' },
        { p: 'O GC libera automaticamente objetos **sem nenhuma referência ativa**. Você não controla quando ele roda. `System.gc()` é apenas uma sugestão que a JVM pode ignorar.' },
        { code: `Cliente c = new Cliente("Ana");
c = null;          // o objeto ficou sem referência: elegível para coleta

List<Cliente> lista = new ArrayList<>();
lista.add(new Cliente("Bob"));
lista.clear();     // o Cliente perdeu a única referência: elegível` },
        { nota: 'Vazamento clássico em Java: coleções estáticas que só crescem, listeners nunca removidos e caches sem política de expiração. O objeto continua referenciado, então o GC nunca o libera.' },
      ],
      passos: [
        { tipo: 'quiz',
          pergunta: 'Onde fica cada coisa neste método?',
          codigo: `public void processar() {
    int total = 10;
    Pedido p = new Pedido();
}`,
          opcoes: [
            'Tudo na stack',
            'Tudo na heap',
            '`total` e a referência `p` na stack; o objeto `Pedido` na heap',
            '`total` na heap; `p` na stack',
          ],
          correta: 2,
          explicacao: 'Variáveis locais (primitivos e referências) vivem na stack do método. O objeto criado com new sempre vai para a heap.' },

        { tipo: 'qa',
          pergunta: 'Quando um objeto se torna elegível para o Garbage Collector?',
          resposta: [
            { p: 'Quando **não existe mais nenhuma referência ativa** apontando para ele a partir de uma raiz (variável local em execução, campo estático, thread ativa).' },
            { ul: [
              'A referência recebeu `null`',
              'A referência saiu de escopo (o método terminou)',
              'A referência passou a apontar para outro objeto',
              'O objeto só é referenciado por outros objetos que também viraram lixo (ilhas de isolamento: o GC detecta)',
            ] },
            { p: 'Você **não controla** o momento da coleta. `System.gc()` é uma sugestão, e `finalize()` está depreciado, então para liberar recursos use `try-with-resources`.' },
          ] },

        { tipo: 'flashcard',
          frente: { titulo: 'StackOverflowError vs OutOfMemoryError', blocos: [
            { p: 'O que causa cada um?' },
          ] },
          verso: [
            { p: '**StackOverflowError**: a stack de uma thread estourou. Causa quase sempre: recursão sem condição de parada.' },
            { code: `void loop() { loop(); }   // StackOverflowError` },
            { p: '**OutOfMemoryError**: a heap acabou. Causa: objetos demais vivos ao mesmo tempo ou vazamento de memória (coleção estática que só cresce).' },
          ] },
      ],
    },
  ],
});
