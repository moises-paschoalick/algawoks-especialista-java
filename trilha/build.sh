#!/usr/bin/env bash
#
# Gera o bundle estático da trilha para o GitHub Pages.
#
#   ./build.sh [diretorio-de-saida]
#
# O bundle é o próprio conteúdo de trilha/: não há transpilação nem minificação,
# só cópia e dois ajustes: a base dos links para docs/ (que não existem no
# repositório estático) e o .nojekyll (o Jekyll do Pages ignora pastas com _).

set -euo pipefail

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SAIDA="${1:-$AQUI/../dist/java-game}"

# repositório onde vivem os markdowns do curso, para onde os links vão apontar
DOCS_URL="https://github.com/moises-paschoalick/algawoks-especialista-java/blob/java-game/"

echo "→ limpando $SAIDA (preservando .git e README.md)"
mkdir -p "$SAIDA"
find "$SAIDA" -mindepth 1 -maxdepth 1 \
  ! -name '.git' ! -name 'README.md' -exec rm -rf {} +

echo "→ copiando arquivos estáticos"
cp "$AQUI"/*.html          "$SAIDA/"
cp -r "$AQUI"/styles       "$SAIDA/"
cp -r "$AQUI"/js           "$SAIDA/"
cp -r "$AQUI"/content      "$SAIDA/"
cp -r "$AQUI"/vendor       "$SAIDA/"
[ -d "$AQUI/videos" ] && cp -r "$AQUI"/videos "$SAIDA/"   # MP4 dos shorts (se houver)

echo "→ apontando os links de docs/ para $DOCS_URL"
sed -i "s|docBase: '../'|docBase: '${DOCS_URL}'|" "$SAIDA/content/curso.js"
grep -q "docBase: '${DOCS_URL}'" "$SAIDA/content/curso.js" \
  || { echo "✗ falhou ao reescrever docBase"; exit 1; }

# GitHub Pages roda Jekyll por padrão e descarta arquivos/pastas iniciados por _
touch "$SAIDA/.nojekyll"

echo "→ carimbando a versão do build"
COMMIT="$(git -C "$AQUI" rev-parse --short HEAD 2>/dev/null || echo desconhecido)"
DATA="$(date +%Y-%m-%d)"
HORA="$(date +%H:%M)"
NAULAS="$(grep -c '"status": "pronta"' "$AQUI/tools/roteiros.json")"
VERSAO="$DATA $HORA · $COMMIT · $NAULAS aulas"

# version.json: o que está no ar, incluindo a lista de aulas prontas
node -e '
  const fs = require("fs"), r = require("'"$AQUI"'/tools/roteiros.json");
  const prontas = r.roteiros.filter(x => x.status === "pronta");
  const info = {
    versao: "'"$VERSAO"'", commit: "'"$COMMIT"'", data: "'"$DATA $HORA"'",
    aulasProntas: prontas.length, totalAulas: r.roteiros.length,
    aulas: prontas.map(x => ({ id: x.aulaId, titulo: x.titulo, unidade: x.unidade, prioridade: x.prioridade })),
  };
  fs.writeFileSync("'"$SAIDA"'/version.json", JSON.stringify(info, null, 2) + "\n");
'
# injeta a versão no rodapé do hub
sed -i "s|<span id=\"build-version\">dev</span>|<span id=\"build-version\">$VERSAO</span>|" "$SAIDA/index.html"
echo "  versão: $VERSAO"

echo "→ conferindo integridade das referências"
falhas=0
while IFS= read -r ref; do
  [ -e "$SAIDA/$ref" ] || { echo "  ✗ referência quebrada: $ref"; falhas=$((falhas+1)); }
# strip do ?v=... de cache-busting antes de checar o arquivo no disco
done < <(grep -ho 'src="[^"]*"\|href="[^"]*\.css[^"]*"' "$SAIDA"/*.html \
         | sed 's/.*="//; s/"$//; s/?.*$//' | sort -u)

[ "$falhas" -eq 0 ] || { echo "✗ $falhas referência(s) quebrada(s)"; exit 1; }

echo
echo "✓ bundle pronto em $SAIDA"
du -sh "$SAIDA" | sed 's/^/  /'
find "$SAIDA" -type f | wc -l | sed 's/^/  arquivos: /'
