/**
 * Aula guiada · Streams de I/O e buffers (módulo 28 · docs/page_08.md)
 * Analogia: encher o balde de uma vez (buffer) x carregar colher por colher.
 */
Aula.registrar({
  id: 'io-streams-classicos', licao: 'io-streams-classicos',
  titulo: 'I/O e buffers: o balde em vez da colher',
  personagem: { nome: 'Bean' },
  fechamento: 'Byte stream para binário, char stream para texto (sempre com charset). O buffer lê em bloco, uma ordem de grandeza mais rápido.',
  cenas: [
    { fala: ['I/O clássico tem duas famílias e um truque de desempenho: o **buffer**. A imagem: encher um balde de uma vez, em vez de colher por colher.'],
      palco(host, api) { host.innerHTML = `<div style="text-align:center"><div class="analogia" style="margin:0 auto 16px; max-width:440px"><div class="analogia-titulo">A ideia de hoje</div><div class="analogia-cena"><div><div class="grande">🥄</div><div>sem buffer<br>colher por colher</div></div><div><div class="grande">🪣</div><div>com buffer<br>um bloco</div></div></div></div><div class="palco-titulo">Módulo 28 · I/O e buffers</div><p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`; api.gsap.from(host.querySelectorAll('.analogia-cena > div'), { y: 20, opacity: 0, duration: 0.5, stagger: 0.14, ease: 'back.out(1.5)' }); } },
    { fala: ['Primeiro, duas famílias: **bytes** (binário) e **caracteres** (texto). Toca em cada uma.'], interativo: true, dica: 'Toque nas duas famílias',
      palco(host, api) { const d={'Byte stream':'InputStream/OutputStream: imagem, PDF, qualquer binário','Char stream':'Reader/Writer: texto; trata o charset (encoding)'};
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: tubulação de bytes x de texto</div><div class="analogia-cena"><div class="grande">🔢🔤</div><div>"binário ou texto?"</div></div></div><div class="palco-escolhas">${Object.keys(d).map(k=>`<button class="chip" data-k="${k}">${k}</button>`).join('')}</div><div class="saida" id="saida">Toque para ver cada família</div>`;
        const s=host.querySelector('#saida');const vistos=new Set();host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{host.querySelectorAll('.chip').forEach(x=>x.classList.remove('ativo'));c.classList.add('ativo');api.som('clique');s.innerHTML=`<span class="neutro"><b>${c.dataset.k}</b>: ${d[c.dataset.k]}</span>`;vistos.add(c.dataset.k);if(vistos.size===2)api.pronto('Binário usa byte stream; texto usa Reader/Writer');}); } },
    { fala: ['A pergunta:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">Para ler um arquivo de texto, qual família?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span><code>InputStream</code> (byte stream)</span></button><button class="option" data-i="1"><span class="option-key">B</span><span><code>Reader</code> (char stream): trata o encoding do texto</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: texto = Reader/Writer':'É Reader: char stream trata o charset');}); } },
    { fala: ['Sem buffer, cada `read()` é uma ida ao sistema operacional. Executa e sinta.'], interativo: true, emocao: 'pensando', dica: 'Clique em executar',
      palco(host, api) { host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: uma viagem por colher</div><div class="analogia-cena"><div class="grande">🥄🐌</div><div>"um pedido ao SO por byte"</div></div></div>${api.codigo(`InputStream in = ...;
int b;
while ((b = in.read()) != -1) { ... }   // 1 syscall POR byte`)}<div class="palco-escolhas"><button class="chip" id="btn">▶ 1 MB sem buffer</button></div><div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{e.target.disabled=true;api.som('barrado');const s=host.querySelector('#saida');s.style.display='block';s.innerHTML=`<span class="erro">1 milhão de chamadas ao SO para ler 1 MB. Lento.</span>\n<span class="ok">Com BufferedReader: o Java lê um bloco grande de uma vez.</span>`;api.gsap.from(s,{y:10,opacity:0,duration:0.3});api.reagir('pensando');api.pronto('Sem buffer, cada byte é uma syscall');}; } },
    { fala: ['O `BufferedReader` enche o balde: lê um bloco e serve da memória.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Ler com buffer e charset</div>${api.codigo(`try (BufferedReader br = Files.newBufferedReader(p, StandardCharsets.UTF_8)) {
    String linha;
    while ((linha = br.readLine()) != null) {
        processar(linha);
    }
}`)}<div class="note">O buffer costuma ser uma ordem de grandeza mais rápido que ler byte a byte.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Reparou no charset? Ele é obrigatório, e cai em prova.'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">Por que declarar o charset (ex.: UTF-8) ao ler texto?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Só por organização</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Sem ele, a JVM usa o padrão da plataforma, e o mesmo código quebra acentos em máquinas diferentes</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: charset explícito evita acento quebrado':'É a B: sem charset, a plataforma decide e quebra');}); } },
    { fala: ['Escrever é simétrico.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Escrever com buffer</div>${api.codigo(`try (BufferedWriter bw = Files.newBufferedWriter(p, StandardCharsets.UTF_8,
        StandardOpenOption.CREATE, StandardOpenOption.APPEND)) {
    bw.write("nova linha");
    bw.newLine();
}`)}<div class="note"><code>OpenOptions</code> controlam o modo: CREATE, APPEND, TRUNCATE_EXISTING.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Para binário, copiar é uma linha só.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Binário</div>${api.codigo(`try (InputStream in = Files.newInputStream(origem);
     OutputStream out = Files.newOutputStream(destino)) {
    in.transferTo(out);   // Java 9+, copia direto
}`)}<div class="note"><code>transferTo</code> move os bytes de um stream para o outro sem laço manual.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['E sempre feche os streams: try-with-resources.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Fechar sempre</div>${api.codigo(`// todo InputStream/Reader/Writer é AutoCloseable
try (var br = Files.newBufferedReader(p)) {
    // ...
}   // fecha automaticamente, mesmo com exceção`)}<div class="note">Fechar na mão vaza o recurso quando algo lança no meio, como você viu em try-with-resources.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Fixando o buffer:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">O que o <code>BufferedReader</code> faz de diferente?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Lê byte a byte, uma syscall por byte</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Lê um bloco grande de uma vez e serve as linhas da memória</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: bloco grande, não byte a byte':'É a B: o buffer lê em bloco');}); } },
    { fala: ['Fecha com o charset:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem final</div><h2 style="text-align:center; margin-bottom:12px">Acentos aparecem quebrados só em produção. Causa provável?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Bug do Java</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Charset não declarado: a plataforma de produção usa outro encoding</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Perfeito: sempre declare o charset':'É a B: charset ausente quebra acento entre máquinas');}); } },
    { fala: ['I/O clássico no bolso. Seis imagens.'], emocao: 'feliz',
      palco(host, api) { const cards=[['🔢','Byte stream','binário: InputStream/OutputStream'],['🔤','Char stream','texto: Reader/Writer'],['🪣','Buffer','lê em bloco, muito mais rápido'],['🌐','Charset explícito','sempre, senão quebra acento'],['📦','transferTo','copia binário sem laço'],['🔒','try-with-resources','fecha o stream sempre']]; host.innerHTML=`<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i,t,d])=>`<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`; api.gsap.from(host.querySelectorAll('.recap-card'),{y:26,opacity:0,scale:0.94,duration:0.45,stagger:0.08,ease:'back.out(1.4)'}); } },
  ],
});
