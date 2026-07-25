# Sprint de Revisão · 14 dias para a entrevista

> Contexto: você fez o curso há 3+ anos. Não está aprendendo do zero, está
> **reativando** conhecimento adormecido.
> Configuração deste sprint: **~2 semanas · 30 min/dia · só com o material que já existe**.

## A jogada central

Para cada item ☐ da checklist, faça isto:

1. **Explique em voz alta**, como se fosse ao entrevistador.
2. **Escreva o trecho de código de memória.**
3. Só então abra a teoria, e **só nos itens que você travou**.

Isso é *active recall* mais ensaio da performance real da entrevista. Em 30
min/dia, é o movimento de maior retorno que existe. Reler dá ilusão de saber;
recuperar da memória é o que fixa.

**Meta do sprint** (seja realista): não é dominar tudo. É (1) reativar os ~70%
adormecidos e (2) ficar fluente de fala nos temas de alta frequência.
Profundidade em Reflection ou `walkFileTree` rende pouco numa entrevista;
fluência em OOP, Collections e Streams rende muito.

## Template de cada sessão de 30 minutos

| Min | O quê |
|-----|-------|
| 0–3 | Limpar a fila "Revisar hoje" na trilha (a repetição espaçada cresce sozinha) |
| 3–22 | Unidade do dia: percorrer a checklist fazendo recall (falar + escrever de memória). Abrir teoria **só nos ☐ que falharam** |
| 22–30 | 5–8 cards do `ANKI-CARDS-JAVA.md` daquela seção; anotar o que travou para re-enfileirar |

## Material que este sprint usa

- **Trilha**: https://moises-paschoalick.github.io/java-game/ (aulas guiadas, exercícios, revisão espaçada)
- **Teoria**: `docs/page_01.md` a `docs/page_10.md`
- **Cards**: `ANKI-CARDS-JAVA.md` (~65 cards por seção)
- **Aulas guiadas prontas**: Primitivos, Wrappers, Strings (Fundamentos)
- **Exercícios prontos**: as 5 lições de Fundamentos
- **Este documento** como diagnóstico e registro (as caixas abaixo)

---

## Calendário

Ordem por peso de entrevista: 🔴 alta primeiro, depois 🟡 média, 🟢 base por último.

| Dia | Unidade | Foco | Feito |
|-----|---------|------|:----:|
| 1 | 🔴 **OOP Completo** | `equals`/`hashCode`, interface × abstrata, composição, Lei de Demeter | ☐ |
| 2 | 🔴 **Collections** | `ArrayList`×`LinkedList`, `ConcurrentModificationException`, `Comparator` | ☐ |
| 3 | 🔴 **Exceções + Generics** | O mais difícil: PECS e Type Erasure. Não pule | ☐ |
| 4 | 🔴 **Programação Funcional** | Maior bloco: `map`×`flatMap`, Collectors, `orElse`×`orElseGet` | ☐ |
| 5 | 🔴 **Boas Práticas + Patterns** | Strategy/Factory/Decorator/Builder, favoritos de entrevista | ☐ |
| 6 | ♻️ **Revisão** | Refazer só os ☐ que errou nos dias 1–5 (intercalar). Zero conteúdo novo | ☐ |
| 7 | 🟡 **JDBC + Repository** | `PreparedStatement`, interface de repositório | ☐ |
| 8 | 🟡 **Date-Time + I/O** | Mais leves, dá pra parear. `Period`×`Duration`, NIO2 | ☐ |
| 9 | 🟡 **Reflection** + 🟢 **Fundamentos** | Reflection rápido; Fundamentos via as 3 aulas guiadas | ☐ |
| 10 | ♻️ **Revisão geral** | Varredura das checklists 🔴 + a fila "Revisar hoje" já está rica | ☐ |
| 11 | 🎯 Buffer | Só itens que ainda falham; simular entrevista em voz alta | ☐ |
| 12 | 🎯 Buffer | Reabrir aula guiada do que estiver trêmulo | ☐ |
| 13 | 🎯 Buffer | Rodada final das pegadinhas de alta frequência (abaixo) | ☐ |
| 14 | 🎯 Buffer | Descanso ativo: só a fila de revisão + leitura leve. Não empanturre na véspera | ☐ |

**Entrevista em 1 semana?** Faça os dias 1–5 mais um dia de revisão e pare. As
🔴 cobrem a maioria das perguntas.

---

## Pegadinhas de alta frequência (garanta essas)

São as que mais caem, e o seu próprio material já as isola:

- [ ] `Integer a=127,b=127 → ==` **true**; `128 → ==` **false** (cache −128..127)
- [ ] `String` com `new` fica fora do pool → compare com `equals`, nunca `==`
- [ ] `orElse` é **eager**; `orElseGet` é **lazy** (só executa se vazio)
- [ ] **PECS**: Producer `extends`, Consumer `super`
- [ ] `map` (1→1) × `flatMap` (achata N→1)
- [ ] Checked × Unchecked, e por que preservar a causa no encadeamento
- [ ] `ConcurrentModificationException` e as 3 saídas (`removeIf`, `Iterator`, cópia)
- [ ] `StringBuilder` em loop (o `+` é O(n²))
- [ ] Contrato `equals` + `hashCode` (iguais por equals → mesmo hashCode)

Você já tem aula guiada para o cache de Integer e o pool de String (Wrappers e
Strings). As demais estão na teoria e nos cards.

---

## Checklist de diagnóstico

Marque cada item conforme conseguir fazê-lo **sem consultar** (falar + escrever de
memória). Um item só está "feito" quando você reproduz do zero.

### 🔴 Dia 1 · OOP Completo → [teoria](page_01.md)

- [ ] Explico os 4 pilares com exemplos de código sem consultar
- [ ] Sei quando usar `interface` vs classe abstrata
- [ ] Sobrescrevo `equals()` + `hashCode()` corretamente com `Objects.hash()`
- [ ] Crio e uso `Record` com construtor compacto e validação
- [ ] Demonstro composição no lugar de herança com Decorator
- [ ] Aplico a Lei de Demeter eliminando train wrecks

### 🔴 Dia 2 · Collections → [teoria](page_02.md)

- [ ] Escolho ArrayList, LinkedList, HashSet, TreeSet, HashMap, TreeMap pela situação
- [ ] Sei por que `hashCode()` + `equals()` são obrigatórios para Set/Map
- [ ] Removo elementos de uma List durante iteração sem `ConcurrentModificationException`
- [ ] Implemento `Comparable` e `Comparator` com múltiplos critérios de ordenação
- [ ] Uso `computeIfAbsent` e `merge` no Map
- [ ] Crio Enum com atributos, métodos e uso em switch moderno

### 🔴 Dia 3 · Exceções e Generics → [teoria](page_03.md)

- [ ] Distingo Checked de Unchecked e sei criar cada uma
- [ ] Uso `try-with-resources` para fechar qualquer `AutoCloseable`
- [ ] Encadeio exceções preservando o stack trace original
- [ ] Escrevo classe genérica com bounded type parameter (`<T extends X>`)
- [ ] Explico Type Erasure e suas consequências
- [ ] Aplico PECS: `extends` para leitura, `super` para escrita

### 🔴 Dia 4 · Programação Funcional → [teoria](page_04.md)

- [ ] Conheço `Function`, `Predicate`, `Consumer`, `Supplier`, `UnaryOperator`
- [ ] Uso as 4 formas de method reference
- [ ] Monto pipeline com `filter`, `map`, `flatMap`, `sorted`, `distinct`
- [ ] Sei a diferença entre `map` e `flatMap`
- [ ] Uso `groupingBy`, `joining`, `toMap` nos Collectors
- [ ] Uso `reduce` com identidade e sem identidade (Optional)
- [ ] Uso Optional sem `isPresent()` + `get()`, apenas `orElse`, `orElseGet`, `orElseThrow`
- [ ] Sei a diferença entre `orElse` (eager) e `orElseGet` (lazy)

### 🔴 Dia 5 · Boas Práticas e Patterns → [teoria](page_10.md)

- [ ] Aplico Fail-Fast: valido no início, lanço exceção cedo e com mensagem clara
- [ ] Aplico Lei de Demeter: elimino train wrecks
- [ ] Retorno coleções vazias em vez de `null`
- [ ] Implemento Strategy: algoritmo em interface, contexto usa a interface
- [ ] Implemento Factory: encapsula criação e desacopla o cliente
- [ ] Implemento Decorator: adiciona comportamento por composição
- [ ] Implemento Builder: objeto complexo com construção fluente
- [ ] Uso `{}` em vez de concatenação no SLF4J
- [ ] Escolho o nível de log correto: DEBUG, INFO, WARN, ERROR
- [ ] Estruturo um projeto Maven com `pom.xml` e escopos de dependência

### 🟡 Dia 7 · JDBC e Padrão Repository → [teoria](page_05.md)

- [ ] Conecto ao banco com `DriverManager` e `try-with-resources`
- [ ] Uso `PreparedStatement` sempre, nunca `Statement` com concatenação
- [ ] Faço INSERT recuperando o ID gerado pelo banco
- [ ] Itero `ResultSet` e mapeio para objetos de domínio
- [ ] Defino interface de repositório e implemento em MySQL e em memória
- [ ] O serviço de negócio só conhece a interface, zero código JDBC nele

### 🟡 Dia 8a · Date-Time API → [teoria](page_07.md)

- [ ] Escolho a classe certa: `LocalDate`, `LocalTime`, `LocalDateTime`, `ZonedDateTime`, `Instant`
- [ ] Sei a diferença entre `Period` (datas) e `Duration` (tempo)
- [ ] Formato e parseio com `DateTimeFormatter.ofPattern()`
- [ ] Faço operações: `plus`, `minus`, `with`, `between`
- [ ] Converto entre fusos com `withZoneSameInstant`
- [ ] Converto APIs legadas (`Date`, `Calendar`) para `java.time`

### 🟡 Dia 8b · I/O, NIO2 e Serialização → [teoria](page_08.md)

- [ ] Prefiro NIO2 (`Path`, `Files`) à API legada (`File`)
- [ ] Uso `Files.createDirectories()` para criar hierarquias sem erro
- [ ] Leio arquivos com `readString()` e itero linhas com `Files.lines()` (lazy)
- [ ] Percorro diretórios com `Files.walk()` ou `walkFileTree()`
- [ ] Declaro `serialVersionUID` em toda classe `Serializable`
- [ ] Uso `transient` em campos sensíveis ou não-serializáveis
- [ ] Fecho streams com `try-with-resources`

### 🟡 Dia 9a · Reflection e Anotações → [teoria](page_09.md)

- [ ] Obtenho o objeto `Class` pelas 3 formas
- [ ] Leio e escrevo campos `private` com `setAccessible(true)`
- [ ] Invoco métodos via `Method.invoke()`
- [ ] Crio anotação customizada com `@Target` e `@Retention(RUNTIME)`
- [ ] Leio anotações em runtime com `isAnnotationPresent()` + `getAnnotation()`
- [ ] Explico a diferença entre `SOURCE`, `CLASS` e `RUNTIME`
- [ ] Sei para que serve `sealed class` e `non-sealed`

### 🟢 Dia 9b · Fundamentos → [teoria](page_06.md) · aulas guiadas: Primitivos, Wrappers, Strings

- [ ] Sei os 8 primitivos, tamanhos e valores padrão
- [ ] Entendo promoção aritmética e sei quando e por que fazer cast
- [ ] Conheço a armadilha do cache de Integer com `==` (range -128 a 127)
- [ ] Uso `StringBuilder` em loops, nunca concatenação com `+`
- [ ] Domino o switch moderno com `->` e `yield`
- [ ] Explico Stack vs Heap e o papel do Garbage Collector

---

## Regras de ouro do sprint

1. **Recuperação antes de releitura.** Sempre tente de memória primeiro.
2. **Intercale.** No dia de revisão, misture unidades; não estude o mesmo tema em blocos longos.
3. **Prioridade manda.** Se o tempo apertar, sacrifique 🟢 e 🟡, nunca as 🔴.
4. **Fale em voz alta.** A entrevista é oral; ensaie oral.
5. **Mantenha a ofensiva.** 30 min todo dia bate 3h num dia só.
6. **Na véspera, não empanturre.** Dia 14 é fila de revisão e sono, não conteúdo novo.
