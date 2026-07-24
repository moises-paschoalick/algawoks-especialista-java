/**
 * Aula guiada · String, pool e StringBuilder (módulo 20 · docs/page_06.md)
 *
 * Analogias, sempre ANTES do código:
 *   imutabilidade  = placa gravada em pedra
 *   String Pool    = biblioteca de exemplar único (a prateleira da aula 2, de volta)
 *   new String()   = gráfica que imprime cópia própria
 *   + em loop      = copista que recopia o livro inteiro a cada página
 *   StringBuilder  = fichário de argolas, encaderna uma vez no final
 */
Aula.registrar({
  id: 'strings',
  licao: 'fund-strings',
  titulo: 'String: a placa gravada em pedra',
  personagem: { nome: 'Bean' },
  fechamento: 'Placa, biblioteca, copista e fichário: quatro imagens que respondem 90% das perguntas de String em entrevista.',

  cenas: [

    /* ---------------------------------------------------------- 1 intro */
    {
      fala: [
        'Aula passada você viu a caixa de presente. Hoje é o tipo mais usado do Java inteiro: **String**.',
        'E a primeira coisa que ninguém te conta direito: String não é papel de rascunho. É **placa gravada em pedra**.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div style="text-align:center">
            <div class="analogia" style="margin:0 auto 16px; max-width:420px">
              <div class="analogia-titulo">A ideia de hoje</div>
              <div class="analogia-cena">
                <div class="placa"><div class="gravado">"java"</div><small>gravada, não editável</small></div>
              </div>
            </div>
            <div class="palco-titulo">Módulo 20 · Trabalhando com strings</div>
            <p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">
              12 etapas. Analogia primeiro, código depois.
            </p>
          </div>`;
        api.gsap.from(host.querySelector('.placa'), {
          y: -30, opacity: 0, rotate: -6, duration: 0.7, ease: 'bounce.out',
        });
      },
    },

    /* -------------------------------------------- 2 a placa não se edita */
    {
      fala: [
        'Uma placa de pedra **não se edita**. Se você quer o texto em maiúsculas, grava uma placa NOVA.',
        'Executa o `toUpperCase()` e repara no que acontece com a placa original.',
      ],
      interativo: true,
      dica: 'Clique em executar',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: a oficina de placas</div>
            <div class="analogia-cena"><div class="grande">🪨</div><div>"editar? aqui a gente só grava outra"</div></div>
          </div>
          ${api.codigo(`String texto = "java";
texto.toUpperCase();`)}
          <div class="cena-linha" style="margin-bottom:10px">
            <div style="text-align:center">
              <div class="placa" id="placaOriginal"><div class="gravado">"java"</div><small>texto aponta aqui</small></div>
            </div>
            <div id="placaNovaWrap" style="text-align:center"></div>
          </div>
          <div class="palco-escolhas">
            <button class="chip" id="btnRun">▶ executar toUpperCase()</button>
          </div>
          <div class="saida" id="saida">A placa "java" está na bancada...</div>`;

        host.querySelector('#btnRun').onclick = e => {
          e.target.disabled = true;
          api.som('pop');

          const wrap = host.querySelector('#placaNovaWrap');
          wrap.innerHTML = `<div class="placa nova"><div class="gravado">"JAVA"</div><small>placa NOVA... que ninguém guardou</small></div>`;
          api.gsap.from(wrap.children[0], { y: -50, opacity: 0, rotate: 8, duration: 0.6, ease: 'bounce.out' });

          // a original balança de leve, mas fica intacta
          api.gsap.fromTo('#placaOriginal', { rotate: 0 }, { rotate: 2, yoyo: true, repeat: 3, duration: 0.09 });

          host.querySelector('#saida').innerHTML =
`<span class="neutro">O método NÃO alterou a placa: gravou outra e a DEVOLVEU.</span>
<span class="erro">Como ninguém guardou o retorno, a placa nova se perdeu.</span>
<span class="ok">texto = texto.toUpperCase();   // o jeito certo: reapontar a variável</span>`;
          api.reagir('pensando');
          api.pronto('Todo método de String devolve uma String nova. Sempre.');
        };
      },
    },

    /* ------------------------------------------- 3 quiz da imutabilidade */
    {
      fala: [
        'Se isso ficou claro, essa aqui você mata fácil.',
      ],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">O que este código imprime?</h2>
          ${api.codigo(`String s = "java";
s.toUpperCase();
s.concat(" 21");
System.out.println(s);`)}
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>JAVA 21</code></span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>java</code></span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span><code>JAVA</code></span></button>
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
              ? 'Isso: as placas novas foram gravadas e jogadas fora. A variável nunca saiu da original'
              : 'É "java": os retornos foram ignorados, e a placa original ninguém consegue alterar');
          };
        });
      },
    },

    /* ------------------------------------------------- 4 a biblioteca */
    {
      fala: [
        'Segunda parte. Lembra da **prateleira** da aula das caixas? Ela volta, com outro nome: **biblioteca de exemplar único**.',
        'Quem pede o livro "Java" não ganha uma cópia: recebe **o mesmo exemplar** da estante.',
        'Pede duas vezes e observa.',
      ],
      interativo: true,
      dica: 'Clique duas vezes em "pedir"',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: a biblioteca de exemplar único</div>
            <div class="analogia-cena"><div class="grande">📚</div><div>"Java? é aquele ali da estante, o mesmo pra todo mundo"</div></div>
          </div>
          <div class="prateleira">
            <div class="prateleira-rotulo">estante de literais</div>
            <div class="slot">"Oi"</div>
            <div class="slot" id="slotJava">"Java"</div>
            <div class="slot">"SQL"</div>
          </div>
          <div class="palco-escolhas">
            <button class="chip" id="btnPedir">pedir o literal "Java"</button>
          </div>
          <div class="pedidos" id="pedidos"></div>
          <div class="saida" id="saida">String a = "Java";<br>String b = "Java";</div>`;

        const slot = host.querySelector('#slotJava');
        const pedidos = host.querySelector('#pedidos');
        const saida = host.querySelector('#saida');
        const vars = ['a', 'b'];
        let n = 0;

        host.querySelector('#btnPedir').onclick = e => {
          if (n >= 2) return;
          const v = vars[n++];
          slot.classList.add('acesa');
          api.som('pop');
          api.gsap.fromTo(slot, { scale: 1.3 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1,0.5)' });

          const p = document.createElement('div');
          p.className = 'pedido';
          p.innerHTML = n === 1
            ? `<b>${v}</b> ➜ exemplar da estante`
            : `<b>${v}</b> ➜ o <b>MESMO</b> exemplar`;
          pedidos.appendChild(p);
          api.gsap.from(p, { x: -16, opacity: 0, duration: 0.3 });

          if (n === 2) {
            e.target.disabled = true;
            saida.innerHTML = `String a = "Java";<br>String b = "Java";<br><span class="ok">a == b   // true: mesmo exemplar da estante</span>`;
            api.reagir('feliz');
            api.pronto('Dois literais iguais, um objeto só. Cheiro de cache, né?');
          }
        };
      },
    },

    /* ------------------------------------------------------ 5 a gráfica */
    {
      fala: [
        'Agora o `new String("Java")`. É mandar a **gráfica** imprimir uma cópia própria de um livro que a biblioteca JÁ TEM.',
        'Antes de rodar: aposta. O que `a == c` vai dar?',
      ],
      interativo: true,
      emocao: 'pensando',
      dica: 'Faça sua aposta',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: a gráfica</div>
            <div class="analogia-cena"><div class="grande">🖨️</div><div>"quer uma cópia SÓ sua? a gente imprime"</div></div>
          </div>
          ${api.codigo(`String a = "Java";              // exemplar da estante
String c = new String("Java");  // cópia impressa na gráfica

a == c   // ???`)}
          <div class="palco-escolhas">
            <button class="chip" data-r="true">aposto em true</button>
            <button class="chip" data-r="false">aposto em false</button>
          </div>
          <div class="prateleira" id="grafica" style="display:none; background:none; border-color:var(--blue)">
            <div class="prateleira-rotulo" style="color:var(--blue)">saída da gráfica</div>
          </div>
          <div class="saida" id="saida" style="display:none"></div>`;

        host.querySelectorAll('.chip').forEach(chip => {
          chip.onclick = () => {
            host.querySelectorAll('.chip').forEach(c => { c.disabled = true; });
            chip.classList.add('ativo');
            const certo = chip.dataset.r === 'false';
            api.registrarResposta(certo);

            const grafica = host.querySelector('#grafica');
            grafica.style.display = 'flex';
            const copia = document.createElement('div');
            copia.className = 'slot nova';
            copia.textContent = '"Java" @9f31';
            grafica.appendChild(copia);
            api.som(certo ? 'acerto' : 'erro');
            api.gsap.from(copia, { y: -30, opacity: 0, duration: 0.4, ease: 'bounce.out' });

            const saida = host.querySelector('#saida');
            saida.style.display = 'block';
            saida.innerHTML =
`<span class="erro">a == c        // false: exemplar da estante × cópia da gráfica</span>
<span class="ok">a.equals(c)   // true:  o TEXTO dos dois é idêntico</span>`;
            api.gsap.from(saida, { y: 10, opacity: 0, duration: 0.3 });
            api.pronto(certo
              ? 'Apostou certo: new SEMPRE fabrica um objeto novo, fora da estante'
              : 'Era false: o new ignora a estante e imprime uma cópia própria');
          };
        });
      },
    },

    /* ------------------------------------------------- 6 nomear: o pool */
    {
      fala: [
        'Essa estante tem nome: **String Pool**.',
        'Literais iguais compartilham o mesmo objeto. `new String()` força um objeto fora do pool. E é daí que sai a regra de ouro.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">O conceito, agora com nome</div>
          ${api.codigo(`String a = "Java";              // pool
String b = "Java";              // MESMO objeto do pool
String c = new String("Java");  // objeto novo na heap

a == b        // true:  pool
a == c        // false: fora do pool
a.equals(c)   // true:  compara o conteúdo`)}
          <div class="note">
            Regra de ouro: String se compara com <b>equals()</b> (ou equalsIgnoreCase).
            O == só "funciona" com literais por causa do pool, e quebra assim que a
            String vier de input, banco ou concatenação em tempo de execução.
          </div>`;
        api.gsap.from(host.children, { y: 18, opacity: 0, duration: 0.45, stagger: 0.15 });
      },
    },

    /* ---------------------------------------------------- 7 quiz do pool */
    {
      fala: [
        'Testa a regra.',
      ],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Qual comparação é SEGURA pra saber se as duas Strings têm o mesmo texto?</h2>
          ${api.codigo(`String digitada = scanner.nextLine();   // veio do usuário
String senha = "abre123";`)}
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>digitada == senha</code></span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>senha.equals(digitada)</code></span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Tanto faz, dá o mesmo resultado</span></button>
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
              ? 'Isso. String de input nunca está no pool: o == compararia estante com cópia'
              : 'É a B: o texto digitado nasce fora do pool, então == dá false mesmo com o texto certo');
          };
        });
      },
    },

    /* ------------------------------------------------------ 8 o copista */
    {
      fala: [
        'Terceira parte, e essa dói no desempenho. Imagina um **copista medieval**: pra somar UMA página, ele recopia o livro inteiro e joga o antigo fora.',
        'É isso que o `+` faz em loop. Soma 4 páginas e olha o contador.',
      ],
      interativo: true,
      dica: 'Clique 4 vezes em "somar página"',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: o copista</div>
            <div class="analogia-cena"><div class="grande">✍️</div><div>"mais uma página? recopio o livro do zero"</div></div>
          </div>
          ${api.codigo(`String livro = "p1";
livro = livro + "p2";   // recopia tudo e cria outro objeto`)}
          <div class="livro-atual">📖</div>
          <div class="paginas" id="paginas"><div class="pagina">p1</div></div>
          <div class="contador">
            <div class="med ruim"><div class="v" id="copiadas">0</div><div class="k">páginas recopiadas</div></div>
            <div class="med"><div class="v" id="tamanho">1</div><div class="k">páginas no livro</div></div>
          </div>
          <div class="palco-escolhas">
            <button class="chip" id="btnSomar">livro = livro + "p?"</button>
          </div>
          <div class="pilha-lixo" id="lixo"><span class="rotulo">🗑️ versões jogadas fora</span></div>`;

        const paginas = host.querySelector('#paginas');
        const elCopiadas = host.querySelector('#copiadas');
        const elTamanho = host.querySelector('#tamanho');
        const lixo = host.querySelector('#lixo');
        let tamanho = 1, copiadas = 0, somas = 0;

        host.querySelector('#btnSomar').onclick = e => {
          if (somas >= 4) return;
          somas++;
          copiadas += tamanho;      // recopia todas as páginas atuais
          tamanho++;

          const velho = document.createElement('span');
          velho.className = 'livro-velho';
          velho.textContent = '📕';
          lixo.appendChild(velho);
          api.som('barrado');
          api.gsap.from(velho, { y: -26, opacity: 0, rotate: 30, duration: 0.4, ease: 'bounce.out' });

          const pg = document.createElement('div');
          pg.className = 'pagina';
          pg.textContent = 'p' + tamanho;
          paginas.appendChild(pg);
          api.gsap.from(pg, { scale: 0, duration: 0.3, ease: 'back.out(2)' });

          elCopiadas.textContent = copiadas;
          elTamanho.textContent = tamanho;
          api.gsap.fromTo(elCopiadas, { scale: 1.4 }, { scale: 1, duration: 0.3 });

          if (somas === 4) {
            e.target.disabled = true;
            api.reagir('alerta');
            api.pronto('4 somas, 10 páginas recopiadas e 4 livros no lixo. Isso é o O(n²)');
          }
        };
      },
    },

    /* ----------------------------------------------------- 9 o fichário */
    {
      fala: [
        'Agora o jeito certo: o **fichário de argolas**. Página nova? Só encaixa. Ninguém recopia nada.',
        'No fim, você **encaderna uma vez**: é o `toString()`.',
      ],
      interativo: true,
      dica: 'Adicione as 4 páginas e encaderne',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: o fichário de argolas</div>
            <div class="analogia-cena"><div class="grande">🗂️</div><div>"encaixa a página e segue o jogo"</div></div>
          </div>
          ${api.codigo(`StringBuilder sb = new StringBuilder("p1");
sb.append("p2");            // só encaixa, sem recopiar`)}
          <div class="livro-atual">🗂️</div>
          <div class="paginas" id="paginas"><div class="pagina">p1</div></div>
          <div class="contador">
            <div class="med bom"><div class="v" id="copiadas">0</div><div class="k">páginas recopiadas</div></div>
            <div class="med"><div class="v" id="tamanho">1</div><div class="k">páginas no fichário</div></div>
          </div>
          <div class="palco-escolhas">
            <button class="chip" id="btnSomar">sb.append("p?")</button>
            <button class="chip" id="btnEncadernar" disabled>📖 sb.toString()</button>
          </div>
          <div class="saida" id="saida">O lixo desta cena: nenhum.</div>`;

        const paginas = host.querySelector('#paginas');
        const elTamanho = host.querySelector('#tamanho');
        const btnEnc = host.querySelector('#btnEncadernar');
        let tamanho = 1, somas = 0;

        host.querySelector('#btnSomar').onclick = e => {
          if (somas >= 4) return;
          somas++; tamanho++;
          const pg = document.createElement('div');
          pg.className = 'pagina';
          pg.textContent = 'p' + tamanho;
          paginas.appendChild(pg);
          api.som('pop');
          api.gsap.from(pg, { scale: 0, duration: 0.3, ease: 'back.out(2)' });
          elTamanho.textContent = tamanho;
          if (somas === 4) { e.target.disabled = true; btnEnc.disabled = false; }
        };

        btnEnc.onclick = () => {
          btnEnc.disabled = true;
          api.som('acerto');
          api.reagir('feliz');
          host.querySelector('.livro-atual').textContent = '📖';
          host.querySelector('#saida').innerHTML =
`<span class="ok">String resultado = sb.toString();   // UMA cópia, no final</span>
<span class="neutro">Copista: 10 páginas recopiadas + 4 livros no lixo.
Fichário: 0 recopiadas + 1 encadernação.</span>`;
          api.pronto('Concatenação em loop é caso fechado: StringBuilder');
        };
      },
    },

    /* -------------------------------------------------- 10 lado a lado */
    {
      fala: [
        'O mesmo loop, nas duas versões. Grava essa comparação: ela cai em entrevista E em code review.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Copista × fichário, em código</div>
          <div class="compara">
            <div class="compara-col antes">
              <h4>✗ copista: O(n²)</h4>
              ${api.codigo(`String sql = "";
for (String c : colunas) {
    sql = sql + c + ", ";
    // um objeto novo POR VOLTA
}`)}
            </div>
            <div class="compara-col depois">
              <h4>✓ fichário: O(n)</h4>
              ${api.codigo(`StringBuilder sb = new StringBuilder();
for (String c : colunas) {
    sb.append(c).append(", ");
}
String sql = sb.toString();`)}
            </div>
          </div>
          <div class="note">
            Fora de loop, pode usar + tranquilo: "a" + b + "c" numa linha só o
            compilador já converte pra StringBuilder por baixo dos panos.
          </div>`;
        api.gsap.from(host.querySelectorAll('.compara-col, .note'), {
          y: 20, opacity: 0, duration: 0.45, stagger: 0.15, ease: 'power2.out',
        });
      },
    },

    /* ----------------------------------------------- 11 checagem final */
    {
      fala: [
        'Última checagem, e essa amarra a aula inteira.',
      ],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; margin-bottom:14px">
            Por que a <b>imutabilidade</b> é o que PERMITE o String Pool existir?
          </h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Porque o pool tem espaço limitado na memória</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Compartilhar o mesmo exemplar só é seguro se ninguém puder alterá-lo. Se a placa fosse editável, mudar a String de um mudaria a de todos</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Não tem relação: o pool funcionaria igual com Strings mutáveis</span></button>
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
              ? 'Perfeito: imutável = compartilhável. É a mesma razão de String ser boa chave de HashMap'
              : 'É a B: a placa gravada é o que torna a biblioteca segura');
          };
        });
      },
    },

    /* ---------------------------------------------------------- 12 recap */
    {
      fala: [
        'Fechou! Seis imagens pra levar.',
      ],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [
          ['🪨', 'String é placa gravada', 'todo método devolve uma placa NOVA'],
          ['🔁', 'Reaponte a variável', '<code>s = s.toUpperCase();</code>, senão o retorno se perde'],
          ['📚', 'Pool: exemplar único', 'literais iguais compartilham o mesmo objeto'],
          ['🖨️', 'new String = gráfica', 'cópia fora do pool: <code>==</code> dá false'],
          ['⚖️', 'Compare com equals()', 'o == só compara a referência'],
          ['🗂️', '+ em loop, nunca', 'copista é O(n²); StringBuilder encaderna uma vez'],
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
