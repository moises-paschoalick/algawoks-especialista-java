/** Motor da lição: teoria + passos (flashcard, quiz, completar, qa, código). */
(() => {

  /* ------------------------------- formatação (compartilhada com a teoria) */

  const { escapar, realce, inline, corpo } = Render;

  /* ------------------------------------------------------------- contexto */

  const params = new URLSearchParams(location.search);
  const licao = Trilha.licao(params.get('id'));

  if (!licao) {
    document.getElementById('stage').innerHTML =
      '<h1 class="step-title">Lição não encontrada</h1><a class="btn btn-primary" href="index.html">Voltar à trilha</a>';
    return;
  }

  const stage   = document.getElementById('stage');
  const footbar = document.getElementById('footbar');
  const fill    = document.getElementById('progressFill');

  const passos = [{ tipo: 'teoria' }, ...licao.passos];

  let atual   = 0;
  let acertos = 0;
  let avaliaveis = 0;
  let xp = 0;
  let respondido = false;

  const XP = { teoria: 5, flashcard: 5, quiz: 10, completar: 10, qa: 10, codigo: 25 };

  /* ------------------------------------------------------------ barra pé */

  function pe({ estado = '', msg = '', botao = 'Continuar', acao = avancar, extra = '' }) {
    footbar.className = `footbar ${estado}`;
    footbar.innerHTML = `
      <div class="footbar-inner">
        <div class="footbar-msg">${msg}</div>
        ${extra}
        <button class="btn ${estado === 'bad' ? 'btn-blue' : 'btn-primary'}" id="btnFoot">${botao}</button>
      </div>`;
    document.getElementById('btnFoot').onclick = acao;
  }

  function esconderPe() { footbar.className = 'footbar'; footbar.innerHTML = ''; }

  function marcar(certo, msg, detalhe = '') {
    if (!respondido) {
      respondido = true;
      avaliaveis++;
      if (certo) { acertos++; xp += XP[passos[atual].tipo] || 10; }
      Som.tocar(certo ? 'acerto' : 'erro');
    }
    pe({
      estado: certo ? 'ok' : 'bad',
      msg: `<b>${certo ? '✓ ' + msg : '✗ ' + msg}</b>${detalhe ? `<small>${detalhe}</small>` : ''}`,
    });
  }

  function avancar() {
    atual++;
    respondido = false;
    if (atual >= passos.length) return final();
    render();
  }

  /* ------------------------------------------------------------- passos */

  const kicker = {
    teoria: 'Teoria', flashcard: 'Flashcard', quiz: 'Quiz',
    completar: 'Complete o código', qa: 'Pergunta e resposta', codigo: 'Desafio de código',
  };

  function cabecalho(tipo, titulo) {
    return `<div class="step-kicker">${kicker[tipo]} · passo ${atual + 1} de ${passos.length}</div>
            <h1 class="step-title">${inline(titulo)}</h1>`;
  }

  const RENDER = {

    /* --- teoria + referência do módulo do curso ------------------------- */
    teoria() {
      stage.innerHTML = `
        ${cabecalho('teoria', licao.titulo)}
        ${Render.refModulo(licao.modulo, { compacto: true })}
        <div class="modref" style="border-left-color:var(--purple)">
          <div class="modref-icon">📖</div>
          <div class="modref-body">
            <b>Página de teoria</b>
            <a href="teoria.html?id=${licao.id}">Abrir a versão de leitura</a>
            — mesmo conteúdo, com índice e navegação entre temas.
          </div>
        </div>
        <div class="teoria">${corpo(licao.teoria)}</div>`;

      xp += XP.teoria;
      pe({ msg: 'Leu e lembrou? Então vamos praticar.', botao: 'Começar os exercícios' });
    },

    /* --- flashcard ------------------------------------------------------ */
    flashcard(p) {
      stage.innerHTML = `
        ${cabecalho('flashcard', p.frente.titulo || 'Lembra desta?')}
        <div class="flip" id="flip">
          <div class="flip-inner">
            <div class="flip-face">${corpo(p.frente.blocos)}</div>
            <div class="flip-face flip-back">${corpo(p.verso)}</div>
          </div>
        </div>
        <div class="flip-hint">Responda de cabeça antes de virar o card.</div>`;

      // altura fixa para o card não cortar conteúdo
      const flip = document.getElementById('flip');
      requestAnimationFrame(() => {
        const faces = flip.querySelectorAll('.flip-face');
        const alt = Math.max(faces[0].scrollHeight, faces[1].scrollHeight, 220);
        flip.querySelector('.flip-inner').style.minHeight = `${alt + 20}px`;
      });

      pe({
        msg: 'Formule a resposta mentalmente.',
        botao: 'Virar card',
        acao: () => {
          flip.classList.add('flipped');
          pe({
            msg: 'Você acertou o que estava no verso?',
            botao: '😀 Acertei',
            acao: () => { marcar(true, 'Boa!'); setTimeout(avancar, 250); },
            extra: `<button class="btn btn-ghost" id="btnErrei">😕 Preciso revisar</button>`,
          });
          document.getElementById('btnErrei').onclick = () => {
            marcar(false, 'Anotado — esta volta na revisão.');
            setTimeout(avancar, 250);
          };
        },
      });
    },

    /* --- quiz de múltipla escolha --------------------------------------- */
    quiz(p) {
      stage.innerHTML = `
        ${cabecalho('quiz', p.pergunta)}
        ${p.codigo ? `<pre class="code">${realce(p.codigo)}</pre>` : ''}
        ${p.sub ? `<div class="step-sub">${inline(p.sub)}</div>` : ''}
        <div class="options">
          ${p.opcoes.map((o, i) => `
            <button class="option" data-i="${i}">
              <span class="option-key">${String.fromCharCode(65 + i)}</span>
              <span>${inline(o)}</span>
            </button>`).join('')}
        </div>`;

      let escolha = null;
      const botoes = [...stage.querySelectorAll('.option')];

      botoes.forEach(b => b.onclick = () => {
        if (respondido) return;
        botoes.forEach(x => x.classList.remove('selected'));
        b.classList.add('selected');
        escolha = Number(b.dataset.i);
        pe({ msg: 'Confirme sua resposta.', botao: 'Verificar', acao: verificar });
      });

      function verificar() {
        const certo = escolha === p.correta;
        botoes.forEach((b, i) => {
          b.classList.add('disabled');
          b.classList.remove('selected');
          if (i === p.correta) b.classList.add('right');
          else if (i === escolha) b.classList.add('wrong');
        });
        marcar(certo, certo ? 'Correto!' : 'Não é essa.', p.explicacao);
      }

      pe({ msg: 'Escolha uma alternativa.', botao: 'Verificar', acao: () => {}, });
      document.getElementById('btnFoot').disabled = true;
    },

    /* --- completar a lacuna --------------------------------------------- */
    completar(p) {
      const partes = p.codigo.split('___');
      const html = partes.map((parte, i) =>
        realce(parte) + (i < partes.length - 1
          ? `<input class="gap-input" data-i="${i}" spellcheck="false" autocomplete="off">`
          : '')
      ).join('');

      stage.innerHTML = `
        ${cabecalho('completar', p.enunciado)}
        ${p.sub ? `<div class="step-sub">${inline(p.sub)}</div>` : ''}
        <pre class="code">${html}</pre>
        ${p.dica ? `<div class="note">💡 ${inline(p.dica)}</div>` : ''}`;

      const inputs = [...stage.querySelectorAll('.gap-input')];
      inputs[0] && inputs[0].focus();
      inputs.forEach(i => i.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !respondido) verificar();
      }));

      function normalizar(s) { return s.trim().replace(/\s+/g, ' ').toLowerCase(); }

      function verificar() {
        const erradas = [];
        inputs.forEach((input, i) => {
          const aceitas = p.respostas[i].map(normalizar);
          const ok = aceitas.includes(normalizar(input.value));
          input.style.borderColor = ok ? 'var(--green)' : 'var(--red)';
          if (!ok) erradas.push(p.respostas[i][0]);
        });

        const certo = erradas.length === 0;
        if (!certo) inputs.forEach((input, i) => { input.value = p.respostas[i][0]; });
        marcar(certo, certo ? 'É isso!' : 'Preenchi para você.',
               certo ? p.explicacao : `Resposta: <code>${escapar(erradas.join(', '))}</code>. ${p.explicacao || ''}`);
      }

      pe({ msg: 'Complete as lacunas.', botao: 'Verificar', acao: verificar });
    },

    /* --- pergunta e resposta com autoavaliação --------------------------- */
    qa(p) {
      stage.innerHTML = `
        ${cabecalho('qa', p.pergunta)}
        ${p.codigo ? `<pre class="code">${realce(p.codigo)}</pre>` : ''}
        <div class="step-sub">Responda como responderia numa entrevista — em voz alta ou escrevendo aqui.</div>
        <textarea class="answer" id="resposta" placeholder="Sua resposta..."></textarea>
        <div id="gabarito"></div>`;

      pe({
        msg: 'Escreveu sua versão? Compare com o gabarito.',
        botao: 'Ver resposta',
        acao: () => {
          document.getElementById('gabarito').innerHTML = `
            <div class="reveal">
              <h4>Resposta esperada</h4>
              <div class="teoria">${corpo(p.resposta)}</div>
            </div>`;
          pe({
            msg: 'Quão perto você chegou?',
            botao: '😀 Acertei',
            acao: () => { marcar(true, 'Ótimo — isso já está firme.'); setTimeout(avancar, 250); },
            extra: `<button class="btn btn-ghost" id="btnQuase">😕 Faltou coisa</button>`,
          });
          document.getElementById('btnQuase').onclick = () => {
            marcar(false, 'Sem problema — volta na revisão.');
            setTimeout(avancar, 250);
          };
        },
      });
    },

    /* --- desafio de código com Monaco ----------------------------------- */
    codigo(p) {
      stage.innerHTML = `
        ${cabecalho('codigo', p.enunciado)}
        ${p.sub ? `<div class="step-sub">${inline(p.sub)}</div>` : ''}
        <div class="editor-shell">
          <div class="editor-bar"><span class="dot"></span>${p.arquivo || 'Solucao.java'}</div>
          <div class="editor-host" id="editorHost"></div>
        </div>
        <div class="checks" id="checks">
          ${p.testes.map(t => `
            <div class="check idle"><span class="check-icon">○</span><span>${inline(t.desc)}</span></div>`).join('')}
        </div>
        <div class="note">
          A verificação é estática — analisa o que você escreveu, sem compilar Java.
          Serve para cobrar a construção certa, não para rodar o programa.
        </div>
        <div id="solucaoBox"></div>`;

      let editor = null;
      Editor.criar(document.getElementById('editorHost'), { valor: p.base, linguagem: 'java' })
            .then(e => { editor = e; });

      function verificar() {
        if (!editor) return;
        const src = editor.getValue();
        const plano = src.replace(/\s+/g, ' ');
        const linhas = [...document.querySelectorAll('#checks .check')];

        const resultados = p.testes.map(t => {
          if (t.fn)  return !!t.fn(src, plano);
          if (t.nao) return !(t.nao.test(src) || t.nao.test(plano));
          return t.re.test(src) || t.re.test(plano);
        });

        resultados.forEach((ok, i) => {
          linhas[i].className = `check ${ok ? 'pass' : 'fail'}`;
          linhas[i].querySelector('.check-icon').textContent = ok ? '✓' : '✗';
        });

        const passou = resultados.every(Boolean);
        if (!passou) {
          if (!respondido) {
            pe({
              estado: 'bad',
              msg: `<b>✗ Ainda faltam ${resultados.filter(r => !r).length} requisitos</b>
                    <small>Ajuste o código e verifique de novo.</small>`,
              botao: 'Verificar de novo',
              acao: verificar,
              extra: `<button class="btn btn-ghost" id="btnSol">Ver solução</button>`,
            });
            document.getElementById('btnSol').onclick = mostrarSolucao;
          }
          return;
        }
        marcar(true, 'Todos os requisitos atendidos!', p.explicacao);
      }

      function mostrarSolucao() {
        respondido = true;
        avaliaveis++;
        document.getElementById('solucaoBox').innerHTML = `
          <div class="reveal">
            <h4>Solução de referência</h4>
            <pre class="code">${realce(p.solucao)}</pre>
            ${p.explicacao ? `<div class="note">${inline(p.explicacao)}</div>` : ''}
          </div>`;
        document.getElementById('solucaoBox').scrollIntoView({ behavior: 'smooth', block: 'start' });
        pe({ estado: 'bad', msg: '<b>Solução revelada</b><small>Refaça de cabeça depois — esta volta na revisão.</small>' });
      }

      pe({ msg: 'Escreva o código e verifique.', botao: 'Verificar', acao: verificar });
    },
  };

  /* --------------------------------------------------------------- final */

  function final() {
    const total = avaliaveis || 1;
    const pct = Math.round((acertos / total) * 100);
    Progress.concluir(licao.id, { xp, acertos, total: avaliaveis });

    const dias = Progress.diasParaRevisar(licao.id);
    const seq = Trilha.sequencia();
    const i = seq.findIndex(l => l.id === licao.id);
    const prox = seq[i + 1];

    esconderPe();
    Som.tocar('conclusao');
    fill.style.width = '100%';

    stage.innerHTML = `
      <div class="finish">
        <div class="finish-emoji">${pct >= 80 ? '🏆' : pct >= 50 ? '💪' : '📚'}</div>
        <h1>Lição concluída!</h1>
        <p>${pct >= 80 ? 'Esse tema está afiado.' : 'Vale um segundo passe antes da entrevista.'}</p>
        <div class="finish-stats">
          <div class="finish-stat"><div class="v" style="color:var(--gold)">+${xp}</div><div class="k">XP</div></div>
          <div class="finish-stat"><div class="v" style="color:var(--green)">${acertos}/${avaliaveis}</div><div class="k">Acertos</div></div>
          <div class="finish-stat"><div class="v" style="color:var(--blue)">${dias}d</div><div class="k">Próx. revisão</div></div>
        </div>
        <div class="finish-actions">
          ${prox ? `<a class="btn btn-primary" href="licao.html?id=${prox.id}">Próxima lição →</a>` : ''}
          <a class="btn btn-ghost" href="index.html">Voltar à trilha</a>
        </div>
      </div>`;
  }

  /* ------------------------------------------------------------- ciclo */

  function render() {
    fill.style.width = `${(atual / passos.length) * 100}%`;
    window.scrollTo(0, 0);
    const p = passos[atual];
    RENDER[p.tipo](p);
  }

  document.getElementById('btnSair').onclick = () => {
    if (atual === 0 || confirm('Sair agora descarta o progresso desta lição. Continuar?')) {
      location.href = 'index.html';
    }
  };

  render();
})();
