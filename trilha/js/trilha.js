/** Renderiza o mapa da trilha (index.html). */
(() => {
  const OFFSETS = [0, 1, 2, 1, 0, -1, -2, -1];

  const el = id => document.getElementById(id);

  function atualizarHud() {
    const seq = Trilha.sequencia();
    const feitas = seq.filter(l => Progress.concluida(l.id)).length;

    el('hudXp').textContent = Progress.xpTotal();
    el('hudStreak').textContent = Progress.ofensiva();
    el('hudDone').textContent = `${feitas}/${seq.length}`;

    const pct = seq.length ? (feitas / seq.length) * 100 : 0;
    el('xpFill').style.width = `${pct}%`;
    el('xpLabel').textContent =
      `${feitas} de ${seq.length} lições concluídas · ${Progress.xpTotal()} XP acumulados`;

    const btn = el('btnLivre');
    btn.textContent = Progress.modoLivre() ? '🔓 Modo livre: ligado' : '🔒 Modo livre: desligado';
  }

  // o hub segue a mesma base dos docs: local no repo, absoluto no bundle
  el('linkHub').href = `${Curso.docBase}README.md`;

  function painelRevisao() {
    const devidas = Trilha.sequencia().filter(l => Progress.precisaRevisar(l.id));
    const host = el('revisao');

    if (devidas.length === 0) {
      host.innerHTML = '';
      return;
    }

    host.innerHTML = `
      <div class="review-panel">
        <h3>🔁 Revisar hoje: ${devidas.length} ${devidas.length === 1 ? 'lição' : 'lições'}</h3>
        ${devidas.map(l => `
          <div class="review-item">
            <span>${l.unidade.icone} ${l.titulo}</span>
            <a class="btn btn-ghost btn-sm" href="licao.html?id=${l.id}">Revisar</a>
          </div>`).join('')}
      </div>`;
  }

  function no(licao, ehAtual) {
    const soTeoria = !licao.passos || licao.passos.length === 0;
    const feita = Progress.concluida(licao.id);
    // lições que ainda só têm teoria nunca ficam bloqueadas
    const livre = soTeoria || Trilha.liberada(licao.id);
    const revisar = Progress.precisaRevisar(licao.id);

    let classe = 'locked', icone = '🔒';
    if (feita)          { classe = 'done';      icone = '★'; }
    else if (licao.aula) { classe = 'available'; icone = '▶'; }
    else if (soTeoria)  { classe = 'available'; icone = '📖'; }
    else if (livre)     { classe = 'available'; icone = licao.icone || '●'; }

    const dias = feita ? Progress.diasParaRevisar(licao.id) : null;
    const legenda = feita
      ? (revisar ? 'revisar agora' : `revisar em ${dias}d`)
      : licao.aula ? 'aula guiada'
      : soTeoria ? 'só teoria'
      : (livre ? `${licao.passos.length} passos` : 'bloqueada');

    const destino = licao.aula ? `aula.html?id=${licao.aula}`
                  : soTeoria   ? `teoria.html?id=${licao.id}`
                  : `licao.html?id=${licao.id}`;

    return `
      <div class="node-wrap">
        <button class="node ${classe} ${ehAtual && !soTeoria ? 'current' : ''}"
                data-url="${destino}" ${livre ? '' : 'disabled'}
                title="${licao.titulo}">
          ${icone}
          ${revisar ? '<span class="node-due">!</span>' : ''}
        </button>
        <div class="node-label">
          <b>${licao.titulo}</b><br>${legenda}
          ${soTeoria ? '' : `<a class="node-teoria" href="teoria.html?id=${licao.id}">📖 ler a teoria</a>`}
        </div>
      </div>`;
  }

  function renderizar() {
    const atual = Trilha.proxima();
    let n = 0;

    el('unidades').innerHTML = Trilha.todas().map(u => {
      const feitas = u.licoes.filter(l => Progress.concluida(l.id)).length;
      const completa = feitas === u.licoes.length;

      const nos = u.licoes.map(licao => {
        const off = OFFSETS[n++ % OFFSETS.length];
        return `<div class="node-row"><div class="offset-${off}">
                  ${no(licao, atual && atual.id === licao.id)}
                </div></div>`;
      }).join('');

      return `
        <section class="unit" style="--unit-color:${u.cor}">
          <div class="unit-head">
            <div class="unit-head-icon">${u.icone}</div>
            <div class="unit-head-body">
              <div class="unit-head-kicker">Unidade ${u.numero} · ${feitas}/${u.licoes.length}</div>
              <h2>${u.titulo}</h2>
              <div class="unit-head-meta">
                Módulos ${u.modulos.join(', ')} · ${u.licoes.length} lições
              </div>
            </div>
            <a class="btn btn-ghost btn-sm" href="teoria.html?id=${u.licoes[0].id}">📖 Teoria</a>
          </div>
          <div class="path">
            ${nos}
            <div class="trophy ${completa ? 'on' : ''}">${completa ? '🏆' : '🎖️'}</div>
          </div>
        </section>`;
    }).join('');

    atualizarHud();
    painelRevisao();
  }

  document.addEventListener('click', e => {
    const botao = e.target.closest('.node');
    if (botao && !botao.disabled) location.href = botao.dataset.url;
  });

  el('btnLivre').addEventListener('click', () => {
    Progress.modoLivre(!Progress.modoLivre());
    renderizar();
  });

  el('btnZerar').addEventListener('click', () => {
    if (confirm('Apagar todo o progresso (XP, ofensiva e lições concluídas)?')) {
      Progress.zerar();
      renderizar();
    }
  });

  renderizar();
})();
