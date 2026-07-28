/**
 * Aula guiada · O padrão Repository (módulo 34 · docs/page_05.md)
 * Analogia: o balcão de atendimento que esconde o depósito (o SQL).
 */
Aula.registrar({
  id: 'jdbc-repository', licao: 'jdbc-repository',
  titulo: 'Repository: o balcão que esconde o depósito',
  personagem: { nome: 'Bean' },
  fechamento: 'A interface de repositório esconde o SQL. O serviço depende do contrato, e você testa com uma implementação em memória, sem banco.',
  cenas: [
    { fala: ['Como isolar o banco do resto do sistema? Com o padrão **Repository**. A imagem: um **balcão** que esconde o depósito (o SQL) atrás dele.'],
      palco(host, api) { host.innerHTML = `<div style="text-align:center"><div class="analogia" style="margin:0 auto 16px; max-width:440px"><div class="analogia-titulo">A ideia de hoje</div><div class="analogia-cena"><div class="grande">🛎️🏬</div><div>"você pede no balcão; o depósito você não vê"</div></div></div><div class="palco-titulo">Módulo 34 · Padrão Repository</div><p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`; api.gsap.from(host.querySelector('.analogia-cena'), { y: 20, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' }); } },
    { fala: ['Sem o padrão, o serviço fica cheio de JDBC no meio da regra de negócio. Toca para ver.'], interativo: true, emocao: 'pensando', dica: 'Clique em "revelar"',
      palco(host, api) { host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: o gerente indo ao depósito toda hora</div><div class="analogia-cena"><div class="grande">🏃🏬</div><div>"a regra de negócio se perde no SQL"</div></div></div><div class="palco-escolhas"><button class="chip" id="btn">revelar o serviço acoplado</button></div><div id="host" style="margin-top:12px"></div>`;
        host.querySelector('#btn').onclick=e=>{e.target.disabled=true;api.som('barrado');api.reagir('pensando');host.querySelector('#host').innerHTML=api.codigo(`class PedidoService {
    void finalizar(Pedido p) {
        try (Connection conn = DriverManager.getConnection(...);
             PreparedStatement ps = conn.prepareStatement("INSERT ...")) {
            ps.executeUpdate();   // JDBC no meio da regra
        } catch (SQLException e) { throw new RuntimeException(e); }
        // ... e a lógica de negócio se perde aqui
    }
}`);api.pronto('Acoplado, intestável, e a mesma query copiada em vários lugares');}; } },
    { fala: ['A pergunta:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">Qual o problema de JDBC dentro do serviço de negócio?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Fica mais lento</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Acopla a regra ao banco: difícil de testar e de trocar a tecnologia</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: acoplamento ao banco':'É a B: acopla e impede testar');}); } },
    { fala: ['A solução começa pelo **contrato**: uma interface de repositório.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">O contrato primeiro</div>${api.codigo(`interface ProdutoRepository {
    Optional<Produto> buscarPorId(Long id);
    List<Produto> listarTodos();
    Produto salvar(Produto p);
    void deletar(Long id);
}`)}<div class="note">A interface diz O QUE dá para fazer, sem uma linha de SQL.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Uma implementação JDBC fica atrás do balcão.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Implementação JDBC</div>${api.codigo(`class ProdutoRepositoryJdbc implements ProdutoRepository {
    private final DataSource ds;
    public Optional<Produto> buscarPorId(Long id) {
        // ... PreparedStatement, ResultSet, mapear
        // converte SQLException em uma exceção do domínio
    }
}`)}<div class="note">Todo o JDBC vive aqui dentro, escondido do resto do sistema.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['E o serviço passa a depender só do **contrato**, recebido por construtor.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">O serviço só conhece a interface</div>${api.codigo(`class ProdutoService {
    private final ProdutoRepository repository;   // a ABSTRAÇÃO
    ProdutoService(ProdutoRepository repository) {
        this.repository = repository;
    }
    void aplicarDesconto(Long id, double pct) {
        Produto p = repository.buscarPorId(id).orElseThrow();
        p.aplicarDesconto(pct);      // regra de negócio pura
        repository.salvar(p);
    }
}`)}<div class="note">O serviço não sabe se por trás é MySQL, Postgres ou um HashMap.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['O ganho concreto: uma implementação **em memória** para testar sem banco. Toca para trocar o balcão.'], interativo: true, emocao: 'feliz', dica: 'Clique em "usar em memória"',
      palco(host, api) { host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: trocar o depósito por uma prateleira de teste</div><div class="analogia-cena"><div class="grande">🗃️</div><div>"o balcão é o mesmo; o estoque é fake"</div></div></div>${api.codigo(`var service = new ProdutoService(new ProdutoRepositoryJdbc(ds));`)}<div class="palco-escolhas"><button class="chip" id="btn">usar em memória (teste)</button></div><div id="host" style="margin-top:10px"></div>`;
        host.querySelector('#btn').onclick=e=>{e.target.disabled=true;api.som('acerto');api.reagir('feliz');host.querySelector('#host').innerHTML=api.codigo(`class ProdutoRepositoryMemoria implements ProdutoRepository {
    private final Map<Long, Produto> banco = new HashMap<>();
    // ...
}
var service = new ProdutoService(new ProdutoRepositoryMemoria());  // teste sem banco!`);api.pronto('Mesma classe de serviço, zero linha alterada: isso é inversão de dependência');}; } },
    { fala: ['E converta a `SQLException` (checked, de JDBC) numa exceção do seu domínio.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Não vaze a tecnologia</div>${api.codigo(`catch (SQLException e) {
    throw new RepositorioException("Erro ao buscar produto " + id, e);
}`)}<div class="note">A camada de serviço não deve conhecer <code>SQLException</code>. É o que o Spring faz com <code>DataAccessException</code>.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Isso é Inversão de Dependência, o D do SOLID.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">O D do SOLID</div>${api.codigo(`// o serviço (alto nível) NÃO depende do JDBC (baixo nível)
// ambos dependem da ABSTRAÇÃO (ProdutoRepository)
ProdutoService  ->  ProdutoRepository  <-  ProdutoRepositoryJdbc`)}<div class="note">Dependa de abstrações, não de implementações. O repositório é a fronteira.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Fixando o benefício:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">Como testar o ProdutoService sem um banco rodando?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Não dá: precisa do MySQL</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Injetar uma implementação em memória do ProdutoRepository</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: implementação em memória para teste':'É a B: a interface permite trocar por uma fake');}); } },
    { fala: ['Fecha com a essência:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem final</div><h2 style="text-align:center; margin-bottom:12px">O que o serviço de negócio deve conhecer?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>O SQL e a Connection JDBC</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Apenas a interface do repositório; zero código de banco</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Perfeito: o serviço só conhece o contrato':'É a B: o serviço depende só da interface');}); } },
    { fala: ['Repository no bolso. Seis imagens.'], emocao: 'feliz',
      palco(host, api) { const cards=[['🛎️','Repository é o balcão','esconde o SQL do resto'],['📄','Interface primeiro','o contrato, sem SQL'],['🔌','Impl JDBC','todo o banco vive aqui'],['🗃️','Impl em memória','testa sem banco'],['🔄','Inversão de dependência','dependa da abstração'],['🚫','Não vaze SQLException','converta em exceção do domínio']]; host.innerHTML=`<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i,t,d])=>`<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`; api.gsap.from(host.querySelectorAll('.recap-card'),{y:26,opacity:0,scale:0.94,duration:0.45,stagger:0.08,ease:'back.out(1.4)'}); } },
  ],
});
