/**
 * Aula guiada · Set, Map e o papel do hashCode (módulo 18 · docs/page_02.md)
 * Analogia: guarda-volumes (hashCode = gaveta, equals = crachá).
 */
Aula.registrar({
  id: 'col-set-map',
  licao: 'col-set-map',
  titulo: 'Set e Map: o porteiro do hashCode',
  personagem: { nome: 'Bean' },
  fechamento: 'O Set acha o balde pelo hashCode e confirma com equals. Esqueça o hashCode e o objeto some ou duplica.',

  cenas: [
    { /* 1 */
      fala: ['O `Set` não aceita duplicata. Como ele sabe? A imagem: um **guarda-volumes** onde o `hashCode` é a **gaveta** e o `equals` é o **crachá**.'],
      palco(host, api) {
        host.innerHTML = `<div style="text-align:center">
          <div class="analogia" style="margin:0 auto 16px; max-width:440px"><div class="analogia-titulo">A ideia de hoje</div>
            <div class="analogia-cena"><div><div class="grande">🗄️</div><div>hashCode<br>= a gaveta</div></div><div><div class="grande">🪪</div><div>equals<br>= o crachá</div></div></div></div>
          <div class="palco-titulo">Módulo 18 · Set e Map</div>
          <p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`;
        api.gsap.from(host.querySelectorAll('.analogia-cena > div'), { y: 20, opacity: 0, duration: 0.5, stagger: 0.14, ease: 'back.out(1.5)' });
      },
    },
    { /* 2 rejeita duplicata */
      fala: ['Adiciona "Ana" duas vezes num Set e veja o tamanho.'],
      interativo: true, dica: 'Clique em add duas vezes',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: lista de convidados sem repetir</div>
            <div class="analogia-cena"><div class="grande">✋</div><div>"já está na lista? não entra de novo"</div></div></div>
          ${api.codigo(`Set<String> nomes = new HashSet<>();
nomes.add("Ana");
nomes.add("Ana");`)}
          <div class="vagas" id="set"></div>
          <div class="palco-escolhas"><button class="chip" id="btn">add("Ana")</button></div>
          <div class="saida" id="saida">size() = 0</div>`;
        const set=host.querySelector('#set'); let n=0,box=0;
        host.querySelector('#btn').onclick=()=>{ n++;
          if(box===0){ box=1; const v=document.createElement('div');v.className='vaga ocupada';v.textContent='Ana';v.style.width='auto';v.style.padding='0 10px';set.appendChild(v);api.gsap.from(v,{scale:0,duration:0.25,ease:'back.out(2)'});api.som('pop'); host.querySelector('#saida').innerHTML='<span class="ok">size() = 1</span>'; }
          else { api.som('barrado'); host.querySelector('#saida').innerHTML=`<span class="neutro">2 adds, size() ainda = 1: a duplicata foi barrada.</span>`; host.querySelector('#btn').disabled=true; api.pronto('O Set rejeitou a segunda Ana. Mas COMO ele sabe que é a mesma?'); }
        };
      },
    },
    { /* 3 baldes */
      fala: ['Assim: o `hashCode` diz a **gaveta** (balde), e o `equals` confirma se é o mesmo. Distribui os itens.'],
      interativo: true, dica: 'Toque nos três itens',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: cada item vai para uma gaveta pelo código</div>
            <div class="analogia-cena"><div class="grande">🗄️</div><div>"o hash decide a gaveta; o crachá confirma quem é"</div></div></div>
          <div class="baldes" id="baldes">${[0,1,2].map(i=>`<div class="balde" data-b="${i}"><div class="balde-num">balde ${i}</div></div>`).join('')}</div>
          <div class="palco-escolhas">
            <button class="chip" data-h="0" data-v="Ana">Ana</button><button class="chip" data-h="2" data-v="Bia">Bia</button><button class="chip" data-h="0" data-v="Cid">Cid</button>
          </div>
          <div class="saida" id="saida">hashCode() aponta o balde de cada um.</div>`;
        const s=host.querySelector('#saida'); const vistos=new Set();
        host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{ if(c.disabled)return; c.disabled=true; api.som('pop');
          const balde=host.querySelector(`.balde[data-b="${c.dataset.h}"]`); const it=document.createElement('div');it.className='balde-item';it.textContent=c.dataset.v;balde.appendChild(it);
          balde.classList.add(balde.querySelectorAll('.balde-item').length>1?'colisao':'acesa');
          api.gsap.from(it,{y:-14,opacity:0,duration:0.3});
          vistos.add(c.dataset.v);
          if(vistos.size===3) s.innerHTML=`<span class="neutro">Ana e Cid caíram no mesmo balde (mesmo hash): aí o <b>equals</b> desempata quem é quem.</span>`, api.pronto('hashCode acha o balde; equals confirma a identidade');
        });
      },
    },
    { /* 4 nomear contrato */
      fala: ['Esse é o **contrato**: objetos iguais por `equals` **têm de ter** o mesmo `hashCode`.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">O conceito, agora com nome</div>
          ${api.codigo(`@Override public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Cliente c)) return false;
    return Objects.equals(cpf, c.cpf);     // identidade de negócio
}
@Override public int hashCode() {
    return Objects.hash(cpf);              // MESMO campo do equals
}`)}
          <div class="note">Sobrescreva os dois juntos, com os mesmos campos, de preferência imutáveis.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 5 esquecer hashCode */
      fala: ['E se você sobrescrever só o `equals` e esquecer o `hashCode`? Executa.'],
      interativo: true, emocao: 'alerta', dica: 'Clique em executar',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: dois crachás iguais em gavetas diferentes</div>
            <div class="analogia-cena"><div class="grande">🗄️❓</div><div>"procura na gaveta errada e não acha"</div></div></div>
          ${api.codigo(`// Cliente sobrescreve equals por cpf, mas NÃO o hashCode
Set<Cliente> set = new HashSet<>();
set.add(new Cliente("111"));
set.add(new Cliente("111"));   // mesmo cpf`)}
          <div class="palco-escolhas"><button class="chip" id="btn">▶ executar</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{ e.target.disabled=true; api.som('erro');
          const s=host.querySelector('#saida');s.style.display='block';
          s.innerHTML=`<span class="erro">set.size() == 2: os dois clientes "iguais" entraram!</span>
<span class="neutro">Sem hashCode, eles caem em baldes diferentes e o equals nunca é consultado. Bug silencioso, sem exceção.</span>`;
          api.gsap.from(s,{y:10,opacity:0,duration:0.3}); api.reagir('alerta'); api.pronto('equals sem hashCode: o objeto some ou duplica no Set/Map'); };
      },
    },
    { /* 6 quiz contrato */
      fala: ['A pergunta que sempre cai:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Por que sobrescrever <code>hashCode</code> junto com <code>equals</code>?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Por estilo, não muda nada</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Set/Map usam o hashCode para achar o balde; sem ele, objetos iguais caem em baldes diferentes e o equals nunca confirma</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: o contrato hashCode/equals é obrigatório para Set/Map':'É a B: sem hashCode consistente, o Set não encontra a duplicata');});
      },
    },
    { /* 7 escolher impl */
      fala: ['Três Sets, três garantias de ordem. Toca em cada um.'],
      interativo: true, dica: 'Toque nas três implementações',
      palco(host, api) {
        const d={HashSet:'sem ordem, O(1): o padrão quando só quero unicidade', LinkedHashSet:'ordem de inserção, O(1)', TreeSet:'ordenado, O(log n): quando preciso dos itens em ordem'};
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: sem ordem, na ordem de chegada, ou ordenado</div>
            <div class="analogia-cena"><div class="grande">🗂️</div><div>"a ordem que você precisa decide a implementação"</div></div></div>
          <div class="palco-escolhas"><button class="chip" data-k="HashSet">HashSet</button><button class="chip" data-k="LinkedHashSet">LinkedHashSet</button><button class="chip" data-k="TreeSet">TreeSet</button></div>
          <div class="saida" id="saida">Toque para ver a garantia de ordem</div>`;
        const s=host.querySelector('#saida'); const vistos=new Set();
        host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{ host.querySelectorAll('.chip').forEach(x=>x.classList.remove('ativo'));c.classList.add('ativo');api.som('clique');
          s.innerHTML=`<span class="neutro"><b>${c.dataset.k}</b>: ${d[c.dataset.k]}</span>`; vistos.add(c.dataset.k);
          if(vistos.size===3) api.pronto('HashSet no geral; TreeSet quando a ordem importa'); });
      },
    },
    { /* 8 Map operacoes */
      fala: ['O `Map` tem operações que evitam o `if de null`. Conta as palavras clicando.'],
      interativo: true, dica: 'Clique em "contar" algumas vezes',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: o contador na portaria</div>
            <div class="analogia-cena"><div class="grande">🔢</div><div>"soma 1 na chave, criando a entrada se não existe"</div></div></div>
          ${api.codigo(`Map<String,Integer> contagem = new HashMap<>();
contagem.merge("java", 1, Integer::sum);   // cria com 1 ou soma 1`)}
          <div class="saida" id="saida">contagem = { }</div>
          <div class="palco-escolhas"><button class="chip" id="btn">merge("java", 1)</button></div>`;
        let c=0; host.querySelector('#btn').onclick=()=>{ if(c>=4)return; c++; api.som('pop');
          host.querySelector('#saida').innerHTML=`<span class="ok">contagem = { java=${c} }</span>`;
          if(c===4) api.pronto('merge e computeIfAbsent substituem o get-checa-null-put'); };
      },
    },
    { /* 9 computeIfAbsent */
      fala: ['E `computeIfAbsent` agrupa em listas sem você checar null.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Agrupar sem if de null</div>
          ${api.codigo(`Map<String,List<Produto>> porCategoria = new HashMap<>();
for (Produto p : produtos) {
    porCategoria
        .computeIfAbsent(p.categoria(), k -> new ArrayList<>())
        .add(p);   // cria a lista na primeira vez, reusa depois
}`)}
          <div class="note">Também: <code>getOrDefault(chave, 0)</code> evita NPE ao ler uma chave ausente.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 10 quiz map impl */
      fala: ['Escolha de Map:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Você precisa das chaves sempre <b>ordenadas</b>. Qual Map?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>HashMap</code></span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>TreeMap</code>: mantém as chaves ordenadas, O(log n)</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span><code>LinkedHashMap</code></span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: TreeMap ordena as chaves':'É o TreeMap; HashMap não tem ordem, LinkedHashMap guarda a de inserção');});
      },
    },
    { /* 11 final */
      fala: ['Fecha com o contrato:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; margin-bottom:12px">Você usa um objeto como chave de HashMap e ele some. Causa provável?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>O HashMap está cheio</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>equals/hashCode inconsistentes (ou um campo do hashCode mudou depois de inserir)</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Perfeito: hashCode inconsistente ou mutável derruba a busca':'É a B: o problema é o contrato hashCode/equals, use campos imutáveis');});
      },
    },
    { /* 12 recap */
      fala: ['Set e Map no bolso. Seis imagens.'],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [['🗄️', 'hashCode = gaveta', 'aponta o balde do elemento'], ['🪪', 'equals = crachá', 'confirma a identidade no balde'], ['🤝', 'Contrato', 'iguais por equals → mesmo hashCode'], ['👻', 'Esqueceu hashCode?', 'o objeto some ou duplica'], ['🗂️', 'Escolha a ordem', 'Hash (nenhuma), Linked (inserção), Tree (ordenada)'], ['🔢', 'merge/computeIfAbsent', 'contadores e agrupamentos sem if de null']];
        host.innerHTML = `<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i, t, d]) => `<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`;
        api.gsap.from(host.querySelectorAll('.recap-card'), { y: 26, opacity: 0, scale: 0.94, duration: 0.45, stagger: 0.08, ease: 'back.out(1.4)' });
      },
    },
  ],
});
