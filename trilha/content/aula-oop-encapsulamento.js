/**
 * Aula guiada · Encapsulamento e visibilidade (módulos 5 e 11 · docs/page_01.md)
 *
 * Produzida pela esteira de docs/metodologia (exemplo de referência).
 * Analogias, sempre ANTES do conceito:
 *   campo public          = cofre com a porta aberta (qualquer um mexe no saldo)
 *   private + operações   = cofre trancado + guichê que valida
 *   modificadores acesso  = níveis de crachá (quem entra em qual sala)
 *   vazamento de referência = entregar cópia da chave do cofre
 *   cópia defensiva       = entregar uma fotocópia, não o original
 */
Aula.registrar({
  id: 'oop-encapsulamento',
  licao: 'oop-encapsulamento',
  titulo: 'Encapsulamento: o objeto que tranca o próprio cofre',
  personagem: { nome: 'Bean' },
  fechamento: 'Encapsular é o objeto proteger a si mesmo. Cofre trancado, guichê que valida, e nunca entregar a chave.',

  cenas: [

    /* ---------------------------------------------------------- 1 intro */
    {
      fala: [
        'Bora de OOP. O primeiro pilar, e o mais mal-entendido: **encapsulamento**.',
        'A ideia em uma imagem: um objeto bem feito é um **cofre**. Ele guarda o próprio dinheiro e não deixa ninguém enfiar a mão lá dentro.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div style="text-align:center">
            <div class="analogia" style="margin:0 auto 16px; max-width:420px">
              <div class="analogia-titulo">A ideia de hoje</div>
              <div class="analogia-cena">
                <div class="cofre trancado">
                  <div class="cofre-icone">🔒</div>
                  <div class="cofre-saldo">R$ 1.000</div>
                  <div class="cofre-tag">conta protegida</div>
                </div>
              </div>
            </div>
            <div class="palco-titulo">Módulos 5 e 11 · Orientação a objetos</div>
            <p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">
              12 etapas. Analogia primeiro, código depois.
            </p>
          </div>`;
        api.gsap.from(host.querySelector('.cofre'), {
          scale: 0.7, opacity: 0, duration: 0.6, ease: 'back.out(1.7)',
        });
      },
    },

    /* -------------------------------------------- 2 a conta aberta (problema) */
    {
      fala: [
        'Mas imagina uma conta **sem cofre**: o saldo é um campo `public`, e existe um `setSaldo()` aberto pra qualquer um.',
        'Testa. Mexe no saldo à vontade.',
      ],
      interativo: true,
      emocao: 'pensando',
      dica: 'Clique nos dois botões e veja o estrago',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: a gaveta sem tranca</div>
            <div class="analogia-cena"><div class="grande">🗄️</div><div>"o dinheiro está aqui, qualquer um pega"</div></div>
          </div>
          ${api.codigo(`public double saldo;   // campo exposto
conta.saldo = ...;     // qualquer código altera direto`)}
          <div class="cena-linha" style="margin:6px 0 12px">
            <div class="cofre aberto" id="cofre">
              <div class="cofre-icone">🔓</div>
              <div class="cofre-saldo" id="saldo">R$ 1.000</div>
              <div class="cofre-tag">porta aberta</div>
            </div>
          </div>
          <div class="palco-escolhas">
            <button class="chip" data-v="-5000">conta.saldo = -5000</button>
            <button class="chip" data-v="999999">conta.saldo = 999999</button>
          </div>
          <div class="saida" id="saida">O saldo começa em R$ 1.000...</div>`;

        const saldo = host.querySelector('#saldo');
        const saida = host.querySelector('#saida');
        const clicados = new Set();

        host.querySelectorAll('.chip').forEach(chip => {
          chip.onclick = () => {
            if (chip.disabled) return;
            chip.disabled = true;
            const v = Number(chip.dataset.v);
            saldo.textContent = 'R$ ' + v.toLocaleString('pt-BR');
            api.som('barrado');
            api.gsap.fromTo('#cofre', { x: 0 }, { x: 14, duration: 0.08, yoyo: true, repeat: 5, onComplete: () => api.gsap.set('#cofre', { x: 0 }) });
            saida.innerHTML = v < 0
              ? `<span class="erro">Saldo NEGATIVO: um estado que não devia existir.</span>`
              : `<span class="erro">Dinheiro do nada: ninguém depositou, o saldo pulou pra 999.999.</span>`;
            clicados.add(chip.dataset.v);
            if (clicados.size === 2) {
              api.reagir('alerta');
              api.pronto('O objeto está num estado impossível, e ninguém impediu');
            }
          };
        });
      },
    },

    /* ------------------------------------------------ 3 quiz do problema */
    {
      fala: [
        'Antes de consertar: qual é a real falha aqui?',
      ],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:14px">O que há de errado em expor <code>saldo</code> com <code>setSaldo()</code>?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Fica mais lento para acessar o campo</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Permite deixar o objeto num estado impossível (saldo negativo, dinheiro do nada), sem nenhuma validação</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Gasta mais memória por objeto</span></button>
          </div>`;

        const correta = 1;
        host.querySelectorAll('.option').forEach(b => {
          b.onclick = () => {
            const escolha = Number(b.dataset.i);
            host.querySelectorAll('.option').forEach((o, i) => {
              o.classList.add('disabled'); o.onclick = null;
              if (i === correta) o.classList.add('right');
              else if (i === escolha) o.classList.add('wrong');
            });
            api.registrarResposta(escolha === correta);
            api.pronto(escolha === correta
              ? 'Isso: sem validação, o objeto não protege o próprio invariante'
              : 'É a B: o problema é o estado impossível, não desempenho');
          };
        });
      },
    },

    /* --------------------------------------------------- 4 trancar o cofre */
    {
      fala: [
        'A correção começa trancando o cofre: o campo vira `private`.',
        'Toca no cadeado.',
      ],
      interativo: true,
      dica: 'Clique no cadeado para trancar',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: fechar o cofre</div>
            <div class="analogia-cena"><div class="grande">🔐</div><div>"o dinheiro fica dentro, ninguém alcança direto"</div></div>
          </div>
          <div id="codigoHost">${api.codigo(`public double saldo;`)}</div>
          <div class="cena-linha" style="margin:4px 0 12px">
            <button class="cofre aberto" id="cofre" style="cursor:pointer">
              <div class="cofre-icone" id="icone">🔓</div>
              <div class="cofre-saldo">R$ 1.000</div>
              <div class="cofre-tag" id="tag">clique para trancar</div>
            </button>
          </div>
          <div class="saida" id="saida">Campo público: o cofre está aberto.</div>`;

        const cofre = host.querySelector('#cofre');
        cofre.onclick = () => {
          if (cofre.dataset.feito) return;
          cofre.dataset.feito = '1';
          api.som('pop');
          cofre.classList.remove('aberto');
          cofre.classList.add('trancado');
          host.querySelector('#icone').textContent = '🔒';
          host.querySelector('#tag').textContent = 'private';
          host.querySelector('#codigoHost').innerHTML = api.codigo(`private double saldo;   // trancado`);
          api.gsap.fromTo(cofre, { scale: 1.15 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1,0.5)' });
          host.querySelector('#saida').innerHTML =
            `<span class="ok">private: agora nenhum código de fora enxerga ou altera o saldo direto.</span>
<span class="neutro">Mas se ninguém acessa... como deposita? É a próxima cena.</span>`;
          api.reagir('feliz');
          api.pronto('Cofre trancado. Falta o guichê para operar com regra');
        };
      },
    },

    /* ------------------------------------------------------- 5 o guichê */
    {
      fala: [
        'Com o cofre trancado, você opera só pelo **guichê**: métodos que validam antes de mexer no saldo.',
        'Testa as três operações e veja o guichê barrar as inválidas.',
      ],
      interativo: true,
      dica: 'Clique nas três operações',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: o guichê do caixa</div>
            <div class="analogia-cena"><div class="grande">🏦</div><div>"você pede, o caixa confere a regra e faz"</div></div>
          </div>
          ${api.codigo(`public void depositar(double v) {
    if (v <= 0) throw new IllegalArgumentException("valor invalido");
    saldo += v;
}
public void sacar(double v) {
    if (v > saldo) throw new IllegalStateException("saldo insuficiente");
    saldo -= v;
}`)}
          <div class="cena-linha" style="margin:4px 0 10px">
            <div class="cofre trancado" id="cofre">
              <div class="cofre-icone">🔒</div>
              <div class="cofre-saldo" id="saldo">R$ 1.000</div>
              <div class="cofre-tag">via guichê</div>
            </div>
          </div>
          <div class="palco-escolhas">
            <button class="chip" data-op="dep500">depositar(500)</button>
            <button class="chip" data-op="sac3000">sacar(3000)</button>
            <button class="chip" data-op="depNeg">depositar(-100)</button>
          </div>
          <div class="saida" id="saida">Saldo protegido em R$ 1.000.</div>`;

        const saldoEl = host.querySelector('#saldo');
        const saida = host.querySelector('#saida');
        let saldo = 1000;
        const feitas = new Set();

        const acoes = {
          dep500: () => { saldo += 500; return { ok: true, msg: 'depositar(500): guichê aprovou. Saldo agora R$ 1.500.' }; },
          sac3000: () => ({ ok: false, msg: 'sacar(3000): BARRADO, saldo insuficiente. O objeto se protegeu.' }),
          depNeg: () => ({ ok: false, msg: 'depositar(-100): BARRADO, valor inválido. A regra vive dentro do objeto.' }),
        };

        host.querySelectorAll('.chip').forEach(chip => {
          chip.onclick = () => {
            if (chip.disabled) return;
            chip.disabled = true;
            const r = acoes[chip.dataset.op]();
            if (r.ok) {
              api.som('pop');
              saldoEl.textContent = 'R$ ' + saldo.toLocaleString('pt-BR');
              api.gsap.fromTo(saldoEl, { scale: 1.25 }, { scale: 1, duration: 0.3 });
              saida.innerHTML = `<span class="ok">${r.msg}</span>`;
            } else {
              api.som('barrado');
              chip.classList.add('ativo');
              api.gsap.fromTo(chip, { x: 0 }, { x: 12, duration: 0.08, yoyo: true, repeat: 4, onComplete: () => api.gsap.set(chip, { x: 0 }) });
              saida.innerHTML = `<span class="erro">${r.msg}</span>`;
            }
            feitas.add(chip.dataset.op);
            if (feitas.size === 3) {
              api.reagir('feliz');
              api.pronto('O saldo só muda por regra. Isso é o objeto protegendo o invariante');
            }
          };
        });
      },
    },

    /* --------------------------------------------- 6 nomear: encapsulamento */
    {
      fala: [
        'O que você montou tem nome: **encapsulamento**.',
        'Esconder o estado (`private`) e expor só **operações de negócio** que mantêm o objeto sempre válido. Nada de `setSaldo()`.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">O conceito, agora com nome</div>
          ${api.codigo(`public class ContaBancaria {
    private double saldo;           // 1. estado escondido

    public double getSaldo() { return saldo; }   // 2. leitura, se precisa

    public void depositar(double v) {             // 3. operação que valida
        if (v <= 0) throw new IllegalArgumentException("valor invalido");
        saldo += v;
    }
}`)}
          <div class="note">
            A receita: campos private; getter só do que precisa ser lido; nenhum
            setter automático, e sim operações de negócio; validação no construtor
            e em toda mudança de estado.
          </div>`;
        api.gsap.from(host.children, { y: 18, opacity: 0, duration: 0.45, stagger: 0.15 });
      },
    },

    /* ------------------------------------------------- 7 níveis de crachá */
    {
      fala: [
        'E quem pode entrar em quais salas? Java tem **quatro níveis de crachá**: os modificadores de acesso.',
        'Toca em cada linha para ver quem passa.',
      ],
      interativo: true,
      dica: 'Toque nas 4 linhas',
      palco(host, api) {
        const linhas = [
          ['private',   '🔴', 'só a própria classe. O crachá mais restrito.'],
          ['(default)', '🟡', 'a própria classe e o mesmo pacote (package-private).'],
          ['protected', '🟢', 'classe, pacote e as subclasses (inclusive de outro pacote).'],
          ['public',    '🔵', 'o mundo todo. O crachá mestre.'],
        ];

        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: níveis de crachá</div>
            <div class="analogia-cena"><div class="grande">🪪</div><div>"cada crachá abre um conjunto de portas"</div></div>
          </div>
          <table class="mini-tabela">
            <thead><tr><th>Modificador</th><th>Quem acessa</th></tr></thead>
            <tbody>
              ${linhas.map((l, i) => `<tr data-i="${i}" style="cursor:pointer">
                <td>${l[1]} <b>${l[0]}</b></td><td class="cel">clique</td></tr>`).join('')}
            </tbody>
          </table>
          <div class="saida" id="saida">Do mais fechado ao mais aberto.</div>`;

        const saida = host.querySelector('#saida');
        const vistos = new Set();
        host.querySelectorAll('tbody tr').forEach(tr => {
          tr.onclick = () => {
            host.querySelectorAll('tbody tr').forEach(x => x.classList.remove('acesa'));
            tr.classList.add('acesa');
            api.som('clique');
            const l = linhas[Number(tr.dataset.i)];
            tr.querySelector('.cel').innerHTML = l[2];
            vistos.add(l[0]);
            saida.innerHTML = `<span class="neutro"><b>${l[0]}</b>: ${l[2]}</span>`;
            if (vistos.size === 4) api.pronto('Regra prática: comece sempre pelo mais fechado (private)');
          };
        });
      },
    },

    /* ---------------------------------------------- 8 quiz do modificador */
    {
      fala: [
        'Testa o crachá.',
      ],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:14px">Qual modificador libera a <b>subclasse</b> e o <b>pacote</b>, mas não o resto do mundo?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><code>private</code></span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>protected</code></span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span><code>public</code></span></button>
          </div>`;

        const correta = 1;
        host.querySelectorAll('.option').forEach(b => {
          b.onclick = () => {
            const escolha = Number(b.dataset.i);
            host.querySelectorAll('.option').forEach((o, i) => {
              o.classList.add('disabled'); o.onclick = null;
              if (i === correta) o.classList.add('right');
              else if (i === escolha) o.classList.add('wrong');
            });
            api.registrarResposta(escolha === correta);
            api.pronto(escolha === correta
              ? 'Isso: protected inclui as subclasses, o que private e default não fazem'
              : 'É protected: private só a classe, public libera todo mundo');
          };
        });
      },
    },

    /* ------------------------------------------ 9 a cópia da chave (leak) */
    {
      fala: [
        'Falta a armadilha que pega gente experiente. Você trancou o cofre... e devolve a lista interna num getter.',
        'Isso é **entregar uma cópia da chave**. Executa e olha o que acontece com o cofre "protegido".',
      ],
      interativo: true,
      emocao: 'alerta',
      dica: 'Clique em executar',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: entregar a cópia da chave</div>
            <div class="analogia-cena"><div class="grande">🗝️</div><div>"tranquei o cofre, mas te dei uma chave..."</div></div>
          </div>
          ${api.codigo(`public List<Item> getItens() {
    return itens;   // devolve a lista INTERNA
}

// lá fora, longe da classe:
conta.getItens().clear();   // esvaziou o cofre por dentro`)}
          <div class="palco-escolhas">
            <button class="chip" id="btnRun">▶ executar getItens().clear()</button>
          </div>
          <div class="saida" id="saida" style="display:none"></div>`;

        host.querySelector('#btnRun').onclick = e => {
          e.target.disabled = true;
          api.som('erro');
          const boom = document.createElement('div');
          boom.className = 'boom'; boom.textContent = '💥';
          host.appendChild(boom);
          api.gsap.fromTo(boom, { scale: 0, opacity: 1 }, { scale: 2.2, opacity: 0, duration: 0.9, ease: 'power2.out', onComplete: () => boom.remove() });
          const saida = host.querySelector('#saida');
          saida.style.display = 'block';
          saida.innerHTML =
            `<span class="erro">A lista interna foi esvaziada de FORA da classe.</span>
<span class="neutro">O private protegeu a referência, não o objeto apontado.
Devolver a coleção interna é entregar a chave do cofre.</span>`;
          api.gsap.from(saida, { y: 12, opacity: 0, duration: 0.35 });
          api.reagir('alerta');
          api.pronto('Trancar o campo não basta se você entrega o conteúdo por referência');
        };
      },
    },

    /* -------------------------------------------------- 10 a fotocópia */
    {
      fala: [
        'A correção: nunca entregue o original. Entregue uma **fotocópia**, ou uma view que não deixa alterar.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Cópia da chave × fotocópia</div>
          <div class="compara">
            <div class="compara-col antes">
              <h4>✗ entrega o original</h4>
              ${api.codigo(`public List<Item> getItens() {
    return itens;   // chave do cofre
}`)}
            </div>
            <div class="compara-col depois">
              <h4>✓ entrega cópia / view</h4>
              ${api.codigo(`public List<Item> getItens() {
    return List.copyOf(itens);
    // ou Collections
    //   .unmodifiableList(itens)
}`)}
            </div>
          </div>
          <div class="note">
            Cópia defensiva vale nos dois sentidos: também ao RECEBER uma coleção
            no construtor, copie antes de guardar, senão quem passou continua
            mexendo no seu estado.
          </div>`;
        api.gsap.from(host.querySelectorAll('.compara-col, .note'), {
          y: 20, opacity: 0, duration: 0.45, stagger: 0.15, ease: 'power2.out',
        });
      },
    },

    /* ----------------------------------------------- 11 checagem final */
    {
      fala: [
        'Última checagem, a pergunta que separa quem decorou de quem entendeu.',
      ],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; margin-bottom:14px">Por que expor <code>depositar()</code>/<code>sacar()</code> em vez de um <code>setSaldo()</code>?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Porque método com nome de verbo é mais bonito</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Porque a operação valida e mantém o objeto sempre válido; um setter deixaria qualquer um pôr o saldo num estado impossível</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Porque setters são proibidos em Java</span></button>
          </div>`;

        const correta = 1;
        host.querySelectorAll('.option').forEach(b => {
          b.onclick = () => {
            const escolha = Number(b.dataset.i);
            host.querySelectorAll('.option').forEach((o, i) => {
              o.classList.add('disabled'); o.onclick = null;
              if (i === correta) o.classList.add('right');
              else if (i === escolha) o.classList.add('wrong');
            });
            api.registrarResposta(escolha === correta);
            api.pronto(escolha === correta
              ? 'Perfeito: o objeto protege o próprio invariante. Isso é encapsulamento'
              : 'É a B: a operação carrega a regra; o setter joga a regra pra fora');
          };
        });
      },
    },

    /* ---------------------------------------------------------- 12 recap */
    {
      fala: [
        'Fechou o primeiro pilar. Seis imagens pra levar.',
      ],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [
          ['🔒', 'Estado é cofre trancado', 'campos <code>private</code>, ninguém mexe direto'],
          ['🏦', 'Opere pelo guichê', 'operações de negócio que validam, nunca <code>setSaldo()</code>'],
          ['🛡️', 'O objeto guarda o invariante', 'estado impossível não deve ser alcançável'],
          ['🪪', '4 crachás de acesso', '<code>private</code> < default < <code>protected</code> < <code>public</code>'],
          ['🗝️', 'Não entregue a chave', 'devolver a coleção interna fura o encapsulamento'],
          ['📄', 'Entregue a fotocópia', '<code>List.copyOf</code> ou view imutável; copie ao receber também'],
        ];

        host.innerHTML = `
          <div class="palco-titulo">O que ficou</div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">
            ${cards.map(([i, t, d]) => `
              <div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px">
                <div style="font-size:1.4rem; margin-bottom:5px">${i}</div>
                <div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div>
                <div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div>
              </div>`).join('')}
          </div>`;
        api.gsap.from(host.querySelectorAll('.recap-card'), {
          y: 26, opacity: 0, scale: 0.94, duration: 0.45, stagger: 0.08, ease: 'back.out(1.4)',
        });
      },
    },
  ],
});
