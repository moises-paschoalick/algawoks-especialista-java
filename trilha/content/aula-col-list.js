/**
 * Aula guiada · List: ArrayList vs LinkedList (módulo 18 · docs/page_02.md)
 * Analogia: cadeiras numeradas (ArrayList) x trem de vagões (LinkedList).
 */
Aula.registrar({
  id: 'col-list',
  licao: 'col-list',
  titulo: 'ArrayList x LinkedList: cadeiras numeradas x trem',
  personagem: { nome: 'Bean' },
  fechamento: 'ArrayList é o padrão: acesso direto por índice. E cuidado com remove(int) x remove(Object) e com a exceção de modificar durante o for.',

  cenas: [
    { /* 1 */
      fala: ['Duas Lists, dois jeitos de guardar. A imagem: **cadeiras numeradas** (ArrayList) contra um **trem de vagões** (LinkedList).'],
      palco(host, api) {
        host.innerHTML = `<div style="text-align:center">
          <div class="analogia" style="margin:0 auto 16px; max-width:440px"><div class="analogia-titulo">A ideia de hoje</div>
            <div class="analogia-cena"><div><div class="grande">🪑</div><div>ArrayList<br>cadeiras numeradas</div></div><div><div class="grande">🚃</div><div>LinkedList<br>trem de vagões</div></div></div></div>
          <div class="palco-titulo">Módulo 18 · List</div>
          <p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`;
        api.gsap.from(host.querySelectorAll('.analogia-cena > div'), { y: 20, opacity: 0, duration: 0.5, stagger: 0.14, ease: 'back.out(1.5)' });
      },
    },
    { /* 2 acesso por indice */
      fala: ['Pega o item na posição 3. Na cadeira numerada você vai direto; no trem, vagão a vagão.'],
      interativo: true, dica: 'Toque em "get(3)" nas duas',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia"><div class="analogia-titulo">Mundo real: achar o assento 3</div>
            <div class="analogia-cena"><div class="grande">🎯</div><div>"número na poltrona x andar pelo corredor"</div></div></div>
          <div style="margin-bottom:8px"><div style="font-size:0.7rem; color:var(--dim); margin-bottom:4px">ArrayList</div>
            <div class="vagas" id="al">${[0,1,2,3,4].map(i=>`<div class="vaga ocupada">${i}</div>`).join('')}</div></div>
          <div><div style="font-size:0.7rem; color:var(--dim); margin-bottom:4px">LinkedList</div>
            <div class="trem" id="ll">${[0,1,2,3,4].map((i,k)=>`<div class="vagao">${i}</div>${k<4?'<span class="elo">→</span>':''}`).join('')}</div></div>
          <div class="palco-escolhas"><button class="chip" id="btn">get(3)</button></div>
          <div class="saida" id="saida">Onde está a posição 3?</div>`;
        host.querySelector('#btn').onclick = e => {
          e.target.disabled = true;
          host.querySelectorAll('#al .vaga')[3].classList.add('destaque'); api.som('pop');
          const vag = host.querySelectorAll('#ll .vagao');
          [0,1,2,3].forEach((idx,k)=>setTimeout(()=>{ vag[idx].classList.add('destaque'); if(k<3) setTimeout(()=>vag[idx].classList.remove('destaque'),260); api.som('clique'); },240*k));
          setTimeout(()=>{ const s=host.querySelector('#saida'); s.innerHTML=`<span class="ok">ArrayList: O(1)</span> pula direto para o índice.  <span class="erro">LinkedList: O(n)</span> anda vagão a vagão.`;
            api.gsap.from(s,{y:10,opacity:0,duration:0.3}); api.reagir('feliz'); api.pronto('Acesso por índice é o forte do ArrayList'); },1100);
        };
      },
    },
    { /* 3 quiz get */
      fala: ['Fixando a complexidade:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:14px">Qual o custo de <code>get(i)</code> em cada uma?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Ambas O(1)</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>ArrayList O(1); LinkedList O(n), pois percorre os nós</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>ArrayList O(n); LinkedList O(1)</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: índice direto x percorrer nós':'É a B: ArrayList acessa por índice, LinkedList percorre');});
      },
    },
    { /* 4 inserir no inicio */
      fala: ['Inserir no **início** é o oposto: o ArrayList empurra todos; o trem só religa um engate.'],
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: furar a fila no começo</div>
            <div class="analogia-cena"><div class="grande">↩️</div><div>"todos andam uma cadeira x só engata um vagão novo"</div></div></div>
          <div class="compara">
            <div class="compara-col antes"><h4>ArrayList.add(0, x)</h4>${api.codigo(`// O(n): empurra
// todos os elementos
// uma posição à frente`)}</div>
            <div class="compara-col depois"><h4>LinkedList.addFirst(x)</h4>${api.codigo(`// O(1): só religa
// os ponteiros do
// primeiro nó`)}</div>
          </div>
          <div class="note">Na prática o ArrayList vence quase sempre pela localidade de memória. Para muita inserção nas pontas, prefira <code>ArrayDeque</code>.</div>`;
        api.gsap.from(host.querySelectorAll('.compara-col, .note'), { y: 20, opacity: 0, duration: 0.45, stagger: 0.15, ease: 'power2.out' });
      },
    },
    { /* 5 ArrayList é o padrão */
      fala: ['Na dúvida, **ArrayList**. É o padrão para 95% dos casos.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">O padrão do dia a dia</div>
          ${api.codigo(`List<String> nomes = new ArrayList<>();
nomes.add("Ana");
nomes.get(0);
nomes.set(0, "Bia");
nomes.contains("Ana");
nomes.size();
nomes.forEach(System.out::println);`)}
          <div class="note">LinkedList só compensa em cenários raros de muita inserção/remoção nas pontas.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 6 remove(int) x remove(Object) */
      fala: ['Pegadinha de entrevista: numa `List<Integer>`, o que `lista.remove(1)` faz?'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          ${api.codigo(`List<Integer> l = new ArrayList<>(List.of(10, 20, 30));
l.remove(1);   // ???`)}
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Remove o <b>valor</b> 1 (não existe, nada acontece)</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Remove o <b>índice</b> 1 (o valor 20); <code>remove(Integer.valueOf(1))</code> removeria o valor</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: remove(int) é índice; para valor use Integer.valueOf':'É a B: remove(1) é índice; remove(Integer.valueOf(1)) é valor');});
      },
    },
    { /* 7 CME problema */
      fala: ['Última armadilha, e cai muito: alterar a lista **durante** o for-each. Executa.'],
      interativo: true, emocao: 'alerta', dica: 'Clique em executar',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: reorganizar a fila enquanto a percorre</div>
            <div class="analogia-cena"><div class="grande">🚫</div><div>"tirar gente da fila enquanto conta: você se perde"</div></div></div>
          ${api.codigo(`for (String nome : nomes) {
    if (nome.startsWith("A")) nomes.remove(nome);   // altera durante o for
}`)}
          <div class="palco-escolhas"><button class="chip" id="btn">▶ executar</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick = e => { e.target.disabled = true; api.som('erro');
          const boom=document.createElement('div');boom.className='boom';boom.textContent='💥';host.appendChild(boom);
          api.gsap.fromTo(boom,{scale:0,opacity:1},{scale:1.8,opacity:0,duration:0.7,onComplete:()=>boom.remove()});
          const s=host.querySelector('#saida');s.style.display='block';
          s.innerHTML=`<span class="erro">ConcurrentModificationException</span>
<span class="neutro">O iterador percebe que a lista mudou por baixo dele e aborta.</span>`;
          api.gsap.from(s,{y:10,opacity:0,duration:0.3}); api.reagir('alerta'); api.pronto('Modificar a coleção durante o for-each quebra o iterador'); };
      },
    },
    { /* 8 as 3 solucoes */
      fala: ['Três saídas limpas para remover durante a iteração.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Como remover com segurança</div>
          ${api.codigo(`nomes.removeIf(n -> n.startsWith("A"));   // 1. a mais limpa

Iterator<String> it = nomes.iterator();    // 2. Iterator explícito
while (it.hasNext()) {
    if (it.next().startsWith("A")) it.remove();
}

for (String n : new ArrayList<>(nomes)) {   // 3. itere sobre uma cópia
    if (n.startsWith("A")) nomes.remove(n);
}`)}
          <div class="note"><code>removeIf</code> resolve a maioria dos casos em uma linha.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 9 quiz CME */
      fala: ['A pergunta direta:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Como remover elementos durante a iteração sem <code>ConcurrentModificationException</code>?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Chamar <code>list.remove()</code> dentro do for-each mesmo</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>removeIf</code>, ou <code>Iterator.remove()</code>, ou iterar sobre uma cópia</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: removeIf, Iterator.remove ou cópia':'É a B: nunca list.remove() dentro do for-each');});
      },
    },
    { /* 10 conversao array<->list */
      fala: ['E a ponte entre os dois mundos: array vira List e volta.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Array ↔ List</div>
          ${api.codigo(`String[] arr = {"a", "b", "c"};
List<String> fixa    = Arrays.asList(arr);            // view de tamanho fixo
List<String> mutavel = new ArrayList<>(Arrays.asList(arr));
String[] devolta     = lista.toArray(new String[0]);`)}
          <div class="note"><code>Arrays.asList</code> devolve uma view de tamanho fixo: aceita <code>set</code>, mas <code>add</code> lança exceção.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 11 final */
      fala: ['Fecha com a decisão prática:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; margin-bottom:12px">Você acessa muito por índice e raramente insere no meio. Qual List?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>LinkedList</code></span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>ArrayList</code>: acesso por índice em O(1) e melhor localidade de memória</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Perfeito: acesso por índice = ArrayList':'É o ArrayList: índice direto e mais rápido na prática');});
      },
    },
    { /* 12 recap */
      fala: ['List no bolso. Seis imagens.'],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [['🪑', 'ArrayList = índice O(1)', 'cadeira numerada, acesso direto'], ['🚃', 'LinkedList = O(n)', 'trem: percorre nó a nó'], ['⭐', 'ArrayList é o padrão', 'vence quase sempre'], ['🔢', 'remove(int) é índice', 'valor: remove(Integer.valueOf(x))'], ['💥', 'CME no for-each', 'não altere a lista enquanto itera'], ['🧹', 'removeIf salva', 'ou Iterator.remove, ou cópia']];
        host.innerHTML = `<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i, t, d]) => `<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`;
        api.gsap.from(host.querySelectorAll('.recap-card'), { y: 26, opacity: 0, scale: 0.94, duration: 0.45, stagger: 0.08, ease: 'back.out(1.4)' });
      },
    },
  ],
});
