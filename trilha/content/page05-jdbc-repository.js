/* Unidade 8 — JDBC e Padrão Repository (docs/page_05.md · módulos 33, 34) */
Trilha.add({
  numero: 8,
  titulo: 'JDBC e Repository',
  icone: '🗄️',
  cor: '#f78c6c',
  prioridade: 'media',
  doc: 'docs/page_05.md',
  modulos: [33, 34],
  resumo: 'Acesso a banco sem SQL Injection e a separação entre regra de negócio e persistência.',
  licoes: [

    /* ------------------------------------------------------------------ */
    {
      id: 'jdbc-conexao',
      titulo: 'Conexão e PreparedStatement',
      icone: '🔌',
      modulo: 33,
      resumo: 'Nunca concatene SQL — e o motivo vai além de segurança.',
      teoria: [
        { h: 'Dependência e conexão' },
        { code: `<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.3.0</version>
</dependency>` },
        { code: `private static final String URL  = "jdbc:mysql://localhost:3306/loja";
private static final String USER = "root";
private static final String PASS = "senha";

public static Connection abrir() throws SQLException {
    return DriverManager.getConnection(URL, USER, PASS);
}

// sempre em try-with-resources: Connection é AutoCloseable
try (Connection conn = abrir()) {
    // ...
}` },
        { nota: 'Desde o JDBC 4.0 não é preciso chamar `Class.forName("com.mysql.cj.jdbc.Driver")` — o driver se registra sozinho pelo ServiceLoader.' },
        { h: 'Statement é vulnerável' },
        { code: `// NUNCA faça isso
String sql = "SELECT * FROM usuario WHERE login = '" + login + "'";
Statement st = conn.createStatement();
ResultSet rs = st.executeQuery(sql);

// se login = "' OR '1'='1", a query vira:
// SELECT * FROM usuario WHERE login = '' OR '1'='1'   -> retorna todo mundo` },
        { code: `// PreparedStatement: o valor nunca é interpretado como SQL
String sql = "SELECT * FROM usuario WHERE login = ?";
try (PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setString(1, login);           // índice começa em 1
    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) { }
    }
}` },
        { p: 'Além de eliminar a injeção, o `PreparedStatement` é **pré-compilado** pelo banco: reexecutar a mesma query com valores diferentes reaproveita o plano de execução.' },
        { h: 'INSERT com ID gerado' },
        { code: `String sql = "INSERT INTO produto (nome, preco) VALUES (?, ?)";
try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
    ps.setString(1, produto.getNome());
    ps.setDouble(2, produto.getPreco());
    ps.executeUpdate();

    try (ResultSet chaves = ps.getGeneratedKeys()) {
        if (chaves.next()) produto.setId(chaves.getLong(1));
    }
}` },
        { h: 'SELECT e mapeamento' },
        { code: `String sql = "SELECT id, nome, preco FROM produto WHERE preco > ?";
List<Produto> produtos = new ArrayList<>();

try (PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setDouble(1, minimo);
    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {                       // avança e devolve false no fim
            Produto p = new Produto();
            p.setId(rs.getLong("id"));
            p.setNome(rs.getString("nome"));
            p.setPreco(rs.getDouble("preco"));
            produtos.add(p);
        }
    }
}` },
        { tabela: {
          head: ['SQL', 'Java', 'Método'],
          rows: [
            ['`VARCHAR`', '`String`', '`getString`'],
            ['`INT`', '`int`', '`getInt`'],
            ['`BIGINT`', '`long`', '`getLong`'],
            ['`DECIMAL`', '`BigDecimal`', '`getBigDecimal`'],
            ['`DATE`', '`LocalDate`', '`getObject(col, LocalDate.class)`'],
            ['`TIMESTAMP`', '`LocalDateTime`', '`getObject(col, LocalDateTime.class)`'],
            ['`BOOLEAN`', '`boolean`', '`getBoolean`'],
          ] } },
        { nota: 'Para valor monetário use `BigDecimal`, nunca `double` — ponto flutuante binário não representa 0,1 exatamente e o arredondamento aparece no extrato do cliente.' },
        { h: 'UPDATE, DELETE e transação' },
        { code: `int linhas = ps.executeUpdate();   // quantas linhas afetadas

conn.setAutoCommit(false);
try {
    debitar(conn, origem, valor);
    creditar(conn, destino, valor);
    conn.commit();
} catch (SQLException e) {
    conn.rollback();
    throw e;
} finally {
    conn.setAutoCommit(true);
}` },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'jdbc-repository',
      titulo: 'O padrão Repository',
      icone: '📚',
      modulo: 34,
      resumo: 'Isolar a persistência atrás de uma interface — e o serviço deixar de saber o que é SQL.',
      teoria: [
        { h: 'O problema sem o padrão' },
        { code: `public class PedidoService {
    public void finalizar(Pedido pedido) {
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement("INSERT INTO pedido ...")) {
            ps.setString(1, pedido.getCliente());
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        // ... e a regra de negócio se perde no meio do JDBC
    }
}` },
        { ul: [
          'Regra de negócio e SQL misturados no mesmo método',
          'Impossível testar sem um banco de verdade rodando',
          'Trocar MySQL por Postgres significa mexer em todos os serviços',
          'A mesma query aparece copiada em vários lugares',
        ] },
        { h: 'A solução: contrato primeiro' },
        { code: `public interface ProdutoRepository {
    Optional<Produto> buscarPorId(Long id);
    List<Produto> listarTodos();
    List<Produto> buscarPorCategoria(String categoria);
    Produto salvar(Produto produto);
    void deletar(Long id);
}` },
        { h: 'Implementação com JDBC' },
        { code: `public class ProdutoRepositoryJdbc implements ProdutoRepository {

    private final DataSource dataSource;

    public ProdutoRepositoryJdbc(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Optional<Produto> buscarPorId(Long id) {
        String sql = "SELECT id, nome, preco FROM produto WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(mapear(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw new RepositorioException("Erro ao buscar produto " + id, e);
        }
    }

    private Produto mapear(ResultSet rs) throws SQLException {
        return new Produto(rs.getLong("id"), rs.getString("nome"), rs.getBigDecimal("preco"));
    }
}` },
        { h: 'O serviço só conhece a interface' },
        { code: `public class ProdutoService {

    private final ProdutoRepository repository;      // depende da ABSTRAÇÃO

    public ProdutoService(ProdutoRepository repository) {   // injeção por construtor
        this.repository = repository;
    }

    public void aplicarDesconto(Long id, double percentual) {
        Produto produto = repository.buscarPorId(id)
            .orElseThrow(() -> new ProdutoNaoEncontradoException(id));

        produto.aplicarDesconto(percentual);          // regra de negócio pura
        repository.salvar(produto);
    }
}` },
        { h: 'Implementação em memória para teste' },
        { code: `public class ProdutoRepositoryMemoria implements ProdutoRepository {

    private final Map<Long, Produto> banco = new HashMap<>();
    private final AtomicLong sequencia = new AtomicLong();

    @Override
    public Optional<Produto> buscarPorId(Long id) {
        return Optional.ofNullable(banco.get(id));
    }

    @Override
    public Produto salvar(Produto p) {
        if (p.getId() == null) p.setId(sequencia.incrementAndGet());
        banco.put(p.getId(), p);
        return p;
    }
}

// o teste roda em milissegundos, sem banco
var service = new ProdutoService(new ProdutoRepositoryMemoria());` },
        { nota: 'Esse é o ganho concreto do padrão: a mesma classe de serviço roda contra MySQL em produção e contra um `HashMap` no teste, sem alterar uma linha dela. É Inversão de Dependência (o D do SOLID) na prática.' },
        { p: 'Converta `SQLException` (checked, específica de JDBC) em uma exceção **não-checada do seu domínio** dentro do repositório. Assim a camada de serviço não fica acoplada à tecnologia de persistência — é exatamente o que o Spring faz com `DataAccessException`.' },
      ],
      passos: [],
    },
  ],
});
