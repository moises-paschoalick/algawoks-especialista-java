/**
 * Aula guiada · Hierarquia, checked e unchecked (módulo 16 · docs/page_03.md)
 * Analogia: alarme de incêndio (Error) x aviso esperado (checked) x você errou (unchecked).
 */
Aula.registrar({
  id: 'exc-hierarquia',
  licao: 'exc-hierarquia',
  titulo: 'Exceções: qual alarme você trata',
  personagem: { nome: 'Bean' },
  fechamento: 'Error é alarme de incêndio (não capture); checked é aviso externo (reaja); unchecked é bug seu (conserte o código).',

  cenas: [
    { /* 1 */
      fala: ['Nem todo erro se trata igual. Pensa em três **alarmes**: o de incêndio, o aviso de "arquivo não encontrado" e o "você digitou errado".'],
      palco(host, api) {
        host.innerHTML = `<div style="text-align:center">
          <div class="analogia" style="margin:0 auto 16px; max-width:460px"><div class="analogia-titulo">A ideia de hoje</div>
            <div class="analogia-cena"><div><div class="grande">🔥</div><div>Error<br>não mexe</div></div><div><div class="grande">📁</div><div>checked<br>reaja</div></div><div><div class="grande">✍️</div><div>unchecked<br>bug seu</div></div></div></div>
          <div class="palco-titulo">Módulo 16 · Exceções</div>
          <p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`;
        api.gsap.from(host.querySelectorAll('.analogia-cena > div'), { y: 20, opacity: 0, duration: 0.5, stagger: 0.14, ease: 'back.out(1.5)' });
      },
    },
    { /* 2 a arvore */
      fala: ['Tudo desce de `Throwable`. Dele saem dois ramos: `Error` e `Exception`.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">A árvore das exceções</div>
          ${api.codigo(`Throwable
  ├── Error                    falha grave da JVM: NÃO capture
  │     └── OutOfMemoryError, StackOverflowError
  └── Exception
        ├── RuntimeException   UNCHECKED: erro de programação
        │     └── NullPointer, IllegalArgument, IllegalState...
        └── (demais)           CHECKED: condição externa esperada
              └── IOException, SQLException...`)}
          <div class="note">A posição na árvore decide como você trata: capturar, deixar subir, ou nem tocar.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 3 Error nao capture */
      fala: ['O `Error` é o alarme de incêndio: a JVM está em pane. Tenta capturar e veja por que é má ideia.'],
      interativo: true, emocao: 'alerta', dica: 'Clique em "capturar o Error"',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: desligar o alarme de incêndio no meio do fogo</div>
            <div class="analogia-cena"><div class="grande">🔥🤫</div><div>"silenciar o alarme não apaga o fogo"</div></div></div>
          ${api.codigo(`try {
    processar();
} catch (OutOfMemoryError e) {   // capturar Error: quase sempre errado
    // ...e agora? a heap acabou, não há o que fazer
}`)}
          <div class="palco-escolhas"><button class="chip" id="btn">capturar o Error</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{ e.target.disabled=true; api.som('barrado');
          const s=host.querySelector('#saida');s.style.display='block';
          s.innerHTML=`<span class="erro">Você silenciou uma falha irrecuperável. O processo devia morrer, e não morre.</span>
<span class="neutro">Error sinaliza pane da JVM. Deixe subir e derrubar o processo.</span>`;
          api.gsap.from(s,{y:10,opacity:0,duration:0.3}); api.reagir('alerta'); api.pronto('Error é para a JVM, não para você tratar'); };
      },
    },
    { /* 4 quiz Error */
      fala: ['Confirma:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:14px">O que fazer com um <code>Error</code> (ex.: <code>OutOfMemoryError</code>)?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Capturar e continuar como se nada fosse</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Não capturar: sinaliza pane da JVM; deixe o processo cair</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: Error não se captura':'É a B: Error é falha grave, não se trata');});
      },
    },
    { /* 5 checked */
      fala: ['A **checked** é a condição externa esperada: o arquivo pode não existir, a rede pode cair. O compilador te **obriga** a lidar.'],
      interativo: true, dica: 'Clique em "compilar sem tratar"',
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: o aviso de "arquivo não encontrado"</div>
            <div class="analogia-cena"><div class="grande">📁❓</div><div>"o mundo externo falhou; você pode reagir"</div></div></div>
          ${api.codigo(`String ler(Path p) {
    return Files.readString(p);   // lança IOException (checked)
}`)}
          <div class="palco-escolhas"><button class="chip" id="btn">compilar sem tratar</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{ e.target.disabled=true; api.som('barrado');
          const s=host.querySelector('#saida');s.style.display='block';
          s.innerHTML=`<span class="erro">ERRO DE COMPILAÇÃO: unhandled exception IOException</span>
<span class="ok">Você precisa: try/catch, OU declarar throws IOException e deixar subir.</span>`;
          api.gsap.from(s,{y:10,opacity:0,duration:0.3}); api.pronto('Checked: o compilador cobra o tratamento na hora'); };
      },
    },
    { /* 6 unchecked */
      fala: ['A **unchecked** é o bug de quem chamou: argumento inválido, null. Não precisa declarar.'],
      palco(host, api) {
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: "você digitou errado"</div>
            <div class="analogia-cena"><div class="grande">✍️❌</div><div>"o erro é no código, não no mundo lá fora"</div></div></div>
          ${api.codigo(`public void sacar(double valor) {
    if (valor <= 0) throw new IllegalArgumentException("valor invalido");   // unchecked
    if (valor > saldo) throw new IllegalStateException("saldo insuficiente");
}`)}
          <div class="note">Unchecked (RuntimeException) sinaliza erro de programação. Corrija o código, não capture para esconder.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 7 nomear: tabela */
      fala: ['Resumindo o contraste:'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checked x Unchecked</div>
          <table class="mini-tabela">
            <thead><tr><th></th><th>Checked</th><th>Unchecked</th></tr></thead>
            <tbody>
              <tr><td>herda de</td><td>Exception</td><td>RuntimeException</td></tr>
              <tr><td>compilador exige</td><td>sim</td><td>não</td></tr>
              <tr><td>representa</td><td>condição externa</td><td>erro de programação</td></tr>
              <tr><td>exemplo</td><td>IOException</td><td>NullPointer, IllegalArgument</td></tr>
            </tbody>
          </table>
          <div class="note">Em código de aplicação, a tendência moderna (inclusive Spring) é preferir unchecked.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 8 quiz classificar */
      fala: ['Classifica:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px"><code>NullPointerException</code> é...</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Checked: o compilador obriga a tratar</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Unchecked (RuntimeException): erro de programação, não precisa declarar</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Isso: NPE é unchecked':'É unchecked: NPE herda de RuntimeException');});
      },
    },
    { /* 9 como decidir */
      fala: ['Como escolher qual lançar? A pergunta é: quem chama consegue e deve reagir?'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Como decidir</div>
          ${api.codigo(`// o chamador PODE reagir (tentar outro servidor)? -> checked
String buscar(URL u) throws IOException { ... }

// é bug de quem chamou (argumento/estado inválido)? -> unchecked
void sacar(double v) {
    if (v <= 0) throw new IllegalArgumentException("valor invalido");
}`)}
          <div class="note">Na dúvida em código de aplicação, prefira unchecked. Nunca capture <code>Throwable</code> ou <code>Error</code>.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 10 excecao custom */
      fala: ['Exceção customizada boa carrega **dados**, não só uma mensagem de texto.'],
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Exceção com dados estruturados</div>
          ${api.codigo(`class SaldoInsuficienteException extends RuntimeException {
    private final double deficit;
    SaldoInsuficienteException(double saldo, double pedido) {
        super("Faltam %.2f".formatted(pedido - saldo));
        this.deficit = pedido - saldo;
    }
    public double getDeficit() { return deficit; }
}`)}
          <div class="note">Quem captura decide o que fazer usando os dados, sem parsear a mensagem.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },
    { /* 11 final */
      fala: ['Fecha com a decisão:'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `<div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; margin-bottom:12px">Um método valida um argumento e o recebe inválido. Que tipo de exceção lançar?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Checked: forçar o chamador a tratar</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Unchecked (<code>IllegalArgumentException</code>): é bug de quem chamou</span></button>
          </div>`;
        const ok=1; host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});
          api.registrarResposta(e===ok); api.pronto(e===ok?'Perfeito: argumento inválido é erro de programação, unchecked':'É unchecked: IllegalArgumentException para argumento inválido');});
      },
    },
    { /* 12 recap */
      fala: ['Exceções no bolso. Seis imagens.'],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [['🌳', 'Throwable', 'Error e Exception saem dele'], ['🔥', 'Error não se captura', 'pane da JVM: deixe subir'], ['📁', 'Checked', 'condição externa; o compilador cobra'], ['✍️', 'Unchecked', 'bug de quem chamou; corrija o código'], ['🤔', 'Como decidir', 'o chamador pode reagir? checked, senão unchecked'], ['📦', 'Custom com dados', 'carregue o erro, não só a mensagem']];
        host.innerHTML = `<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i, t, d]) => `<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`;
        api.gsap.from(host.querySelectorAll('.recap-card'), { y: 26, opacity: 0, scale: 0.94, duration: 0.45, stagger: 0.08, ease: 'back.out(1.4)' });
      },
    },
  ],
});
