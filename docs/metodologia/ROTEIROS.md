# Roteiros de todas as aulas

> Gerado por `tools/aula.mjs catalogo` a partir de `tools/roteiros.json`. Nao edite a mao.
> Saida das etapas 1-2 da esteira (pedagogia + especialista Java). Ver [metodologia](README.md).

**9 de 36 aulas prontas.**

## Fundamentos

### ✅ 🟢 Primitivos e conversões `primitivos`

- **Lição / módulo**: `fund-primitivos` · módulo 2
- **Conceito nuclear**: Um tipo primitivo é uma gaveta de tamanho fixo; disso decorrem estouro, promoção e cast.
- **Analogia central**: Gaveta de tamanho fixo; régua de bits que transborda.
- **Arco**: 1. Toca a tabela de tipos 2. byte estoura de 127 para -128 3. sufixo L do literal 4. promoção byte+byte vira int 5. divisão inteira 7/2=3
- **Pegadinha de entrevista**: Overflow silencioso; 7/2 == 3.

### ✅ 🟢 Wrappers, boxing e o cache do Integer `wrappers`

- **Lição / módulo**: `fund-wrappers` · módulo 7
- **Conceito nuclear**: Wrapper embrulha o primitivo num objeto; a JVM cacheia Integer de -128 a 127.
- **Analogia central**: Caixa de presente + almoxarifado (cafeteria com prateleira pronta vs fábrica).
- **Arco**: 1. Transportadora só aceita caixa (List) 2. bancada x estante (stack/heap) 3. maquina de embrulho (boxing) 4. prateleira 127 vs fabrica 128 5. encomenda que nao chegou (NPE)
- **Pegadinha de entrevista**: 127 == 127 true, 128 == 128 false; NPE no unboxing.

### ✅ 🟢 String, pool e StringBuilder `strings`

- **Lição / módulo**: `fund-strings` · módulo 20
- **Conceito nuclear**: String é imutável; o pool compartilha literais; StringBuilder evita O(n2) em loop.
- **Analogia central**: Placa gravada em pedra; biblioteca de exemplar único; copista x fichário.
- **Arco**: 1. Placa nao se edita 2. biblioteca de exemplar unico (pool) 3. grafica (new String) 4. copista O(n2) x fichario 5. imutabilidade permite o pool
- **Pegadinha de entrevista**: == vs equals; + em loop.

### ☐ 🟢 Controle de fluxo e switch moderno `fund-fluxo`

- **Lição / módulo**: `fund-fluxo` · módulo 3
- **Conceito nuclear**: O switch com seta nao vaza para o proximo caso; if aninhado vira guard clause.
- **Analogia central**: Trilho de trem com desvio controlado; o switch classico como dominó que cai em cascata (fall-through).
- **Arco**: 1. Bifurcacao: if/else como estrada 2. switch classico esquece break e cai em cascata 3. a seta -> nao vaza e devolve valor (yield) 4. loops: for/while/do-while e continue/break 5. switch de enum exaustivo, o compilador cobra os casos
- **Pegadinha de entrevista**: Fall-through sem break; switch de expressao exige default (ou enum exaustivo).

### ☐ 🟢 Stack, Heap e Garbage Collector `fund-memoria`

- **Lição / módulo**: `fund-memoria` · módulo 9
- **Conceito nuclear**: Stack guarda locais e referencias por thread; heap guarda objetos; o GC recolhe o que ninguem referencia.
- **Analogia central**: Bancada por pessoa (stack) x deposito compartilhado (heap); o faxineiro (GC) recolhe o que ninguem usa.
- **Arco**: 1. Onde mora cada coisa (valor na bancada, objeto no deposito) 2. referencia = ficha que aponta o objeto 3. objeto sem ficha vira lixo 4. o faxineiro recolhe (nao se controla quando) 5. vazamento: colecao estatica que so cresce
- **Pegadinha de entrevista**: Quando um objeto e elegivel ao GC; StackOverflow x OutOfMemory.

## OOP Completo

### ✅ 🔴 Encapsulamento e visibilidade `oop-encapsulamento`

- **Lição / módulo**: `oop-encapsulamento` · módulo 5+11
- **Conceito nuclear**: O objeto e um cofre: esconde o estado e so o altera por operacoes que o mantem valido.
- **Analogia central**: Cofre trancado + guiche que valida; niveis de cracha; nao entregue a chave.
- **Arco**: 1. Conta aberta: setSaldo poe estado impossivel 2. trancar o campo (private) 3. guiche valida (depositar/sacar) 4. crachas de acesso 5. vazamento de referencia (cofre furado)
- **Pegadinha de entrevista**: Operacao x setter; vazamento de referencia mesmo com private.

### ✅ 🔴 Herança, polimorfismo e classes abstratas `oop-heranca`

- **Lição / módulo**: `oop-heranca-polimorfismo` · módulo 12+13
- **Conceito nuclear**: Um comando, cada tipo do seu jeito, decidido em runtime (late binding).
- **Analogia central**: Empresa: cracha base, extrair Funcionario, rodar a folha; classe abstrata nao se contrata.
- **Arco**: 1. Repeticao entre cargos 2. extrair a base (extends) 3. sobrescrever com super 4. rodar a folha (polimorfismo) 5. classe abstrata e @Override
- **Pegadinha de entrevista**: Sobrescrita x sobrecarga; quem decide o metodo (runtime).

### ✅ 🔴 Interfaces e abstração `oop-interfaces`

- **Lição / módulo**: `oop-interfaces` · módulo 14
- **Conceito nuclear**: Interface e um contrato: diz o que faz, nao como; uma classe assina varios contratos.
- **Analogia central**: Tomada padrao: qualquer aparelho que 'implementa' o plugue funciona na tomada. Contrato assinado sem herdar estado.
- **Arco**: 1. Codigo preso a classe concreta quebra ao trocar 2. programe para a tomada (interface) 3. default method: o contrato ja traz o basico 4. uma classe assina varios contratos (heranca multipla de tipo) 5. interface x classe abstrata
- **Pegadinha de entrevista**: Interface x classe abstrata; default methods; interface funcional.

### ✅ 🔴 Records e imutabilidade `oop-records`

- **Lição / módulo**: `oop-records` · módulo 11
- **Conceito nuclear**: Record e um portador de dados imutavel; o compilador gera construtor, equals, hashCode e toString.
- **Analogia central**: Ficha lacrada / cracha plastificado: carimba, valida e sela, nao se altera depois.
- **Arco**: 1. DTO com 60 linhas de boilerplate 2. record numa linha gera tudo 3. construtor compacto valida antes de lacrar 4. o que record nao permite (herdar, mutar) 5. imutabilidade rasa: copie a List no construtor
- **Pegadinha de entrevista**: Quando usar record x classe; imutabilidade rasa.

### ✅ 🔴 Composição vs herança e a Lei de Demeter `oop-composicao`

- **Lição / módulo**: `oop-composicao` · módulo 15
- **Conceito nuclear**: Montar por pecas (tem-um) escala melhor que herdar (e-um); fale so com vizinhos diretos.
- **Analogia central**: Cafe com adicionais (decorator: cafe -> +leite -> +chocolate) x uma classe por combinacao; LEGO.
- **Arco**: 1. Heranca para reuso explode em subclasses 2. compor com decorator (tem-um) 3. trocar comportamento em runtime 4. Lei de Demeter: nao atravesse 3 objetos (train wreck) 5. Tell Don't Ask
- **Pegadinha de entrevista**: Quando heranca quebra (Liskov); train wreck.

## Collections

### ☐ 🔴 Arrays e a hierarquia do framework `col-hierarquia`

- **Lição / módulo**: `col-hierarquia` · módulo 8+18
- **Conceito nuclear**: Array tem tamanho fixo; Collection cresce; Map guarda pares e nao e Collection.
- **Analogia central**: Estacionamento de vagas fixas (array) x sanfona que estica (List); prateleiras etiquetadas.
- **Arco**: 1. Array fixo com posicoes numeradas 2. precisa crescer: List/Set/Queue 3. Map guarda pares (fora de Collection) 4. programe para a interface 5. colecoes imutaveis (List.of)
- **Pegadinha de entrevista**: Array x ArrayList; Map nao e Collection.

### ☐ 🔴 List: ArrayList vs LinkedList `col-list`

- **Lição / módulo**: `col-list` · módulo 18
- **Conceito nuclear**: ArrayList e fileira numerada (acesso O(1)); LinkedList e corrente de vagoes (percorre O(n)).
- **Analogia central**: Cadeiras numeradas (pega a N direto) x trem de vagoes (anda vagao a vagao).
- **Arco**: 1. Pegar o item N: cadeira numerada x vagao a vagao 2. inserir no inicio empurra todos x so religa ponteiros 3. ArrayList e o padrao na pratica 4. remove(int) indice x remove(Object) valor 5. ConcurrentModificationException e removeIf
- **Pegadinha de entrevista**: remove(1) indice x valor; CME.

### ☐ 🔴 Set, Map e o papel do hashCode `col-set-map`

- **Lição / módulo**: `col-set-map` · módulo 18
- **Conceito nuclear**: O Set decide duplicata por hashCode (acha o balde) + equals (confirma); esquecer hashCode quebra tudo.
- **Analogia central**: Guarda-volumes: o hashCode e a gaveta, o equals e o cracha de identidade.
- **Arco**: 1. Set rejeita duplicata: como? 2. hashCode acha o balde, equals confirma 3. esquecer hashCode: o objeto some/duplica 4. escolher HashSet/LinkedHashSet/TreeSet 5. Map: getOrDefault, merge, computeIfAbsent
- **Pegadinha de entrevista**: Sobrescrever hashCode+equals juntos; o contrato.

### ☐ 🔴 Comparable e Comparator `col-ordenacao`

- **Lição / módulo**: `col-ordenacao` · módulo 18
- **Conceito nuclear**: Comparable e a regua embutida (ordem natural); Comparator e a regua externa combinavel.
- **Analogia central**: Fila por senha (ordem natural) x um juiz que organiza por nome e depois idade (varias reguas).
- **Arco**: 1. Ordenar: ordem natural com compareTo 2. Comparator externo: comparing().thenComparing() 3. reversed e nullsLast 4. nunca subtrair (overflow): use Integer.compare 5. consistencia com equals (TreeSet)
- **Pegadinha de entrevista**: Comparable x Comparator; thenComparing.

### ☐ 🔴 Enums com estado e comportamento `col-enums`

- **Lição / módulo**: `col-enums` · módulo 19
- **Conceito nuclear**: Enum e um conjunto fechado de instancias fixas, com atributos, metodos e comportamento por constante.
- **Analogia central**: Semaforo / naipes de baralho / estados de um pedido: um conjunto fechado e conhecido.
- **Arco**: 1. Status como String solta e fragil 2. enum com atributo e metodo 3. comportamento por constante (metodo abstrato) 4. EnumSet e EnumMap 5. nunca persistir ordinal
- **Pegadinha de entrevista**: Enum > constantes String; ordinal no banco.

## Exceções e Generics

### ☐ 🔴 Hierarquia, checked e unchecked `exc-hierarquia`

- **Lição / módulo**: `exc-hierarquia` · módulo 16
- **Conceito nuclear**: Error nao se captura; checked e condicao externa esperada; unchecked e bug de programacao.
- **Analogia central**: Alarme de incendio (Error, nao mexa) x aviso 'arquivo nao encontrado' (checked) x 'voce digitou errado' (unchecked).
- **Arco**: 1. A arvore Throwable 2. Error: falha grave da JVM, nao capture 3. checked: o mundo falhou, reaja 4. unchecked: quem chamou errou 5. como decidir qual lancar
- **Pegadinha de entrevista**: Checked x unchecked; nao capturar Throwable.

### ☐ 🔴 try-catch-finally e try-with-resources `exc-try`

- **Lição / módulo**: `exc-try` · módulo 16
- **Conceito nuclear**: Recurso AutoCloseable fecha sozinho no try-with-resources; encadeie preservando a causa.
- **Analogia central**: Luz que apaga sozinha ao sair do quarto (try-with-resources) x lembrar de apagar na mao e esquecer.
- **Arco**: 1. Fechar na mao vaza (esqueceu close, close lancou) 2. try-with-resources fecha em ordem inversa 3. multi-catch e ordem (especifico antes) 4. encadear preservando o stack trace 5. anti-patterns (catch vazio, return no finally)
- **Pegadinha de entrevista**: Por que try-with-resources; preservar a causa.

### ✅ 🔴 Generics: classes e métodos genéricos `generics`

- **Lição / módulo**: `gen-basico` · módulo 17
- **Conceito nuclear**: Generics coloca etiqueta na caixa: o erro de tipo sai do runtime e volta para a compilacao.
- **Analogia central**: Caixa sem etiqueta (List crua) que explode em runtime x caixa com etiqueta <String>.
- **Arco**: 1. Caixa sem etiqueta aceita tudo 2. ClassCastException so em runtime 3. a etiqueta (List<String>) 4. o T como molde 5. bounded <T extends Number>
- **Pegadinha de entrevista**: Erro em runtime x compilacao; sem cast na saida.

### ☐ 🔴 Wildcards, PECS e type erasure `gen-pecs`

- **Lição / módulo**: `gen-pecs` · módulo 17
- **Conceito nuclear**: extends = produtor (so leio); super = consumidor (so escrevo); o erasure apaga o tipo em runtime.
- **Analogia central**: Caixa 'so saida' (extends, voce tira) x caixa 'so entrada' (super, voce poe); a etiqueta some no envio (erasure).
- **Arco**: 1. List<Integer> nao e List<Number> (invariante) 2. ? extends T: produtor, so leio 3. ? super T: consumidor, so escrevo 4. PECS 5. type erasure: new T() nao compila
- **Pegadinha de entrevista**: PECS; consequencias do erasure.

## Programação Funcional

### ☐ 🔴 Lambdas e interfaces funcionais `fun-lambda`

- **Lição / módulo**: `fun-lambda` · módulo 25
- **Conceito nuclear**: Lambda passa comportamento como valor; interface funcional tem um unico metodo abstrato.
- **Analogia central**: Entregar a receita (funcao) em vez do prato pronto; controle remoto com um botao programavel.
- **Arco**: 1. Classe anonima verbosa vira lambda 2. as interfaces do JDK (Function/Predicate/Consumer/Supplier) 3. as 4 formas de method reference 4. compor com andThen/compose 5. captura de variavel efetivamente final
- **Pegadinha de entrevista**: Function x Predicate x Consumer x Supplier; efetivamente final.

### ☐ 🔴 Streams: o pipeline `fun-streams`

- **Lição / módulo**: `fun-streams` · módulo 27
- **Conceito nuclear**: Stream e uma linha de montagem: fonte -> intermediarias (lazy) -> terminal (dispara tudo).
- **Analogia central**: Esteira de fabrica com estacoes: nada anda ate a operacao terminal ligar a esteira.
- **Arco**: 1. Loop imperativo vira pipeline 2. intermediarias sao lazy: sem terminal nada roda 3. map (1->1) x flatMap (achata N->1) 4. Collectors: groupingBy, joining, toMap 5. stream de uso unico
- **Pegadinha de entrevista**: map x flatMap; sem terminal nao roda; uso unico.

### ☐ 🔴 Optional sem gambiarra `fun-optional`

- **Lição / módulo**: `fun-optional` · módulo 26
- **Conceito nuclear**: Optional e uma caixa que pode estar vazia, avisando no tipo que o valor pode faltar.
- **Analogia central**: Caixa de encomenda que pode chegar vazia, com aviso na etiqueta 'talvez nao tenha'.
- **Arco**: 1. null explode longe da causa 2. Optional no retorno torna a ausencia explicita 3. orElse (eager) x orElseGet (lazy) 4. map/flatMap encadeando sem if de null 5. anti-patterns (isPresent+get, Optional em campo/parametro)
- **Pegadinha de entrevista**: orElse x orElseGet; nao usar isPresent+get.

## Date-Time API

### ☐ 🟡 Qual classe usar em cada caso `dt-mapa`

- **Lição / módulo**: `dt-mapa` · módulo 23
- **Conceito nuclear**: java.time e imutavel; existe uma classe certa para cada pergunta (data, hora, fuso, instante).
- **Analogia central**: Caixa de ferramentas: a chave certa para cada parafuso; relogio x calendario x agenda.
- **Arco**: 1. API legada mutavel e bugada (mes comeca em 0) 2. java.time imutavel e thread-safe 3. mapa de decisao (LocalDate/Time/DateTime/Zoned/Instant) 4. Period (datas) x Duration (tempo) 5. Instant/UTC para persistir e trocar
- **Pegadinha de entrevista**: Period x Duration; imutabilidade.

### ☐ 🟡 LocalDate, LocalDateTime e operações `dt-operacoes`

- **Lição / módulo**: `dt-operacoes` · módulo 23
- **Conceito nuclear**: Tudo e imutavel: cada operacao devolve uma nova instancia, a original nunca muda.
- **Analogia central**: Maquina de etiquetas que imprime uma data nova (igual a placa de pedra da String), nao altera a antiga.
- **Arco**: 1. Criar (of/now/parse) 2. navegar (plus/minus/with) devolve nova instancia 3. reatribuir sempre: plusDays sozinho nao faz nada 4. consultar (getDayOfWeek, lengthOfMonth) 5. Period/Duration/ChronoUnit.between
- **Pegadinha de entrevista**: Imutabilidade (precisa reatribuir).

### ☐ 🟡 Formatação, fusos e interoperabilidade `dt-formatacao`

- **Lição / módulo**: `dt-formatacao` · módulo 22+23
- **Conceito nuclear**: DateTimeFormatter e o molde de impressao; fuso e o mesmo instante em relogios diferentes.
- **Analogia central**: Reuniao global: 14h em SP e 2h do dia seguinte em Toquio (mesmo instante, relogios diferentes).
- **Arco**: 1. Formatar e parse com ofPattern 2. padroes: MM (mes) x mm (minuto), HH x hh 3. ZonedDateTime withZoneSameInstant x SameLocal 4. Instant como ponto absoluto 5. ponte com Date/Calendar legado
- **Pegadinha de entrevista**: MM x mm, HH x hh; withZoneSameInstant.

## I/O, NIO2 e Serialização

### ☐ 🟡 Path e Files: a API moderna `io-path-files`

- **Lição / módulo**: `io-path-files` · módulo 29
- **Conceito nuclear**: Path e o endereco no papel (nao toca o disco); Files sao as acoes, que lancam excecao que explica.
- **Analogia central**: Endereco escrito no envelope (Path) x ir ate la e abrir a porta (Files); mapa x caminhada.
- **Arco**: 1. File antigo devolve boolean mudo 2. Path e so o endereco 3. Files age e explica o erro 4. ler pequeno (readString) x lazy (Files.lines) 5. percorrer com walk/walkFileTree
- **Pegadinha de entrevista**: Por que NIO2; readAllLines x lines (memoria).

### ☐ 🟡 Streams de I/O e buffers `io-streams-classicos`

- **Lição / módulo**: `io-streams-classicos` · módulo 28
- **Conceito nuclear**: Byte stream x char stream; o buffer le um bloco grande em vez de gota a gota.
- **Analogia central**: Encher o balde de uma vez (buffer) x carregar colher por colher (cada read e uma ida ao SO).
- **Arco**: 1. Bytes (binario) x Reader/Writer (texto) 2. sempre declare o charset 3. sem buffer: 1 syscall por byte 4. BufferedReader le em bloco 5. transferTo copia direto
- **Pegadinha de entrevista**: Por que buffer; charset (acento quebrado).

### ☐ 🟡 Serialização de objetos `io-serializacao`

- **Lição / módulo**: `io-serializacao` · módulo 30
- **Conceito nuclear**: Serializar congela o objeto em bytes; o serialVersionUID e a versao do contrato da classe.
- **Analogia central**: Congelar comida com etiqueta de validade (serialVersionUID); empacotar para a mudanca.
- **Arco**: 1. Serializable e um marcador 2. gravar/ler com ObjectStream 3. serialVersionUID: muda a estrutura, quebra a leitura 4. transient nao congela senha 5. cascata pelo grafo de objetos
- **Pegadinha de entrevista**: serialVersionUID; transient.

## JDBC e Repository

### ☐ 🟡 Conexão e PreparedStatement `jdbc-conexao`

- **Lição / módulo**: `jdbc-conexao` · módulo 33
- **Conceito nuclear**: PreparedStatement separa o formulario (SQL) dos dados; nunca concatene SQL.
- **Analogia central**: Formulario com lacunas (?) x escrever a frase inteira a mao (onde entra a injecao de SQL).
- **Arco**: 1. Statement concatenado: ' OR '1'='1 2. PreparedStatement parametriza e pre-compila 3. INSERT recuperando o id gerado 4. iterar ResultSet e mapear 5. BigDecimal para dinheiro, nunca double
- **Pegadinha de entrevista**: SQL injection; double x BigDecimal.

### ☐ 🟡 O padrão Repository `jdbc-repository`

- **Lição / módulo**: `jdbc-repository` · módulo 34
- **Conceito nuclear**: A interface de repositorio esconde o SQL; o servico de negocio nao sabe o que e banco.
- **Analogia central**: Balcao de atendimento (interface) que esconde o deposito (SQL); um tradutor entre negocio e banco.
- **Arco**: 1. Servico com JDBC no meio: acoplado e intestavel 2. interface Repository (o contrato) 3. implementacao JDBC 4. implementacao em memoria: testa sem banco 5. inversao de dependencia (o D do SOLID)
- **Pegadinha de entrevista**: Por que Repository; testar sem banco.

## Reflection e Anotações

### ☐ 🟡 Inspecionando classes em runtime `ref-basico`

- **Lição / módulo**: `ref-basico` · módulo 35
- **Conceito nuclear**: Reflection e o raio-X que le e mexe na classe em runtime; e a porta dos fundos dos frameworks.
- **Analogia central**: Raio-X / chave-mestra que abre ate o private; o mecanico que abre o motor para inspecionar.
- **Arco**: 1. Obter Class (3 formas) 2. inspecionar Field/Method/Constructor 3. setAccessible fura o private 4. invoke e newInstance 5. o preco: lento, sem tipo, fragil
- **Pegadinha de entrevista**: setAccessible; custo da reflection.

### ☐ 🟡 Anotações customizadas `ref-anotacoes`

- **Lição / módulo**: `ref-anotacoes` · módulo 35
- **Conceito nuclear**: Anotacao e metadado que o codigo le em runtime; so funciona por reflection se for @Retention(RUNTIME).
- **Analogia central**: Post-it/etiqueta na classe que uma maquina le depois; so vale se for de tinta permanente (RUNTIME).
- **Arco**: 1. Criar a anotacao 2. @Target: onde aplicar 3. @Retention: SOURCE/CLASS/RUNTIME (o mais cobrado) 4. ler via reflection (isAnnotationPresent) 5. caso real: gerador de CSV (como @Column/@JsonProperty)
- **Pegadinha de entrevista**: @Retention RUNTIME; senao a leitura falha.

## Boas Práticas e Patterns

### ☐ 🔴 Princípios de código limpo `bp-codigo-limpo`

- **Lição / módulo**: `bp-codigo-limpo` · módulo 6
- **Conceito nuclear**: Nomes que dispensam comentario, metodos focados, fail-fast e nunca retornar null em colecao.
- **Analogia central**: Cozinha organizada (mise en place); guard clause = o porteiro que barra logo na entrada.
- **Arco**: 1. Nomes ruins x nomes que explicam 2. metodo gigante x metodo focado 3. if aninhado x guard clause fail-fast 4. retornar lista vazia, nunca null 5. comentar o porque, nao o que
- **Pegadinha de entrevista**: Fail-fast; colecao vazia x null.

### ☐ 🔴 Strategy, Factory, Decorator e Builder `bp-patterns`

- **Lição / módulo**: `bp-patterns` · módulo 15
- **Conceito nuclear**: Quatro padroes classicos resolvem quatro dores: algoritmo trocavel, criacao, comportamento empilhado e construcao complexa.
- **Analogia central**: Caixa de ferramentas: Strategy troca a broca; Decorator e o cafe com adicionais; Builder monta o pedido passo a passo.
- **Arco**: 1. if gigante de algoritmo vira Strategy 2. new espalhado vira Factory 3. empilhar comportamento vira Decorator 4. construtor telescopico vira Builder 5. Strategy e Factory juntos
- **Pegadinha de entrevista**: Reconhecer cada padrao; Strategy+Factory.

### ☐ 🔴 Logging com SLF4J e Logback `bp-logging`

- **Lição / módulo**: `bp-logging` · módulo 32
- **Conceito nuclear**: SLF4J e a fachada; o placeholder evita concatenar quando o nivel esta desligado; os niveis sao hierarquicos.
- **Analogia central**: Caixa-preta do aviao com niveis de urgencia; o diario que so registra o que importa em cada nivel.
- **Arco**: 1. System.out nao tem nivel e some 2. SLF4J logger por classe 3. placeholder {} nao concatena se desligado 4. niveis ERROR..TRACE 5. nunca logar senha/cartao
- **Pegadinha de entrevista**: Placeholder {}; nivel correto.

### ☐ 🔴 Maven: estrutura, ciclo e escopos `bp-maven`

- **Lição / módulo**: `bp-maven` · módulo 31
- **Conceito nuclear**: Convencao sobre configuracao; coordenadas GAV; fases sequenciais; escopos de dependencia.
- **Analogia central**: Receita padronizada / linha de montagem com etapas na ordem certa; o endereco GAV do artefato.
- **Arco**: 1. Estrutura padrao (src/main, src/test) 2. pom.xml e as coordenadas GAV 3. ciclo: compile -> test -> package -> install 4. escopos: compile/provided/runtime/test 5. mvn clean install
- **Pegadinha de entrevista**: Escopo errado (driver em test); fases sequenciais.

