# Dia 5–6 — Exceções e Generics

> Módulos do curso: 16, 17
> Prioridade: 🔴 Alta

**Navegação:** [← Collections](page_02.md) | [→ Próximo: Programação Funcional](page_04.md)

---

## O que você vai dominar

- Hierarquia completa de exceções e quando usar cada tipo
- Criar exceções customizadas de domínio
- Usar `try-with-resources` e encadear exceções
- Escrever classes e métodos genéricos seguros
- Wildcards covariantes e contravariantes (PECS)

---

## 1. Hierarquia de Exceções

```
java.lang.Throwable
├── Error               → falha da JVM — NÃO tratar
│   ├── OutOfMemoryError
│   └── StackOverflowError
└── Exception
    ├── Checked         → compilador exige tratamento
    │   ├── IOException
    │   ├── SQLException
    │   └── ClassNotFoundException
    └── RuntimeException  → Unchecked — tratamento opcional
        ├── NullPointerException
        ├── IllegalArgumentException
        ├── IllegalStateException
        ├── ArrayIndexOutOfBoundsException
        └── ClassCastException
```

---

## 2. Checked vs Unchecked

### 2.1 Comparativo

| Aspecto        | Checked (`Exception`)           | Unchecked (`RuntimeException`)    |
|----------------|----------------------------------|-----------------------------------|
| Compilador     | Exige `try-catch` ou `throws`   | Não exige                         |
| Uso típico     | Erros externos recuperáveis      | Bugs e violações de contrato      |
| Exemplos       | `IOException`, `SQLException`   | `NullPointerException`            |
| API pública    | Aumenta a "carga" do chamador   | Mais limpa, sem ruído             |

### 2.2 Quando usar cada um

```java
// Checked — o chamador PODE recuperar (tentar outro arquivo, pedir novo nome...)
public String lerArquivo(Path caminho) throws IOException {
    return Files.readString(caminho);
}

// Unchecked — violação de contrato ou regra de negócio irrecuperável
public void sacar(double valor) {
    if (valor > saldo)
        throw new SaldoInsuficienteException("Saldo: " + saldo + ", solicitado: " + valor);
}
```

---

## 3. try-catch-finally e try-with-resources

### 3.1 Estrutura clássica

```java
// Capturar da mais específica para a mais genérica
try {
    conectar();
    executarQuery();
} catch (SQLTimeoutException e) {      // mais específica — primeiro
    log.warn("Timeout na query", e);
    retentar();
} catch (SQLException e) {            // mais genérica — depois
    throw new RuntimeException("Erro no banco", e); // encadeamento
} finally {
    fecharConexao(); // SEMPRE executa, com ou sem exceção
}
```

### 3.2 try-with-resources (preferido)

Qualquer objeto que implemente `AutoCloseable` é fechado automaticamente:

```java
// Recursos múltiplos — fechados em ordem inversa
try (Connection conn   = DriverManager.getConnection(url, user, pass);
     PreparedStatement stmt = conn.prepareStatement(sql);
     ResultSet rs      = stmt.executeQuery()) {

    while (rs.next()) {
        processar(rs.getString("nome"));
    }
} catch (SQLException e) {
    throw new RuntimeException("Erro ao consultar dados", e);
}
// conn, stmt e rs fechados automaticamente — mesmo em exceção
```

### 3.3 Encadeamento de exceções — preserve o stack trace

```java
// ERRADO — perde a causa original
} catch (SQLException e) {
    throw new RuntimeException("Erro no banco"); // stack trace do JDBC perdido
}

// CORRETO — encadeia a causa
} catch (SQLException e) {
    throw new RuntimeException("Erro ao buscar produto id=" + id, e); // causa preservada
}
```

---

## 4. Exceções Customizadas

### 4.1 Passo a passo para criar

```java
// 1. Crie uma classe que estende RuntimeException (preferido para negócio)
public class NegocioException extends RuntimeException {

    public NegocioException(String mensagem) {
        super(mensagem);
    }

    // Construtor com causa — para encadeamento
    public NegocioException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}

// 2. Crie exceções específicas do domínio
public class ProdutoNaoEncontradoException extends NegocioException {
    public ProdutoNaoEncontradoException(String codigo) {
        super("Produto não encontrado: " + codigo);
    }
}

public class SaldoInsuficienteException extends NegocioException {
    private final double saldoAtual;
    private final double valorSolicitado;

    public SaldoInsuficienteException(double saldoAtual, double valorSolicitado) {
        super(String.format("Saldo insuficiente. Disponível: %.2f, Solicitado: %.2f",
            saldoAtual, valorSolicitado));
        this.saldoAtual = saldoAtual;
        this.valorSolicitado = valorSolicitado;
    }

    public double getSaldoAtual()      { return saldoAtual; }
    public double getValorSolicitado() { return valorSolicitado; }
}
```

### 4.2 Boas Práticas

```java
public class CadastroServico {

    public Produto buscar(String codigo) {
        // Fail-Fast — valida primeiro, falha rápido
        Objects.requireNonNull(codigo, "código não pode ser null");
        if (codigo.isBlank())
            throw new IllegalArgumentException("código não pode ser vazio");

        return repositorio.buscarPorCodigo(codigo)
            .orElseThrow(() -> new ProdutoNaoEncontradoException(codigo));
        // lance exceção em vez de retornar null
    }
}
```

**Pratique:** Módulo `16. Introducao as excecoes`

---

## 5. Generics

### 5.1 Por que usar Generics?

```java
// Sem Generics — cast manual, sem segurança em compilação
List lista = new ArrayList();
lista.add("Java");
lista.add(42); // compila! problema em runtime
String s = (String) lista.get(1); // ClassCastException em runtime!

// Com Generics — segurança em compilação
List<String> lista = new ArrayList<>();
lista.add("Java");
// lista.add(42); // ERRO em compilação — muito melhor!
String s = lista.get(0); // sem cast
```

### 5.2 Classe genérica

```java
// T é o parâmetro de tipo — convenções: T, E (element), K (key), V (value), R (result)
public class Caixa<T> {
    private T conteudo;

    public void guardar(T item)  { this.conteudo = item; }
    public T abrir()             { return conteudo; }
    public boolean vazia()       { return conteudo == null; }
}

// Uso
Caixa<String>  caixaNome  = new Caixa<>();
Caixa<Integer> caixaIdade = new Caixa<>();
caixaNome.guardar("Alice");
caixaIdade.guardar(30);
```

### 5.3 Bounded type parameter — restringindo o tipo

```java
// T deve implementar Comparable
public <T extends Comparable<T>> T maximo(List<T> lista) {
    if (lista.isEmpty()) throw new IllegalArgumentException("Lista vazia");
    T max = lista.get(0);
    for (T item : lista) {
        if (item.compareTo(max) > 0) max = item;
    }
    return max;
}

// T deve ser Numero (ou subclasse) — acessa métodos de Number
public <T extends Number> double somar(List<T> numeros) {
    return numeros.stream().mapToDouble(Number::doubleValue).sum();
}
```

### 5.4 Método genérico

```java
public class Conversor {
    // <R> declara o tipo genérico do método — independente da classe
    public static <T, R> List<R> converter(List<T> lista, Function<T, R> funcao) {
        List<R> resultado = new ArrayList<>();
        for (T item : lista) resultado.add(funcao.apply(item));
        return resultado;
    }
}

// Uso — tipo inferido pelo compilador
List<Integer> tamanhos = Conversor.converter(nomes, String::length);
```

---

## 6. Wildcards e PECS

### 6.1 O problema sem wildcards

```java
// Não compila — List<Gato> não é subtype de List<Animal>
// mesmo Gato sendo subtype de Animal (invariância)
void processarAnimais(List<Animal> animais) { ... }
List<Gato> gatos = new ArrayList<>();
processarAnimais(gatos); // ERRO de compilação!
```

### 6.2 `? extends T` — covariância (Producer Extends)

Use quando você só **lê** da lista (a lista produz elementos):

```java
// Aceita List<Animal>, List<Gato>, List<Cachorro>...
public double calcularPesoTotal(List<? extends Animal> animais) {
    double total = 0;
    for (Animal a : animais) {  // lê como Animal — seguro
        total += a.getPeso();
    }
    return total;
    // animais.add(new Gato()); // ERRO — não pode escrever
}
```

### 6.3 `? super T` — contravariância (Consumer Super)

Use quando você só **escreve** na lista (a lista consome elementos):

```java
// Aceita List<Animal>, List<Object>...
public void copiarAnimais(List<Gato> gatos, List<? super Gato> destino) {
    for (Gato g : gatos) {
        destino.add(g);  // escreve Gato — seguro
    }
    // Object obj = destino.get(0); // só garante Object na leitura
}
```

### 6.4 PECS — Producer Extends, Consumer Super

```java
// Copia de origem (producer) para destino (consumer)
public static <T> void copiar(List<? extends T> origem,    // Producer → Extends
                               List<? super T>  destino) { // Consumer → Super
    for (T item : origem) destino.add(item);
}

// Uso
List<Integer>        ints    = List.of(1, 2, 3);
List<Number>         numeros = new ArrayList<>();
copiar(ints, numeros); // funciona!
```

### 6.5 Type Erasure

```java
// Em runtime, esses são o mesmo tipo: List
List<String>  strings  = new ArrayList<>();
List<Integer> integers = new ArrayList<>();

// Consequências:
// ✗  new T()                    — não funciona
// ✗  new ArrayList<T>()         — funciona (raw type internamente)
// ✗  if (lista instanceof List<String>)  — não compila
// ✗  new T[10]                  — não funciona (arrays genéricos proibidos)
// ✓  (T) objeto                 — unchecked cast — funciona mas gera warning
```

**Pratique:** Módulo `17. Generics`

---

## 7. Exercício Prático

Implemente do zero:

1. Crie uma classe genérica `Pilha<T>` com `push(T)`, `pop()`, `peek()` e `isEmpty()`
2. `pop()` deve lançar `PilhaVaziaException` (unchecked) quando vazia
3. Crie um método genérico `<T extends Comparable<T>> T minimo(List<T> lista)`
4. Crie um método que copia apenas os elementos `>= 0` de `List<? extends Number>` para `List<Double>`
5. Implemente `try-with-resources` com uma classe `Conexao` simulada que implementa `AutoCloseable`

---

## Checklist do Dia

- [ ] Sei distinguir Checked de Unchecked e quando criar cada uma
- [ ] Uso `try-with-resources` em vez de `finally` para fechar recursos
- [ ] Encadeio exceções preservando o stack trace original
- [ ] Escrevo classes e métodos genéricos com bounded types
- [ ] Entendo e aplico PECS (`extends` para leitura, `super` para escrita)
- [ ] Consigo explicar Type Erasure

---

**Navegação:** [← Collections](page_02.md) | [→ Próximo: Programação Funcional](page_04.md)
