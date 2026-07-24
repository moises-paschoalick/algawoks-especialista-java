/* Unidade 6 — Date-Time API (docs/page_07.md · módulos 22, 23) */
Trilha.add({
  numero: 6,
  titulo: 'Date-Time API',
  icone: '📅',
  cor: '#ffc800',
  prioridade: 'media',
  doc: 'docs/page_07.md',
  modulos: [22, 23],
  resumo: 'java.time: imutável, thread-safe e com uma classe certa para cada situação.',
  licoes: [

    /* ------------------------------------------------------------------ */
    {
      id: 'dt-mapa',
      titulo: 'Qual classe usar em cada caso',
      icone: '🗺️',
      modulo: 23,
      resumo: 'A API legada e por que java.time a substituiu — e o mapa de decisão.',
      teoria: [
        { h: 'Problemas da API legada' },
        { ul: [
          '`Date` é **mutável** — qualquer código com a referência altera seu valor',
          'Não é thread-safe; `SimpleDateFormat` corrompe dados sob concorrência',
          'Meses começam em **0** (janeiro = 0) e o ano de `Date` era 1900-based',
          '`Date` mistura data e hora mesmo quando você só quer uma das duas',
          'Aritmética de datas exigia `Calendar` e código verboso',
        ] },
        { code: `// legado: fácil de errar
Calendar c = Calendar.getInstance();
c.set(2024, 0, 15);        // janeiro é 0!
Date d = c.getTime();
d.setTime(0);              // mutável` },
        { h: 'java.time (Java 8+)' },
        { p: 'Todas as classes são **imutáveis** e **thread-safe**. Toda operação devolve uma nova instância — a original nunca muda.' },
        { tabela: {
          head: ['Preciso de...', 'Classe', 'Exemplo'],
          rows: [
            ['Só data', '`LocalDate`', 'aniversário, vencimento'],
            ['Só hora', '`LocalTime`', 'horário de funcionamento'],
            ['Data + hora local', '`LocalDateTime`', 'agendamento'],
            ['Data + hora + fuso', '`ZonedDateTime`', 'evento internacional'],
            ['Instante na linha do tempo', '`Instant`', 'timestamp, log, auditoria'],
            ['Diferença em anos/meses/dias', '`Period`', 'idade, tempo de contrato'],
            ['Diferença em horas/min/seg', '`Duration`', 'tempo de execução'],
            ['Data sem ano', '`MonthDay`', 'feriado fixo'],
            ['Mês/ano', '`YearMonth`', 'validade de cartão'],
          ] } },
        { nota: 'Para gravar timestamp em banco e comunicar entre sistemas, prefira `Instant` (UTC). Guarde `ZonedDateTime` só quando o fuso do usuário fizer parte da regra de negócio.' },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'dt-operacoes',
      titulo: 'LocalDate, LocalDateTime e operações',
      icone: '➕',
      modulo: 23,
      resumo: 'Criar, navegar e consultar datas sem cair em armadilha de mutabilidade.',
      teoria: [
        { h: 'Criação' },
        { code: `LocalDate hoje = LocalDate.now();
LocalDate natal = LocalDate.of(2024, 12, 25);
LocalDate natal2 = LocalDate.of(2024, Month.DECEMBER, 25);
LocalDate parseada = LocalDate.parse("2024-12-25");        // ISO por padrão

LocalTime agora = LocalTime.now();
LocalTime almoco = LocalTime.of(12, 30);

LocalDateTime reuniao = LocalDateTime.of(2024, 12, 25, 14, 30);
LocalDateTime junto = natal.atTime(almoco);
LocalDate soData = reuniao.toLocalDate();` },
        { h: 'Operações — sempre devolvem nova instância' },
        { code: `LocalDate d = LocalDate.of(2024, 1, 31);

d.plusDays(10);      d.minusDays(10);
d.plusMonths(1);     // 2024-02-29 — ajusta para o último dia válido
d.plusYears(1);      d.plusWeeks(2);

d.withDayOfMonth(1);       // troca só o dia
d.withMonth(6);

// TemporalAdjusters para regras de calendário
d.with(TemporalAdjusters.lastDayOfMonth());
d.with(TemporalAdjusters.firstDayOfNextMonth());
d.with(TemporalAdjusters.next(DayOfWeek.MONDAY));` },
        { nota: 'Como tudo é imutável, `data.plusDays(1);` sozinho não faz nada — você precisa atribuir: `data = data.plusDays(1);`' },
        { h: 'Consultas e comparações' },
        { code: `d.getDayOfWeek();        // DayOfWeek.WEDNESDAY
d.getDayOfMonth();       d.getMonthValue();   d.getYear();
d.getDayOfYear();        d.lengthOfMonth();
d.isLeapYear();

d.isBefore(outra);       d.isAfter(outra);    d.isEqual(outra);

// dias úteis
boolean fds = d.getDayOfWeek() == DayOfWeek.SATURDAY
           || d.getDayOfWeek() == DayOfWeek.SUNDAY;` },
        { h: 'Period vs Duration' },
        { code: `// Period — baseado em DATAS (anos, meses, dias)
Period idade = Period.between(nascimento, LocalDate.now());
idade.getYears(); idade.getMonths(); idade.getDays();

// Duration — baseado em TEMPO (horas, minutos, segundos, nanos)
Duration jornada = Duration.between(entrada, saida);
jornada.toHours(); jornada.toMinutes(); jornada.getSeconds();

// ChronoUnit — a diferença total em uma única unidade
long dias = ChronoUnit.DAYS.between(inicio, fim);
long meses = ChronoUnit.MONTHS.between(inicio, fim);` },
        { p: '`Period.between` devolve **1 ano, 2 meses e 5 dias**. `ChronoUnit.DAYS.between` devolve **430 dias**. Escolha conforme a pergunta que você precisa responder.' },
      ],
      passos: [],
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'dt-formatacao',
      titulo: 'Formatação, fusos e interoperabilidade',
      icone: '🌍',
      modulo: [22, 23],
      resumo: 'DateTimeFormatter, ZonedDateTime e a ponte com o código legado.',
      teoria: [
        { h: 'Formatação e parse' },
        { code: `DateTimeFormatter br = DateTimeFormatter.ofPattern("dd/MM/yyyy");
String texto = data.format(br);                 // "25/12/2024"
LocalDate volta = LocalDate.parse("25/12/2024", br);

DateTimeFormatter completo = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
DateTimeFormatter porExtenso =
    DateTimeFormatter.ofPattern("EEEE, dd 'de' MMMM 'de' yyyy", new Locale("pt", "BR"));` },
        { tabela: {
          head: ['Padrão', 'Significado', 'Exemplo'],
          rows: [
            ['`dd`', 'dia com zero', '05'],
            ['`MM` / `MMM` / `MMMM`', 'mês número / abrev. / extenso', '12 / dez / dezembro'],
            ['`yyyy`', 'ano', '2024'],
            ['`HH` / `hh`', 'hora 24h / 12h', '14 / 02'],
            ['`mm` / `ss`', 'minuto / segundo', '30 / 45'],
            ['`EEEE`', 'dia da semana', 'quarta-feira'],
            ['`a`', 'AM/PM', 'PM'],
          ] } },
        { nota: 'Atenção: `MM` é mês e `mm` é minuto; `HH` é hora 0-23 e `hh` é 1-12. Trocar um pelo outro é o erro mais comum de formatação.' },
        { h: 'Fusos horários' },
        { code: `ZoneId sp = ZoneId.of("America/Sao_Paulo");
ZoneId tokyo = ZoneId.of("Asia/Tokyo");

ZonedDateTime aqui = ZonedDateTime.now(sp);
ZonedDateTime la = aqui.withZoneSameInstant(tokyo);   // MESMO instante, outro fuso
ZonedDateTime outro = aqui.withZoneSameLocal(tokyo);  // MESMA hora no relógio

// Instant: ponto absoluto na linha do tempo, sempre UTC
Instant agora = Instant.now();
ZonedDateTime local = agora.atZone(sp);
Instant volta = local.toInstant();` },
        { p: '`withZoneSameInstant` converte o horário (14h em SP → 2h do dia seguinte em Tóquio). `withZoneSameLocal` mantém 14h e só troca o fuso — quase sempre não é o que você quer.' },
        { h: 'Ponte com a API legada' },
        { code: `// Date -> java.time
Instant instant = date.toInstant();
LocalDateTime ldt = instant.atZone(ZoneId.systemDefault()).toLocalDateTime();

// java.time -> Date
Date d = Date.from(ldt.atZone(ZoneId.systemDefault()).toInstant());

// java.sql
LocalDate ld = sqlDate.toLocalDate();
java.sql.Date sql = java.sql.Date.valueOf(localDate);
java.sql.Timestamp ts = java.sql.Timestamp.valueOf(localDateTime);` },
        { nota: 'Em código novo, use `java.time` de ponta a ponta. JDBC 4.2+ aceita `LocalDate`/`LocalDateTime` direto em `setObject`, sem precisar converter para `java.sql.Date`.' },
      ],
      passos: [],
    },
  ],
});
