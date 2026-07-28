/**
 * Aula guiada · Inspecionando classes em runtime (módulo 35 · docs/page_09.md)
 * Analogia: o raio-X / a chave-mestra que abre até o private.
 */
Aula.registrar({
  id: 'ref-basico', licao: 'ref-basico',
  titulo: 'Reflection: o raio-X das classes',
  personagem: { nome: 'Bean' },
  fechamento: 'Reflection lê e mexe na classe em runtime; é a porta dos fundos dos frameworks. Poderosa, mas lenta e sem segurança de tipo: use em infraestrutura.',
  cenas: [
    { fala: ['Como o Spring instancia seus beans e o Jackson mapeia seu JSON? Com **reflection**: um **raio-X** que lê e mexe na classe em tempo de execução.'],
      palco(host, api) { host.innerHTML = `<div style="text-align:center"><div class="analogia" style="margin:0 auto 16px; max-width:440px"><div class="analogia-titulo">A ideia de hoje</div><div class="analogia-cena"><div class="grande">🩻</div><div>"enxerga campos e métodos por dentro, em runtime"</div></div></div><div class="palco-titulo">Módulo 35 · Reflection API</div><p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`; api.gsap.from(host.querySelector('.analogia-cena'), { y: 20, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' }); } },
    { fala: ['Tudo começa no objeto `Class`, a chapa do raio-X. Há 3 formas de obtê-lo. Toca em cada uma.'], interativo: true, dica: 'Toque nas três formas',
      palco(host, api) { const d={'.class':'Cliente.class: literal, conhecido em compilação','getClass()':'objeto.getClass(): a partir de uma instância','forName':'Class.forName("com.app.Cliente"): pelo nome, em runtime'};
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: três jeitos de pedir a chapa</div><div class="analogia-cena"><div class="grande">📸</div><div>"pelo tipo, pela instância, pelo nome"</div></div></div><div class="palco-escolhas">${Object.keys(d).map(k=>`<button class="chip" data-k="${k}">${k}</button>`).join('')}</div><div class="saida" id="saida">Toque para ver cada forma</div>`;
        const s=host.querySelector('#saida');const vistos=new Set();host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{host.querySelectorAll('.chip').forEach(x=>x.classList.remove('ativo'));c.classList.add('ativo');api.som('clique');s.innerHTML=`<span class="neutro"><b>${c.dataset.k}</b>: ${d[c.dataset.k]}</span>`;vistos.add(c.dataset.k);if(vistos.size===3)api.pronto('Class é a porta de entrada da reflection');}); } },
    { fala: ['Com o Class em mãos, você inspeciona os campos, inclusive os privados.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Inspecionar campos</div>${api.codigo(`Class<?> clazz = Cliente.class;
clazz.getDeclaredFields();   // todos, inclusive private

for (Field f : clazz.getDeclaredFields()) {
    System.out.println(f.getName() + " : " + f.getType().getSimpleName());
}`)}<div class="note"><code>getFields</code> traz só os públicos; <code>getDeclaredFields</code> traz todos.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['E aqui a chave-mestra: `setAccessible(true)` abre até o `private`. Executa.'], interativo: true, emocao: 'alerta', dica: 'Clique em executar',
      palco(host, api) { host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: a chave-mestra que abre o cofre</div><div class="analogia-cena"><div class="grande">🗝️</div><div>"o private que você trancou... reflection abre"</div></div></div>${api.codigo(`Field campo = clazz.getDeclaredField("cpf");
campo.setAccessible(true);            // quebra o encapsulamento
String valor = (String) campo.get(cliente);
campo.set(cliente, "99999999999");   // altera o private de fora`)}<div class="palco-escolhas"><button class="chip" id="btn">▶ ler o cpf private</button></div><div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{e.target.disabled=true;api.som('revelar');const s=host.querySelector('#saida');s.style.display='block';s.innerHTML=`<span class="ok">Leu e alterou o campo private de fora da classe.</span>\n<span class="neutro">É o que viabiliza os frameworks, mas fura o encapsulamento.</span>`;api.gsap.from(s,{y:10,opacity:0,duration:0.3});api.reagir('alerta');api.pronto('setAccessible(true) desliga a checagem de visibilidade');}; } },
    { fala: ['A pergunta:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">O que <code>campo.setAccessible(true)</code> faz?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Torna o campo público permanentemente</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Desliga a checagem de visibilidade, permitindo ler/escrever um <code>private</code></span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: desliga a checagem de acesso':'É a B: permite acessar o private');}); } },
    { fala: ['Métodos e construtores também são inspecionáveis e invocáveis.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Invocar por reflection</div>${api.codigo(`Method m = clazz.getDeclaredMethod("calcularDesconto", double.class);
m.setAccessible(true);
Object r = m.invoke(cliente, 10.0);      // chama no objeto

Constructor<?> ctor = clazz.getDeclaredConstructor(String.class);
Object novo = ctor.newInstance("Ana");   // instancia`)}<div class="note"><code>invoke</code> chama o método; <code>newInstance</code> cria o objeto.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Mas reflection tem um preço. Toca nos custos.'], interativo: true, dica: 'Toque nos três custos',
      palco(host, api) { const d={Lento:'sem inline nem otimização do JIT, é bem mais lento que chamada direta','Sem tipo':'erro de nome de campo só aparece em runtime, não na compilação',Frágil:'renomear um campo não atualiza a String que o referencia'};
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: o preço de abrir o motor</div><div class="analogia-cena"><div class="grande">⚠️</div><div>"poder demais tem custo"</div></div></div><div class="palco-escolhas">${Object.keys(d).map(k=>`<button class="chip" data-k="${k}">${k}</button>`).join('')}</div><div class="saida" id="saida">Toque para ver cada custo</div>`;
        const s=host.querySelector('#saida');const vistos=new Set();host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{host.querySelectorAll('.chip').forEach(x=>x.classList.remove('ativo'));c.classList.add('ativo');api.som('clique');s.innerHTML=`<span class="neutro"><b>${c.dataset.k}</b>: ${d[c.dataset.k]}</span>`;vistos.add(c.dataset.k);if(vistos.size===3)api.pronto('Lento, sem tipo, frágil: use com parcimônia');}); } },
    { fala: ['Por isso: reflection é para **infraestrutura**, não para regra de negócio.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Onde usar</div>${api.codigo(`// SIM: mapeadores, injetores, serializadores (frameworks)
// NÃO: regra de negócio do dia a dia (use polimorfismo)`)}<div class="note">A partir do Java 17, o encapsulamento forte de módulos pode até bloquear <code>setAccessible</code> em pacotes do JDK.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Um caso concreto: instanciar por nome, em runtime.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Instanciar pelo nome</div>${api.codigo(`String nomeClasse = config.get("handler");   // vem de um arquivo
Class<?> c = Class.forName(nomeClasse);
Object handler = c.getDeclaredConstructor().newInstance();`)}<div class="note">É assim que um framework carrega uma classe que você configurou por texto.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Fixando o custo:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">Um erro de nome de campo em <code>getDeclaredField("cpff")</code> aparece quando?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Na compilação</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Só em runtime (NoSuchFieldException): reflection não tem segurança de tipo</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: erro só em runtime':'É a B: sem segurança de tipo, erra em runtime');}); } },
    { fala: ['Fecha com o uso certo:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem final</div><h2 style="text-align:center; margin-bottom:12px">Onde reflection faz sentido?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>No dia a dia da regra de negócio</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Em infraestrutura genérica (frameworks, mapeadores, injetores)</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Perfeito: reflection é para infraestrutura':'É a B: em regra de negócio, use polimorfismo');}); } },
    { fala: ['Reflection no bolso. Seis imagens.'], emocao: 'feliz',
      palco(host, api) { const cards=[['🩻','Reflection','lê e mexe na classe em runtime'],['📸','Class','3 formas: .class, getClass, forName'],['🗝️','setAccessible(true)','abre o private'],['⚙️','invoke / newInstance','chama método, cria objeto'],['⚠️','Tem preço','lento, sem tipo, frágil'],['🏗️','Só infraestrutura','frameworks, não regra de negócio']]; host.innerHTML=`<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i,t,d])=>`<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`; api.gsap.from(host.querySelectorAll('.recap-card'),{y:26,opacity:0,scale:0.94,duration:0.45,stagger:0.08,ease:'back.out(1.4)'}); } },
  ],
});
