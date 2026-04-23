# Date-Time API

> Módulos do curso: 22, 23
> Prioridade: 🟡 Média

**Navegação:** [← Fundamentos](page_06.md) | [→ Próximo: I/O, NIO2 e Serialização](page_08.md)

---

## O que você vai dominar

- Por que a API legada (`Date`, `Calendar`) foi substituída
- Qual classe usar em cada situação
- Operações com datas: criar, somar, subtrair, comparar
- `Period` vs `Duration`
- Formatação e parse com `DateTimeFormatter`
- Fusos horários com `ZonedDateTime`

---

## 1. Por que a nova API?

### 1.1 Problemas da API legada

```java
// java.util.Date — confuso e mutável
Date data = new Date(); // representa um instante, não uma "data"
data.setYear(124);      // ano relativo a 1900! (2024 = 124)
data.getMonth();        // retorna 0 para Janeiro (base-0 para meses)

// Calendar — verboso e ainda mutável
Calendar cal = Calendar.getInstance();
cal.set(2024, Calendar.JANUARY, 15); // mês base-0, constante para não errar
Date dataResultado = cal.getTime();  // conversão necessária

// SimpleDateFormat — não é thread-safe!
SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
// usar o mesmo sdf em múltiplas threads → corrompimento de dados
```

### 1.2 Solução: java.time (Java 8+)

- **Imutável**: toda operação retorna um novo objeto
- **Thread-safe** por design
- **Nomes claros**: meses base-1 (Janeiro = 1)
- **Separação de responsabilidades**: uma classe para cada conceito

---

## 2. Mapa de Classes — qual usar em cada situação

| Situação                              | Classe           | Exemplo                          |
|---------------------------------------|------------------|----------------------------------|
| Apenas data (sem hora, sem fuso)      | `LocalDate`      | data de nascimento, prazo        |
| Apenas hora (sem data, sem fuso)      | `LocalTime`      | horário de abertura              |
| Data e hora (sem fuso)                | `LocalDateTime`  | timestamp local                  |
| Data e hora com fuso                  | `ZonedDateTime`  | agendamento global               |
| Timestamp UTC (máquina)               | `Instant`        | log, auditoria                   |
| Diferença em anos/meses/dias          | `Period`         | idade, prazo em dias             |
| Diferença em horas/minutos/segundos   | `Duration`       | tempo de execução, turno         |
| Formatação e parse                    | `DateTimeFormatter` | exibição, input de usuário   |
| Fuso horário                          | `ZoneId`         | `ZoneId.of("America/Sao_Paulo")` |

---

## 3. LocalDate

```java
// Criação
LocalDate hoje     = LocalDate.now();
LocalDate natal    = LocalDate.of(2024, Month.DECEMBER, 25);
LocalDate parseada = LocalDate.parse("2024-12-25");             // ISO 8601

// Operações — todas retornam novo objeto (imutável)
LocalDate amanha     = hoje.plusDays(1);
LocalDate semPassada = hoje.minusWeeks(1);
LocalDate anoQueVem  = hoje.plusYears(1);
LocalDate primeiroDia = hoje.withDayOfMonth(1);   // primeiro dia do mês
LocalDate ultimoDia   = hoje.withDayOfMonth(hoje.lengthOfMonth());

// Consultas
int    dia     = hoje.getDayOfMonth();
Month  mes     = hoje.getMonth();           // DECEMBER
int    numMes  = hoje.getMonthValue();      // 12
int    ano     = hoje.getYear();
DayOfWeek dow  = hoje.getDayOfWeek();       // WEDNESDAY
boolean bissexto = hoje.isLeapYear();
int diasNoMes    = hoje.lengthOfMonth();    // 31

// Comparações
hoje.isBefore(natal);    // true
hoje.isAfter(natal);     // false
hoje.isEqual(natal);     // false
hoje.compareTo(natal);   // negativo (hoje < natal)
```

---

## 4. LocalTime e LocalDateTime

```java
// LocalTime
LocalTime agora    = LocalTime.now();
LocalTime abertura = LocalTime.of(9, 0, 0);     // 09:00:00
LocalTime fechamento = LocalTime.of(18, 30);    // 18:30:00

LocalTime maisUmaHora = abertura.plusHours(1);  // 10:00:00
boolean estaAberto = agora.isAfter(abertura) && agora.isBefore(fechamento);

// LocalDateTime
LocalDateTime agendamento = LocalDateTime.of(2024, 12, 25, 14, 30);
LocalDateTime agendamento2 = LocalDate.of(2024, 12, 25).atTime(14, 30);

// Conversões
LocalDate soParte = agendamento.toLocalDate();
LocalTime soHora  = agendamento.toLocalTime();

LocalDateTime comHora = LocalDate.now().atStartOfDay();   // meia-noite
LocalDateTime max     = LocalDate.now().atTime(LocalTime.MAX); // fim do dia
```

---

## 5. Period — diferença de datas

```java
// Diferença entre duas datas em anos, meses e dias
LocalDate nascimento = LocalDate.of(1990, 6, 15);
LocalDate hoje       = LocalDate.now();
Period idade = Period.between(nascimento, hoje);

System.out.println(idade.getYears());  // ex: 34
System.out.println(idade.getMonths()); // meses restantes (0–11)
System.out.println(idade.getDays());   // dias restantes (0–30)

// Criar period direto
Period tresMeses = Period.ofMonths(3);
Period umAnoEMeio = Period.of(1, 6, 0); // 1 ano, 6 meses, 0 dias
Period parseado   = Period.parse("P2Y5M10D"); // ISO 8601

// Aplicar period a uma data
LocalDate prazo = LocalDate.now().plus(Period.ofMonths(6));

// Verificar
periodo.isNegative();
periodo.isZero();
Period normalizado = Period.of(0, 15, 0).normalized(); // P1Y3M
```

---

## 6. Duration — diferença de tempo

```java
// Diferença entre dois instantes de tempo
LocalTime inicio = LocalTime.of(9, 0);
LocalTime fim    = LocalTime.of(18, 30);
Duration turno   = Duration.between(inicio, fim);

System.out.println(turno.toHours());   // 9
System.out.println(turno.toMinutes()); // 570
System.out.println(turno.toSeconds()); // 34200

// Criar duration
Duration umDia       = Duration.ofDays(1);
Duration duasHoras   = Duration.ofHours(2);
Duration trintaMin   = Duration.ofMinutes(30);
Duration parseada    = Duration.parse("PT9H30M"); // ISO 8601

// Usar com Instant
Instant inicio2 = Instant.now();
// ... operação ...
Instant fim2    = Instant.now();
Duration tempo  = Duration.between(inicio2, fim2);
System.out.println("Operação durou: " + tempo.toMillis() + "ms");
```

---

## 7. Formatação e Parse

### 7.1 Formatos predefinidos

```java
LocalDateTime agora = LocalDateTime.now();

agora.format(DateTimeFormatter.ISO_LOCAL_DATE);       // 2024-12-25
agora.format(DateTimeFormatter.ISO_LOCAL_TIME);       // 14:30:00
agora.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);  // 2024-12-25T14:30:00
```

### 7.2 Padrões customizados

```java
DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
DateTimeFormatter fmtHora = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
DateTimeFormatter ptBR = DateTimeFormatter.ofPattern("dd 'de' MMMM 'de' yyyy",
    new Locale("pt", "BR")); // "25 de dezembro de 2024"

// Formatação
String texto = LocalDate.of(2024, 12, 25).format(fmt);  // "25/12/2024"

// Parse
LocalDate data   = LocalDate.parse("25/12/2024", fmt);
LocalDateTime dt = LocalDateTime.parse("25/12/2024 14:30:00", fmtHora);
```

### 7.3 Padrões de formatação

| Padrão | Significado         | Exemplo     |
|--------|---------------------|-------------|
| `yyyy` | Ano com 4 dígitos   | 2024        |
| `MM`   | Mês com 2 dígitos   | 12          |
| `MMMM` | Nome do mês         | dezembro    |
| `dd`   | Dia com 2 dígitos   | 25          |
| `HH`   | Hora (00-23)        | 14          |
| `hh`   | Hora (01-12)        | 02          |
| `mm`   | Minutos             | 30          |
| `ss`   | Segundos            | 00          |
| `a`    | AM/PM               | PM          |
| `E`    | Dia da semana curto | qua         |
| `EEEE` | Dia da semana longo | quarta-feira|

---

## 8. ZonedDateTime e Fusos Horários

```java
// Criar com fuso
ZonedDateTime spAgora = ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"));
ZonedDateTime utcAgora = ZonedDateTime.now(ZoneId.of("UTC"));

// Converter entre fusos
ZonedDateTime tokyo = spAgora.withZoneSameInstant(ZoneId.of("Asia/Tokyo"));

// Listar zonas disponíveis
ZoneId.getAvailableZoneIds().stream()
    .filter(z -> z.startsWith("America/"))
    .sorted()
    .forEach(System.out::println);

// Converter LocalDateTime para ZonedDateTime
LocalDateTime local = LocalDateTime.of(2024, 12, 25, 14, 30);
ZonedDateTime zoned = local.atZone(ZoneId.of("America/Sao_Paulo"));

// Converter para Instant (UTC)
Instant instant = zoned.toInstant();
```

---

## 9. APIs Legadas — Interoperabilidade

```java
// java.util.Date ↔ Instant
Date legada  = new Date();
Instant novo = legada.toInstant();
Date volta   = Date.from(Instant.now());

// java.util.Date ↔ LocalDate
LocalDate local = legada.toInstant()
    .atZone(ZoneId.systemDefault())
    .toLocalDate();

// java.sql.Date ↔ LocalDate (JDBC)
java.sql.Date sqlDate = java.sql.Date.valueOf(LocalDate.now());
LocalDate deVolta    = sqlDate.toLocalDate();
```

---

## 10. Exercício Prático

Implemente do zero:

1. Calcule a idade exata (anos, meses e dias) de uma pessoa a partir da data de nascimento
2. Dada uma lista de `Evento(String nome, LocalDateTime inicio, LocalDateTime fim)`, calcule a duração de cada evento e o tempo total de todos
3. Formate e exiba os eventos no formato: `"25/12/2024 às 14h30 — Nome do Evento (2h30m)"`
4. Converta um `ZonedDateTime` de São Paulo para Tokyo e exiba ambos
5. Verifique quais eventos ocorrem "hoje" ou no "futuro"

---

## Checklist do Dia

- [ ] Sei qual classe usar para cada situação (LocalDate, LocalTime, LocalDateTime, ZonedDateTime, Instant)
- [ ] Entendo a diferença entre Period (datas) e Duration (tempo)
- [ ] Formato e parseo datas com `DateTimeFormatter`
- [ ] Faço operações: plusDays, minusMonths, withDayOfMonth
- [ ] Converto entre fusos com `withZoneSameInstant`
- [ ] Sei converter APIs legadas para java.time

---

**Navegação:** [← Fundamentos](page_06.md) | [→ Próximo: I/O, NIO2 e Serialização](page_08.md)
