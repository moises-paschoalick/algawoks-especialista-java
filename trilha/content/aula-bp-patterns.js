/**
 * Aula guiada · Strategy, Factory, Decorator e Builder (módulo 15 · docs/page_10.md)
 * Analogia: a caixa de ferramentas (a ferramenta certa para cada dor).
 */
Aula.registrar({
  id: 'bp-patterns', licao: 'bp-patterns',
  titulo: 'Design Patterns: a ferramenta certa para cada dor',
  personagem: { nome: 'Bean' },
  fechamento: 'Strategy troca o algoritmo, Factory encapsula a criação, Decorator empilha comportamento, Builder monta objeto complexo. Quatro dores, quatro ferramentas.',
  cenas: [
    { fala: ['Os 4 padrões clássicos são uma **caixa de ferramentas**: cada um resolve uma dor específica.'],
      palco(host, api) { host.innerHTML = `<div style="text-align:center"><div class="analogia" style="margin:0 auto 16px; max-width:440px"><div class="analogia-titulo">A ideia de hoje</div><div class="analogia-cena"><div class="grande">🧰</div><div>"Strategy, Factory, Decorator, Builder"</div></div></div><div class="palco-titulo">Módulo 15 · Design Patterns</div><p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`; api.gsap.from(host.querySelector('.analogia-cena'), { y: 20, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' }); } },
    { fala: ['**Strategy**: quando um `if/else` gigante escolhe entre variações do mesmo cálculo. A imagem: trocar a broca da furadeira.'],
      palco(host, api) { host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: trocar a broca, não a furadeira</div><div class="analogia-cena"><div class="grande">🪛</div><div>"cada algoritmo é uma broca"</div></div></div>${api.codigo(`interface CalculadoraFrete { BigDecimal calcular(Pedido p); }
class FreteExpresso implements CalculadoraFrete { ... }
class FreteGratis   implements CalculadoraFrete { ... }

class PedidoService {
    private final CalculadoraFrete calculadora;   // recebe a estratégia
}`)}<div class="note">Modalidade nova = classe nova, sem tocar no serviço (Aberto/Fechado).</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['A pergunta:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">Um <code>switch</code> gigante escolhe entre 5 formas de calcular frete. Qual padrão?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Builder</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Strategy: cada cálculo vira uma classe atrás de uma interface</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: algoritmo intercambiável = Strategy':'É Strategy: cada variação numa classe');}); } },
    { fala: ['**Factory**: quando o `new` está espalhado. A fábrica decide o que criar.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Factory: encapsula a criação</div>${api.codigo(`class CalculadoraFreteFactory {
    static CalculadoraFrete criar(TipoFrete tipo) {
        return switch (tipo) {
            case EXPRESSO -> new FreteExpresso();
            case GRATIS   -> new FreteGratis();
        };
    }
}`)}<div class="note">O cliente pede pelo que quer, não pelo como construir. Factory e Strategy andam juntos.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['**Decorator**: empilhar comportamento por composição. A imagem: o café com adicionais. Monta o pedido.'], interativo: true, emocao: 'feliz', dica: 'Empilhe os adicionais',
      palco(host, api) { host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: o café com adicionais</div><div class="analogia-cena"><div class="grande">☕</div><div>"cada camada envolve a anterior"</div></div></div>${api.codigo(`Notificador n = new ComRetry(new ComLog(new Email()));`)}<div class="palco-escolhas"><button class="chip" data-k="log">+ log</button><button class="chip" data-k="retry">+ retry</button></div><div class="saida" id="saida">Notificador = new Email()</div>`;
        const s=host.querySelector('#saida');const cam=['Email()'];const vistos=new Set();host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{if(c.disabled)return;c.disabled=true;api.som('pop');cam.unshift(c.dataset.k==='log'?'ComLog(':'ComRetry(');vistos.add(c.dataset.k);const fecha=')'.repeat(vistos.size);s.innerHTML=`<span class="ok">new ${cam.join('new ')}${fecha}</span>`;if(vistos.size===2)api.pronto('Cada peça envolve a outra em runtime: é o que o JDK faz com BufferedReader');}); } },
    { fala: ['**Builder**: montar um objeto complexo passo a passo, de forma fluente.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Builder: construção fluente</div>${api.codigo(`Pedido p = Pedido.builder()
    .cliente("Ana")
    .item(item1)
    .cupom("BLACK10")
    .build();   // valida tudo aqui`)}<div class="note">Resolve o "construtor telescópico": muitos parâmetros opcionais e chamadas ilegíveis.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Liga cada dor ao padrão. Toca em cada um.'], interativo: true, dica: 'Toque nos quatro',
      palco(host, api) { const d={Strategy:'algoritmo intercambiável (if/else de cálculo)',Factory:'encapsula a criação (new espalhado)',Decorator:'empilha comportamento por composição',Builder:'objeto complexo com muitos parâmetros'};
        host.innerHTML = `<div class="palco-escolhas">${Object.keys(d).map(k=>`<button class="chip" data-k="${k}">${k}</button>`).join('')}</div><div class="saida" id="saida">Toque para ver a dor que cada um resolve</div>`;
        const s=host.querySelector('#saida');const vistos=new Set();host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{host.querySelectorAll('.chip').forEach(x=>x.classList.remove('ativo'));c.classList.add('ativo');api.som('clique');s.innerHTML=`<span class="neutro"><b>${c.dataset.k}</b>: ${d[c.dataset.k]}</span>`;vistos.add(c.dataset.k);if(vistos.size===4)api.pronto('Cada padrão, uma dor: reconhecer é meio caminho');}); } },
    { fala: ['O Decorator você já usa sem perceber: o próprio JDK é feito dele.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Decorator no JDK</div>${api.codigo(`BufferedReader br = new BufferedReader(
                    new InputStreamReader(
                        new FileInputStream("dados.txt")));`)}<div class="note">Buffer envolve leitor de caracteres, que envolve stream de bytes. Três decorators.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Fixando o Strategy:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">Qual padrão adiciona comportamento (log, retry) empilhando por composição?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Factory</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Decorator: cada peça envolve a anterior</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: empilhar comportamento = Decorator':'É Decorator: composição em camadas');}); } },
    { fala: ['E o Builder:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">Objeto com muitos campos opcionais, e você quer construção legível. Qual padrão?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Strategy</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Builder: <code>.campo().campo().build()</code></span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: construção fluente = Builder':'É Builder: resolve o construtor telescópico');}); } },
    { fala: ['Fecha ligando dois deles:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem final</div><h2 style="text-align:center; margin-bottom:12px">Que padrões costumam trabalhar juntos?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Builder e Decorator</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Factory e Strategy: a fábrica escolhe qual estratégia criar</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Perfeito: Factory cria a Strategy':'É Factory + Strategy: a fábrica escolhe o algoritmo');}); } },
    { fala: ['Patterns no bolso. Seis imagens.'], emocao: 'feliz',
      palco(host, api) { const cards=[['🪛','Strategy','algoritmo intercambiável'],['🏭','Factory','encapsula o new'],['☕','Decorator','empilha comportamento'],['🧱','Builder','construção fluente'],['🤝','Factory + Strategy','a fábrica escolhe a estratégia'],['📚','Decorator no JDK','BufferedReader é isso']]; host.innerHTML=`<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i,t,d])=>`<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`; api.gsap.from(host.querySelectorAll('.recap-card'),{y:26,opacity:0,scale:0.94,duration:0.45,stagger:0.08,ease:'back.out(1.4)'}); } },
  ],
});
