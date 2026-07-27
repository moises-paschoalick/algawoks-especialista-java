---
name: gerar-short-java
description: >-
  Gera um vídeo curto (short) de Java no estilo da série "Java em 30 segundos":
  vertical 1080x1920, ~30s, com analogia animada de objetos do mundo real,
  narração em português (gTTS), descrição grande + legenda em karaokê, feito no
  projeto Remotion e encaixado no player do hub da trilha. Use quando pedirem
  para criar, roteirizar, renderizar ou melhorar um short/reels/vídeo de Java.
---

# Gerar um short de Java

Pipeline completo para produzir um short da série **Java em 30 segundos**. Dois
projetos envolvidos:

- **Trilha** (este repo): `trilha/content/shorts.js` (dados) e o player em
  `trilha/js/shorts-player.js` que encaixa o MP4.
- **Remotion**: `~/Desktop/DEV/remotion`, composições em `src/java-shorts/`,
  registradas em `src/Root.tsx`. Narração em `public/narracao/`.

Referência viva (copie o padrão): `src/java-shorts/JavaShortMolde.tsx` é o short
2 (classe/objeto) já pronto e aprovado. Roteiros: `docs/shorts/ROTEIROS-SHORTS.md`.

## Princípios (equipe pedagógica)

1. **Analogia com objetos do mundo real, ANTES do conceito.** O short 2 usa uma
   fôrma (classe) que estampa carrinhos coloridos (objetos). Sempre escolha uma
   metáfora física e **anime os objetos** (spring), não só texto.
2. **Formato do roteiro**: gancho (pergunta) → 3 beats → dica. ~80 palavras no total.
3. **Analogia primeiro, nome do conceito depois.**

## Design (aprovado)

- **Vertical 1080x1920, 30fps, ~30-31s** (900-930 frames).
- **Tipografia**: Poppins via `@remotion/google-fonts` (pesos 600/700/800) para
  texto; monospace para código. Mantenha a versão do `@remotion/google-fonts`
  **igual** à do `remotion` core (senão o render avisa de incompatibilidade).
- **Dois planos de texto, distintos**:
  - **DESCRIÇÃO**: a frase-chave grande de cada fase (o take-away), muda com a
    animação. Poppins 800, ~66px.
  - **LEGENDA**: transcrição da narração em **karaokê**, embaixo da descrição,
    seguindo o áudio (palavra já falada = branca, atual = ouro `#ffc800`,
    futura = esmaecida). Barra escura translúcida arredondada.
- **Zonas verticais sem sobreposição**: topo/marca (72–330), animação (400–1150),
  descrição (~1250), legenda (rodapé ~90). Carros/objetos bem espaçados
  (slots ~330px).
- Fundo escuro `#0b0d14` com brilho radial na cor do short; kicker em pílula.
- Cor do short: use a paleta da trilha (verde `#58cc02`, azul `#1cb0f6`,
  roxo `#ce82ff`, ouro `#ffc800`, etc.).

## Timeline (30s = 900f; com narração folgada use 930f)

| Trecho | ~tempo | papel |
|--------|--------|-------|
| gancho | 0–4s | pergunta grande |
| beats + objetos animados | 4–26s | analogia acontece; objetos entram por spring |
| código | ~20–26s | snippet mono |
| dica | 26–30s | fecho em ouro |

Sincronize a narração por trecho: um `<Audio>` dentro de `<Sequence from={frame}>`
por segmento; a legenda karaokê usa `from` + `dur` (em frames) de cada trecho.

## Passo a passo

### 1. Roteiro
Escreva/edite o short em `trilha/content/shorts.js` (`window.SHORTS`) e espelhe em
`~/Desktop/DEV/remotion/src/java-shorts/shorts.ts`. Registre também em
`docs/shorts/ROTEIROS-SHORTS.md`. Campos: `id, numero, cor, titulo, gancho,
beats[], codigo, dica`.

### 2. Narração pt-BR (gTTS)
Gere um MP3 por trecho (gancho, 3 beats, dica) em
`~/Desktop/DEV/remotion/public/narracao/`. Use o script desta skill:

```bash
python3 -m pip install --user gTTS   # uma vez
python3 .claude/skills/gerar-short-java/scripts/gerar-narracao.py <numero> \
  "<gancho>" "<beat1>" "<beat2>" "<beat3>" "<dica>"
```

Meça a duração de cada MP3 (`ffprobe -v error -show_entries format=duration
-of default=nw=1:nk=1 arquivo.mp3`) e use como `dur` (em frames = segundos*30)
na timeline da legenda e nos `from` de cada `<Sequence>`.

### 3. Composição Remotion
- **Short rico** (recomendado): crie `src/java-shorts/JavaShort<Tema>.tsx`
  copiando `JavaShortMolde.tsx` e trocando a analogia/objetos. Exporte
  `DURATION`. Mantenha: `<Audio>` por trecho, componente `Legenda` (karaokê),
  `descricaoDaFase`, zonas de layout.
- Registre no `src/Root.tsx` como `<Composition id="shortNN" .../>` (id sem
  hífen), width 1080, height 1920, fps 30.
- `npm run typecheck` deve passar limpo.

### 4. Render
```bash
cd ~/Desktop/DEV/remotion
npx remotion render shortNN out/short-NN.mp4 --log=error
ffprobe -v error -show_entries stream=codec_type -of default=nw=1 out/short-NN.mp4
# deve listar video (h264) E audio (aac)
```

### 5. Encaixar no player
```bash
cp ~/Desktop/DEV/remotion/out/short-NN.mp4 trilha/videos/
```
Adicione `videoUrl: 'videos/short-NN.mp4'` ao short em `trilha/content/shorts.js`.
O player troca a caption pelo vídeo automaticamente. O `<video>` do player não
tem `muted` (a voz toca no play, que é gesto do usuário).

### 6. Verificar
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8777/videos/short-NN.mp4
```
Abra `http://127.0.0.1:8777/index.html`, clique no chip do short e no play.

## Definition of Done

- [ ] Analogia com objetos do mundo real, animados (não só texto)
- [ ] Narração pt-BR sincronizada por trecho; legenda karaokê seguindo a voz
- [ ] Descrição (frase-chave) separada da legenda, sem concorrência
- [ ] Tipografia Poppins; zonas sem sobreposição; objetos bem espaçados
- [ ] Vídeo 1080x1920 com faixas h264 + aac; `typecheck` limpo
- [ ] MP4 em `trilha/videos/`, `videoUrl` apontado, player toca com som
- [ ] Sem travessão (`—`) nos textos; versões Remotion alinhadas

## Notas

- Requer rede para o gTTS (voz) e para o Chromium do Remotion na 1ª render.
- Se quiser 30s cravados quando a narração passar um pouco, acelere a voz com
  `ffmpeg -i in.mp3 -filter:a "atempo=1.08" out.mp3`.
- Para lote: repita o passo a passo por short; a versão simples (caption)
  em `JavaShort.tsx` serve de fallback para shorts sem composição rica.
