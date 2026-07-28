/**
 * Aula guiada · Serialização de objetos (módulo 30 · docs/page_08.md)
 * Analogia: congelar comida com etiqueta de validade (serialVersionUID).
 */
Aula.registrar({
  id: 'io-serializacao', licao: 'io-serializacao',
  titulo: 'Serialização: congelar o objeto em bytes',
  personagem: { nome: 'Bean' },
  fechamento: 'Serializar congela o objeto em bytes. serialVersionUID é a versão do contrato; transient não congela. Mudou a estrutura, quebra a leitura.',
  cenas: [
    { fala: ['Serializar é transformar um objeto em **bytes** para gravar ou enviar. A imagem: **congelar comida** com uma etiqueta de validade.'],
      palco(host, api) { host.innerHTML = `<div style="text-align:center"><div class="analogia" style="margin:0 auto 16px; max-width:440px"><div class="analogia-titulo">A ideia de hoje</div><div class="analogia-cena"><div class="grande">🧊🏷️</div><div>"congela o objeto e etiqueta a versão"</div></div></div><div class="palco-titulo">Módulo 30 · Serialização</div><p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`; api.gsap.from(host.querySelector('.analogia-cena'), { y: 20, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' }); } },
    { fala: ['Para congelar, a classe implementa `Serializable`, uma interface **marcadora** (sem métodos).'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Tornar serializável</div>${api.codigo(`class Cliente implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private String nome;
    private String cpf;
}`)}<div class="note"><code>Serializable</code> não tem métodos: só marca "esta classe pode virar bytes".</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Gravar e ler é com ObjectStream.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Congelar e descongelar</div>${api.codigo(`try (var out = new ObjectOutputStream(Files.newOutputStream(p))) {
    out.writeObject(cliente);      // congela
}
try (var in = new ObjectInputStream(Files.newInputStream(p))) {
    Cliente c = (Cliente) in.readObject();   // descongela
}`)}<div class="note"><code>readObject</code> pode lançar <code>ClassNotFoundException</code>.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Agora a armadilha do `serialVersionUID`: mude a estrutura e leia o arquivo antigo. Executa.'], interativo: true, emocao: 'alerta', dica: 'Clique em executar',
      palco(host, api) { host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: a etiqueta de validade não bate</div><div class="analogia-cena"><div class="grande">🧊❌</div><div>"a versão gravada não é a da classe atual"</div></div></div>${api.codigo(`// arquivo gravado com serialVersionUID = 1L
// você mudou a classe e o UID (ou deixou a JVM recalcular)
Cliente c = (Cliente) in.readObject();`)}<div class="palco-escolhas"><button class="chip" id="btn">▶ ler o arquivo antigo</button></div><div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{e.target.disabled=true;api.som('erro');const s=host.querySelector('#saida');s.style.display='block';s.innerHTML=`<span class="erro">InvalidClassException: local class incompatible (serialVersionUID mudou)</span>\n<span class="ok">Com o UID fixo, um campo novo é lido como valor padrão, sem quebrar.</span>`;api.gsap.from(s,{y:10,opacity:0,duration:0.3});api.reagir('alerta');api.pronto('serialVersionUID é a versão do contrato: mudou, a leitura quebra');}; } },
    { fala: ['A pergunta:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">Para que serve o <code>serialVersionUID</code>?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>É um id aleatório do objeto</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>É a versão do contrato da classe: se não bater com o dado gravado, lança InvalidClassException</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: é a versão do contrato':'É a B: controla a compatibilidade de leitura');}); } },
    { fala: ['Declarar o UID à mão te dá controle. Sem declarar, a JVM calcula um a cada mudança.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Por que declarar o UID</div>${api.codigo(`private static final long serialVersionUID = 1L;
// sem isto, a JVM calcula um UID pela estrutura da classe;
// qualquer mudança quebra a leitura dos dados antigos.`)}<div class="note">Com o UID fixo, campo novo vira valor padrão (null/0) nos dados antigos: previsível.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['E o `transient`: o que não deve congelar.'],
      palco(host, api) { host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: não congelar o que estraga ou é secreto</div><div class="analogia-cena"><div class="grande">🔒</div><div>"senha, cache, conexão: fora do congelador"</div></div></div>${api.codigo(`private transient String senha;   // NÃO é serializado
private static int contador;      // static também nunca é`)}<div class="note">Na volta, o campo <code>transient</code> recebe o valor padrão do tipo.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Toca no que NÃO é serializado.'], interativo: true, dica: 'Toque nos dois',
      palco(host, api) { const d={transient:'campo marcado transient: NÃO é congelado (senha, cache)',static:'campo static: pertence à classe, nunca é serializado'};
        host.innerHTML = `<div class="palco-escolhas"><button class="chip" data-k="transient">transient</button><button class="chip" data-k="static">static</button></div><div class="saida" id="saida">Toque para ver o que fica de fora</div>`;
        const s=host.querySelector('#saida');const vistos=new Set();host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{host.querySelectorAll('.chip').forEach(x=>x.classList.remove('ativo'));c.classList.add('ativo');api.som('clique');s.innerHTML=`<span class="neutro"><b>${c.dataset.k}</b>: ${d[c.dataset.k]}</span>`;vistos.add(c.dataset.k);if(vistos.size===2)api.pronto('transient e static ficam de fora do congelamento');}); } },
    { fala: ['E a serialização é em cascata: o grafo inteiro precisa ser serializável.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Cascata pelo grafo</div>${api.codigo(`class Pedido implements Serializable {
    private Cliente cliente;   // Cliente TAMBÉM precisa ser Serializable
}
// senão: NotSerializableException`)}<div class="note">Todo objeto referenciado precisa ser serializável, ou marcado transient.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Fixando o transient:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">Onde colocar o campo <code>senha</code> numa classe serializável?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Campo normal: será gravado junto</span></button><button class="option" data-i="1"><span class="option-key">B</span><span><code>transient</code>: não é serializado, protege o segredo</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: senha vai como transient':'É transient: não congela dados sensíveis');}); } },
    { fala: ['Fecha com o UID:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem final</div><h2 style="text-align:center; margin-bottom:12px">Você adiciona um campo a uma classe serializável já em produção. O que evita quebrar a leitura dos dados antigos?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Deixar a JVM recalcular o serialVersionUID</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Ter declarado um <code>serialVersionUID</code> fixo: o campo novo vira valor padrão</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Perfeito: UID fixo mantém a compatibilidade':'É a B: o UID fixo evita o InvalidClassException');}); } },
    { fala: ['Serialização no bolso. Seis imagens.'], emocao: 'feliz',
      palco(host, api) { const cards=[['🧊','Serializar','congela o objeto em bytes'],['🏷️','Serializable','interface marcadora, sem métodos'],['🔖','serialVersionUID','a versão do contrato da classe'],['🔒','transient','campo que não congela (senha, cache)'],['🕸️','Cascata','todo o grafo precisa ser serializável'],['🧩','JSON hoje','prefira Jackson para trocar entre serviços']]; host.innerHTML=`<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i,t,d])=>`<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`; api.gsap.from(host.querySelectorAll('.recap-card'),{y:26,opacity:0,scale:0.94,duration:0.45,stagger:0.08,ease:'back.out(1.4)'}); } },
  ],
});
