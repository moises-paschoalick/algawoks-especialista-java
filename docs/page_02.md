# Dia 3–4 — Collections

> Módulos do curso: 8, 18, 19
> Prioridade: 🔴 Alta

**Navegação:** [← OOP](page_01.md) | [→ Próximo: Exceções e Generics](page_03.md)

---

## O que você vai dominar

- Hierarquia completa do Collections Framework
- Escolher a implementação certa para cada situação
- Iterar e remover elementos com segurança
- Ordenar com `Comparable` e `Comparator`
- Usar Enums com atributos e métodos

---

## 1. Hierarquia do Collections Framework

```
java.lang.Iterable
└── java.util.Collection
    ├── List        → elementos ordenados, permite duplicatas
    │   ├── ArrayList
    │   └── LinkedList
    ├── Set         → sem duplicatas
    │   ├── HashSet
    │   ├── LinkedHashSet
    │   └── TreeSet
    └── Queue / Deque
        └── ArrayDeque, LinkedList

java.util.Map       → pares chave → valor (não estende Collection)
    ├── HashMap
    ├── LinkedHashMap
    └── TreeMap
```

---

## 2. List

### 2.1 ArrayList vs LinkedList

| Operação              | ArrayList  | LinkedList |
|-----------------------|:----------:|:----------:|
| `get(index)`          | O(1)       | O(n)       |
| `add()` no final      | O(1)*      | O(1)       |
| `add(index, elem)`    | O(n)       | O(1)**     |
| `remove(index)`       | O(n)       | O(1)**     |
| Memória               | compacta   | nós extras |

> \* amortizado — resizing ocasional
> \** apenas se já tiver o nó em mãos; localizar pelo índice ainda é O(n)

**Quando usar `LinkedList`:** raramente — apenas quando há muitas inserções/remoções nas extremidades e zero acesso aleatório.

### 2.2 Criando e manipulando Lists

```java
// Criação
List<String> nomes = new ArrayList<>();
List<String> fixo  = List.of("Java", "Python", "Go");       // imutável (Java 9+)
List<String> copia = new ArrayList<>(List.of("a", "b"));    // mutável a partir de outra

// Operações básicas
nomes.add("Alice");
nomes.add(0, "Bob");          // insere na posição 0
nomes.set(1, "Charlie");      // substitui índice 1
nomes.remove("Bob");          // remove por valor
nomes.remove(0);              // remove por índice
boolean existe = nomes.contains("Alice");
int posicao    = nomes.indexOf("Charlie");
int tamanho    = nomes.size();

// Sublista (view — não é cópia)
List<String> sub = nomes.subList(0, 2);
```

### 2.3 Conversão Array ↔ List

```java
// Array → List imutável
String[] arr = {"a", "b", "c"};
List<String> listImutavel = Arrays.asList(arr);   // tamanho fixo!

// Array → List mutável
List<String> listMutavel = new ArrayList<>(Arrays.asList(arr));

// List → Array
String[] novo = nomes.toArray(new String[0]);  // tamanho 0 = JVM aloca certo
```

**Pratique:** Módulo `8. Trabalhando com arrays` e `18. Collections`

---

## 3. Set

### 3.1 Escolhendo a implementação

```java
// HashSet — máxima performance, sem ordem
Set<String> cidades = new HashSet<>();
cidades.add("São Paulo");
cidades.add("Rio de Janeiro");
cidades.add("São Paulo"); // ignorado — duplicata
System.out.println(cidades.size()); // 2

// LinkedHashSet — mantém ordem de inserção
Set<String> historico = new LinkedHashSet<>();
historico.add("C");
historico.add("A");
historico.add("B");
System.out.println(historico); // [C, A, B] — ordem de inserção

// TreeSet — ordem natural (implementa Comparable) ou Comparator
Set<String> ordenado = new TreeSet<>();
ordenado.add("Banana");
ordenado.add("Abacaxi");
ordenado.add("Manga");
System.out.println(ordenado); // [Abacaxi, Banana, Manga] — alfabético
```

### 3.2 Como Set detecta duplicatas?

O `Set` usa `hashCode()` e `equals()` para detectar duplicatas. Se a classe não sobrescrever esses métodos, dois objetos com os mesmos dados são considerados diferentes.

```java
public class Produto {
    private String codigo;

    // SEM equals/hashCode — HashSet não detecta duplicata
    // COM equals/hashCode — HashSet detecta

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Produto p)) return false;
        return Objects.equals(codigo, p.codigo);
    }

    @Override
    public int hashCode() { return Objects.hash(codigo); }
}
```

---

## 4. Map

### 4.1 Operações essenciais

```java
Map<String, Double> precos = new HashMap<>();

// Inserção e atualização
precos.put("Notebook", 3500.0);
precos.put("Mouse", 150.0);
precos.putIfAbsent("Teclado", 200.0); // só insere se a chave não existir

// Leitura
Double preco = precos.get("Notebook");          // null se não existir
Double seguro = precos.getOrDefault("HD", 0.0); // valor padrão se ausente

// Remoção
precos.remove("Mouse");

// Verificações
precos.containsKey("Notebook");
precos.containsValue(3500.0);
precos.size();

// Iteração — 3 formas
precos.forEach((chave, valor) -> System.out.println(chave + ": " + valor));

for (Map.Entry<String, Double> entry : precos.entrySet()) {
    System.out.println(entry.getKey() + " → " + entry.getValue());
}

precos.keySet().forEach(System.out::println);
```

### 4.2 Escolhendo a implementação de Map

```java
// Performance máxima — sem ordem
Map<Long, Produto> catalogo = new HashMap<>();

// Performance + ordem de inserção
Map<String, Double> carrinhoOrdenado = new LinkedHashMap<>();

// Chaves em ordem natural (String = alfabético, Integer = numérico)
Map<String, Double> tabelaAlfabetica = new TreeMap<>();
```

### 4.3 Merge e Compute

```java
// merge — soma valores ao adicionar ao mapa
Map<String, Integer> contagem = new HashMap<>();
palavras.forEach(p ->
    contagem.merge(p, 1, Integer::sum) // se existe: soma; se não existe: insere 1
);

// computeIfAbsent — cria lista se chave não existir
Map<String, List<String>> grupos = new HashMap<>();
grupos.computeIfAbsent("frutas", k -> new ArrayList<>()).add("Maçã");
grupos.computeIfAbsent("frutas", k -> new ArrayList<>()).add("Banana");
// grupos = {frutas=[Maçã, Banana]}
```

---

## 5. Iteração Segura e Remoção

### O problema: ConcurrentModificationException

```java
List<String> nomes = new ArrayList<>(List.of("Ana", "Bob", "Carlos"));

// ERRADO — modifica enquanto itera com for-each
for (String nome : nomes) {
    if (nome.startsWith("B")) nomes.remove(nome); // ConcurrentModificationException!
}
```

### As três soluções

```java
// 1. Iterator (clássico — qualquer versão Java)
Iterator<String> it = nomes.iterator();
while (it.hasNext()) {
    if (it.next().startsWith("B")) it.remove(); // seguro
}

// 2. removeIf (Java 8+ — mais conciso)
nomes.removeIf(nome -> nome.startsWith("B"));

// 3. Stream + collect (cria nova lista — imutável por padrão)
List<String> filtrados = nomes.stream()
    .filter(nome -> !nome.startsWith("B"))
    .collect(Collectors.toList());
```

---

## 6. Ordenação

### 6.1 Comparable — ordem natural embutida na classe

```java
public class Produto implements Comparable<Produto> {
    private String nome;
    private BigDecimal preco;

    @Override
    public int compareTo(Produto outro) {
        return this.nome.compareTo(outro.nome); // ordem alfabética pelo nome
    }
}

List<Produto> produtos = new ArrayList<>(...);
Collections.sort(produtos); // usa compareTo
```

### 6.2 Comparator — ordem externa, múltiplos critérios

```java
// Ordenação por preço
Comparator<Produto> porPreco = Comparator.comparing(Produto::getPreco);

// Múltiplos critérios — preço crescente, nome como desempate
Comparator<Produto> porPrecoENome = Comparator
    .comparing(Produto::getPreco)
    .thenComparing(Produto::getNome);

// Inverso
Comparator<Produto> maisCaroPrimeiro = porPreco.reversed();

produtos.sort(porPrecoENome);

// Null-safe
Comparator<Produto> nullSafe = Comparator
    .comparing(Produto::getPreco, Comparator.nullsLast(Comparator.naturalOrder()));
```

---

## 7. Enums

### 7.1 Enum com atributos e métodos

```java
public enum StatusPedido {
    PENDENTE("Aguardando pagamento", false),
    PAGO("Pagamento confirmado", true),
    ENVIADO("Em transporte", true),
    ENTREGUE("Entregue ao destinatário", true),
    CANCELADO("Pedido cancelado", false);

    private final String descricao;
    private final boolean ativo;

    StatusPedido(String descricao, boolean ativo) {
        this.descricao = descricao;
        this.ativo = ativo;
    }

    public String getDescricao() { return descricao; }
    public boolean isAtivo()     { return ativo; }
}
```

### 7.2 Operações com Enum

```java
// Obtendo todos os valores
for (StatusPedido status : StatusPedido.values()) {
    System.out.println(status.name() + " → " + status.getDescricao());
}

// Convertendo de String
StatusPedido status = StatusPedido.valueOf("PAGO");

// Switch com Enum
String icone = switch (status) {
    case PENDENTE  -> "⏳";
    case PAGO      -> "✅";
    case CANCELADO -> "❌";
    default        -> "📦";
};

// Filtrando enums ativos
List<StatusPedido> ativos = Arrays.stream(StatusPedido.values())
    .filter(StatusPedido::isAtivo)
    .collect(Collectors.toList());
```

**Pratique:** Módulo `19. Enumeracoes`

---

## 8. Exercício Prático

Implemente do zero, sem consultar:

1. Crie uma classe `GerenciadorDeProdutos` com:
   - `Map<String, Produto>` indexado pelo código do produto
   - `List<Produto>` para manter ordem de inserção
2. Implemente `adicionar(Produto)`, `removerPorCodigo(String)`, `buscarPorNome(String)`
3. Crie um `Set<String>` de categorias únicas a partir da lista
4. Ordene os produtos por preço decrescente e depois por nome
5. Remova todos os produtos com estoque zero usando `removeIf`

---

## Checklist do Dia

- [ ] Sei escolher entre ArrayList, LinkedList, HashSet, TreeSet, HashMap, TreeMap
- [ ] Entendo por que `hashCode()` + `equals()` são necessários para Set/Map
- [ ] Consigo remover elementos durante iteração sem exceção
- [ ] Implemento `Comparable` e `Comparator` com múltiplos critérios
- [ ] Crio Enums com atributos, métodos e uso em switch

---

**Navegação:** [← OOP](page_01.md) | [→ Próximo: Exceções e Generics](page_03.md)
