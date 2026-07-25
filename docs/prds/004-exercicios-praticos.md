# PRD 004 · Exercícios práticos

| | |
|---|---|
| Status | Parcial (5 lições de Fundamentos têm exercícios; demais unidades pendentes) |
| Arquivos | `trilha/licao.html`, `trilha/js/licao.js`, `trilha/js/editor.js`, `trilha/content/page*.js` |
| Depende de | [002 Progresso](002-progresso-e-revisao-espacada.md), [003 Renderização](003-paginas-teoria.md) |
| Atualizado | 2026-07-25 |

## 1. Contexto e problema

Revisar só lendo não fixa. O aluno precisa **agir**: responder, completar,
escrever código. Como o produto é estático e offline, não há como compilar Java
no servidor; a verificação de código precisa ser feita no próprio navegador.

## 2. Objetivo

Oferecer uma sequência de exercícios por lição, um por tela, com feedback
imediato de acerto/erro e barra de progresso, cobrando a construção correta do
conhecimento em vários formatos.

## 3. Caso de uso

O aluno abre a lição, lê um resumo da teoria, e avança por passos: responde um
quiz, completa uma lacuna, escreve uma resposta de entrevista e resolve um
desafio de código. Ao final, recebe XP proporcional aos acertos e a lição entra
na revisão espaçada.

## 4. Escopo funcional

### 4.1 Tipos de passo
- **Teoria**: abertura com resumo e referência ao módulo do curso.
- **Flashcard**: pergunta na frente, resposta no verso, com autoavaliação (acertei / preciso revisar).
- **Quiz**: múltipla escolha com verificação e explicação.
- **Completar**: preencher lacunas em um trecho de código, com respostas aceitas normalizadas.
- **Pergunta e resposta (entrevista)**: campo aberto, revelação do gabarito e autoavaliação.
- **Desafio de código**: editor Monaco com verificação estática.

### 4.2 Desafio de código
- Editor **Monaco** carregado por CDN, tema escuro, com **queda para `<textarea>`** se não houver rede.
- Verificação **estática** (análise do texto por regras/regex), não compilação. Deixa isso explícito ao aluno.
- Lista de requisitos que acendem verde/vermelho conforme o código os satisfaz.
- Opção de revelar a solução de referência (conta como não acerto e agenda revisão).

### 4.3 Fluxo e feedback
- Um passo por tela, barra de progresso no topo.
- Barra de feedback fixa embaixo, verde no acerto e vermelha no erro, com explicação.
- Tela final com XP ganho, acertos e data da próxima revisão.

### 4.4 Sinalização sonora
- Efeitos de acerto, erro e conclusão via motor de som (ver [PRD 005](005-aulas-guiadas-interativas.md), seção de som).

## 5. Requisitos não funcionais

- **Sem backend**: verificação de código roda 100% no cliente.
- **Resiliência de rede**: o editor degrada para textarea sem quebrar o exercício.
- **Autoria declarativa**: cada passo é um objeto no array `passos` da lição.
- Mobile-first: editor e opções com alvos de toque confortáveis.

## 6. Fora de escopo

- Compilação e execução real de Java (exigiria backend; decisão explícita do produto).
- Correção semântica profunda do código (a verificação é por padrões, não por AST).

## 7. Métricas de sucesso

- As 5 lições de Fundamentos rodam ponta a ponta com os 5 tipos de passo.
- O desafio de código funciona com e sem acesso à CDN do Monaco.
- XP e revisão são registrados corretamente ao concluir.

## 8. Estado atual e roadmap

- **Feito**: exercícios das 5 lições da Unidade 1 (Fundamentos), ~18 passos.
- **Pendente**: exercícios das unidades 2 a 10 (OOP, Collections, Exceções/Generics, Funcional, Date-Time, I/O, JDBC, Reflection, Boas Práticas). Sugestão de ordem: seguir a prioridade alta primeiro.

## 9. Dependências e referências

- Editor: `trilha/js/editor.js` (Monaco via CDN + fallback).
- Registro de progresso: [PRD 002](002-progresso-e-revisao-espacada.md).
