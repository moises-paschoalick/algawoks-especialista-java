/**
 * Efeitos sonoros sintetizados na Web Audio API — nenhum arquivo de áudio.
 * Sem trilha de fundo: só reação a evento (acerto, erro, clique, conclusão).
 * O AudioContext só nasce no primeiro gesto do usuário (política dos navegadores).
 */
const Som = (() => {
  const KEY = 'trilha-java-som';
  let ctx = null;
  let ligado = localStorage.getItem(KEY) !== 'off';

  function contexto() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /** Uma nota: onda + envelope ADSR simplificado. */
  function nota({ freq = 440, dur = 0.15, tipo = 'sine', vol = 0.18, atraso = 0, glide = null }) {
    const ac = contexto();
    if (!ac) return;

    const osc = ac.createOscillator();
    const ganho = ac.createGain();
    const t0 = ac.currentTime + atraso;

    osc.type = tipo;
    osc.frequency.setValueAtTime(freq, t0);
    if (glide) osc.frequency.exponentialRampToValueAtTime(glide, t0 + dur);

    // ataque curto e decaimento exponencial: evita clique no corte
    ganho.gain.setValueAtTime(0.0001, t0);
    ganho.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    ganho.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(ganho).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  /** Ruído curto — usado no "barrado", que precisa soar físico. */
  function ruido({ dur = 0.12, vol = 0.12, corte = 900 }) {
    const ac = contexto();
    if (!ac) return;

    const amostras = ac.sampleRate * dur;
    const buffer = ac.createBuffer(1, amostras, ac.sampleRate);
    const dados = buffer.getChannelData(0);
    for (let i = 0; i < amostras; i++) {
      dados[i] = (Math.random() * 2 - 1) * (1 - i / amostras);   // decai sozinho
    }

    const fonte = ac.createBufferSource();
    const filtro = ac.createBiquadFilter();
    const ganho = ac.createGain();

    fonte.buffer = buffer;
    filtro.type = 'lowpass';
    filtro.frequency.value = corte;
    ganho.gain.value = vol;

    fonte.connect(filtro).connect(ganho).connect(ac.destination);
    fonte.start();
  }

  const EFEITOS = {
    clique:  () => nota({ freq: 320, dur: 0.05, tipo: 'square', vol: 0.06 }),
    pop:     () => nota({ freq: 520, glide: 880, dur: 0.09, tipo: 'sine', vol: 0.12 }),

    // acorde maior ascendente: a assinatura do acerto
    acerto:  () => {
      [523.25, 659.25, 783.99].forEach((f, i) =>
        nota({ freq: f, dur: 0.18, tipo: 'triangle', vol: 0.15, atraso: i * 0.07 }));
    },

    // dois tons descendentes, sem estridência — erro não precisa punir
    erro:    () => {
      nota({ freq: 233.08, dur: 0.16, tipo: 'sawtooth', vol: 0.1 });
      nota({ freq: 174.61, dur: 0.26, tipo: 'sawtooth', vol: 0.1, atraso: 0.12 });
    },

    barrado: () => { ruido({ dur: 0.14, vol: 0.16, corte: 700 }); nota({ freq: 130, dur: 0.12, tipo: 'square', vol: 0.09 }); },
    revelar: () => nota({ freq: 392, glide: 587.33, dur: 0.22, tipo: 'sine', vol: 0.1 }),
    passo:   () => nota({ freq: 440, dur: 0.07, tipo: 'triangle', vol: 0.08 }),

    conclusao: () => {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        nota({ freq: f, dur: 0.3, tipo: 'triangle', vol: 0.16, atraso: i * 0.11 }));
    },
  };

  function tocar(nome) {
    if (!ligado) return;
    const efeito = EFEITOS[nome];
    if (efeito) { try { efeito(); } catch { /* áudio indisponível: segue sem som */ } }
  }

  function alternar() {
    ligado = !ligado;
    localStorage.setItem(KEY, ligado ? 'on' : 'off');
    if (ligado) tocar('pop');
    return ligado;
  }

  return { tocar, alternar, ativo: () => ligado };
})();
