# SPEC 006 · Build e deploy

| | |
|---|---|
| Realiza | [PRD 006](../prds/006-publicacao-estatica.md) |
| Arquivos | `trilha/build.sh` |
| Origem | `moises-paschoalick/algawoks-especialista-java`, branch `java-game`, pasta `trilha/` |
| Destino | `moises-paschoalick/java-game`, branch `main` (GitHub Pages) |
| URL | https://moises-paschoalick.github.io/java-game/ |
| Atualizado | 2026-07-25 |

## 1. Topologia dos dois repositórios

```
algawoks-especialista-java (branch java-game)   <- FONTE DE VERDADE
└── trilha/                 código editável do jogo
    └── build.sh            gera o bundle
         |
         v  (cópia + reescrita)
dist/java-game              ARTEFATO (clone do repo de destino)
         |
         v  (git push)
java-game (branch main)     servido pelo GitHub Pages
         |
         v
https://moises-paschoalick.github.io/java-game/
```

Regra: **edita-se em `trilha/`**; `dist/java-game` é sempre gerado, nunca editado
à mão. `dist/` está no `.gitignore` do repositório do curso.

## 2. Contrato do `build.sh`

Uso: `./build.sh [diretorio-de-saida]` (padrão `../dist/java-game`).

Passos, na ordem, com falha rápida (`set -euo pipefail`):

1. **Limpar preservando git**: remove tudo em `SAIDA` exceto `.git` e `README.md`.
   Motivo: `rm -rf` da pasta inteira apagaria o repositório de destino (bug já corrigido).
   ```bash
   find "$SAIDA" -mindepth 1 -maxdepth 1 ! -name '.git' ! -name 'README.md' -exec rm -rf {} +
   ```
2. **Copiar** `*.html`, `styles/`, `js/`, `content/`, `vendor/`.
3. **Reescrever links de docs**: troca `docBase: '../'` por
   `docBase: 'https://github.com/moises-paschoalick/algawoks-especialista-java/blob/java-game/'`
   em `content/curso.js`. Se a reescrita não bater, o build falha.
   Motivo: os markdowns de teoria não existem no repositório estático; os links
   precisam apontar para o repositório do curso.
4. **`.nojekyll`**: cria o arquivo. O GitHub Pages roda Jekyll por padrão e
   descartaria pastas iniciadas por `_`; o `.nojekyll` desliga isso.
5. **Verificar integridade**: extrai todo `src="..."` e `href="...css"` dos HTML e
   confere que cada arquivo existe no bundle. Qualquer referência quebrada aborta
   o build antes de publicar.
6. Relata tamanho e contagem de arquivos.

## 3. Procedimento de deploy

### 3.1 Primeira vez (setup, manual e único)

O repositório `java-game` já existe e o Pages já está habilitado. Caso precise
refazer:

1. Criar o repositório `java-game` (público) no GitHub.
2. Habilitar Pages: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.
3. A URL `usuario.github.io/java-game/` é derivada do nome do repositório.

Requisito de credencial: acesso SSH ao GitHub (`git@github.com`), já configurado
nesta máquina.

### 3.2 Publicação recorrente

Pré-condição: `dist/java-game` é um clone do repositório de destino, **com `.git`**.
Se não existir ou tiver perdido o `.git`:

```bash
cd algawoks-especialista-java
rm -rf dist/java-game
git clone git@github.com:moises-paschoalick/java-game.git dist/java-game
```

Fluxo normal a cada atualização:

```bash
# 1. commitar a fonte no repo do curso
cd algawoks-especialista-java     # branch java-game
git add trilha/ && git commit -m "..." && git push

# 2. gerar o bundle
cd trilha && ./build.sh           # escreve em ../dist/java-game, preservando .git

# 3. publicar o artefato
cd ../dist/java-game
git add -A && git commit -m "Atualiza bundle" && git push
```

O `build.sh` preserva o `.git`, então o passo 3 gera um commit incremental
limpo (só os arquivos que mudaram).

## 4. Verificação pós-deploy

O Pages leva 1 a 2 minutos para propagar. Checagem:

```bash
for u in "" index.html "aula.html?id=strings" vendor/gsap.min.js; do
  curl -s -o /dev/null -w "%{http_code}  /$u\n" \
    -L "https://moises-paschoalick.github.io/java-game/$u"
done
```

Esperado: `200` em todas. Cache do navegador pode exigir refresh forçado
(Ctrl+Shift+R) para ver a versão nova.

## 5. Propriedades garantidas

- **Idempotente**: rodar o build N vezes produz o mesmo bundle e não corrompe o `.git` do destino.
- **Reprodutível**: só `bash`, `cp`, `sed`, `find`; nenhum toolchain.
- **Fail-fast**: reescrita de link ausente ou asset quebrado aborta antes de publicar.
- **Separação fonte/artefato**: a fonte vive no repo do curso; o bundle é derivado.

## 6. Riscos e mitigações

| Risco | Mitigação |
|-------|-----------|
| `rm -rf` apagar o repo de destino | limpeza seletiva preservando `.git` e `README.md` (passo 1) |
| Links de teoria quebrados no site | reescrita de `docBase` com verificação de sucesso (passo 3) |
| Jekyll descartar pasta com `_` | `.nojekyll` (passo 4) |
| Asset faltando no bundle | verificação de integridade que aborta o build (passo 5) |
| Perder histórico do `dist` | `dist/java-game` é clone do remoto; recriável por `git clone` |
