/**
 * Motor da aula guiada: personagem narra, o palco anima, o aluno interage.
 * O conteúdo (roteiro) fica em content/aula-*.js: cada cena traz sua fala,
 * sua função de palco e o tipo de interação que libera o avanço.
 */
const Aula = (() => {

  const roteiros = {};
  const registrar = roteiro => { roteiros[roteiro.id] = roteiro; };
  const obter = id => roteiros[id] || null;

  /* --------------------------------------------------------------- boot */

  function iniciar(roteiro) {
    const shell     = document.getElementById('aula');
    const elFala    = document.getElementById('fala');
    const elPalco   = document.getElementById('palco');
    const elDica    = document.getElementById('dica');
    const btn       = document.getElementById('btnContinuar');
    const btnVoltar = document.getElementById('btnVoltar');
    const elPassos  = document.getElementById('passos');
    const personagem = document.getElementById('personagem');

    let atual = -1;
    let digitando = null;
    let liberado = false;
    let fase = 'ok';                       // 'lendo' (Bean fala) | 'agir' (interagindo) | 'ok' (pode avançar)
    let interagiu = false;                 // a cena atual já foi respondida/interagida?
    const avaliacoes = new Map();          // índice da cena -> acertou (bool). Idempotente ao refazer.

    document.getElementById('tituloAula').textContent = roteiro.titulo;
    document.getElementById('nomePersonagem').textContent = roteiro.personagem.nome;

    elPassos.innerHTML = roteiro.cenas
      .map((_, i) => `<span class="passo-dot" data-i="${i}"></span>`).join('');

    /* ------------------------------------------------------- personagem */

    // respiração contínua: o personagem nunca fica totalmente parado
    gsap.to(personagem, { y: -6, duration: 1.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to(personagem.querySelectorAll('.vapor path'), {
      y: -10, opacity: 0, duration: 2, repeat: -1, stagger: 0.5, ease: 'sine.out',
    });

    // piscada em intervalo irregular: o olhar fixo demais fica estranho
    (function piscar() {
      gsap.to(personagem.querySelectorAll('.pupila'), {
        scaleY: 0.08, transformOrigin: 'center', duration: 0.07, yoyo: true, repeat: 1,
        onComplete: () => setTimeout(piscar, 1800 + Math.random() * 3200),
      });
    })();

    // cada emoção redesenha boca e sobrancelhas: o rosto é o feedback principal
    const ROSTO = {
      normal:  { boca: 'M56 92 Q70 105 84 92',  sobEsq: 'M36 42 q10 -6 20 -1',  sobDir: 'M84 41 q10 -5 20 1',  blush: 0.32 },
      feliz:   { boca: 'M52 88 Q70 114 88 88',  sobEsq: 'M36 38 q10 -8 20 -2',  sobDir: 'M84 36 q10 -6 20 2',  blush: 0.5  },
      alerta:  { boca: 'M56 102 Q70 88 84 102', sobEsq: 'M36 38 q10 3 20 6',    sobDir: 'M84 44 q10 -6 20 -6', blush: 0.18 },
      pensando:{ boca: 'M58 96 q12 3 24 -2',    sobEsq: 'M36 44 q10 -9 20 -3',  sobDir: 'M84 40 q10 -2 20 4',  blush: 0.32 },
    };

    const boca   = personagem.querySelector('.boca');
    const sobEsq = personagem.querySelector('.sob-esq');
    const sobDir = personagem.querySelector('.sob-dir');
    const blush  = personagem.querySelectorAll('.blush');

    function reagir(emocao) {
      const rosto = ROSTO[emocao] || ROSTO.normal;
      personagem.dataset.emocao = emocao;

      gsap.to(boca,   { attr: { d: rosto.boca },   duration: 0.25, ease: 'power2.out' });
      gsap.to(sobEsq, { attr: { d: rosto.sobEsq }, duration: 0.25 });
      gsap.to(sobDir, { attr: { d: rosto.sobDir }, duration: 0.25 });
      gsap.to(blush,  { opacity: rosto.blush, duration: 0.3 });

      const tl = gsap.timeline();
      if (emocao === 'feliz') {
        tl.to(personagem, { scale: 1.14, rotate: -5, duration: 0.18, ease: 'back.out(3)' })
          .to(personagem, { scale: 1, rotate: 0, duration: 0.45, ease: 'elastic.out(1, 0.4)' });
        gsap.fromTo('.braco-esq, .braco-dir',
          { rotate: 0 }, { rotate: (i) => (i ? 22 : -22), transformOrigin: 'top center',
                           duration: 0.2, yoyo: true, repeat: 3 });
      } else if (emocao === 'alerta') {
        tl.to(personagem, { x: -7, duration: 0.06, repeat: 5, yoyo: true })
          .set(personagem, { x: 0 });
      } else {
        tl.to(personagem, { scale: 1.04, duration: 0.2, yoyo: true, repeat: 1 });
      }
    }

    /* ------------------------------------------------------------- fala */

    /**
     * Máquina de escrever. O foco (foco-narrador/foco-palco) é gerido em ir()
     * e revelar(), não aqui. Tocar no balão pula a digitação; com o balão já
     * compacto (foco-palco), tocar expande para reler a instrução inteira.
     */
    function falar(linhas, aoTerminar) {
      const texto = linhas.join('\n');
      elFala.innerHTML = '';
      elFala.classList.add('digitando');
      elFala.classList.remove('expandido');

      let i = 0;
      const alvo = document.createElement('span');
      elFala.appendChild(alvo);

      clearInterval(digitando);
      digitando = setInterval(() => {
        // escreve em blocos pequenos: rápido de ler, ainda com ritmo
        alvo.innerHTML = Render.inline(texto.slice(0, i += 2)).replace(/\n/g, '<br>');
        if (i >= texto.length) concluir();
      }, 12);

      function concluir() {
        clearInterval(digitando);
        digitando = null;
        alvo.innerHTML = Render.inline(texto).replace(/\n/g, '<br>');
        elFala.classList.remove('digitando');
        aoTerminar && aoTerminar();
      }

      elFala.onclick = () => {
        if (digitando) { concluir(); return; }
        if (shell.classList.contains('foco-palco')) elFala.classList.toggle('expandido');
      };
    }

    /* -------------------------------------------------------------- api */

    // o que cada cena recebe para controlar o próprio palco
    const api = {
      gsap,
      som: Som.tocar,
      codigo: src => `<pre class="code">${Render.realce(src)}</pre>`,
      inline: Render.inline,
      reagir,
      dica(texto) {
        elDica.innerHTML = texto ? `💡 ${Render.inline(texto)}` : '';
        elDica.classList.toggle('on', !!texto);
      },
      pronto(msg) {                       // a cena avisa que a interação acabou
        fase = 'ok';
        liberado = true;
        interagiu = true;
        setBotao(atual === roteiro.cenas.length - 1 ? 'Concluir' : 'Continuar', true);
        atualizarVoltar();
        if (msg) api.dica(msg);
        Som.tocar('pop');
        gsap.fromTo(btn, { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
      },
      registrarResposta(certo) {
        avaliacoes.set(atual, certo);     // idempotente: refazer a cena substitui, não soma
        interagiu = true;
        atualizarVoltar();
        Som.tocar(certo ? 'acerto' : 'erro');
        reagir(certo ? 'feliz' : 'alerta');
      },
      falar(linhas) { falar([].concat(linhas)); },
    };

    /* ------------------------------------------------------------ cenas */

    function setBotao(label, ligado) {
      btn.textContent = label;
      btn.disabled = !ligado;
    }

    function ir(indice) {
      atual = indice;
      interagiu = false;
      const cena = roteiro.cenas[atual];
      fase = cena.interativo ? 'lendo' : 'ok';

      [...elPassos.children].forEach((d, i) => {
        d.classList.toggle('feito', i < atual);
        d.classList.toggle('atual', i === atual);
      });

      liberado = !cena.interativo;
      setBotao('…', false);
      atualizarVoltar();
      api.dica('');
      if (atual > 0) Som.tocar('passo');
      document.querySelector('.palco-scroll').scrollTop = 0;

      // modo leitura: escurece o palco, foco total no que o Bean escreve
      shell.classList.add('foco-narrador');
      shell.classList.remove('foco-palco');

      gsap.to(elPalco, {
        opacity: 0, y: 10, duration: 0.18,
        onComplete: () => {
          elPalco.innerHTML = '';
          if (cena.palco) cena.palco(elPalco, api);
          gsap.to(elPalco, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
        },
      });

      reagir(cena.emocao || 'normal');
      falar([].concat(cena.fala), () => {
        if (cena.interativo) {
          // leu a instrução: o botão vira o "OK" que revela o conteúdo
          setBotao('✓ Entendi', true);
        } else {
          shell.classList.remove('foco-narrador');  // expositiva: mostra tudo
          setBotao(atual === roteiro.cenas.length - 1 ? 'Concluir' : 'Continuar', true);
        }
      });
    }

    // OK tocado: sai do modo leitura, revela e foca o conteúdo do palco.
    function revelar() {
      fase = 'agir';
      shell.classList.remove('foco-narrador');
      shell.classList.add('foco-palco');
      api.dica(roteiro.cenas[atual].dica || '');
      setBotao(atual === roteiro.cenas.length - 1 ? 'Concluir' : 'Continuar', false);
      Som.tocar('clique');
      gsap.fromTo('.palco', { opacity: 0.4, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
    }

    function acaoPrimaria() {
      if (btn.disabled) return;
      if (fase === 'lendo') revelar();
      else if (fase === 'ok') avancar();
    }

    // Voltar vira "Refazer" quando a cena atual é interativa e já foi respondida,
    // para o aluno tentar de novo depois de errar ou tocar errado.
    function podeRefazer() {
      return roteiro.cenas[atual] && roteiro.cenas[atual].interativo && interagiu;
    }
    function atualizarVoltar() {
      const refazer = podeRefazer();
      btnVoltar.textContent = refazer ? '↺ Refazer' : '← Voltar';
      btnVoltar.disabled = !refazer && atual <= 0;
    }
    function voltar() {
      if (podeRefazer()) {
        avaliacoes.delete(atual);   // apaga a resposta antiga; refazer conta do zero
        ir(atual);                  // redesenha a mesma cena, limpa
      } else if (atual > 0) {
        ir(atual - 1);
      }
    }

    function avancar() {
      if (fase !== 'ok') return;
      if (atual + 1 >= roteiro.cenas.length) return concluir();
      ir(atual + 1);
    }

    function concluir() {
      const licao = Trilha.licao(roteiro.licao);
      const avaliados = avaliacoes.size;
      const acertos = [...avaliacoes.values()].filter(Boolean).length;
      const xp = 40 + acertos * 10;
      Progress.concluir(roteiro.licao, { xp, acertos, total: avaliados });

      shell.classList.remove('foco-narrador', 'foco-palco');
      document.getElementById('aula').classList.add('fim');
      Som.tocar('conclusao');
      reagir('feliz');
      elPalco.innerHTML = `
        <div class="finish" style="padding:20px 0">
          <div class="finish-emoji">🎉</div>
          <h1>Aula concluída!</h1>
          <p>${roteiro.fechamento || 'Agora o conteúdo está fresco: hora de praticar.'}</p>
          <div class="finish-stats">
            <div class="finish-stat"><div class="v" style="color:var(--gold)">+${xp}</div><div class="k">XP</div></div>
            <div class="finish-stat"><div class="v" style="color:var(--green)">${acertos}/${avaliados}</div><div class="k">Acertos</div></div>
            <div class="finish-stat"><div class="v" style="color:var(--blue)">${roteiro.cenas.length}</div><div class="k">Etapas</div></div>
          </div>
          <div class="finish-actions">
            ${licao && licao.passos.length
              ? `<a class="btn btn-primary" href="licao.html?id=${roteiro.licao}">Praticar exercícios</a>` : ''}
            <a class="btn btn-blue" href="teoria.html?id=${roteiro.licao}">📖 Ver a teoria completa</a>
            <a class="btn btn-ghost" href="index.html">Voltar à trilha</a>
          </div>
        </div>`;
      gsap.from('#palco .finish > *', { y: 24, opacity: 0, duration: 0.5, stagger: 0.09, ease: 'power2.out' });
      falar(['Boa! Você chegou até o fim. Isso aqui não é decoreba: você viu o problema antes da solução, que é como isso gruda.']);
      btn.style.display = 'none';
    }

    btn.onclick = acaoPrimaria;
    btnVoltar.onclick = voltar;
    document.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); acaoPrimaria(); }
      else if (e.key === 'ArrowLeft' && !btnVoltar.disabled) { e.preventDefault(); voltar(); }
    });

    ir(0);
  }

  return { registrar, obter, iniciar };
})();
