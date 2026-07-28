/**
 * Aula guiada · LocalDate, LocalDateTime e operações (módulo 23 · docs/page_07.md)
 * Analogia: a máquina de etiquetas que imprime uma data nova (nunca altera a antiga).
 */
Aula.registrar({
  id: 'dt-operacoes', licao: 'dt-operacoes',
  titulo: 'Datas: imutáveis, sempre uma nova instância',
  personagem: { nome: 'Bean' },
  fechamento: 'Toda operação de data devolve uma nova instância. Se não reatribuir, plusDays sozinho não faz nada.',
  cenas: [
    { fala: ['Lembra da placa de pedra da String? Data é igual: uma **máquina de etiquetas** que imprime uma data nova, nunca altera a antiga.'],
      palco(host, api) { host.innerHTML = `<div style="text-align:center"><div class="analogia" style="margin:0 auto 16px; max-width:440px"><div class="analogia-titulo">A ideia de hoje</div><div class="analogia-cena"><div class="grande">🏷️</div><div>"imprime uma etiqueta nova, não rasura a antiga"</div></div></div><div class="palco-titulo">Módulo 23 · Operações de data</div><p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p></div>`; api.gsap.from(host.querySelector('.analogia-cena'), { y: 20, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' }); } },
    { fala: ['Criar uma data tem várias portas de entrada.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Criando datas</div>${api.codigo(`LocalDate hoje = LocalDate.now();
LocalDate natal = LocalDate.of(2024, 12, 25);
LocalDate p = LocalDate.parse("2024-12-25");   // ISO
LocalDateTime reuniao = LocalDateTime.of(2024, 12, 25, 14, 30);`)}<div class="note"><code>now</code>, <code>of</code> e <code>parse</code>: as três formas de nascer uma data.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Agora a armadilha da imutabilidade. Executa e repara na data no fim.'], interativo: true, emocao: 'alerta', dica: 'Clique em executar',
      palco(host, api) { host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: imprimir a etiqueta e esquecer de colar</div><div class="analogia-cena"><div class="grande">🏷️🗑️</div><div>"gerou a nova data e jogou fora"</div></div></div>${api.codigo(`LocalDate d = LocalDate.of(2024, 1, 31);
d.plusDays(1);
System.out.println(d);`)}<div class="palco-escolhas"><button class="chip" id="btn">▶ executar</button></div><div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick=e=>{e.target.disabled=true;api.som('barrado');const s=host.querySelector('#saida');s.style.display='block';s.innerHTML=`<span class="erro">Imprime 2024-01-31: nada mudou!</span>\n<span class="ok">Certo: d = d.plusDays(1);   // reatribui a nova etiqueta</span>`;api.gsap.from(s,{y:10,opacity:0,duration:0.3});api.reagir('alerta');api.pronto('plusDays devolve nova data; sem reatribuir, o retorno se perde');}; } },
    { fala: ['A pergunta:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div><h2 style="text-align:center; margin-bottom:12px">Por que <code>data.plusMonths(1);</code> sozinho não muda a data?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Porque plusMonths tem bug</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Data é imutável: a operação devolve uma NOVA data; é preciso reatribuir</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: imutável, reatribua':'É a B: devolve nova instância');}); } },
    { fala: ['Navegar é encadear operações, cada uma gerando uma etiqueta nova.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Navegar no tempo</div>${api.codigo(`LocalDate d = LocalDate.of(2024, 1, 31);
d = d.plusMonths(1);    // 2024-02-29: ajusta para o último dia válido
d = d.withDayOfMonth(1);
d = d.with(TemporalAdjusters.lastDayOfMonth());
d = d.with(TemporalAdjusters.next(DayOfWeek.MONDAY));`)}<div class="note"><code>plus/minus</code> somam e subtraem; <code>with</code> troca um campo; <code>TemporalAdjusters</code> resolve regras de calendário.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Consultar a data é igualmente direto. Toca em cada consulta.'], interativo: true, dica: 'Toque nas três consultas',
      palco(host, api) { const d={getDayOfWeek:'WEDNESDAY: o dia da semana',lengthOfMonth:'quantos dias tem o mês',isLeapYear:'true se o ano é bissexto'};
        host.innerHTML = `<div class="analogia"><div class="analogia-titulo">Mundo real: perguntar à etiqueta</div><div class="analogia-cena"><div class="grande">🔎</div><div>"que dia da semana? quantos dias no mês?"</div></div></div><div class="palco-escolhas">${Object.keys(d).map(k=>`<button class="chip" data-k="${k}">${k}()</button>`).join('')}</div><div class="saida" id="saida">Toque para ver a consulta</div>`;
        const s=host.querySelector('#saida');const vistos=new Set();host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{host.querySelectorAll('.chip').forEach(x=>x.classList.remove('ativo'));c.classList.add('ativo');api.som('clique');s.innerHTML=`<span class="neutro"><b>${c.dataset.k}</b>: ${d[c.dataset.k]}</span>`;vistos.add(c.dataset.k);if(vistos.size===3)api.pronto('A data responde tudo sobre si mesma');}); } },
    { fala: ['Comparar datas é por método, não por operador.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Comparar</div>${api.codigo(`d1.isBefore(d2);
d1.isAfter(d2);
d1.isEqual(d2);

boolean fds = d.getDayOfWeek() == DayOfWeek.SATURDAY
           || d.getDayOfWeek() == DayOfWeek.SUNDAY;`)}<div class="note"><code>isBefore/isAfter/isEqual</code> comparam datas com clareza.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Juntar data e hora é montar as peças.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Combinar data e hora</div>${api.codigo(`LocalDate data = LocalDate.of(2024, 12, 25);
LocalTime hora = LocalTime.of(12, 30);
LocalDateTime junto = data.atTime(hora);
LocalDate soData = junto.toLocalDate();`)}<div class="note"><code>atTime</code> combina; <code>toLocalDate</code> extrai só a data.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Diferença entre datas: Period ou ChronoUnit.'],
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Diferença</div>${api.codigo(`Period idade = Period.between(nascimento, LocalDate.now());
idade.getYears(); idade.getMonths(); idade.getDays();

long dias = ChronoUnit.DAYS.between(inicio, fim);   // total em dias`)}<div class="note">Period quebra em anos/meses/dias; ChronoUnit dá o total.</div>`; api.gsap.from(host.children,{y:16,opacity:0,duration:0.4,stagger:0.12}); } },
    { fala: ['Fixando a imutabilidade com um caso:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem rápida</div>${api.codigo(`LocalDate venc = LocalDate.of(2024, 6, 1);
LocalDate prorrogado = venc.plusDays(30);`)}<h2 style="text-align:center; margin-bottom:12px">O que acontece com <code>venc</code>?</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span>Passa a ser 2024-07-01</span></button><button class="option" data-i="1"><span class="option-key">B</span><span>Continua 2024-06-01; a nova data ficou em <code>prorrogado</code></span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Isso: a original nunca muda':'É a B: venc não muda; o resultado vai para prorrogado');}); } },
    { fala: ['Fecha com o hábito certo:'], interativo: true,
      palco(host, api) { host.innerHTML = `<div class="palco-titulo">Checagem final</div><h2 style="text-align:center; margin-bottom:12px">Para adiar uma data em 7 dias, o correto é:</h2><div class="options"><button class="option" data-i="0"><span class="option-key">A</span><span><code>data.plusDays(7);</code></span></button><button class="option" data-i="1"><span class="option-key">B</span><span><code>data = data.plusDays(7);</code>: reatribui a nova instância</span></button></div>`;
        const ok=1;host.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const e=Number(b.dataset.i);host.querySelectorAll('.option').forEach((o,i)=>{o.classList.add('disabled');o.onclick=null;if(i===ok)o.classList.add('right');else if(i===e)o.classList.add('wrong');});api.registrarResposta(e===ok);api.pronto(e===ok?'Perfeito: sempre reatribua':'É a B: sem reatribuir, o plusDays se perde');}); } },
    { fala: ['Operações de data no bolso. Seis imagens.'], emocao: 'feliz',
      palco(host, api) { const cards=[['🏷️','Imutável','cada operação gera uma nova data'],['🔁','Reatribua','d = d.plusDays(1)'],['➕','plus / minus / with','navega no tempo'],['🧭','TemporalAdjusters','último dia, próxima segunda...'],['🔎','Consultas','getDayOfWeek, lengthOfMonth'],['⚖️','isBefore / isAfter','compare por método, não por operador']]; host.innerHTML=`<div class="palco-titulo">O que ficou</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">${cards.map(([i,t,d])=>`<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px"><div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div><div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}</div>`; api.gsap.from(host.querySelectorAll('.recap-card'),{y:26,opacity:0,scale:0.94,duration:0.45,stagger:0.08,ease:'back.out(1.4)'}); } },
  ],
});
