# PRDs · Trilha Java Gamificada

Documentos de Requisitos de Produto (PRD) da trilha de revisão do curso
**Especialista Java (AlgaWorks)** em formato de jogo.

Produto publicado em **https://moises-paschoalick.github.io/java-game/**
Código-fonte em `trilha/` (branch `java-game`).

## Convenções

- Nome do arquivo: `NNN-nome-kebab.md`, numeração sequencial e estável.
- Cada PRD descreve **o que** o produto entrega e **por que**, não a implementação linha a linha (essa vive no código).
- Status possíveis: `Implementado`, `Parcial`, `Planejado`.
- Idioma: português, sem travessão (`—`), seguindo o padrão de texto do projeto.

## Índice

| # | Documento | Status | Resumo |
|---|-----------|--------|--------|
| 001 | [Trilha e progressão](001-trilha-e-progressao.md) | Implementado | Mapa de unidades estilo Duolingo, desbloqueio sequencial, XP e ofensiva |
| 002 | [Progresso e revisão espaçada](002-progresso-e-revisao-espacada.md) | Implementado | Persistência local, agendamento de revisões, ofensiva de dias |
| 003 | [Páginas de teoria](003-paginas-teoria.md) | Implementado | Leitura do tema com índice e referência ao módulo do curso |
| 004 | [Exercícios práticos](004-exercicios-praticos.md) | Parcial | Flashcard, quiz, completar, entrevista e desafio de código no Monaco |
| 005 | [Aulas guiadas interativas](005-aulas-guiadas-interativas.md) | Parcial | Personagem narrador, cenas com analogia antes do conceito, animação e som |
| 006 | [Publicação estática](006-publicacao-estatica.md) | Implementado | Bundle sem build, `build.sh` e deploy no GitHub Pages |

## Especificações técnicas

Cada PRD tem uma SPEC correspondente em [`docs/specs/`](../specs/README.md), que
define **como** o requisito é construído (arquitetura, contratos, algoritmos e
deploy).

## Personas

- **Estudante revisor** (persona principal): já fez o curso há 3+ anos, commitou os
  códigos, e quer revisitar todo o conteúdo de forma lúdica e prática para uma
  entrevista técnica. Não quer reler o material inteiro; quer relembrar rápido e
  praticar.

## Princípios de produto

1. **Analogia antes do conceito.** Todo tema novo entra por uma imagem do mundo real; o código formaliza o que o aluno já sentiu.
2. **Prática sobre leitura.** O aluno age em cada passo; nada avança sozinho quando há interação.
3. **Zero fricção de setup.** HTML/CSS/JS estático, sem build e sem backend. Abre no navegador e funciona, inclusive offline.
4. **Mobile-first.** Desenhado para o celular primeiro; o desktop é a ampliação.
5. **Sem dependência de nuvem.** Todo o progresso mora no navegador do aluno.
