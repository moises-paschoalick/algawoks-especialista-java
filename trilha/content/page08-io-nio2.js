/* Unidade 7 · I/O, NIO2 e Serialização (docs/page_08.md · módulos 28, 29, 30) */
Trilha.add({
  numero: 7,
  titulo: 'I/O, NIO2 e Serialização',
  icone: '📂',
  cor: '#4ecdc4',
  prioridade: 'media',
  doc: 'docs/page_08.md',
  modulos: [28, 29, 30],
  resumo: 'Path e Files no lugar de File, leitura lazy de arquivos grandes e os detalhes de Serializable.',
  licoes: [

    /* ------------------------------------------------------------------ */
    {
      id: 'io-path-files',
      aula: 'io-path-files',   // aula guiada em aula.html?id=io-path-files
      titulo: 'Path e Files: a API moderna',
      icone: '🧭',
      modulo: 29,
      resumo: 'Por que NIO2 substituiu java.io.File em praticamente tudo.',
      teoria: [
        { tabela: {
          head: ['', 'IO antiga (`File`)', 'NIO2 (`Path` + `Files`)'],
          rows: [
            ['Desde', 'Java 1.0', 'Java 7'],
            ['Erros', 'devolve `boolean`', 'lança `IOException` explicando'],
            ['Metadados', 'limitado', 'permissões, dono, atributos'],
            ['Links simbólicos', 'não trata', 'trata'],
            ['Percorrer diretórios', 'recursão manual', '`walk` / `walkFileTree`'],
            ['Integração com Stream', 'não', 'sim'],
          ] } },
        { p: 'O problema central da API antiga: `file.delete()` devolve `false` e você não sabe se o arquivo não existia, se estava em uso ou se faltou permissão. `Files.delete()` lança a exceção certa.' },
        { h: 'Path: representa o caminho, não o arquivo' },
        { code: `Path p = Path.of("dados", "clientes.txt");        // Java 11+
Path p2 = Paths.get("/home/user/dados.txt");      // forma antiga, equivalente

p.getFileName();      // clientes.txt
p.getParent();        // dados
p.toAbsolutePath();
p.normalize();        // resolve ".." e "."
p.resolve("sub.txt"); // concatena
p.relativize(outro);  // caminho relativo entre dois

Path.of("a/b").equals(Path.of("a/b"));   // compara o caminho, não o conteúdo` },
        { nota: '`Path` é só o endereço: criá-lo não toca no disco. Nada existe até você chamar algo de `Files`.' },
        { h: 'Files: as operações' },
        { code: `Files.exists(p);            Files.notExists(p);
Files.isDirectory(p);       Files.isRegularFile(p);
Files.isReadable(p);        Files.size(p);

Files.createFile(p);
Files.createDirectory(dir);        // falha se o pai não existir
Files.createDirectories(dir);      // cria a hierarquia toda

Files.delete(p);                   // lança se não existir
Files.deleteIfExists(p);           // devolve boolean

Files.copy(origem, destino, StandardCopyOption.REPLACE_EXISTING);
Files.move(origem, destino, StandardCopyOption.ATOMIC_MOVE);` },
        { h: 'Ler e escrever' },
        { code: `// arquivo pequeno: tudo de uma vez
String conteudo = Files.readString(p);              // Java 11+
List<String> linhas = Files.readAllLines(p);
byte[] bytes = Files.readAllBytes(p);

Files.writeString(p, "texto");
Files.write(p, linhas);
Files.writeString(p, "mais uma linha\\n", StandardOpenOption.APPEND);

// arquivo GRANDE: stream lazy, não carrega tudo na memória
try (Stream<String> linhas = Files.lines(p)) {
    linhas.filter(l -> l.contains("ERRO"))
          .map(String::trim)
          .forEach(System.out::println);
}` },
        { nota: '`Files.lines` devolve um stream que segura o arquivo aberto, então use sempre dentro de `try-with-resources`. `readAllLines` carrega o arquivo inteiro na heap: em log de gigabytes é `OutOfMemoryError` na certa.' },
        { h: 'Percorrer diretórios' },
        { code: `// simples e lazy
try (Stream<Path> caminhos = Files.walk(Path.of("projeto"))) {
    caminhos.filter(Files::isRegularFile)
            .filter(p -> p.toString().endsWith(".java"))
            .forEach(System.out::println);
}

Files.list(dir);              // só o primeiro nível
Files.find(dir, 5, (p, attr) -> attr.size() > 1_000_000);

// controle completo: pular pastas, tratar erro por arquivo
Files.walkFileTree(raiz, new SimpleFileVisitor<Path>() {
    @Override
    public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes a) {
        return dir.getFileName().toString().equals("node_modules")
             ? FileVisitResult.SKIP_SUBTREE
             : FileVisitResult.CONTINUE;
    }
    @Override
    public FileVisitResult visitFile(Path file, BasicFileAttributes a) {
        System.out.println(file + " - " + a.size());
        return FileVisitResult.CONTINUE;
    }
});` },
        { h: 'OpenOptions' },
        { tabela: {
          head: ['Opção', 'Efeito'],
          rows: [
            ['`CREATE`', 'cria se não existir'],
            ['`CREATE_NEW`', 'cria; falha se já existir'],
            ['`APPEND`', 'escreve no fim'],
            ['`TRUNCATE_EXISTING`', 'zera antes de escrever (padrão da escrita)'],
            ['`DELETE_ON_CLOSE`', 'apaga ao fechar: arquivo temporário'],
          ] } },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'io-streams-classicos',
      aula: 'io-streams-classicos',   // aula guiada em aula.html?id=io-streams-classicos
      titulo: 'Streams de I/O e buffers',
      icone: '🚿',
      modulo: 28,
      resumo: 'Byte stream vs character stream, e por que envolver tudo em Buffered.',
      teoria: [
        { p: 'A API clássica divide em duas famílias: **bytes** (`InputStream`/`OutputStream`) para dados binários, e **caracteres** (`Reader`/`Writer`) para texto.' },
        { tabela: {
          head: ['Família', 'Base', 'Para'],
          rows: [
            ['Byte', '`InputStream` / `OutputStream`', 'imagem, PDF, qualquer binário'],
            ['Caractere', '`Reader` / `Writer`', 'texto: trata encoding'],
            ['Buffer', '`BufferedReader` / `BufferedWriter`', 'envolve os outros e reduz chamadas ao SO'],
          ] } },
        { code: `// leitura de texto com buffer e charset explícito
try (BufferedReader br = Files.newBufferedReader(p, StandardCharsets.UTF_8)) {
    String linha;
    while ((linha = br.readLine()) != null) {
        processar(linha);
    }
}

// escrita
try (BufferedWriter bw = Files.newBufferedWriter(p, StandardCharsets.UTF_8,
        StandardOpenOption.CREATE, StandardOpenOption.APPEND)) {
    bw.write("nova linha");
    bw.newLine();
}

// binário
try (InputStream in = Files.newInputStream(origem);
     OutputStream out = Files.newOutputStream(destino)) {
    in.transferTo(out);         // Java 9+
}` },
        { nota: 'Sempre declare o **charset**. Sem ele, a JVM usa o padrão da plataforma e o mesmo código produz resultado diferente em máquinas diferentes, origem clássica de acentuação quebrada.' },
        { p: 'Sem buffer, cada `read()` vira uma chamada ao sistema operacional. Com `BufferedReader`, o Java lê um bloco grande de uma vez e serve as linhas da memória, o que costuma ser uma ordem de grandeza mais rápido.' },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'io-serializacao',
      aula: 'io-serializacao',   // aula guiada em aula.html?id=io-serializacao
      titulo: 'Serialização de objetos',
      icone: '💾',
      modulo: 30,
      resumo: 'Transformar objeto em bytes, e os cuidados com serialVersionUID e transient.',
      teoria: [
        { p: 'Serializar é converter o objeto em uma sequência de bytes para gravar em arquivo ou enviar pela rede. A classe precisa implementar `Serializable`: uma interface **marcadora**, sem métodos.' },
        { code: `public class Cliente implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String nome;
    private String cpf;
    private transient String senha;     // NÃO será serializado
    private static int contador;        // static nunca é serializado
}` },
        { h: 'Gravar e ler' },
        { code: `// serializar
try (ObjectOutputStream out = new ObjectOutputStream(
        Files.newOutputStream(Path.of("cliente.ser")))) {
    out.writeObject(cliente);
}

// desserializar
try (ObjectInputStream in = new ObjectInputStream(
        Files.newInputStream(Path.of("cliente.ser")))) {
    Cliente c = (Cliente) in.readObject();     // lança ClassNotFoundException
}` },
        { h: 'serialVersionUID' },
        { p: 'É a **versão do contrato** da classe. Na desserialização, a JVM compara o ID gravado com o da classe atual; se forem diferentes, lança `InvalidClassException`.' },
        { ul: [
          'Se você **não declarar**, a JVM calcula um a partir da estrutura da classe',
          'Qualquer mudança (novo campo, mudança de assinatura) muda o ID calculado',
          'Resultado: dados gravados ontem deixam de ser lidos hoje',
          'Declarando `1L` explicitamente, você controla quando a compatibilidade quebra',
        ] },
        { nota: 'Campo novo em classe com `serialVersionUID` fixo é lido como valor padrão (`null`/`0`) nos dados antigos, comportamento previsível. Sem o ID declarado, você só recebe uma exceção.' },
        { h: 'transient' },
        { p: 'Marca campos que **não devem** ser serializados: senhas, tokens, caches, conexões e qualquer objeto não-serializável. Na volta, o campo recebe o valor padrão do tipo.' },
        { h: 'Serialização customizada' },
        { code: `private void writeObject(ObjectOutputStream out) throws IOException {
    out.defaultWriteObject();              // grava os campos normais
    out.writeObject(criptografar(senha));  // e o campo transient de forma segura
}

private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
    in.defaultReadObject();
    this.senha = descriptografar((String) in.readObject());
    this.cache = new HashMap<>();          // reconstroi o que era transient
}` },
        { p: 'Se um campo referencia outro objeto, ele **também** precisa ser `Serializable`, senão a gravação falha com `NotSerializableException`. A serialização é em cascata por todo o grafo de objetos.' },
        { nota: 'Em sistemas novos, prefira JSON (Jackson) ou outro formato explícito para trocar dados entre serviços. A serialização nativa acopla o formato à estrutura das classes Java e já foi origem de várias falhas de segurança conhecidas.' },
      ],
      passos: [],
    },
  ],
});
