/**
 * Aula guiada · Princípios de código limpo (módulo 6 · docs/page_10.md)
 * Analogia: a cozinha organizada; guard clause = o porteiro que barra na entrada.
 */
Aula.registrar({
  id: 'bp-codigo-limpo', licao: 'bp-codigo-limpo',
  titulo: 'Código limpo: a cozinha organizada',
  personagem: { nome: 'Bean' },
  fechamento: 'Nomes que explicam, métodos focados, fail-fast com guard clauses, e nunca retorne null em coleção. O comentário explica o porquê, não o quê.',
  cenas: [
    { fala: ['Código limpo é como uma **cozinha organizada**: cada coisa no lugar, e quem chega entende na hora.'],
      palco(host, api) { host.innerHTML = `<div style="text-align:center"><div class="analogia" style="margin:0 auto 16px; max-width:440px"><div class="analogia-titulo">A ideia de hoje</div><div class="analogia-cena"><div class="grande">🧑‍🍳</div><div>"mise en place: tudo no lugar, nomes claros"</div></div></div><div class="palco-titulo">Módulo 6 · Código limpo</div><p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`; api.gsap.from(host.querySelector('.analogia-cena'), { y: 20, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' }); } },
    { fala: ['Primeiro: nomes que dispensam comentário. Toca no bom e no ruim.'], interativo: true, dica: 'Toque nos dois',
      palco(host, api) { const d={Ruim:'int d; List l; void proc(): você adivinha o que é',Bom:'int diasSemCompra; List clientesInadimplentes; void enviarCobranca(): o nome já explica'};
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: potes rotulados x potes sem etiqueta</div><div class="analogia-cena"><div class="grande">🏷️</div><div>"o nome conta a história"</div></div></div><div class="palco-escolhas"><button class="chip" data-k="Ruim">nomes ruins</button><button class="chip" data-k="Bom">nomes claros</button></div><div class="saida" id="saida">Toque para comparar</div>`;
        const s=host.querySelector('#saida');const vistos=new Set();host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{host.querySelectorAll('.chip').forEach(x=>x.classList.remove('ativo'));c.classList.add('ativo');api.som('clique');s.innerHTML=`<span class="neutro"><b>${c.dataset.k}</b>: ${d[c.dataset.k]}</span>`;vistos.add(c.dataset.k);if(vistos.size===2)api.pronto('Classe é substantivo, método é verbo, boolean é pergunta');}); } },
    { fala: ['Segundo: método focado, uma responsabilidade. Toca para ver o gigante virar passos.'], interativo: true, emocao: 'feliz', dica: 'Clique em "quebrar o método"',
      palco(host, api) { host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: uma receita por prato, não tudo num caldeirão</div><div class="analogia-cena"><div class="grande">🍲</div><div>"cada passo com um nome"</div></div></div><div id="host">${api.codigo(`void processarPedido(Pedido p) { /* 80 linhas: valida, calcula, salva, notifica */ }`)}</div><div class="palco-escolhas"><button class="chip" id="btn">quebrar o método</button></div>`;
        host.querySelector('#btn').onclick=e=>{e.target.disabled=true;api.som('acerto');api.reagir('feliz');host.querySelector('#host').innerHTML=api.codigo(`void processarPedido(Pedido pedido) {
    validar(pedido);
    aplicarDescontos(pedido);
    repository.salvar(pedido);
    notificacao.enviarConfirmacao(pedido);
}`);api.pronto('Cada passo com um nome: se precisa de comentário para separar blocos, vire método');}; } },
    { fala: ['Terceiro: fail-fast com guard clauses. O porteiro que barra na entrada.'],
      palco(host, api) { host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: o porteiro que confere logo na porta</div><div class="analogia-cena"><div class="grande">🛂</div><div>"valida e sai cedo, sem aninhar 5 ifs"</div></div></div>${api.codigo(`void transferir(Conta origem, Conta destino, double valor) {
    Objects.requireNonNull(origem, "origem obrigatoria");
    if (valor <= 0) throw new IllegalArgumentException("valor invalido");
    if (origem.getSaldo() < valor) throw new SaldoInsuficienteException();

    origem.debitar(valor);   // a lógica principal, sem aninhamento
    destino.creditar(valor);
}`)}<div class="note">Valide no início e saia cedo: o caminho feliz fica plano e legível.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['A pergunta:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">O que é fail-fast (guard clause)?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Aninhar ifs até o quinto nível</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Validar no início e lançar exceção cedo, deixando o caminho feliz plano</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: valide cedo, saia cedo':'É a B: guard clause evita aninhamento');}); } },
    { fala: ['Quarto: nunca retorne `null` em coleção. Executa e veja o estrago.'], interativo: true, emocao: 'alerta', dica: 'Clique em executar',
      palco(host, api) { host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: a gaveta vazia em vez de "não existe gaveta"</div><div class="analogia-cena"><div class="grande">🗄️</div><div>"devolva vazio, não null"</div></div></div>${api.codigo(`List<Pedido> buscar(Long id) {
    if (naoTem) return null;   // ruim
}
for (Pedido p : buscar(id)) { ... }   // NPE aqui`)}<div class="palco-escolhas"><button class="chip" id="btn">▶ iterar o retorno null</button></div><div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{e.target.disabled=true;api.som('erro');const s=host.querySelector('#saida');s.style.display='block';s.innerHTML=`<span class="erro">NullPointerException no for-each: o retorno era null.</span>\n<span class="ok">Certo: return List.of();  // coleção vazia, o for não quebra</span>`;api.gsap.from(s,{y:10,opacity:0,duration:0.3});api.reagir('alerta');api.pronto('Coleção vazia, nunca null: quem chama não precisa checar');}; } },
    { fala: ['Para "pode não existir" de um objeto único, use Optional.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Ausência explícita</div>${api.codigo(`List<Pedido> buscarPedidos(Long id) {
    return List.of();   // coleção vazia
}
Optional<Cliente> buscarPorCpf(String cpf) { ... }   // objeto que pode faltar`)}<div class="note">Coleção vazia para listas; Optional para um valor único.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Quinto: comente o **porquê**, não o **quê**.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Comentário que se paga</div>${api.codigo(`// ruim: repete o que o código já diz
contador++;   // incrementa o contador

// bom: explica o PORQUÊ
// A API de terceiros limita a 100 req/min; sem esta pausa recebemos 429.
Thread.sleep(600);`)}<div class="note">O "o quê" envelhece e vira mentira. O "porquê" (regra, decisão, limitação) é o que vale.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Toca no tipo de nome de cada coisa.'], interativo: true, dica: 'Toque nos três',
      palco(host, api) { const d={Classe:'substantivo: CalculadoraFrete, PedidoRepository',Metodo:'verbo: calcularTotal, enviarEmail',Boolean:'pergunta: isAtivo, temEstoque, podeCancelar'};
        host.innerHTML = `<div class="palco-escolhas">${Object.keys(d).map(k=>`<button class="chip" data-k="${k}">${k}</button>`).join('')}</div><div class="saida" id="saida">Toque para ver a convenção</div>`;
        const s=host.querySelector('#saida');const vistos=new Set();host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{host.querySelectorAll('.chip').forEach(x=>x.classList.remove('ativo'));c.classList.add('ativo');api.som('clique');s.innerHTML=`<span class="neutro"><b>${c.dataset.k}</b>: ${d[c.dataset.k]}</span>`;vistos.add(c.dataset.k);if(vistos.size===3)api.pronto('Substantivo, verbo, pergunta: cada um com seu papel');}); } },
    { fala: ['Fixando o null:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">Um método que busca uma lista e não acha nada deve retornar:</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span><code>null</code></span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Uma coleção vazia (<code>List.of()</code>): quem chama não precisa checar null</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: coleção vazia, nunca null':'É a B: vazio evita o NPE');}); } },
    { fala: ['Fecha com o comentário:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem final</div><h2 style="text-align:center; margin-bottom:12px">Qual comentário se paga?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span><code>i++; // incrementa i</code></span></button><button class="option" data-i="1"><span class="option-key">B</span><span><code>// a API limita a 100 req/min; sem a pausa recebemos 429</code></span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Perfeito: comente o porquê':'É a B: o porquê, não o quê');}); } },
    { fala: ['Código limpo no bolso. Seis imagens.'], emocao: 'feliz',
      palco(host, api) { const cards=[['🏷️','Nomes que explicam','substantivo, verbo, pergunta'],['🍲','Método focado','uma responsabilidade'],['🛂','Fail-fast','guard clause, valide cedo'],['🗄️','Coleção vazia','nunca retorne null'],['📦','Optional','para o valor único que pode faltar'],['💬','Comente o porquê','não o quê']]; host.innerHTML=`<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i,t,d])=>`<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`; api.gsap.from(host.querySelectorAll('.recap-card'),{y:26,opacity:0,scale:0.94,duration:0.45,stagger:0.08,ease:'back.out(1.4)'}); } },
  ],
});
