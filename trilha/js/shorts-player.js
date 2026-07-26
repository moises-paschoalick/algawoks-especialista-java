/**
 * Player de shorts do hub. Toca a versão animada em caption a partir de
 * window.SHORTS e "encaixa" o MP4 renderizado quando o short tiver videoUrl
 * (ex.: 'videos/short-01.mp4', gerado pelo Remotion). Ver content/shorts.js.
 */
(() => {
  const host = document.getElementById('shorts');
  if (!host || !window.SHORTS || !SHORTS.length) return;

  const DUR = 30000;                         // 30s por short
  const FASES = [0, 4000, 11000, 18000, 26000]; // gancho, beat0, beat1, beat2(+código), dica

  let atual = 0, tocando = false, t0 = 0, elapsed = 0, raf = null, fase = -1;

  host.className = 'shorts';
  host.innerHTML = `
    <div class="shorts-head">
      <h2>🎬 Java em 30 segundos</h2>
      <span class="shorts-conta" id="shConta"></span>
    </div>
    <div class="shorts-body">
      <div class="short-stage" id="shStage">
        <div class="short-canvas" id="shCanvas"></div>
        <div class="short-play">▶</div>
      </div>
      <div class="shorts-controles">
        <button id="shPrev" title="Anterior" aria-label="Anterior">◀</button>
        <button class="play-btn" id="shPlay" title="Play e pause" aria-label="Play ou pause">▶</button>
        <button id="shNext" title="Próximo" aria-label="Próximo">▶</button>
      </div>
      <div class="shorts-lista" id="shLista"></div>
    </div>`;

  const stage = host.querySelector('#shStage');
  const canvas = host.querySelector('#shCanvas');   // elemento estável; só o conteúdo muda
  const conta = host.querySelector('#shConta');
  const lista = host.querySelector('#shLista');
  const btnPlay = host.querySelector('#shPlay');

  lista.innerHTML = SHORTS.map((s, i) => `<button class="short-chip" data-i="${i}">${s.numero}</button>`).join('');

  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function montar(s) {
    stage.style.setProperty('--short-cor', s.cor);
    host.style.setProperty('--short-cor', s.cor);
    if (s.videoUrl) {                                // encaixa o MP4 renderizado
      canvas.classList.add('video');
      canvas.innerHTML = `<video id="shVideo" playsinline muted></video>`;
      const v = canvas.querySelector('#shVideo');
      v.src = s.videoUrl;
      v.onended = () => irPara(atual + 1, true);
      return;
    }
    canvas.classList.remove('video');
    canvas.innerHTML = `
      <div class="short-badge">Java em 30s · #${s.numero}</div>
      <div class="short-titulo">${esc(s.titulo)}</div>
      <div class="short-prog"><div class="short-prog-fill" id="shFill"></div></div>
      <div class="short-caption gancho" id="shCap"></div>
      <pre class="short-codigo" id="shCod">${esc(s.codigo || '')}</pre>
      <div class="short-dica" id="shDica">💡 ${esc(s.dica)}</div>`;
  }

  const faseDe = ms => { let f = 0; for (let i = 0; i < FASES.length; i++) if (ms >= FASES[i]) f = i; return f; };

  function conteudoFase(s, f) {
    if (f === 0) return { txt: s.gancho, classe: 'gancho' };
    if (f >= 1 && f <= 3) return { txt: s.beats[f - 1] || '', classe: '' };
    return { txt: '', classe: 'dica-fase' };
  }

  function render(ms) {
    const cap = canvas.querySelector('#shCap');
    if (!cap) return;                                // short de vídeo: sem caption
    const s = SHORTS[atual];
    canvas.querySelector('#shFill').style.width = `${Math.min(100, (ms / DUR) * 100)}%`;
    const f = faseDe(ms);
    if (f !== fase) {
      fase = f;
      const { txt, classe } = conteudoFase(s, f);
      cap.className = `short-caption ${classe}`;
      cap.textContent = txt;
      cap.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'ease-out' });
      canvas.querySelector('#shCod').classList.toggle('on', f >= 3 && !!s.codigo);
      canvas.querySelector('#shDica').classList.toggle('on', f >= 4);
    }
  }

  function loop() {
    elapsed = performance.now() - t0;
    if (elapsed >= DUR) { irPara(atual + 1, true); return; }
    render(elapsed);
    raf = requestAnimationFrame(loop);
  }

  function play() {
    const s = SHORTS[atual];
    tocando = true; pintar();
    if (s.videoUrl) { const v = canvas.querySelector('#shVideo'); if (v) v.play(); return; }
    t0 = performance.now() - elapsed;
    cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  }

  function pause() {
    tocando = false; pintar();
    cancelAnimationFrame(raf);
    const v = canvas.querySelector('#shVideo'); if (v) v.pause();
  }

  function pintar() {
    btnPlay.textContent = tocando ? '❚❚' : '▶';
    stage.classList.toggle('pausado', !tocando);
    conta.textContent = `${atual + 1} / ${SHORTS.length}`;
    [...lista.children].forEach((c, i) => c.classList.toggle('ativo', i === atual));
  }

  function irPara(i, autoPlay) {
    atual = (i + SHORTS.length) % SHORTS.length;
    elapsed = 0; fase = -1;
    cancelAnimationFrame(raf);
    montar(SHORTS[atual]);
    pintar();
    if (autoPlay && tocando) play(); else { pause(); render(0); }
  }

  stage.onclick = () => (tocando ? pause() : play());
  btnPlay.onclick = () => (tocando ? pause() : play());
  host.querySelector('#shPrev').onclick = () => irPara(atual - 1, true);
  host.querySelector('#shNext').onclick = () => irPara(atual + 1, true);
  lista.onclick = e => { const c = e.target.closest('.short-chip'); if (c) irPara(Number(c.dataset.i), true); };

  irPara(0, false);
})();
