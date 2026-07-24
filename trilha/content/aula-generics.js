/**
 * Aula guiada — Generics (módulo 17 · docs/page_03.md)
 *
 * Arco pedagógico: primeiro o aluno SENTE o problema (caixa sem etiqueta que
 * explode em runtime), só depois recebe a solução. Cada conceito entra em uma
 * etapa e exige uma ação — nada avança sozinho.
 */
Aula.registrar({
  id: 'generics',
  licao: 'gen-basico',
  titulo: 'Generics — a caixa com etiqueta',
  personagem: { nome: 'Bean' },
  fechamento: 'Você não decorou sintaxe: viu o problema que Generics resolve. É assim que o conceito fica.',

  cenas: [

    /* ---------------------------------------------------------- 1 intro */
    {
      fala: [
        'Oi! Eu sou o **Bean**. Hoje a gente destrava **Generics** — e eu prometo: sem parede de texto.',
        'Vou te mostrar um problema real primeiro. A solução só faz sentido depois que dói.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div style="text-align:center">
            <div style="font-family:var(--mono); font-size:3rem; font-weight:800; color:var(--purple)">
              &lt;T&gt;
            </div>
            <div class="palco-titulo" style="margin-top:14px">Módulo 17 · Generics</div>
            <p style="color:var(--muted); max-width:420px; margin:0 auto; line-height:1.7">
              12 etapas. Cada uma pede uma ação sua.
            </p>
          </div>`;
        api.gsap.from(host.children[0].children, {
          y: 30, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
        });
      },
    },

    /* -------------------------------------------------- 2 caixa sem tipo */
    {
      fala: [
        'Antes do Java 5, uma `List` era uma **caixa sem etiqueta**. Ela aceitava qualquer coisa.',
        'Joga os três itens na caixa e vê o que acontece.',
      ],
      interativo: true,
      dica: 'Clique nos três itens da esquerda',
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Java 1.4 — sem generics</div>
          <div class="cena-linha">
            <div class="bandeja">
              <div class="bandeja-label">Itens</div>
              <div class="item tipo-string" data-v='"texto"'>"texto"</div>
              <div class="item tipo-int" data-v="42">42</div>
              <div class="item tipo-obj" data-v="new Produto()">new Produto()</div>
            </div>
            <div class="caixa" id="caixa">
              <div class="caixa-etiqueta">List</div>
            </div>
          </div>
          <div class="saida" id="saida">lista.add(...)   // aceita tudo: o parâmetro é Object</div>`;

        const caixa = host.querySelector('#caixa');
        let postos = 0;

        host.querySelectorAll('.item').forEach(item => {
          item.onclick = () => {
            if (item.classList.contains('usado')) return;
            item.classList.add('usado');

            const copia = item.cloneNode(true);
            copia.classList.remove('usado');
            copia.classList.add('dentro');
            caixa.appendChild(copia);
            api.som('pop');
            api.gsap.from(copia, { y: -90, opacity: 0, duration: 0.45, ease: 'bounce.out' });

            if (++postos === 3) {
              api.gsap.to(caixa, { borderColor: '#ff9600', duration: 0.4 });
              api.pronto('Três tipos diferentes na mesma lista — e ninguém reclamou');
            }
          };
        });
      },
    },

    /* -------------------------------------------------- 3 a hora de tirar */
    {
      fala: [
        'Guardar foi fácil. O problema aparece na **hora de tirar**.',
        'Tudo que sai de uma lista crua é `Object`. Então você é obrigado a fazer cast.',
        'Clique no botão e faz o cast pra `String`.',
      ],
      interativo: true,
      emocao: 'alerta',
      dica: 'Clique em "executar o cast"',
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Recuperando o item da posição 1</div>
          ${api.codigo(`List lista = new ArrayList();
lista.add("texto");
lista.add(42);

String s = (String) lista.get(1);   // posição 1 = o número 42`)}
          <div class="palco-escolhas">
            <button class="chip" id="btnRun">▶ executar o cast</button>
          </div>
          <div class="saida" id="saida" style="display:none"></div>`;

        host.querySelector('#btnRun').onclick = e => {
          e.target.disabled = true;
          api.som('erro');

          const boom = document.createElement('div');
          boom.className = 'boom';
          boom.textContent = '💥';
          host.appendChild(boom);
          api.gsap.fromTo(boom,
            { scale: 0, rotate: -30, opacity: 1 },
            { scale: 2.2, rotate: 10, opacity: 0, duration: 0.9, ease: 'power2.out',
              onComplete: () => boom.remove() });

          const saida = host.querySelector('#saida');
          saida.style.display = 'block';
          saida.innerHTML = `<span class="erro">Exception in thread "main" java.lang.ClassCastException:
    class java.lang.Integer cannot be cast to class java.lang.String</span>`;
          api.gsap.from(saida, { y: 12, opacity: 0, duration: 0.35 });
          api.reagir('alerta');
          api.pronto('O programa compilou — e quebrou rodando');
        };
      },
    },

    /* --------------------------------------------------- 4 o diagnóstico */
    {
      fala: [
        'Repara no detalhe que importa: esse código **compilou sem nenhum aviso**.',
        'O compilador não tinha como te ajudar — ele não sabia o que tinha dentro da caixa.',
      ],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; font-size:1.15rem; margin-bottom:18px">
            Quando o <code style="color:#ff7b72">ClassCastException</code> apareceu?
          </h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Na compilação — o javac acusou o erro</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Só em tempo de execução, quando a linha rodou</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Nunca — o cast sempre funciona</span></button>
          </div>`;

        const correta = 1;
        host.querySelectorAll('.option').forEach(b => {
          b.onclick = () => {
            const escolha = Number(b.dataset.i);
            host.querySelectorAll('.option').forEach((o, i) => {
              o.classList.add('disabled');
              o.onclick = null;
              if (i === correta) o.classList.add('right');
              else if (i === escolha) o.classList.add('wrong');
            });
            const certo = escolha === correta;
            api.registrarResposta(certo);
            api.pronto(certo
              ? 'Isso. Erro que só aparece rodando é o mais caro que existe'
              : 'É em execução — e é exatamente esse o problema');
          };
        });
      },
    },

    /* ------------------------------------------------------- 5 a etiqueta */
    {
      fala: [
        'Generics é, literalmente, **colar uma etiqueta na caixa**.',
        'Você avisa o compilador: aqui só entra `String`.',
        'Arrasta a etiqueta pra caixa — pode clicar nela.',
      ],
      interativo: true,
      emocao: 'feliz',
      dica: 'Clique na etiqueta <String>',
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Java 5+ — com generics</div>
          <div class="cena-linha">
            <div class="bandeja">
              <div class="bandeja-label">Etiqueta</div>
              <div class="item tipo-string" id="etiqueta" style="font-size:0.95rem">&lt;String&gt;</div>
            </div>
            <div class="caixa" id="caixa">
              <div class="caixa-etiqueta" id="rotulo">List</div>
            </div>
          </div>
          <div class="saida" id="saida">List lista = new ArrayList();</div>`;

        host.querySelector('#etiqueta').onclick = e => {
          const etiqueta = e.currentTarget;
          etiqueta.style.pointerEvents = 'none';

          const rotulo = host.querySelector('#rotulo');
          const caixa = host.querySelector('#caixa');
          const destino = rotulo.getBoundingClientRect();
          const origem = etiqueta.getBoundingClientRect();

          api.gsap.to(etiqueta, {
            x: destino.left - origem.left + 10,
            y: destino.top - origem.top,
            scale: 0.8, duration: 0.6, ease: 'power3.inOut',
            onComplete: () => {
              etiqueta.style.visibility = 'hidden';
              rotulo.textContent = 'List<String>';
              caixa.classList.add('tipada');
              api.som('acerto');
              api.gsap.fromTo(rotulo, { scale: 1.5 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1,0.5)' });
              host.querySelector('#saida').innerHTML =
                `<span class="ok">List&lt;String&gt; lista = new ArrayList&lt;&gt;();</span>`;
              api.reagir('feliz');
              api.pronto('Agora o compilador sabe o que tem dentro');
            },
          });
        };
      },
    },

    /* -------------------------------------------------------- 6 o porteiro */
    {
      fala: [
        'Com a etiqueta, o compilador vira **porteiro**.',
        'Tenta colocar os três itens de novo nessa caixa e vê quem entra.',
      ],
      interativo: true,
      dica: 'Clique nos três itens',
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">List&lt;String&gt; — o compilador barra na porta</div>
          <div class="cena-linha">
            <div class="bandeja">
              <div class="bandeja-label">Itens</div>
              <div class="item tipo-string" data-ok="1">"texto"</div>
              <div class="item tipo-int" data-ok="0">42</div>
              <div class="item tipo-obj" data-ok="0">new Produto()</div>
            </div>
            <div class="caixa tipada" id="caixa">
              <div class="caixa-etiqueta">List&lt;String&gt;</div>
            </div>
          </div>
          <div class="saida" id="saida">lista.add(...)</div>`;

        const caixa = host.querySelector('#caixa');
        const saida = host.querySelector('#saida');
        let tentativas = 0;

        host.querySelectorAll('.item').forEach(item => {
          item.onclick = () => {
            if (item.classList.contains('usado')) return;
            item.classList.add('usado');
            tentativas++;

            if (item.dataset.ok === '1') {
              const copia = item.cloneNode(true);
              copia.classList.remove('usado');
              caixa.appendChild(copia);
              api.gsap.from(copia, { y: -80, opacity: 0, duration: 0.4, ease: 'bounce.out' });
              api.som('pop');
              saida.innerHTML = `<span class="ok">lista.add("texto");   // OK</span>`;
            } else {
              item.classList.add('rejeitado');
              api.som('barrado');
              api.gsap.fromTo(item,
                { x: 0 },
                { x: 26, duration: 0.12, yoyo: true, repeat: 3, ease: 'power1.inOut',
                  onComplete: () => api.gsap.to(item, { x: 0, duration: 0.2 }) });
              saida.innerHTML = `<span class="erro">lista.add(${item.textContent.trim()});
    ERRO DE COMPILAÇÃO: incompatible types — o javac barrou antes de rodar</span>`;
              api.reagir('alerta');
            }

            if (tentativas === 3) {
              api.pronto('O erro saiu do runtime e voltou pra compilação');
            }
          };
        });
      },
    },

    /* ---------------------------------------------------- 7 saída sem cast */
    {
      fala: [
        'E tem o segundo ganho, que muita gente esquece: **na saída não precisa de cast**.',
        'O compilador já sabe o tipo, então ele devolve `String` direto.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">O mesmo código, antes e depois</div>
          <div class="compara">
            <div class="compara-col antes">
              <h4>✗ sem generics</h4>
              ${api.codigo(`List lista = new ArrayList();
lista.add("texto");

Object o = lista.get(0);
String s = (String) o;      // cast obrigatório
                            // e risco de explodir`)}
            </div>
            <div class="compara-col depois">
              <h4>✓ com generics</h4>
              ${api.codigo(`List<String> lista = new ArrayList<>();
lista.add("texto");

String s = lista.get(0);    // sem cast
                            // e sem risco
for (String x : lista) { }  // for-each direto`)}
            </div>
          </div>`;
        api.gsap.from(host.querySelectorAll('.compara-col'), {
          y: 26, opacity: 0, duration: 0.5, stagger: 0.2, ease: 'power2.out',
        });
      },
    },

    /* ------------------------------------------------------------- 8 o T */
    {
      fala: [
        'Agora o pulo do gato: você pode criar **suas próprias** classes com etiqueta.',
        'O `T` é um parâmetro — só que de **tipo**, não de valor. É um espaço em branco.',
        'Escolhe um tipo embaixo e olha o `T` sumindo.',
      ],
      interativo: true,
      dica: 'Escolha um tipo para preencher o T',
      palco(host, api) {
        const molde = tipo => `public class Caixa<${tipo}> {

    private ${tipo} conteudo;

    public void guardar(${tipo} item) {
        this.conteudo = item;
    }

    public ${tipo} abrir() {
        return conteudo;
    }
}`;

        host.innerHTML = `
          <div class="palco-titulo">Classe genérica — o T é preenchido no uso</div>
          <div id="codigoHost">${api.codigo(molde('T'))}</div>
          <div class="palco-escolhas">
            <button class="chip ativo" data-t="T">T (declaração)</button>
            <button class="chip" data-t="String">String</button>
            <button class="chip" data-t="Integer">Integer</button>
            <button class="chip" data-t="Produto">Produto</button>
          </div>
          <div class="saida" id="uso">Caixa&lt;T&gt; — ainda é um molde, nada foi decidido</div>`;

        const codigoHost = host.querySelector('#codigoHost');
        const uso = host.querySelector('#uso');
        const escolhidos = new Set();

        host.querySelectorAll('.chip').forEach(chip => {
          chip.onclick = () => {
            host.querySelectorAll('.chip').forEach(c => c.classList.remove('ativo'));
            chip.classList.add('ativo');
            api.som('clique');

            const t = chip.dataset.t;
            codigoHost.innerHTML = api.codigo(molde(t));
            api.gsap.from(codigoHost, { opacity: 0, y: 8, duration: 0.3 });

            uso.innerHTML = t === 'T'
              ? 'Caixa&lt;T&gt; — ainda é um molde, nada foi decidido'
              : `<span class="ok">Caixa&lt;${t}&gt; caixa = new Caixa&lt;&gt;();
caixa.guardar(${t === 'String' ? '"oi"' : t === 'Integer' ? '42' : 'new Produto()'});
${t} valor = caixa.abrir();   // sem cast</span>`;

            escolhidos.add(t);
            if (escolhidos.size >= 3) api.pronto('Uma classe só, servindo qualquer tipo — com segurança');
          };
        });
      },
    },

    /* --------------------------------------------------------- 9 bounded */
    {
      fala: [
        'E se eu quiser aceitar **só números**? Aí entra o `extends`.',
        '`<T extends Number>` transforma a etiqueta num filtro.',
        'Testa os quatro tipos no portão.',
      ],
      interativo: true,
      dica: 'Clique em cada tipo para testar o portão',
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">class Calculadora&lt;T extends Number&gt;</div>
          <div class="cena-linha">
            <div class="bandeja">
              <div class="bandeja-label">Tipos</div>
              <div class="item tipo-int" data-ok="1">Integer</div>
              <div class="item tipo-int" data-ok="1">Double</div>
              <div class="item tipo-string" data-ok="0">String</div>
              <div class="item tipo-obj" data-ok="0">Produto</div>
            </div>
            <div class="portao">T extends<br>Number</div>
            <div class="caixa tipada" id="caixa" style="min-height:170px">
              <div class="caixa-etiqueta">aceitos</div>
            </div>
          </div>
          <div class="saida" id="saida">Number é a superclasse de Integer, Long, Double, BigDecimal...</div>`;

        const caixa = host.querySelector('#caixa');
        const saida = host.querySelector('#saida');
        let testados = 0;

        host.querySelectorAll('.item').forEach(item => {
          item.onclick = () => {
            if (item.classList.contains('usado')) return;
            item.classList.add('usado');
            testados++;

            if (item.dataset.ok === '1') {
              const copia = item.cloneNode(true);
              copia.classList.remove('usado');
              caixa.appendChild(copia);
              api.gsap.from(copia, { x: -140, opacity: 0, duration: 0.5, ease: 'power2.out' });
              api.som('pop');
              saida.innerHTML = `<span class="ok">new Calculadora&lt;${item.textContent.trim()}&gt;()   // passou: é um Number</span>`;
            } else {
              item.classList.add('rejeitado');
              api.som('barrado');
              api.gsap.to(item, { x: 60, duration: 0.25, ease: 'power2.out',
                onComplete: () => api.gsap.to(item, { x: 0, duration: 0.5, ease: 'back.out(2)' }) });
              saida.innerHTML = `<span class="erro">new Calculadora&lt;${item.textContent.trim()}&gt;()
    ERRO: type argument is not within bounds of type-variable T</span>`;
            }

            if (testados === 4) {
              saida.innerHTML += `
<span style="color:#94a3b8">
E o bônus: dentro da classe, T ganha os métodos de Number —
você pode chamar valor.doubleValue() sem cast.</span>`;
              api.pronto('O limite não só filtra: ele libera os métodos do tipo');
            }
          };
        });
      },
    },

    /* ------------------------------------------------ 10 método genérico */
    {
      fala: [
        'Não precisa da classe inteira ser genérica. Um **método sozinho** pode ser.',
        'A regra de sintaxe que cai em prova: o `<T>` vem **antes do tipo de retorno**.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Método genérico</div>
          <div id="linhas"></div>`;

        const linhas = [
          { html: `<span class="hl">&lt;T&gt;</span> <span style="color:#c792ea">public static</span>  ...`,
            nota: 'Errado — o &lt;T&gt; não vem antes dos modificadores' },
          { html: `<span style="color:#c792ea">public static</span> <span class="hl">&lt;T&gt;</span> T maior(T a, T b) {`,
            nota: 'Certo — modificadores, depois &lt;T&gt;, depois o retorno' },
          { html: `    <span style="color:#c792ea">return</span> a.compareTo(b) &gt;= 0 ? a : b;`,
            nota: 'Mas compareTo só existe se T for Comparable...' },
          { html: `<span style="color:#c792ea">public static</span> &lt;T <span class="hl">extends Comparable&lt;T&gt;</span>&gt; T maior(T a, T b) {`,
            nota: 'Com o limite, o método compila — e aceita qualquer tipo comparável' },
        ];

        const host2 = host.querySelector('#linhas');
        linhas.forEach((l, i) => {
          const div = document.createElement('div');
          div.innerHTML = `
            <pre class="code" style="margin-bottom:6px">${l.html}</pre>
            <div class="note" style="margin:0 0 16px">${l.nota}</div>`;
          host2.appendChild(div);
          api.gsap.from(div, { x: -24, opacity: 0, duration: 0.45, delay: 0.35 * i, ease: 'power2.out' });
        });
      },
    },

    /* ------------------------------------------------------- 11 checagem */
    {
      fala: [
        'Última checagem — essa é a pergunta que o entrevistador faz pra ver se você entendeu de verdade.',
      ],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; font-size:1.1rem; margin-bottom:8px">
            Qual é o ganho real de Generics?
          </h2>
          <p style="text-align:center; color:var(--muted); font-size:0.86rem; margin-bottom:18px">
            Pensa no que mudou entre a etapa 3 e a etapa 6.
          </p>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Deixa o programa mais rápido em execução</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Move o erro de tipo do <b>runtime</b> para a <b>compilação</b>, e elimina o cast</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Permite guardar mais itens na lista</span></button>
          </div>`;

        const correta = 1;
        host.querySelectorAll('.option').forEach(b => {
          b.onclick = () => {
            const escolha = Number(b.dataset.i);
            host.querySelectorAll('.option').forEach((o, i) => {
              o.classList.add('disabled');
              o.onclick = null;
              if (i === correta) o.classList.add('right');
              else if (i === escolha) o.classList.add('wrong');
            });
            const certo = escolha === correta;
            api.registrarResposta(certo);
            api.pronto(certo
              ? 'Exatamente — segurança de tipo em compilação'
              : 'É a B: o erro aparece antes de rodar, e o cast some');
          };
        });
      },
    },

    /* ---------------------------------------------------------- 12 recap */
    {
      fala: [
        'Fecha comigo. Cinco coisas que você viu — e uma que fica pra próxima aula.',
      ],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [
          ['📦', 'Lista crua aceita tudo', 'e devolve <code>Object</code>: cast obrigatório'],
          ['💥', 'O erro só aparecia rodando', '<code>ClassCastException</code> em produção'],
          ['🏷️', '<code>List&lt;String&gt;</code> é a etiqueta', 'o compilador vira porteiro'],
          ['🧊', '<code>&lt;T&gt;</code> é parâmetro de tipo', 'um molde que serve qualquer tipo'],
          ['🚪', '<code>&lt;T extends Number&gt;</code>', 'filtra e libera os métodos do limite'],
          ['🃏', 'Falta: wildcards e PECS', '<code>? extends</code> e <code>? super</code> — na teoria completa'],
        ];

        host.innerHTML = `
          <div class="palco-titulo">O que ficou</div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:12px">
            ${cards.map(([i, t, d]) => `
              <div style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:14px">
                <div style="font-size:1.5rem; margin-bottom:6px">${i}</div>
                <div style="font-weight:700; font-size:0.9rem; margin-bottom:4px">${t}</div>
                <div style="color:var(--muted); font-size:0.82rem; line-height:1.5">${d}</div>
              </div>`).join('')}
          </div>`;

        api.gsap.from(host.querySelectorAll('div[style*="background"]'), {
          y: 30, opacity: 0, scale: 0.94, duration: 0.5, stagger: 0.09, ease: 'back.out(1.4)',
        });
      },
    },
  ],
});
