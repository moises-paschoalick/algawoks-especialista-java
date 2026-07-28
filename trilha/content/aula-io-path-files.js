/**
 * Aula guiada · Path e Files: a API moderna (módulo 29 · docs/page_08.md)
 * Analogia: o endereço no envelope (Path) x ir até lá e abrir a porta (Files).
 */
Aula.registrar({
  id: 'io-path-files', licao: 'io-path-files',
  titulo: 'Path e Files: o endereço e a ação',
  personagem: { nome: 'Bean' },
  fechamento: 'Path é só o endereço (não toca o disco); Files age e lança exceção que explica. Files.lines é lazy para arquivos grandes.',
  cenas: [
    { fala: ['Ler e escrever arquivo no Java moderno é NIO2. A imagem: `Path` é o **endereço no envelope**; `Files` é **ir até lá e abrir a porta**.'],
      palco(host, api) { host.innerHTML = `<div style="text-align:center"><div class="analogia" style="margin:0 auto 16px; max-width:440px"><div class="analogia-titulo">A ideia de hoje</div><div class="analogia-cena"><div><div class="grande">✉️</div><div>Path<br>o endereço</div></div><div><div class="grande">🚪</div><div>Files<br>a ação</div></div></div></div><div class="palco-titulo">Módulo 29 · NIO2</div><p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`; api.gsap.from(host.querySelectorAll('.analogia-cena > div'), { y: 20, opacity: 0, duration: 0.5, stagger: 0.14, ease: 'back.out(1.5)' }); } },
    { fala: ['A API antiga (`File`) mentia: `delete()` devolvia um `boolean` mudo. Executa.'], interativo: true, emocao: 'alerta', dica: 'Clique em executar',
      palco(host, api) { host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: a porta que fecha sem dizer por quê</div><div class="analogia-cena"><div class="grande">🚪❓</div><div>"não deletou. Mas por quê?"</div></div></div>${api.codigo(`boolean ok = arquivo.delete();   // false... e agora?
// não existia? estava em uso? sem permissão? você não sabe`)}<div class="palco-escolhas"><button class="chip" id="btn">▶ por que false?</button></div><div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{e.target.disabled=true;api.som('barrado');const s=host.querySelector('#saida');s.style.display='block';s.innerHTML=`<span class="erro">File.delete() devolve false sem dizer a causa.</span>\n<span class="ok">Files.delete(path) lança a exceção certa: NoSuchFile, AccessDenied...</span>`;api.gsap.from(s,{y:10,opacity:0,duration:0.3});api.reagir('alerta');api.pronto('A API antiga engolia o erro; a NIO2 explica');}; } },
    { fala: ['A pergunta:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">Por que preferir <code>Files</code> (NIO2) a <code>File</code>?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>É mais curto de escrever</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Lança exceções que explicam o erro, em vez de um <code>boolean</code> mudo</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: erro que explica > boolean mudo':'É a B: NIO2 lança exceção clara');}); } },
    { fala: ['O `Path` é só o endereço: criá-lo **não toca no disco**.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Path: o endereço no papel</div>${api.codigo(`Path p = Path.of("dados", "clientes.txt");   // nada acontece no disco
p.getFileName();   // clientes.txt
p.getParent();     // dados
p.resolve("sub.txt");   // concatena
p.normalize();     // resolve ".." e "."`)}<div class="note">Path é endereço puro. Nada existe até você chamar algo de <code>Files</code>.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['O `Files` é quem age: criar, checar, copiar, apagar.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Files: as ações</div>${api.codigo(`Files.exists(p);
Files.createDirectories(dir);   // cria a hierarquia toda
Files.copy(origem, destino, StandardCopyOption.REPLACE_EXISTING);
Files.delete(p);                // lança se não existir
Files.deleteIfExists(p);        // devolve boolean`)}<div class="note"><code>createDirectories</code> cria a árvore inteira sem erro se já existir.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Ler arquivo tem dois caminhos: tudo de uma vez, ou linha a linha (lazy). Toca em cada um.'], interativo: true, dica: 'Toque nos dois modos',
      palco(host, api) { const d={readString:'lê o arquivo INTEIRO na memória: bom para arquivos pequenos','Files.lines':'stream lazy, linha a linha: essencial para arquivos GRANDES'};
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: ler o livro todo x página por página</div><div class="analogia-cena"><div class="grande">📖</div><div>"cabe na memória? ou é gigante?"</div></div></div><div class="palco-escolhas"><button class="chip" data-k="readString">Files.readString</button><button class="chip" data-k="Files.lines">Files.lines</button></div><div class="saida" id="saida">Toque para ver cada modo</div>`;
        const s=host.querySelector('#saida');const vistos=new Set();host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{host.querySelectorAll('.chip').forEach(x=>x.classList.remove('ativo'));c.classList.add('ativo');api.som('clique');s.innerHTML=`<span class="neutro"><b>${c.dataset.k}</b>: ${d[c.dataset.k]}</span>`;vistos.add(c.dataset.k);if(vistos.size===2)api.pronto('Pequeno? readString. Gigante? Files.lines lazy');}); } },
    { fala: ['E `Files.lines` precisa ser fechado: sempre com try-with-resources.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Ler grande, de forma lazy</div>${api.codigo(`try (Stream<String> linhas = Files.lines(p)) {
    linhas.filter(l -> l.contains("ERRO"))
          .forEach(System.out::println);
}   // o stream segura o arquivo aberto: feche-o`)}<div class="note"><code>readAllLines</code> carrega tudo na heap: em log de gigabytes é OutOfMemoryError.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['A pegadinha de memória:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">Para processar um log de 5 GB, o que usar?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span><code>Files.readAllLines</code>: carrega tudo</span></button><button class="option" data-i="1"><span class="option-key">B</span><span><code>Files.lines</code>: stream lazy, uma linha por vez</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: lazy evita estourar a heap':'É Files.lines: readAllLines estoura a memória');}); } },
    { fala: ['Percorrer diretórios também é lazy e limpo.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Percorrer pastas</div>${api.codigo(`try (Stream<Path> caminhos = Files.walk(Path.of("projeto"))) {
    caminhos.filter(Files::isRegularFile)
            .filter(p -> p.toString().endsWith(".java"))
            .forEach(System.out::println);
}`)}<div class="note"><code>Files.walk</code> desce a árvore; <code>walkFileTree</code> dá controle fino (pular pastas, tratar erro).</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Fixando Path x Files:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px"><code>Path.of("a/b.txt")</code> cria o arquivo no disco?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Sim, cria o arquivo vazio</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Não: Path é só o endereço; nada existe até chamar Files</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: Path não toca o disco':'É a B: Path é só o endereço');}); } },
    { fala: ['Fecha com a escolha certa:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem final</div><h2 style="text-align:center; margin-bottom:12px">Quem executa a ação no disco (criar, apagar, ler)?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>O próprio <code>Path</code></span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Os métodos estáticos de <code>Files</code>, recebendo o Path</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Perfeito: Files age, Path só endereça':'É Files: o Path é só o endereço');}); } },
    { fala: ['NIO2 no bolso. Seis imagens.'], emocao: 'feliz',
      palco(host, api) { const cards=[['✉️','Path é o endereço','não toca o disco'],['🚪','Files age','e lança exceção que explica'],['🏗️','createDirectories','cria a árvore inteira'],['📖','readString','arquivo pequeno, tudo de uma vez'],['💧','Files.lines (lazy)','arquivo grande, linha a linha'],['🌳','Files.walk','percorre diretórios']]; host.innerHTML=`<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i,t,d])=>`<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`; api.gsap.from(host.querySelectorAll('.recap-card'),{y:26,opacity:0,scale:0.94,duration:0.45,stagger:0.08,ease:'back.out(1.4)'}); } },
  ],
});
