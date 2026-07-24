/**
 * Aula guiada — Primitivos e conversões (módulo 2 · docs/page_06.md)
 *
 * Arco: o tipo é uma GAVETA de tamanho fixo. Tudo decorre daí — o valor padrão,
 * o estouro, a promoção aritmética e o cast. O aluno vê a gaveta transbordar
 * antes de ouvir a palavra "overflow".
 */
Aula.registrar({
  id: 'primitivos',
  licao: 'fund-primitivos',
  titulo: 'Primitivos — a gaveta tem tamanho',
  personagem: { nome: 'Bean' },
  fechamento: 'Tipo primitivo é gaveta de tamanho fixo. Sabendo isso, promoção e cast deixam de ser decoreba.',

  cenas: [

    /* ---------------------------------------------------------- 1 intro */
    {
      fala: [
        'Oi de novo! Aqui é o **Bean**.',
        'Essa é a base de tudo em Java: os **8 tipos primitivos**. Parece básico — e é onde mais gente escorrega em entrevista.',
        'A ideia central é uma só: **um tipo é uma gaveta de tamanho fixo**.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div style="text-align:center">
            <div style="font-size:3rem">🗄️</div>
            <div style="font-family:var(--mono); font-size:1.6rem; font-weight:800; color:var(--blue); margin-top:8px">
              byte · short · int · long
            </div>
            <div style="font-family:var(--mono); font-size:1.6rem; font-weight:800; color:var(--purple)">
              float · double · boolean · char
            </div>
            <div class="palco-titulo" style="margin-top:16px">Módulo 2 · Fundamentos da linguagem</div>
            <p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">
              10 etapas. Cada uma pede uma ação sua.
            </p>
          </div>`;
        api.gsap.from(host.children[0].children, {
          y: 26, opacity: 0, duration: 0.55, stagger: 0.11, ease: 'power3.out',
        });
      },
    },

    /* ------------------------------------------------------- 2 as gavetas */
    {
      fala: [
        'Cada tipo inteiro tem um tamanho em bits — e é o tamanho que decide o quanto cabe.',
        'Toca em cada linha pra ver quanto cabe de verdade.',
      ],
      interativo: true,
      dica: 'Toque nas 4 linhas da tabela',
      palco(host, api) {
        const linhas = [
          ['byte',  '8 bits',  '-128 … 127',                    '1 casa: idade, flag numérica'],
          ['short', '16 bits', '-32.768 … 32.767',              'raro no dia a dia'],
          ['int',   '32 bits', '-2.147.483.648 … 2.147.483.647', 'o padrão para inteiro'],
          ['long',  '64 bits', '±9,2 quintilhões',              'timestamp, id de banco'],
        ];

        host.innerHTML = `
          <div class="palco-titulo">Tipos inteiros</div>
          <table class="mini-tabela">
            <thead><tr><th>Tipo</th><th>Tamanho</th><th>Faixa</th></tr></thead>
            <tbody>
              ${linhas.map((l, i) => `
                <tr data-i="${i}" style="cursor:pointer">
                  <td style="color:#82aaff">${l[0]}</td><td>${l[1]}</td><td>${l[2]}</td>
                </tr>`).join('')}
            </tbody>
          </table>
          <div class="saida" id="saida">Toque numa linha</div>`;

        const saida = host.querySelector('#saida');
        const vistos = new Set();

        host.querySelectorAll('tbody tr').forEach(tr => {
          tr.onclick = () => {
            host.querySelectorAll('tbody tr').forEach(x => x.classList.remove('acesa'));
            tr.classList.add('acesa');
            api.som('clique');

            const l = linhas[Number(tr.dataset.i)];
            saida.innerHTML = `<span class="ok">${l[0]} x = 0;</span>   <span class="neutro">// valor padrão como campo de classe</span>
<span class="neutro">${l[3]}</span>`;
            api.gsap.from(saida, { opacity: 0, x: -8, duration: 0.25 });

            vistos.add(l[0]);
            if (vistos.size === 4) api.pronto('Repara: dobrar os bits multiplica MUITO a faixa');
          };
        });
      },
    },

    /* -------------------------------------------------------- 3 o estouro */
    {
      fala: [
        'E o que acontece se o valor **não couber** na gaveta?',
        'Vamos empurrar um `byte` até o limite. Clique em somar +1 e observe.',
      ],
      interativo: true,
      emocao: 'pensando',
      dica: 'Clique em "+1" até algo estranho acontecer',
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">byte contador = 125;</div>
          <div style="text-align:center">
            <div id="valor" style="font-family:var(--mono); font-size:3.2rem; font-weight:800; color:var(--blue)">125</div>
            <div class="regua" id="regua"></div>
            <div class="palco-escolhas">
              <button class="chip" id="btnMais">contador + 1</button>
            </div>
          </div>
          <div class="saida" id="saida">byte vai de -128 até 127. Ainda cabe.</div>`;

        const elValor = host.querySelector('#valor');
        const saida = host.querySelector('#saida');
        let v = 125;

        host.querySelector('#btnMais').onclick = e => {
          v = v === 127 ? -128 : v + 1;     // o mesmo wraparound do byte real
          elValor.textContent = v;

          if (v === -128) {
            api.som('erro');
            elValor.style.color = 'var(--red)';
            api.gsap.fromTo(elValor,
              { scale: 1.5, rotate: -8 },
              { scale: 1, rotate: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' });
            saida.innerHTML = `<span class="erro">127 + 1 = -128   // OVERFLOW: deu a volta</span>
<span class="neutro">Sem exceção. Sem aviso. O bit de sinal virou e o número ficou negativo.</span>`;
            api.reagir('alerta');
            e.target.disabled = true;
            api.pronto('Estouro em Java é silencioso — por isso o tamanho importa');
          } else {
            api.som('clique');
            api.gsap.fromTo(elValor, { scale: 1.25 }, { scale: 1, duration: 0.3 });
            saida.innerHTML = v === 127
              ? `<span class="neutro">127 — chegou no limite. Clica mais uma vez.</span>`
              : `<span class="neutro">${v} — ainda cabe.</span>`;
          }
        };
      },
    },

    /* --------------------------------------------------- 4 quiz do estouro */
    {
      fala: [
        'Esse comportamento tem nome e cai em prova.',
      ],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:16px">
            O que Java faz quando um <code>int</code> estoura?
          </h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Lança <code>ArithmeticException</code></span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Promove automaticamente para <code>long</code></span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Dá a volta silenciosamente para o valor negativo mínimo</span></button>
          </div>`;

        const correta = 2;
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
              ? 'Isso — e é por isso que valor monetário nunca vai em int'
              : 'É a C: overflow em Java é silencioso, não lança nada');
          };
        });
      },
    },

    /* ------------------------------------------------------- 5 o sufixo L */
    {
      fala: [
        'Agora um detalhe que derruba gente boa: o **literal** também tem tipo.',
        'Todo número inteiro escrito no código nasce `int` — mesmo que você vá guardar num `long`.',
        'Escolhe qual das duas linhas compila.',
      ],
      interativo: true,
      dica: 'Escolha a linha que compila',
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">long populacao = 8 bilhões;</div>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>long populacao = 8000000000;</code></span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>long populacao = 8000000000L;</code></span></button>
          </div>
          <div class="saida" id="saida" style="display:none"></div>`;

        const saida = host.querySelector('#saida');
        host.querySelectorAll('.option').forEach(b => {
          b.onclick = () => {
            const escolha = Number(b.dataset.i);
            host.querySelectorAll('.option').forEach((o, i) => {
              o.classList.add('disabled'); o.onclick = null;
              if (i === 1) o.classList.add('right'); else if (i === escolha) o.classList.add('wrong');
            });
            saida.style.display = 'block';
            saida.innerHTML = `<span class="erro">long a = 8000000000;    ERRO: integer number too large</span>
<span class="ok">long b = 8000000000L;   OK — o L cria o literal já como long</span>
<span class="neutro">O compilador avalia o literal ANTES de atribuir. Sem o L, 8 bilhões
não cabe em int e nem chega a ser convertido.</span>`;
            api.gsap.from(saida, { y: 10, opacity: 0, duration: 0.3 });
            api.registrarResposta(escolha === 1);
            api.pronto('Mesma lógica no float: 1.5 é double, 1.5f é float');
          };
        });
      },
    },

    /* -------------------------------------------------- 6 promoção: o pulo */
    {
      fala: [
        'Agora a pegadinha clássica. Dois `byte` somados... viram o quê?',
        'Clica em cada operando e vê o que o compilador faz antes de somar.',
      ],
      interativo: true,
      dica: 'Clique nos dois bytes',
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">byte a = 10, b = 20;  →  byte c = a + b;</div>
          <div class="cena-linha">
            <div class="bandeja" style="max-width:300px">
              <div class="bandeja-label">Operandos</div>
              <div class="item tipo-int" data-n="a">byte a = 10</div>
              <div class="item tipo-int" data-n="b">byte b = 20</div>
            </div>
          </div>
          <div class="saida" id="saida">Clique nos dois operandos para ver a promoção</div>`;

        const saida = host.querySelector('#saida');
        let clicados = 0;

        host.querySelectorAll('.item').forEach(item => {
          item.onclick = () => {
            if (item.classList.contains('usado')) return;
            item.classList.add('usado');
            api.som('pop');

            item.textContent = item.textContent.replace('byte', 'int') + '  ⟵ promovido';
            api.gsap.fromTo(item,
              { scale: 1.1, borderColor: '#ce82ff' },
              { scale: 1, duration: 0.5, ease: 'back.out(2)' });

            if (++clicados === 2) {
              saida.innerHTML = `<span class="neutro">Toda operação aritmética com byte, short ou char
promove os operandos para int antes de calcular.</span>

<span class="erro">byte c = a + b;        ERRO: a + b é int, e int não cabe em byte</span>
<span class="ok">byte c = (byte)(a + b);  OK — cast explícito</span>
<span class="neutro">Repara: 30 CABERIA em byte. O compilador reclama do TIPO da
expressão, não do valor.</span>`;
              api.gsap.from(saida, { y: 12, opacity: 0, duration: 0.35 });
              api.reagir('pensando');
              api.pronto('O erro é sobre o tipo da expressão, não sobre o valor');
            }
          };
        });
      },
    },

    /* ----------------------------------------------- 7 widening x narrowing */
    {
      fala: [
        'Converter entre tipos tem duas direções — e só uma é automática.',
        'Toca nas setas pra ver cada uma.',
      ],
      interativo: true,
      dica: 'Toque nas duas setas',
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">byte → short → int → long → float → double</div>
          <div class="palco-escolhas">
            <button class="chip" data-d="up">⬆ subindo (widening)</button>
            <button class="chip" data-d="down">⬇ descendo (narrowing)</button>
          </div>
          <div class="saida" id="saida">Escolha uma direção</div>`;

        const saida = host.querySelector('#saida');
        const vistos = new Set();
        const textos = {
          up: `<span class="ok">int i = 100;
long l = i;        // AUTOMÁTICO — cabe folgado, nada se perde
double d = l;      // AUTOMÁTICO</span>
<span class="neutro">Gaveta menor entrando na maior: sempre seguro.</span>`,
          down: `<span class="erro">long l = 100L;
int i = l;         // NÃO COMPILA — pode não caber</span>
<span class="ok">int i = (int) l;   // cast explícito: você assume o risco
int x = (int) 3.99;  // 3 — trunca, não arredonda</span>
<span class="neutro">Gaveta maior entrando na menor: o compilador exige que você
assine embaixo com o cast.</span>`,
        };

        host.querySelectorAll('.chip').forEach(chip => {
          chip.onclick = () => {
            host.querySelectorAll('.chip').forEach(c => c.classList.remove('ativo'));
            chip.classList.add('ativo');
            api.som('clique');
            saida.innerHTML = textos[chip.dataset.d];
            api.gsap.from(saida, { opacity: 0, y: 8, duration: 0.3 });
            vistos.add(chip.dataset.d);
            if (vistos.size === 2) api.pronto('Subir é de graça. Descer custa um cast — e pode perder dado');
          };
        });
      },
    },

    /* ------------------------------------------------- 8 divisão inteira */
    {
      fala: [
        'Última armadilha, e essa aparece em bug de produção: **divisão entre inteiros**.',
        'Executa as três linhas.',
      ],
      interativo: true,
      dica: 'Clique em "executar"',
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">int total = 7, divisor = 2;</div>
          ${api.codigo(`System.out.println(total / divisor);
System.out.println(total % divisor);
System.out.println((double) total / divisor);`)}
          <div class="palco-escolhas">
            <button class="chip" id="btnRun">▶ executar</button>
          </div>
          <div class="saida" id="saida" style="display:none"></div>`;

        host.querySelector('#btnRun').onclick = e => {
          e.target.disabled = true;
          const saida = host.querySelector('#saida');
          saida.style.display = 'block';
          saida.innerHTML = '';

          const linhas = [
            ['3',   'int / int = int — o 0.5 é DESCARTADO, não arredondado'],
            ['1',   '% devolve o resto da divisão'],
            ['3.5', 'basta UM operando double para a expressão virar double'],
          ];

          linhas.forEach(([r, nota], i) => {
            setTimeout(() => {
              api.som(i === 2 ? 'acerto' : 'clique');
              const div = document.createElement('div');
              div.innerHTML = `<span class="${i === 2 ? 'ok' : 'neutro'}">${r}</span>   <span class="neutro">// ${nota}</span>`;
              saida.appendChild(div);
              api.gsap.from(div, { x: -12, opacity: 0, duration: 0.3 });
              if (i === 2) api.pronto('7/2 = 3 é a origem de metade dos bugs de cálculo');
            }, 550 * i);
          });
        };
      },
    },

    /* -------------------------------------------------------- 9 checagem */
    {
      fala: [
        'Fecha com a pergunta que o entrevistador faz pra ver se você entendeu de verdade.',
      ],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; margin-bottom:8px">Qual é a saída?</h2>
          ${api.codigo(`int a = 5;
int b = 2;
System.out.println(a / b * 2.0);`)}
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>5.0</code></span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>4.0</code></span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span><code>4</code></span></button>
          </div>
          <div class="saida" id="saida" style="display:none"></div>`;

        const correta = 1;
        host.querySelectorAll('.option').forEach(b => {
          b.onclick = () => {
            const escolha = Number(b.dataset.i);
            host.querySelectorAll('.option').forEach((o, i) => {
              o.classList.add('disabled'); o.onclick = null;
              if (i === correta) o.classList.add('right');
              else if (i === escolha) o.classList.add('wrong');
            });
            const saida = host.querySelector('#saida');
            saida.style.display = 'block';
            saida.innerHTML = `<span class="neutro">A avaliação é da esquerda para a direita:</span>
<span class="erro">a / b   →  5 / 2  →  2   </span><span class="neutro">// int / int, perde o 0.5 AQUI</span>
<span class="ok">2 * 2.0 →  4.0        </span><span class="neutro">// só agora vira double — tarde demais</span>`;
            api.registrarResposta(escolha === correta);
            api.pronto(escolha === correta
              ? 'Perfeito — o dano acontece antes do double entrar'
              : 'É 4.0: a divisão inteira já tinha jogado o 0.5 fora');
          };
        });
      },
    },

    /* ---------------------------------------------------------- 10 recap */
    {
      fala: [
        'Isso é a base. Cinco coisas pra levar.',
      ],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [
          ['🗄️', 'Tipo = gaveta fixa', '8 primitivos, cada um com seu tamanho em bits'],
          ['🔄', 'Overflow é silencioso', '<code>127 + 1</code> vira <code>-128</code>, sem exceção'],
          ['🏷️', 'Literal tem tipo', 'inteiro nasce <code>int</code>, decimal nasce <code>double</code>'],
          ['⬆️', 'Promoção aritmética', '<code>byte + byte</code> resulta <code>int</code>'],
          ['✂️', 'Narrowing pede cast', 'e <code>(int) 3.99</code> trunca para 3'],
          ['➗', '<code>7 / 2 == 3</code>', 'converta antes da divisão, não depois'],
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
