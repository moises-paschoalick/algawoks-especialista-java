/**
 * Progresso da trilha: XP, ofensiva (streak), conclusão e revisão espaçada.
 * Tudo em localStorage, nada de backend.
 */
const Progress = (() => {
  const KEY = 'trilha-java-v1';
  const INTERVALOS = [1, 3, 7, 15, 30, 90]; // dias entre revisões

  const vazio = () => ({
    xp: 0,
    licoes: {},          // id -> { concluida, acertos, total, revisoes: [ts], xp }
    livre: false,        // destrava tudo
    diasAtivos: [],      // 'YYYY-MM-DD'
  });

  let state = carregar();

  function carregar() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? Object.assign(vazio(), JSON.parse(raw)) : vazio();
    } catch {
      return vazio();
    }
  }

  function salvar() {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function hoje() {
    return new Date().toISOString().slice(0, 10);
  }

  function registrarDia() {
    const d = hoje();
    if (!state.diasAtivos.includes(d)) {
      state.diasAtivos.push(d);
      state.diasAtivos.sort();
    }
  }

  /** Dias consecutivos até hoje (ou até ontem, se hoje ainda não estudou). */
  function ofensiva() {
    if (state.diasAtivos.length === 0) return 0;
    const dias = new Set(state.diasAtivos);
    const cursor = new Date();
    if (!dias.has(hoje())) cursor.setDate(cursor.getDate() - 1);

    let total = 0;
    while (dias.has(cursor.toISOString().slice(0, 10))) {
      total++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return total;
  }

  function daLicao(id) {
    return state.licoes[id] || null;
  }

  function concluida(id) {
    return !!(state.licoes[id] && state.licoes[id].concluida);
  }

  /** Registra a conclusão de uma lição e agenda a próxima revisão. */
  function concluir(id, { xp = 0, acertos = 0, total = 0 } = {}) {
    const atual = state.licoes[id] || { revisoes: [], xp: 0, acertos: 0, total: 0 };
    atual.concluida = true;
    atual.acertos = acertos;
    atual.total = total;
    atual.xp = (atual.xp || 0) + xp;
    atual.revisoes = atual.revisoes || [];
    atual.revisoes.push(Date.now());

    state.licoes[id] = atual;
    state.xp += xp;
    registrarDia();
    salvar();
  }

  /** Dias até a próxima revisão desta lição, segundo o número de repasses. */
  function intervaloAtual(id) {
    const l = state.licoes[id];
    if (!l || !l.revisoes || l.revisoes.length === 0) return null;
    const idx = Math.min(l.revisoes.length - 1, INTERVALOS.length - 1);
    return INTERVALOS[idx];
  }

  /** true quando já passou o intervalo desde a última revisão. */
  function precisaRevisar(id) {
    const l = state.licoes[id];
    if (!l || !l.concluida) return false;
    const dias = intervaloAtual(id);
    const ultima = l.revisoes[l.revisoes.length - 1];
    return (Date.now() - ultima) / 86400000 >= dias;
  }

  function diasParaRevisar(id) {
    const l = state.licoes[id];
    if (!l || !l.concluida) return null;
    const dias = intervaloAtual(id);
    const passados = (Date.now() - l.revisoes[l.revisoes.length - 1]) / 86400000;
    return Math.max(0, Math.ceil(dias - passados));
  }

  function modoLivre(valor) {
    if (valor === undefined) return state.livre;
    state.livre = valor;
    salvar();
    return state.livre;
  }

  function xpTotal()      { return state.xp; }
  function totalConcluidas() {
    return Object.values(state.licoes).filter(l => l.concluida).length;
  }

  function zerar() {
    state = vazio();
    salvar();
  }

  return {
    concluir, concluida, daLicao,
    precisaRevisar, diasParaRevisar, intervaloAtual,
    ofensiva, xpTotal, totalConcluidas,
    modoLivre, zerar,
  };
})();
