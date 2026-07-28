/**
 * Aula guiada · Optional sem gambiarra (módulo 26 · docs/page_04.md)
 * Analogia: a caixa de encomenda que pode chegar vazia, com aviso na etiqueta.
 */
Aula.registrar({
  id: 'fun-optional',
  licao: 'fun-optional',
  titulo: 'Optional: a caixa que pode chegar vazia',
  personagem: { nome: 'Bean' },
  fechamento: 'Optional avisa no tipo que o valor pode faltar. orElse é eager, orElseGet é lazy. E nunca troque o if de null por isPresent + get.',

  cenas: [
    { /* 1 */
      fala: ['Optional é uma **caixa de encomenda que pode chegar vazia**, com um aviso na etiqueta: "aqui pode não ter nada".'],
      palco(host, api) {
        host.innerHTML = `<div style="text-align:center">
          <div class="analogia" style="margin:0 auto 16px; max-width:440px"><div class="analogia-titulo">A ideia de hoje</div>
            <div class="analogia-cena"><div><div class="grande">📦</div><div>pode ter valor</div></div><div><div class="grande">📭</div><div>ou chegar vazia</div></div></div></div>
          <div class="palco-titulo">Módulo 26 · Optional</div>
          <p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`;
        api.gsap.from(host.querySelectorAll('.analogia-cena > div'), { y: 20, opacity: 0, duration: 0.5, stagger: 0.14, ease: 'back.out(1.5)' });
      },
    },
    { /* 2 problema: null explode longe */
      fala: ['O problema que ele resolve: o `null` volado por um método explode **longe** da causa. Executa.'],
      interativo: true, emocao: 'alerta', dica: 'Clique em executar',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: a caixa vazia sem aviso na etiqueta</div>
            <div class="analogia-cena"><div class="grande">📭💥</div><div>"abre esperando algo, e não tem nada"</div></div></div>
          ${api.codigo(`Cliente c = repositorio.buscar(id);   // devolve null se não achar
String nome = c.getNome();             // NullPointerException, aqui`)}
          <div class="palco-escolhas"><button class="chip" id="btn">▶ executar</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{ e.target.disabled=true; api.som('erro');
          const boom=document.createElement('div');boom.className='boom';boom.textContent='💥';host.appendChild(boom);
          api.gsap.fromTo(boom,{scale:0,opacity:1},{scale:1.8,opacity:0,duration:0.7,onComplete:()=>boom.remove()});
          const s=host.querySelector('#saida');s.style.display='block';
          s.innerHTML=`<span class="erro">NullPointerException em getNome()</span>
<span class="neutro">O método devolveu null silenciosamente; o erro estoura longe de quem esqueceu de checar.</span>`;
          api.gsap.from(s,{y:10,opacity:0,duration:0.3}); api.reagir('alerta'); api.pronto('null não avisa que pode faltar: por isso o Optional existe'); };
      },
    },
    { /* 3 solucao: Optional no retorno */
      fala: ['O Optional torna a ausência **explícita no tipo**: quem chama é obrigado a lidar com o "pode não ter".'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">A ausência vira parte do contrato</div>
          ${api.codigo(`Optional<Cliente> buscar(Long id) { ... }   // o tipo já avisa

buscar(id)
    .map(Cliente::getNome)
    .ifPresent(System.out::println);   // só roda se houver valor`)}
          <div class="note">Use Optional como <b>tipo de retorno</b> de método. Ele diz "a resposta pode estar vazia".</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 4 nomear */
      fala: ['Isso é o **Optional**: um contêiner que contém um valor ou está vazio. Criar é assim:'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">O conceito, agora com nome</div>
          ${api.codigo(`Optional<String> a = Optional.of("valor");     // NPE se for null
Optional<String> b = Optional.ofNullable(pode);  // aceita null
Optional<String> c = Optional.empty();           // vazia`)}
          <div class="note"><code>of</code> exige valor; <code>ofNullable</code> aceita null; <code>empty</code> é a caixa vazia.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 5 consumo */
      fala: ['Para tirar o valor com segurança, há vários jeitos. Toca em cada um.'],
      interativo: true, dica: 'Toque nas quatro formas',
      palco(host, api) {
        const d={orElse:'devolve um padrão pronto se estiver vazia', orElseGet:'devolve um padrão CARO só se estiver vazia (lazy)', orElseThrow:'lança uma exceção se estiver vazia', ifPresent:'executa uma ação só se houver valor'};
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: o que fazer se a caixa vier vazia</div>
            <div class="analogia-cena"><div class="grande">📦❓</div><div>"padrão? erro? ignora?"</div></div></div>
          <div class="palco-escolhas"><button class="chip" data-k="orElse">orElse</button><button class="chip" data-k="orElseGet">orElseGet</button><button class="chip" data-k="orElseThrow">orElseThrow</button><button class="chip" data-k="ifPresent">ifPresent</button></div>
          <div class="saida" id="saida">Toque para ver cada consumo</div>`;
        const s=host.querySelector('#saida'); const vistos=new Set();
        host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{ host.querySelectorAll('.chip').forEach(x=>x.classList.remove('ativo'));c.classList.add('ativo');api.som('clique');
          s.innerHTML=`<span class="neutro"><b>${c.dataset.k}</b>: ${d[c.dataset.k]}</span>`; vistos.add(c.dataset.k);
          if(vistos.size===4) api.pronto('Do padrão pronto ao erro: escolha conforme o caso'); });
      },
    },
    { /* 6 orElse x orElseGet */
      fala: ['A pegadinha campeã: `orElse` x `orElseGet`. Executa e veja quando o padrão roda.'],
      interativo: true, emocao: 'pensando', dica: 'Clique em executar',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: preparar o padrão sempre x só quando precisa</div>
            <div class="analogia-cena"><div class="grande">🏭</div><div>"orElse já cozinha o padrão; orElseGet só se faltar"</div></div></div>
          ${api.codigo(`Optional<String> nome = Optional.of("Ana");   // tem valor!
nome.orElse(buscarPadraoCaro());       // buscarPadraoCaro RODA mesmo assim
nome.orElseGet(() -> buscarPadraoCaro());   // NÃO roda: já tem valor`)}
          <div class="palco-escolhas"><button class="chip" id="btn">▶ executar</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{ e.target.disabled=true; api.som('barrado');
          const s=host.querySelector('#saida');s.style.display='block';
          s.innerHTML=`<span class="erro">orElse: buscarPadraoCaro() executou (à toa), mesmo com valor presente.</span>
<span class="ok">orElseGet: só executaria se a caixa estivesse vazia.</span>`;
          api.gsap.from(s,{y:10,opacity:0,duration:0.3}); api.reagir('pensando'); api.pronto('orElse é eager (sempre avalia); orElseGet é lazy'); };
      },
    },
    { /* 7 quiz orElse */
      fala: ['A pergunta direta:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">O padrão vem de uma consulta CARA ao banco. Qual usar?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>orElse(consultaBanco())</code>: executa a consulta sempre</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>orElseGet(() -> consultaBanco())</code>: só executa se estiver vazia</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: padrão caro pede orElseGet (lazy)':'É orElseGet: evita a consulta quando já há valor');});
      },
    },
    { /* 8 encadear */
      fala: ['O melhor do Optional é **encadear** sem uma cascata de ifs de null.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Encadear com map / flatMap</div>
          ${api.codigo(`String cidade = buscarCliente(id)
    .map(Cliente::getEndereco)
    .map(Endereco::getCidade)
    .map(String::toUpperCase)
    .orElse("NAO INFORMADO");

buscarCliente(id).filter(Cliente::isAtivo);   // descarta o que não passa`)}
          <div class="note">Use <code>flatMap</code> quando o próprio método já devolve Optional.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 9 anti-patterns */
      fala: ['E o que NÃO fazer. Qual destes desperdiça o Optional?'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Qual é o anti-pattern de Optional?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>if (o.isPresent()) o.get()</code>: só troca o if de null por outro if</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>o.map(...).orElse(...)</code></span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span><code>o.ifPresent(...)</code></span></button>
          </div>
          <div class="note">Também evite: Optional como campo ou parâmetro, e <code>Optional&lt;List&gt;</code> (devolva lista vazia).</div>`;
        const ok=0; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: isPresent + get é o if de null disfarçado':'O anti-pattern é isPresent + get; prefira map/orElse/ifPresent');});
      },
    },
    { /* 10 quiz retorno */
      fala: ['Onde o Optional deve viver?'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Onde é o lugar certo do Optional?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Como campo de classe e parâmetro de método</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Como <b>tipo de retorno</b>, para sinalizar que a resposta pode estar vazia</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: Optional é para retorno':'É para retorno; em campo/parâmetro é anti-pattern');});
      },
    },
    { /* 11 final */
      fala: ['Fecha com a pegadinha:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; margin-bottom:12px">Diferença entre <code>orElse</code> e <code>orElseGet</code>?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>São iguais</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>orElse</code> avalia o argumento sempre (eager); <code>orElseGet</code> só se estiver vazia (lazy)</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Perfeito: eager x lazy':'É a B: orElse eager, orElseGet lazy');});
      },
    },
    { /* 12 recap */
      fala: ['Optional no bolso. Seis imagens.'],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [['📭', 'Ausência explícita', 'a caixa avisa que pode vir vazia'], ['↩️', 'Use como retorno', 'nunca em campo ou parâmetro'], ['⚡', 'orElse é eager', 'avalia o padrão sempre'], ['💤', 'orElseGet é lazy', 'padrão caro? use este'], ['🔗', 'map / flatMap', 'encadeia sem if de null'], ['🚫', 'isPresent + get, não', 'é o if de null disfarçado']];
        host.innerHTML = `<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i, t, d]) => `<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`;
        api.gsap.from(host.querySelectorAll('.recap-card'), { y: 26, opacity: 0, scale: 0.94, duration: 0.45, stagger: 0.08, ease: 'back.out(1.4)' });
      },
    },
  ],
});
