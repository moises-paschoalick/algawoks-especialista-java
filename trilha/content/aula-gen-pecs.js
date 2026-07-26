/**
 * Aula guiada · Wildcards, PECS e type erasure (módulo 17 · docs/page_03.md)
 * Analogia: caixa "só saída" (extends, produtor) x "só entrada" (super, consumidor).
 */
Aula.registrar({
  id: 'gen-pecs',
  licao: 'gen-pecs',
  titulo: 'Wildcards e PECS: caixa só-saída x só-entrada',
  personagem: { nome: 'Bean' },
  fechamento: 'Producer Extends, Consumer Super: extends para ler, super para escrever. E o type erasure apaga o tipo em runtime.',

  cenas: [
    { /* 1 */
      fala: ['Wildcards confundem porque parecem abstratos. A imagem resolve: uma **caixa só-saída** (você tira) e uma **caixa só-entrada** (você põe).'],
      palco(host, api) {
        host.innerHTML = `<div style="text-align:center">
          <div class="analogia" style="margin:0 auto 16px; max-width:460px"><div class="analogia-titulo">A ideia de hoje</div>
            <div class="analogia-cena"><div><div class="grande">📤</div><div>? extends<br>só saída (ler)</div></div><div><div class="grande">📥</div><div>? super<br>só entrada (escrever)</div></div></div></div>
          <div class="palco-titulo">Módulo 17 · Wildcards e PECS</div>
          <p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`;
        api.gsap.from(host.querySelectorAll('.analogia-cena > div'), { y: 20, opacity: 0, duration: 0.5, stagger: 0.14, ease: 'back.out(1.5)' });
      },
    },
    { /* 2 invariancia */
      fala: ['Primeiro, o susto: `List<Integer>` **não é** um `List<Number>`. Tenta atribuir.'],
      interativo: true, emocao: 'pensando', dica: 'Clique em "atribuir"',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: a caixa de "só maçãs" não é a caixa de "frutas"</div>
            <div class="analogia-cena"><div class="grande">🍎📦</div><div>"se fosse, alguém poria uma pera na caixa de maçãs"</div></div></div>
          ${api.codigo(`List<Integer> inteiros = new ArrayList<>();
List<Number> numeros = inteiros;   // ???`)}
          <div class="palco-escolhas"><button class="chip" id="btn">atribuir</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{ e.target.disabled=true; api.som('barrado');
          const s=host.querySelector('#saida');s.style.display='block';
          s.innerHTML=`<span class="erro">NÃO COMPILA: incompatible types</span>
<span class="neutro">Se compilasse, você poderia fazer numeros.add(3.14) e enfiar um Double na lista de Integer. Generics são invariantes por segurança.</span>`;
          api.gsap.from(s,{y:10,opacity:0,duration:0.3}); api.reagir('pensando'); api.pronto('List<Integer> não é List<Number>: por isso existem os wildcards'); };
      },
    },
    { /* 3 ? extends produtor */
      fala: ['A caixa **só-saída**: `? extends Number`. Você **lê** dela, mas não escreve. Testa.'],
      interativo: true, dica: 'Toque em ler e em escrever',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: a esteira de saída, você só retira</div>
            <div class="analogia-cena"><div class="grande">📤</div><div>"pega o que sai; não sabe o tipo exato para pôr"</div></div></div>
          ${api.codigo(`double somar(List<? extends Number> nums) {
    double t = 0;
    for (Number n : nums) t += n.doubleValue();   // LER: ok
    // nums.add(1);   ESCREVER: não compila
    return t;
}`)}
          <div class="palco-escolhas"><button class="chip" data-a="ler">n.doubleValue() (ler)</button><button class="chip" data-a="add">nums.add(1) (escrever)</button></div>
          <div class="saida" id="saida">Testa as duas operações</div>`;
        const s=host.querySelector('#saida'); const vistos=new Set();
        host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{ if(c.disabled)return; c.disabled=true; vistos.add(c.dataset.a);
          if(c.dataset.a==='ler'){ api.som('pop'); s.innerHTML='<span class="ok">Ler funciona: o que sai é sempre um Number.</span>'; }
          else { api.som('barrado'); c.classList.add('ativo'); s.innerHTML='<span class="erro">Escrever não compila: não dá para saber se é List de Integer, Double...</span>'; }
          if(vistos.size===2) api.pronto('extends = produtor: você só lê da caixa');
        });
      },
    },
    { /* 4 ? super consumidor */
      fala: ['A caixa **só-entrada**: `? super Integer`. Você **escreve** nela, mas ler só devolve `Object`.'],
      interativo: true, dica: 'Toque em escrever e em ler',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: a caixa de coleta, você só deposita</div>
            <div class="analogia-cena"><div class="grande">📥</div><div>"cabe Integer com certeza; o que já tem lá dentro é 'coisa'"</div></div></div>
          ${api.codigo(`void preencher(List<? super Integer> destino) {
    destino.add(1);           // ESCREVER Integer: ok
    destino.add(2);
    Object o = destino.get(0);   // LER: só como Object
}`)}
          <div class="palco-escolhas"><button class="chip" data-a="add">destino.add(1) (escrever)</button><button class="chip" data-a="get">get(0) (ler)</button></div>
          <div class="saida" id="saida">Testa as duas operações</div>`;
        const s=host.querySelector('#saida'); const vistos=new Set();
        host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{ if(c.disabled)return; c.disabled=true; vistos.add(c.dataset.a);
          if(c.dataset.a==='add'){ api.som('pop'); s.innerHTML='<span class="ok">Escrever Integer funciona: cabe em List de Integer, Number ou Object.</span>'; }
          else { api.som('clique'); s.innerHTML='<span class="neutro">Ler devolve só Object: não dá para garantir um tipo mais específico.</span>'; }
          if(vistos.size===2) api.pronto('super = consumidor: você só escreve na caixa');
        });
      },
    },
    { /* 5 nomear: PECS */
      fala: ['A regra que amarra tudo: **PECS**. Producer Extends, Consumer Super.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">O conceito, agora com nome</div>
          ${api.codigo(`// se a coleção PRODUZ valores para você ler -> extends
// se a coleção CONSOME valores que você escreve -> super

static <T> void copy(List<? super T> dest, List<? extends T> src) {
    for (T item : src) dest.add(item);   // src produz, dest consome
}`)}
          <div class="note">Producer Extends, Consumer Super. É a assinatura real de <code>Collections.copy</code>.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 6 quiz PECS */
      fala: ['Aplica o PECS:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Um método só vai <b>ler</b> Numbers de uma lista. Qual wildcard?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>List&lt;? super Number&gt;</code></span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>List&lt;? extends Number&gt;</code>: produtor, você lê dele</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: ler = producer = extends':'É extends: produtor, você lê da coleção');});
      },
    },
    { /* 7 tabela wildcards */
      fala: ['O resumo dos wildcards:'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Wildcards de relance</div>
          <table class="mini-tabela">
            <thead><tr><th>Tipo</th><th>Ler</th><th>Escrever</th><th>Use quando</th></tr></thead>
            <tbody>
              <tr><td>List&lt;T&gt;</td><td>T</td><td>T</td><td>lê e escreve</td></tr>
              <tr><td>? extends T</td><td>T</td><td>não</td><td>só lê (produtor)</td></tr>
              <tr><td>? super T</td><td>Object</td><td>T</td><td>só escreve (consumidor)</td></tr>
              <tr><td>?</td><td>Object</td><td>não</td><td>só a estrutura importa</td></tr>
            </tbody>
          </table>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 8 type erasure */
      fala: ['Última parte, e é a mais surpreendente: em runtime, a **etiqueta some**. É o type erasure. Executa.'],
      interativo: true, emocao: 'pensando', dica: 'Clique em executar',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: a etiqueta que cai no transporte</div>
            <div class="analogia-cena"><div class="grande">🏷️➡️❔</div><div>"chegou sem etiqueta: as duas caixas são 'ArrayList' e pronto"</div></div></div>
          ${api.codigo(`List<String> a = new ArrayList<>();
List<Integer> b = new ArrayList<>();
System.out.println(a.getClass() == b.getClass());   // ???`)}
          <div class="palco-escolhas"><button class="chip" id="btn">▶ executar</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{ e.target.disabled=true; api.som('revelar');
          const s=host.querySelector('#saida');s.style.display='block';
          s.innerHTML=`<span class="ok">true</span> <span class="neutro">as duas são só "ArrayList" em runtime.</span>
<span class="erro">Por isso não compilam: new T(), T[] new, x instanceof List&lt;String&gt;</span>`;
          api.gsap.from(s,{y:10,opacity:0,duration:0.3}); api.reagir('pensando'); api.pronto('Type erasure: o parâmetro de tipo existe só na compilação'); };
      },
    },
    { /* 9 quiz erasure */
      fala: ['Consequência do erasure:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Por que <code>new T()</code> não compila num método genérico?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Por bug do compilador</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>O type erasure apaga <code>T</code> em runtime; a JVM não sabe qual classe instanciar</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: sem o tipo em runtime, não há como fazer new T()':'É a B: o erasure apaga T, então new T() é impossível');});
      },
    },
    { /* 10 Class<T> workaround */
      fala: ['O contorno, quando você realmente precisa do tipo em runtime: passar um `Class<T>`.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">O contorno do erasure</div>
          ${api.codigo(`<T> T ler(String json, Class<T> tipo) {
    return mapper.readValue(json, tipo);   // o Class<T> carrega o tipo em runtime
}
Cliente c = ler(json, Cliente.class);`)}
          <div class="note">É o padrão que Jackson, Spring e outros frameworks usam para driblar o type erasure.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 11 final */
      fala: ['Fecha com o PECS:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; margin-bottom:12px">Um método vai <b>escrever</b> Integers numa lista destino. Qual assinatura?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>List&lt;? extends Integer&gt; destino</code></span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>List&lt;? super Integer&gt; destino</code>: consumidor, você escreve nele</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Perfeito: escrever = consumer = super':'É super: Consumer Super, você escreve na coleção');});
      },
    },
    { /* 12 recap */
      fala: ['Generics avançado no bolso. Seis imagens.'],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [['🚫', 'Invariância', 'List<Integer> não é List<Number>'], ['📤', '? extends = produtor', 'você lê da caixa (extends)'], ['📥', '? super = consumidor', 'você escreve na caixa (super)'], ['🔑', 'PECS', 'Producer Extends, Consumer Super'], ['🏷️', 'Type erasure', 'o tipo some em runtime'], ['🎫', 'Class<T> dribla', 'passe o tipo quando precisar dele em runtime']];
        host.innerHTML = `<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i, t, d]) => `<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`;
        api.gsap.from(host.querySelectorAll('.recap-card'), { y: 26, opacity: 0, scale: 0.94, duration: 0.45, stagger: 0.08, ease: 'back.out(1.4)' });
      },
    },
  ],
});
