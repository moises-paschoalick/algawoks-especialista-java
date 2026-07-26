/**
 * Aula guiada · Enums com estado e comportamento (módulo 19 · docs/page_02.md)
 * Analogia: o semáforo (conjunto fechado de estados com regras).
 */
Aula.registrar({
  id: 'col-enums',
  licao: 'col-enums',
  titulo: 'Enums: o conjunto fechado com comportamento',
  personagem: { nome: 'Bean' },
  fechamento: 'Enum não é lista de constantes: é uma classe com instâncias fixas, atributos e comportamento. E nunca persista o ordinal.',

  cenas: [
    { /* 1 */
      fala: ['`enum` não é só uma lista de rótulos: é uma **classe com instâncias fixas**. A imagem: um **semáforo**, um conjunto fechado e conhecido de estados.'],
      palco(host, api) {
        host.innerHTML = `<div style="text-align:center">
          <div class="analogia" style="margin:0 auto 16px; max-width:440px"><div class="analogia-titulo">A ideia de hoje</div>
            <div class="analogia-cena"><div class="grande">🚦</div><div>"vermelho, amarelo, verde: um conjunto fechado, cada um com sua regra"</div></div></div>
          <div class="palco-titulo">Módulo 19 · Enumerações</div>
          <p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`;
        api.gsap.from(host.querySelector('.analogia-cena'), { y: 20, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' });
      },
    },
    { /* 2 problema: String status */
      fala: ['Sem enum, o status vira uma `String` solta, e isso é frágil. Digita o status.'],
      interativo: true, emocao: 'pensando', dica: 'Clique em "salvar com typo"',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: escrever o estado à mão</div>
            <div class="analogia-cena"><div class="grande">✍️</div><div>"PAGO, PAGoo, Pago... qual é o certo?"</div></div></div>
          ${api.codigo(`String status = "PAGOO";   // typo, mas compila numa boa
if (status.equals("PAGO")) { ... }   // nunca entra: bug silencioso`)}
          <div class="palco-escolhas"><button class="chip" id="btn">salvar status = "PAGOO"</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{ e.target.disabled=true; api.som('barrado');
          const s=host.querySelector('#saida');s.style.display='block';
          s.innerHTML=`<span class="erro">Compilou e salvou "PAGOO". O compilador não tinha como saber que é inválido.</span>
<span class="neutro">String aceita qualquer texto: estados impossíveis passam batido.</span>`;
          api.gsap.from(s,{y:10,opacity:0,duration:0.3}); api.reagir('pensando'); api.pronto('String como estado é uma porta aberta para typo e valor inválido'); };
      },
    },
    { /* 3 quiz problema */
      fala: ['Por que a String é ruim aqui?'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:14px">Qual o problema de usar <code>String</code> para o status de um pedido?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Ocupa mais memória</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Aceita qualquer texto: typos e estados inválidos compilam sem aviso</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: o conjunto de valores fica aberto e sem validação':'É a B: String não restringe os valores possíveis');});
      },
    },
    { /* 4 solucao: enum */
      fala: ['O `enum` fecha o conjunto: só existem os valores que você declarou. Nada de typo.'],
      interativo: true, emocao: 'feliz', dica: 'Clique em "trocar para enum"',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: a lista fechada de estados possíveis</div>
            <div class="analogia-cena"><div class="grande">🚦</div><div>"só os estados válidos existem"</div></div></div>
          <div id="host">${api.codigo(`String status = "PAGOO";   // qualquer texto`)}</div>
          <div class="palco-escolhas"><button class="chip" id="btn">trocar para enum</button></div>`;
        host.querySelector('#btn').onclick=e=>{ e.target.disabled=true; api.som('acerto'); api.reagir('feliz');
          host.querySelector('#host').innerHTML=api.codigo(`enum StatusPedido { AGUARDANDO, PAGO, ENVIADO, ENTREGUE }
StatusPedido status = StatusPedido.PAGOO;   // NÃO COMPILA: PAGOO não existe`);
          api.gsap.from(host.querySelector('#host'),{y:12,opacity:0,duration:0.35}); api.pronto('Enum é validado pelo compilador: typo vira erro de compilação'); };
      },
    },
    { /* 5 nomear: enum com atributo */
      fala: ['E o enum é uma **classe**: cada constante pode carregar atributos e ter métodos.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">O conceito, agora com nome</div>
          ${api.codigo(`enum StatusPedido {
    AGUARDANDO("Aguardando pagamento", true),
    PAGO("Pago", true),
    ENVIADO("A caminho", false);

    private final String descricao;
    private final boolean cancelavel;
    StatusPedido(String d, boolean c) { descricao = d; cancelavel = c; }   // construtor private

    public boolean podeCancelar() { return cancelavel; }
}`)}
          <div class="note">O construtor do enum é sempre <code>private</code>: as instâncias são fixas e conhecidas em compilação.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 6 comportamento por constante */
      fala: ['Cada constante pode ter o **próprio comportamento**. Aplica a operação.'],
      interativo: true, dica: 'Toque nas três operações',
      palco(host, api) {
        const d={SOMA:'2 + 3 = 5', SUBTRACAO:'2 - 3 = -1', MULTIPLICACAO:'2 * 3 = 6'};
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: cada botão faz a sua conta</div>
            <div class="analogia-cena"><div class="grande">🎛️</div><div>"cada constante implementa o método do seu jeito"</div></div></div>
          ${api.codigo(`enum Operacao {
    SOMA { double aplicar(double a, double b) { return a + b; } },
    SUBTRACAO { double aplicar(double a, double b) { return a - b; } },
    MULTIPLICACAO { double aplicar(double a, double b) { return a * b; } };
    abstract double aplicar(double a, double b);
}`)}
          <div class="palco-escolhas"><button class="chip" data-k="SOMA">SOMA</button><button class="chip" data-k="SUBTRACAO">SUBTRACAO</button><button class="chip" data-k="MULTIPLICACAO">MULTIPLICACAO</button></div>
          <div class="saida" id="saida">Operacao.X.aplicar(2, 3)</div>`;
        const s=host.querySelector('#saida'); const vistos=new Set();
        host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{ host.querySelectorAll('.chip').forEach(x=>x.classList.remove('ativo'));c.classList.add('ativo');api.som('pop');
          s.innerHTML=`<span class="ok">Operacao.${c.dataset.k}.aplicar(2, 3) = ${d[c.dataset.k].split('= ')[1]}</span>`; vistos.add(c.dataset.k);
          if(vistos.size===3) api.pronto('Comportamento por constante: cada uma resolve o método abstrato'); });
      },
    },
    { /* 7 operacoes uteis */
      fala: ['O enum vem com utilidades prontas: `values`, `valueOf`, `name`, `ordinal`.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Operações do enum</div>
          ${api.codigo(`StatusPedido.values();            // todas as constantes
StatusPedido.valueOf("PAGO");     // a constante (IllegalArgumentException se não existir)
StatusPedido.PAGO.name();         // "PAGO"
StatusPedido.PAGO.ordinal();      // 1 (posição na declaração)`)}
          <div class="note">Enums são singletons garantidos pela JVM: compare com <code>==</code> com segurança, inclusive contra null.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 8 switch exaustivo + EnumSet */
      fala: ['E combinam lindamente com o `switch` de expressão e com coleções próprias.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Switch exaustivo e EnumSet/EnumMap</div>
          ${api.codigo(`String txt = switch (status) {         // sem default: o compilador cobra os casos
    case AGUARDANDO, PAGO -> "Em processamento";
    case ENVIADO -> "A caminho";
    case ENTREGUE -> "Finalizado";
};
EnumSet<StatusPedido> ativos = EnumSet.of(PAGO, ENVIADO);   // rápido e enxuto
EnumMap<StatusPedido, Integer> contagem = new EnumMap<>(StatusPedido.class);`)}
          <div class="note"><code>EnumSet</code> e <code>EnumMap</code> são muito mais rápidos que Hash para chaves enum.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 9 nunca persistir ordinal */
      fala: ['Um erro que dá dor de cabeça em produção: **persistir o `ordinal`** no banco. Reordena o enum e veja.'],
      interativo: true, emocao: 'alerta', dica: 'Clique em "reordenar o enum"',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: numerar pela posição na fila</div>
            <div class="analogia-cena"><div class="grande">🔀</div><div>"mudou a ordem da fila, os números antigos apontam para o estado errado"</div></div></div>
          ${api.codigo(`// banco guardou ordinal: AGUARDANDO=0, PAGO=1, ENVIADO=2
// alguém insere CANCELADO no meio do enum...
enum StatusPedido { AGUARDANDO, CANCELADO, PAGO, ENVIADO }`)}
          <div class="palco-escolhas"><button class="chip" id="btn">reordenar o enum</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{ e.target.disabled=true; api.som('erro');
          const s=host.querySelector('#saida');s.style.display='block';
          s.innerHTML=`<span class="erro">O registro salvo como 1 agora lê CANCELADO em vez de PAGO. Dados corrompidos.</span>
<span class="ok">Persista name() (ou um código próprio e estável), nunca ordinal().</span>`;
          api.gsap.from(s,{y:10,opacity:0,duration:0.3}); api.reagir('alerta'); api.pronto('ordinal muda quando você reordena: nunca o guarde'); };
      },
    },
    { /* 10 quiz ordinal */
      fala: ['A pegadinha em uma pergunta:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">O que persistir no banco para um campo enum?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>ordinal()</code>: a posição é compacta</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>name()</code> ou um código próprio estável: reordenar o enum não corrompe os dados</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: name() é estável; ordinal quebra ao reordenar':'É o name(): ordinal muda quando o enum é reordenado');});
      },
    },
    { /* 11 final */
      fala: ['Fecha com a essência do enum:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; margin-bottom:12px">Por que um <code>enum</code> é melhor que constantes <code>String</code> para estados?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>É mais bonito no código</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Fecha o conjunto de valores (validado em compilação) e ainda carrega atributos e comportamento</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Perfeito: conjunto fechado, validado, com estado e comportamento':'É a B: enum restringe os valores e é uma classe completa');});
      },
    },
    { /* 12 recap */
      fala: ['Unidade de Collections fechada! Seis imagens.'],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [['🚦', 'Conjunto fechado', 'só os valores declarados existem'], ['🛑', 'Typo não compila', 'validado pelo compilador'], ['🧱', 'É uma classe', 'atributos, métodos, construtor private'], ['🎛️', 'Comportamento por constante', 'cada uma resolve o método'], ['⚡', 'EnumSet / EnumMap', 'coleções rápidas para enum'], ['💾', 'Nunca persista ordinal', 'grave name() ou código estável']];
        host.innerHTML = `<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i, t, d]) => `<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`;
        api.gsap.from(host.querySelectorAll('.recap-card'), { y: 26, opacity: 0, scale: 0.94, duration: 0.45, stagger: 0.08, ease: 'back.out(1.4)' });
      },
    },
  ],
});
