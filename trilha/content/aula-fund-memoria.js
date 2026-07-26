/**
 * Aula guiada · Stack, Heap e Garbage Collector (módulo 9 · docs/page_06.md)
 * Esteira docs/metodologia. Analogia: a bancada (stack), o depósito (heap) e o faxineiro (GC).
 */
Aula.registrar({
  id: 'fund-memoria',
  licao: 'fund-memoria',
  titulo: 'Stack e Heap: a bancada, o depósito e o faxineiro',
  personagem: { nome: 'Bean' },
  fechamento: 'Valor na bancada, objeto no depósito, o faxineiro recolhe o que perdeu a ficha. Vazamento é ficha que nunca solta.',

  cenas: [

    /* 1 intro */
    {
      fala: [
        'Onde a memória guarda suas coisas? Em dois lugares: a **bancada** (stack) e o **depósito** (heap).',
        'E tem um **faxineiro** que recolhe o que ninguém usa mais: o Garbage Collector.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div style="text-align:center">
            <div class="analogia" style="margin:0 auto 16px; max-width:440px">
              <div class="analogia-titulo">A ideia de hoje</div>
              <div class="analogia-cena">
                <div><div class="grande">🔧</div><div>bancada<br>(stack)</div></div>
                <div><div class="grande">🏭</div><div>depósito<br>(heap)</div></div>
                <div><div class="grande">🧹</div><div>faxineiro<br>(GC)</div></div>
              </div>
            </div>
            <div class="palco-titulo">Módulo 9 · Gerenciamento de memória da JVM</div>
            <p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p>
          </div>`;
        api.gsap.from(host.querySelectorAll('.analogia-cena > div'), { y: 20, opacity: 0, duration: 0.5, stagger: 0.14, ease: 'back.out(1.5)' });
      },
    },

    /* 2 onde mora cada coisa */
    {
      fala: [
        'Regra base: o que está na **bancada** você pega direto; o objeto vai pro **depósito**.',
        'Alterna entre uma variável simples e um objeto e veja onde cada um mora.',
      ],
      interativo: true, dica: 'Toque nos dois chips',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: na mão x na estante do depósito</div>
            <div class="analogia-cena"><div class="grande">🔧🏭</div><div>"valor local na bancada; objeto criado com new no depósito"</div></div>
          </div>
          <div class="memoria">
            <div class="mem-col"><h5>Stack · bancada</h5><div id="stackBox"><div class="mem-vazio">...</div></div></div>
            <div class="mem-col heap"><h5>Heap · depósito</h5><div id="heapBox"><div class="mem-vazio">...</div></div></div>
          </div>
          <div class="palco-escolhas">
            <button class="chip" data-t="prim">int idade = 30</button>
            <button class="chip" data-t="obj">Cliente c = new Cliente()</button>
          </div>
          <div class="saida" id="saida">Escolha uma das declarações</div>`;
        const stackBox = host.querySelector('#stackBox'), heapBox = host.querySelector('#heapBox'), s = host.querySelector('#saida');
        const vistos = new Set();
        host.querySelectorAll('.chip').forEach(chip => chip.onclick = () => {
          host.querySelectorAll('.chip').forEach(c => c.classList.remove('ativo')); chip.classList.add('ativo');
          api.som('clique');
          if (chip.dataset.t === 'prim') {
            stackBox.innerHTML = `<div class="mem-item">idade = 30</div>`;
            heapBox.innerHTML = `<div class="mem-vazio">nada aqui</div>`;
            s.innerHTML = `<span class="ok">Primitivo local:</span> o valor 30 fica na bancada. Some quando o método acaba.`;
          } else {
            stackBox.innerHTML = `<div class="mem-item ref">c ➜ ficha #4b2</div>`;
            heapBox.innerHTML = `<div class="mem-item caixa-mini">🧍 Cliente</div>`;
            s.innerHTML = `<span class="neutro">Objeto:</span> o Cliente vai pro depósito (heap); na bancada fica só a <b>ficha</b> (referência).`;
          }
          api.gsap.from([stackBox.children[0], heapBox.children[0]], { scale: 0.7, opacity: 0, duration: 0.35, stagger: 0.1, ease: 'back.out(2)' });
          vistos.add(chip.dataset.t);
          if (vistos.size === 2) api.pronto('Toda variável local vive na bancada; todo new vai pro depósito');
        });
      },
    },

    /* 3 quiz onde mora */
    {
      fala: ['Fixando:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Onde fica cada coisa?</h2>
          ${api.codigo(`void processar() {
    int total = 10;
    Pedido p = new Pedido();
}`)}
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Tudo na stack</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>total</code> e a ficha <code>p</code> na stack; o objeto <code>Pedido</code> na heap</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Tudo na heap</span></button>
          </div>`;
        const ok = 1;
        host.querySelectorAll('.option').forEach(b => b.onclick = () => {
          const e = Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o, i) => { o.classList.add('disabled'); o.onclick = null; if (i === ok) o.classList.add('right'); else if (i === e) o.classList.add('wrong'); });
          api.registrarResposta(e === ok);
          api.pronto(e === ok ? 'Isso: locais na bancada, o objeto do new no depósito' : 'É a B: variáveis locais e a referência na stack; o objeto na heap');
        });
      },
    },

    /* 4 a ficha (referencia) */
    {
      fala: [
        'A **ficha** é a chave da história: ela liga a bancada ao objeto no depósito.',
        'Enquanto existir uma ficha ativa apontando o objeto, ele fica.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: a ficha do guarda-volumes</div>
            <div class="analogia-cena"><div class="grande">🎫</div><div>"a ficha aponta o volume no depósito"</div></div>
          </div>
          ${api.codigo(`Cliente c = new Cliente("Ana");
// bancada: c ➜ (ficha)
// depósito: Cliente("Ana")

Cliente outro = c;   // duas fichas, o MESMO objeto no depósito`)}
          <div class="note">Copiar a referência não copia o objeto: as duas variáveis apontam o mesmo volume.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },

    /* 5 objeto sem ficha vira lixo */
    {
      fala: [
        'E quando a **última ficha** solta o objeto? Ele vira lixo, esperando o faxineiro.',
        'Aponta a ficha para null e veja o Cliente cair no lixo.',
      ],
      interativo: true, emocao: 'pensando', dica: 'Clique em "c = null"',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: soltar a ficha do volume</div>
            <div class="analogia-cena"><div class="grande">🎫➡️🗑️</div><div>"sem ficha, ninguém acha o volume: pode recolher"</div></div>
          </div>
          <div class="memoria">
            <div class="mem-col"><h5>Stack · bancada</h5><div id="stackBox"><div class="mem-item ref" id="ficha">c ➜ ficha #4b2</div></div></div>
            <div class="mem-col heap"><h5>Heap · depósito</h5><div id="heapBox"><div class="mem-item caixa-mini" id="obj">🧍 Cliente</div></div></div>
          </div>
          <div class="pilha-lixo" id="lixo"><span class="rotulo">🗑️ elegível para o GC</span></div>
          <div class="palco-escolhas"><button class="chip" id="btn">c = null</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick = e => {
          e.target.disabled = true; api.som('barrado');
          host.querySelector('#ficha').textContent = 'c ➜ null';
          host.querySelector('#ficha').classList.remove('ref');
          const obj = host.querySelector('#obj');
          const lixo = host.querySelector('#lixo');
          api.gsap.to(obj, { opacity: 0, y: 20, duration: 0.4, onComplete: () => {
            obj.remove();
            const v = document.createElement('span'); v.className = 'livro-velho'; v.textContent = '🧍';
            lixo.appendChild(v); api.gsap.from(v, { scale: 0, duration: 0.3, ease: 'back.out(2)' });
          }});
          const s = host.querySelector('#saida'); s.style.display = 'block';
          s.innerHTML = `<span class="neutro">A ficha virou null: o Cliente ficou sem ninguém apontando.</span>
<span class="ok">Agora ele é elegível para coleta. O faxineiro recolhe quando quiser.</span>`;
          api.gsap.from(s, { y: 10, opacity: 0, duration: 0.3, delay: 0.3 });
          api.pronto('Objeto sem referência ativa é lixo esperando o GC');
        };
      },
    },

    /* 6 nomear: GC */
    {
      fala: [
        'O faxineiro tem nome: **Garbage Collector**. Ele libera automaticamente os objetos **sem nenhuma referência ativa**.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">O conceito, agora com nome</div>
          ${api.codigo(`Cliente c = new Cliente("Ana");
c = null;               // sem referência: elegível para coleta

List<Cliente> lista = new ArrayList<>();
lista.add(new Cliente("Bob"));
lista.clear();          // o Cliente perdeu a única ficha: elegível`)}
          <div class="note">Você não precisa liberar memória à mão (sem <code>free/delete</code>). Objetos que só se referenciam entre si, mas ninguém de fora alcança, também são recolhidos.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },

    /* 7 nao se controla quando */
    {
      fala: ['Detalhe importante: você **não controla** quando o GC roda. `System.gc()` é só uma sugestão que a JVM pode ignorar.'],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Você não agenda o faxineiro</div>
          ${api.codigo(`System.gc();        // apenas SUGERE uma coleta; a JVM decide

// para liberar recursos (arquivo, conexão) NÃO conte com o GC:
try (var conn = abrir()) {   // try-with-resources fecha na hora
    // ...
}`)}
          <div class="note"><code>finalize()</code> está depreciado. Recurso externo se fecha com try-with-resources, não com o Garbage Collector.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },

    /* 8 quiz elegibilidade */
    {
      fala: ['A pergunta clássica de entrevista:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Quando um objeto fica elegível para o Garbage Collector?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Assim que o método que o criou começa</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Quando não há mais nenhuma referência ativa alcançável apontando para ele</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Exatamente 60 segundos após ser criado</span></button>
          </div>`;
        const ok = 1;
        host.querySelectorAll('.option').forEach(b => b.onclick = () => {
          const e = Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o, i) => { o.classList.add('disabled'); o.onclick = null; if (i === ok) o.classList.add('right'); else if (i === e) o.classList.add('wrong'); });
          api.registrarResposta(e === ok);
          api.pronto(e === ok ? 'Isso: sem referência alcançável, vira elegível' : 'É a B: elegível quando nenhuma referência ativa o alcança');
        });
      },
    },

    /* 9 vazamento */
    {
      fala: [
        'Se o GC recolhe sozinho, dá pra ter vazamento de memória em Java? **Dá.**',
        'Uma coleção estática que só cresce nunca solta a ficha. Adiciona itens e veja o depósito lotar.',
      ],
      interativo: true, emocao: 'alerta', dica: 'Clique em "cache.add(...)" algumas vezes',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: o depósito que só recebe e nunca despacha</div>
            <div class="analogia-cena"><div class="grande">📦📦📦</div><div>"a lista static segura a ficha de todos, para sempre"</div></div>
          </div>
          ${api.codigo(`static final List<Dado> cache = new ArrayList<>();
// nada nunca é removido: cada item fica referenciado eternamente`)}
          <div class="pilha-lixo" id="dep" style="border-style:solid; border-color:var(--orange)"><span class="rotulo" style="color:var(--orange)">🏭 heap (nunca esvazia)</span></div>
          <div class="palco-escolhas"><button class="chip" id="btn">cache.add(new Dado())</button></div>
          <div class="saida" id="saida">O GC não recolhe: ainda há uma ficha (a lista static).</div>`;
        const dep = host.querySelector('#dep'); let n = 0;
        host.querySelector('#btn').onclick = () => {
          if (n >= 6) return; n++;
          api.som('barrado');
          const v = document.createElement('span'); v.className = 'livro-velho'; v.textContent = '📦';
          dep.appendChild(v); api.gsap.from(v, { y: -18, opacity: 0, duration: 0.3, ease: 'bounce.out' });
          if (n >= 6) {
            host.querySelector('#saida').innerHTML = `<span class="erro">6 objetos presos e crescendo: memória vaza mesmo com GC.</span>
<span class="neutro">Vazamento clássico: coleção estática, listeners nunca removidos, cache sem expiração.</span>`;
            api.reagir('alerta'); api.pronto('O GC só recolhe o que perdeu a ficha; a lista static nunca solta');
          }
        };
      },
    },

    /* 10 StackOverflow x OutOfMemory */
    {
      fala: [
        'Duas falhas de memória com nomes parecidos. Toca em cada uma pra ver a causa.',
      ],
      interativo: true, dica: 'Toque nos dois erros',
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Dois estouros diferentes</div>
          <div class="palco-escolhas">
            <button class="chip" data-e="so">💥 StackOverflowError</button>
            <button class="chip" data-e="oom">💥 OutOfMemoryError</button>
          </div>
          <div class="saida" id="saida">Escolha um erro</div>`;
        const s = host.querySelector('#saida'); const vistos = new Set();
        const txt = {
          so: `<span class="erro">StackOverflowError: a bancada (stack) de uma thread estourou.</span>
<span class="neutro">Causa quase sempre: recursão sem condição de parada. void loop() { loop(); }</span>`,
          oom: `<span class="erro">OutOfMemoryError: o depósito (heap) acabou.</span>
<span class="neutro">Causa: objetos demais vivos ao mesmo tempo, ou vazamento (a lista static da cena anterior).</span>`,
        };
        host.querySelectorAll('.chip').forEach(chip => chip.onclick = () => {
          host.querySelectorAll('.chip').forEach(c => c.classList.remove('ativo')); chip.classList.add('ativo');
          api.som('erro'); s.innerHTML = txt[chip.dataset.e];
          api.gsap.from(s, { opacity: 0, y: 8, duration: 0.3 });
          vistos.add(chip.dataset.e);
          if (vistos.size === 2) api.pronto('Stack estoura por recursão; heap estoura por objetos demais ou vazamento');
        });
      },
    },

    /* 11 checagem final */
    {
      fala: ['Fecha com a diferença que separa os dois estouros.'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; margin-bottom:12px">Uma recursão infinita causa qual erro?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>OutOfMemoryError</code>: enche a heap</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>StackOverflowError</code>: cada chamada empilha um quadro na stack até estourar</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Nenhum: o GC resolve</span></button>
          </div>`;
        const ok = 1;
        host.querySelectorAll('.option').forEach(b => b.onclick = () => {
          const e = Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o, i) => { o.classList.add('disabled'); o.onclick = null; if (i === ok) o.classList.add('right'); else if (i === e) o.classList.add('wrong'); });
          api.registrarResposta(e === ok);
          api.pronto(e === ok ? 'Perfeito: recursão sem parada empilha quadros até o StackOverflow' : 'É o StackOverflowError: cada chamada ocupa a stack');
        });
      },
    },

    /* 12 recap */
    {
      fala: ['Unidade de Fundamentos fechada! Seis imagens pra levar.'],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [
          ['🔧', 'Bancada = stack', 'primitivos locais e as referências, por thread'],
          ['🏭', 'Depósito = heap', 'todos os objetos criados com <code>new</code>'],
          ['🎫', 'Referência é ficha', 'liga a bancada ao objeto; copiar a ficha não copia o objeto'],
          ['🧹', 'GC = faxineiro', 'recolhe o que não tem referência ativa'],
          ['📦', 'Vazamento existe', 'coleção estática que só cresce nunca solta a ficha'],
          ['💥', 'SO x OOM', 'recursão estoura a stack; objetos demais estouram a heap'],
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
