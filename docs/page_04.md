# Dia 7–8 — Programação Funcional

> Módulos do curso: 25, 26, 27
> Prioridade: 🔴 Alta

**Navegação:** [← Exceções e Generics](page_03.md) | [→ Próximo: JDBC e Repository](page_05.md)

---

## O que você vai dominar

- Interfaces funcionais e lambdas
- Method references nas 4 formas
- Pipeline completo de Streams com todas as operações
- Optional sem anti-patterns
- Collectors avançados: `groupingBy`, `joining`, `toMap`

---

## 1. Interfaces Funcionais e Lambdas

### 1.1 O que é uma interface funcional

Uma interface com **exatamente um método abstrato** (SAM — Single Abstract Method). Pode ter métodos `default` e `static`.

```java
@FunctionalInterface // anotação opcional — garante o contrato em compilação
public interface Transformador<T, R> {
    R transformar(T entrada);
}

// Implementação com lambda
Transformador<String, Integer> tamanho = s -> s.length();
Transformador<String, String>  maiusculo = String::toUpperCase;
```

### 1.2 Interfaces funcionais do JDK — as mais usadas

| Interface           | Assinatura       | Uso                              |
|---------------------|------------------|----------------------------------|
| `Function<T,R>`     | `T → R`          | Transformação                    |
| `Predicate<T>`      | `T → boolean`    | Filtragem, teste de condição     |
| `Consumer<T>`       | `T → void`       | Efeito colateral (print, save)   |
| `Supplier<T>`       | `() → T`         | Criação lazy, factory            |
| `UnaryOperator<T>`  | `T → T`          | Transformação do mesmo tipo      |
| `BiFunction<T,U,R>` | `(T,U) → R`      | Duas entradas, uma saída         |
| `Comparator<T>`     | `(T,T) → int`    | Ordenação                        |

```java
Function<String, Integer> fn        = String::length;
Predicate<String>         predicate = s -> s.length() > 3;
Consumer<String>          consumer  = System.out::println;
Supplier<LocalDate>       supplier  = LocalDate::now;
UnaryOperator<String>     operator  = String::toUpperCase;
BiFunction<String,String,String> concat = (a, b) -> a + " " + b;

// Composição de funções
Function<String, String> pipeline = fn
    .andThen(n -> n * 2)      // Function → Function (encadeia)
    .compose(String::trim);   // executa String::trim ANTES

Predicate<String> composto = predicate.and(s -> s.startsWith("J"))
                                       .or(s -> s.equals("OK"))
                                       .negate();
```

---

## 2. Method References — 4 Formas

```java
// Forma 1 — Método estático
//  Classe::metodoEstatico
Function<String, Integer> f1 = Integer::parseInt;
// equivalente: s -> Integer.parseInt(s)

// Forma 2 — Método de instância de objeto específico
String prefixo = "Hello";
Predicate<String> f2 = prefixo::startsWith;
// equivalente: s -> prefixo.startsWith(s)

// Forma 3 — Método de instância de tipo arbitrário
Function<String, String> f3 = String::toUpperCase;
// equivalente: s -> s.toUpperCase()

// Forma 4 — Construtor
Supplier<ArrayList<String>> f4 = ArrayList::new;
// equivalente: () -> new ArrayList<>()

Function<String, Produto> criarProduto = Produto::new;
// equivalente: nome -> new Produto(nome)
```

---

## 3. Streams API — Pipeline Completo

### 3.1 Modelo mental

```
Fonte (Collection, Array, arquivos...)
    └── stream()
        ├── [operações intermediárias — LAZY]
        │   filter(), map(), flatMap(), sorted(), distinct(), limit(), skip(), peek()
        └── [operação terminal — EAGER — dispara o pipeline]
            collect(), forEach(), count(), reduce(), findFirst(), anyMatch(), min(), max()
```

> **Lazy**: nenhuma operação intermediária executa até uma terminal ser chamada.
> **Streams não são reutilizáveis** — após a operação terminal, o stream está fechado.

### 3.2 Operações intermediárias

```java
List<Produto> produtos = carregarProdutos();

// filter — filtra elementos
List<Produto> caros = produtos.stream()
    .filter(p -> p.getPreco().compareTo(new BigDecimal("100")) > 0)
    .collect(Collectors.toList());

// map — transforma 1:1
List<String> nomes = produtos.stream()
    .map(Produto::getNome)
    .collect(Collectors.toList());

// flatMap — achata coleções aninhadas (1:N)
List<String> todasTags = produtos.stream()
    .flatMap(p -> p.getTags().stream()) // cada produto tem List<String> de tags
    .distinct()
    .sorted()
    .collect(Collectors.toList());

// sorted — ordenação
List<Produto> ordenados = produtos.stream()
    .sorted(Comparator.comparing(Produto::getPreco).thenComparing(Produto::getNome))
    .collect(Collectors.toList());

// distinct, limit, skip
produtos.stream()
    .map(Produto::getCategoria)
    .distinct()        // remove duplicatas (usa equals)
    .limit(5)          // máximo 5 resultados
    .skip(1)           // pula o primeiro
    .forEach(System.out::println);

// peek — inspecionar sem consumir (útil para debug)
produtos.stream()
    .peek(p -> log.debug("Processando: {}", p.getNome()))
    .filter(Produto::isAtivo)
    .peek(p -> log.debug("Ativo: {}", p.getNome()))
    .forEach(processar);
```

### 3.3 Operações terminais

```java
// count
long ativos = produtos.stream().filter(Produto::isAtivo).count();

// anyMatch / allMatch / noneMatch — curto-circuito (para ao achar a resposta)
boolean temEstoque   = produtos.stream().anyMatch(p -> p.getEstoque() > 0);
boolean todosAtivos  = produtos.stream().allMatch(Produto::isAtivo);
boolean semVencidos  = produtos.stream().noneMatch(Produto::isVencido);

// findFirst / findAny — retorna Optional
Optional<Produto> primeiro = produtos.stream()
    .filter(p -> p.getCategoria().equals("Eletrônicos"))
    .findFirst();

// min / max — retorna Optional
Optional<Produto> maisBarato = produtos.stream()
    .min(Comparator.comparing(Produto::getPreco));

// forEach
produtos.stream()
    .filter(Produto::isAtivo)
    .forEach(p -> notificacoes.enviar(p.getId()));
```

### 3.4 reduce — operação de redução

```java
// Soma com reduce
BigDecimal totalEmEstoque = produtos.stream()
    .map(p -> p.getPreco().multiply(new BigDecimal(p.getEstoque())))
    .reduce(BigDecimal.ZERO, BigDecimal::add); // (identidade, acumulador)

// Sem identidade — retorna Optional
Optional<BigDecimal> maiorPreco = produtos.stream()
    .map(Produto::getPreco)
    .reduce(BigDecimal::max);

// String reduce
String listaNomes = produtos.stream()
    .map(Produto::getNome)
    .reduce("", (a, b) -> a.isEmpty() ? b : a + ", " + b);
```

### 3.5 collect — coletando resultados

```java
// Para List, Set, Map
List<Produto>       lista    = stream.collect(Collectors.toList());
Set<String>         conjunto = stream.collect(Collectors.toSet());
List<Produto>       imutavel = stream.collect(Collectors.toUnmodifiableList()); // Java 10+

// joining — concatenar strings
String csv = produtos.stream()
    .map(Produto::getNome)
    .collect(Collectors.joining(", ", "[", "]")); // [Notebook, Mouse, Teclado]

// toMap
Map<String, Produto> porCodigo = produtos.stream()
    .collect(Collectors.toMap(
        Produto::getCodigo,   // chave
        p -> p,               // valor
        (a, b) -> a           // merge function — em caso de chave duplicada, fica o primeiro
    ));

// groupingBy — agrupa em Map<Chave, List<Valor>>
Map<String, List<Produto>> porCategoria = produtos.stream()
    .collect(Collectors.groupingBy(Produto::getCategoria));

// groupingBy com downstream collector
Map<String, Long> quantidadePorCategoria = produtos.stream()
    .collect(Collectors.groupingBy(Produto::getCategoria, Collectors.counting()));

Map<String, BigDecimal> totalPorCategoria = produtos.stream()
    .collect(Collectors.groupingBy(
        Produto::getCategoria,
        Collectors.reducing(BigDecimal.ZERO, Produto::getPreco, BigDecimal::add)
    ));

// partitioningBy — divide em Map<Boolean, List>
Map<Boolean, List<Produto>> particao = produtos.stream()
    .collect(Collectors.partitioningBy(Produto::isAtivo));
List<Produto> ativos   = particao.get(true);
List<Produto> inativos = particao.get(false);
```

### 3.6 Streams de primitivos — evitam boxing

```java
// IntStream, LongStream, DoubleStream
int[] numeros = {1, 2, 3, 4, 5};

IntStream.of(numeros).sum();       // sem boxing
IntStream.range(1, 11)             // 1 a 10
    .filter(n -> n % 2 == 0)
    .forEach(System.out::println);

// Converter para primitivo
int soma = produtos.stream()
    .mapToInt(p -> p.getEstoque()) // Stream<Produto> → IntStream
    .sum();

double media = produtos.stream()
    .mapToDouble(p -> p.getPreco().doubleValue())
    .average()
    .orElse(0.0);
```

---

## 4. Optional

### 4.1 Criação

```java
Optional<String> vazio     = Optional.empty();
Optional<String> comValor  = Optional.of("Java");         // NullPointerException se null
Optional<String> nullable  = Optional.ofNullable(valor);  // seguro para null
```

### 4.2 Consumo — do mais ao menos seguro

```java
Optional<Produto> opt = repositorio.buscar(id);

// orElse — sempre avalia o argumento (mesmo se presente)
Produto p1 = opt.orElse(Produto.padrao());

// orElseGet — lazy, só executa se ausente (preferido quando criação é custosa)
Produto p2 = opt.orElseGet(() -> criarProdutoPadrao());

// orElseThrow — lança exceção se ausente
Produto p3 = opt.orElseThrow(() -> new ProdutoNaoEncontradoException(id));

// ifPresent — executa ação só se presente
opt.ifPresent(p -> enviarNotificacao(p));

// ifPresentOrElse — um ou outro (Java 9+)
opt.ifPresentOrElse(
    p -> processar(p),
    () -> log.warn("Produto não encontrado: {}", id)
);
```

### 4.3 Encadeamento

```java
// map → transforma o valor se presente
Optional<String> nome = opt.map(Produto::getNome);

// filter → mantém o Optional só se a condição for verdadeira
Optional<Produto> ativo = opt.filter(Produto::isAtivo);

// flatMap → evita Optional<Optional<T>>
Optional<String> cidade = opt
    .flatMap(p -> p.getEndereco())    // retorna Optional<Endereco>
    .map(Endereco::getCidade);        // retorna Optional<String>

// Pipeline completo
String resultado = repositorio.buscar(id)
    .filter(Produto::isAtivo)
    .map(Produto::getNome)
    .map(String::toUpperCase)
    .orElse("PRODUTO INDISPONÍVEL");
```

### 4.4 Anti-patterns — O que NUNCA fazer

```java
// 1. isPresent() + get() — equivale a testar null manualmente
if (opt.isPresent()) {
    return opt.get(); // ANTI-PATTERN
}

// 2. Optional como parâmetro de método
public void processar(Optional<String> nome) { ... } // ERRADO

// 3. Optional como campo de classe
public class Produto {
    private Optional<String> descricao; // ERRADO — não serializa bem
}

// 4. Optional em Collections
List<Optional<Produto>> lista; // ERRADO — prefira filtrar nulls antes
```

---

## 5. Exercício Prático

Implemente do zero um pipeline completo:

Dado uma `List<Pedido>` onde `Pedido` tem: `id`, `cliente (String)`, `valor (BigDecimal)`, `status (Enum)`, `itens (List<Item>)`:

1. Filtre apenas pedidos `CONFIRMADOS`
2. Agrupe por cliente em `Map<String, List<Pedido>>`
3. Para cada grupo, calcule o valor total (`reduce` ou `Collectors.summingDouble`)
4. Retorne os 3 clientes com maior valor total
5. Use `Optional` para buscar um pedido por id, lançando exceção customizada se não encontrar
6. Crie um relatório em String com `Collectors.joining` listando: `cliente: totalFormatado`

---

## Checklist do Dia

- [ ] Sei as 5 interfaces funcionais principais e quando usar cada uma
- [ ] Domino as 4 formas de method reference
- [ ] Consigo montar um pipeline de Streams com filter, map, flatMap e collect
- [ ] Uso `groupingBy`, `joining` e `toMap` nos Collectors
- [ ] Uso Optional sem `isPresent()` + `get()`
- [ ] Sei a diferença entre `orElse` e `orElseGet`

---

**Navegação:** [← Exceções e Generics](page_03.md) | [→ Próximo: JDBC e Repository](page_05.md)
