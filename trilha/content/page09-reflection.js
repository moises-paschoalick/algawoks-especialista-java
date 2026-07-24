/* Unidade 9 — Reflection API e Anotações (docs/page_09.md · módulo 35) */
Trilha.add({
  numero: 9,
  titulo: 'Reflection e Anotações',
  icone: '🔍',
  cor: '#c792ea',
  prioridade: 'media',
  doc: 'docs/page_09.md',
  modulos: [35],
  resumo: 'Como Spring, Jackson e JPA funcionam por dentro — inspecionar e manipular classes em tempo de execução.',
  licoes: [

    /* ------------------------------------------------------------------ */
    {
      id: 'ref-basico',
      titulo: 'Inspecionando classes em runtime',
      icone: '🪞',
      modulo: 35,
      resumo: 'Class, Field, Method e Constructor — a porta de entrada de todo framework Java.',
      teoria: [
        { p: 'Reflection permite **inspecionar e manipular** classes, campos e métodos em tempo de execução, sem conhecê-los em tempo de compilação. É o que permite ao Spring instanciar seus beans e ao Jackson mapear seu JSON.' },
        { h: 'Obtendo o objeto Class — 3 formas' },
        { code: `Class<?> c1 = Cliente.class;                        // literal, em compilação
Class<?> c2 = cliente.getClass();                   // a partir da instância
Class<?> c3 = Class.forName("com.app.Cliente");     // pelo nome, em runtime

c1.getName();          // com.app.Cliente
c1.getSimpleName();    // Cliente
c1.getPackageName();
c1.getSuperclass();
c1.getInterfaces();
c1.isInterface();  c1.isEnum();  c1.isRecord();` },
        { h: 'Campos' },
        { code: `Class<?> clazz = Cliente.class;

clazz.getFields();            // públicos, inclusive herdados
clazz.getDeclaredFields();    // TODOS os declarados aqui, inclusive private

for (Field f : clazz.getDeclaredFields()) {
    System.out.println(f.getName() + " : " + f.getType().getSimpleName());
    System.out.println(Modifier.isPrivate(f.getModifiers()));
}

// ler e escrever um campo privado
Field campo = clazz.getDeclaredField("cpf");
campo.setAccessible(true);            // quebra o encapsulamento
String valor = (String) campo.get(cliente);
campo.set(cliente, "99999999999");` },
        { h: 'Métodos e construtores' },
        { code: `Method m = clazz.getDeclaredMethod("calcularDesconto", double.class);
m.setAccessible(true);
Object resultado = m.invoke(cliente, 10.0);       // invoca no objeto

// método estático: alvo null
Method estatico = clazz.getDeclaredMethod("criar", String.class);
estatico.invoke(null, "Ana");

// instanciar
Constructor<?> vazio = clazz.getDeclaredConstructor();
Object novo = vazio.newInstance();

Constructor<?> comArgs = clazz.getDeclaredConstructor(String.class, int.class);
Object outro = comArgs.newInstance("Ana", 30);` },
        { nota: '`setAccessible(true)` desliga a checagem de visibilidade. É o que viabiliza os frameworks, mas em código de aplicação é sinal de design ruim — e a partir do Java 17 o encapsulamento forte de módulos pode bloquear isso em pacotes do JDK.' },
        { h: 'O preço' },
        { ul: [
          '**Lento** — não há inline nem otimização do JIT como em chamada direta',
          '**Sem segurança de tipo** — erro de nome de campo só aparece em runtime',
          '**Frágil a refatoração** — renomear um campo não atualiza a String que o referencia',
          '**Quebra encapsulamento** — acessa o que a classe escondeu de propósito',
        ] },
        { p: 'Use reflection para construir **infraestrutura genérica** (mapeadores, injetores, serializadores). Em regra de negócio, prefira polimorfismo.' },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'ref-anotacoes',
      titulo: 'Anotações customizadas',
      icone: '🏷️',
      modulo: 35,
      resumo: 'Metadados que o seu código lê em runtime — @Target, @Retention e um caso real.',
      teoria: [
        { h: 'Estrutura' },
        { code: `@Target(ElementType.FIELD)              // onde pode ser aplicada
@Retention(RetentionPolicy.RUNTIME)     // até quando fica disponível
public @interface Coluna {
    String nome();                       // atributo obrigatório
    boolean obrigatorio() default false; // com valor padrão
    int ordem() default 0;
}` },
        { h: '@Target — onde aplicar' },
        { tabela: {
          head: ['ElementType', 'Aplica em'],
          rows: [
            ['`TYPE`', 'classe, interface, enum, record'],
            ['`FIELD`', 'atributo'],
            ['`METHOD`', 'método'],
            ['`PARAMETER`', 'parâmetro'],
            ['`CONSTRUCTOR`', 'construtor'],
            ['`ANNOTATION_TYPE`', 'outra anotação (meta-anotação)'],
          ] } },
        { h: '@Retention — o mais cobrado em entrevista' },
        { tabela: {
          head: ['Política', 'Sobrevive até', 'Uso'],
          rows: [
            ['`SOURCE`', 'compilação — some do `.class`', '`@Override`, Lombok'],
            ['`CLASS`', 'está no `.class`, some no carregamento', 'padrão; ferramentas de bytecode'],
            ['`RUNTIME`', 'disponível via reflection', 'Spring, JPA, Jackson'],
          ] } },
        { nota: 'Se a sua anotação precisa ser lida por reflection, ela **tem** que ser `RUNTIME`. Com o padrão (`CLASS`), `isAnnotationPresent` devolve `false` e você fica caçando um bug que não existe.' },
        { h: 'Caso real: gerador de CSV' },
        { code: `public class Cliente {
    @Coluna(nome = "Nome Completo", ordem = 1)
    private String nome;

    @Coluna(nome = "CPF", ordem = 2)
    private String cpf;

    private String senhaInterna;          // sem anotação: fica de fora
}` },
        { code: `public class GeradorCsv {

    public static String gerar(List<?> objetos) {
        if (objetos.isEmpty()) return "";

        Class<?> clazz = objetos.get(0).getClass();

        List<Field> campos = Arrays.stream(clazz.getDeclaredFields())
            .filter(f -> f.isAnnotationPresent(Coluna.class))
            .sorted(Comparator.comparingInt(f -> f.getAnnotation(Coluna.class).ordem()))
            .peek(f -> f.setAccessible(true))
            .toList();

        StringBuilder sb = new StringBuilder();
        sb.append(campos.stream()
            .map(f -> f.getAnnotation(Coluna.class).nome())
            .collect(Collectors.joining(";"))).append("\\n");

        for (Object obj : objetos) {
            sb.append(campos.stream()
                .map(f -> valorDe(f, obj))
                .collect(Collectors.joining(";"))).append("\\n");
        }
        return sb.toString();
    }

    private static String valorDe(Field f, Object obj) {
        try {
            Object v = f.get(obj);
            return v == null ? "" : v.toString();
        } catch (IllegalAccessException e) {
            throw new IllegalStateException("Campo inacessivel: " + f.getName(), e);
        }
    }
}` },
        { p: 'Este é exatamente o mecanismo do `@Column` do JPA e do `@JsonProperty` do Jackson: anotação `RUNTIME` + varredura dos campos por reflection.' },
        { h: 'Classes seladas (Java 17)' },
        { code: `public sealed interface Forma permits Circulo, Quadrado, Triangulo { }

public record Circulo(double raio) implements Forma { }
public record Quadrado(double lado) implements Forma { }
public non-sealed class Triangulo implements Forma { }   // reabre a hierarquia

// o compilador garante exaustividade: sem default
double area = switch (forma) {
    case Circulo c  -> Math.PI * c.raio() * c.raio();
    case Quadrado q -> q.lado() * q.lado();
    case Triangulo t -> t.calcularArea();
};` },
        { p: '`sealed` fecha a lista de subtipos permitidos. Cada subtipo precisa ser `final`, `sealed` ou `non-sealed`. O ganho: adicionar uma forma nova quebra a compilação de todo switch que a ignorou.' },
      ],
      passos: [],
    },
  ],
});
