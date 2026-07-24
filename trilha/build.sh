#!/usr/bin/env bash
#
# Gera o bundle estático da trilha para o GitHub Pages.
#
#   ./build.sh [diretorio-de-saida]
#
# O bundle é o próprio conteúdo de trilha/ — não há transpilação nem minificação,
# só cópia e dois ajustes: a base dos links para docs/ (que não existem no
# repositório estático) e o .nojekyll (o Jekyll do Pages ignora pastas com _).

set -euo pipefail

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SAIDA="${1:-$AQUI/../dist/java-game}"

# repositório onde vivem os markdowns do curso, para onde os links vão apontar
DOCS_URL="https://github.com/moises-paschoalick/algawoks-especialista-java/blob/java-game/"

echo "→ limpando $SAIDA"
rm -rf "$SAIDA"
mkdir -p "$SAIDA"

echo "→ copiando arquivos estáticos"
cp "$AQUI"/*.html          "$SAIDA/"
cp -r "$AQUI"/styles       "$SAIDA/"
cp -r "$AQUI"/js           "$SAIDA/"
cp -r "$AQUI"/content      "$SAIDA/"
cp -r "$AQUI"/vendor       "$SAIDA/"

echo "→ apontando os links de docs/ para $DOCS_URL"
sed -i "s|docBase: '../'|docBase: '${DOCS_URL}'|" "$SAIDA/content/curso.js"
grep -q "docBase: '${DOCS_URL}'" "$SAIDA/content/curso.js" \
  || { echo "✗ falhou ao reescrever docBase"; exit 1; }

# GitHub Pages roda Jekyll por padrão e descarta arquivos/pastas iniciados por _
touch "$SAIDA/.nojekyll"

echo "→ conferindo integridade das referências"
falhas=0
while IFS= read -r ref; do
  [ -e "$SAIDA/$ref" ] || { echo "  ✗ referência quebrada: $ref"; falhas=$((falhas+1)); }
done < <(grep -ho 'src="[^"]*"\|href="[^"]*\.css"' "$SAIDA"/*.html \
         | sed 's/.*="//; s/"$//' | sort -u)

[ "$falhas" -eq 0 ] || { echo "✗ $falhas referência(s) quebrada(s)"; exit 1; }

echo
echo "✓ bundle pronto em $SAIDA"
du -sh "$SAIDA" | sed 's/^/  /'
find "$SAIDA" -type f | wc -l | sed 's/^/  arquivos: /'
