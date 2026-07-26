/**
 * Aula guiada · try-catch-finally e try-with-resources (módulo 16 · docs/page_03.md)
 * Analogia: a luz que apaga sozinha ao sair do quarto (recurso fecha sozinho).
 */
Aula.registrar({
  id: 'exc-try',
  licao: 'exc-try',
  titulo: 'try-with-resources: a luz que apaga sozinha',
  personagem: { nome: 'Bean' },
  fechamento: 'Recurso AutoCloseable fecha sozinho no try-with-resources, em ordem inversa. E ao relançar, preserve a causa original.',

  cenas: [
    { /* 1 */
      fala: ['Todo recurso aberto (arquivo, conexão) precisa ser **fechado**. A imagem: a **luz que apaga sozinha** ao sair do quarto.'],
      palco(host, api) {
        host.innerHTML = `<div style="text-align:center">
          <div class="analogia" style="margin:0 auto 16px; max-width:440px"><div class="analogia-titulo">A ideia de hoje</div>
            <div class="analogia-cena"><div class="grande">💡</div><div>"saiu do quarto? a luz apaga sem você lembrar"</div></div></div>
          <div class="palco-titulo">Módulo 16 · try-with-resources</div>
          <p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`;
        api.gsap.from(host.querySelector('.analogia-cena'), { y: 20, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' });
      },
    },
    { /* 2 problema: fechar na mao */
      fala: ['Fechar **na mão** é onde nasce vazamento: você esquece o `close`, ou o próprio `close` lança. Executa.'],
      interativo: true, emocao: 'alerta', dica: 'Clique em executar',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: lembrar de apagar a luz toda vez</div>
            <div class="analogia-cena"><div class="grande">💡🚪</div><div>"saiu com pressa e deixou a luz acesa"</div></div></div>
          ${api.codigo(`BufferedReader br = new BufferedReader(new FileReader("dados.txt"));
String linha = br.readLine();
// se readLine lançar, o br.close() abaixo nunca roda: recurso vazou
br.close();`)}
          <div class="palco-escolhas"><button class="chip" id="btn">▶ executar (readLine lança)</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{ e.target.disabled=true; api.som('erro');
          const s=host.querySelector('#saida');s.style.display='block';
          s.innerHTML=`<span class="erro">Exceção no readLine: o close() nunca executou. O arquivo ficou aberto.</span>
<span class="neutro">Fechar na mão é frágil: qualquer exceção no meio vaza o recurso.</span>`;
          api.gsap.from(s,{y:10,opacity:0,duration:0.3}); api.reagir('alerta'); api.pronto('Fechar recurso manualmente é onde os vazamentos moram'); };
      },
    },
    { /* 3 solucao: try-with-resources */
      fala: ['O `try-with-resources` fecha sozinho, aconteça o que acontecer. Executa a versão nova.'],
      interativo: true, emocao: 'feliz', dica: 'Clique em executar',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: sensor que apaga a luz sozinho</div>
            <div class="analogia-cena"><div class="grande">💡✅</div><div>"saiu? apagou. Sempre."</div></div></div>
          ${api.codigo(`try (BufferedReader br = new BufferedReader(new FileReader("dados.txt"))) {
    return br.readLine();
}   // br.close() é chamado automaticamente, mesmo se readLine lançar`)}
          <div class="palco-escolhas"><button class="chip" id="btn">▶ executar (readLine lança)</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{ e.target.disabled=true; api.som('pop');
          const s=host.querySelector('#saida');s.style.display='block';
          s.innerHTML=`<span class="ok">Mesmo com a exceção, o br.close() rodou. O arquivo foi fechado.</span>
<span class="neutro">Você declara o recurso no try(...) e esquece do close: a JVM cuida.</span>`;
          api.gsap.from(s,{y:10,opacity:0,duration:0.3}); api.reagir('feliz'); api.pronto('try-with-resources fecha o recurso sempre, sem você lembrar'); };
      },
    },
    { /* 4 nomear: AutoCloseable */
      fala: ['Funciona com qualquer `AutoCloseable`, e fecha em **ordem inversa** da abertura.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">O conceito, agora com nome</div>
          ${api.codigo(`try (Connection conn = ds.getConnection();
     PreparedStatement ps = conn.prepareStatement(SQL);
     ResultSet rs = ps.executeQuery()) {
    // usa rs...
}   // fecha rs, depois ps, depois conn (ordem inversa)`)}
          <div class="note">Qualquer classe que implemente <code>AutoCloseable</code> pode ir no try(...). Fecham do último para o primeiro.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 5 comparacao */
      fala: ['O antes e depois deixa claro o ganho.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Fechar na mão x automático</div>
          <div class="compara">
            <div class="compara-col antes"><h4>✗ manual</h4>${api.codigo(`BufferedReader br = null;
try {
    br = new BufferedReader(...);
    return br.readLine();
} finally {
    if (br != null) br.close();
}`)}</div>
            <div class="compara-col depois"><h4>✓ try-with-resources</h4>${api.codigo(`try (var br =
     new BufferedReader(...)) {
    return br.readLine();
}`)}</div>
          </div>
          <div class="note">Menos código, e impossível esquecer o close.</div>`;
        api.gsap.from(host.querySelectorAll('.compara-col, .note'), { y: 20, opacity: 0, duration: 0.45, stagger: 0.15, ease: 'power2.out' });
      },
    },
    { /* 6 multi-catch e ordem */
      fala: ['No `catch`, a ordem importa: do mais específico para o mais genérico. Qual ordem compila?'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Qual ordem de <code>catch</code> compila?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>catch (Exception e)</code> antes de <code>catch (IOException e)</code></span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>catch (IOException e)</code> antes de <code>catch (Exception e)</code>: específico primeiro</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: específico antes do genérico, senão o bloco fica inalcançável':'É a B: Exception antes de IOException não compila (inalcançável)');});
      },
    },
    { /* 7 finally */
      fala: ['O `finally` sempre executa, com ou sem exceção, com ou sem `return` no try.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">finally: o bloco que sempre roda</div>
          ${api.codigo(`try {
    return processar();
} catch (IOException | SQLException e) {   // multi-catch
    log.error("falha", e);
    throw e;
} finally {
    liberar();   // executa mesmo com o return acima
}`)}
          <div class="note">Nunca use <code>return</code> dentro do finally: ele descarta a exceção em andamento.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 8 encadear preservando a causa */
      fala: ['Ao relançar, um erro comum: **perder a causa** original. Executa e compare.'],
      interativo: true, emocao: 'alerta', dica: 'Clique em executar',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: apagar as pegadas do problema</div>
            <div class="analogia-cena"><div class="grande">🕵️</div><div>"sem a causa, você investiga às cegas"</div></div></div>
          ${api.codigo(`catch (SQLException e) {
    throw new RepositorioException("Falha ao salvar");   // sem passar 'e'
}`)}
          <div class="palco-escolhas"><button class="chip" id="btn">▶ ver o stack trace</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{ e.target.disabled=true; api.som('erro');
          const s=host.querySelector('#saida');s.style.display='block';
          s.innerHTML=`<span class="erro">O stack trace mostra só RepositorioException. A SQLException original sumiu.</span>
<span class="ok">Certo: throw new RepositorioException("Falha ao salvar", e);  // passa a causa</span>`;
          api.gsap.from(s,{y:10,opacity:0,duration:0.3}); api.reagir('alerta'); api.pronto('Sempre passe a exceção original como causa ao relançar'); };
      },
    },
    { /* 9 quiz causa */
      fala: ['A pergunta:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Ao capturar e relançar como outra exceção, o que fazer?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Só a mensagem basta: <code>new X("erro")</code></span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Passar a exceção original como causa: <code>new X("erro", e)</code>, preservando o stack trace</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: preserve a causa, senão perde a origem do bug':'É a B: passe a causa para não perder o stack trace');});
      },
    },
    { /* 10 anti-patterns */
      fala: ['Quatro anti-patterns que aparecem em code review. Toca no que é o pior.'],
      interativo: true, dica: 'Escolha o pior hábito',
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Anti-patterns de exceção</div>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>catch (Exception e) { }</code>: engolir o erro em silêncio</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Logar com <code>e.printStackTrace()</code></span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Usar exceção para controle de fluxo normal</span></button>
          </div>
          <div class="note">Todos são ruins; o catch vazio é o mais perigoso: transforma o bug em silêncio.</div>`;
        const ok=0; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: o catch vazio esconde o erro e é o mais traiçoeiro':'O catch vazio é o pior: engole o erro sem deixar rastro');});
      },
    },
    { /* 11 final */
      fala: ['Fecha com o essencial:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; margin-bottom:12px">Qual a forma correta de garantir que um recurso seja fechado?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Chamar <code>close()</code> no fim do método</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>try-with-resources</code>: declara o AutoCloseable no <code>try(...)</code> e ele fecha sempre</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Perfeito: try-with-resources fecha mesmo com exceção':'É o try-with-resources: o close manual pode ser pulado por uma exceção');});
      },
    },
    { /* 12 recap */
      fala: ['Exceções e recursos no bolso. Seis imagens.'],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [['💡', 'try-with-resources', 'a luz que apaga sozinha'], ['🔒', 'AutoCloseable', 'fecha em ordem inversa da abertura'], ['📋', 'catch específico antes', 'senão o bloco fica inalcançável'], ['♾️', 'finally sempre roda', 'mas nunca dê return nele'], ['🕵️', 'Preserve a causa', 'new X("erro", e) mantém o stack trace'], ['🤫', 'Catch vazio, jamais', 'engolir o erro é o pior hábito']];
        host.innerHTML = `<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i, t, d]) => `<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`;
        api.gsap.from(host.querySelectorAll('.recap-card'), { y: 26, opacity: 0, scale: 0.94, duration: 0.45, stagger: 0.08, ease: 'back.out(1.4)' });
      },
    },
  ],
});
