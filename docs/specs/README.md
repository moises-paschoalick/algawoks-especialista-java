# SPECs · Trilha Java Gamificada

Especificações de Software (SPEC): definem **como** o software é construído para
atender aos [PRDs](../prds/README.md). Enquanto o PRD responde "o que e por quê",
a SPEC responde "como": arquitetura, contratos de módulo, estruturas de dados,
algoritmos e o processo de deploy.

## Convenções

- Nome do arquivo: `NNN-nome-kebab.md`.
- Cada SPEC referencia o(s) PRD(s) que realiza.
- Assinaturas de função em pseudo-JS; nomes reais dos arquivos e símbolos.
- Idioma: português, sem travessão (`—`).

## Mapa SPEC → PRD

| SPEC | Realiza o PRD | Assunto |
|------|---------------|---------|
| [001 Arquitetura geral](001-arquitetura-geral.md) | todos | Estrutura de arquivos, carregamento sem build, fluxo de dados, namespaces |
| [002 Dados e progresso](002-dados-e-progresso.md) | [002](../prds/002-progresso-e-revisao-espacada.md) | Schema do localStorage, algoritmo de revisão espaçada, contrato de `Progress` |
| [003 Conteúdo e renderização](003-conteudo-e-renderizacao.md) | [001](../prds/001-trilha-e-progressao.md), [003](../prds/003-paginas-teoria.md) | Modelo de conteúdo em blocos, `Curso`/`Trilha`/`Render`, montagem do mapa e da teoria |
| [004 Motor de lição](004-motor-de-licao.md) | [004](../prds/004-exercicios-praticos.md) | Máquina de passos, tipos de exercício, editor Monaco e verificação estática |
| [005 Motor de aula e som](005-motor-de-aula-e-som.md) | [005](../prds/005-aulas-guiadas-interativas.md) | Motor de cenas, API do palco, personagem SVG, síntese de áudio |
| [006 Build e deploy](006-build-e-deploy.md) | [006](../prds/006-publicacao-estatica.md) | `build.sh`, parametrização de links, deploy no repositório `java-game` |

## Stack

- **Runtime**: navegador. HTML + CSS + JavaScript ES2020, sem transpilação.
- **Sem bundler**: scripts carregados por `<script>` na ordem de dependência.
- **Bibliotecas**: GSAP (animação, vendorizada em `trilha/vendor/`) e Monaco Editor (CDN, com fallback). Nada mais.
- **Estado**: `localStorage`. Sem backend.
- **Áudio**: Web Audio API, sintetizado.
- **Deploy**: bundle estático gerado por `bash` e servido pelo GitHub Pages.
