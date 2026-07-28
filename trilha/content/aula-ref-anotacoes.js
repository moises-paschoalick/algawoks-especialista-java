/**
 * Aula guiada · Anotações customizadas (módulo 35 · docs/page_09.md)
 * Analogia: o post-it/etiqueta que uma máquina lê depois (só se for tinta permanente).
 */
Aula.registrar({
  id: 'ref-anotacoes', licao: 'ref-anotacoes',
  titulo: 'Anotações: a etiqueta que o código lê depois',
  personagem: { nome: 'Bean' },
  fechamento: 'Anotação é metadado. Para ser lida por reflection, precisa ser @Retention(RUNTIME). É o mecanismo de @Column e @JsonProperty.',
  cenas: [
    { fala: ['Anotação é um **post-it** que você cola no código e uma máquina lê depois. Mas só funciona se a tinta for **permanente**.'],
      palco(host, api) { host.innerHTML = `<div style="text-align:center"><div class="analogia" style="margin:0 auto 16px; max-width:440px"><div class="analogia-titulo">A ideia de hoje</div><div class="analogia-cena"><div class="grande">🏷️</div><div>"etiqueta de metadados que o programa lê em runtime"</div></div></div><div class="palco-titulo">Módulo 35 · Anotações</div><p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`; api.gsap.from(host.querySelector('.analogia-cena'), { y: 20, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' }); } },
    { fala: ['Criar uma anotação é como desenhar a etiqueta.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Anotação customizada</div>${api.codigo(`@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Coluna {
    String nome();
    boolean obrigatorio() default false;
}`)}<div class="note"><code>@Target</code> diz onde colar; <code>@Retention</code> diz por quanto tempo a etiqueta dura.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['O `@Target` decide onde a etiqueta pode ser colada. Toca em cada alvo.'], interativo: true, dica: 'Toque nos alvos',
      palco(host, api) { const d={TYPE:'classe, interface, enum, record',FIELD:'atributo',METHOD:'método',PARAMETER:'parâmetro'};
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: onde a etiqueta gruda</div><div class="analogia-cena"><div class="grande">📌</div><div>"na classe? no campo? no método?"</div></div></div><div class="palco-escolhas">${Object.keys(d).map(k=>`<button class="chip" data-k="${k}">${k}</button>`).join('')}</div><div class="saida" id="saida">Toque para ver cada alvo</div>`;
        const s=host.querySelector('#saida');const vistos=new Set();host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{host.querySelectorAll('.chip').forEach(x=>x.classList.remove('ativo'));c.classList.add('ativo');api.som('clique');s.innerHTML=`<span class="neutro"><b>${c.dataset.k}</b>: ${d[c.dataset.k]}</span>`;vistos.add(c.dataset.k);if(vistos.size===4)api.pronto('@Target restringe onde a anotação pode aparecer');}); } },
    { fala: ['E o `@Retention` é a tinta: o mais cobrado em entrevista. Escolhe a errada e veja.'], interativo: true, emocao: 'alerta', dica: 'Clique em "usar CLASS"',
      palco(host, api) { host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: a tinta que apaga antes da hora</div><div class="analogia-cena"><div class="grande">🖊️❌</div><div>"a máquina foi ler e a etiqueta já sumiu"</div></div></div>${api.codigo(`@Retention(RetentionPolicy.CLASS)   // padrão: some no carregamento
public @interface Coluna { ... }`)}<div class="palco-escolhas"><button class="chip" id="btn">▶ ler por reflection</button></div><div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{e.target.disabled=true;api.som('erro');const s=host.querySelector('#saida');s.style.display='block';s.innerHTML=`<span class="erro">isAnnotationPresent(Coluna.class) devolve false: a etiqueta não chegou ao runtime.</span>\n<span class="ok">Precisa ser @Retention(RUNTIME) para a reflection ler.</span>`;api.gsap.from(s,{y:10,opacity:0,duration:0.3});api.reagir('alerta');api.pronto('Sem RUNTIME, a anotação some antes de você ler');}; } },
    { fala: ['Os três níveis de retenção:'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">@Retention</div><table class="mini-tabela"><thead><tr><th>Política</th><th>Vive até</th><th>Uso</th></tr></thead><tbody><tr><td>SOURCE</td><td>compilação (some do .class)</td><td>@Override, Lombok</td></tr><tr><td>CLASS</td><td>no .class, some no carregamento</td><td>padrão; bytecode</td></tr><tr><td>RUNTIME</td><td>disponível via reflection</td><td>Spring, JPA, Jackson</td></tr></tbody></table><div class="note">Para ler por reflection, tem que ser <b>RUNTIME</b>.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['A pergunta que mais cai:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">Para uma anotação ser lida por reflection em runtime, qual @Retention?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span><code>SOURCE</code></span></button><button class="option" data-i="1"><span class="option-key">B</span><span><code>RUNTIME</code>: as outras somem antes da execução</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: só RUNTIME chega ao runtime':'É RUNTIME: SOURCE e CLASS somem antes');}); } },
    { fala: ['Aplicar a anotação é colar a etiqueta.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Aplicar</div>${api.codigo(`class Cliente {
    @Coluna(nome = "Nome Completo")
    private String nome;

    @Coluna(nome = "CPF")
    private String cpf;

    private String senhaInterna;   // sem etiqueta: fica de fora
}`)}<div class="note">Só os campos anotados entram no processamento; o resto é ignorado.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Ler a etiqueta em runtime junta anotação com reflection.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Ler por reflection</div>${api.codigo(`for (Field f : Cliente.class.getDeclaredFields()) {
    if (f.isAnnotationPresent(Coluna.class)) {
        Coluna c = f.getAnnotation(Coluna.class);
        System.out.println(c.nome());
    }
}`)}<div class="note"><code>isAnnotationPresent</code> checa; <code>getAnnotation</code> lê os valores.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['E isso é exatamente o mecanismo dos frameworks que você usa.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">O truque por trás dos frameworks</div>${api.codigo(`@Column("nome_completo")   // JPA
private String nome;

@JsonProperty("nome")      // Jackson
private String nome;`)}<div class="note">Anotação <code>RUNTIME</code> + varredura de campos por reflection: é assim que JPA e Jackson funcionam.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Fixando o alvo:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">O que <code>@Target(ElementType.FIELD)</code> faz?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Define quanto tempo a anotação dura</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Restringe a anotação a ser usada em campos (atributos)</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: @Target diz onde aplicar':'É a B: @Target restringe o local');}); } },
    { fala: ['Fecha com o essencial:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem final</div><h2 style="text-align:center; margin-bottom:12px">Sua anotação custom não está sendo lida por reflection. Causa mais provável?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Faltou o <code>@Target</code></span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Não é <code>@Retention(RUNTIME)</code>: some antes da execução</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Perfeito: sem RUNTIME, a leitura falha':'É a B: precisa de @Retention(RUNTIME)');}); } },
    { fala: ['Anotações no bolso. Seis imagens.'], emocao: 'feliz',
      palco(host, api) { const cards=[['🏷️','Anotação','metadado colado no código'],['📌','@Target','onde aplicar (FIELD, METHOD...)'],['🖊️','@Retention','SOURCE, CLASS, RUNTIME'],['✅','RUNTIME','o único que a reflection lê'],['🔍','isAnnotationPresent','lê a etiqueta em runtime'],['🧩','JPA e Jackson','anotação RUNTIME + reflection']]; host.innerHTML=`<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i,t,d])=>`<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`; api.gsap.from(host.querySelectorAll('.recap-card'),{y:26,opacity:0,scale:0.94,duration:0.45,stagger:0.08,ease:'back.out(1.4)'}); } },
  ],
});
