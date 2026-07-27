#!/usr/bin/env python3
"""
Gera a narração pt-BR de um short (gTTS), um MP3 por trecho, em
~/Desktop/DEV/remotion/public/narracao/. Depois imprime a duração de cada um
(em segundos e em frames a 30fps) para você sincronizar a timeline/legenda.

Uso:
  python3 gerar-narracao.py <numero> "<gancho>" "<beat1>" "<beat2>" "<beat3>" "<dica>"

Ex.:
  python3 gerar-narracao.py 3 "Quantos tipos o Java tem?" "..." "..." "..." "Use int."

Requer: pip install --user gTTS  e  ffprobe (ffmpeg) para medir a duração.
"""
import os
import subprocess
import sys

FPS = 30
DEST = os.path.expanduser("~/Desktop/DEV/remotion/public/narracao")


def dur_segundos(path: str) -> float:
    try:
        out = subprocess.check_output(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=nw=1:nk=1", path],
            text=True,
        ).strip()
        return float(out)
    except Exception:
        return 0.0


def main() -> int:
    if len(sys.argv) != 7:
        print(__doc__)
        return 1

    from gtts import gTTS  # import tardio para a mensagem de uso funcionar sem gTTS

    numero = sys.argv[1].zfill(2)
    trechos = {
        "01-gancho": sys.argv[2],
        "02-beat1": sys.argv[3],
        "03-beat2": sys.argv[4],
        "04-beat3": sys.argv[5],
        "05-dica": sys.argv[6],
    }
    os.makedirs(DEST, exist_ok=True)

    print(f"Gerando narração do short {numero} em {DEST}\n")
    for nome, txt in trechos.items():
        arq = os.path.join(DEST, f"short{numero}-{nome}.mp3")
        gTTS(txt, lang="pt", tld="com.br", slow=False).save(arq)
        s = dur_segundos(arq)
        print(f"  short{numero}-{nome}.mp3   {s:5.2f}s   ~{round(s * FPS):4d} frames")

    print("\nUse os valores acima como `dur` (frames) na legenda karaokê e para")
    print("posicionar cada <Audio> em <Sequence from={frame}> na composição.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
