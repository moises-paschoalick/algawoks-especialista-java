/**
 * Aula guiada · Controle de fluxo e switch moderno (módulo 3 · docs/page_06.md)
 * Esteira docs/metodologia. Analogia: o trilho com desvio; o switch clássico como dominó.
 */
Aula.registrar({
  id: 'fund-fluxo',
  licao: 'fund-fluxo',
  titulo: 'Controle de fluxo: o trilho que não pode vazar',
  personagem: { nome: 'Bean' },
  fechamento: 'A seta -> não vaza e devolve valor; o switch de enum obriga a tratar todos os casos. Menos break esquecido, menos bug.',

  cenas: [

    /* 1 intro */
    {
      fala: [
        'Controle de fluxo é decidir por qual **trilho** o programa segue.',
        'A estrela do dia é o `switch` moderno, com a seta `->`, que resolve uma armadilha antiga do `switch` clássico.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div style="text-align:center">
            <div class="analogia" style="margin:0 auto 16px; max-width:440px">
              <div class="analogia-titulo">A ideia de hoje</div>
              <div class="analogia-cena"><div class="grande">🛤️</div><div>"o trilho decide o caminho; o desvio não pode deixar vazar"</div></div>
            </div>
            <div class="palco-titulo">Módulo 3 · Estrutura de controle</div>
            <p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p>
          </div>`;
        api.gsap.from(host.querySelector('.analogia-cena'), { y: 20, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' });
      },
    },

    /* 2 if/else como bifurcacao */
    {
      fala: [
        'O `if/else` é a **bifurcação**: a condição escolhe um dos trilhos.',
        'Escolhe o resultado do ternário para `idade = 20`.',
      ],
      interativo: true, dica: 'Escolha o valor',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: a bifurcação da estrada</div>
            <div class="analogia-cena"><div class="grande">🔀</div><div>"a condição manda por um lado ou outro"</div></div>
          </div>
          ${api.codigo(`int idade = 20;
String tipo = (idade >= 18) ? "adulto" : "menor";`)}
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>"menor"</code></span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>"adulto"</code></span></button>
          </div>`;
        const ok = 1;
        host.querySelectorAll('.option').forEach(b => b.onclick = () => {
          const e = Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o, i) => { o.classList.add('disabled'); o.onclick = null; if (i === ok) o.classList.add('right'); else if (i === e) o.classList.add('wrong'); });
          api.registrarResposta(e === ok);
          api.pronto(e === ok ? 'Isso: 20 >= 18, segue o trilho do "adulto"' : 'É "adulto": 20 é maior que 18, então a condição é verdadeira');
        });
      },
    },

    /* 3 problema: fall-through (domino) */
    {
      fala: [
        'Agora a armadilha do `switch` **clássico**: sem `break`, ele cai em **cascata**, como dominó.',
        'Executa com `x = 2` e veja quantos casos caem.',
      ],
      interativo: true, emocao: 'alerta', dica: 'Clique em executar',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: dominó em cascata</div>
            <div class="analogia-cena"><div class="grande">🁢</div><div>"empurrou um, caíram todos os seguintes"</div></div>
          </div>
          ${api.codigo(`switch (x) {         // x = 2, e SEM break
    case 1: print("um");
    case 2: print("dois");
    case 3: print("tres");
    default: print("outro");
}`)}
          <div class="dominos" id="dom">
            <div class="domino">um</div><div class="domino">dois</div><div class="domino">tres</div><div class="domino">outro</div>
          </div>
          <div class="palco-escolhas"><button class="chip" id="btn">▶ executar (x = 2)</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick = e => {
          e.target.disabled = true;
          const dom = [...host.querySelectorAll('.domino')];
          [1, 2, 3].forEach((idx, k) => setTimeout(() => {
            api.som('barrado'); dom[idx].classList.add('caiu');
          }, 300 * k));
          setTimeout(() => {
            const s = host.querySelector('#saida'); s.style.display = 'block';
            s.innerHTML = `<span class="erro">Saída: doistresoutro</span>
<span class="neutro">Casou no case 2 e caiu em cascata até o fim. Faltou o break: é o fall-through.</span>`;
            api.gsap.from(s, { y: 10, opacity: 0, duration: 0.3 });
            api.reagir('alerta'); api.pronto('Um break esquecido e o switch executa tudo depois do case. Bug clássico');
          }, 1000);
        };
      },
    },

    /* 4 quiz fall-through */
    {
      fala: ['Fixando o conceito:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:14px">O que causa o "fall-through" no switch clássico?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Um erro de digitação nos <code>case</code></span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>A falta de <code>break</code>: a execução continua nos casos seguintes</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Usar <code>int</code> no switch</span></button>
          </div>`;
        const ok = 1;
        host.querySelectorAll('.option').forEach(b => b.onclick = () => {
          const e = Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o, i) => { o.classList.add('disabled'); o.onclick = null; if (i === ok) o.classList.add('right'); else if (i === e) o.classList.add('wrong'); });
          api.registrarResposta(e === ok);
          api.pronto(e === ok ? 'Isso: sem break, cai em cascata' : 'É a B: sem break, a execução vaza para os próximos casos');
        });
      },
    },

    /* 5 solucao: a seta nao vaza */
    {
      fala: [
        'O `switch` moderno (Java 14+) usa a seta `->`, que **não vaza**: só o caso certo executa.',
        'Executa de novo com `x = 2`.',
      ],
      interativo: true, emocao: 'feliz', dica: 'Clique em executar',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: o desvio que fecha o trilho atrás de si</div>
            <div class="analogia-cena"><div class="grande">🛑</div><div>"pegou o desvio certo, e para ali"</div></div>
          </div>
          ${api.codigo(`String r = switch (x) {      // x = 2
    case 1 -> "um";
    case 2 -> "dois";
    case 3 -> "tres";
    default -> "outro";
};`)}
          <div class="dominos" id="dom">
            <div class="domino">um</div><div class="domino">dois</div><div class="domino">tres</div><div class="domino">outro</div>
          </div>
          <div class="palco-escolhas"><button class="chip" id="btn">▶ executar (x = 2)</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick = e => {
          e.target.disabled = true; api.som('pop');
          const dom = [...host.querySelectorAll('.domino')];
          dom[1].classList.add('parado');
          api.gsap.fromTo(dom[1], { scale: 1.2 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
          const s = host.querySelector('#saida'); s.style.display = 'block';
          s.innerHTML = `<span class="ok">r = "dois"</span>
<span class="neutro">Só o case 2 executou. Sem break, sem cascata, e ainda devolve valor.</span>`;
          api.gsap.from(s, { y: 10, opacity: 0, duration: 0.3 });
          api.reagir('feliz'); api.pronto('A seta -> resolve o fall-through de uma vez');
        };
      },
    },

    /* 6 nomear: switch de expressao + yield */
    {
      fala: [
        'Isso é o **switch de expressão**: ele **devolve um valor**. Quando o caso precisa de várias linhas, use bloco e `yield`.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">O conceito, agora com nome</div>
          ${api.codigo(`int desconto = switch (categoria) {
    case "OURO" -> 20;
    case "PRATA" -> 10;
    default -> {
        registrarAuditoria(categoria);
        yield 0;               // yield devolve o valor do bloco
    }
};`)}
          <div class="note">Vários rótulos no mesmo caso: <code>case SEG, TER, QUA -> "util";</code>. Sem <code>break</code>, sem fall-through.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },

    /* 7 switch exaustivo de enum */
    {
      fala: [
        'O melhor vem com `enum`: o switch de expressão obriga a tratar **todos** os casos.',
        'Adiciona um status novo ao enum e veja o que o compilador faz.',
      ],
      interativo: true, emocao: 'pensando', dica: 'Clique em "adicionar CANCELADO"',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: a lista de conferência que não deixa esquecer</div>
            <div class="analogia-cena"><div class="grande">✅</div><div>"faltou um item? não passa"</div></div>
          </div>
          <div id="host">${api.codigo(`String txt = switch (status) {   // enum: PAGO, ENVIADO
    case PAGO -> "Pago";
    case ENVIADO -> "A caminho";
};   // sem default: o compilador confere os casos`)}</div>
          <div class="palco-escolhas"><button class="chip" id="btn">adicionar CANCELADO ao enum</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick = e => {
          e.target.disabled = true; api.som('barrado');
          const s = host.querySelector('#saida'); s.style.display = 'block';
          s.innerHTML = `<span class="erro">ERRO DE COMPILAÇÃO: the switch expression does not cover
all possible input values (falta CANCELADO)</span>
<span class="ok">O compilador te obriga a tratar o caso novo, antes de rodar.</span>`;
          api.gsap.from(s, { y: 10, opacity: 0, duration: 0.3 });
          api.reagir('pensando'); api.pronto('Rede de segurança: adicionar um valor no enum quebra a compilação, não a produção');
        };
      },
    },

    /* 8 quiz vantagem do switch moderno */
    {
      fala: ['A pergunta de entrevista sobre isso:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Qual a maior vantagem do switch de expressão sobre enum?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>É mais rápido em runtime</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Exaustividade: o compilador exige tratar todos os casos do enum; esquecer um quebra a compilação</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Aceita <code>double</code> nos casos</span></button>
          </div>`;
        const ok = 1;
        host.querySelectorAll('.option').forEach(b => b.onclick = () => {
          const e = Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o, i) => { o.classList.add('disabled'); o.onclick = null; if (i === ok) o.classList.add('right'); else if (i === e) o.classList.add('wrong'); });
          api.registrarResposta(e === ok);
          api.pronto(e === ok ? 'Isso: exaustividade verificada em compilação' : 'É a B: o ganho é o compilador cobrar todos os casos');
        });
      },
    },

    /* 9 loops (escolha) */
    {
      fala: [
        'Os laços também são trilhos que repetem. Cada situação pede um.',
        'Qual laço para "repetir enquanto houver mais, mas rodar ao menos uma vez"?',
      ],
      interativo: true, dica: 'Escolha o laço',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: a ferramenta certa para cada repetição</div>
            <div class="analogia-cena"><div class="grande">🔁</div><div>"contador conhecido? coleção? condição no início ou no fim?"</div></div>
          </div>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>for (int i...)</code>: contador conhecido</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>while</code>: testa a condição no início (pode não rodar)</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span><code>do { } while</code>: executa e só então testa (roda ao menos uma vez)</span></button>
          </div>`;
        const ok = 2;
        host.querySelectorAll('.option').forEach(b => b.onclick = () => {
          const e = Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o, i) => { o.classList.add('disabled'); o.onclick = null; if (i === ok) o.classList.add('right'); else if (i === e) o.classList.add('wrong'); });
          api.registrarResposta(e === ok);
          api.pronto(e === ok ? 'Isso: do-while roda o corpo antes de testar' : 'É o do-while: ele executa ao menos uma vez, testando a condição no fim');
        });
      },
    },

    /* 10 continue e break */
    {
      fala: ['Dentro do laço, dois atalhos: `continue` pula a volta atual, `break` sai do laço.'],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">continue x break</div>
          ${api.codigo(`for (String nome : nomes) {
    if (nome.isBlank()) continue;   // pula esta volta, segue para a próxima
    if (nome.equals("FIM")) break;  // encerra o laço aqui
    processar(nome);
}`)}
          <div class="note"><code>continue</code> vai para a próxima iteração; <code>break</code> abandona o laço inteiro.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },

    /* 11 checagem final */
    {
      fala: ['Fecha com a pegadinha do switch:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; margin-bottom:12px">Um switch de <b>expressão</b> sobre uma <code>String</code> exige o quê?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Um <code>break</code> em cada caso</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Um <code>default</code> (ou cobrir todos os casos, se for enum), porque ele precisa devolver um valor sempre</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Nada além dos <code>case</code></span></button>
          </div>`;
        const ok = 1;
        host.querySelectorAll('.option').forEach(b => b.onclick = () => {
          const e = Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o, i) => { o.classList.add('disabled'); o.onclick = null; if (i === ok) o.classList.add('right'); else if (i === e) o.classList.add('wrong'); });
          api.registrarResposta(e === ok);
          api.pronto(e === ok ? 'Perfeito: precisa devolver valor, então default é obrigatório (salvo enum exaustivo)' : 'É a B: switch de expressão devolve valor, logo precisa cobrir tudo');
        });
      },
    },

    /* 12 recap */
    {
      fala: ['Fluxo dominado. Seis imagens pra levar.'],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [
          ['🔀', 'if/else e ternário', 'a condição escolhe o trilho'],
          ['🁢', 'switch clássico vaza', 'sem <code>break</code>, cai em cascata (fall-through)'],
          ['🛑', 'a seta -> não vaza', 'só o caso certo executa'],
          ['↩️', 'switch de expressão', 'devolve valor; bloco usa <code>yield</code>'],
          ['✅', 'enum exaustivo', 'o compilador cobra todos os casos'],
          ['🔁', 'laços e atalhos', 'for/while/do-while; <code>continue</code> e <code>break</code>'],
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
