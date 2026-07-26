# Renderizar os shorts (Remotion) e encaixar no player

Os vídeos são gerados no projeto **`~/Desktop/DEV/remotion`** e depois copiados
para `trilha/videos/`, onde o player do hub os encaixa automaticamente.

## 1. Pré-visualizar no Remotion Studio

```bash
cd ~/Desktop/DEV/remotion
npm run dev
```

No Studio aparecem as composições `short01` a `short08` (1080x1920, 30s). Edite
o texto em `src/java-shorts/shorts.ts` e veja ao vivo.

## 2. Renderizar um short

```bash
cd ~/Desktop/DEV/remotion
npx remotion render short01 out/short-01.mp4
```

O id da composição é o id do short sem o hífen (`short-01` → `short01`).

## 3. Renderizar todos de uma vez

```bash
cd ~/Desktop/DEV/remotion
for n in 01 02 03 04 05 06 07 08; do
  npx remotion render short$n out/short-$n.mp4
done
```

## 4. Encaixar no player do hub

1. Copie os MP4 para o bundle da trilha:
   ```bash
   mkdir -p ~/Desktop/DEV/AlgaWorks/algawoks-especialista-java/trilha/videos
   cp ~/Desktop/DEV/remotion/out/short-*.mp4 \
      ~/Desktop/DEV/AlgaWorks/algawoks-especialista-java/trilha/videos/
   ```
2. Aponte cada short para o seu MP4 em `trilha/content/shorts.js`, adicionando
   o campo `videoUrl`:
   ```js
   { id: 'short-01', numero: 1, ..., videoUrl: 'videos/short-01.mp4' }
   ```
   Sem `videoUrl`, o player toca a versão animada em caption (o padrão atual).

## Sincronização dos dados

O conteúdo vive em dois lugares que devem bater:
- `trilha/content/shorts.js` (player do hub, fonte principal)
- `~/Desktop/DEV/remotion/src/java-shorts/shorts.ts` (render)

Edite o roteiro em um e replique no outro. Os roteiros legíveis estão em
`docs/shorts/ROTEIROS-SHORTS.md`.

## Requisitos do render

O Remotion baixa um Chromium headless na primeira renderização e usa o ffmpeg
que ele mesmo traz. Precisa de rede na primeira vez e de alguns minutos por
lote. Formato de saída: MP4 H.264, vertical 1080x1920, ideal para Shorts,
Reels e TikTok.
