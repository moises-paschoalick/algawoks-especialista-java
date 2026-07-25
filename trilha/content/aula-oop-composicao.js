/**
 * Aula guiada · Composição vs herança e a Lei de Demeter (módulo 15 · docs/page_01.md)
 * Esteira docs/metodologia. Analogia: café com adicionais (decorator).
 */
Aula.registrar({
  id: 'oop-composicao',
  licao: 'oop-composicao',
  titulo: 'Composição: monte com peças em vez de herdar tudo',
  personagem: { nome: 'Bean' },
  fechamento: 'Prefira compor (tem-um) a herdar (é-um), e fale só com os vizinhos diretos. Menos acoplamento, menos surpresa.',

  cenas: [

    /* 1 intro */
    {
      fala: [
        'A boas-práticas mais citada de OOP: **prefira composição a herança**.',
        'A imagem: um **café com adicionais**. Você monta com peças (leite, chocolate), não cria uma classe pra cada combinação.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div style="text-align:center">
            <div class="analogia" style="margin:0 auto 16px; max-width:420px">
              <div class="analogia-titulo">A ideia de hoje</div>
              <div class="pilha-copo">
                <div class="copo-camada base">☕ Café</div>
                <div class="copo-camada">+ leite</div>
                <div class="copo-camada">+ chocolate</div>
              </div>
            </div>
            <div class="palco-titulo">Módulo 15 · Composição e Lei de Demeter</div>
            <p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p>
          </div>`;
        api.gsap.from(host.querySelectorAll('.copo-camada'), { y: 16, opacity: 0, duration: 0.4, stagger: 0.12, ease: 'back.out(1.5)' });
      },
    },

    /* 2 problema: heranca explode */
    {
      fala: [
        'Tentando cobrir cada combinação com **herança**, as classes explodem.',
        'Adiciona sabores e veja a lista de classes crescer sem controle.',
      ],
      interativo: true, emocao: 'pensando', dica: 'Clique nos três adicionais',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: uma classe para cada combinação</div>
            <div class="analogia-cena"><div class="grande">🤯</div><div>"e agora com canela? com leite e canela?"</div></div>
          </div>
          <div class="palco-escolhas">
            <button class="chip" data-s="Leite">+ leite</button>
            <button class="chip" data-s="Chocolate">+ chocolate</button>
            <button class="chip" data-s="Canela">+ canela</button>
          </div>
          <div class="explosao" id="exp"><div class="subclasse">Cafe</div></div>
          <div class="saida" id="saida">Cada combinação nova vira uma classe nova.</div>`;
        const exp = host.querySelector('#exp'); const s = host.querySelector('#saida');
        const combos = new Set(['Cafe']); const feitos = new Set();
        host.querySelectorAll('.chip').forEach(chip => chip.onclick = () => {
          if (chip.disabled) return; chip.disabled = true; api.som('barrado');
          const novos = [...combos].map(c => c + 'Com' + chip.dataset.s);
          novos.forEach(n => combos.add(n));
          exp.innerHTML = [...combos].map(c => `<div class="subclasse">${c}</div>`).join('');
          api.gsap.from(exp.querySelectorAll('.subclasse'), { scale: 0, duration: 0.25, stagger: 0.03 });
          feitos.add(chip.dataset.s);
          s.innerHTML = `<span class="erro">${combos.size} classes só para 3 sabores. Isso dobra a cada novo adicional.</span>`;
          if (feitos.size === 3) { api.reagir('pensando'); api.pronto('Herança para reuso explode: são combinações demais para virar classes'); }
        });
      },
    },

    /* 3 solucao: compor com decorator */
    {
      fala: [
        'A composição resolve: em vez de **ser um** café com leite, o objeto **tem um** café e adiciona comportamento por cima.',
        'Monta o pedido empilhando peças.',
      ],
      interativo: true, emocao: 'feliz', dica: 'Empilhe os adicionais',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: empilhar peças no mesmo copo</div>
            <div class="analogia-cena"><div class="grande">🥤</div><div>"um café, e vou envolvendo com adicionais"</div></div>
          </div>
          <div class="pilha-copo" id="copo"><div class="copo-camada base">☕ Café (5.00)</div></div>
          <div class="copo-preco" id="preco">R$ 5.00</div>
          <div class="palco-escolhas">
            <button class="chip" data-p="1.5" data-n="leite">+ leite (1.50)</button>
            <button class="chip" data-p="2.0" data-n="chocolate">+ chocolate (2.00)</button>
          </div>
          <div id="host" style="margin-top:10px"></div>`;
        const copo = host.querySelector('#copo'); const precoEl = host.querySelector('#preco');
        let preco = 5; const feitos = new Set();
        host.querySelectorAll('.chip').forEach(chip => chip.onclick = () => {
          if (chip.disabled) return; chip.disabled = true; api.som('pop');
          preco += Number(chip.dataset.p);
          const cam = document.createElement('div'); cam.className = 'copo-camada'; cam.textContent = '+ ' + chip.dataset.n;
          copo.appendChild(cam);
          api.gsap.from(cam, { y: -18, opacity: 0, duration: 0.35, ease: 'bounce.out' });
          precoEl.textContent = 'R$ ' + preco.toFixed(2);
          api.gsap.fromTo(precoEl, { scale: 1.2 }, { scale: 1, duration: 0.3 });
          feitos.add(chip.dataset.n);
          if (feitos.size === 2) {
            host.querySelector('#host').innerHTML = api.codigo(`Bebida pedido = new ComChocolate(new ComLeite(new Cafe()));
pedido.preco();   // 8.50, cada camada soma a sua parte`);
            api.reagir('feliz'); api.pronto('Uma peça envolve a outra em runtime. Isso é o Decorator');
          }
        });
      },
    },

    /* 4 nomear: composicao x heranca */
    {
      fala: [
        'Isso é **composição**: relação **tem-um**, montada em tempo de execução. Herança é **é-um**, fixa na compilação.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">O conceito, agora com nome</div>
          ${api.codigo(`interface Bebida { double preco(); }

class ComLeite implements Bebida {
    private final Bebida base;                 // TEM-UM Bebida
    ComLeite(Bebida base) { this.base = base; }
    public double preco() { return base.preco() + 1.5; }   // envolve e estende
}`)}
          <table class="mini-tabela" style="margin-top:10px">
            <thead><tr><th></th><th>Herança</th><th>Composição</th></tr></thead>
            <tbody>
              <tr><td>relação</td><td>é-um</td><td>tem-um</td></tr>
              <tr><td>acoplamento</td><td>forte, compilação</td><td>fraco, execução</td></tr>
              <tr><td>trocar comportamento</td><td>não dá</td><td>troca o objeto interno</td></tr>
            </tbody>
          </table>`;
        api.gsap.from(host.children, { y: 18, opacity: 0, duration: 0.45, stagger: 0.15 });
      },
    },

    /* 5 quiz composicao x heranca */
    {
      fala: ['A escolha do dia a dia:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Quando usar <b>herança</b> em vez de composição?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Sempre que quiser reaproveitar código</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Quando a subclasse é genuinamente um subtipo e respeita o contrato da base (Liskov)</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Nunca: herança é sempre errada</span></button>
          </div>
          <div class="note">Herança para reuso explode e acopla. Use herança para subtipo real; use composição para reutilizar comportamento.</div>`;
        const ok = 1;
        host.querySelectorAll('.option').forEach(b => b.onclick = () => {
          const e = Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o, i) => { o.classList.add('disabled'); o.onclick = null; if (i === ok) o.classList.add('right'); else if (i === e) o.classList.add('wrong'); });
          api.registrarResposta(e === ok);
          api.pronto(e === ok ? 'Isso: herança é para subtipo real (Liskov), não para reuso' : 'É a B: herde quando é subtipo de verdade; para reusar, componha');
        });
      },
    },

    /* 6 decorator no JDK */
    {
      fala: ['Você já usa isso sem perceber: o próprio JDK é feito de decorators empilhados.'],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Composição no JDK</div>
          ${api.codigo(`BufferedReader br = new BufferedReader(
                        new InputStreamReader(
                            new FileInputStream("dados.txt")));
// cada camada envolve a anterior e agrega um comportamento`)}
          <div class="note">Buffer envolve leitor de caracteres, que envolve stream de bytes. Três peças compostas, nenhuma herança.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },

    /* 7 Demeter: train wreck */
    {
      fala: [
        'Segunda parte: a **Lei de Demeter**. Fale só com os vizinhos diretos, não atravesse a estrutura dos outros.',
        'Toca no train wreck e veja onde ele quebra.',
      ],
      interativo: true, emocao: 'alerta', dica: 'Clique na corrente de chamadas',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: não fale com estranhos</div>
            <div class="analogia-cena"><div class="grande">🚂</div><div>"atravessar 3 objetos é um trem prestes a descarrilar"</div></div>
          </div>
          <div class="linha-click feita"><pre class="code" id="wreck">String cidade = pedido.getCliente().getEndereco().getCidade().getNome();</pre></div>
          <div class="palco-escolhas"><button class="chip" id="btn">e se Endereco mudar?</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick = e => {
          e.target.disabled = true; api.som('erro');
          host.querySelector('#wreck').innerHTML = `String cidade = pedido.getCliente().getEndereco()<span class="hl">.getCidade().getNome()</span>;`;
          const s = host.querySelector('#saida'); s.style.display = 'block';
          s.innerHTML = `<span class="erro">Qualquer mudança em Cliente, Endereco ou Cidade quebra esta linha.</span>
<span class="neutro">Você acoplou seu código à estrutura interna de 3 objetos que nem são seus.</span>`;
          api.gsap.from(s, { y: 10, opacity: 0, duration: 0.3 });
          api.reagir('alerta');
          api.pronto('Train wreck: uma corrente de getters que conhece a intimidade de todo mundo');
        };
      },
    },

    /* 8 Demeter: a correcao */
    {
      fala: ['A correção: peça ao vizinho direto o resultado, não o caminho até ele.'],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Não fale com estranhos</div>
          <div class="compara">
            <div class="compara-col antes"><h4>✗ train wreck</h4>${api.codigo(`pedido.getCliente()
      .getEndereco()
      .getCidade()
      .getNome();`)}</div>
            <div class="compara-col depois"><h4>✓ pergunte ao vizinho</h4>${api.codigo(`pedido.getCidadeEntrega();
// Pedido responde por si;
// a estrutura interna some`)}</div>
          </div>
          <div class="note">O primeiro quebra se qualquer objeto da corrente mudar. O segundo só quebra a implementação de <code>Pedido</code>.</div>`;
        api.gsap.from(host.querySelectorAll('.compara-col, .note'), { y: 20, opacity: 0, duration: 0.45, stagger: 0.15, ease: 'power2.out' });
      },
    },

    /* 9 Tell Don't Ask */
    {
      fala: ['Da mesma família: **Tell, Don\'t Ask**. Não puxe o estado para decidir de fora; mande o objeto fazer.'],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Mande fazer, não pergunte para decidir</div>
          <div class="compara">
            <div class="compara-col antes"><h4>✗ ask</h4>${api.codigo(`if (conta.getSaldo() >= v) {
    conta.setSaldo(
        conta.getSaldo() - v);
}`)}</div>
            <div class="compara-col depois"><h4>✓ tell</h4>${api.codigo(`conta.sacar(v);
// o objeto protege o
// próprio invariante`)}</div>
          </div>
          <div class="note">Puxar o estado para decidir do lado de fora quebra o encapsulamento. Mande o objeto agir.</div>`;
        api.gsap.from(host.querySelectorAll('.compara-col, .note'), { y: 20, opacity: 0, duration: 0.45, stagger: 0.15, ease: 'power2.out' });
      },
    },

    /* 10 quiz Demeter */
    {
      fala: ['Testa a Lei de Demeter.'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Por que <code>a.getB().getC().getD()</code> é um problema?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>É mais lento por ter muitas chamadas</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Acopla seu código à estrutura interna de B, C e D; mudar qualquer um quebra aqui</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Getters não podem ser encadeados em Java</span></button>
          </div>`;
        const ok = 1;
        host.querySelectorAll('.option').forEach(b => b.onclick = () => {
          const e = Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o, i) => { o.classList.add('disabled'); o.onclick = null; if (i === ok) o.classList.add('right'); else if (i === e) o.classList.add('wrong'); });
          api.registrarResposta(e === ok);
          api.pronto(e === ok ? 'Isso: o acoplamento à estrutura dos outros é o problema' : 'É a B: você depende da intimidade de objetos que não são seus');
        });
      },
    },

    /* 11 checagem final */
    {
      fala: ['Fecha com o porquê da regra de ouro.'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; margin-bottom:12px">Por que "prefira composição a herança"?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Composição sempre usa menos memória</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Composição acopla menos e deixa trocar comportamento em runtime; herança para reuso explode e prende à base</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Herança não existe em Java moderno</span></button>
          </div>`;
        const ok = 1;
        host.querySelectorAll('.option').forEach(b => b.onclick = () => {
          const e = Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o, i) => { o.classList.add('disabled'); o.onclick = null; if (i === ok) o.classList.add('right'); else if (i === e) o.classList.add('wrong'); });
          api.registrarResposta(e === ok);
          api.pronto(e === ok ? 'Perfeito: menos acoplamento, mais flexibilidade' : 'É a B: composição acopla menos e troca comportamento em execução');
        });
      },
    },

    /* 12 recap */
    {
      fala: ['Unidade de OOP fechada! Seis imagens pra levar.'],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [
          ['🥤', 'Componha, não herde tudo', 'tem-um em vez de é-um'],
          ['🤯', 'Herança para reuso explode', 'uma classe por combinação não escala'],
          ['🎁', 'Decorator', 'uma peça envolve a outra em runtime'],
          ['🧬', 'Herança é para subtipo', 'só quando respeita o contrato (Liskov)'],
          ['🚂', 'Lei de Demeter', 'fale com o vizinho direto, não atravesse 3 objetos'],
          ['📣', 'Tell, Don\'t Ask', 'mande o objeto agir, não puxe o estado'],
        ];
        host.innerHTML = `<div class="palco-titulo">O que ficou</div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">
            ${cards.map(([i, t, d]) => `<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px">
              <div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div>
              <div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}
          </div>`;
        api.gsap.from(host.querySelectorAll('.recap-card'), { y: 26, opacity: 0, scale: 0.94, duration: 0.45, stagger: 0.08, ease: 'back.out(1.4)' });
      },
    },
  ],
});
