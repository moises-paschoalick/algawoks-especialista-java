/**
 * Aula guiada · Wrappers, boxing e o cache do Integer (módulo 7 · docs/page_06.md)
 *
 * Regra didática desta aula: TODA cena abre com uma analogia do mundo real
 * (faixa .analogia, dourada) e só depois desce para o código. O aluno vê a
 * transportadora antes da List, a cafeteria antes do cache, a caixa que não
 * chegou antes da NPE.
 */
Aula.registrar({
  id: 'wrappers',
  licao: 'fund-wrappers',
  titulo: 'Wrappers: o número embrulhado pra presente',
  personagem: { nome: 'Bean' },
  fechamento: 'Você viu a caixa antes do nome dela. Cache, boxing e NPE agora têm imagem, não só definição.',

  cenas: [

    /* ---------------------------------------------------------- 1 intro */
    {
      fala: [
        'Lembra da aula passada? Todo valor era cru: um número solto na gaveta.',
        'Hoje o Java vai **embrulhar** esse número pra presente. E esse embrulho tem duas pegadinhas que derrubam até gente experiente.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div style="text-align:center">
            <div class="analogia" style="margin:0 auto 16px; max-width:420px">
              <div class="analogia-titulo">A ideia de hoje</div>
              <div class="analogia-cena">
                <div><div class="grande">🔢</div><div>valor cru<br><code>int 42</code></div></div>
                <div class="grande" id="setaIntro">➜</div>
                <div class="presente"><div class="tampa">🎁</div><div>Integer 42</div></div>
              </div>
            </div>
            <div class="palco-titulo">Módulo 7 · Wrappers e boxing</div>
            <p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">
              12 etapas. Analogia primeiro, código depois.
            </p>
          </div>`;
        api.gsap.from(host.querySelectorAll('.analogia-cena > *'), {
          y: 24, opacity: 0, duration: 0.55, stagger: 0.18, ease: 'back.out(1.6)',
        });
        api.gsap.to(host.querySelector('#setaIntro'), {
          x: 8, duration: 0.7, repeat: -1, yoyo: true, ease: 'sine.inOut',
        });
      },
    },

    /* ----------------------------------------- 2 a transportadora (List) */
    {
      fala: [
        'Primeiro, o mundo real: uma **transportadora**. Ela não aceita item solto, **só caixa fechada**.',
        'Tenta despachar a caneca solta. Depois a caneca embalada.',
      ],
      interativo: true,
      dica: 'Clique na caneca solta e depois na embalada',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: a transportadora</div>
            <div class="analogia-cena">
              <div class="bandeja" style="max-width:230px">
                <div class="item" id="solta" style="font-size:1.2rem">☕<br><small>caneca solta</small></div>
                <div class="item" id="embalada" style="font-size:1.2rem">📦<br><small>caneca embalada</small></div>
              </div>
              <div class="caixa" id="caminhao" style="min-height:96px; max-width:200px">
                <div class="caixa-etiqueta">🚚 transportadora</div>
              </div>
            </div>
          </div>
          <div id="fase2" style="display:none">
            <div class="palco-titulo">No Java é igual: List só carrega objeto</div>
            <div class="saida"><span class="erro">List&lt;int&gt; numeros;        // ERRO: unexpected type</span>
<span class="ok">List&lt;Integer&gt; numeros;    // OK: Integer é objeto, cabe no caminhão</span></div>
          </div>
          <div class="saida" id="saida">A transportadora está esperando...</div>`;

        const saida = host.querySelector('#saida');
        const caminhao = host.querySelector('#caminhao');
        let embalou = false, tentouSolta = false;

        host.querySelector('#solta').onclick = e => {
          if (e.currentTarget.classList.contains('usado')) return;
          tentouSolta = true;
          e.currentTarget.classList.add('rejeitado');
          api.som('barrado');
          api.reagir('alerta');
          api.gsap.fromTo(e.currentTarget, { x: 0 },
            { x: 22, duration: 0.1, yoyo: true, repeat: 3,
              onComplete: () => api.gsap.to(e.currentTarget, { x: 0, duration: 0.2 }) });
          saida.innerHTML = `<span class="erro">Recusada! Item solto não embarca: precisa estar numa caixa.</span>`;
        };

        host.querySelector('#embalada').onclick = e => {
          if (embalou) return;
          embalou = true;
          e.currentTarget.classList.add('usado');
          const copia = document.createElement('div');
          copia.className = 'item dentro';
          copia.textContent = '📦';
          caminhao.appendChild(copia);
          api.som('pop');
          api.gsap.from(copia, { y: -70, opacity: 0, duration: 0.45, ease: 'bounce.out' });
          saida.innerHTML = `<span class="ok">Embarcou! Caixa fechada viaja sem problema.</span>`;

          const fase2 = host.querySelector('#fase2');
          fase2.style.display = 'block';
          api.gsap.from(fase2, { y: 16, opacity: 0, duration: 0.45, delay: 0.3 });
          api.pronto(tentouSolta
            ? 'List, Map e generics são a transportadora: só aceitam objetos'
            : 'Volta e tenta a caneca solta também, só pra sentir a recusa');
        };
      },
    },

    /* ------------------------------------ 3 bancada e estante (memória) */
    {
      fala: [
        'Segunda analogia: a **bancada** e a **estante do depósito**.',
        'O que está na bancada você pega na hora. O que está na estante precisa de uma **ficha** com a posição.',
        'Alterna entre `int` e `Integer` e repara onde cada um mora.',
      ],
      interativo: true,
      dica: 'Toque nos dois chips',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: bancada × estante</div>
            <div class="analogia-cena">
              <div><div class="grande">🔧</div><div>na mão: acesso direto</div></div>
              <div><div class="grande">🗂️</div><div>na estante: via ficha</div></div>
            </div>
          </div>
          <div class="memoria">
            <div class="mem-col"><h5>Stack · a bancada</h5><div id="stackBox"><div class="mem-vazio">...</div></div></div>
            <div class="mem-col heap"><h5>Heap · a estante</h5><div id="heapBox"><div class="mem-vazio">...</div></div></div>
          </div>
          <div class="palco-escolhas">
            <button class="chip" data-t="int">int idade = 30</button>
            <button class="chip" data-t="Integer">Integer idade = 30</button>
          </div>
          <div class="saida" id="saida">Escolha uma das duas declarações</div>`;

        const stackBox = host.querySelector('#stackBox');
        const heapBox = host.querySelector('#heapBox');
        const saida = host.querySelector('#saida');
        const vistos = new Set();

        host.querySelectorAll('.chip').forEach(chip => {
          chip.onclick = () => {
            host.querySelectorAll('.chip').forEach(c => c.classList.remove('ativo'));
            chip.classList.add('ativo');
            api.som('clique');

            if (chip.dataset.t === 'int') {
              stackBox.innerHTML = `<div class="mem-item">idade = 30</div>`;
              heapBox.innerHTML = `<div class="mem-vazio">nada aqui</div>`;
              saida.innerHTML = `<span class="ok">int:</span> o valor 30 fica direto na bancada. Zero custo extra.`;
            } else {
              stackBox.innerHTML = `<div class="mem-item ref">idade ➜ ficha #7a2f</div>`;
              heapBox.innerHTML = `<div class="mem-item caixa-mini">🎁 Integer(30)</div>`;
              saida.innerHTML = `<span class="neutro">Integer:</span> a caixa vai pra estante (heap) e na bancada sobra só a <b>referência</b>. Duas paradas pra chegar no 30.`;
            }
            api.gsap.from([stackBox.children[0], heapBox.children[0]], {
              scale: 0.7, opacity: 0, duration: 0.35, stagger: 0.1, ease: 'back.out(2)',
            });

            vistos.add(chip.dataset.t);
            if (vistos.size === 2) api.pronto('Wrapper custa uma caixa na estante. Primitivo segue sendo o padrão');
          };
        });
      },
    },

    /* --------------------------------- 4 a máquina de embrulho (boxing) */
    {
      fala: [
        'E quem embrulha a caixa? **Você não.** O compilador tem uma máquina de embrulho automática.',
        'Toca nas duas linhas pra revelar o código que ele escreve escondido.',
      ],
      interativo: true,
      emocao: 'pensando',
      dica: 'Toque nas duas linhas de código',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: a máquina de embrulho</div>
            <div class="analogia-cena">
              <div class="grande">🔢</div>
              <div class="grande">➜ 🎀 ➜</div>
              <div class="grande">🎁</div>
            </div>
          </div>
          <div class="palco-titulo">O que você escreve × o que o compilador entrega</div>
          <div class="linha-click" data-i="0">
            <pre class="code">Integer objeto = 10;</pre>
            <div class="aviso">toque para revelar</div>
          </div>
          <div class="linha-click" data-i="1">
            <pre class="code">int primitivo = objeto;</pre>
            <div class="aviso">toque para revelar</div>
          </div>`;

        const revelacoes = [
          {
            html: 'Integer objeto = <span class="hl">Integer.valueOf(</span>10<span class="hl">)</span>;',
            aviso: 'autoboxing: a máquina embrulhou pra você',
          },
          {
            html: 'int primitivo = objeto<span class="hl">.intValue()</span>;',
            aviso: 'unboxing: a máquina abriu a caixa pra você',
          },
        ];
        let feitas = 0;

        host.querySelectorAll('.linha-click').forEach(linha => {
          linha.onclick = () => {
            if (linha.classList.contains('feita')) return;
            linha.classList.add('feita');
            const r = revelacoes[Number(linha.dataset.i)];
            linha.querySelector('pre').innerHTML = r.html;
            linha.querySelector('.aviso').textContent = '✓ ' + r.aviso;
            api.som('revelar');
            api.gsap.from(linha.querySelector('pre'), { scale: 0.97, opacity: 0.4, duration: 0.35 });

            if (++feitas === 2) {
              api.reagir('feliz');
              api.pronto('Guarda essas duas chamadas: elas explicam TUDO que vem agora');
            }
          };
        });
      },
    },

    /* ------------------------------------------- 5 a cafeteria (cache ok) */
    {
      fala: [
        'Agora a parte que cai em toda entrevista. Pensa numa **cafeteria** que deixa prontos os pedidos mais comuns, na prateleira.',
        'Pede duas caixas com o número **127** e repara de onde elas saem.',
      ],
      interativo: true,
      dica: 'Clique duas vezes em "pedir 127"',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: a prateleira dos pedidos prontos</div>
            <div class="analogia-cena"><div class="grande">☕</div><div>"um expresso? já está pronto, é só pegar"</div></div>
          </div>
          <div class="prateleira">
            <div class="prateleira-rotulo">prateleira da JVM</div>
            <div class="slot">-128</div>
            <div class="slot vago">...</div>
            <div class="slot">125</div>
            <div class="slot">126</div>
            <div class="slot" id="slot127">127</div>
          </div>
          <div class="palco-escolhas">
            <button class="chip" id="btnPedir">pedir Integer de 127</button>
          </div>
          <div class="pedidos" id="pedidos"></div>
          <div class="saida" id="saida">Integer a = 127;<br>Integer b = 127;</div>`;

        const slot = host.querySelector('#slot127');
        const pedidos = host.querySelector('#pedidos');
        const saida = host.querySelector('#saida');
        const vars = ['a', 'b'];
        let n = 0;

        host.querySelector('#btnPedir').onclick = e => {
          if (n >= 2) return;
          const v = vars[n++];
          slot.classList.add('acesa');
          api.som('pop');
          api.gsap.fromTo(slot, { scale: 1.3, rotate: -4 },
            { scale: 1, rotate: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' });

          const p = document.createElement('div');
          p.className = 'pedido';
          p.innerHTML = n === 1
            ? `<b>${v}</b> ➜ caixa da prateleira, posição 127`
            : `<b>${v}</b> ➜ a <b>MESMA</b> caixa da prateleira`;
          pedidos.appendChild(p);
          api.gsap.from(p, { x: -16, opacity: 0, duration: 0.3 });

          if (n === 2) {
            e.target.disabled = true;
            saida.innerHTML = `Integer a = 127;<br>Integer b = 127;<br><span class="ok">a == b   // true: apontam pra mesma caixa</span>`;
            api.reagir('feliz');
            api.pronto('Ninguém fabricou nada: as duas variáveis pegaram a caixa pronta');
          }
        };
      },
    },

    /* -------------------------------------------- 6 a fábrica (cache off) */
    {
      fala: [
        'Beleza. Agora pede o **128**, duas vezes. Só que o 128 **não está na prateleira**...',
      ],
      interativo: true,
      emocao: 'pensando',
      dica: 'Clique duas vezes em "pedir 128"',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: pedido fora do cardápio pronto</div>
            <div class="analogia-cena"><div class="grande">🏭</div><div>"esse a gente fabrica na hora, um por pedido"</div></div>
          </div>
          <div class="prateleira" style="opacity:.55">
            <div class="prateleira-rotulo">prateleira da JVM (vai até 127)</div>
            <div class="slot">126</div>
            <div class="slot">127</div>
            <div class="slot vago">128?</div>
          </div>
          <div class="palco-escolhas">
            <button class="chip" id="btnPedir">pedir Integer de 128</button>
          </div>
          <div class="prateleira" id="fabrica" style="background:none; border-color:var(--blue)">
            <div class="prateleira-rotulo" style="color:var(--blue)">saída da fábrica</div>
          </div>
          <div class="pedidos" id="pedidos"></div>
          <div class="saida" id="saida">Integer c = 128;<br>Integer d = 128;</div>`;

        const fabrica = host.querySelector('#fabrica');
        const pedidos = host.querySelector('#pedidos');
        const saida = host.querySelector('#saida');
        const enderecos = ['@6f2a', '@9c41'];
        const vars = ['c', 'd'];
        let n = 0;

        host.querySelector('#btnPedir').onclick = e => {
          if (n >= 2) return;
          const i = n++;
          const caixaNova = document.createElement('div');
          caixaNova.className = 'slot nova';
          caixaNova.textContent = `128 ${enderecos[i]}`;
          fabrica.appendChild(caixaNova);
          api.som(i === 0 ? 'pop' : 'erro');
          api.gsap.from(caixaNova, { y: -34, opacity: 0, duration: 0.4, ease: 'bounce.out' });

          const p = document.createElement('div');
          p.className = 'pedido diferente';
          p.innerHTML = `<b>${vars[i]}</b> ➜ caixa recém fabricada ${enderecos[i]}`;
          pedidos.appendChild(p);

          if (n === 2) {
            e.target.disabled = true;
            saida.innerHTML = `Integer c = 128;<br>Integer d = 128;<br><span class="erro">c == d   // false: são DUAS caixas diferentes!</span>`;
            api.reagir('alerta');
            api.pronto('Mesmo código do 127, resultado oposto. Isso tem nome, vem ver');
          }
        };
      },
    },

    /* -------------------------------------------------- 7 nomear: cache */
    {
      fala: [
        'O que você acabou de descobrir se chama **cache de Integer**.',
        'A JVM deixa prontas as caixas de **-128 a 127**, que são os valores mais usados. Fora dessa faixa, é caixa nova a cada autoboxing.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">O conceito, agora com nome</div>
          ${api.codigo(`Integer a = 127, b = 127;
a == b        // true:  prateleira (cache -128..127)

Integer c = 128, d = 128;
c == d        // false: fábrica (fora do cache)
c.equals(d)   // true:  compara o CONTEÚDO da caixa`)}
          <div class="note">
            Byte, Short, Long e Character (0 a 127) têm prateleiras parecidas.
            Double e Float não têm nenhuma: toda caixa deles sai da fábrica.
          </div>`;
        api.gsap.from(host.children, { y: 18, opacity: 0, duration: 0.45, stagger: 0.15 });
      },
    },

    /* ----------------------------------------------- 8 como comparar */
    {
      fala: [
        'Então como comparar duas caixas pelo **conteúdo**, com segurança? Escolhe.',
      ],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Comparando c e d (valor 128)</div>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>c == d</code></span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>c.equals(d)</code></span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span><code>c.intValue() == d.intValue()</code></span></button>
          </div>`;

        host.querySelectorAll('.option').forEach(b => {
          b.onclick = () => {
            const escolha = Number(b.dataset.i);
            const certo = escolha !== 0;
            host.querySelectorAll('.option').forEach((o, i) => {
              o.classList.add('disabled'); o.onclick = null;
              if (i === 1) o.classList.add('right');
              else if (i === escolha && !certo) o.classList.add('wrong');
              else if (i === escolha && escolha === 2) o.classList.add('right');
            });
            api.registrarResposta(certo);
            api.pronto(certo
              ? (escolha === 2
                  ? 'Funciona! Mas equals() é o jeito idiomático: guarda esse'
                  : 'Isso: equals() abre as duas caixas e compara o conteúdo')
              : 'O == compara a etiqueta da caixa (referência), não o que tem dentro');
          };
        });
      },
    },

    /* ----------------------------------------------- 9 a caixa que não veio */
    {
      fala: [
        'Falta a pegadinha mais traiçoeira: mandar a máquina abrir uma caixa que **nunca chegou**.',
        'Executa e repara em QUEM chama o método que explode.',
      ],
      interativo: true,
      emocao: 'alerta',
      dica: 'Clique em executar',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: abrir a encomenda que não foi entregue</div>
            <div class="analogia-cena"><div class="grande">📭</div><div>"abre aí"... abre o quê?</div></div>
          </div>
          <div class="linha-click feita"><pre class="code">Integer quantidade = null;   <span class="cm">// a caixa nunca chegou</span></pre></div>
          <div class="linha-click feita"><pre class="code" id="linha2">int total = quantidade + 1;</pre></div>
          <div class="palco-escolhas">
            <button class="chip" id="btnRun">▶ executar</button>
          </div>
          <div class="saida" id="saida" style="display:none"></div>`;

        host.querySelector('#btnRun').onclick = e => {
          e.target.disabled = true;

          // 1º: o compilador revela o unboxing escondido
          const linha2 = host.querySelector('#linha2');
          linha2.innerHTML = 'int total = quantidade<span class="hl">.intValue()</span> + 1;';
          api.som('revelar');
          api.gsap.from(linha2, { scale: 0.97, duration: 0.3 });

          // 2º: meio segundo depois, a explosão
          setTimeout(() => {
            api.som('erro');
            const boom = document.createElement('div');
            boom.className = 'boom';
            boom.textContent = '💥';
            host.appendChild(boom);
            api.gsap.fromTo(boom, { scale: 0, opacity: 1 },
              { scale: 2.2, opacity: 0, duration: 0.9, ease: 'power2.out', onComplete: () => boom.remove() });

            const saida = host.querySelector('#saida');
            saida.style.display = 'block';
            saida.innerHTML = `<span class="erro">Exception in thread "main" java.lang.NullPointerException:
    Cannot invoke "Integer.intValue()" because "quantidade" is null</span>
<span class="neutro">A NPE não veio de um método que VOCÊ chamou.
Veio do .intValue() que o compilador inseriu no unboxing.</span>`;
            api.gsap.from(saida, { y: 12, opacity: 0, duration: 0.35 });
            api.reagir('alerta');
            api.pronto('Wrapper que pode ser null + conta aritmética = bomba armada');
          }, 700);
        };
      },
    },

    /* -------------------------------------------- 10 caixa ou valor cru? */
    {
      fala: [
        'Pra fechar o raciocínio: **caixa ou valor cru?** Classifica os quatro casos.',
      ],
      interativo: true,
      dica: 'Responda os 4 casos',
      palco(host, api) {
        const casos = [
          { texto: 'Contador de um loop `for` que roda 1 milhão de vezes',
            certa: 'primitivo',
            veredito: 'Embrulhar 1 milhão de caixas custa caro: primitivo, sem alocação.' },
          { texto: 'Elemento de uma `List` de notas',
            certa: 'wrapper',
            veredito: 'A transportadora de novo: coleção só aceita objeto.' },
          { texto: 'Campo `desconto` que pode simplesmente não existir',
            certa: 'wrapper',
            veredito: 'Integer null diz "sem desconto". O int 0 não distingue ausente de zero.' },
          { texto: 'Cálculo de saldo dentro de um método',
            certa: 'primitivo',
            veredito: 'Variável local de cálculo: valor cru na bancada, rápido e sem risco de NPE.' },
        ];

        host.innerHTML = `
          <div class="palco-titulo">Decida como numa revisão de código</div>
          ${casos.map((c, i) => `
            <div class="class-card" data-i="${i}">
              <p>${api.inline(c.texto)}</p>
              <div class="escolhas">
                <button class="chip" data-r="primitivo">🔢 primitivo</button>
                <button class="chip" data-r="wrapper">🎁 wrapper</button>
              </div>
              <div class="veredito"></div>
            </div>`).join('')}`;

        let respondidos = 0;
        host.querySelectorAll('.class-card').forEach(card => {
          const caso = casos[Number(card.dataset.i)];
          card.querySelectorAll('.chip').forEach(chip => {
            chip.onclick = () => {
              if (card.classList.contains('certa') || card.classList.contains('errada')) return;
              const certo = chip.dataset.r === caso.certa;
              card.classList.add(certo ? 'certa' : 'errada');
              chip.classList.add('ativo');
              card.querySelector('.veredito').innerHTML =
                (certo ? '✓ ' : `✗ Era <b>${caso.certa}</b>. `) + caso.veredito;
              api.registrarResposta(certo);
              if (++respondidos === casos.length) {
                api.pronto('Regra de bolso: primitivo por padrão, wrapper quando precisa de objeto ou de ausência');
              }
            };
          });
        });
      },
    },

    /* ----------------------------------------------- 11 checagem final */
    {
      fala: [
        'Última checagem: a pergunta clássica de entrevista, agora que você viu a prateleira e a fábrica.',
      ],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; margin-bottom:12px">
            Por que <code>c == d</code> deu <b>false</b> pro 128 e <code>a == b</code> deu <b>true</b> pro 127?
          </h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>128 não cabe em <code>Integer</code>, então a comparação falha</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>O cache da JVM cobre -128 a 127. Dentro dele, o autoboxing devolve a mesma caixa; fora, fabrica uma nova, e <code>==</code> compara referências</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span><code>==</code> não funciona com números acima de 100</span></button>
          </div>`;

        const correta = 1;
        host.querySelectorAll('.option').forEach(b => {
          b.onclick = () => {
            const escolha = Number(b.dataset.i);
            host.querySelectorAll('.option').forEach((o, i) => {
              o.classList.add('disabled'); o.onclick = null;
              if (i === correta) o.classList.add('right');
              else if (i === escolha) o.classList.add('wrong');
            });
            const certo = escolha === correta;
            api.registrarResposta(certo);
            api.pronto(certo
              ? 'Perfeito. Prateleira até 127, fábrica dali pra cima'
              : 'É a B: dentro do cache, mesma caixa; fora, caixas novas');
          };
        });
      },
    },

    /* ---------------------------------------------------------- 12 recap */
    {
      fala: [
        'Fechou! Seis imagens pra levar da aula.',
      ],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [
          ['🎁', 'Wrapper embrulha o primitivo', 'objeto na heap, com referência na stack'],
          ['🎀', 'Quem embrulha é o compilador', '<code>valueOf()</code> no boxing, <code>intValue()</code> no unboxing'],
          ['☕', 'Prateleira: -128 a 127', 'dentro do cache, todo pedido devolve a mesma caixa'],
          ['🏭', 'Fora do cache, fábrica', 'caixa nova a cada autoboxing: <code>==</code> dá false'],
          ['📭', 'Caixa que não chegou', 'unboxing de <code>null</code> lança NPE'],
          ['⚖️', 'equals compara conteúdo', '<code>==</code> compara a etiqueta (referência)'],
        ];

        host.innerHTML = `
          <div class="palco-titulo">O que ficou</div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">
            ${cards.map(([i, t, d]) => `
              <div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px">
                <div style="font-size:1.4rem; margin-bottom:5px">${i}</div>
                <div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div>
                <div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div>
              </div>`).join('')}
          </div>`;

        api.gsap.from(host.querySelectorAll('.recap-card'), {
          y: 26, opacity: 0, scale: 0.94, duration: 0.45, stagger: 0.08, ease: 'back.out(1.4)',
        });
      },
    },
  ],
});
