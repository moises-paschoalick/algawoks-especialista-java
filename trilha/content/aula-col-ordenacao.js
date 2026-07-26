/**
 * Aula guiada · Comparable e Comparator (módulo 18 · docs/page_02.md)
 * Analogia: régua embutida (Comparable) x régua externa combinável (Comparator).
 */
Aula.registrar({
  id: 'col-ordenacao',
  licao: 'col-ordenacao',
  titulo: 'Comparable x Comparator: régua embutida x régua externa',
  personagem: { nome: 'Bean' },
  fechamento: 'Comparable é a ordem natural da classe; Comparator são ordens externas combináveis. E nunca ordene subtraindo: use Integer.compare.',

  cenas: [
    { /* 1 */
      fala: ['Ordenar tem dois caminhos: a **régua embutida** na classe (`Comparable`) e **réguas externas** combináveis (`Comparator`).'],
      palco(host, api) {
        host.innerHTML = `<div style="text-align:center">
          <div class="analogia" style="margin:0 auto 16px; max-width:440px"><div class="analogia-titulo">A ideia de hoje</div>
            <div class="analogia-cena"><div><div class="grande">📏</div><div>Comparable<br>régua embutida</div></div><div><div class="grande">⚖️</div><div>Comparator<br>régua externa</div></div></div></div>
          <div class="palco-titulo">Módulo 18 · Ordenação</div>
          <p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`;
        api.gsap.from(host.querySelectorAll('.analogia-cena > div'), { y: 20, opacity: 0, duration: 0.5, stagger: 0.14, ease: 'back.out(1.5)' });
      },
    },
    { /* 2 ordem natural */
      fala: ['A classe pode ter uma **ordem natural**: implementa `Comparable` e o `sort` já sabe ordenar.'],
      interativo: true, dica: 'Clique em "ordenar por preço"',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: a fila por senha</div>
            <div class="analogia-cena"><div class="grande">🎫</div><div>"a ordem já vem definida"</div></div></div>
          ${api.codigo(`class Produto implements Comparable<Produto> {
    public int compareTo(Produto o) {
        return Double.compare(this.preco, o.preco);   // do barato ao caro
    }
}`)}
          <div class="trem" id="lista"><div class="vagao">30</div><div class="vagao">10</div><div class="vagao">20</div></div>
          <div class="palco-escolhas"><button class="chip" id="btn">Collections.sort(lista)</button></div>
          <div class="saida" id="saida">Desordenado: 30, 10, 20</div>`;
        host.querySelector('#btn').onclick=e=>{ e.target.disabled=true; api.som('pop');
          host.querySelector('#lista').innerHTML='<div class="vagao destaque">10</div><div class="vagao destaque">20</div><div class="vagao destaque">30</div>';
          api.gsap.from('#lista .vagao',{y:-12,opacity:0,duration:0.3,stagger:0.08,ease:'back.out(2)'});
          host.querySelector('#saida').innerHTML='<span class="ok">Ordenado: 10, 20, 30</span> pela régua interna (compareTo)';
          api.reagir('feliz'); api.pronto('Comparable dá à classe uma ordem natural única'); };
      },
    },
    { /* 3 nomear comparable */
      fala: ['Isso é o **Comparable**: `compareTo` devolve negativo (vem antes), zero (igual) ou positivo (vem depois).'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">O conceito, agora com nome</div>
          ${api.codigo(`// negativo: this vem antes | zero: equivalentes | positivo: this vem depois
public int compareTo(Produto o) {
    return Double.compare(this.preco, o.preco);
}
Collections.sort(produtos);   // usa a ordem natural`)}
          <div class="note">É a ordem usada por <code>Collections.sort</code>, <code>TreeSet</code> e <code>TreeMap</code>. Uma classe tem só uma ordem natural.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 4 comparator externo */
      fala: ['E se eu quiser ordenar por **outro** critério? Aí entra o `Comparator`, a régua externa. Escolhe o critério.'],
      interativo: true, dica: 'Toque nos três critérios',
      palco(host, api) {
        const d={nome:'Comparator.comparing(Produto::getNome)', preco:'Comparator.comparingDouble(Produto::getPreco)', estoque:'Comparator.comparingInt(Produto::getEstoque).reversed()'};
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: o juiz que ordena por vários critérios</div>
            <div class="analogia-cena"><div class="grande">⚖️</div><div>"por nome? por preço? do maior estoque?"</div></div></div>
          <div class="palco-escolhas"><button class="chip" data-k="nome">por nome</button><button class="chip" data-k="preco">por preço</button><button class="chip" data-k="estoque">por estoque (desc)</button></div>
          <div class="saida" id="saida">Escolha uma régua externa</div>`;
        const s=host.querySelector('#saida'); const vistos=new Set();
        host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{ host.querySelectorAll('.chip').forEach(x=>x.classList.remove('ativo'));c.classList.add('ativo');api.som('clique');
          s.innerHTML=`<span class="ok">produtos.sort(${d[c.dataset.k]});</span>`; vistos.add(c.dataset.k);
          if(vistos.size===3) api.pronto('Uma classe, quantas ordens você quiser: essa é a força do Comparator'); });
      },
    },
    { /* 5 thenComparing */
      fala: ['E dá pra **encadear** critérios de desempate com `thenComparing`.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Vários critérios em cadeia</div>
          ${api.codigo(`produtos.sort(
    Comparator.comparing(Produto::getCategoria)          // 1º: categoria
              .thenComparing(Produto::getPreco,           // 2º: preço desc
                             Comparator.reverseOrder())
              .thenComparing(Produto::getNome));          // 3º: nome`)}
          <div class="note">Nulos por último: <code>Comparator.nullsLast(Comparator.naturalOrder())</code>.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 6 quiz comparable x comparator */
      fala: ['A distinção que cai em prova:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Você quer ordenar uma classe de <b>terceiros</b> (sem alterá-la) por 3 critérios diferentes. O que usa?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>Comparable</code>: implementar <code>compareTo</code> na classe</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>Comparator</code>: réguas externas, várias e sem tocar na classe</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: Comparator não exige alterar a classe e permite várias ordens':'É o Comparator: externo, múltiplo, sem mexer na classe');});
      },
    },
    { /* 7 nunca subtrair */
      fala: ['Armadilha silenciosa: ordenar **subtraindo** inteiros. Executa e veja o desastre.'],
      interativo: true, emocao: 'alerta', dica: 'Clique em executar',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: a régua que estoura e mede errado</div>
            <div class="analogia-cena"><div class="grande">📏💥</div><div>"a - b transborda o int e inverte a ordem"</div></div></div>
          ${api.codigo(`// ERRADO: a - b pode estourar o int
Comparator<Integer> ruim = (a, b) -> a - b;
// com a = 2_000_000_000 e b = -2_000_000_000, a - b transborda`)}
          <div class="palco-escolhas"><button class="chip" id="btn">▶ comparar valores grandes</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{ e.target.disabled=true; api.som('erro');
          const s=host.querySelector('#saida');s.style.display='block';
          s.innerHTML=`<span class="erro">a - b transbordou: resultado negativo virou positivo, ordem invertida.</span>
<span class="ok">Certo: Integer.compare(a, b) (ou Double.compare) nunca estoura.</span>`;
          api.gsap.from(s,{y:10,opacity:0,duration:0.3}); api.reagir('alerta'); api.pronto('Nunca subtraia para comparar: use Integer.compare'); };
      },
    },
    { /* 8 quiz subtrair */
      fala: ['Confirma:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Como comparar dois <code>int</code> num Comparator com segurança?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>(a, b) -> a - b</code></span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>Integer.compare(a, b)</code>, que não estoura</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: Integer.compare é seguro contra overflow':'É a B: a - b pode transbordar; use Integer.compare');});
      },
    },
    { /* 9 consistencia com equals */
      fala: ['Um detalhe fino: em `TreeSet`/`TreeMap`, se `compareTo` devolve 0 para objetos que `equals` considera diferentes, um deles some.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Consistência com equals</div>
          ${api.codigo(`// TreeSet usa APENAS compareTo para decidir igualdade
// se compareTo(a, b) == 0, o TreeSet trata a e b como duplicata
TreeSet<Produto> set = new TreeSet<>(Comparator.comparing(Produto::getPreco));
// dois produtos de mesmo preço: um é descartado, mesmo sendo diferentes`)}
          <div class="note">Mantenha <code>compareTo</code> consistente com <code>equals</code>, ou inclua um critério de desempate único.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 10 reversed/nullsLast */
      fala: ['Dois ajustes que aparecem sempre: inverter e tratar nulos.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">reversed e nullsLast</div>
          ${api.codigo(`produtos.sort(Comparator.comparingDouble(Produto::getPreco).reversed());  // caro -> barato

produtos.sort(Comparator.comparing(Produto::getNome,
                        Comparator.nullsLast(Comparator.naturalOrder())));   // nulos no fim`)}
          <div class="note"><code>reversed()</code> inverte a ordem; <code>nullsFirst/nullsLast</code> decidem onde os nulos ficam.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 11 final */
      fala: ['Fecha com a decisão:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; margin-bottom:12px">Sua própria classe tem UMA ordem óbvia (ex.: valor). O que implementar?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>Comparable</code> com <code>compareTo</code>: a ordem natural da classe</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Sempre um <code>Comparator</code> externo</span></button>
          </div>`;
        const ok=0; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Perfeito: ordem óbvia e única = Comparable':'É Comparable: a ordem natural embutida; Comparator para ordens alternativas');});
      },
    },
    { /* 12 recap */
      fala: ['Ordenação no bolso. Seis imagens.'],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [['📏', 'Comparable', 'a ordem natural, única, na classe'], ['⚖️', 'Comparator', 'réguas externas, várias, combináveis'], ['🔗', 'thenComparing', 'critérios de desempate em cadeia'], ['💥', 'Nunca subtraia', 'use Integer.compare (a-b estoura)'], ['🌳', 'TreeSet e o 0', 'compareTo consistente com equals'], ['↕️', 'reversed / nullsLast', 'inverter e posicionar nulos']];
        host.innerHTML = `<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i, t, d]) => `<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`;
        api.gsap.from(host.querySelectorAll('.recap-card'), { y: 26, opacity: 0, scale: 0.94, duration: 0.45, stagger: 0.08, ease: 'back.out(1.4)' });
      },
    },
  ],
});
