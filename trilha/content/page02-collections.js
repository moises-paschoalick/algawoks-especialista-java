/* Unidade 3 · Collections (docs/page_02.md · módulos 8, 18, 19) */
Trilha.add({
  numero: 3,
  titulo: 'Collections',
  icone: '🗃️',
  cor: '#1cb0f6',
  prioridade: 'alta',
  doc: 'docs/page_02.md',
  modulos: [8, 18, 19],
  resumo: 'Escolher a estrutura certa, entender por que hashCode importa e ordenar sem improviso.',
  licoes: [

    /* ------------------------------------------------------------------ */
    {
      id: 'col-hierarquia',
      aula: 'col-hierarquia',   // aula guiada em aula.html?id=col-hierarquia
      titulo: 'Arrays e a hierarquia do framework',
      icone: '🌳',
      modulo: [8, 18],
      resumo: 'Onde cada interface entra e por que array não é Collection.',
      teoria: [
        { h: 'Array' },
        { p: 'Array tem **tamanho fixo**, definido na criação, e é o único tipo com sintaxe própria na linguagem.' },
        { code: `int[] numeros = new int[5];              // preenchido com 0
String[] nomes = {"Ana", "Bob", "Cid"};   // literal
int[][] matriz = new int[3][4];

numeros.length;                           // atributo, não método
Arrays.toString(nomes);                   // [Ana, Bob, Cid]
Arrays.sort(nomes);
Arrays.fill(numeros, 7);
int[] copia = Arrays.copyOf(numeros, 10);
int pos = Arrays.binarySearch(nomes, "Bob");  // exige array ordenado` },
        { h: 'A hierarquia' },
        { code: `Iterable
  └── Collection
        ├── List: ordenada, aceita duplicatas, acesso por índice
        ├── Set: sem duplicatas
        │     └── SortedSet → NavigableSet (TreeSet)
        └── Queue: FIFO (LinkedList, ArrayDeque, PriorityQueue)

Map (fora de Collection!): pares chave/valor
  └── SortedMap → NavigableMap (TreeMap)` },
        { nota: '`Map` **não** estende `Collection`: ele guarda pares, não elementos. Por isso não tem `iterator()`; você itera sobre `keySet()`, `values()` ou `entrySet()`.' },
        { h: 'Programe para a interface' },
        { code: `// ruim: o tipo concreto vaza para toda a assinatura
ArrayList<String> nomes = new ArrayList<>();

// bom: trocar a implementação depois não quebra nada
List<String> nomes = new ArrayList<>();
Map<String, Integer> estoque = new HashMap<>();` },
        { h: 'Coleções imutáveis' },
        { code: `List<String> fixa = List.of("a", "b");        // Java 9+, imutável
Map<String, Integer> m = Map.of("a", 1, "b", 2);
List<String> copia = List.copyOf(outraLista);

fixa.add("c");   // UnsupportedOperationException

// Arrays.asList: tamanho fixo, mas aceita set()
List<String> meio = Arrays.asList("a", "b");
meio.set(0, "z");   // ok
meio.add("c");      // UnsupportedOperationException` },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'col-list',
      aula: 'col-list',   // aula guiada em aula.html?id=col-list
      titulo: 'List: ArrayList vs LinkedList',
      icone: '📋',
      modulo: 18,
      resumo: 'A escolha que se justifica por complexidade, não por gosto.',
      teoria: [
        { tabela: {
          head: ['Operação', 'ArrayList', 'LinkedList'],
          rows: [
            ['`get(i)`', 'O(1)', 'O(n)'],
            ['`add(e)` no fim', 'O(1) amortizado', 'O(1)'],
            ['`add(0, e)` no início', 'O(n)', 'O(1)'],
            ['`remove(i)` no meio', 'O(n)', 'O(n) para achar'],
            ['Memória', 'array compacto', 'nó + 2 ponteiros por item'],
          ] } },
        { p: 'Na prática, **`ArrayList` é o padrão**. Ele ganha até em inserções pela localidade de cache. `LinkedList` só compensa quando você insere e remove muito nas pontas, e aí `ArrayDeque` costuma ser melhor ainda.' },
        { h: 'Operações do dia a dia' },
        { code: `List<String> nomes = new ArrayList<>();
nomes.add("Ana");
nomes.add(0, "Bob");           // insere na posição
nomes.set(1, "Cid");           // substitui
nomes.get(0);
nomes.remove("Bob");           // por objeto
nomes.remove(0);               // por índice: cuidado com List<Integer>!
nomes.contains("Ana");
nomes.indexOf("Ana");
nomes.size();
nomes.isEmpty();
nomes.forEach(System.out::println);` },
        { nota: 'Em `List<Integer>`, `lista.remove(1)` remove o **índice** 1; `lista.remove(Integer.valueOf(1))` remove o **valor** 1. Pegadinha clássica de entrevista.' },
        { h: 'Array ↔ List' },
        { code: `String[] array = {"a", "b", "c"};

List<String> fixa = Arrays.asList(array);          // view de tamanho fixo
List<String> mutavel = new ArrayList<>(Arrays.asList(array));
List<String> viaStream = Arrays.stream(array).toList();

String[] devolta = lista.toArray(new String[0]);` },
        { h: 'ConcurrentModificationException' },
        { p: 'Modificar a coleção durante o `for-each` quebra o iterador.' },
        { code: `// quebra
for (String nome : nomes) {
    if (nome.startsWith("A")) nomes.remove(nome);
}

// solução 1: removeIf: a mais limpa
nomes.removeIf(nome -> nome.startsWith("A"));

// solução 2: Iterator explícito
Iterator<String> it = nomes.iterator();
while (it.hasNext()) {
    if (it.next().startsWith("A")) it.remove();
}

// solução 3: itere sobre uma cópia
for (String nome : new ArrayList<>(nomes)) {
    if (nome.startsWith("A")) nomes.remove(nome);
}` },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'col-set-map',
      aula: 'col-set-map',   // aula guiada em aula.html?id=col-set-map
      titulo: 'Set, Map e o papel do hashCode',
      icone: '🔑',
      modulo: 18,
      resumo: 'Por que um objeto some do HashSet quando você esquece de sobrescrever hashCode.',
      teoria: [
        { h: 'Implementações de Set' },
        { tabela: {
          head: ['Implementação', 'Ordem', 'Busca', 'Quando usar'],
          rows: [
            ['`HashSet`', 'nenhuma', 'O(1)', 'padrão, só quero unicidade'],
            ['`LinkedHashSet`', 'de inserção', 'O(1)', 'unicidade preservando a ordem'],
            ['`TreeSet`', 'ordenada', 'O(log n)', 'preciso dos elementos ordenados'],
          ] } },
        { h: 'Como o Set detecta duplicata' },
        { ol: [
          'Calcula o `hashCode()` do elemento para achar o balde',
          'Se o balde estiver vazio, insere',
          'Se houver alguém, compara com `equals()`: igual, descarta; diferente, encadeia',
        ] },
        { code: `public class Cliente {
    private final String cpf;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Cliente outro)) return false;   // pattern matching, Java 16+
        return Objects.equals(cpf, outro.cpf);
    }

    @Override
    public int hashCode() { return Objects.hash(cpf); }
}` },
        { nota: 'Sem `hashCode()`, dois clientes com o mesmo CPF caem em baldes diferentes e o Set aceita os dois. O bug não dá exceção, só produz dado duplicado silenciosamente.' },
        { h: 'Map: operações essenciais' },
        { code: `Map<String, Integer> estoque = new HashMap<>();
estoque.put("caneta", 10);
estoque.putIfAbsent("caneta", 99);      // não sobrescreve
estoque.get("lapis");                    // null se não existe
estoque.getOrDefault("lapis", 0);        // 0: evita NPE
estoque.containsKey("caneta");
estoque.remove("caneta");

for (Map.Entry<String, Integer> e : estoque.entrySet()) {
    System.out.println(e.getKey() + " = " + e.getValue());
}
estoque.forEach((k, v) -> System.out.println(k + " = " + v));` },
        { h: 'merge e compute: contadores e agrupamentos' },
        { code: `// contar ocorrências
Map<String, Integer> contagem = new HashMap<>();
for (String palavra : palavras) {
    contagem.merge(palavra, 1, Integer::sum);
}

// agrupar em listas sem checar null
Map<String, List<Produto>> porCategoria = new HashMap<>();
for (Produto p : produtos) {
    porCategoria.computeIfAbsent(p.categoria(), k -> new ArrayList<>()).add(p);
}` },
        { h: 'Implementações de Map' },
        { tabela: {
          head: ['Implementação', 'Ordem', 'Null', 'Quando usar'],
          rows: [
            ['`HashMap`', 'nenhuma', 'aceita 1 chave null', 'padrão'],
            ['`LinkedHashMap`', 'de inserção (ou de acesso)', 'aceita', 'ordem previsível, cache LRU'],
            ['`TreeMap`', 'ordenada por chave', 'não aceita chave null', 'faixas, primeiro/último'],
            ['`ConcurrentHashMap`', 'nenhuma', 'não aceita null', 'acesso concorrente'],
          ] } },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'col-ordenacao',
      aula: 'col-ordenacao',   // aula guiada em aula.html?id=col-ordenacao
      titulo: 'Comparable e Comparator',
      icone: '↕️',
      modulo: 18,
      resumo: 'Ordem natural embutida na classe versus ordens externas combináveis.',
      teoria: [
        { h: 'Comparable: a ordem natural' },
        { p: 'A classe define sua própria ordem, implementando `compareTo`. É a ordem usada por `Collections.sort(lista)` e por `TreeSet`/`TreeMap`.' },
        { code: `public class Produto implements Comparable<Produto> {
    private String nome;
    private double preco;

    @Override
    public int compareTo(Produto outro) {
        return Double.compare(this.preco, outro.preco);   // do mais barato ao mais caro
    }
}

Collections.sort(produtos);
produtos.sort(null);` },
        { p: 'O contrato de `compareTo`: **negativo** se this vem antes, **zero** se são equivalentes, **positivo** se vem depois. Use `Integer.compare` / `Double.compare` em vez de subtrair: subtração estoura em overflow.' },
        { h: 'Comparator: ordens externas' },
        { code: `produtos.sort(Comparator.comparing(Produto::getNome));
produtos.sort(Comparator.comparingDouble(Produto::getPreco).reversed());

// múltiplos critérios: categoria asc, depois preço desc, depois nome
produtos.sort(
    Comparator.comparing(Produto::getCategoria)
              .thenComparing(Produto::getPreco, Comparator.reverseOrder())
              .thenComparing(Produto::getNome)
);

// nulos por último
produtos.sort(Comparator.comparing(Produto::getNome,
        Comparator.nullsLast(Comparator.naturalOrder())));` },
        { tabela: {
          head: ['', '`Comparable`', '`Comparator`'],
          rows: [
            ['Onde fica', 'dentro da classe', 'fora, em qualquer lugar'],
            ['Método', '`compareTo(T)`', '`compare(T, T)`'],
            ['Quantas ordens', 'uma só', 'quantas quiser'],
            ['Pacote', '`java.lang`', '`java.util`'],
            ['Use quando', 'existe uma ordem óbvia', 'a ordem depende do contexto'],
          ] } },
        { nota: 'Se a classe é de terceiros e não implementa `Comparable`, `Comparator` é a única saída. E `TreeSet`/`TreeMap` aceitam um `Comparator` no construtor.' },
        { p: 'Consistência com equals: se `compareTo` devolve 0 para objetos que `equals` considera diferentes, o `TreeSet` vai tratá-los como duplicata e descartar um deles.' },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'col-enums',
      aula: 'col-enums',   // aula guiada em aula.html?id=col-enums
      titulo: 'Enums com estado e comportamento',
      icone: '🎚️',
      modulo: 19,
      resumo: 'Enum não é lista de constantes: é uma classe com instâncias fixas.',
      teoria: [
        { p: 'Um `enum` é uma classe cujas instâncias são conhecidas em tempo de compilação. Pode ter campos, construtor, métodos e implementar interfaces.' },
        { code: `public enum StatusPedido {
    AGUARDANDO("Aguardando pagamento", true),
    PAGO("Pago", true),
    ENVIADO("A caminho", false),
    ENTREGUE("Entregue", false),
    CANCELADO("Cancelado", false);

    private final String descricao;
    private final boolean cancelavel;

    StatusPedido(String descricao, boolean cancelavel) {   // construtor é private
        this.descricao = descricao;
        this.cancelavel = cancelavel;
    }

    public String getDescricao() { return descricao; }
    public boolean podeCancelar() { return cancelavel; }
}` },
        { h: 'Comportamento por constante' },
        { code: `public enum Operacao {
    SOMA("+")      { public double aplicar(double a, double b) { return a + b; } },
    SUBTRACAO("-") { public double aplicar(double a, double b) { return a - b; } },
    MULTIPLICACAO("*") { public double aplicar(double a, double b) { return a * b; } };

    private final String simbolo;
    Operacao(String simbolo) { this.simbolo = simbolo; }

    public abstract double aplicar(double a, double b);
}

double r = Operacao.SOMA.aplicar(2, 3);   // 5.0` },
        { h: 'Operações úteis' },
        { code: `StatusPedido.values();                    // array com todas as constantes
StatusPedido.valueOf("PAGO");             // IllegalArgumentException se não existir
StatusPedido.PAGO.name();                 // "PAGO"
StatusPedido.PAGO.ordinal();              // 1: posição na declaração

// switch exaustivo: sem default, o compilador cobra os casos novos
String texto = switch (status) {
    case AGUARDANDO, PAGO -> "Em processamento";
    case ENVIADO          -> "Saiu para entrega";
    case ENTREGUE         -> "Finalizado";
    case CANCELADO        -> "Cancelado";
};

// coleções especializadas, muito mais rápidas
EnumSet<StatusPedido> ativos = EnumSet.of(StatusPedido.PAGO, StatusPedido.ENVIADO);
EnumMap<StatusPedido, Integer> contagem = new EnumMap<>(StatusPedido.class);` },
        { nota: 'Nunca persista `ordinal()` no banco: reordenar as constantes corrompe os dados antigos. Grave `name()` ou um código próprio e estável.' },
        { p: 'Enums são singletons garantidos pela JVM e podem ser comparados com `==` com segurança, e esse é inclusive o jeito preferido, porque funciona com `null` sem lançar NPE.' },
      ],
      passos: [],
    },
  ],
});
