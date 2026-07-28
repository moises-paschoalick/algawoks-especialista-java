/**
 * Aula guiada · Streams: o pipeline (módulo 27 · docs/page_04.md)
 * Analogia: a linha de montagem (esteira): fonte -> estações lazy -> terminal.
 */
Aula.registrar({
  id: 'fun-streams',
  licao: 'fun-streams',
  titulo: 'Streams: a linha de montagem',
  personagem: { nome: 'Bean' },
  fechamento: 'Stream é uma esteira: fonte, estações lazy, operação terminal. Nada roda sem o terminal, e cada stream é de uso único.',

  cenas: [
    { /* 1 */
      fala: ['Stream é uma **linha de montagem**: a coleção entra por uma ponta, passa por estações e sai transformada na outra.'],
      palco(host, api) {
        host.innerHTML = `<div style="text-align:center">
          <div class="analogia" style="margin:0 auto 16px; max-width:440px"><div class="analogia-titulo">A ideia de hoje</div>
            <div class="analogia-cena"><div class="grande">🏭➡️📦</div><div>"fonte → filtra → transforma → coleta"</div></div></div>
          <div class="palco-titulo">Módulo 27 · Streams API</div>
          <p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`;
        api.gsap.from(host.querySelector('.analogia-cena'), { y: 20, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' });
      },
    },
    { /* 2 problema: loop imperativo */
      fala: ['Sem stream, você monta tudo na mão: um loop, um if, uma lista acumuladora. Toca para ver.'],
      interativo: true, emocao: 'pensando', dica: 'Clique em "revelar o loop"',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: montar cada peça manualmente</div>
            <div class="analogia-cena"><div class="grande">🔧</div><div>"filtra, transforma e junta, tudo à mão"</div></div></div>
          <div class="palco-escolhas"><button class="chip" id="btn">revelar o loop imperativo</button></div>
          <div id="host" style="margin-top:12px"></div>`;
        host.querySelector('#btn').onclick=e=>{ e.target.disabled=true; api.som('barrado'); api.reagir('pensando');
          host.querySelector('#host').innerHTML=api.codigo(`List<String> nomes = new ArrayList<>();
for (Produto p : produtos) {
    if (p.getPreco() > 100) {
        nomes.add(p.getNome().toUpperCase());
    }
}`);
          api.pronto('O que você quer (filtrar, transformar) some no meio do como'); };
      },
    },
    { /* 3 solucao: pipeline */
      fala: ['O stream declara **o que** você quer, em uma esteira legível. Toca para converter.'],
      interativo: true, emocao: 'feliz', dica: 'Clique em "virar stream"',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: a esteira com estações rotuladas</div>
            <div class="analogia-cena"><div class="grande">🏭</div><div>"cada estação faz uma coisa"</div></div></div>
          <div id="host">${api.codigo(`// o mesmo, mas imperativo (loop + if + add)`)}</div>
          <div class="palco-escolhas"><button class="chip" id="btn">virar stream</button></div>`;
        host.querySelector('#btn').onclick=e=>{ e.target.disabled=true; api.som('acerto'); api.reagir('feliz');
          host.querySelector('#host').innerHTML=api.codigo(`List<String> nomes = produtos.stream()      // FONTE
    .filter(p -> p.getPreco() > 100)           // estação (lazy)
    .map(p -> p.getNome().toUpperCase())       // estação (lazy)
    .toList();                                 // TERMINAL`);
          api.gsap.from(host.querySelector('#host'),{y:12,opacity:0,duration:0.4});
          api.pronto('Fonte, estações, terminal: a esteira do stream'); };
      },
    },
    { /* 4 nomear: pipeline */
      fala: ['A anatomia: **fonte** → operações **intermediárias** (lazy) → operação **terminal** (dispara tudo).'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">O conceito, agora com nome</div>
          ${api.codigo(`produtos.stream()               // 1. FONTE
    .filter(p -> p.ativo())      // 2. INTERMEDIÁRIA (lazy)
    .map(Produto::getNome)       //    INTERMEDIÁRIA (lazy)
    .sorted()                    //    INTERMEDIÁRIA (lazy)
    .toList();                   // 3. TERMINAL (executa o pipeline)`)}
          <div class="note">Intermediárias devolvem outro stream e não fazem nada sozinhas. Só a terminal roda a esteira.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 5 lazy */
      fala: ['Prova disso: um stream **sem terminal** não executa nada. Roda e veja.'],
      interativo: true, emocao: 'pensando', dica: 'Clique nos dois botões',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: a esteira desligada</div>
            <div class="analogia-cena"><div class="grande">🔌</div><div>"as estações existem, mas nada anda até ligar"</div></div></div>
          ${api.codigo(`produtos.stream().filter(p -> { System.out.println("passou"); return true; });`)}
          <div class="palco-escolhas"><button class="chip" id="b1">▶ sem terminal</button><button class="chip" id="b2">▶ com .count()</button></div>
          <div class="saida" id="saida">Compare os dois</div>`;
        const s=host.querySelector('#saida'); const vistos=new Set();
        host.querySelector('#b1').onclick=e=>{ e.target.disabled=true; api.som('clique'); vistos.add(1);
          s.innerHTML=`<span class="erro">Saída: (nada). O filter nem rodou: falta o terminal.</span>`;
          if(vistos.size===2) api.pronto('Sem terminal, a esteira fica parada. Bug clássico de quem esquece o collect'); };
        host.querySelector('#b2').onclick=e=>{ e.target.disabled=true; api.som('pop'); vistos.add(2);
          s.innerHTML=`<span class="ok">Saída: passou, passou, passou... o .count() ligou a esteira.</span>`;
          if(vistos.size===2) api.pronto('Sem terminal, a esteira fica parada. Bug clássico de quem esquece o collect'); };
      },
    },
    { /* 6 quiz lazy */
      fala: ['Confirma:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Um stream só com <code>filter</code> e <code>map</code>, sem operação terminal, faz o quê?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Executa o filter e o map na hora</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Nada: intermediárias são lazy; sem terminal o pipeline não roda</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: sem terminal, nada acontece':'É a B: intermediárias são lazy');});
      },
    },
    { /* 7 map x flatMap */
      fala: ['A confusão nº1 dos streams: `map` x `flatMap`. Escolhe o certo para achatar listas.'],
      interativo: true, dica: 'Escolha a operação',
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Cada pedido tem uma lista de itens. Você quer <b>todos</b> os itens num stream só.</h2>
          ${api.codigo(`pedidos.stream().___(p -> p.getItens().stream())`)}
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>map</code>: vira <code>Stream&lt;List&lt;Item&gt;&gt;</code> (listas aninhadas)</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>flatMap</code>: achata tudo num <code>Stream&lt;Item&gt;</code></span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: flatMap achata N streams em um':'É flatMap: map deixaria listas aninhadas');});
      },
    },
    { /* 8 collectors */
      fala: ['E a estação terminal mais poderosa é o `collect`, com os Collectors.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Collectors do dia a dia</div>
          ${api.codigo(`.collect(groupingBy(Produto::getCategoria))          // Map<Cat, List<Produto>>
.collect(groupingBy(Produto::getCategoria, counting()))  // Map<Cat, Long>
.collect(joining(", ", "[", "]"))                     // String "[a, b, c]"
.collect(toMap(Produto::getNome, Produto::getPreco))  // cuidado: chave duplicada`)}
          <div class="note"><code>groupingBy</code> agrupa, <code>joining</code> junta em texto, <code>toMap</code> vira mapa. Também: <code>mapToInt(...).sum()</code> evita boxing.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 9 uso unico */
      fala: ['Última regra: um stream é de **uso único**. Depois do terminal, acabou. Tenta reusar.'],
      interativo: true, emocao: 'alerta', dica: 'Clique em executar',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: a esteira que só roda um lote</div>
            <div class="analogia-cena"><div class="grande">🎫</div><div>"passou o lote, a esteira se fecha"</div></div></div>
          ${api.codigo(`Stream<Produto> s = produtos.stream();
s.count();     // terminal 1
s.forEach(...);  // reusar o MESMO stream`)}
          <div class="palco-escolhas"><button class="chip" id="btn">▶ executar</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{ e.target.disabled=true; api.som('erro');
          const s=host.querySelector('#saida');s.style.display='block';
          s.innerHTML=`<span class="erro">IllegalStateException: stream has already been operated upon or closed</span>
<span class="neutro">Precisa de outro? Crie um stream novo a partir da coleção.</span>`;
          api.gsap.from(s,{y:10,opacity:0,duration:0.3}); api.reagir('alerta'); api.pronto('Uso único: um terminal por stream'); };
      },
    },
    { /* 10 quiz map/flatMap */
      fala: ['Fixando o par:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Qual a diferença entre <code>map</code> e <code>flatMap</code>?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>São a mesma coisa</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>map</code> transforma 1→1; <code>flatMap</code> achata N streams em um só</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: map 1 para 1, flatMap achata':'É a B: flatMap achata os streams');});
      },
    },
    { /* 11 final */
      fala: ['Fecha com o essencial:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; margin-bottom:12px">O que dispara a execução de um pipeline de stream?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>A primeira operação intermediária (filter/map)</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>A operação terminal (collect, count, forEach, toList...)</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Perfeito: a terminal liga a esteira':'É a terminal que executa o pipeline');});
      },
    },
    { /* 12 recap */
      fala: ['Streams no bolso. Seis imagens.'],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [['🏭', 'Fonte → estações → terminal', 'a esteira do stream'], ['🔌', 'Intermediárias são lazy', 'sem terminal, nada roda'], ['📤', 'map (1→1)', 'transforma cada elemento'], ['🌊', 'flatMap (N→1)', 'achata streams aninhados'], ['📦', 'collect + Collectors', 'groupingBy, joining, toMap'], ['🎫', 'Uso único', 'um terminal por stream']];
        host.innerHTML = `<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i, t, d]) => `<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`;
        api.gsap.from(host.querySelectorAll('.recap-card'), { y: 26, opacity: 0, scale: 0.94, duration: 0.45, stagger: 0.08, ease: 'back.out(1.4)' });
      },
    },
  ],
});
