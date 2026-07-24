/* Unidade 4 · Exceções e Generics (docs/page_03.md · módulos 16, 17) */
Trilha.add({
  numero: 4,
  titulo: 'Exceções e Generics',
  icone: '⚠️',
  cor: '#ff9600',
  prioridade: 'alta',
  doc: 'docs/page_03.md',
  modulos: [16, 17],
  resumo: 'Tratar erro sem esconder causa, e escrever código genérico que o compilador consegue verificar.',
  licoes: [

    /* ------------------------------------------------------------------ */
    {
      id: 'exc-hierarquia',
      titulo: 'Hierarquia, checked e unchecked',
      icone: '🌡️',
      modulo: 16,
      resumo: 'Quem você deve capturar, quem deve deixar subir e quem nunca deve tocar.',
      teoria: [
        { code: `Throwable
  ├── Error: falha grave da JVM: NÃO capture
  │     ├── OutOfMemoryError
  │     └── StackOverflowError
  └── Exception
        ├── RuntimeException: UNCHECKED: erro de programação
        │     ├── NullPointerException
        │     ├── IllegalArgumentException
        │     ├── IllegalStateException
        │     ├── ArithmeticException
        │     ├── IndexOutOfBoundsException
        │     └── ClassCastException
        └── (demais): CHECKED: condição externa esperada
              ├── IOException
              ├── SQLException
              └── ClassNotFoundException` },
        { tabela: {
          head: ['', 'Checked', 'Unchecked'],
          rows: [
            ['Herda de', '`Exception`', '`RuntimeException`'],
            ['Compilador exige tratar', 'sim', 'não'],
            ['Representa', 'condição externa recuperável', 'erro de programação'],
            ['Exemplo', 'arquivo não existe, rede caiu', 'argumento inválido, null'],
            ['Assinatura', 'precisa de `throws`', '`throws` opcional (documenta)'],
          ] } },
        { h: 'Como decidir' },
        { ul: [
          'O chamador **consegue e deve** reagir? → checked (ex.: tentar outro servidor)',
          'É bug de quem chamou (argumento inválido, estado impossível)? → unchecked',
          'Na dúvida em código de aplicação, prefira **unchecked**: é a tendência das APIs modernas, inclusive Spring',
        ] },
        { code: `// unchecked: quem chamou errou
public void sacar(double valor) {
    if (valor <= 0) throw new IllegalArgumentException("Valor deve ser positivo");
    if (valor > saldo) throw new IllegalStateException("Saldo insuficiente");
}

// checked: o mundo externo falhou, o chamador pode reagir
public String lerConfig(Path caminho) throws IOException {
    return Files.readString(caminho);
}` },
        { nota: '`Error` sinaliza que a JVM está em situação irrecuperável. Capturar `Throwable` ou `Error` esconde falhas graves e impede o processo de morrer quando deveria.' },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'exc-try',
      titulo: 'try-catch-finally e try-with-resources',
      icone: '🧯',
      modulo: 16,
      resumo: 'Fechar recurso à mão é onde nasce vazamento, e o Java já resolveu isso.',
      teoria: [
        { h: 'Estrutura clássica' },
        { code: `try {
    processar();
} catch (IOException e) {           // do mais específico
    log.error("Falha de leitura", e);
} catch (SQLException | TimeoutException e) {   // multi-catch
    log.error("Falha de infra", e);
} catch (Exception e) {             // ...para o mais genérico
    log.error("Falha inesperada", e);
} finally {
    // sempre executa: mesmo com return no try
    liberar();
}` },
        { nota: 'A ordem importa: se `catch (Exception e)` vier antes de `catch (IOException e)`, o código não compila, pois o segundo bloco seria inalcançável.' },
        { h: 'try-with-resources: prefira sempre' },
        { p: 'Qualquer objeto que implemente `AutoCloseable` é fechado automaticamente, na ordem inversa da abertura, mesmo se houver exceção.' },
        { code: `// antigo: verboso e fácil de errar
BufferedReader br = null;
try {
    br = new BufferedReader(new FileReader("dados.txt"));
    return br.readLine();
} finally {
    if (br != null) br.close();     // e se close() lançar?
}

// moderno
try (BufferedReader br = new BufferedReader(new FileReader("dados.txt"))) {
    return br.readLine();
}

// vários recursos: fechados em ordem inversa
try (Connection conn = ds.getConnection();
     PreparedStatement ps = conn.prepareStatement(SQL);
     ResultSet rs = ps.executeQuery()) {
    // ...
}` },
        { h: 'Encadeamento: preserve a causa' },
        { code: `// ruim: o stack trace original some
catch (SQLException e) {
    throw new RepositorioException("Falha ao salvar");
}

// bom: a causa vai junto
catch (SQLException e) {
    throw new RepositorioException("Falha ao salvar cliente " + id, e);
}` },
        { h: 'Anti-patterns' },
        { tabela: {
          head: ['Não faça', 'Por quê'],
          rows: [
            ['`catch (Exception e) { }`', 'engole o erro: o bug vira silêncio'],
            ['`e.printStackTrace()`', 'não vai para o log estruturado'],
            ['`catch` + `return null`', 'transfere o problema para um NPE longe daqui'],
            ['`return` dentro de `finally`', 'descarta a exceção em andamento'],
            ['Exceção para controle de fluxo', 'caro e ilegível: use `if`'],
          ] } },
        { h: 'Exceção customizada' },
        { code: `public class SaldoInsuficienteException extends RuntimeException {

    private final double saldoAtual;
    private final double valorSolicitado;

    public SaldoInsuficienteException(double saldoAtual, double valorSolicitado) {
        super("Saldo de %.2f e insuficiente para saque de %.2f"
                .formatted(saldoAtual, valorSolicitado));
        this.saldoAtual = saldoAtual;
        this.valorSolicitado = valorSolicitado;
    }

    public double getSaldoAtual() { return saldoAtual; }
    public double getDeficit()    { return valorSolicitado - saldoAtual; }
}` },
        { p: 'Boa exceção customizada carrega **dados estruturados** do erro, não só uma mensagem, para quem captura conseguir decidir o que fazer sem parsear texto.' },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'gen-basico',
      titulo: 'Generics: classes e métodos genéricos',
      icone: '🧊',
      modulo: 17,
      aula: 'generics',        // aula guiada interativa em aula.html?id=generics
      resumo: 'Tipagem verificada em compilação, sem cast e sem ClassCastException.',
      teoria: [
        { h: 'O problema que resolvem' },
        { code: `// sem generics: aceita qualquer coisa, quebra em runtime
List lista = new ArrayList();
lista.add("texto");
lista.add(42);
String s = (String) lista.get(1);   // ClassCastException

// com generics: o erro aparece na compilação
List<String> lista = new ArrayList<>();
lista.add(42);        // não compila
String s = lista.get(0);  // sem cast` },
        { h: 'Classe genérica' },
        { code: `public class Caixa<T> {
    private T conteudo;

    public void guardar(T item) { this.conteudo = item; }
    public T abrir() { return conteudo; }
}

Caixa<String> caixaTexto = new Caixa<>();
Caixa<Produto> caixaProduto = new Caixa<>();` },
        { p: 'Convenção de nomes: **T** (type), **E** (element), **K**/**V** (key/value), **R** (return), **N** (number).' },
        { h: 'Bounded type parameter' },
        { code: `// só aceita tipos que sejam Number (ou subtipo)
public class Calculadora<T extends Number> {
    private final List<T> valores = new ArrayList<>();

    public double somar() {
        return valores.stream().mapToDouble(Number::doubleValue).sum();
    }
}

// múltiplos limites: classe primeiro, depois interfaces
public <T extends Pessoa & Comparable<T>> T maior(List<T> lista) { }` },
        { p: 'O limite libera os métodos daquele tipo dentro da classe genérica. Sem `extends Number`, você só poderia chamar métodos de `Object`.' },
        { h: 'Método genérico' },
        { code: `// o <T> vem antes do tipo de retorno
public static <T> void imprimir(List<T> lista) {
    lista.forEach(System.out::println);
}

public static <T extends Comparable<T>> T maior(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}

public static <K, V> Map<V, K> inverter(Map<K, V> origem) {
    Map<V, K> destino = new HashMap<>();
    origem.forEach((k, v) -> destino.put(v, k));
    return destino;
}` },
        { nota: 'Um método genérico não exige que a classe seja genérica, e essa é a forma mais comum de usar generics em utilitários estáticos.' },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'gen-pecs',
      titulo: 'Wildcards, PECS e type erasure',
      icone: '🃏',
      modulo: 17,
      resumo: 'Producer Extends, Consumer Super, e o que o compilador apaga antes de gerar bytecode.',
      teoria: [
        { h: 'O problema' },
        { p: '`List<Integer>` **não é** subtipo de `List<Number>`. Generics são invariantes: sem isso, você poderia inserir um `Double` numa lista de `Integer`.' },
        { code: `List<Integer> inteiros = new ArrayList<>();
List<Number> numeros = inteiros;   // não compila: e ainda bem` },
        { h: '? extends T: produtor (leitura)' },
        { code: `// aceita List<Integer>, List<Double>, List<Number>...
public double somar(List<? extends Number> numeros) {
    double total = 0;
    for (Number n : numeros) total += n.doubleValue();   // LER: ok
    // numeros.add(1);   não compila: não sabemos o tipo exato
    return total;
}` },
        { h: '? super T: consumidor (escrita)' },
        { code: `// aceita List<Integer>, List<Number>, List<Object>
public void preencher(List<? super Integer> destino) {
    destino.add(1);          // ESCREVER: ok
    destino.add(2);
    Object o = destino.get(0);   // ler só devolve Object
}` },
        { h: 'PECS' },
        { p: '**P**roducer **E**xtends, **C**onsumer **S**uper: se a coleção **produz** valores para você ler, use `extends`; se ela **consome** valores que você escreve, use `super`.' },
        { code: `// assinatura real do JDK: os dois lados no mesmo método
public static <T> void copy(List<? super T> dest, List<? extends T> src) {
    for (T item : src) dest.add(item);     // src produz, dest consome
}` },
        { tabela: {
          head: ['Wildcard', 'Pode ler', 'Pode escrever', 'Use quando'],
          rows: [
            ['`List<T>`', 'T', 'T', 'lê e escreve o mesmo tipo'],
            ['`List<? extends T>`', 'T', 'não (só null)', 'só lê da coleção'],
            ['`List<? super T>`', 'Object', 'T', 'só escreve na coleção'],
            ['`List<?>`', 'Object', 'não', 'só interessa o tamanho/estrutura'],
          ] } },
        { h: 'Type erasure' },
        { p: 'Generics existem **só em tempo de compilação**. O compilador verifica os tipos, insere casts e depois **apaga** os parâmetros de tipo: o bytecode trabalha com `Object`.' },
        { code: `List<String> a = new ArrayList<>();
List<Integer> b = new ArrayList<>();
a.getClass() == b.getClass();   // true: os dois são ArrayList

// consequências
if (lista instanceof List<String>) { }   // não compila
T novo = new T();                        // não compila
T[] array = new T[10];                   // não compila
private static List<T> cache;            // não pode em contexto estático` },
        { nota: 'Para contornar o erasure quando você realmente precisa do tipo em runtime, passe um `Class<T>` como parâmetro: é o padrão usado por frameworks como Jackson e Spring.' },
      ],
      passos: [],
    },
  ],
});
