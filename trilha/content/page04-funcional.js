/* Unidade 5 · Programação Funcional (docs/page_04.md · módulos 25, 26, 27) */
Trilha.add({
  numero: 5,
  titulo: 'Programação Funcional',
  icone: 'λ',
  cor: '#ce82ff',
  prioridade: 'alta',
  doc: 'docs/page_04.md',
  modulos: [25, 26, 27],
  resumo: 'Lambdas, o pipeline de Streams e o uso correto de Optional: o bloco mais cobrado em entrevista.',
  licoes: [

    /* ------------------------------------------------------------------ */
    {
      id: 'fun-lambda',
      aula: 'fun-lambda',   // aula guiada em aula.html?id=fun-lambda
      titulo: 'Lambdas e interfaces funcionais',
      icone: '✏️',
      modulo: 25,
      resumo: 'Uma interface com um método abstrato vira sintaxe de expressão.',
      teoria: [
        { p: 'Uma **interface funcional** tem exatamente **um método abstrato**. Onde ela é esperada, você pode escrever uma lambda no lugar de uma classe anônima.' },
        { code: `@FunctionalInterface
public interface Calculadora {
    double calcular(double a, double b);
}

// classe anônima: Java 7
Calculadora soma = new Calculadora() {
    @Override public double calcular(double a, double b) { return a + b; }
};

// lambda: Java 8+
Calculadora soma = (a, b) -> a + b;` },
        { h: 'Sintaxe' },
        { code: `() -> System.out.println("oi")           // sem parâmetro
x -> x * 2                                // um parâmetro: parênteses opcionais
(x, y) -> x + y                           // dois parâmetros
(String s) -> s.length()                  // tipo explícito
x -> {                                    // corpo com bloco precisa de return
    int dobro = x * 2;
    return dobro + 1;
}` },
        { h: 'As interfaces funcionais do JDK' },
        { tabela: {
          head: ['Interface', 'Método', 'Recebe → devolve', 'Uso típico'],
          rows: [
            ['`Function<T,R>`', '`apply`', 'T → R', '`map`'],
            ['`Predicate<T>`', '`test`', 'T → boolean', '`filter`'],
            ['`Consumer<T>`', '`accept`', 'T → void', '`forEach`'],
            ['`Supplier<T>`', '`get`', '() → T', '`orElseGet`, lazy'],
            ['`UnaryOperator<T>`', '`apply`', 'T → T', '`replaceAll`'],
            ['`BinaryOperator<T>`', '`apply`', '(T,T) → T', '`reduce`'],
            ['`BiFunction<T,U,R>`', '`apply`', '(T,U) → R', '`merge`'],
          ] } },
        { code: `Function<String, Integer> tamanho = String::length;
Predicate<String> vazio = String::isBlank;
Consumer<String> imprime = System.out::println;
Supplier<List<String>> nova = ArrayList::new;

// composição
Function<Integer, Integer> dobrar = x -> x * 2;
Function<Integer, Integer> somarUm = x -> x + 1;
dobrar.andThen(somarUm).apply(5);   // 11: dobra, depois soma
dobrar.compose(somarUm).apply(5);   // 12: soma, depois dobra

Predicate<String> naoVazio = vazio.negate();
Predicate<String> valido = naoVazio.and(s -> s.length() < 50);` },
        { h: 'Method references: as 4 formas' },
        { code: `// 1. método estático
Function<String, Integer> f1 = Integer::parseInt;        // s -> Integer.parseInt(s)

// 2. método de instância de um objeto específico
Consumer<String> f2 = System.out::println;               // s -> System.out.println(s)

// 3. método de instância de um objeto arbitrário do tipo
Function<String, String> f3 = String::toUpperCase;       // s -> s.toUpperCase()

// 4. construtor
Supplier<ArrayList<String>> f4 = ArrayList::new;         // () -> new ArrayList<>()
Function<String, Produto> f5 = Produto::new;             // s -> new Produto(s)` },
        { nota: 'Lambda só captura variáveis **efetivamente finais**: que não são reatribuídas depois de inicializadas. Por isso não dá para incrementar um contador local dentro de uma lambda.' },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'fun-streams',
      aula: 'fun-streams',   // aula guiada em aula.html?id=fun-streams
      titulo: 'Streams: o pipeline',
      icone: '🌊',
      modulo: 27,
      resumo: 'Fonte → operações intermediárias (lazy) → operação terminal.',
      teoria: [
        { code: `List<String> resultado = produtos.stream()      // 1. FONTE
    .filter(p -> p.getPreco() > 100)               // 2. INTERMEDIÁRIA (lazy)
    .map(Produto::getNome)                         //    (lazy)
    .sorted()                                      //    (lazy)
    .toList();                                     // 3. TERMINAL (dispara tudo)` },
        { p: 'Nada roda até a operação terminal. Sem ela, o pipeline inteiro é ignorado, bug clássico de quem monta um stream e esquece o `collect`.' },
        { h: 'Operações intermediárias' },
        { code: `.filter(p -> p.ativo())              // seleciona
.map(Produto::getNome)               // transforma 1 → 1
.flatMap(p -> p.getTags().stream())  // achata N → 1 stream único
.distinct()                          // remove duplicatas (usa equals)
.sorted(Comparator.comparing(...))   // ordena
.limit(10)                           // pega os N primeiros (curto-circuito)
.skip(5)                             // pula os N primeiros
.peek(System.out::println)           // espia: só para depuração` },
        { h: 'map vs flatMap' },
        { code: `// map: cada pedido vira uma lista → Stream<List<Item>>
Stream<List<Item>> a = pedidos.stream().map(Pedido::getItens);

// flatMap: as listas são achatadas → Stream<Item>
List<Item> todos = pedidos.stream()
    .flatMap(pedido -> pedido.getItens().stream())
    .toList();` },
        { h: 'Operações terminais' },
        { code: `.toList()                      // Java 16+, lista imutável
.collect(Collectors.toList())
.forEach(System.out::println)
.count()
.anyMatch(p -> p.getPreco() > 1000)   // curto-circuito
.allMatch(Produto::ativo)
.noneMatch(Produto::vencido)
.findFirst()                          // Optional
.findAny()                            // Optional: útil em paralelo
.min(Comparator.comparing(Produto::getPreco))   // Optional
.max(...)` },
        { h: 'reduce' },
        { code: `// com identidade: devolve o próprio tipo
int total = numeros.stream().reduce(0, Integer::sum);

// sem identidade: devolve Optional (a lista pode estar vazia)
Optional<Integer> max = numeros.stream().reduce(Integer::max);

// acumulador de tipo diferente
double valorTotal = pedidos.stream()
    .reduce(0.0, (acc, p) -> acc + p.getValor(), Double::sum);` },
        { h: 'Collectors' },
        { code: `// agrupar
Map<String, List<Produto>> porCategoria = produtos.stream()
    .collect(Collectors.groupingBy(Produto::getCategoria));

// agrupar e contar
Map<String, Long> contagem = produtos.stream()
    .collect(Collectors.groupingBy(Produto::getCategoria, Collectors.counting()));

// agrupar e somar
Map<String, Double> soma = produtos.stream()
    .collect(Collectors.groupingBy(Produto::getCategoria,
             Collectors.summingDouble(Produto::getPreco)));

// particionar em true/false
Map<Boolean, List<Produto>> caros = produtos.stream()
    .collect(Collectors.partitioningBy(p -> p.getPreco() > 100));

// juntar em String
String nomes = produtos.stream()
    .map(Produto::getNome)
    .collect(Collectors.joining(", ", "[", "]"));

// para Map: cuidado com chave duplicada
Map<String, Double> precos = produtos.stream()
    .collect(Collectors.toMap(Produto::getNome, Produto::getPreco,
                              (antigo, novo) -> novo));   // resolve conflito` },
        { h: 'Streams de primitivos' },
        { code: `// evitam boxing e trazem estatísticas prontas
int soma = produtos.stream().mapToInt(Produto::getQuantidade).sum();
OptionalDouble media = produtos.stream().mapToDouble(Produto::getPreco).average();

IntSummaryStatistics stats = produtos.stream()
    .mapToInt(Produto::getQuantidade).summaryStatistics();
stats.getMax(); stats.getMin(); stats.getAverage(); stats.getSum();

IntStream.range(0, 5);        // 0,1,2,3,4
IntStream.rangeClosed(1, 5);  // 1,2,3,4,5` },
        { nota: 'Um stream é de **uso único**: depois da operação terminal ele está consumido. Reutilizar lança `IllegalStateException`. E evite `parallelStream()` sem medir: para coleções pequenas ele quase sempre piora.' },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'fun-optional',
      aula: 'fun-optional',   // aula guiada em aula.html?id=fun-optional
      titulo: 'Optional sem gambiarra',
      icone: '🎁',
      modulo: 26,
      resumo: 'Optional existe para eliminar o if de null, não para trocá-lo por isPresent().',
      teoria: [
        { p: '`Optional<T>` é um contêiner que **pode ou não** conter valor. Serve como **tipo de retorno** para deixar explícito que a ausência é um resultado válido.' },
        { h: 'Criação' },
        { code: `Optional<String> a = Optional.of("valor");        // NPE se for null
Optional<String> b = Optional.ofNullable(pode);   // aceita null
Optional<String> c = Optional.empty();` },
        { h: 'Consumo: do mais seguro ao menos' },
        { code: `// valor padrão pronto
String nome = optional.orElse("Desconhecido");

// valor padrão CARO: só calcula se estiver vazio
String nome = optional.orElseGet(() -> buscarPadraoNoBanco());

// lança se estiver vazio
Cliente c = optional.orElseThrow(() -> new ClienteNaoEncontradoException(id));
Cliente c = optional.orElseThrow();   // NoSuchElementException

// executa só se tiver valor
optional.ifPresent(cliente -> enviarEmail(cliente));
optional.ifPresentOrElse(this::enviar, () -> log.warn("sem cliente"));` },
        { nota: '`orElse` avalia o argumento **sempre**, mesmo com valor presente. `orElseGet` recebe um `Supplier` e só executa quando está vazio. Se o padrão envolve banco, I/O ou objeto caro, use `orElseGet`.' },
        { h: 'Encadeamento' },
        { code: `// substitui uma cascata de ifs de null
String cidade = buscarCliente(id)
    .map(Cliente::getEndereco)
    .map(Endereco::getCidade)
    .map(String::toUpperCase)
    .orElse("NAO INFORMADO");

// flatMap quando o método já devolve Optional
Optional<Endereco> e = buscarCliente(id).flatMap(Cliente::buscarEndereco);

// filter descarta o valor que não passa
Optional<Cliente> ativo = buscarCliente(id).filter(Cliente::isAtivo);` },
        { h: 'Anti-patterns' },
        { tabela: {
          head: ['Não faça', 'Faça'],
          rows: [
            ['`if (o.isPresent()) o.get()`', '`o.map(...).orElse(...)` ou `ifPresent`'],
            ['`Optional` como parâmetro de método', 'sobrecarga de método'],
            ['`Optional` como campo de classe', 'campo normal + getter que devolve Optional'],
            ['`Optional<List<T>>`', 'devolva lista vazia'],
            ['`o.orElse(null)`', 'assuma o Optional até o fim'],
          ] } },
        { code: `// ruim: só trocou o if de null por outro if
Optional<Cliente> opt = buscar(id);
if (opt.isPresent()) {
    System.out.println(opt.get().getNome());
}

// bom
buscar(id).map(Cliente::getNome).ifPresent(System.out::println);` },
        { p: 'Regra geral: `Optional` é para **retorno**. Coleção vazia já expressa ausência, então nunca devolva `Optional<List<T>>`.' },
      ],
      passos: [],
    },
  ],
});
