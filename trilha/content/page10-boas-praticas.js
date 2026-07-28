/* Unidade 10 · Boas Práticas e Design Patterns (docs/page_10.md · módulos 6, 15, 31, 32) */
Trilha.add({
  numero: 10,
  titulo: 'Boas Práticas e Patterns',
  icone: '🏛️',
  cor: '#ff4b4b',
  prioridade: 'alta',
  doc: 'docs/page_10.md',
  modulos: [6, 15, 31, 32],
  resumo: 'Código limpo, os quatro padrões que sempre caem, logging correto e Maven.',
  licoes: [

    /* ------------------------------------------------------------------ */
    {
      id: 'bp-codigo-limpo',
      aula: 'bp-codigo-limpo',   // aula guiada em aula.html?id=bp-codigo-limpo
      titulo: 'Princípios de código limpo',
      icone: '🧼',
      modulo: 6,
      resumo: 'Nomes, tamanho de método, fail-fast e o que nunca retornar.',
      teoria: [
        { h: 'Nomes significativos' },
        { code: `// ruim
int d;
List<Cliente> l;
void proc(Cliente c) { }

// bom: o nome dispensa o comentário
int diasDesdeUltimaCompra;
List<Cliente> clientesInadimplentes;
void enviarCobranca(Cliente cliente) { }` },
        { ul: [
          'Classe: **substantivo** (`CalculadoraFrete`, `PedidoRepository`)',
          'Método: **verbo** (`calcularTotal`, `enviarEmail`)',
          'Boolean: pergunta (`isAtivo`, `temEstoque`, `podeCancelar`)',
          'Constante: `MAIUSCULA_COM_UNDERLINE`',
          'Sem abreviação críptica e sem notação húngara',
        ] },
        { h: 'Métodos focados' },
        { code: `// ruim: valida, calcula, persiste e notifica no mesmo método
public void processarPedido(Pedido p) { /* 80 linhas */ }

// bom: cada passo com um nome
public void processarPedido(Pedido pedido) {
    validar(pedido);
    aplicarDescontos(pedido);
    repository.salvar(pedido);
    notificacao.enviarConfirmacao(pedido);
}` },
        { p: 'Um método deve fazer **uma coisa** e operar em **um nível de abstração**. Se você precisa de um comentário para separar blocos internos, cada bloco quer ser um método.' },
        { h: 'Fail-fast' },
        { code: `// ruim: aninhamento profundo, o erro aparece longe da causa
public void transferir(Conta origem, Conta destino, double valor) {
    if (origem != null) {
        if (destino != null) {
            if (valor > 0) {
                if (origem.getSaldo() >= valor) {
                    // lógica no quinto nível
                }
            }
        }
    }
}

// bom: valide e saia cedo (guard clauses)
public void transferir(Conta origem, Conta destino, double valor) {
    Objects.requireNonNull(origem, "Conta de origem obrigatoria");
    Objects.requireNonNull(destino, "Conta de destino obrigatoria");
    if (valor <= 0) throw new IllegalArgumentException("Valor deve ser positivo");
    if (origem.getSaldo() < valor) throw new SaldoInsuficienteException(origem, valor);

    origem.debitar(valor);
    destino.creditar(valor);
}` },
        { h: 'Nunca retorne null em coleção' },
        { code: `// ruim: obriga todo chamador a checar
public List<Pedido> buscarPedidos(Long id) {
    if (naoTem) return null;
}

// bom
public List<Pedido> buscarPedidos(Long id) {
    if (naoTem) return List.of();      // ou Collections.emptyList()
}

// para objeto único que pode não existir
public Optional<Cliente> buscarPorCpf(String cpf) { }` },
        { h: 'Quando não comentar' },
        { code: `// ruim: repete o que o código já diz
// incrementa o contador
contador++;

// bom: explica o PORQUÊ, que o código não consegue dizer
// A API de terceiros limita a 100 req/min; sem esta pausa recebemos 429.
Thread.sleep(600);` },
        { nota: 'Comentário que descreve o "o quê" envelhece e vira mentira. Comentário que descreve o "porquê" (regra de negócio, decisão técnica, limitação externa) é o único que se paga.' },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'bp-patterns',
      aula: 'bp-patterns',   // aula guiada em aula.html?id=bp-patterns
      titulo: 'Strategy, Factory, Decorator e Builder',
      icone: '🧩',
      modulo: 15,
      resumo: 'Os quatro padrões que mais aparecem em entrevista de Java.',
      teoria: [
        { h: 'Strategy: algoritmo intercambiável' },
        { p: 'Problema: um `if/else` gigante escolhendo entre variações do mesmo cálculo. Solução: cada variação vira uma classe atrás de uma interface.' },
        { code: `public interface CalculadoraFrete {
    BigDecimal calcular(Pedido pedido);
}

public class FreteExpresso implements CalculadoraFrete {
    public BigDecimal calcular(Pedido p) { return p.getPeso().multiply(new BigDecimal("2.5")); }
}

public class FreteGratis implements CalculadoraFrete {
    public BigDecimal calcular(Pedido p) { return BigDecimal.ZERO; }
}

public class PedidoService {
    private final CalculadoraFrete calculadora;      // recebe a estratégia
    public PedidoService(CalculadoraFrete calculadora) { this.calculadora = calculadora; }
}` },
        { p: 'Ganho: adicionar uma modalidade nova é **criar uma classe**, sem tocar no serviço, que é o princípio Aberto/Fechado.' },
        { h: 'Factory: encapsula a criação' },
        { code: `public class CalculadoraFreteFactory {

    public static CalculadoraFrete criar(TipoFrete tipo) {
        return switch (tipo) {
            case EXPRESSO -> new FreteExpresso();
            case NORMAL   -> new FreteNormal();
            case GRATIS   -> new FreteGratis();
        };
    }
}` },
        { p: 'O cliente pede pelo **que quer**, não pelo **como construir**. Factory e Strategy costumam andar juntos: a factory escolhe a strategy.' },
        { h: 'Decorator: comportamento por composição' },
        { code: `public interface Notificador {
    void enviar(String mensagem);
}

public class NotificadorEmail implements Notificador {
    public void enviar(String msg) { /* envia e-mail */ }
}

// decorator: tem-um Notificador e acrescenta algo
public class NotificadorComLog implements Notificador {
    private final Notificador delegado;
    public NotificadorComLog(Notificador delegado) { this.delegado = delegado; }

    public void enviar(String msg) {
        log.info("Enviando: {}", msg);
        delegado.enviar(msg);
        log.info("Enviado");
    }
}

Notificador n = new NotificadorComRetry(new NotificadorComLog(new NotificadorEmail()));` },
        { p: 'É exatamente o que o JDK faz: `new BufferedReader(new InputStreamReader(inputStream))`.' },
        { h: 'Builder: construção fluente' },
        { code: `public class Pedido {
    private final String cliente;
    private final List<Item> itens;
    private final String cupom;

    private Pedido(Builder b) {
        this.cliente = b.cliente;
        this.itens = List.copyOf(b.itens);
        this.cupom = b.cupom;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String cliente;
        private List<Item> itens = new ArrayList<>();
        private String cupom;

        public Builder cliente(String c) { this.cliente = c; return this; }
        public Builder item(Item i)      { this.itens.add(i); return this; }
        public Builder cupom(String c)   { this.cupom = c; return this; }

        public Pedido build() {
            if (cliente == null) throw new IllegalStateException("Cliente obrigatorio");
            if (itens.isEmpty()) throw new IllegalStateException("Pedido sem itens");
            return new Pedido(this);
        }
    }
}

Pedido p = Pedido.builder().cliente("Ana").item(item1).cupom("BLACK10").build();` },
        { nota: 'Builder resolve o "construtor telescópico": muitos parâmetros opcionais e chamadas ilegíveis como `new Pedido("Ana", null, null, true, null)`. E a validação fica centralizada no `build()`.' },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'bp-logging',
      aula: 'bp-logging',   // aula guiada em aula.html?id=bp-logging
      titulo: 'Logging com SLF4J e Logback',
      icone: '📝',
      modulo: 32,
      resumo: 'Fachada, níveis e a diferença que o placeholder faz.',
      teoria: [
        { p: '**SLF4J** é a fachada (a API que você programa); **Logback** é a implementação. Trocar a implementação não muda uma linha do seu código.' },
        { code: `<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.5.6</version>
</dependency>` },
        { code: `public class PedidoService {

    private static final Logger log = LoggerFactory.getLogger(PedidoService.class);

    public void processar(Pedido pedido) {
        log.info("Processando pedido {}", pedido.getId());      // placeholder {}
        try {
            executar(pedido);
        } catch (Exception e) {
            log.error("Falha no pedido {}", pedido.getId(), e); // exceção por último
            throw e;
        }
    }
}` },
        { h: 'Sempre use placeholder' },
        { code: `// ruim: monta a String mesmo quando DEBUG está desligado
log.debug("Pedido " + pedido.getId() + " com " + pedido.getItens().size() + " itens");

// bom: só concatena se o nível estiver habilitado
log.debug("Pedido {} com {} itens", pedido.getId(), pedido.getItens().size());` },
        { h: 'Níveis' },
        { tabela: {
          head: ['Nível', 'Quando usar', 'Produção'],
          rows: [
            ['`ERROR`', 'falhou e alguém precisa agir', 'ligado'],
            ['`WARN`', 'anormal, mas o sistema seguiu', 'ligado'],
            ['`INFO`', 'evento de negócio relevante', 'ligado'],
            ['`DEBUG`', 'detalhe para investigar', 'desligado'],
            ['`TRACE`', 'passo a passo detalhado', 'desligado'],
          ] } },
        { p: 'Configurar o nível em `INFO` faz o logger **descartar** as chamadas de `DEBUG` e `TRACE`: os níveis são hierárquicos, do mais grave ao mais detalhado.' },
        { h: 'logback.xml' },
        { code: `<configuration>
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss} %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <appender name="ARQUIVO" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/app.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/app.%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder><pattern>%d %-5level [%thread] %logger - %msg%n</pattern></encoder>
    </appender>

    <logger name="com.app.repository" level="DEBUG"/>

    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="ARQUIVO"/>
    </root>
</configuration>` },
        { nota: 'Nunca logue senha, token, cartão ou CPF completo. E jamais use `System.out.println` em aplicação: não tem nível, nem timestamp, nem destino configurável, e não some em produção.' },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'bp-maven',
      aula: 'bp-maven',   // aula guiada em aula.html?id=bp-maven
      titulo: 'Maven: estrutura, ciclo e escopos',
      icone: '📦',
      modulo: 31,
      resumo: 'Convenção de diretórios, as fases que importam e o que cada escopo significa.',
      teoria: [
        { h: 'Estrutura padrão' },
        { code: `projeto/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/          código de produção
│   │   └── resources/     application.properties, logback.xml
│   └── test/
│       ├── java/          testes
│       └── resources/
└── target/                gerado: vai no .gitignore` },
        { p: 'Maven é **convenção sobre configuração**: seguindo essa estrutura, você não precisa configurar nada para compilar, testar e empacotar.' },
        { h: 'pom.xml' },
        { code: `<project>
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.algaworks</groupId>       <!-- organização -->
    <artifactId>especialista-java</artifactId>
    <version>1.0.0-SNAPSHOT</version>      <!-- SNAPSHOT = em desenvolvimento -->
    <packaging>jar</packaging>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.10.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>` },
        { p: 'O trio **groupId : artifactId : version** identifica unicamente qualquer artefato no repositório Maven: são as coordenadas.' },
        { h: 'Ciclo de vida' },
        { tabela: {
          head: ['Fase', 'O que faz'],
          rows: [
            ['`validate`', 'verifica o projeto'],
            ['`compile`', 'compila para `target/classes`'],
            ['`test`', 'roda os testes unitários'],
            ['`package`', 'gera o jar/war em `target/`'],
            ['`verify`', 'roda checagens de integração'],
            ['`install`', 'instala no repositório local (`~/.m2`)'],
            ['`deploy`', 'publica no repositório remoto'],
          ] } },
        { p: 'As fases são **sequenciais**: rodar `mvn package` executa validate, compile e test antes. Por isso `mvn clean install` é o comando mais usado: limpa o `target` e roda tudo até a instalação local.' },
        { code: `mvn clean                 # apaga target/
mvn compile
mvn test
mvn package
mvn clean install
mvn dependency:tree       # de onde vem cada dependência transitiva
mvn -DskipTests package   # pula os testes (use com parcimônia)` },
        { h: 'Escopos de dependência' },
        { tabela: {
          head: ['Escopo', 'Compilação', 'Teste', 'Runtime', 'No pacote final'],
          rows: [
            ['`compile` *(padrão)*', '✔', '✔', '✔', 'sim'],
            ['`provided`', '✔', '✔', '✘', 'não: o servidor fornece'],
            ['`runtime`', '✘', '✔', '✔', 'sim, ex.: driver JDBC'],
            ['`test`', '✘', '✔', '✘', 'não: JUnit, Mockito'],
            ['`import`', 'n/a', 'n/a', 'n/a', 'só em `dependencyManagement`'],
          ] } },
        { nota: 'Escopo errado é fonte comum de "funciona na minha máquina": o driver JDBC em `test` compila e passa nos testes, e o jar de produção sobe sem ele.' },
      ],
      passos: [],
    },
  ],
});
