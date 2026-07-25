# PRD 003 · Páginas de teoria

| | |
|---|---|
| Status | Implementado |
| Arquivos | `trilha/teoria.html`, `trilha/js/teoria.js`, `trilha/js/render.js`, `trilha/content/curso.js` |
| Atualizado | 2026-07-25 |

## 1. Contexto e problema

O aluno já assistiu ao curso e commitou os códigos, mas faz anos. Ele precisa de
uma **referência de leitura** por tema que: (a) relembre o conceito de forma
concisa, e (b) diga exatamente **em qual módulo do curso** rever o vídeo e onde
está o código que ele mesmo commitou, caso queira ir a fundo.

## 2. Objetivo

Entregar, para cada lição, uma página de teoria navegável que apresente o
conteúdo com código destacado e aponte para o módulo do curso correspondente.

## 3. Caso de uso

O aluno abre a teoria de um tema, lê pelo índice lateral, salta para a seção que
interessa, e vê a caixa "Módulo X do curso" com o caminho da pasta onde estão o
vídeo e o código dele. Ao final, segue para a prática ou para a próxima teoria.

## 4. Escopo funcional

### 4.1 Estrutura da página
- Índice lateral com todas as unidades e lições; a atual em destaque, as concluídas com estrela.
- Cabeçalho com unidade, cor e tag de prioridade.
- Corpo em blocos: parágrafos, listas, **tabelas comparativas** e blocos de código Java com realce de sintaxe.

### 4.2 Referência ao módulo do curso
- Caixa "📹 Módulo N" com o nome e o **caminho exato da pasta** no repositório (ex.: `7. Wrappers e boxing/`), que é onde vivem o vídeo e o código commitado.
- Caixa "📄 Teoria completa" com link para o markdown de origem em `docs/`.

### 4.3 Navegação
- Sumário "Nesta página" com as seções; o item ativo se destaca conforme a rolagem.
- Botões ao final: praticar a lição (quando há exercícios), abrir a aula guiada (quando existe) e voltar à trilha.
- Navegação anterior/próxima entre as teorias, na ordem da trilha.

### 4.4 Renderização compartilhada
- O mesmo motor de renderização (`render.js`) alimenta a teoria e as lições, evitando divergência de conteúdo. Conteúdo é autorado como blocos, não como HTML solto.

## 5. Requisitos não funcionais

- **Realce de sintaxe próprio**, leve, sem biblioteca externa.
- **Mini-markdown inline**: negrito e `código`.
- **Links parametrizados** via `Curso.docBase`, para funcionarem tanto no repositório quanto no bundle publicado (ver [PRD 006](006-publicacao-estatica.md)).
- Mobile-first: índice colapsa acima do conteúdo em telas pequenas.

## 6. Fora de escopo

- Edição de conteúdo pelo usuário.
- Busca textual dentro da teoria.

## 7. Métricas de sucesso

- Cada uma das 36 lições tem página de teoria funcional.
- As 30 pastas de módulo referenciadas existem no repositório (validado).
- Zero rolagem horizontal no celular.

## 8. Dependências e referências

- Índice do curso: `trilha/content/curso.js` (`MODULOS`, `pasta(n)`).
- Origem do conteúdo: `docs/page_01.md` a `docs/page_10.md`.
