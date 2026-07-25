# PRD 001 · Trilha e progressão

| | |
|---|---|
| Status | Implementado |
| Arquivos | `trilha/index.html`, `trilha/js/trilha.js`, `trilha/content/curso.js`, `trilha/content/page*.js` |
| Depende de | [002 Progresso e revisão espaçada](002-progresso-e-revisao-espacada.md) |
| Atualizado | 2026-07-25 |

## 1. Contexto e problema

O curso Especialista Java tem 35 módulos. Quem já concluiu há anos precisa de um
**mapa** que mostre o caminho de revisão inteiro, sinalize o que já foi feito e
puxe o aluno para o próximo passo, sem exigir que ele decida sozinho por onde
começar. O material em `docs/page_01.md` a `page_10.md` cobre o conteúdo, mas em
formato de leitura longa, sem senso de progresso nem retomada.

## 2. Objetivo

Oferecer uma trilha visual, no estilo de jogo (referência: Duolingo), que
organize os 35 módulos em unidades e lições curtas, com desbloqueio guiado e
feedback constante de avanço.

## 3. Caso de uso

O estudante abre a trilha, vê onde parou (nó destacado com "COMEÇAR"), entra na
próxima lição, e ao concluir volta ao mapa com XP somado e a lição seguinte
liberada. A qualquer momento consegue enxergar o todo e escolher revisar um tema
específico.

## 4. Escopo funcional

### 4.1 Estrutura em unidades e lições
- 10 unidades cobrindo as 10 páginas de teoria, na ordem de prioridade: Fundamentos, OOP, Collections, Exceções e Generics, Programação Funcional, Date-Time, I/O, JDBC, Reflection, Boas Práticas.
- Cada unidade tem cor, ícone, faixa de prioridade (alta/média/base) e lista os módulos do curso que cobre.
- Cada lição declara um destino: aula guiada, exercícios ou apenas teoria.

### 4.2 Mapa serpenteante
- Nós circulares dispostos em caminho sinuoso (deslocamentos horizontais alternados).
- Estados do nó: **bloqueado** (cadeado), **disponível** (ícone da lição ou ▶ para aula guiada), **concluído** (estrela) e **a revisar** (selo vermelho).
- Troféu ao fim de cada unidade, aceso quando todas as lições estão concluídas.

### 4.3 Desbloqueio sequencial
- Uma lição libera quando a anterior da sequência foi concluída.
- Lições que ainda só têm teoria nunca ficam bloqueadas.
- **Modo livre**: botão que destrava toda a trilha, para quem quer revisar fora de ordem.

### 4.4 HUD de progresso
- Contadores no topo: XP acumulado (⚡), ofensiva de dias (🔥) e lições concluídas (✅).
- Barra de progresso geral e painel "Revisar hoje" com as lições vencidas.

### 4.5 Ações de apoio
- Zerar progresso (com confirmação).
- Link para o hub de estudos em markdown.
- Acesso direto à teoria de cada unidade.

## 5. Requisitos não funcionais

- **Conteúdo declarativo**: cada unidade é um objeto JS em `content/page*.js` registrado via `Trilha.add(...)`; adicionar lição é editar dados, não lógica.
- **Sem build**: HTML/CSS/JS puro; a ordem dos `<script>` define a ordem da trilha.
- **Mobile-first**: caminho e nós desenhados primeiro para telas de celular.

## 6. Fora de escopo

- Ranking entre usuários, contas ou sincronização entre dispositivos.
- Trilhas alternativas ou personalização da ordem além do modo livre.

## 7. Métricas de sucesso

- O aluno identifica em menos de 5 segundos qual é a próxima lição.
- Todas as 10 unidades e 36 lições aparecem no mapa com estado correto.
- As referências de módulo do curso batem com as pastas reais do repositório.

## 8. Dependências e referências

- Progresso e desbloqueio: [PRD 002](002-progresso-e-revisao-espacada.md).
- Índice do curso (nomes e pastas dos 35 módulos): `trilha/content/curso.js`.
- Teoria de origem: `docs/page_01.md` a `docs/page_10.md`.
