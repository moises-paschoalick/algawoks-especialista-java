# Reflection API e Anotações

> Módulos do curso: 35
> Prioridade: 🟡 Média

**Navegação:** [← I/O e Serialização](page_08.md) | [→ Próximo: Boas Práticas e Patterns](page_10.md)

---

## O que você vai dominar

- Inspecionar classes, campos e métodos em runtime
- Quebrar encapsulamento com `setAccessible`
- Criar e processar anotações customizadas
- Entender `@Target` e `@Retention`
- Caso de uso real: gerador de CSV com anotações

---

## 1. O que é Reflection?

Reflection é a capacidade de um programa **inspecionar e modificar sua própria estrutura** em tempo de execução.

**Sem Reflection:** o código conhece as classes em tempo de compilação.
**Com Reflection:** o código pode descobrir, inspecionar e invocar classes que só serão conhecidas em runtime.

**Casos de uso reais:**
- Hibernate/JPA — lê `@Entity`, `@Column` para mapear tabelas
- Spring — descobre `@Component`, `@Autowired` para injetar dependências
- Jackson/Gson — serializa objetos para JSON sem código manual
- JUnit — descobre métodos `@Test` para executar
- Frameworks em geral — o que faz a "mágica" acontecer

---

## 2. Obtendo o objeto Class

```java
// Forma 1 — a partir do tipo (compile-time)
Class<String> clazz1 = String.class;

// Forma 2 — a partir de uma instância
String texto = "Java";
Class<?> clazz2 = texto.getClass();

// Forma 3 — pelo nome completo (runtime — carregamento dinâmico)
Class<?> clazz3 = Class.forName("java.lang.String");
// Class.forName("com.meuapp.Produto") — carrega classe pelo nome

// Nota: 'class' é palavra reservada em Java, por isso convenção usa 'clazz' (com z)
```

---

## 3. Inspecionando Campos (Fields)

```java
public class Produto {
    private String nome;
    private BigDecimal preco;
    protected int estoque;
    public boolean ativo;
}
```

```java
Class<Produto> clazz = Produto.class;

// getDeclaredFields() — todos os campos da classe (private incluso), sem herança
Field[] todosCampos = clazz.getDeclaredFields();

// getFields() — apenas campos PUBLIC, incluindo herdados
Field[] publicos = clazz.getFields();

for (Field campo : todosCampos) {
    System.out.println(campo.getName());                    // nome
    System.out.println(campo.getType().getSimpleName());   // tipo
    System.out.println(Modifier.isPrivate(campo.getModifiers())); // modificador
}
```

### 3.1 Lendo e escrevendo valores de campos

```java
Produto produto = new Produto("Notebook", new BigDecimal("3500.00"), 10, true);
Field campoPrimo = Produto.class.getDeclaredField("nome");

// setAccessible(true) — permite acesso a campos private
// sem isso: IllegalAccessException
campoPrimo.setAccessible(true);

// Ler valor
String nome = (String) campoPrimo.get(produto);  // "Notebook"

// Escrever valor
campoPrimo.set(produto, "Notebook Pro");
System.out.println(produto.getNome()); // "Notebook Pro"
```

---

## 4. Inspecionando Métodos

```java
Class<?> clazz = Produto.class;

// Todos os métodos declarados (sem herança), incluindo private
Method[] metodos = clazz.getDeclaredMethods();

// Método específico — nome + tipos dos parâmetros
Method getNome = clazz.getMethod("getNome");           // apenas public
Method setNome = clazz.getMethod("setNome", String.class);

// Invocar método via reflection
Produto p = new Produto("Notebook", ...);
String resultado = (String) getNome.invoke(p);         // "Notebook"

setNome.invoke(p, "Mouse"); // equivale a p.setNome("Mouse")
```

---

## 5. Inspecionando Construtores

```java
// Obter construtor
Constructor<Produto> construtor = Produto.class.getConstructor(
    String.class, BigDecimal.class, int.class, boolean.class
);

// Instanciar via reflection
Produto novo = construtor.newInstance("Teclado", new BigDecimal("200"), 50, true);

// Construtor privado (singleton, factory)
Constructor<Singleton> privado = Singleton.class.getDeclaredConstructor();
privado.setAccessible(true);
Singleton instancia = privado.newInstance();
```

---

## 6. Anotações Customizadas

### 6.1 Estrutura de uma anotação

```java
// Meta-anotações — descrevem a anotação em si
@Target(ElementType.FIELD)           // onde pode ser aplicada
@Retention(RetentionPolicy.RUNTIME)  // quando fica disponível
public @interface Campo {
    // Parâmetros (métodos sem corpo)
    boolean maiusculo() default false; // com valor padrão
    String alias() default "";         // "" = sem alias
    boolean obrigatorio() default true;
}
```

### 6.2 @Target — onde aplicar

```java
@Target({ElementType.FIELD, ElementType.METHOD}) // múltiplos targets
@Target(ElementType.TYPE)       // classe, interface ou enum
@Target(ElementType.FIELD)      // atributo de instância
@Target(ElementType.METHOD)     // método
@Target(ElementType.PARAMETER)  // parâmetro de método
@Target(ElementType.CONSTRUCTOR)// construtor
```

### 6.3 @Retention — por quanto tempo fica disponível

| Retention  | Disponível em                              | Uso típico                   |
|------------|--------------------------------------------|------------------------------|
| `SOURCE`   | Só no código-fonte (compilador descarta)   | `@Override`, `@SuppressWarnings` |
| `CLASS`    | No `.class` (padrão)                       | Bytecode tools               |
| `RUNTIME`  | Em tempo de execução via Reflection        | Spring, JPA, JUnit           |

> Para usar anotações com Reflection, **obrigatoriamente** use `RUNTIME`.

### 6.4 Aplicando a anotação

```java
public class Cliente {
    @Campo(maiusculo = true)
    private String nome;

    @Campo(alias = "email_cliente")
    private String email;

    @Campo(obrigatorio = false)
    private String telefone;

    private transient String senha; // campo sem @Campo — será ignorado
}
```

---

## 7. Caso de Uso Real: Gerador de CSV

```java
// Passo 1 — Anotação
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Campo {
    boolean maiusculo() default false;
    String alias() default ""; // se vazio, usa o nome do campo
}

// Passo 2 — Classe de domínio com anotações
public class Cliente {
    @Campo(maiusculo = true)
    private String nome;

    @Campo
    private String email;

    @Campo(alias = "dt_nascimento")
    private LocalDate dataNascimento;

    private String senha; // sem @Campo — não aparece no CSV
}

// Passo 3 — Gerador de CSV via Reflection
public class GeradorCSV {

    public static <T> String gerar(Class<T> clazz, List<T> objetos) {
        Field[] campos = clazz.getDeclaredFields();

        // Filtra apenas campos com @Campo
        List<Field> camposCSV = Arrays.stream(campos)
            .filter(f -> f.isAnnotationPresent(Campo.class))
            .collect(Collectors.toList());

        // Cabeçalho
        String cabecalho = camposCSV.stream()
            .map(f -> {
                Campo anotacao = f.getAnnotation(Campo.class);
                return anotacao.alias().isEmpty() ? f.getName() : anotacao.alias();
            })
            .collect(Collectors.joining(";"));

        // Linhas
        String linhas = objetos.stream()
            .map(obj -> gerarLinha(obj, camposCSV))
            .collect(Collectors.joining("\n"));

        return cabecalho + "\n" + linhas;
    }

    private static String gerarLinha(Object obj, List<Field> campos) {
        return campos.stream()
            .map(campo -> {
                try {
                    campo.setAccessible(true);
                    Campo anotacao = campo.getAnnotation(Campo.class);
                    Object valor = campo.get(obj);
                    String texto = valor == null ? "" : valor.toString();
                    return anotacao.maiusculo() ? texto.toUpperCase() : texto;
                } catch (IllegalAccessException e) {
                    throw new RuntimeException("Erro ao acessar campo: " + campo.getName(), e);
                }
            })
            .collect(Collectors.joining(";"));
    }
}

// Passo 4 — Uso
List<Cliente> clientes = List.of(
    new Cliente("Alice", "alice@email.com", LocalDate.of(1990, 5, 10), "senha123"),
    new Cliente("Bob",   "bob@email.com",   LocalDate.of(1985, 8, 22), "senha456")
);

String csv = GeradorCSV.gerar(Cliente.class, clientes);
System.out.println(csv);
// NOME;email;dt_nascimento
// ALICE;alice@email.com;1990-05-10
// BOB;bob@email.com;1985-08-22
```

**Pratique:** Módulo `35. Reflection API`

---

## 8. Classes Seladas (Java 17)

Classes `sealed` restringem a hierarquia de herança a um conjunto fechado e conhecido.

```java
// Sealed class — só Circulo, Retangulo e Triangulo podem estender
public sealed class Forma permits Circulo, Retangulo, Triangulo {}

public final class Circulo extends Forma {      // final — não pode ser estendida
    private double raio;
}

public final class Retangulo extends Forma {
    private double largura, altura;
}

public non-sealed class Triangulo extends Forma { // non-sealed — pode ser estendida
    private double base, altura;
}

// Pattern matching com switch (Java 17+)
double area = switch (forma) {
    case Circulo c     -> Math.PI * c.raio() * c.raio();
    case Retangulo r   -> r.largura() * r.altura();
    case Triangulo t   -> (t.base() * t.altura()) / 2;
    // sem default necessário — compilador sabe que são as únicas opções
};
```

---

## 9. Exercício Prático

Implemente do zero:

1. Crie uma anotação `@Validacao(minLength = 0, maxLength = 255, obrigatorio = true)` para campos `String`
2. Crie uma classe `Formulario` com campos anotados: `nome (min=2, max=100)`, `email (obrigatorio)`, `telefone (obrigatorio=false)`
3. Implemente um `Validador` que:
   - Usa Reflection para inspecionar os campos
   - Verifica as regras da anotação `@Validacao`
   - Retorna uma `List<String>` com as mensagens de erro
4. Teste com uma instância válida e outra inválida

---

## Checklist do Dia

- [ ] Consigo obter o objeto `Class` pelas 3 formas
- [ ] Leio e escrevo campos `private` com `setAccessible(true)`
- [ ] Invoco métodos via `Method.invoke()`
- [ ] Crio anotações customizadas com `@Target` e `@Retention(RUNTIME)`
- [ ] Leio anotações em runtime com `isAnnotationPresent()` e `getAnnotation()`
- [ ] Entendo quando usar `RUNTIME` vs `SOURCE` vs `CLASS`
- [ ] Sei para que serve `sealed class`

---

**Navegação:** [← I/O e Serialização](page_08.md) | [→ Próximo: Boas Práticas e Patterns](page_10.md)
