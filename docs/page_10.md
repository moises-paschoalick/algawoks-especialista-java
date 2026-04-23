# Boas Práticas e Design Patterns

> Módulos do curso: 6, 15, 31, 32
> Prioridade: 🔴 Alta

**Navegação:** [← Reflection API](page_09.md) | [→ Início do Roadmap](../README.md)

---

## O que você vai dominar

- Princípios de código limpo aplicados em Java
- Padrões Strategy, Factory, Repository e Decorator
- Logging correto com SLF4J e Logback
- Maven: estrutura, dependências e ciclo de vida

---

## 1. Princípios de Código Limpo

### 1.1 Nomes Significativos

```java
// RUIM — nomes genéricos e abreviados
int d;
void calc(int x, List<Object> l) { }
boolean flag = true;

// BOM — nomes que revelam intenção
int diasParaVencimento;
void calcularImpostoRenda(int salarioAnual, List<Dependente> dependentes) { }
boolean estaAtivo = true;
```

### 1.2 Métodos Focados — Uma Única Responsabilidade

```java
// RUIM — método faz muitas coisas
public void processarPedido(Pedido pedido) {
    // valida
    if (pedido.getItens().isEmpty()) throw new RuntimeException("sem itens");
    // calcula
    BigDecimal total = pedido.getItens().stream()...
    pedido.setTotal(total);
    // salva
    String sql = "INSERT INTO pedido...";
    // envia email
    emailService.send(pedido.getCliente().getEmail(), ...);
}

// BOM — cada método tem uma responsabilidade clara
public void processarPedido(Pedido pedido) {
    validar(pedido);
    calcularTotal(pedido);
    repositorio.salvar(pedido);
    notificacoes.notificarCliente(pedido);
}
```

### 1.3 Fail-Fast — Valide Cedo

```java
public void transferir(Conta origem, Conta destino, BigDecimal valor) {
    // Valide no início — falhe com mensagem clara
    Objects.requireNonNull(origem,  "conta de origem obrigatória");
    Objects.requireNonNull(destino, "conta de destino obrigatória");
    Objects.requireNonNull(valor,   "valor obrigatório");

    if (valor.compareTo(BigDecimal.ZERO) <= 0)
        throw new IllegalArgumentException("Valor deve ser positivo: " + valor);
    if (origem.equals(destino))
        throw new IllegalArgumentException("Origem e destino não podem ser iguais");
    if (origem.getSaldo().compareTo(valor) < 0)
        throw new SaldoInsuficienteException(origem.getSaldo(), valor);

    // Lógica principal — chegou aqui, os dados são válidos
    origem.debitar(valor);
    destino.creditar(valor);
}
```

### 1.4 Lei de Demeter — Não Fale com Estranhos

```java
// VIOLAÇÃO — conhece estrutura interna de objetos alheios (train wreck)
pedido.getCliente().getEndereco().getCidade().toUpperCase();

// CORREÇÃO — cada objeto expõe o que o outro precisa
public class Pedido {
    public String getCidadeDoCliente() {
        return cliente.getCidade(); // Pedido pede ao Cliente
    }
}
public class Cliente {
    public String getCidade() {
        return endereco.getCidade(); // Cliente pede ao Endereço
    }
}

// Uso
pedido.getCidadeDoCliente().toUpperCase(); // apenas 2 pontos
```

### 1.5 Retornar Coleções Vazias — Nunca Null

```java
// RUIM — força o chamador a testar null sempre
public List<Produto> buscarPorCategoria(String categoria) {
    if (resultados.isEmpty()) return null; // perigoso!
}

// BOM — coleção vazia é segura para iterar
public List<Produto> buscarPorCategoria(String categoria) {
    if (resultados.isEmpty()) return Collections.emptyList();
    // ou: return List.of();
    // ou: return new ArrayList<>();
}
```

### 1.6 Quando (Não) Comentar

```java
// INÚTIL — o código já diz isso
// Incrementa i
i++;

// INÚTIL — nome do método já explica
// Calcula o imposto de renda
public BigDecimal calcularImpostoRenda(int salario) { }

// ÚTIL — explica o "porquê", não o "o quê"
// Meses base-0 na API legada Calendar (Janeiro = 0)
calendar.set(Calendar.MONTH, mes - 1);

// ÚTIL — aviso de comportamento não-óbvio
// Thread-safe apenas se SharedState for imutável
public void processar(SharedState state) { }
```

---

## 2. Design Patterns

### 2.1 Strategy Pattern

**Problema:** comportamento que varia e precisa ser intercambiável.
**Solução:** encapsula cada algoritmo em uma classe que implementa uma interface comum.

```java
// Interface — contrato do algoritmo
public interface CalculadoraFrete {
    BigDecimal calcular(Pedido pedido);
}

// Estratégias concretas
public class FreteCorreios implements CalculadoraFrete {
    @Override
    public BigDecimal calcular(Pedido pedido) {
        return pedido.getPeso().multiply(new BigDecimal("0.15"));
    }
}

public class FreteFedEx implements CalculadoraFrete {
    @Override
    public BigDecimal calcular(Pedido pedido) {
        BigDecimal base = new BigDecimal("25.00");
        return base.add(pedido.getPeso().multiply(new BigDecimal("0.20")));
    }
}

public class FreteGratis implements CalculadoraFrete {
    @Override
    public BigDecimal calcular(Pedido pedido) {
        return BigDecimal.ZERO;
    }
}

// Contexto — usa a estratégia sem saber qual é
public class ServicoDePedido {
    private final CalculadoraFrete calculadoraFrete;

    public ServicoDePedido(CalculadoraFrete calculadoraFrete) {
        this.calculadoraFrete = calculadoraFrete; // injetado
    }

    public BigDecimal calcularTotal(Pedido pedido) {
        BigDecimal subtotal = pedido.calcularSubtotal();
        BigDecimal frete    = calculadoraFrete.calcular(pedido); // delega
        return subtotal.add(frete);
    }
}

// Uso — troca em runtime sem alterar ServicoDePedido
CalculadoraFrete frete = pedido.getValor().compareTo(new BigDecimal("200")) >= 0
    ? new FreteGratis()
    : new FreteCorreios();

ServicoDePedido servico = new ServicoDePedido(frete);
```

**Onde aparece no JDK:** `Comparator`, `Runnable`, `Callable`, `Predicate`, qualquer interface funcional.

---

### 2.2 Factory Pattern

**Problema:** lógica de criação complexa ou dependente de condições.
**Solução:** método ou classe que centraliza e encapsula a criação.

```java
// Simple Factory — método estático de criação
public class ConexaoFactory {
    public static Connection criar(String tipoBanco) {
        return switch (tipoBanco) {
            case "mysql"  -> new MySQLConnection();
            case "oracle" -> new OracleConnection();
            case "h2"     -> new H2Connection();
            default       -> throw new IllegalArgumentException("Banco não suportado: " + tipoBanco);
        };
    }
}

// Factory Method — classe que define o contrato
public interface RepositorioFactory {
    ProdutoRepositorio criarProdutoRepositorio();
    VendaRepositorio   criarVendaRepositorio();
}

public class MySQLRepositorioFactory implements RepositorioFactory {
    private final String url, user, pass;

    @Override
    public ProdutoRepositorio criarProdutoRepositorio() {
        return new MySQLProdutoRepositorio(url, user, pass);
    }

    @Override
    public VendaRepositorio criarVendaRepositorio() {
        return new MySQLVendaRepositorio(url, user, pass);
    }
}

public class MemoriaRepositorioFactory implements RepositorioFactory {
    @Override
    public ProdutoRepositorio criarProdutoRepositorio() {
        return new MemoriaProdutoRepositorio();
    }

    @Override
    public VendaRepositorio criarVendaRepositorio() {
        return new MemoriaVendaRepositorio();
    }
}
```

---

### 2.3 Decorator Pattern

**Problema:** adicionar comportamentos a um objeto sem modificar sua classe e sem herança rígida.
**Solução:** embrulhar o objeto em outro que implementa a mesma interface.

```java
public interface Notificacao {
    void enviar(String mensagem);
}

// Implementação base
public class NotificacaoEmail implements Notificacao {
    @Override
    public void enviar(String mensagem) {
        System.out.println("Email: " + mensagem);
    }
}

// Decorator — adiciona logging
public class NotificacaoComLog implements Notificacao {
    private final Notificacao notificacao; // componente decorado
    private final Logger log = LoggerFactory.getLogger(getClass());

    public NotificacaoComLog(Notificacao notificacao) {
        this.notificacao = notificacao;
    }

    @Override
    public void enviar(String mensagem) {
        log.info("Enviando notificação: {}", mensagem);
        notificacao.enviar(mensagem);  // delega para o componente
        log.info("Notificação enviada com sucesso");
    }
}

// Decorator — adiciona retry
public class NotificacaoComRetry implements Notificacao {
    private final Notificacao notificacao;
    private final int tentativas;

    public NotificacaoComRetry(Notificacao notificacao, int tentativas) {
        this.notificacao = notificacao;
        this.tentativas  = tentativas;
    }

    @Override
    public void enviar(String mensagem) {
        for (int i = 0; i < tentativas; i++) {
            try {
                notificacao.enviar(mensagem);
                return; // sucesso
            } catch (Exception e) {
                if (i == tentativas - 1) throw e;
            }
        }
    }
}

// Composição de decorators — ordem importa!
Notificacao notificacao = new NotificacaoComLog(
    new NotificacaoComRetry(
        new NotificacaoEmail(), 3
    )
);
notificacao.enviar("Pedido confirmado!");
```

---

### 2.4 Builder Pattern

**Problema:** objetos com muitos parâmetros opcionais — construtores "telescópicos".
**Solução:** builder fluente que constrói o objeto passo a passo.

```java
public class Email {
    private final String de;           // obrigatório
    private final String para;         // obrigatório
    private final String assunto;      // obrigatório
    private final String corpo;        // obrigatório
    private final List<String> cc;     // opcional
    private final List<String> anexos; // opcional
    private final boolean htmlFormatado; // opcional

    private Email(Builder builder) {
        this.de           = builder.de;
        this.para         = builder.para;
        this.assunto      = builder.assunto;
        this.corpo        = builder.corpo;
        this.cc           = List.copyOf(builder.cc);
        this.anexos       = List.copyOf(builder.anexos);
        this.htmlFormatado = builder.htmlFormatado;
    }

    public static class Builder {
        private final String de;
        private final String para;
        private final String assunto;
        private final String corpo;
        private List<String> cc      = new ArrayList<>();
        private List<String> anexos  = new ArrayList<>();
        private boolean htmlFormatado = false;

        public Builder(String de, String para, String assunto, String corpo) {
            this.de = de; this.para = para;
            this.assunto = assunto; this.corpo = corpo;
        }

        public Builder cc(String... emails) {
            this.cc.addAll(Arrays.asList(emails));
            return this; // retorna this para encadeamento
        }

        public Builder anexar(String... arquivos) {
            this.anexos.addAll(Arrays.asList(arquivos));
            return this;
        }

        public Builder html() { this.htmlFormatado = true; return this; }

        public Email build() {
            Objects.requireNonNull(de, "remetente obrigatório");
            return new Email(this);
        }
    }
}

// Uso — fluente e legível
Email email = new Email.Builder("sistema@empresa.com", "cliente@email.com",
        "Pedido confirmado", "<h1>Seu pedido foi confirmado!</h1>")
    .cc("gerente@empresa.com")
    .html()
    .build();
```

---

## 3. Logging com SLF4J e Logback

### 3.1 Dependência Maven

```xml
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.4.14</version>
</dependency>
<!-- SLF4J API vem transitivamente com logback-classic -->
```

### 3.2 Usando SLF4J corretamente

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CadastroServico {
    // Logger por classe — granularidade para configurar níveis por pacote
    private static final Logger log = LoggerFactory.getLogger(CadastroServico.class);

    public Produto cadastrar(Produto produto) {
        log.debug("Iniciando cadastro do produto: {}", produto.getNome()); // {} = placeholder lazy

        try {
            validar(produto);
            Produto salvo = repositorio.salvar(produto);
            log.info("Produto cadastrado com id={}", salvo.getId());
            return salvo;
        } catch (NegocioException e) {
            log.warn("Tentativa de cadastro inválida: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Erro inesperado ao cadastrar produto id={}", produto.getId(), e); // e = Throwable inclui stack trace
            throw new RuntimeException("Erro ao cadastrar produto", e);
        }
    }
}
```

### 3.3 Hierarquia de níveis

```
TRACE   → rastreamento detalhado linha a linha
  DEBUG → diagnóstico para desenvolvimento
    INFO  → eventos normais de negócio (padrão em produção)
      WARN  → inesperado mas recuperável
        ERROR → falha que precisa de atenção
```

> Configurar `INFO` em produção significa que `TRACE` e `DEBUG` são ignorados (zero custo).

### 3.4 Configuração logback.xml

```xml
<!-- src/main/resources/logback.xml -->
<configuration>
    <!-- Appender de console -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- Appender de arquivo -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/app.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/app.%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory> <!-- mantém 30 dias -->
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} %-5level [%thread] %logger{50} - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- Nível DEBUG apenas para o pacote da aplicação -->
    <logger name="com.meuapp" level="DEBUG"/>

    <!-- Nível padrão para todo o resto -->
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
    </root>
</configuration>
```

**Por que SLF4J e não Logback diretamente?**
SLF4J é uma fachada — a aplicação depende da API, não da implementação. Para trocar Logback por Log4j2: apenas troca o JAR, zero mudança de código.

---

## 4. Maven — Estrutura e Ciclo de Vida

### 4.1 Estrutura padrão

```
projeto/
├── pom.xml                     ← configuração principal
├── src/
│   ├── main/
│   │   ├── java/               ← código-fonte
│   │   └── resources/          ← arquivos de configuração (logback.xml, etc.)
│   └── test/
│       ├── java/               ← testes
│       └── resources/          ← recursos de teste
└── target/                     ← gerado pelo Maven (não committar)
    ├── classes/                ← .class compilados
    └── projeto-1.0.jar         ← artefato final
```

### 4.2 pom.xml essencial

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!-- Coordenadas — identificam o projeto unicamente -->
    <groupId>com.meuapp</groupId>
    <artifactId>especialista-java</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <properties>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-classic</artifactId>
            <version>1.4.14</version>
        </dependency>

        <!-- Escopo test — só no classpath de testes -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.10.0</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

### 4.3 Ciclo de vida e comandos

```
validate → compile → test → package → verify → install → deploy
```

| Comando                      | O que faz                                          |
|------------------------------|----------------------------------------------------|
| `mvn clean`                  | Remove diretório `target`                          |
| `mvn compile`                | Compila o código-fonte                             |
| `mvn test`                   | Compila e executa os testes                        |
| `mvn package`                | Gera o JAR/WAR em `target/`                        |
| `mvn install`                | Instala no repositório local (`~/.m2`)             |
| `mvn clean package`          | Limpa e reempacota — mais usado no dia a dia       |
| `mvn dependency:tree`        | Exibe todas as dependências e transitivas          |
| `mvn dependency:resolve`     | Baixa todas as dependências                        |

### 4.4 Escopos de dependência

| Escopo      | Compilação | Teste | Runtime | Empacotado |
|-------------|:---:|:---:|:---:|:---:|
| `compile`   | ✓ | ✓ | ✓ | ✓ | (padrão)
| `test`      | ✗ | ✓ | ✗ | ✗ | JUnit, Mockito
| `provided`  | ✓ | ✓ | ✗ | ✗ | Servlet API (servidor provê)
| `runtime`   | ✗ | ✓ | ✓ | ✓ | Driver JDBC

---

## 5. Exercício Final — Integrando Tudo

Construa um sistema de gestão de pedidos aplicando todos os padrões:

1. **Entidades:** `Produto`, `Pedido`, `ItemPedido`, `Cliente`
2. **Pattern Repository:** `PedidoRepositorio` (interface) + implementação em memória
3. **Pattern Strategy:** `CalculadoraDesconto` com implementações: `SemDesconto`, `DescontoFidelidade(10%)`, `DescontoCupom(valor fixo)`
4. **Pattern Factory:** `CalculadoraDescontoFactory` que decide qual estratégia usar
5. **Logging:** adicione SLF4J em todos os serviços — DEBUG para detalhes, INFO para eventos de negócio, WARN para validações falhas
6. **Código limpo:** aplique Fail-Fast em todos os construtores, retorne listas vazias onde aplicável, nomes significativos

---

## Checklist do Dia

- [ ] Aplico Fail-Fast e Lei de Demeter nos meus métodos
- [ ] Retorno coleções vazias em vez de null
- [ ] Sei implementar Strategy, Factory, Decorator e Builder
- [ ] Uso `{}` em vez de concatenação no SLF4J
- [ ] Escolho o nível de log correto para cada situação
- [ ] Sei estruturar um projeto Maven com `pom.xml` e dependências
- [ ] Entendo os escopos de dependência (`compile`, `test`, `provided`)

---

**Navegação:** [← Reflection API](page_09.md) | [→ Início do Roadmap](../README.md)
