/**
 * Aula guiada · Conexão e PreparedStatement (módulo 33 · docs/page_05.md)
 * Analogia: o formulário com lacunas (?) x escrever a frase inteira à mão.
 */
Aula.registrar({
  id: 'jdbc-conexao', licao: 'jdbc-conexao',
  titulo: 'JDBC: o formulário com lacunas',
  personagem: { nome: 'Bean' },
  fechamento: 'PreparedStatement separa o formulário (SQL) dos dados: mata a injeção e pré-compila. E dinheiro vai em BigDecimal, nunca double.',
  cenas: [
    { fala: ['Acessar banco com JDBC tem uma regra de ouro. A imagem: um **formulário com lacunas** (`?`) em vez de escrever a frase de SQL inteira à mão.'],
      palco(host, api) { host.innerHTML = `<div style="text-align:center"><div class="analogia" style="margin:0 auto 16px; max-width:440px"><div class="analogia-titulo">A ideia de hoje</div><div class="analogia-cena"><div><div class="grande">📝</div><div>frase inteira<br>à mão</div></div><div><div class="grande">📋</div><div>formulário<br>com lacunas ?</div></div></div></div><div class="palco-titulo">Módulo 33 · Banco de dados</div><p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`; api.gsap.from(host.querySelectorAll('.analogia-cena > div'), { y: 20, opacity: 0, duration: 0.5, stagger: 0.14, ease: 'back.out(1.5)' }); } },
    { fala: ['Concatenar SQL é a **injeção** esperando acontecer. Executa com um login malicioso.'], interativo: true, emocao: 'alerta', dica: 'Clique em executar',
      palco(host, api) { host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: deixar o cliente escrever no seu formulário</div><div class="analogia-cena"><div class="grande">🕳️</div><div>"' OR '1'='1 abre a porta"</div></div></div>${api.codigo(`String sql = "SELECT * FROM usuario WHERE login = '" + login + "'";
// login = "' OR '1'='1"`)}<div class="palco-escolhas"><button class="chip" id="btn">▶ executar</button></div><div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{e.target.disabled=true;api.som('erro');const s=host.querySelector('#saida');s.style.display='block';s.innerHTML=`<span class="erro">A query vira: WHERE login = '' OR '1'='1'  ->  retorna todos os usuários</span>\n<span class="ok">PreparedStatement com ? nunca deixa o dado virar comando.</span>`;api.gsap.from(s,{y:10,opacity:0,duration:0.3});api.reagir('alerta');api.pronto('SQL concatenado = injeção. Nunca faça isso');}; } },
    { fala: ['A pergunta:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">O que previne SQL Injection?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Validar o tamanho do login</span></button><button class="option" data-i="1"><span class="option-key">B</span><span><code>PreparedStatement</code> com <code>?</code>: o valor nunca é interpretado como SQL</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: PreparedStatement parametriza':'É PreparedStatement: separa dado de comando');}); } },
    { fala: ['O `PreparedStatement` é o formulário: o `?` recebe o valor separado do comando.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">O conceito, agora com nome</div>${api.codigo(`String sql = "SELECT * FROM usuario WHERE login = ?";
try (PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setString(1, login);      // índice começa em 1
    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) { }
    }
}`)}<div class="note">Além de matar a injeção, o PreparedStatement é pré-compilado pelo banco: reexecutar reaproveita o plano.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Conexão sempre com try-with-resources.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Conectar e fechar</div>${api.codigo(`try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {
    // ... usa a conexão
}   // Connection é AutoCloseable: fecha sozinha`)}<div class="note">Desde o JDBC 4.0 não precisa de <code>Class.forName</code>: o driver se registra sozinho.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['INSERT recuperando o id gerado pelo banco.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">INSERT com id gerado</div>${api.codigo(`String sql = "INSERT INTO produto (nome, preco) VALUES (?, ?)";
try (PreparedStatement ps = conn.prepareStatement(sql, RETURN_GENERATED_KEYS)) {
    ps.setString(1, p.getNome());
    ps.setBigDecimal(2, p.getPreco());
    ps.executeUpdate();
    try (ResultSet chaves = ps.getGeneratedKeys()) {
        if (chaves.next()) p.setId(chaves.getLong(1));
    }
}`)}<div class="note"><code>getGeneratedKeys</code> traz o id que o banco criou.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Ler resultado é iterar o `ResultSet` e mapear para objeto.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">SELECT e mapeamento</div>${api.codigo(`try (ResultSet rs = ps.executeQuery()) {
    while (rs.next()) {   // avança e devolve false no fim
        Produto p = new Produto();
        p.setId(rs.getLong("id"));
        p.setNome(rs.getString("nome"));
        p.setPreco(rs.getBigDecimal("preco"));
    }
}`)}<div class="note"><code>rs.next()</code> move o cursor; os <code>getXxx</code> leem as colunas.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Uma pegadinha silenciosa: dinheiro. Toca em cada tipo.'], interativo: true, dica: 'Toque nos dois',
      palco(host, api) { const d={double:'ponto flutuante binário: NÃO representa 0.1 exato; o arredondamento aparece no extrato',BigDecimal:'decimal exato: o tipo correto para dinheiro'};
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: centavos que somem</div><div class="analogia-cena"><div class="grande">💸</div><div>"0.1 + 0.2 não dá 0.3 no double"</div></div></div><div class="palco-escolhas"><button class="chip" data-k="double">double</button><button class="chip" data-k="BigDecimal">BigDecimal</button></div><div class="saida" id="saida">Toque para ver cada tipo</div>`;
        const s=host.querySelector('#saida');const vistos=new Set();host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{host.querySelectorAll('.chip').forEach(x=>x.classList.remove('ativo'));c.classList.add('ativo');api.som('clique');s.innerHTML=`<span class="neutro"><b>${c.dataset.k}</b>: ${d[c.dataset.k]}</span>`;vistos.add(c.dataset.k);if(vistos.size===2)api.pronto('Dinheiro é sempre BigDecimal, nunca double');}); } },
    { fala: ['E a transação: tudo ou nada.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Transação</div>${api.codigo(`conn.setAutoCommit(false);
try {
    debitar(conn, origem, valor);
    creditar(conn, destino, valor);
    conn.commit();
} catch (SQLException e) {
    conn.rollback();
    throw e;
}`)}<div class="note">Ou as duas operações valem, ou nenhuma: <code>commit</code> confirma, <code>rollback</code> desfaz.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Fixando o dinheiro:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">Qual tipo Java para um valor monetário?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span><code>double</code></span></button><button class="option" data-i="1"><span class="option-key">B</span><span><code>BigDecimal</code>: decimal exato, sem erro de ponto flutuante</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: dinheiro = BigDecimal':'É BigDecimal: double perde centavos');}); } },
    { fala: ['Fecha com a regra de ouro:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem final</div><h2 style="text-align:center; margin-bottom:12px">Como montar uma query com valor vindo do usuário?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Concatenar o valor na String de SQL</span></button><button class="option" data-i="1"><span class="option-key">B</span><span><code>PreparedStatement</code> com <code>?</code> e <code>setString/setLong</code></span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Perfeito: sempre PreparedStatement':'É PreparedStatement: nunca concatene SQL');}); } },
    { fala: ['JDBC no bolso. Seis imagens.'], emocao: 'feliz',
      palco(host, api) { const cards=[['📋','PreparedStatement','o formulário com lacunas ?'],['🕳️','Statement concatenado','injeção de SQL: nunca'],['⚡','Pré-compilado','reaproveita o plano de execução'],['🔑','getGeneratedKeys','recupera o id gerado'],['💰','BigDecimal','dinheiro, nunca double'],['🔒','try-with-resources','fecha Connection, Statement, ResultSet']]; host.innerHTML=`<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i,t,d])=>`<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`; api.gsap.from(host.querySelectorAll('.recap-card'),{y:26,opacity:0,scale:0.94,duration:0.45,stagger:0.08,ease:'back.out(1.4)'}); } },
  ],
});
