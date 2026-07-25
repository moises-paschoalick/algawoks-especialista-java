# PRD 006 · Publicação estática

| | |
|---|---|
| Status | Implementado |
| Arquivos | `trilha/build.sh`, repositório `moises-paschoalick/java-game` |
| Atualizado | 2026-07-25 |

## 1. Contexto e problema

A trilha é feita de arquivos estáticos (HTML/CSS/JS), mas mora dentro do
repositório do curso, junto com os módulos e os markdowns de teoria. Para
publicar como um jogo acessível por URL, é preciso extrair **só os arquivos do
jogo** para um repositório próprio de páginas estáticas, sem quebrar os links que
apontam para os markdowns de teoria (que ficam no repositório do curso).

## 2. Objetivo

Gerar, a partir de `trilha/`, um bundle estático publicável em
**https://moises-paschoalick.github.io/java-game/**, com um passo de build
simples e reproduzível.

## 3. Caso de uso

O autor edita a trilha em `trilha/`, roda `build.sh`, e obtém em
`dist/java-game` uma cópia pronta para commit no repositório `java-game`, que o
GitHub Pages serve. Editar é sempre no repositório do curso; o bundle é gerado,
nunca editado à mão.

## 4. Escopo funcional

### 4.1 Geração do bundle
- Copia `*.html`, `styles/`, `js/`, `content/` e `vendor/` para o diretório de saída.
- **Preserva** `.git` e `README.md` do repositório de destino (não apaga o histórico ao regenerar).
- Cria `.nojekyll` (o GitHub Pages roda Jekyll por padrão e descartaria pastas iniciadas por `_`).

### 4.2 Reescrita de links
- Substitui `Curso.docBase` de `'../'` para a URL absoluta dos markdowns no repositório do curso, para que os links "Teoria completa" funcionem no site publicado.
- Falha o build se a reescrita não acontecer.

### 4.3 Verificação de integridade
- Ao final, confere que todo `src`/`href` de CSS referenciado nos HTML existe no bundle; qualquer referência quebrada faz o build falhar antes de publicar.

### 4.4 Deploy
- Repositório dedicado `moises-paschoalick/java-game`, branch `main`, servido pelo GitHub Pages a partir da raiz.
- URL final derivada do nome do repositório: `usuario.github.io/java-game/`.

## 5. Requisitos não funcionais

- **Reprodutível e idempotente**: rodar o build várias vezes produz o mesmo resultado e não corrompe o repositório de destino.
- **Sem toolchain**: apenas `bash`, `cp`, `sed`, `find`; nada de Node/bundler.
- **Separação de fontes**: o bundle é artefato; a fonte de verdade é `trilha/` no repositório do curso.

## 6. Fora de escopo

- Minificação, transpilação ou versionamento de assets.
- Pipeline de CI/CD automatizado (o deploy é manual: build + commit + push).

## 7. Métricas de sucesso

- `https://moises-paschoalick.github.io/java-game/` responde 200, assim como as subpáginas (`aula.html`, `teoria.html`, `licao.html`) e o `vendor/gsap.min.js`.
- Regenerar o bundle preserva o histórico git do repositório `java-game`.
- Nenhuma referência de asset quebrada no bundle.

## 8. Fluxo operacional

```
# no repositório do curso, branch java-game
cd trilha && ./build.sh
cd ../dist/java-game
git add -A && git commit -m "Atualiza bundle" && git push
```

Primeira publicação exige habilitar o GitHub Pages no repositório `java-game`
(Settings → Pages → Deploy from a branch → main / root). Passo único, manual.

## 9. Dependências e referências

- Parametrização de links: `Curso.docBase` em `trilha/content/curso.js` (ver [PRD 003](003-paginas-teoria.md)).
- Repositório de destino: `moises-paschoalick/java-game`.
