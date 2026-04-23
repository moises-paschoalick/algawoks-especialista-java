# Dia 9 — JDBC e Padrão Repository

> Módulos do curso: 33, 34
> Prioridade: 🟡 Média-Alta

**Navegação:** [← Programação Funcional](page_04.md) | [→ Próximo: Fundamentos](page_06.md)

---

## O que você vai dominar

- Conectar ao banco com JDBC sem SQL Injection
- Executar INSERT, UPDATE, DELETE e SELECT com `PreparedStatement`
- Ler resultados com `ResultSet`
- Aplicar o Padrão Repository com injeção de dependência
- Separar lógica de negócio de acesso a dados

---

## 1. JDBC — Acesso ao Banco de Dados

### 1.1 Dependência Maven (MySQL)

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.3.0</version>
</dependency>
```

### 1.2 Conexão

```java
String url  = "jdbc:mysql://localhost:3306/meu_banco?useSSL=false&serverTimezone=UTC";
String user = "root";
String pass = "senha";

// try-with-resources — fecha a conexão automaticamente
try (Connection conn = DriverManager.getConnection(url, user, pass)) {
    System.out.println("Conectado!");
} catch (SQLException e) {
    throw new RuntimeException("Falha ao conectar ao banco", e);
}
```

### 1.3 Por que usar PreparedStatement — nunca Statement

```java
String nomeInput = "' OR '1'='1"; // tentativa de SQL Injection

// VULNERÁVEL — Statement monta a query com concatenação
Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery(
    "SELECT * FROM usuario WHERE nome = '" + nomeInput + "'"
); // retorna TODOS os usuários!

// SEGURO — PreparedStatement escapa os parâmetros
PreparedStatement stmt = conn.prepareStatement(
    "SELECT * FROM usuario WHERE nome = ?"
);
stmt.setString(1, nomeInput); // nomeInput é tratado como dado, não como SQL
```

### 1.4 INSERT

```java
String sql = """
    INSERT INTO venda (nome_cliente, valor_total, data_pagamento)
    VALUES (?, ?, ?)
    """;

try (Connection conn = DriverManager.getConnection(url, user, pass);
     PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

    stmt.setString(1, "Alice");
    stmt.setBigDecimal(2, new BigDecimal("1500.00"));
    stmt.setDate(3, Date.valueOf(LocalDate.now()));

    int linhasAfetadas = stmt.executeUpdate();
    System.out.println("Linhas inseridas: " + linhasAfetadas);

    // Obtendo o ID gerado pelo banco
    try (ResultSet keys = stmt.getGeneratedKeys()) {
        if (keys.next()) {
            long idGerado = keys.getLong(1);
            System.out.println("ID gerado: " + idGerado);
        }
    }
}
```

### 1.5 SELECT com ResultSet

```java
String sql = "SELECT id, nome_cliente, valor_total, data_pagamento FROM venda WHERE id = ?";

try (Connection conn = DriverManager.getConnection(url, user, pass);
     PreparedStatement stmt = conn.prepareStatement(sql)) {

    stmt.setLong(1, id);

    try (ResultSet rs = stmt.executeQuery()) {
        if (rs.next()) {
            return new Venda(
                rs.getLong("id"),
                rs.getString("nome_cliente"),
                rs.getBigDecimal("valor_total"),
                rs.getDate("data_pagamento").toLocalDate()
            );
        }
        return null; // ou lançar exceção
    }
}
```

### 1.6 SELECT — lista de resultados

```java
String sql = "SELECT id, nome_cliente, valor_total, data_pagamento FROM venda";
List<Venda> vendas = new ArrayList<>();

try (Connection conn = DriverManager.getConnection(url, user, pass);
     PreparedStatement stmt = conn.prepareStatement(sql);
     ResultSet rs = stmt.executeQuery()) {

    while (rs.next()) {  // next() avança para a próxima linha
        vendas.add(new Venda(
            rs.getLong("id"),
            rs.getString("nome_cliente"),
            rs.getBigDecimal("valor_total"),
            rs.getDate("data_pagamento").toLocalDate()
        ));
    }
}
return vendas;
```

### 1.7 UPDATE e DELETE

```java
// UPDATE
String updateSql = "UPDATE venda SET valor_total = ? WHERE id = ?";
try (var conn = DriverManager.getConnection(url, user, pass);
     var stmt = conn.prepareStatement(updateSql)) {
    stmt.setBigDecimal(1, novoValor);
    stmt.setLong(2, id);
    stmt.executeUpdate();
}

// DELETE
String deleteSql = "DELETE FROM venda WHERE id = ?";
try (var conn = DriverManager.getConnection(url, user, pass);
     var stmt = conn.prepareStatement(deleteSql)) {
    stmt.setLong(1, id);
    stmt.executeUpdate();
}
```

### 1.8 Mapeamento de tipos Java ↔ SQL

| Java                  | Método PreparedStatement | Método ResultSet        |
|-----------------------|--------------------------|-------------------------|
| `String`              | `setString(i, v)`        | `getString("col")`      |
| `int` / `Integer`     | `setInt(i, v)`           | `getInt("col")`         |
| `long` / `Long`       | `setLong(i, v)`          | `getLong("col")`        |
| `double` / `Double`   | `setDouble(i, v)`        | `getDouble("col")`      |
| `BigDecimal`          | `setBigDecimal(i, v)`    | `getBigDecimal("col")`  |
| `LocalDate`           | `setDate(i, Date.valueOf(v))` | `getDate("col").toLocalDate()` |
| `boolean`             | `setBoolean(i, v)`       | `getBoolean("col")`     |

**Pratique:** Módulo `33. Banco de dados`

---

## 2. Padrão Repository

### 2.1 O problema sem o padrão

```java
// Serviço de negócio acoplado ao JDBC — difícil testar, difícil trocar de banco
public class CadastroVendaServico {

    public Venda cadastrar(String cliente, BigDecimal valor, LocalDate data) {
        if (valor.compareTo(BigDecimal.ZERO) <= 0)
            throw new NegocioException("Valor deve ser positivo");

        // Código JDBC direto na lógica de negócio — acoplamento!
        String sql = "INSERT INTO venda (nome_cliente, valor_total) VALUES (?, ?)";
        try (var conn = DriverManager.getConnection(url, user, pass);
             var stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, cliente);
            stmt.setBigDecimal(2, valor);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        // ...
    }
}
```

### 2.2 A solução: Repository como interface

```
┌──────────────────────────────────────────────┐
│  Camada de Negócio (domain)                 │
│  CadastroVendaServico                        │
│  └── conhece apenas: VendaRepositorio        │
└──────────────────────┬───────────────────────┘
                       │ interface
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
 MySQLVendaRepo  OracleVendaRepo  MemoriaVendaRepo
 (infraestrutura)                 (para testes)
```

### 2.3 Implementação passo a passo

**Passo 1 — Defina a interface (contrato)**

```java
public interface VendaRepositorio {
    Venda adicionar(Venda venda);
    Optional<Venda> buscarPorId(Long id);
    List<Venda> listar();
    void atualizar(Venda venda);
    void remover(Long id);
}
```

**Passo 2 — Implemente para MySQL**

```java
public class MySQLVendaRepositorio implements VendaRepositorio {
    private final String url;
    private final String user;
    private final String pass;

    public MySQLVendaRepositorio(String url, String user, String pass) {
        this.url  = url;
        this.user = user;
        this.pass = pass;
    }

    @Override
    public Venda adicionar(Venda venda) {
        String sql = "INSERT INTO venda (nome_cliente, valor_total, data_pagamento) VALUES (?, ?, ?)";
        try (var conn = DriverManager.getConnection(url, user, pass);
             var stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, venda.getNomeCliente());
            stmt.setBigDecimal(2, venda.getValorTotal());
            stmt.setDate(3, Date.valueOf(venda.getDataPagamento()));
            stmt.executeUpdate();

            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) venda.setId(keys.getLong(1));
            }
            return venda;
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao adicionar venda", e);
        }
    }

    @Override
    public Optional<Venda> buscarPorId(Long id) {
        String sql = "SELECT * FROM venda WHERE id = ?";
        try (var conn = DriverManager.getConnection(url, user, pass);
             var stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) return Optional.of(mapear(rs));
                return Optional.empty();
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar venda", e);
        }
    }

    private Venda mapear(ResultSet rs) throws SQLException {
        return new Venda(
            rs.getLong("id"),
            rs.getString("nome_cliente"),
            rs.getBigDecimal("valor_total"),
            rs.getDate("data_pagamento").toLocalDate()
        );
    }

    // listar(), atualizar(), remover() — mesma estrutura
}
```

**Passo 3 — Implemente em memória (para testes)**

```java
public class MemoriaVendaRepositorio implements VendaRepositorio {
    private final Map<Long, Venda> dados = new HashMap<>();
    private long proximoId = 1;

    @Override
    public Venda adicionar(Venda venda) {
        venda.setId(proximoId++);
        dados.put(venda.getId(), venda);
        return venda;
    }

    @Override
    public Optional<Venda> buscarPorId(Long id) {
        return Optional.ofNullable(dados.get(id));
    }

    @Override
    public List<Venda> listar() { return new ArrayList<>(dados.values()); }

    @Override
    public void atualizar(Venda venda) { dados.put(venda.getId(), venda); }

    @Override
    public void remover(Long id) { dados.remove(id); }
}
```

**Passo 4 — Serviço de negócio desacoplado**

```java
public class CadastroVendaServico {
    private final VendaRepositorio repositorio; // depende da INTERFACE

    // Injeção de dependência pelo construtor
    public CadastroVendaServico(VendaRepositorio repositorio) {
        this.repositorio = repositorio;
    }

    public Venda cadastrar(String nomeCliente, BigDecimal valorTotal, LocalDate dataPagamento) {
        // Validações de negócio — sem nenhum código de infra aqui
        Objects.requireNonNull(nomeCliente, "nome do cliente obrigatório");
        if (valorTotal.compareTo(BigDecimal.ZERO) <= 0)
            throw new NegocioException("Valor total deve ser maior que zero");
        if (dataPagamento.isAfter(LocalDate.now()))
            throw new NegocioException("Data de pagamento não pode ser futura");

        return repositorio.adicionar(new Venda(nomeCliente, valorTotal, dataPagamento));
    }

    public Venda buscar(Long id) {
        return repositorio.buscarPorId(id)
            .orElseThrow(() -> new VendaNaoEncontradaException(id));
    }
}
```

**Passo 5 — Wiring na aplicação (sem framework)**

```java
public class Main {
    public static void main(String[] args) {
        // Troca de implementação sem alterar nenhum código de negócio
        VendaRepositorio repositorio = new MySQLVendaRepositorio(url, user, pass);
        // VendaRepositorio repositorio = new MemoriaVendaRepositorio(); // para testes

        CadastroVendaServico servico = new CadastroVendaServico(repositorio);

        Venda venda = servico.cadastrar("Bob", new BigDecimal("500.00"), LocalDate.now());
        System.out.println("Cadastrada: " + venda.getId());
    }
}
```

**Pratique:** Módulo `34. Padrao repository`

---

## 3. Exercício Prático

Implemente do zero:

1. Crie a entidade `Cliente(Long id, String nome, String email, LocalDate dataCadastro)`
2. Crie a interface `ClienteRepositorio` com: `adicionar`, `buscarPorEmail`, `listar`, `remover`
3. Implemente `MemoriaClienteRepositorio` (sem banco)
4. Implemente `CadastroClienteServico` com regras:
   - Email não pode ser duplicado → lança `EmailJaCadastradoException`
   - Email deve conter `@` → lança `IllegalArgumentException`
5. Escreva um `main` que cadastra 3 clientes, tenta duplicar um, e lista todos

---

## Checklist do Dia

- [ ] Sei conectar ao banco com `DriverManager` e `try-with-resources`
- [ ] Uso `PreparedStatement` sempre (nunca `Statement` com concatenação)
- [ ] Sei fazer INSERT recuperando o ID gerado
- [ ] Sei iterar `ResultSet` e mapear para objetos
- [ ] Implemento a interface `VendaRepositorio` com MySQL e em memória
- [ ] O serviço de negócio só conhece a interface — sem código JDBC nele

---

**Navegação:** [← Programação Funcional](page_04.md) | [→ Próximo: Fundamentos](page_06.md)
