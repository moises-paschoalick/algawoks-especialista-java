/**
 * Aula guiada · Arrays e a hierarquia do framework (módulos 8 e 18 · docs/page_02.md)
 * Analogia: estacionamento de vagas fixas (array) x sanfona que estica (List).
 */
Aula.registrar({
  id: 'col-hierarquia',
  licao: 'col-hierarquia',
  titulo: 'Arrays e Collections: vagas fixas x sanfona',
  personagem: { nome: 'Bean' },
  fechamento: 'Array é vaga fixa; Collection estica. Map guarda pares e fica fora da Collection. Programe sempre para a interface.',

  cenas: [
    { /* 1 */
      fala: [
        'Guardar vários itens: a escolha começa entre **array** e **Collection**.',
        'A imagem: um **estacionamento de vagas fixas** contra uma **sanfona** que estica conforme precisa.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div style="text-align:center">
            <div class="analogia" style="margin:0 auto 16px; max-width:440px">
              <div class="analogia-titulo">A ideia de hoje</div>
              <div class="analogia-cena"><div><div class="grande">🅿️</div><div>array: vagas fixas</div></div><div><div class="grande">🪗</div><div>List: sanfona</div></div></div>
            </div>
            <div class="palco-titulo">Módulos 8 e 18 · Arrays e Collections</div>
            <p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p>
          </div>`;
        api.gsap.from(host.querySelectorAll('.analogia-cena > div'), { y: 20, opacity: 0, duration: 0.5, stagger: 0.14, ease: 'back.out(1.5)' });
      },
    },
    { /* 2 array fixo */
      fala: ['O **array** tem tamanho fixo, decidido na criação. Enche 5 vagas e tenta a sexta.'],
      interativo: true, emocao: 'pensando', dica: 'Clique em "estacionar" até lotar',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: estacionamento de 5 vagas</div>
            <div class="analogia-cena"><div class="grande">🅿️</div><div>"lotou? não cabe mais um carro"</div></div>
          </div>
          ${api.codigo(`int[] vagas = new int[5];   // tamanho fixo: 5`)}
          <div class="vagas" id="vagas">${'<div class="vaga">·</div>'.repeat(5)}</div>
          <div class="palco-escolhas"><button class="chip" id="btn">estacionar</button></div>
          <div class="saida" id="saida">5 vagas, nem uma a mais.</div>`;
        const vagas = [...host.querySelectorAll('.vaga')]; let n = 0;
        host.querySelector('#btn').onclick = e => {
          if (n < 5) { vagas[n].classList.add('ocupada'); vagas[n].textContent = '🚗'; api.som('pop'); n++;
            if (n === 5) host.querySelector('#saida').innerHTML = '<span class="neutro">Cheio. Clique mais uma vez para tentar a sexta.</span>';
          } else {
            e.target.disabled = true; api.som('barrado');
            const boom = document.createElement('div'); boom.className = 'boom'; boom.textContent = '💥'; host.appendChild(boom);
            api.gsap.fromTo(boom, { scale: 0, opacity: 1 }, { scale: 1.8, opacity: 0, duration: 0.7, onComplete: () => boom.remove() });
            host.querySelector('#saida').innerHTML = `<span class="erro">vagas[5] = ... → ArrayIndexOutOfBoundsException</span>
<span class="neutro">Array não cresce. Para isso existe a Collection.</span>`;
            api.reagir('alerta'); api.pronto('Tamanho fixo é a marca do array');
          }
        };
      },
    },
    { /* 3 quiz array */
      fala: ['A característica que define o array:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:14px">O que caracteriza um array em Java?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Cresce automaticamente conforme você adiciona</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Tem <b>tamanho fixo</b> definido na criação; acesso por índice em O(1)</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Só guarda objetos, nunca primitivos</span></button>
          </div>`;
        const ok = 1;
        host.querySelectorAll('.option').forEach(b => b.onclick = () => { const e = Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o, i) => { o.classList.add('disabled'); o.onclick = null; if (i === ok) o.classList.add('right'); else if (i === e) o.classList.add('wrong'); });
          api.registrarResposta(e === ok); api.pronto(e === ok ? 'Isso: tamanho fixo, acesso direto por índice' : 'É a B: array é fixo; e guarda primitivos também (int[])'); });
      },
    },
    { /* 4 List cresce */
      fala: ['A **List** é a sanfona: estica sozinha. Adiciona quantos quiser.'],
      interativo: true, emocao: 'feliz', dica: 'Clique em "add" várias vezes',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: a sanfona que estica</div>
            <div class="analogia-cena"><div class="grande">🪗</div><div>"sempre cabe mais um"</div></div>
          </div>
          ${api.codigo(`List<String> lista = new ArrayList<>();
lista.add("item");   // cresce sem limite fixo`)}
          <div class="vagas" id="vagas"></div>
          <div class="palco-escolhas"><button class="chip" id="btn">lista.add(...)</button></div>
          <div class="saida" id="saida">size() = 0</div>`;
        const vagas = host.querySelector('#vagas'); let n = 0;
        host.querySelector('#btn').onclick = () => {
          if (n >= 8) return; n++; api.som('pop');
          const v = document.createElement('div'); v.className = 'vaga ocupada'; v.textContent = n; vagas.appendChild(v);
          api.gsap.from(v, { scale: 0, duration: 0.25, ease: 'back.out(2)' });
          host.querySelector('#saida').innerHTML = `<span class="ok">size() = ${n}</span>`;
          if (n === 8) { api.reagir('feliz'); api.pronto('A Collection cresce sob demanda: essa é a diferença para o array'); }
        };
      },
    },
    { /* 5 nomear: hierarquia */
      fala: ['Essa família tem uma **hierarquia**. Tudo começa em `Iterable` e `Collection`.'],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">O conceito, agora com nome</div>
          ${api.codigo(`Iterable
  └── Collection
        ├── List   ordenada, aceita duplicatas, índice
        ├── Set    sem duplicatas
        └── Queue  fila (FIFO)

Map (FORA de Collection)   pares chave -> valor`)}
          <div class="note">Escolha pela necessidade: ordem e repetição (List), unicidade (Set), fila (Queue), pares (Map).</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 6 tour List/Set/Queue */
      fala: ['Cada uma resolve uma necessidade. Liga a estrutura ao caso de uso.'],
      interativo: true, dica: 'Toque nas três estruturas',
      palco(host, api) {
        const dados = { List: 'ordem importa e pode repetir (histórico de eventos)', Set: 'só itens únicos (CPFs cadastrados)', Queue: 'primeiro que entra, primeiro que sai (fila de senhas)' };
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: a estrutura certa para cada caso</div>
            <div class="analogia-cena"><div class="grande">🧰</div><div>"ordem? unicidade? fila?"</div></div>
          </div>
          <div class="palco-escolhas">
            <button class="chip" data-k="List">List</button><button class="chip" data-k="Set">Set</button><button class="chip" data-k="Queue">Queue</button>
          </div>
          <div class="saida" id="saida">Toque para ver o uso típico</div>`;
        const s = host.querySelector('#saida'); const vistos = new Set();
        host.querySelectorAll('.chip').forEach(c => c.onclick = () => {
          host.querySelectorAll('.chip').forEach(x => x.classList.remove('ativo')); c.classList.add('ativo'); api.som('clique');
          s.innerHTML = `<span class="neutro"><b>${c.dataset.k}</b>: ${dados[c.dataset.k]}</span>`; vistos.add(c.dataset.k);
          if (vistos.size === 3) api.pronto('Escolha a estrutura pela necessidade, não pelo hábito');
        });
      },
    },
    { /* 7 Map fora de Collection */
      fala: ['O **Map** é o caso especial: guarda **pares** chave/valor e **não** estende Collection.'],
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: o dicionário (palavra -> significado)</div>
            <div class="analogia-cena"><div class="grande">📖</div><div>"você busca pela chave, não pela posição"</div></div>
          </div>
          ${api.codigo(`Map<String, Integer> estoque = new HashMap<>();
estoque.put("caneta", 10);
estoque.get("caneta");   // busca pela CHAVE

// Map não tem iterator(); você percorre keySet(), values() ou entrySet()`)}
          <div class="note">Map guarda pares, não elementos soltos. Por isso fica fora da hierarquia de Collection.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 8 quiz Map */
      fala: ['Pegadinha frequente:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:14px"><code>Map</code> estende <code>Collection</code>?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Sim, é uma Collection de pares</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Não: guarda pares chave/valor e fica fora de Collection; percorre-se por keySet/values/entrySet</span></button>
          </div>`;
        const ok = 1;
        host.querySelectorAll('.option').forEach(b => b.onclick = () => { const e = Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o, i) => { o.classList.add('disabled'); o.onclick = null; if (i === ok) o.classList.add('right'); else if (i === e) o.classList.add('wrong'); });
          api.registrarResposta(e === ok); api.pronto(e === ok ? 'Isso: Map não é Collection' : 'É a B: Map guarda pares e não estende Collection'); });
      },
    },
    { /* 9 programe para a interface */
      fala: ['Regra de ouro: declare pela **interface**, instancie pela classe. Trocar a implementação depois não quebra nada.'],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Programe para a interface</div>
          <div class="compara">
            <div class="compara-col antes"><h4>✗ tipo concreto vaza</h4>${api.codigo(`ArrayList<String> nomes =
    new ArrayList<>();`)}</div>
            <div class="compara-col depois"><h4>✓ interface na assinatura</h4>${api.codigo(`List<String> nomes =
    new ArrayList<>();
Map<String,Integer> m =
    new HashMap<>();`)}</div>
          </div>
          <div class="note">Assim você troca ArrayList por LinkedList (ou HashMap por TreeMap) sem mexer em quem usa.</div>`;
        api.gsap.from(host.querySelectorAll('.compara-col, .note'), { y: 20, opacity: 0, duration: 0.45, stagger: 0.15, ease: 'power2.out' });
      },
    },
    { /* 10 imutaveis */
      fala: ['Precisa de uma coleção fixa e segura? `List.of` cria uma **imutável**. Tenta alterar.'],
      interativo: true, emocao: 'alerta', dica: 'Clique em "add"',
      palco(host, api) {
        host.innerHTML = `
          ${api.codigo(`List<String> fixa = List.of("a", "b");   // Java 9+, imutável
fixa.add("c");`)}
          <div class="palco-escolhas"><button class="chip" id="btn">fixa.add("c")</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick = e => {
          e.target.disabled = true; api.som('barrado');
          const s = host.querySelector('#saida'); s.style.display = 'block';
          s.innerHTML = `<span class="erro">UnsupportedOperationException</span>
<span class="neutro">List.of, Map.of e List.copyOf devolvem coleções imutáveis: ninguém altera depois.</span>`;
          api.gsap.from(s, { y: 10, opacity: 0, duration: 0.3 }); api.reagir('alerta');
          api.pronto('Imutável protege o estado, igual ao que você viu em records');
        };
      },
    },
    { /* 11 final */
      fala: ['Fecha com a escolha do dia a dia:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; margin-bottom:12px">Você precisa guardar itens que crescem e podem repetir, com ordem. Qual usar?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Um <code>int[]</code></span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Uma <code>List</code> (ex.: ArrayList)</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Um <code>Set</code></span></button>
          </div>`;
        const ok = 1;
        host.querySelectorAll('.option').forEach(b => b.onclick = () => { const e = Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o, i) => { o.classList.add('disabled'); o.onclick = null; if (i === ok) o.classList.add('right'); else if (i === e) o.classList.add('wrong'); });
          api.registrarResposta(e === ok); api.pronto(e === ok ? 'Perfeito: cresce, ordena e repete = List' : 'É a List: array não cresce, Set não repete'); });
      },
    },
    { /* 12 recap */
      fala: ['Base de Collections no bolso. Seis imagens.'],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [['🅿️', 'Array é vaga fixa', 'tamanho definido na criação'], ['🪗', 'Collection estica', 'List, Set, Queue crescem'], ['🌳', 'Hierarquia', 'Iterable → Collection → List/Set/Queue'], ['📖', 'Map é à parte', 'guarda pares, fora de Collection'], ['🔗', 'Interface na assinatura', 'troque a implementação sem quebrar'], ['🔒', 'List.of imutável', 'coleção fixa e segura']];
        host.innerHTML = `<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i, t, d]) => `<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`;
        api.gsap.from(host.querySelectorAll('.recap-card'), { y: 26, opacity: 0, scale: 0.94, duration: 0.45, stagger: 0.08, ease: 'back.out(1.4)' });
      },
    },
  ],
});
