/**
 * Aula guiada · Lambdas e interfaces funcionais (módulo 25 · docs/page_04.md)
 * Analogia: entregar a receita (comportamento como valor), não o prato pronto.
 */
Aula.registrar({
  id: 'fun-lambda',
  licao: 'fun-lambda',
  titulo: 'Lambdas: entregue a receita, não o prato',
  personagem: { nome: 'Bean' },
  fechamento: 'Lambda passa comportamento como valor. Interface funcional tem um método só. E a variável capturada precisa ser efetivamente final.',

  cenas: [
    { /* 1 */
      fala: ['Lambda parece bicho de sete cabeças, mas é simples: em vez de entregar o **prato pronto**, você entrega a **receita** para o método executar.'],
      palco(host, api) {
        host.innerHTML = `<div style="text-align:center">
          <div class="analogia" style="margin:0 auto 16px; max-width:440px"><div class="analogia-titulo">A ideia de hoje</div>
            <div class="analogia-cena"><div><div class="grande">🍽️</div><div>o prato<br>(valor)</div></div><div><div class="grande">📋</div><div>a receita<br>(comportamento)</div></div></div></div>
          <div class="palco-titulo">Módulo 25 · Lambdas e method reference</div>
          <p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`;
        api.gsap.from(host.querySelectorAll('.analogia-cena > div'), { y: 20, opacity: 0, duration: 0.5, stagger: 0.14, ease: 'back.out(1.5)' });
      },
    },
    { /* 2 problema: classe anonima */
      fala: ['Antes do Java 8, passar comportamento era uma **classe anônima** gigante. Toca para ver o tamanho.'],
      interativo: true, emocao: 'pensando', dica: 'Clique em "revelar"',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: escrever a receita inteira à mão toda vez</div>
            <div class="analogia-cena"><div class="grande">📝</div><div>"só para dizer 'ordene por nome'..."</div></div></div>
          <div class="palco-escolhas"><button class="chip" id="btn">revelar a classe anônima</button></div>
          <div id="host" style="margin-top:12px"></div>`;
        host.querySelector('#btn').onclick=e=>{ e.target.disabled=true; api.som('barrado'); api.reagir('pensando');
          host.querySelector('#host').innerHTML=api.codigo(`Collections.sort(nomes, new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return a.compareTo(b);
    }
});   // 5 linhas para uma única expressão`);
          api.pronto('Muito cerimônia para uma linha de lógica de verdade'); };
      },
    },
    { /* 3 solucao: lambda */
      fala: ['A lambda joga fora a cerimônia e deixa só a **receita**. Toca para transformar.'],
      interativo: true, emocao: 'feliz', dica: 'Clique em "virar lambda"',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: entregar só o passo que importa</div>
            <div class="analogia-cena"><div class="grande">📋➡️</div><div>"compare a por b, e pronto"</div></div></div>
          <div id="host">${api.codigo(`Collections.sort(nomes, new Comparator<String>() {
    public int compare(String a, String b) { return a.compareTo(b); }
});`)}</div>
          <div class="palco-escolhas"><button class="chip" id="btn">virar lambda</button></div>`;
        host.querySelector('#btn').onclick=e=>{ e.target.disabled=true; api.som('acerto'); api.reagir('feliz');
          host.querySelector('#host').innerHTML=api.codigo(`nomes.sort((a, b) -> a.compareTo(b));`);
          api.gsap.fromTo(host.querySelector('#host'),{scale:0.9,opacity:0.4},{scale:1,opacity:1,duration:0.5,ease:'back.out(1.6)'});
          api.pronto('Uma linha. O compilador infere os tipos e o resto'); };
      },
    },
    { /* 4 nomear: interface funcional */
      fala: ['A lambda só cabe onde há uma **interface funcional**: uma interface com **um único método abstrato**.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">O conceito, agora com nome</div>
          ${api.codigo(`@FunctionalInterface
interface Validador<T> {
    boolean valida(T valor);       // um método abstrato só
}

Validador<String> naoVazio = s -> s != null && !s.isBlank();`)}
          <div class="note"><code>@FunctionalInterface</code> faz o compilador garantir que há exatamente um método abstrato.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 5 interfaces do JDK */
      fala: ['O JDK já traz as principais. Liga cada uma ao seu trabalho.'],
      interativo: true, dica: 'Toque nas quatro interfaces',
      palco(host, api) {
        const d={Function:'recebe T, devolve R (transforma): usada no map', Predicate:'recebe T, devolve boolean (testa): usada no filter', Consumer:'recebe T, não devolve nada (age): usada no forEach', Supplier:'não recebe nada, devolve T (fornece): usada no orElseGet'};
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: a ferramenta certa para cada tarefa</div>
            <div class="analogia-cena"><div class="grande">🧰</div><div>"transforma? testa? consome? fornece?"</div></div></div>
          <div class="palco-escolhas"><button class="chip" data-k="Function">Function</button><button class="chip" data-k="Predicate">Predicate</button><button class="chip" data-k="Consumer">Consumer</button><button class="chip" data-k="Supplier">Supplier</button></div>
          <div class="saida" id="saida">Toque para ver o papel de cada uma</div>`;
        const s=host.querySelector('#saida'); const vistos=new Set();
        host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{ host.querySelectorAll('.chip').forEach(x=>x.classList.remove('ativo'));c.classList.add('ativo');api.som('clique');
          s.innerHTML=`<span class="neutro"><b>${c.dataset.k}</b>: ${d[c.dataset.k]}</span>`; vistos.add(c.dataset.k);
          if(vistos.size===4) api.pronto('Transforma, testa, consome, fornece: as quatro do dia a dia'); });
      },
    },
    { /* 6 quiz interface */
      fala: ['Aplica:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Você precisa TESTAR se um produto está ativo (devolve true/false). Qual interface?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>Function&lt;Produto, Boolean&gt;</code></span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>Predicate&lt;Produto&gt;</code>: recebe e devolve boolean</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span><code>Consumer&lt;Produto&gt;</code></span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: testar = Predicate':'É Predicate: teste que devolve boolean');});
      },
    },
    { /* 7 method reference */
      fala: ['Quando a lambda só chama um método, dá para encurtar com **method reference**: as 4 formas.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Method reference · 4 formas</div>
          ${api.codigo(`Integer::parseInt        // método estático        s -> Integer.parseInt(s)
System.out::println      // instância específica    s -> System.out.println(s)
String::toUpperCase      // instância arbitrária    s -> s.toUpperCase()
ArrayList::new           // construtor              () -> new ArrayList<>()`)}
          <div class="note">Leia como "o método que essa lambda ia chamar, sem o boilerplate".</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 8 compor */
      fala: ['E dá para **encadear** comportamentos com andThen e compose.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Compor funções</div>
          ${api.codigo(`Function<Integer,Integer> dobrar = x -> x * 2;
Function<Integer,Integer> somarUm = x -> x + 1;

dobrar.andThen(somarUm).apply(5);   // 11: dobra, depois soma
dobrar.compose(somarUm).apply(5);   // 12: soma, depois dobra

Predicate<String> valido = naoVazio.and(s -> s.length() < 50);`)}
          <div class="note"><code>andThen</code> executa na ordem escrita; <code>compose</code> na ordem inversa.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 9 efetivamente final */
      fala: ['Uma pegadinha: a lambda só captura variável **efetivamente final**. Tenta incrementar um contador dentro dela.'],
      interativo: true, emocao: 'alerta', dica: 'Clique em executar',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: a receita não pode reescrever os ingredientes de fora</div>
            <div class="analogia-cena"><div class="grande">🔒</div><div>"o que a lambda captura, ela não reatribui"</div></div></div>
          ${api.codigo(`int contador = 0;
nomes.forEach(n -> contador++);   // não compila`)}
          <div class="palco-escolhas"><button class="chip" id="btn">▶ compilar</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{ e.target.disabled=true; api.som('barrado');
          const s=host.querySelector('#saida');s.style.display='block';
          s.innerHTML=`<span class="erro">ERRO: variable used in lambda should be final or effectively final</span>
<span class="neutro">A variável capturada não pode ser reatribuída. Para contar, use um contador próprio ou reduce/count.</span>`;
          api.gsap.from(s,{y:10,opacity:0,duration:0.3}); api.reagir('alerta'); api.pronto('Efetivamente final: a lambda lê a variável, mas não a reescreve'); };
      },
    },
    { /* 10 quiz method ref */
      fala: ['Uma de sintaxe:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Como escrever <code>s -> System.out.println(s)</code> como method reference?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>System.out::println</code></span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>System::out.println</code></span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span><code>println::System.out</code></span></button>
          </div>`;
        const ok=0; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: objeto::metodo':'É System.out::println: o objeto, dois-pontos, o método');});
      },
    },
    { /* 11 final */
      fala: ['Fecha com a essência:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; margin-bottom:12px">Onde uma lambda pode ser usada?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Em qualquer interface</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Onde se espera uma interface funcional (um único método abstrato)</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Só dentro de streams</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Perfeito: interface funcional = um método abstrato':'É a B: onde há uma interface funcional');});
      },
    },
    { /* 12 recap */
      fala: ['Lambdas no bolso. Seis imagens.'],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [['📋', 'Comportamento como valor', 'entregue a receita, não o prato'], ['1️⃣', 'Interface funcional', 'um único método abstrato'], ['🧰', '4 interfaces do JDK', 'Function, Predicate, Consumer, Supplier'], ['🔗', 'Method reference', '<code>Objeto::metodo</code>, sem boilerplate'], ['➕', 'andThen / compose', 'encadeia comportamentos'], ['🔒', 'Efetivamente final', 'a lambda não reatribui o que captura']];
        host.innerHTML = `<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i, t, d]) => `<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`;
        api.gsap.from(host.querySelectorAll('.recap-card'), { y: 26, opacity: 0, scale: 0.94, duration: 0.45, stagger: 0.08, ease: 'back.out(1.4)' });
      },
    },
  ],
});
