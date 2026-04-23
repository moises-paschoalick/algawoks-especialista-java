# Especialista Java — Hub de Estudos

> Curso AlgaWorks · 35 módulos · Foco em entrevista técnica
> Branch: `revisao-java`

---

## Início Rápido

| | |
|---|---|
| Nunca estudou por aqui? | **[→ Começar pelo Dia 1: OOP Completo](docs/page_01.md)** |
| Quer revisar um tema? | Use o [Índice de Tópicos](#índice-de-tópicos) abaixo |
| Quer treinar perguntas? | **[→ Cards de Entrevista (Anki)](ANKI-CARDS-JAVA.md)** |
| Quer ver tudo de uma vez? | **[→ Plano de Estudo Completo](PLANO-ESTUDO-ENTREVISTA-JAVA.md)** |

---

## Roadmap

```
[Dia 1–2] ──► OOP Completo ─────────────── page_01
              Herança · Polimorfismo · Interfaces · Records

[Dia 3–4] ──► Collections ──────────────── page_02
              List · Set · Map · Iterator · Enums

[Dia 5–6] ──► Exceções + Generics ──────── page_03
              Checked/Unchecked · try-with-resources · PECS

[Dia 7–8] ──► Programação Funcional ─────── page_04
              Lambda · Streams · Optional

[Dia 9]   ──► JDBC + Repository ─────────── page_05
              SQL · PreparedStatement · Repository Pattern

[Revisão] ──► Tópicos de Apoio ─────────── page_06 ao page_10
              Fundamentos · Date-Time · I/O · Reflection · Boas Práticas
```

---

## Índice de Tópicos

### Prioridade 🔴 Alta — estude primeiro

| Concluído | Página | Tema | Módulos |
|:---------:|--------|------|---------|
| ☐ | [page_01 — OOP Completo](docs/page_01.md) | Encapsulamento, Herança, Polimorfismo, Abstração, Interfaces, Records, Composição | 5, 10, 11, 12, 13, 14, 15 |
| ☐ | [page_02 — Collections](docs/page_02.md) | List, Set, Map, Iterator, Ordenação, Enums | 8, 18, 19 |
| ☐ | [page_03 — Exceções e Generics](docs/page_03.md) | Checked/Unchecked, try-with-resources, Wildcards, PECS, Type Erasure | 16, 17 |
| ☐ | [page_04 — Programação Funcional](docs/page_04.md) | Lambda, Method Reference, Streams, Optional, Collectors | 25, 26, 27 |
| ☐ | [page_10 — Boas Práticas e Patterns](docs/page_10.md) | Fail-Fast, Lei de Demeter, Strategy, Factory, Decorator, Builder, Maven, SLF4J | 6, 15, 31, 32 |

### Prioridade 🟡 Média — estude depois

| Concluído | Página | Tema | Módulos |
|:---------:|--------|------|---------|
| ☐ | [page_05 — JDBC e Repository](docs/page_05.md) | PreparedStatement, ResultSet, Padrão Repository, Injeção de Dependência | 33, 34 |
| ☐ | [page_07 — Date-Time API](docs/page_07.md) | LocalDate, LocalDateTime, Period, Duration, ZonedDateTime, DateTimeFormatter | 22, 23 |
| ☐ | [page_08 — I/O, NIO2 e Serialização](docs/page_08.md) | Path, Files, walkFileTree, Serializable, serialVersionUID, transient | 28, 29, 30 |
| ☐ | [page_09 — Reflection e Anotações](docs/page_09.md) | Class, Field, Method, @Target, @Retention, anotações customizadas, sealed class | 35 |

### Prioridade 🟢 Base — revise quando necessário

| Concluído | Página | Tema | Módulos |
|:---------:|--------|------|---------|
| ☐ | [page_06 — Fundamentos](docs/page_06.md) | Primitivos, Wrappers, Boxing, Strings, StringBuilder, Switch moderno, Stack vs Heap | 2, 3, 7, 9 |

---

## Checkpoints por Tema

> Marque cada item conforme for estudando. Um tema está **concluído** quando consegue reproduzir o código do zero, sem consultar.

### ☐ OOP Completo → [abrir](docs/page_01.md)

- [ ] Explico os 4 pilares com exemplos de código sem consultar
- [ ] Sei quando usar `interface` vs classe abstrata
- [ ] Sobrescrevo `equals()` + `hashCode()` corretamente com `Objects.hash()`
- [ ] Crio e uso `Record` com construtor compacto e validação
- [ ] Demonstro composição no lugar de herança com Decorator
- [ ] Aplico a Lei de Demeter eliminando train wrecks

### ☐ Collections → [abrir](docs/page_02.md)

- [ ] Escolho ArrayList, LinkedList, HashSet, TreeSet, HashMap, TreeMap pela situação
- [ ] Sei por que `hashCode()` + `equals()` são obrigatórios para Set/Map
- [ ] Removo elementos de uma List durante iteração sem `ConcurrentModificationException`
- [ ] Implemento `Comparable` e `Comparator` com múltiplos critérios de ordenação
- [ ] Uso `computeIfAbsent` e `merge` no Map
- [ ] Crio Enum com atributos, métodos e uso em switch moderno

### ☐ Exceções e Generics → [abrir](docs/page_03.md)

- [ ] Distingo Checked de Unchecked e sei criar cada uma
- [ ] Uso `try-with-resources` para fechar qualquer `AutoCloseable`
- [ ] Encadeio exceções preservando o stack trace original
- [ ] Escrevo classe genérica com bounded type parameter (`<T extends X>`)
- [ ] Explico Type Erasure e suas consequências
- [ ] Aplico PECS: `extends` para leitura, `super` para escrita

### ☐ Programação Funcional → [abrir](docs/page_04.md)

- [ ] Conheço `Function`, `Predicate`, `Consumer`, `Supplier`, `UnaryOperator`
- [ ] Uso as 4 formas de method reference
- [ ] Monto pipeline com `filter`, `map`, `flatMap`, `sorted`, `distinct`
- [ ] Sei a diferença entre `map` e `flatMap`
- [ ] Uso `groupingBy`, `joining`, `toMap` nos Collectors
- [ ] Uso `reduce` com identidade e sem identidade (Optional)
- [ ] Uso Optional sem `isPresent()` + `get()` — apenas `orElse`, `orElseGet`, `orElseThrow`
- [ ] Sei a diferença entre `orElse` (eager) e `orElseGet` (lazy)

### ☐ JDBC e Padrão Repository → [abrir](docs/page_05.md)

- [ ] Conecto ao banco com `DriverManager` e `try-with-resources`
- [ ] Uso `PreparedStatement` sempre — nunca `Statement` com concatenação
- [ ] Faço INSERT recuperando o ID gerado pelo banco
- [ ] Itero `ResultSet` e mapeio para objetos de domínio
- [ ] Defino interface de repositório e implemento em MySQL e em memória
- [ ] O serviço de negócio só conhece a interface — zero código JDBC nele

### ☐ Fundamentos → [abrir](docs/page_06.md)

- [ ] Sei os 8 primitivos, tamanhos e valores padrão
- [ ] Entendo promoção aritmética — sei quando e por que fazer cast
- [ ] Conheço a armadilha do cache de Integer com `==` (range -128 a 127)
- [ ] Uso `StringBuilder` em loops — nunca concatenação com `+`
- [ ] Domino o switch moderno com `->` e `yield`
- [ ] Explico Stack vs Heap e o papel do Garbage Collector

### ☐ Date-Time API → [abrir](docs/page_07.md)

- [ ] Escolho a classe certa: `LocalDate`, `LocalTime`, `LocalDateTime`, `ZonedDateTime`, `Instant`
- [ ] Sei a diferença entre `Period` (datas) e `Duration` (tempo)
- [ ] Formato e parseo com `DateTimeFormatter.ofPattern()`
- [ ] Faço operações: `plus`, `minus`, `with`, `between`
- [ ] Converto entre fusos com `withZoneSameInstant`
- [ ] Converto APIs legadas (`Date`, `Calendar`) para `java.time`

### ☐ I/O, NIO2 e Serialização → [abrir](docs/page_08.md)

- [ ] Prefiro NIO2 (`Path`, `Files`) à API legada (`File`)
- [ ] Uso `Files.createDirectories()` para criar hierarquias sem erro
- [ ] Leio arquivos com `readString()` e itero linhas com `Files.lines()` (lazy)
- [ ] Percorro diretórios com `Files.walk()` ou `walkFileTree()`
- [ ] Declaro `serialVersionUID` em toda classe `Serializable`
- [ ] Uso `transient` em campos sensíveis ou não-serializáveis
- [ ] Fecho streams com `try-with-resources`

### ☐ Reflection e Anotações → [abrir](docs/page_09.md)

- [ ] Obtenho o objeto `Class` pelas 3 formas
- [ ] Leio e escrevo campos `private` com `setAccessible(true)`
- [ ] Invoco métodos via `Method.invoke()`
- [ ] Crio anotação customizada com `@Target` e `@Retention(RUNTIME)`
- [ ] Leio anotações em runtime com `isAnnotationPresent()` + `getAnnotation()`
- [ ] Explico a diferença entre `SOURCE`, `CLASS` e `RUNTIME`
- [ ] Sei para que serve `sealed class` e `non-sealed`

### ☐ Boas Práticas e Patterns → [abrir](docs/page_10.md)

- [ ] Aplico Fail-Fast: valido no início, lanço exceção cedo e com mensagem clara
- [ ] Aplico Lei de Demeter: elimino train wrecks
- [ ] Retorno coleções vazias em vez de `null`
- [ ] Implento Strategy: algoritmo em interface, contexto usa a interface
- [ ] Implento Factory: encapsula criação e desacopla o cliente
- [ ] Implento Decorator: adiciona comportamento por composição
- [ ] Implento Builder: objeto complexo com construção fluente
- [ ] Uso `{}` em vez de concatenação no SLF4J
- [ ] Escolho o nível de log correto: DEBUG, INFO, WARN, ERROR
- [ ] Estruturo um projeto Maven com `pom.xml` e escopos de dependência

---

## Material de Apoio

| Material | Descrição |
|----------|-----------|
| [Plano de Estudo Completo](PLANO-ESTUDO-ENTREVISTA-JAVA.md) | Todos os conceitos explicados com tabelas e exemplos de código |
| [Cards Anki — Perguntas e Respostas](ANKI-CARDS-JAVA.md) | ~65 cards separados por seção para revisão espaçada |
| [docs/](docs/) | 10 páginas de tutorial passo a passo |

---

## Referência Rápida — Qual página estudar por conceito

| Se você precisa revisar... | Vá para |
|----------------------------|---------|
| `equals()`, `hashCode()`, `@Override` | [page_01](docs/page_01.md#12-herança) |
| `ArrayList` vs `LinkedList` vs `HashMap` | [page_02](docs/page_02.md#21-arraylist-vs-linkedlist) |
| `ConcurrentModificationException` | [page_02](docs/page_02.md#5-iteração-segura-e-remoção) |
| `Comparable` vs `Comparator` | [page_02](docs/page_02.md#6-ordenação) |
| Checked vs Unchecked exception | [page_03](docs/page_03.md#2-checked-vs-unchecked) |
| `try-with-resources` | [page_03](docs/page_03.md#32-try-with-resources-preferido) |
| PECS (`extends` / `super`) | [page_03](docs/page_03.md#62-extends-t--covariância-producer-extends) |
| Interfaces funcionais | [page_04](docs/page_04.md#12-interfaces-funcionais-do-jdk--as-mais-usadas) |
| `map` vs `flatMap` | [page_04](docs/page_04.md#32-operações-intermediárias) |
| `groupingBy`, `joining`, `toMap` | [page_04](docs/page_04.md#35-collect--coletando-resultados) |
| `orElse` vs `orElseGet` | [page_04](docs/page_04.md#42-consumo--do-mais-ao-menos-seguro) |
| SQL Injection / PreparedStatement | [page_05](docs/page_05.md#13-por-que-usar-preparedstatement--nunca-statement) |
| Padrão Repository | [page_05](docs/page_05.md#2-padrão-repository) |
| `Integer` cache / autoboxing | [page_06](docs/page_06.md#32-cache-de-integer-armadilha-no-) |
| `Period` vs `Duration` | [page_07](docs/page_07.md#5-period--diferença-de-datas) |
| `serialVersionUID` / `transient` | [page_08](docs/page_08.md#61-tornando-uma-classe-serializável) |
| Anotações customizadas | [page_09](docs/page_09.md#6-anotações-customizadas) |
| `@Retention` SOURCE / CLASS / RUNTIME | [page_09](docs/page_09.md#63-retention--por-quanto-tempo-fica-disponível) |
| Strategy, Factory, Decorator, Builder | [page_10](docs/page_10.md#2-design-patterns) |
| SLF4J / Logback | [page_10](docs/page_10.md#3-logging-com-slf4j-e-logback) |

---

## Recursos

- [Curso Especialista Java — AlgaWorks](https://lp.algaworks.com/ej-lista-de-espera/)
