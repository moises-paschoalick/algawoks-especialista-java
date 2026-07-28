/**
 * Aula guiada · Logging com SLF4J e Logback (módulo 32 · docs/page_10.md)
 * Analogia: a caixa-preta do avião (o registro com níveis de urgência).
 */
Aula.registrar({
  id: 'bp-logging', licao: 'bp-logging',
  titulo: 'Logging: a caixa-preta do sistema',
  personagem: { nome: 'Bean' },
  fechamento: 'SLF4J é a fachada; use placeholder {} para não concatenar à toa. Os níveis são hierárquicos, e nunca logue senha.',
  cenas: [
    { fala: ['Log é a **caixa-preta** do seu sistema: o registro que conta o que aconteceu, com níveis de urgência.'],
      palco(host, api) { host.innerHTML = `<div style="text-align:center"><div class="analogia" style="margin:0 auto 16px; max-width:440px"><div class="analogia-titulo">A ideia de hoje</div><div class="analogia-cena"><div class="grande">✈️📦</div><div>"a caixa-preta que você lê quando algo dá errado"</div></div></div><div class="palco-titulo">Módulo 32 · Java Logging</div><p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`; api.gsap.from(host.querySelector('.analogia-cena'), { y: 20, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' }); } },
    { fala: ['`System.out.println` não serve: sem nível, sem timestamp, e some em produção. Executa.'], interativo: true, emocao: 'alerta', dica: 'Clique em executar',
      palco(host, api) { host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: anotar no guardanapo x no diário de bordo</div><div class="analogia-cena"><div class="grande">🗒️</div><div>"println não tem nível nem destino"</div></div></div>${api.codigo(`System.out.println("erro ao salvar pedido " + id);`)}<div class="palco-escolhas"><button class="chip" id="btn">▶ e em produção?</button></div><div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{e.target.disabled=true;api.som('barrado');const s=host.querySelector('#saida');s.style.display='block';s.innerHTML=`<span class="erro">Sem nível, sem timestamp, sem destino configurável. E em produção ninguém vê.</span>\n<span class="ok">Use um logger: SLF4J + Logback.</span>`;api.gsap.from(s,{y:10,opacity:0,duration:0.3});api.reagir('alerta');api.pronto('println em aplicação é um anti-pattern');}; } },
    { fala: ['O SLF4J é a **fachada**: você programa nela, e a implementação (Logback) fica trocável.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Fachada + implementação</div>${api.codigo(`private static final Logger log = LoggerFactory.getLogger(PedidoService.class);

log.info("Processando pedido {}", pedido.getId());`)}<div class="note">SLF4J é a API; Logback é o motor. Trocar o motor não muda seu código.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['O `{}` (placeholder) não é enfeite: evita montar a String quando o log está desligado. Toca em cada forma.'], interativo: true, dica: 'Toque nas duas',
      palco(host, api) { const d={Concatenar:'log.debug("Pedido " + p.getId() + ...): monta a String SEMPRE, mesmo com DEBUG desligado',Placeholder:'log.debug("Pedido {}", p.getId()): só monta se o nível estiver habilitado'};
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: só escrever quando alguém vai ler</div><div class="analogia-cena"><div class="grande">✍️</div><div>"{} é preguiçoso, + é ansioso"</div></div></div><div class="palco-escolhas"><button class="chip" data-k="Concatenar">com +</button><button class="chip" data-k="Placeholder">com {}</button></div><div class="saida" id="saida">Toque para comparar</div>`;
        const s=host.querySelector('#saida');const vistos=new Set();host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{host.querySelectorAll('.chip').forEach(x=>x.classList.remove('ativo'));c.classList.add('ativo');api.som('clique');s.innerHTML=`<span class="neutro"><b>${c.dataset.k}</b>: ${d[c.dataset.k]}</span>`;vistos.add(c.dataset.k);if(vistos.size===2)api.pronto('Sempre {}: não paga o custo da String quando o log está desligado');}); } },
    { fala: ['A pergunta:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">Por que usar <code>log.debug("id {}", id)</code> em vez de concatenar com +?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Fica mais bonito</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>O <code>{}</code> só monta a String se o nível estiver habilitado (não paga o custo à toa)</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: placeholder é lazy':'É a B: evita concatenar quando desligado');}); } },
    { fala: ['Os níveis são hierárquicos, do mais grave ao mais detalhado. Toca em cada um.'], interativo: true, dica: 'Toque nos níveis',
      palco(host, api) { const d={ERROR:'falhou e alguém precisa agir (ligado em produção)',WARN:'anormal, mas o sistema seguiu (ligado)',INFO:'evento de negócio relevante (ligado)',DEBUG:'detalhe para investigar (desligado em produção)'};
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: níveis de urgência no diário de bordo</div><div class="analogia-cena"><div class="grande">🚨</div><div>"do erro grave ao detalhe fino"</div></div></div><div class="palco-escolhas">${Object.keys(d).map(k=>`<button class="chip" data-k="${k}">${k}</button>`).join('')}</div><div class="saida" id="saida">Toque para ver cada nível</div>`;
        const s=host.querySelector('#saida');const vistos=new Set();host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{host.querySelectorAll('.chip').forEach(x=>x.classList.remove('ativo'));c.classList.add('ativo');api.som('clique');s.innerHTML=`<span class="neutro"><b>${c.dataset.k}</b>: ${d[c.dataset.k]}</span>`;vistos.add(c.dataset.k);if(vistos.size===4)api.pronto('Nível INFO descarta DEBUG e TRACE: são hierárquicos');}); } },
    { fala: ['Logar exceção: a exceção vai como último argumento, sem `{}`.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Logar exceção</div>${api.codigo(`try {
    executar(pedido);
} catch (Exception e) {
    log.error("Falha no pedido {}", pedido.getId(), e);   // 'e' por último
    throw e;
}`)}<div class="note">A exceção como último parâmetro imprime o stack trace inteiro.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['A configuração (logback.xml) decide destino e nível.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Configuração</div>${api.codigo(`<logger name="com.app.repository" level="DEBUG"/>
<root level="INFO">
    <appender-ref ref="CONSOLE"/>
    <appender-ref ref="ARQUIVO"/>
</root>`)}<div class="note">Configurar em INFO faz o logger descartar DEBUG e TRACE, sem tocar no código.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['E a regra de segurança que derruba muita empresa:'],
      palco(host, api) { host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: não anotar a senha no diário</div><div class="analogia-cena"><div class="grande">🔐</div><div>"log não é lugar de segredo"</div></div></div><div class="note">Nunca logue senha, token, cartão ou CPF completo. O log costuma ir para sistemas de terceiros.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Fixando o nível:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">Uma falha que exige ação humana deve ser logada em qual nível?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span><code>DEBUG</code></span></button><button class="option" data-i="1"><span class="option-key">B</span><span><code>ERROR</code>: falhou e alguém precisa agir</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: ação humana = ERROR':'É ERROR: exige ação');}); } },
    { fala: ['Fecha com o placeholder:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem final</div><h2 style="text-align:center; margin-bottom:12px">Forma correta de logar o id de um pedido:</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span><code>log.info("pedido " + pedido.getId())</code></span></button><button class="option" data-i="1"><span class="option-key">B</span><span><code>log.info("pedido {}", pedido.getId())</code></span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Perfeito: sempre com placeholder {}':'É a B: use {} em vez de concatenar');}); } },
    { fala: ['Logging no bolso. Seis imagens.'], emocao: 'feliz',
      palco(host, api) { const cards=[['✈️','Log é a caixa-preta','o que aconteceu, com níveis'],['🎭','SLF4J','a fachada; Logback o motor'],['💤','Placeholder {}','lazy: não concatena à toa'],['🚨','Níveis','ERROR > WARN > INFO > DEBUG > TRACE'],['🧾','Exceção por último','imprime o stack trace'],['🔐','Nunca logue segredo','senha, token, cartão']]; host.innerHTML=`<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i,t,d])=>`<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`; api.gsap.from(host.querySelectorAll('.recap-card'),{y:26,opacity:0,scale:0.94,duration:0.45,stagger:0.08,ease:'back.out(1.4)'}); } },
  ],
});
