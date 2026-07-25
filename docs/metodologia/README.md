# Metodologia · Produção de aulas e trilhas do java-game

Processo repetível para criar as **aulas guiadas** e novas **trilhas**, do
conteúdo pedagógico até a tela animada, com revisão pedagógica no fim.

Princípio que rege tudo: a fonte é sempre o **conteúdo de revisão**
(`docs/page_*.md`, a checklist do [sprint](../SPRINT-REVISAO-14-DIAS.md), os
cards de `ANKI-CARDS-JAVA.md`). Nada é inventado do zero; cada aula transforma um
tema de revisão em experiência interativa.

## A esteira (6 etapas + seleção)

```
[0] Seleção        escolhe a lição a partir do conteúdo de revisão
        v
[1] 🎓 Pedagógico   objetivo, decomposição, erro comum, pegadinha, arco
        v
[2] 🔗 Analogias    uma analogia manipulável do mundo real por conceito
        v
[3] 🎨 Ilustração   storyboard: o que aparece em cada cena, estados
        v
[4] 🎬 Design       animação e som: o que anima, quando, com qual timing
        v
[5] 💻 Desenvolvimento  content/aula-*.js + CSS, seguindo a SPEC 005
        v
[6] ✅ Revisão pedagógica  valida contra a etapa 1; aprova ou devolve
```

Cada etapa **consome** o artefato da anterior e **produz** o seu, preenchendo uma
seção do mesmo documento que viaja pela esteira: uma cópia de
[`TEMPLATE-aula.md`](TEMPLATE-aula.md), salva em `docs/metodologia/aulas/<id>.md`.

## Papéis (chapéus)

Cada papel pode ser uma pessoa ou um agente; o que importa é o artefato entregue.

| # | Papel | Responsável por | Entrega |
|---|-------|-----------------|---------|
| 1 | 🎓 **Pedagogo** | o que o aluno vai aprender e em que ordem descobrir | Briefing pedagógico |
| 2 | 🔗 **Roteirista de analogias** | traduzir cada conceito em imagem do mundo real | Mapa conceito → analogia |
| 3 | 🎨 **Ilustrador** | o que aparece na tela de cada cena | Storyboard por cena |
| 4 | 🎬 **Designer/animador** | movimento, feedback e som | Mapa de animação |
| 5 | 💻 **Desenvolvedor** | implementar no motor de aula | `content/aula-*.js` + CSS |
| 6 | ✅ **Revisor pedagógico** | garantir que a aula ensina | Veredito e ajustes |

## Etapas em detalhe

### [0] Seleção
- **Entrada**: prioridade do sprint (🔴 primeiro), checklist da lição, `docs/page_XX.md`.
- **Saída**: a lição escolhida (id, módulo do curso, prioridade).
- **Portão**: é uma lição já existente na trilha, com teoria pronta.

### [1] Briefing pedagógico · 🎓
- **Entrada**: a seção de `docs/page_XX.md` do tema, o item da checklist, o card Anki, a pegadinha de entrevista.
- **Faz**: objetivo da aula; 5 a 7 frases "o aluno consegue..."; o **conceito nuclear**; o **erro comum** que o aluno comete; a **pegadinha de entrevista**; o **arco** (problema sentido antes da solução, descoberta antes do nome); ligações com outras lições.
- **Saída**: seção 1 do template.
- **Portão**: cada objetivo é verificável; o arco coloca o problema antes da solução.

### [2] Analogias · 🔗
- **Entrada**: o briefing.
- **Faz**: uma analogia do mundo real por conceito, **concreta e manipulável** (o aluno age nela, não só olha); mapa conceito → analogia; garante que o nome técnico só aparece **depois** da vivência.
- **Saída**: seção 2.
- **Portão**: a analogia é manipulável, não meramente ilustrativa; "analogia antes do conceito" garantido em cada cena de conceito.

### [3] Ilustração / storyboard · 🎨
- **Entrada**: as analogias.
- **Faz**: por cena, o que aparece na tela (elementos, estados, o que muda ao interagir); esboço textual ou ASCII; **reaproveita componentes visuais existentes** de `styles/aula.css` sempre que possível.
- **Saída**: seção 3 (storyboard cena a cena).
- **Portão**: cada cena cabe no palco mobile; componentes reusados quando cabível.

### [4] Design de animação e som · 🎬
- **Entrada**: o storyboard.
- **Faz**: por cena, o que anima e quando (entrada, feedback de acerto/erro, transição); ease e timing (GSAP); evento → som; reação do personagem (emoção); confirma o layout mobile.
- **Saída**: seção 4 (mapa de animação).
- **Portão**: todo movimento tem propósito (nada decorativo gratuito); respeita `prefers-reduced-motion`; som ligado a evento, nunca de fundo.

### [5] Desenvolvimento · 💻
- **Entrada**: storyboard + mapa de animação.
- **Faz**: implementa `content/aula-<id>.js` (cenas com `fala`/`palco`/`interativo`), CSS novo em `styles/aula.css`, registra o `<script>` em `aula.html` e marca `aula: '<id>'` na lição. Segue a [SPEC 005](../specs/005-motor-de-aula-e-som.md).
- **Saída**: código + seção 5 (notas, `node --check`, smoke test).
- **Portão**: `node --check` passa; roda no navegador; mobile sem rolagem horizontal; sem travessão.

### [6] Revisão pedagógica · ✅
- **Entrada**: a aula rodando.
- **Faz**: percorre de ponta a ponta contra os critérios da etapa 1; aplica a checklist de aceite (abaixo); anota ajustes.
- **Saída**: seção 6 (veredito) → **aprovada** ou **devolve** à etapa que falhou.
- **Portão**: Definition of Done completo; o revisor consegue aprender o conceito só pela aula.

## Definition of Done (aula)

- [ ] 10 a 12 cenas, a maioria interativa
- [ ] Analogia antes do conceito em toda cena de conceito
- [ ] Nome técnico do conceito só aparece após a descoberta
- [ ] 3 a 5 avaliações contam ponto (`api.registrarResposta`)
- [ ] Som ligado a evento; personagem reage por emoção
- [ ] Mobile-first: `100dvh`, sem rolagem horizontal
- [ ] Conclui com `Progress.concluir` e entra na revisão espaçada
- [ ] `node --check` limpo; nenhum travessão no texto
- [ ] Revisor pedagógico aprova

## Loop de retorno

Se a etapa 6 reprova, o documento volta para a etapa que falhou (quase sempre a
1, arco pedagógico, ou a 2, analogia fraca), não para o começo. Registra-se o
motivo na seção 6 e refaz-se só o necessário.

## Backlog priorizado (aulas a produzir)

Existem hoje **4 de 36** aulas guiadas. Ordem sugerida por peso de entrevista:

| Prioridade | Unidade | Lições sem aula | Analogia candidata |
|:----------:|---------|-----------------|--------------------|
| 🔴 | OOP | encapsulamento, herança/polimorfismo, interfaces, records, composição | cofre e chaves; contrato assinado; molde de fábrica |
| 🔴 | Collections | hierarquia, List, Set/Map/hashCode, ordenação, enums | caixa organizadora; catálogo com índice |
| 🔴 | Exceções e Generics | hierarquia, try-with-resources, generics básico | disjuntor; torneira que fecha sozinha (a de generics já existe) |
| 🔴 | Funcional | lambdas, streams, optional | linha de montagem; esteira com estações |
| 🔴 | Boas Práticas | código limpo, patterns, logging, maven | receita vs improviso; caixa de ferramentas |
| 🟡 | JDBC, Date-Time, I/O, Reflection | todas | tradutor; fuso do relógio; arquivo e gaveta; raio-X |
| 🟢 | Fundamentos | fluxo/switch, memória | (Primitivos, Wrappers, Strings já feitas) |

Aulas prontas: Primitivos, Wrappers, Strings (Fundamentos) e Generics.

## Criar uma nova trilha (outro tema)

A esteira acima produz **aulas**. Para uma **trilha nova** (ex.: Spring,
Estruturas de Dados):

1. Definir a fonte (sílabo/curso) e a persona.
2. Quebrar em unidades e lições, com tag de prioridade, no formato de
   `content/pageXX-*.js` (ver [SPEC 003](../specs/003-conteudo-e-renderizacao.md)).
3. Escrever a teoria de cada lição (blocos declarativos).
4. Cada lição que merece experiência guiada passa por esta esteira.
5. Publicar (ver [SPEC 006](../specs/006-build-e-deploy.md)); pode ser nova
   unidade na trilha atual ou um bundle separado.

## Artefatos e onde ficam

| Etapa | Artefato | Local |
|-------|----------|-------|
| 1 a 6 | Documento da aula (viaja pela esteira) | `docs/metodologia/aulas/<id>.md` (cópia do template) |
| 5 | Código da aula | `trilha/content/aula-<id>.js` |
| 5 | Estilos de cena novos | `trilha/styles/aula.css` |
| histórico | Planos legados (formato anterior) | `trilha/PLANO-AULA-*.md` (Wrappers e Strings) |

Os `PLANO-AULA-02` e `03` existentes são exemplos de saída da etapa 1 no formato
antigo; a partir de agora o documento único do template cobre as 6 etapas.
