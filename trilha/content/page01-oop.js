/* Unidade 2 · OOP Completo (docs/page_01.md · módulos 5, 10, 11, 12, 13, 14, 15) */
Trilha.add({
  numero: 2,
  titulo: 'OOP Completo',
  icone: '🧱',
  cor: '#58cc02',
  prioridade: 'alta',
  doc: 'docs/page_01.md',
  modulos: [5, 10, 11, 12, 13, 14, 15],
  resumo: 'Os quatro pilares, contratos de igualdade e a decisão que mais aparece em entrevista: herdar ou compor.',
  licoes: [

    /* ------------------------------------------------------------------ */
    {
      id: 'oop-encapsulamento',
      titulo: 'Encapsulamento e visibilidade',
      icone: '🔐',
      modulo: [5, 11],
      resumo: 'Esconder o estado interno e expor só o que o mundo externo precisa, com validação no caminho.',
      teoria: [
        { p: 'Encapsular é **ocultar o estado interno** e controlar todo acesso a ele. O objeto passa a ser responsável por manter a própria consistência, em vez de confiar em quem o usa.' },
        { h: 'A receita' },
        { ol: [
          'Todos os atributos `private`',
          'Getters só para o que realmente precisa ser lido',
          'Nada de setter automático: exponha **operações de negócio**, não campos',
          'Valide no construtor e em toda mudança de estado',
          'Nunca devolva a coleção interna direto: devolva cópia ou view imutável',
        ] },
        { code: `public class ContaBancaria {
    private double saldo;
    private final int numero;

    public ContaBancaria(int numero, double saldoInicial) {
        if (saldoInicial < 0) throw new IllegalArgumentException("Saldo negativo");
        this.numero = numero;
        this.saldo = saldoInicial;
    }

    public double getSaldo() { return saldo; }

    // operação de negócio, não setSaldo()
    public void depositar(double valor) {
        if (valor <= 0) throw new IllegalArgumentException("Valor deve ser positivo");
        this.saldo += valor;
    }

    public void sacar(double valor) {
        if (valor > saldo) throw new IllegalStateException("Saldo insuficiente");
        this.saldo -= valor;
    }
}` },
        { nota: 'Um `setSaldo(double)` público destrói o encapsulamento: qualquer código passa a poder colocar a conta num estado impossível. `depositar`/`sacar` mantêm o invariante.' },
        { h: 'Modificadores de acesso' },
        { tabela: {
          head: ['Modificador', 'Mesma classe', 'Mesmo pacote', 'Subclasse', 'Todos'],
          rows: [
            ['`private`', '✔', '✘', '✘', '✘'],
            ['*(default)*', '✔', '✔', '✘', '✘'],
            ['`protected`', '✔', '✔', '✔', '✘'],
            ['`public`', '✔', '✔', '✔', '✔'],
          ] } },
        { p: 'Sem modificador é **package-private** (default): visível só dentro do pacote. É o padrão certo para classes auxiliares que não fazem parte da API pública.' },
        { h: 'Vazamento de referência' },
        { code: `// ruim: quem chamar pode alterar a lista interna
public List<Item> getItens() { return itens; }

// bom: cópia defensiva ou view imutável
public List<Item> getItens() { return List.copyOf(itens); }
public List<Item> getItens() { return Collections.unmodifiableList(itens); }` },
        { h: 'Construtores' },
        { code: `public class Produto {
    private final String nome;
    private final double preco;

    public Produto(String nome, double preco) {
        if (nome == null || nome.isBlank()) throw new IllegalArgumentException("Nome obrigatorio");
        if (preco < 0) throw new IllegalArgumentException("Preco negativo");
        this.nome = nome;
        this.preco = preco;
    }

    // sobrecarga delegando para o construtor principal
    public Produto(String nome) {
        this(nome, 0.0);
    }
}` },
        { nota: 'Se você declara qualquer construtor, o construtor padrão sem argumentos deixa de existir. `this(...)` encadeia construtores e precisa ser a primeira instrução.' },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'oop-heranca-polimorfismo',
      titulo: 'Herança, polimorfismo e classes abstratas',
      icone: '🧬',
      modulo: [12, 13],
      resumo: 'Reuso por especialização, sobrescrita de métodos e o contrato equals/hashCode.',
      teoria: [
        { h: 'Herança' },
        { p: 'Herança modela uma relação **é-um**. A subclasse herda estado e comportamento e pode especializá-los.' },
        { code: `public class Funcionario {
    protected String nome;
    protected double salarioBase;

    public double calcularSalario() { return salarioBase; }

    @Override
    public String toString() { return nome + " - " + calcularSalario(); }
}

public class Gerente extends Funcionario {
    private double bonus;

    @Override
    public double calcularSalario() {
        return super.calcularSalario() + bonus;   // reaproveita e estende
    }
}` },
        { nota: 'A anotação `@Override` não é obrigatória, mas use sempre: se a assinatura não bater com nenhum método da superclasse, o compilador acusa o erro em vez de criar um método novo silenciosamente.' },
        { h: 'Polimorfismo' },
        { p: 'A referência é do tipo geral, o objeto é do tipo específico, e o método executado é o **do objeto**, decidido em tempo de execução (late binding).' },
        { code: `List<Funcionario> equipe = List.of(
    new Funcionario("Ana", 3000),
    new Gerente("Bia", 5000, 2000)
);

for (Funcionario f : equipe) {
    System.out.println(f.calcularSalario());  // cada um usa sua própria versão
}` },
        { h: 'Sobrecarga vs sobrescrita' },
        { tabela: {
          head: ['', 'Sobrecarga (overload)', 'Sobrescrita (override)'],
          rows: [
            ['Onde', 'mesma classe', 'entre superclasse e subclasse'],
            ['Assinatura', 'parâmetros **diferentes**', 'parâmetros **idênticos**'],
            ['Resolvida em', 'compilação', 'execução'],
            ['Retorno', 'pode mudar', 'igual ou covariante'],
            ['Visibilidade', 'livre', 'não pode ser mais restrita'],
          ] } },
        { h: 'Classe abstrata' },
        { p: 'Não pode ser instanciada. Serve para compartilhar estado e implementação parcial, deixando os pontos variáveis como `abstract`.' },
        { code: `public abstract class Documento {
    private final String titulo;

    protected Documento(String titulo) { this.titulo = titulo; }

    public abstract String gerar();          // cada subclasse resolve

    public final String cabecalho() {         // final: não pode ser sobrescrito
        return "== " + titulo + " ==";
    }
}` },
        { h: 'equals() e hashCode()' },
        { p: 'O contrato: objetos **iguais por equals obrigatoriamente têm o mesmo hashCode**. Quebrar isso faz o objeto sumir dentro de `HashSet` e `HashMap`.' },
        { code: `@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Cliente outro = (Cliente) o;
    return Objects.equals(cpf, outro.cpf);   // identidade de negócio
}

@Override
public int hashCode() {
    return Objects.hash(cpf);                // mesmos campos do equals
}` },
        { nota: 'Use nos dois métodos exatamente os mesmos campos, e prefira campos imutáveis. Se o campo mudar depois de o objeto entrar num HashSet, você não o encontra mais.' },
        { h: 'final' },
        { ul: [
          '`final` em variável: não pode ser reatribuída (o objeto ainda pode mudar por dentro)',
          '`final` em método: não pode ser sobrescrito',
          '`final` em classe: não pode ser estendida (ex.: `String`)',
        ] },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'oop-interfaces',
      titulo: 'Interfaces e abstração',
      icone: '🔌',
      modulo: 14,
      resumo: 'Contrato sem implementação, default methods e a pergunta clássica: interface ou classe abstrata?',
      teoria: [
        { p: 'Interface define **o que** um tipo faz, sem dizer como. É o principal mecanismo de desacoplamento em Java.' },
        { code: `public interface Notificador {
    String CANAL_PADRAO = "email";       // public static final implícito

    void enviar(String destino, String mensagem);   // public abstract implícito

    default void enviarUrgente(String destino, String msg) {
        enviar(destino, "[URGENTE] " + msg);        // reaproveita o contrato
    }

    static Notificador padrao() {                   // fábrica na própria interface
        return new EmailNotificador();
    }
}` },
        { h: 'O que pode ter dentro' },
        { tabela: {
          head: ['Membro', 'Desde', 'Para quê'],
          rows: [
            ['método abstrato', 'sempre', 'o contrato em si'],
            ['constante', 'sempre', '`public static final` implícito'],
            ['`default`', 'Java 8', 'evoluir a interface sem quebrar quem já implementa'],
            ['`static`', 'Java 8', 'utilitário ligado ao contrato'],
            ['`private`', 'Java 9', 'reuso interno entre os defaults'],
          ] } },
        { h: 'Múltiplas interfaces' },
        { p: 'Uma classe estende **uma** classe, mas implementa **quantas interfaces quiser**: é assim que Java resolve a herança múltipla sem o problema do diamante.' },
        { code: `public class RelatorioPdf implements Imprimivel, Exportavel, Comparable<RelatorioPdf> {
    @Override public void imprimir() { }
    @Override public byte[] exportar() { return new byte[0]; }
    @Override public int compareTo(RelatorioPdf outro) { return 0; }
}` },
        { h: 'Interface vs classe abstrata' },
        { tabela: {
          head: ['', 'Interface', 'Classe abstrata'],
          rows: [
            ['Estado (campos)', 'só constantes', 'campos de instância'],
            ['Construtor', 'não tem', 'tem'],
            ['Herança múltipla', 'sim', 'não'],
            ['Relação', '**consegue fazer**', '**é um**'],
            ['Use quando', 'tipos sem ancestral comum precisam do mesmo contrato', 'quer compartilhar estado e código entre parentes'],
          ] } },
        { nota: 'Regra prática: comece pela interface. Só promova para classe abstrata quando houver estado ou implementação de verdade para compartilhar entre as subclasses.' },
        { h: 'Interface funcional' },
        { p: 'Interface com **um único método abstrato**: pode ser implementada por lambda. `@FunctionalInterface` faz o compilador garantir isso.' },
        { code: `@FunctionalInterface
public interface Validador<T> {
    boolean valida(T valor);
}

Validador<String> naoVazio = s -> s != null && !s.isBlank();` },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'oop-records',
      titulo: 'Records e imutabilidade',
      icone: '📇',
      modulo: 11,
      resumo: 'Portadores de dados imutáveis em uma linha, e quando eles não servem.',
      teoria: [
        { p: 'Um `record` (Java 16+) é uma classe **imutável portadora de dados**. O compilador gera construtor, getters, `equals`, `hashCode` e `toString`.' },
        { code: `public record Cliente(String nome, String cpf, int idade) { }

// equivale a ~60 linhas de classe tradicional
Cliente c = new Cliente("Ana", "111", 30);
c.nome();                    // acessor sem prefixo "get"
c.equals(outro);             // compara todos os componentes
System.out.println(c);       // Cliente[nome=Ana, cpf=111, idade=30]` },
        { h: 'Construtor compacto: o lugar da validação' },
        { code: `public record Produto(String nome, double preco) {

    public Produto {                                   // sem parênteses de parâmetros
        if (nome == null || nome.isBlank()) throw new IllegalArgumentException("Nome obrigatorio");
        if (preco < 0) throw new IllegalArgumentException("Preco negativo");
        nome = nome.trim();                            // normalização antes de atribuir
    }

    public double precoComImposto() { return preco * 1.1; }   // métodos extras: pode

    public static Produto gratuito(String nome) { return new Produto(nome, 0); }
}` },
        { h: 'O que um record não permite' },
        { ul: [
          'Campos de instância além dos componentes declarados',
          'Herdar de outra classe (todo record já estende `Record`)',
          'Ser mutável: os componentes são `final`',
          'Ser estendido: records são implicitamente `final`',
        ] },
        { p: 'Records **podem** implementar interfaces, ter métodos, construtores extras e membros estáticos.' },
        { h: 'Quando usar' },
        { tabela: {
          head: ['Use record', 'Use classe'],
          rows: [
            ['DTO de entrada/saída', 'entidade com ciclo de vida e estado mutável'],
            ['value object (CPF, Dinheiro, Coordenada)', 'objeto com regra de negócio pesada'],
            ['chave de Map', 'precisa de herança'],
            ['retorno de múltiplos valores', 'precisa de campos internos de controle'],
          ] } },
        { nota: 'Cuidado: a imutabilidade do record é **rasa**. Se um componente for `List`, quem tiver a referência ainda pode alterar a lista. Faça cópia defensiva no construtor compacto: `itens = List.copyOf(itens);`' },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'oop-composicao',
      titulo: 'Composição vs herança e a Lei de Demeter',
      icone: '🧩',
      modulo: 15,
      resumo: 'Por que "prefira composição a herança" é a boa prática mais citada, e mais cobrada.',
      teoria: [
        { h: 'O problema da herança para reuso' },
        { p: 'Herança amarra a subclasse à implementação da superclasse. Cada nova combinação de comportamento vira uma classe nova: a hierarquia explode.' },
        { code: `// tentando cobrir combinações com herança
class Cafe { }
class CafeComLeite extends Cafe { }
class CafeComLeiteEChocolate extends CafeComLeite { }
class CafeComChocolate extends Cafe { }
// ... e agora com canela? com leite e canela?` },
        { h: 'Composição resolve' },
        { p: 'Em vez de **ser um**, o objeto **tem um**. Comportamentos viram peças que se combinam em tempo de execução.' },
        { code: `public interface Bebida {
    String descricao();
    double preco();
}

public record Cafe() implements Bebida {
    public String descricao() { return "Cafe"; }
    public double preco() { return 5.0; }
}

// decorator: tem-um Bebida e acrescenta comportamento
public class ComLeite implements Bebida {
    private final Bebida base;
    public ComLeite(Bebida base) { this.base = base; }

    public String descricao() { return base.descricao() + " + leite"; }
    public double preco() { return base.preco() + 1.5; }
}

Bebida pedido = new ComLeite(new ComChocolate(new Cafe()));` },
        { tabela: {
          head: ['', 'Herança', 'Composição'],
          rows: [
            ['Relação', 'é-um', 'tem-um'],
            ['Acoplamento', 'forte, em compilação', 'fraco, em execução'],
            ['Trocar comportamento', 'não dá', 'troca o objeto interno'],
            ['Quebra por mudança na base', 'sim (base class problem)', 'não'],
          ] } },
        { nota: 'Use herança quando a subclasse é genuinamente um subtipo e respeita o contrato da base (Liskov). Use composição para reutilizar comportamento.' },
        { h: 'Lei de Demeter' },
        { p: 'Fale só com seus vizinhos diretos. Um método deve chamar métodos: do próprio objeto, dos seus campos, dos seus parâmetros e de objetos que ele mesmo criou.' },
        { code: `// train wreck: conhece a estrutura interna de 3 objetos
String cidade = pedido.getCliente().getEndereco().getCidade().getNome();

// o objeto responde por si
String cidade = pedido.getCidadeEntrega();` },
        { p: 'O ganho não é estético: no primeiro caso, qualquer mudança em `Endereco` ou `Cidade` quebra este código. No segundo, quebra só a implementação de `Pedido`.' },
        { h: 'Tell, Don\'t Ask' },
        { code: `// ask: puxa o estado e decide do lado de fora
if (conta.getSaldo() >= valor) {
    conta.setSaldo(conta.getSaldo() - valor);
}

// tell: manda o objeto fazer, ele protege o próprio invariante
conta.sacar(valor);` },
      ],
      passos: [],
    },
  ],
});
