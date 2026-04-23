# I/O, NIO2 e Serialização

> Módulos do curso: 28, 29, 30
> Prioridade: 🟡 Média

**Navegação:** [← Date-Time API](page_07.md) | [→ Próximo: Reflection API](page_09.md)

---

## O que você vai dominar

- Diferença entre API IO antiga e NIO2
- Criar, copiar, mover e deletar arquivos com `Path` e `Files`
- Ler e escrever arquivos de texto e binários
- Percorrer diretórios recursivamente
- Serializar e desserializar objetos
- Controle de versão com `serialVersionUID`

---

## 1. NIO2 vs IO Antiga

| Aspecto              | java.io (`File`)                  | java.nio.file (`Path` + `Files`) |
|----------------------|-----------------------------------|----------------------------------|
| Erros                | Retorna `false` silenciosamente   | Lança `IOException`              |
| Criar hierarquia     | `mkdirs()` (ignora erro)          | `Files.createDirectories()`      |
| Copiar arquivo       | manual (streams)                  | `Files.copy()`                   |
| Mover arquivo        | `renameTo()` (inconsistente)      | `Files.move()`                   |
| Ler arquivo inteiro  | `BufferedReader` + loop           | `Files.readString()` / `readAllLines()` |
| Percorrer diretório  | `listFiles()` + recursão manual   | `Files.walk()` / `walkFileTree()`|

> **Regra:** sempre use NIO2 (`java.nio.file`) para código novo.

---

## 2. Path — Representando Caminhos

```java
// Criação de caminhos
Path absoluto  = Path.of("/home/usuario/docs/arquivo.txt");
Path relativo  = Path.of("docs/arquivo.txt");
Path composto  = Path.of("docs", "contratos", "cliente.txt"); // multiplataforma

// Manipulação de caminhos
Path arquivo   = Path.of("docs/contratos/cliente.txt");
arquivo.getFileName();      // cliente.txt
arquivo.getParent();        // docs/contratos
arquivo.getRoot();          // / (Linux) ou C:\ (Windows)
arquivo.toAbsolutePath();   // /home/usuario/docs/contratos/cliente.txt

// Resolver caminhos (concatenar)
Path base  = Path.of("docs");
Path full  = base.resolve("contratos/cliente.txt"); // docs/contratos/cliente.txt
Path relat = base.relativize(full); // contratos/cliente.txt

// Normalizar (remove . e ..)
Path.of("docs/../docs/./arquivo.txt").normalize(); // docs/arquivo.txt
```

---

## 3. Files — Operações em Arquivos

### 3.1 Criar, verificar e deletar

```java
Path pasta   = Path.of("docs/contratos/fornecedores");
Path arquivo = pasta.resolve("contrato-001.txt");

// Criar
Files.createDirectories(pasta);   // cria toda a hierarquia — seguro se já existe
Files.createDirectory(pasta);     // apenas um nível — lança exceção se já existe
Files.createFile(arquivo);        // cria arquivo vazio — lança exceção se já existe

// Verificar
Files.exists(arquivo);            // true / false
Files.notExists(arquivo);         // true / false
Files.isDirectory(pasta);         // true
Files.isRegularFile(arquivo);     // true
Files.isReadable(arquivo);        // permissão de leitura
Files.isWritable(arquivo);        // permissão de escrita

// Deletar
Files.delete(arquivo);            // lança exceção se não existe
Files.deleteIfExists(arquivo);    // seguro — não lança exceção se não existe

// Metadados
Files.size(arquivo);              // tamanho em bytes
BasicFileAttributes attrs = Files.readAttributes(arquivo, BasicFileAttributes.class);
attrs.creationTime();
attrs.lastModifiedTime();
```

### 3.2 Copiar e mover

```java
Path origem  = Path.of("docs/original.txt");
Path destino = Path.of("backup/copia.txt");

// Copiar — CopyOption controla o comportamento
Files.copy(origem, destino);                                  // falha se destino existe
Files.copy(origem, destino, StandardCopyOption.REPLACE_EXISTING); // sobrescreve se existe
Files.copy(origem, destino, StandardCopyOption.COPY_ATTRIBUTES);  // preserva atributos

// Mover (rename incluso)
Files.move(origem, destino);
Files.move(origem, destino, StandardCopyOption.REPLACE_EXISTING);
Files.move(origem, Path.of("docs/renomeado.txt")); // rename
```

---

## 4. Ler e Escrever Arquivos

### 4.1 Arquivos de texto — forma simples (Java 11+)

```java
Path arquivo = Path.of("dados.txt");

// Escrever
Files.writeString(arquivo, "conteúdo completo\n");
Files.writeString(arquivo, "mais conteúdo\n", StandardOpenOption.APPEND);

// Escrever lista de linhas
List<String> linhas = List.of("linha 1", "linha 2", "linha 3");
Files.write(arquivo, linhas);                         // UTF-8 por padrão
Files.write(arquivo, linhas, StandardCharsets.ISO_8859_1); // charset específico

// Ler
String conteudo        = Files.readString(arquivo);
List<String> todasLinhas = Files.readAllLines(arquivo);
byte[] bytes           = Files.readAllBytes(arquivo);
```

### 4.2 Stream de linhas — para arquivos grandes (lazy)

```java
// try-with-resources — stream deve ser fechado
try (Stream<String> linhas = Files.lines(Path.of("grande.csv"))) {
    long countJava = linhas
        .filter(l -> l.contains("Java"))
        .count();
}
```

### 4.3 BufferedReader/Writer — para controle fino

```java
// Leitura com BufferedReader
try (BufferedReader reader = Files.newBufferedReader(Path.of("dados.txt"))) {
    String linha;
    while ((linha = reader.readLine()) != null) {
        processar(linha);
    }
}

// Escrita com BufferedWriter
try (BufferedWriter writer = Files.newBufferedWriter(Path.of("saida.txt"),
        StandardOpenOption.CREATE, StandardOpenOption.WRITE)) {
    writer.write("linha 1");
    writer.newLine();
    writer.write("linha 2");
}
```

---

## 5. Percorrer Diretórios

### 5.1 Files.walk() — simples

```java
// Lista todos os arquivos recursivamente
try (Stream<Path> stream = Files.walk(Path.of("docs"))) {
    stream
        .filter(Files::isRegularFile)
        .filter(p -> p.toString().endsWith(".txt"))
        .forEach(System.out::println);
}

// Limitar profundidade
try (Stream<Path> stream = Files.walk(Path.of("docs"), 2)) { // máx 2 níveis
    stream.forEach(System.out::println);
}
```

### 5.2 Files.walkFileTree() — controle completo

```java
Files.walkFileTree(Path.of("docs"), new SimpleFileVisitor<Path>() {

    @Override
    public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) {
        System.out.println("Entrando: " + dir);
        return FileVisitResult.CONTINUE;
    }

    @Override
    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
        if (file.toString().endsWith(".tmp")) {
            try {
                Files.delete(file);
                System.out.println("Deletado: " + file);
            } catch (IOException e) {
                System.err.println("Erro ao deletar: " + file);
            }
        }
        return FileVisitResult.CONTINUE;
    }

    @Override
    public FileVisitResult visitFileFailed(Path file, IOException exc) {
        System.err.println("Falha ao visitar: " + file);
        return FileVisitResult.CONTINUE; // continua mesmo com falha
    }
});
```

**FileVisitResult options:** `CONTINUE`, `SKIP_SUBTREE`, `SKIP_SIBLINGS`, `TERMINATE`

---

## 6. Serialização de Objetos

### 6.1 Tornando uma classe serializável

```java
import java.io.Serializable;
import java.io.Serial;

public class Cliente implements Serializable {

    // Controla compatibilidade entre versões
    // Se omitido, Java gera automaticamente — quebra ao mudar a classe!
    @Serial
    private static final long serialVersionUID = 1L;

    private String nome;
    private String email;
    private LocalDate dataCadastro;

    private transient String senha;     // NÃO serializado — dados sensíveis
    private transient Connection conn;  // NÃO serializado — não serializável

    // construtores, getters...
}
```

### 6.2 Serializar (gravar objeto em arquivo)

```java
Path path = Path.of("dados/cliente.ser");
Files.createDirectories(path.getParent()); // garante que o diretório existe

try (ObjectOutputStream out = new ObjectOutputStream(
        Files.newOutputStream(path, CREATE, WRITE))) {
    out.writeObject(cliente);
    System.out.println("Serializado em: " + path);
}
```

### 6.3 Desserializar (ler objeto do arquivo)

```java
try (ObjectInputStream in = new ObjectInputStream(
        Files.newInputStream(Path.of("dados/cliente.ser")))) {

    Cliente cliente = (Cliente) in.readObject(); // cast necessário
    System.out.println("Lido: " + cliente.getNome());
} catch (ClassNotFoundException e) {
    throw new RuntimeException("Classe não encontrada no classpath", e);
}
```

### 6.4 Serialização customizada

```java
public class Configuracao implements Serializable {
    @Serial private static final long serialVersionUID = 1L;

    private String servidor;
    private transient String senhaReal; // não serializa automaticamente

    // Customiza o processo de serialização
    @Serial
    private void writeObject(ObjectOutputStream out) throws IOException {
        out.defaultWriteObject();                    // serializa campos normais
        out.writeObject(criptografar(senhaReal));    // serializa senha criptografada
    }

    // Customiza o processo de desserialização
    @Serial
    private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
        in.defaultReadObject();                      // desserializa campos normais
        this.senhaReal = descriptografar((String) in.readObject()); // descriptografa
    }
}
```

### 6.5 serialVersionUID — entendendo a importância

```java
// Versão 1 da classe — serialVersionUID = 1L
public class Pedido implements Serializable {
    @Serial private static final long serialVersionUID = 1L;
    private String cliente;
    private BigDecimal valor;
}
// Arquivo pedido.ser gravado com esta versão

// Versão 2 — campo adicionado
public class Pedido implements Serializable {
    @Serial private static final long serialVersionUID = 1L; // MESMO UID = compatível
    private String cliente;
    private BigDecimal valor;
    private LocalDate data; // novo campo — será null ao ler arquivo antigo
}

// Se o serialVersionUID fosse diferente (ou não declarado):
// InvalidClassException ao tentar ler o arquivo antigo!
```

---

## 7. OpenOptions — Controlando leitura/escrita

| Opção                      | Comportamento                                          |
|----------------------------|--------------------------------------------------------|
| `StandardOpenOption.CREATE`      | Cria se não existe                               |
| `StandardOpenOption.CREATE_NEW`  | Cria — falha se já existe                        |
| `StandardOpenOption.WRITE`       | Abre para escrita                                |
| `StandardOpenOption.APPEND`      | Escreve no final do arquivo                      |
| `StandardOpenOption.TRUNCATE_EXISTING` | Apaga conteúdo existente ao abrir         |
| `StandardOpenOption.READ`        | Abre para leitura (padrão)                       |

---

## 8. Exercício Prático

Implemente do zero:

1. Crie um diretório `backup/2024` e dentro dele crie 3 arquivos de log com o nome no formato `log-YYYY-MM-DD.txt`
2. Escreva 10 linhas em cada arquivo
3. Leia e filtre apenas as linhas que contêm a palavra "ERROR" de todos os arquivos
4. Crie uma classe `LogEntry(LocalDateTime timestamp, String nivel, String mensagem)` serializável
5. Serialize uma lista de `LogEntry` em `backup/logs.ser`
6. Desserialize e imprima os entries com nível "ERROR"

---

## Checklist do Dia

- [ ] Prefiro NIO2 (`Path`, `Files`) à API legada (`File`)
- [ ] Uso `Files.createDirectories()` para criar hierarquias
- [ ] Leio arquivos com `Files.readString()` ou `Files.lines()` (para arquivos grandes)
- [ ] Percorro diretórios com `Files.walk()` ou `walkFileTree()`
- [ ] Declaro `serialVersionUID` em toda classe `Serializable`
- [ ] Uso `transient` para campos não serializáveis ou sensíveis
- [ ] Fecho todos os streams com `try-with-resources`

---

**Navegação:** [← Date-Time API](page_07.md) | [→ Próximo: Reflection API](page_09.md)
