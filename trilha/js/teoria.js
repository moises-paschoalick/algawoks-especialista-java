/** Página de teoria: explicação do assunto + onde rever o vídeo do curso. */
(() => {
  const seq = Trilha.sequencia();
  const params = new URLSearchParams(location.search);
  const licao = Trilha.licao(params.get('id')) || seq[0];

  const sumario = document.getElementById('sumario');
  const artigo  = document.getElementById('artigo');

  /* ------------------------------------------------------- índice lateral */

  sumario.innerHTML = Trilha.todas().map(u => `
    <div class="toc-unit">
      <div class="toc-unit-head" style="--unit-color:${u.cor}">
        <span>${u.icone}</span>
        <span>${u.numero}. ${u.titulo}</span>
      </div>
      <ul class="toc-list">
        ${u.licoes.map(l => `
          <li class="toc-item ${l.id === licao.id ? 'active' : ''} ${Progress.concluida(l.id) ? 'done' : ''}">
            <a href="teoria.html?id=${l.id}">${l.titulo}</a>
          </li>`).join('')}
      </ul>
    </div>`).join('');

  /* -------------------------------------------------------------- artigo */

  const i = seq.findIndex(l => l.id === licao.id);
  const anterior = seq[i - 1];
  const proxima  = seq[i + 1];

  const titulos = licao.teoria.filter(b => b.h).map(b => b.h);
  const nesta = titulos.length ? `
    <nav class="nesta-pagina">
      <b>Nesta página</b>
      <ul>${titulos.map(t => `<li><a href="#${Render.slug(t)}">${Render.inline(t)}</a></li>`).join('')}</ul>
    </nav>` : '';

  const temExercicios = licao.passos && licao.passos.length > 0;

  artigo.innerHTML = `
    <div class="artigo-kicker" style="color:${licao.unidade.cor}">
      ${licao.unidade.icone} Unidade ${licao.unidade.numero} · ${licao.unidade.titulo}
      <span class="tag tag-${licao.unidade.prioridade || 'base'}">${
        { alta: 'prioridade alta', media: 'prioridade média', base: 'base' }[licao.unidade.prioridade || 'base']
      }</span>
    </div>
    <h1 class="artigo-titulo">${licao.icone || '📖'} ${Render.inline(licao.titulo)}</h1>
    ${licao.resumo ? `<p class="artigo-resumo">${Render.inline(licao.resumo)}</p>` : ''}

    ${Render.refModulo(licao.modulo)}
    ${Render.refDoc(licao)}
    ${nesta}

    <div class="teoria">${Render.corpo(licao.teoria)}</div>

    <div class="artigo-cta">
      ${licao.aula
        ? `<a class="btn btn-blue" href="aula.html?id=${licao.aula}">▶ Aula guiada com o Bean</a>` : ''}
      ${temExercicios
        ? `<a class="btn btn-primary" href="licao.html?id=${licao.id}">🎮 Praticar esta lição</a>`
        : `<span class="note" style="margin:0">Exercícios desta lição ainda não foram escritos.</span>`}
      <a class="btn btn-ghost" href="index.html">Voltar à trilha</a>
    </div>

    <nav class="artigo-nav">
      ${anterior ? `<a href="teoria.html?id=${anterior.id}"><small>← anterior</small><br>${anterior.titulo}</a>` : '<span></span>'}
      ${proxima  ? `<a class="direita" href="teoria.html?id=${proxima.id}"><small>próxima →</small><br>${proxima.titulo}</a>` : '<span></span>'}
    </nav>`;

  document.title = `${licao.titulo}: Teoria`;

  /* -------------------------------------------- realce do item em leitura */

  const alvos = [...artigo.querySelectorAll('.teoria h3')];
  const links = [...document.querySelectorAll('.nesta-pagina a')];
  if (alvos.length) {
    const obs = new IntersectionObserver(entradas => {
      entradas.filter(e => e.isIntersecting).forEach(e => {
        links.forEach(a => a.classList.toggle('lendo', a.getAttribute('href') === `#${e.target.id}`));
      });
    }, { rootMargin: '-10% 0px -75% 0px' });
    alvos.forEach(a => obs.observe(a));
  }
})();
