/**
 * Aula guiada · Maven: estrutura, ciclo e escopos (módulo 31 · docs/page_10.md)
 * Analogia: a linha de montagem com etapas na ordem certa; o endereço GAV.
 */
Aula.registrar({
  id: 'bp-maven', licao: 'bp-maven',
  titulo: 'Maven: a linha de montagem do projeto',
  personagem: { nome: 'Bean' },
  fechamento: 'Maven é convenção sobre configuração. As coordenadas GAV identificam o artefato, as fases são sequenciais, e o escopo errado é fonte de "funciona na minha máquina".',
  cenas: [
    { fala: ['Maven é a **linha de montagem** do projeto: etapas na ordem certa e uma convenção que dispensa configurar tudo.'],
      palco(host, api) { host.innerHTML = `<div style="text-align:center"><div class="analogia" style="margin:0 auto 16px; max-width:440px"><div class="analogia-titulo">A ideia de hoje</div><div class="analogia-cena"><div class="grande">🏭➡️📦</div><div>"compila, testa, empacota, instala"</div></div></div><div class="palco-titulo">Módulo 31 · Maven</div><p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`; api.gsap.from(host.querySelector('.analogia-cena'), { y: 20, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' }); } },
    { fala: ['A base é **convenção sobre configuração**: seguindo a estrutura padrão, o Maven já sabe tudo.'],
      palco(host, api) { host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: a receita padronizada da fábrica</div><div class="analogia-cena"><div class="grande">📐</div><div>"cada coisa no lugar esperado"</div></div></div>${api.codigo(`projeto/
├── pom.xml
├── src/main/java/       código de produção
├── src/main/resources/  application.properties, logback.xml
└── src/test/java/       testes`)}<div class="note">Nessa estrutura, compilar e testar funciona sem você configurar caminhos.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Todo artefato tem um endereço único: as coordenadas **GAV**. Toca em cada parte.'], interativo: true, dica: 'Toque nas três',
      palco(host, api) { const d={groupId:'a organização: com.algaworks',artifactId:'o projeto: especialista-java',version:'a versão: 1.0.0-SNAPSHOT (SNAPSHOT = em desenvolvimento)'};
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: o endereço completo do pacote</div><div class="analogia-cena"><div class="grande">📮</div><div>"grupo, artefato, versão"</div></div></div><div class="palco-escolhas">${Object.keys(d).map(k=>`<button class="chip" data-k="${k}">${k}</button>`).join('')}</div><div class="saida" id="saida">Toque para ver cada coordenada</div>`;
        const s=host.querySelector('#saida');const vistos=new Set();host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{host.querySelectorAll('.chip').forEach(x=>x.classList.remove('ativo'));c.classList.add('ativo');api.som('clique');s.innerHTML=`<span class="neutro"><b>${c.dataset.k}</b>: ${d[c.dataset.k]}</span>`;vistos.add(c.dataset.k);if(vistos.size===3)api.pronto('GAV: o trio que identifica unicamente qualquer dependência');}); } },
    { fala: ['O pom.xml declara as coordenadas e as dependências.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">pom.xml</div>${api.codigo(`<groupId>com.algaworks</groupId>
<artifactId>especialista-java</artifactId>
<version>1.0.0-SNAPSHOT</version>

<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>`)}<div class="note">O trio GAV identifica o seu projeto e cada dependência.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['As fases são **sequenciais**: rodar uma executa todas as anteriores. Executa `package`.'], interativo: true, emocao: 'feliz', dica: 'Clique em "mvn package"',
      palco(host, api) { host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: a esteira que não pula etapa</div><div class="analogia-cena"><div class="grande">⚙️</div><div>"compila antes de testar, testa antes de empacotar"</div></div></div>${api.codigo(`mvn package`)}<div class="trem" id="fases">${['validate','compile','test','package'].map(f=>`<div class="vagao">${f}</div>`).join('<span class="elo">→</span>')}</div><div class="palco-escolhas"><button class="chip" id="btn">▶ rodar mvn package</button></div><div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{e.target.disabled=true;const v=[...host.querySelectorAll('.vagao')];v.forEach((x,k)=>setTimeout(()=>{x.classList.add('destaque');api.som('clique');},300*k));setTimeout(()=>{const s=host.querySelector('#saida');s.style.display='block';s.innerHTML=`<span class="ok">package executou validate, compile e test antes.</span>\n<span class="neutro">As fases são sequenciais: você não pula etapas.</span>`;api.gsap.from(s,{y:10,opacity:0,duration:0.3});api.reagir('feliz');api.pronto('mvn package roda tudo até empacotar');},1300);}; } },
    { fala: ['O ciclo de vida, do começo ao fim:'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Ciclo de vida</div><table class="mini-tabela"><thead><tr><th>Fase</th><th>O que faz</th></tr></thead><tbody><tr><td>compile</td><td>compila para target/classes</td></tr><tr><td>test</td><td>roda os testes unitários</td></tr><tr><td>package</td><td>gera o jar/war</td></tr><tr><td>install</td><td>instala no repositório local (~/.m2)</td></tr><tr><td>deploy</td><td>publica no repositório remoto</td></tr></tbody></table><div class="note"><code>mvn clean install</code> é o comando mais usado: limpa e roda tudo até a instalação local.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['A pergunta:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px"><code>mvn package</code> roda os testes antes de empacotar?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Não, só empacota</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Sim: as fases são sequenciais, então compile e test rodam antes</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: fases sequenciais':'É a B: package executa as fases anteriores');}); } },
    { fala: ['E o escopo da dependência: onde ela está disponível. Toca em cada um.'], interativo: true, dica: 'Toque nos escopos',
      palco(host, api) { const d={compile:'padrão: disponível em tudo, vai no jar final',provided:'na compilação e teste, mas o servidor fornece (não vai no jar)',runtime:'em execução, não na compilação (ex.: driver JDBC)',test:'só nos testes (JUnit, Mockito), não vai no jar'};
        host.innerHTML = `<div class="palco-escolhas">${Object.keys(d).map(k=>`<button class="chip" data-k="${k}">${k}</button>`).join('')}</div><div class="saida" id="saida">Toque para ver cada escopo</div>`;
        const s=host.querySelector('#saida');const vistos=new Set();host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{host.querySelectorAll('.chip').forEach(x=>x.classList.remove('ativo'));c.classList.add('ativo');api.som('clique');s.innerHTML=`<span class="neutro"><b>${c.dataset.k}</b>: ${d[c.dataset.k]}</span>`;vistos.add(c.dataset.k);if(vistos.size===4)api.pronto('Escopo define onde a dependência aparece e se vai no pacote');}); } },
    { fala: ['O escopo errado é fonte clássica de "funciona na minha máquina".'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">O bug do escopo</div>${api.codigo(`<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>test</scope>   <!-- ERRADO: some no jar de produção -->
</dependency>`)}<div class="note">Driver JDBC deve ser <code>runtime</code>. Em <code>test</code>, compila e passa nos testes, mas o jar sobe sem ele.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Fixando as fases:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">O JUnit deve ter qual escopo?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span><code>compile</code>: vai no jar final</span></button><button class="option" data-i="1"><span class="option-key">B</span><span><code>test</code>: só nos testes, não vai no pacote</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: JUnit é escopo test':'É test: ferramenta de teste não vai no jar');}); } },
    { fala: ['Fecha com o escopo do driver:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem final</div><h2 style="text-align:center; margin-bottom:12px">O driver JDBC do MySQL deve ter qual escopo?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span><code>test</code></span></button><button class="option" data-i="1"><span class="option-key">B</span><span><code>runtime</code>: preciso em execução, e no jar final</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Perfeito: driver é runtime':'É runtime: senão o jar de produção sobe sem o driver');}); } },
    { fala: ['Unidade de Boas Práticas fechada! Seis imagens.'], emocao: 'feliz',
      palco(host, api) { const cards=[['🏭','Maven é linha de montagem','fases na ordem certa'],['📐','Convenção','estrutura padrão, sem configurar'],['📮','GAV','group, artifact, version'],['⚙️','Fases sequenciais','package roda compile e test antes'],['🎚️','Escopos','compile/provided/runtime/test'],['💥','Escopo errado','driver em test some no jar']]; host.innerHTML=`<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i,t,d])=>`<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`; api.gsap.from(host.querySelectorAll('.recap-card'),{y:26,opacity:0,scale:0.94,duration:0.45,stagger:0.08,ease:'back.out(1.4)'}); } },
  ],
});
