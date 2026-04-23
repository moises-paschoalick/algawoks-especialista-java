# Dia 1–2 — OOP Completo

> Módulos do curso: 5, 10, 11, 12, 13, 14, 15
> Prioridade: 🔴 Alta

**Navegação:** [← README](../README.md) | [→ Próximo: Collections](page_02.md)

---

## O que você vai dominar

- Os 4 pilares da OOP com exemplos de código
- Diferença prática entre interface e classe abstrata
- Contratos `equals()` + `hashCode()`
- Records, construtores e visibilidade
- Composição vs herança
- Padrões de encapsulamento

---

## 1. Os 4 Pilares da OOP

### 1.1 Encapsulamento

Ocultar o estado interno da classe. O mundo externo acessa apenas o que for explicitamente exposto.

**Passo a passo:**

1. Declare todos os atributos como `private`
2. Crie getters para leitura
3. Crie setters com validação quando necessário
4. Nunca exponha coleções internas diretamente — retorne cópias ou views imutáveis

```java
public class ContaBancaria {
    private double saldo;           // 1. atributo privado
    private final int numero;

    public ContaBancaria(int numero, double saldoInicial) {
        if (saldoInicial < 0) throw new IllegalArgumentException("Saldo não pode ser negativo");
        this.numero = numero;
        this.saldo = saldoInicial;
    }

    public double getSaldo() { return saldo; }       // 2. getter simples

    public void depositar(double valor) {             // 3. setter com validação
        if (valor <= 0) throw new IllegalArgumentException("Valor deve ser positivo");
        this.saldo += valor;
    }

    public void sacar(double valor) {
        if (valor > saldo) throw new IllegalArgumentException("Saldo insuficiente");
        this.saldo -= valor;
    }
}
```

**Pratique:** Módulo `11. Encapsulamento, JavaBens e Recoreds`

---

### 1.2 Herança

Uma classe filha reutiliza e especializa o comportamento da classe pai.

**Passo a passo:**

1. Identifique o comportamento comum → vai para a superclasse
2. Identifique o comportamento específico → vai para a subclasse com `@Override`
3. Chame a implementação do pai com `super.metodo()` quando necessário
4. Marque métodos que não devem ser sobrescritos com `final`

```java
// Superclasse — comportamento comum
public class Conta {
    protected double saldo;

    public void depositar(double valor) {
        this.saldo += valor;
    }

    // final — não pode ser sobrescrito
    public final double getSaldo() { return saldo; }

    // pode ser sobrescrito — comportamento padrão
    public double getLimite() { return 0; }
}

// Subclasse — especializa
public class ContaEspecial extends Conta {
    private double limite;

    public ContaEspecial(double limite) { this.limite = limite; }

    @Override
    public double getLimite() { return limite; } // especialização
}
```

**Atenção:** Sempre que sobrescrever `equals()`, sobrescreva `hashCode()` também.

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Conta c = (Conta) o;
    return this.numero == c.numero && this.agencia == c.agencia;
}

@Override
public int hashCode() {
    return Objects.hash(numero, agencia);
}
```

**Pratique:** Módulo `12. Heranca`

---

### 1.3 Polimorfismo

Objetos de tipos diferentes respondem à mesma mensagem de formas distintas.

**Dois tipos:**

| Tipo | Quando resolve | Mecanismo |
|------|---------------|-----------|
| Sobrecarga (overload) | Compilação | Mesmo nome, parâmetros diferentes |
| Sobrescrita (override) | Runtime | `@Override`, mesma assinatura |

```java
// Sobrecarga — resolvida em compilação
public class Calculadora {
    public double somar(int a, int b)       { return a + b; }
    public double somar(double a, double b) { return a + b; }
    public double somar(int a, int b, int c){ return a + b + c; }
}

// Sobrescrita — resolvida em runtime (polimorfismo real)
public abstract class Animal {
    public abstract String emitirSom();
}

public class Cachorro extends Animal {
    @Override public String emitirSom() { return "Au!"; }
}

public class Gato extends Animal {
    @Override public String emitirSom() { return "Miau!"; }
}

// Em uso — polimorfismo em ação
List<Animal> animais = List.of(new Cachorro(), new Gato(), new Cachorro());
animais.forEach(a -> System.out.println(a.emitirSom())); // Au! Miau! Au!
```

**Pratique:** Módulo `13. Polimorfismo e classes abstratas`

---

### 1.4 Abstração

Modelar o essencial, ocultar os detalhes de implementação.

**Quando usar classe abstrata vs interface:**

```java
// Classe abstrata — tem estado + comportamento parcial
public abstract class Relatorio {
    private LocalDateTime geradoEm = LocalDateTime.now(); // estado compartilhado

    // comportamento parcial
    public void gerar() {
        validarDados();
        gerarConteudo();  // abstrato — cada subclasse decide
        salvar();
    }

    protected abstract void gerarConteudo(); // obrigatório implementar

    private void validarDados() { /* lógica comum */ }
    private void salvar()       { /* lógica comum */ }
}

// Interface — contrato comportamental puro
public interface Exportavel {
    byte[] exportar();
    default String getFormatoNome() { return "generico"; } // default opicional
}
```

---

## 2. Construtores e Visibilidade

### 2.1 Tipos de Construtores

```java
public class Produto {
    private final String nome;
    private final BigDecimal preco;
    private String descricao;

    // Construtor principal
    public Produto(String nome, BigDecimal preco) {
        Objects.requireNonNull(nome, "nome obrigatório");
        Objects.requireNonNull(preco, "preco obrigatório");
        this.nome = nome;
        this.preco = preco;
    }

    // Construtor secundário delega para o principal
    public Produto(String nome, double preco) {
        this(nome, new BigDecimal(String.valueOf(preco))); // this() — delega
    }
}
```

### 2.2 Modificadores de Acesso

| Modificador | Mesma classe | Mesmo pacote | Subclasse | Qualquer lugar |
|-------------|:---:|:---:|:---:|:---:|
| `private`   | ✓ | ✗ | ✗ | ✗ |
| (padrão)    | ✓ | ✓ | ✗ | ✗ |
| `protected` | ✓ | ✓ | ✓ | ✗ |
| `public`    | ✓ | ✓ | ✓ | ✓ |

---

## 3. Interfaces em Profundidade

### 3.1 Estrutura e Recursos

```java
public interface Pagavel {
    // Constante implícita: public static final
    int PRAZO_MAXIMO_DIAS = 30;

    // Método abstrato implícito: public abstract
    BigDecimal getValorTotal();

    // Método default (Java 8+) — implementação opcional
    default boolean estaVencido() {
        return LocalDate.now().isAfter(getDataVencimento());
    }

    // Método estático utilitário
    static boolean validarValor(BigDecimal valor) {
        return valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
    }

    LocalDate getDataVencimento(); // abstrato
}
```

### 3.2 Múltiplas Interfaces

```java
public class Fatura implements Pagavel, Exportavel, Comparable<Fatura> {
    private BigDecimal valor;
    private LocalDate vencimento;

    @Override public BigDecimal getValorTotal() { return valor; }
    @Override public LocalDate getDataVencimento() { return vencimento; }
    @Override public byte[] exportar() { /* ... */ return new byte[0]; }

    @Override
    public int compareTo(Fatura outra) {
        return this.vencimento.compareTo(outra.vencimento);
    }
}
```

**Pratique:** Módulo `14. Interfaces`

---

## 4. Records (Java 14+)

Records são classes imutáveis para dados puros. Geram automaticamente construtor canônico, getters, `equals()`, `hashCode()` e `toString()`.

```java
// Declaração simples
public record Endereco(String rua, String cidade, String cep) {}

// Com validação no construtor compacto
public record Preco(BigDecimal valor, String moeda) {
    public Preco {  // construtor compacto
        Objects.requireNonNull(valor, "valor obrigatório");
        if (valor.compareTo(BigDecimal.ZERO) < 0)
            throw new IllegalArgumentException("Preço não pode ser negativo");
    }
}

// Uso
Endereco e = new Endereco("Rua A", "São Paulo", "01001-000");
e.cidade();   // getter — sem "get"
e.toString(); // Endereco[rua=Rua A, cidade=São Paulo, cep=01001-000]

// Records são imutáveis — sem setters
// e.rua() = "outra"; // não existe
```

**Quando usar:** DTOs, Value Objects, retorno de consultas, dados que não mudam após criação.

**Pratique:** Módulo `11. Encapsulamento, JavaBens e Recoreds`

---

## 5. Composição vs Herança

### 5.1 O problema da herança excessiva

```java
// FRÁGIL — herança para adicionar logging
public class EmailComLog extends Email {
    @Override
    public void enviar() {
        System.out.println("Enviando email...");
        super.enviar(); // acoplado à implementação do pai
    }
}
// Problema: e se precisar logar SMS também? Cria SMSComLog extends SMS?
```

### 5.2 Composição resolve com flexibilidade

```java
// Interface — contrato
public interface Mensagem {
    void enviar();
}

// Implementações
public class Email implements Mensagem {
    public void enviar() { /* lógica de email */ }
}
public class SMS implements Mensagem {
    public void enviar() { /* lógica de SMS */ }
}

// Decorator — adiciona logging via composição
public class MensagemComLog implements Mensagem {
    private final Mensagem mensagem;  // composto — qualquer Mensagem

    public MensagemComLog(Mensagem mensagem) {
        this.mensagem = mensagem;
    }

    @Override
    public void enviar() {
        System.out.println("Enviando: " + mensagem.getClass().getSimpleName());
        mensagem.enviar(); // delega
    }
}

// Uso — combina livremente
Mensagem emailComLog = new MensagemComLog(new Email());
Mensagem smsComLog   = new MensagemComLog(new SMS());
```

**Regra prática:** Herança para "é um" estável. Composição para "tem um" ou "se comporta como".

**Pratique:** Módulo `15. Boas Praticas de Heranca e Interfaces`

---

## 6. Lei de Demeter

Fale apenas com seus amigos diretos. Evite train wrecks.

```java
// VIOLAÇÃO — o código conhece a estrutura interna de objetos de objetos
pedido.getCliente().getEndereco().getCidade().toUpperCase();

// CORREÇÃO — cada classe expõe apenas o que interessa
public class Pedido {
    private Cliente cliente;

    // Pedido conhece Cliente, não Endereco nem cidade
    public String getCidadeDoCliente() {
        return cliente.getCidade(); // delega para Cliente
    }
}

public class Cliente {
    private Endereco endereco;

    public String getCidade() {
        return endereco.getCidade(); // delega para Endereco
    }
}
```

---

## 7. Exercício Prático

Implemente do zero, sem consultar o material:

1. Crie uma hierarquia: `Veiculo` (abstrata) → `Carro` e `Moto`
2. `Veiculo` deve ter: `marca`, `modelo`, `ano`, método abstrato `calcularIPVA()`
3. `Carro` calcula IPVA como 4% do valor, `Moto` como 2%
4. Crie interface `Segurado` com `getValorSeguro()`
5. `Carro` implementa `Segurado`
6. Sobrescreva `equals()` e `hashCode()` usando `placa`
7. Crie um `Record` para `DadosProprietario(String nome, String cpf)`

---

## Checklist do Dia

- [ ] Consigo explicar os 4 pilares sem consultar
- [ ] Sei quando usar interface vs classe abstrata
- [ ] Entendo o contrato `equals()` + `hashCode()`
- [ ] Sei criar e usar Records
- [ ] Consigo demonstrar composição no lugar de herança
- [ ] Apliquei a Lei de Demeter em algum exemplo

---

**Navegação:** [← README](../README.md) | [→ Próximo: Collections](page_02.md)
