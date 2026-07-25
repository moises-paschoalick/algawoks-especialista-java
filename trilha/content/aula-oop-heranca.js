/**
 * Aula guiada · Herança, polimorfismo e classes abstratas (módulos 12 e 13 · docs/page_01.md)
 *
 * Produzida pela esteira de docs/metodologia.
 * Analogias, sempre ANTES do conceito:
 *   herança            = crachá base + cargos especializados (todo Gerente é um Funcionário)
 *   polimorfismo       = um comando ("rodar a folha"), cada cargo calcula do seu jeito
 *   sobrescrita        = reescrever a regra herdada, reaproveitando com super
 *   classe abstrata    = cargo genérico que não se contrata sozinho
 *   @Override          = o revisor que pega o erro de digitação antes de virar bug
 */
Aula.registrar({
  id: 'oop-heranca',
  licao: 'oop-heranca-polimorfismo',
  titulo: 'Herança e polimorfismo: um comando, cada um do seu jeito',
  personagem: { nome: 'Bean' },
  fechamento: 'Herança reaproveita, polimorfismo deixa cada tipo responder ao seu modo, decidido em tempo de execução.',

  cenas: [

    /* ---------------------------------------------------------- 1 intro */
    {
      fala: [
        'Segundo e terceiro pilares da OOP: **herança** e **polimorfismo**.',
        'Imagem do dia: uma empresa. Tem o crachá base de **Funcionário**, e cargos que são funcionários com um algo a mais.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div style="text-align:center">
            <div class="analogia" style="margin:0 auto 16px; max-width:440px">
              <div class="analogia-titulo">A ideia de hoje</div>
              <div class="cracha-org">
                <div class="cracha base"><div class="cracha-tipo">base</div><div class="cracha-nome">Funcionário</div></div>
                <div class="org-seta">▲ extends</div>
                <div class="org-filhos">
                  <div class="cracha"><div class="cracha-tipo">cargo</div><div class="cracha-nome">Gerente</div></div>
                  <div class="cracha"><div class="cracha-tipo">cargo</div><div class="cracha-nome">Vendedor</div></div>
                </div>
              </div>
            </div>
            <div class="palco-titulo">Módulos 12 e 13 · Herança e Polimorfismo</div>
            <p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">
              12 etapas. Analogia primeiro, código depois.
            </p>
          </div>`;
        api.gsap.from(host.querySelectorAll('.cracha, .org-seta'), {
          y: 20, opacity: 0, duration: 0.5, stagger: 0.12, ease: 'back.out(1.5)',
        });
      },
    },

    /* ------------------------------------------- 2 a dor da repetição */
    {
      fala: [
        'Sem herança, cada cargo é uma classe do zero. Toca em cada uma e repara no que se repete.',
      ],
      interativo: true,
      emocao: 'pensando',
      dica: 'Clique nos três cargos',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: três fichas, o mesmo cabeçalho</div>
            <div class="analogia-cena"><div class="grande">📋📋📋</div><div>"nome, salário base... copiado em toda ficha"</div></div>
          </div>
          <div class="palco-escolhas">
            <button class="chip" data-c="Gerente">class Gerente</button>
            <button class="chip" data-c="Vendedor">class Vendedor</button>
            <button class="chip" data-c="Diretor">class Diretor</button>
          </div>
          <div id="codigoHost" style="margin-top:12px"></div>
          <div class="saida" id="saida">Abra os três e conte as linhas repetidas.</div>`;

        const molde = c => `class ${c} {
    private String nome;        // repetido
    private double salarioBase; // repetido
    public String getNome() { return nome; }  // repetido
    // ... e o que muda de verdade fica perdido no meio
}`;
        const host2 = host.querySelector('#codigoHost');
        const saida = host.querySelector('#saida');
        const vistos = new Set();

        host.querySelectorAll('.chip').forEach(chip => {
          chip.onclick = () => {
            host.querySelectorAll('.chip').forEach(c => c.classList.remove('ativo'));
            chip.classList.add('ativo');
            api.som('clique');
            host2.innerHTML = api.codigo(molde(chip.dataset.c));
            api.gsap.from(host2, { opacity: 0, y: 8, duration: 0.25 });
            vistos.add(chip.dataset.c);
            if (vistos.size === 3) {
              api.reagir('pensando');
              api.pronto('As mesmas 3 linhas, copiadas em cada cargo. Isso é dívida esperando pra dar errado');
            }
          };
        });
      },
    },

    /* ------------------------------------------------ 3 extrair a base */
    {
      fala: [
        'A herança tira o que é comum e sobe pra uma classe **base**. Cada cargo passa a ser um Funcionário `extends`.',
        'Toca para extrair a base.',
      ],
      interativo: true,
      dica: 'Clique em "extrair Funcionário"',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: um cabeçalho só, herdado por todos</div>
            <div class="analogia-cena"><div class="grande">📄⬆️</div><div>"o comum vira o crachá base"</div></div>
          </div>
          <div id="antes">${api.codigo(`class Gerente   { String nome; double salarioBase; ... }
class Vendedor  { String nome; double salarioBase; ... }
class Diretor   { String nome; double salarioBase; ... }`)}</div>
          <div class="palco-escolhas">
            <button class="chip" id="btnExtrair">⬆️ extrair Funcionário</button>
          </div>
          <div id="depois" style="display:none"></div>`;

        host.querySelector('#btnExtrair').onclick = e => {
          e.target.disabled = true;
          api.som('pop');
          host.querySelector('#antes').style.display = 'none';
          const depois = host.querySelector('#depois');
          depois.style.display = 'block';
          depois.innerHTML = api.codigo(`class Funcionario {          // base: o comum, uma vez só
    protected String nome;
    protected double salarioBase;
    public String getNome() { return nome; }
}

class Gerente  extends Funcionario { }   // herda tudo
class Vendedor extends Funcionario { }
class Diretor  extends Funcionario { }`);
          api.gsap.from(depois, { y: 16, opacity: 0, duration: 0.4 });
          api.reagir('feliz');
          api.pronto('Lembra do crachá protected? É ele: visível para a classe e suas subclasses');
        };
      },
    },

    /* --------------------------------------------- 4 nomear: herança */
    {
      fala: [
        'Isso é **herança**: a subclasse ganha estado e comportamento da base, e pode chamar o que herdou com `super`.',
        'A relação é **é-um**: todo Gerente é um Funcionário.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">O conceito, agora com nome</div>
          ${api.codigo(`class Funcionario {
    protected double salarioBase;
    public double calcularSalario() { return salarioBase; }
}

class Gerente extends Funcionario {
    private double bonus;
    @Override
    public double calcularSalario() {
        return super.calcularSalario() + bonus;   // reaproveita e estende
    }
}`)}
          <div class="note">
            <b>super</b> chama a versão da base. <b>extends</b> cria a relação é-um.
            Java tem herança simples: uma classe estende no máximo uma outra.
          </div>`;
        api.gsap.from(host.children, { y: 18, opacity: 0, duration: 0.45, stagger: 0.15 });
      },
    },

    /* ------------------------------------------- 5 sobrescrever a regra */
    {
      fala: [
        'O Gerente calcula salário diferente: base mais bônus. Como escrever isso sem repetir a conta da base?',
      ],
      interativo: true,
      dica: 'Escolha a melhor forma',
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">calcularSalario() do Gerente</div>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Copiar a conta inteira da base e somar o bônus</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><code>return super.calcularSalario() + bonus;</code> reaproveita a base</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Não dá para mudar: o método é herdado fixo</span></button>
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
              ? 'Isso: sobrescrever com super evita duplicar a lógica da base'
              : 'É a B: super reaproveita a base; copiar a conta é a dívida da cena 2 de volta');
          };
        });
      },
    },

    /* --------------------------------------- 6 o problema do pagamento */
    {
      fala: [
        'Agora a folha de pagamento: uma lista com Gerente, Vendedor e Diretor misturados.',
        'Sem polimorfismo, você cai num `if instanceof` sem fim. Olha que feio.',
      ],
      emocao: 'pensando',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: a fila do RH com cargos misturados</div>
            <div class="analogia-cena"><div class="grande">🧾</div><div>"como pagar cada um pela regra certa?"</div></div>
          </div>
          ${api.codigo(`for (Funcionario f : equipe) {
    if (f instanceof Gerente g)        pagar(g.calcularComBonus());
    else if (f instanceof Vendedor v)  pagar(v.calcularComComissao());
    else if (f instanceof Diretor d)   pagar(d.calcularComParticipacao());
    // e a cada cargo novo, mais um if aqui...
}`)}
          <div class="note">Cada cargo novo obriga a mexer nesta fila. Frágil e cansativo.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },

    /* ------------------------------------------ 7 polimorfismo em ação */
    {
      fala: [
        'O polimorfismo apaga todos esses ifs. Você chama **um comando só**, `calcularSalario()`, e cada objeto responde do seu jeito.',
        'Roda a folha e veja cada cargo se pagar sozinho.',
      ],
      interativo: true,
      emocao: 'feliz',
      dica: 'Clique em "rodar a folha"',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: um comando, cada um faz o seu</div>
            <div class="analogia-cena"><div class="grande">🎼</div><div>"o maestro rege; cada instrumento toca sua parte"</div></div>
          </div>
          ${api.codigo(`for (Funcionario f : equipe) {
    pagar(f.calcularSalario());   // um comando, cada tipo decide o valor
}`)}
          <div class="org-filhos" id="equipe" style="margin:12px 0">
            <div class="cracha" data-v="8000"><div class="cracha-tipo">Gerente</div><div class="cracha-nome">Ana</div><div class="cracha-salario" id="s0">R$ ?</div></div>
            <div class="cracha" data-v="4500"><div class="cracha-tipo">Vendedor</div><div class="cracha-nome">Beto</div><div class="cracha-salario" id="s1">R$ ?</div></div>
            <div class="cracha" data-v="15000"><div class="cracha-tipo">Diretor</div><div class="cracha-nome">Cida</div><div class="cracha-salario" id="s2">R$ ?</div></div>
          </div>
          <div class="palco-escolhas">
            <button class="chip" id="btnFolha">▶ rodar a folha</button>
          </div>
          <div class="saida" id="saida">Uma linha de código paga os três, cada um pela sua regra.</div>`;

        host.querySelector('#btnFolha').onclick = e => {
          e.target.disabled = true;
          const crachas = [...host.querySelectorAll('.cracha')];
          crachas.forEach((c, i) => {
            setTimeout(() => {
              api.som('pop');
              const s = c.querySelector('.cracha-salario');
              s.textContent = 'R$ ' + Number(c.dataset.v).toLocaleString('pt-BR');
              s.classList.add('pago');
              c.style.borderColor = 'var(--green)';
              api.gsap.fromTo(c, { scale: 1.12 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
              if (i === crachas.length - 1) {
                api.reagir('feliz');
                api.pronto('Zero if. O objeto sabe quem é e faz o certo: isso é polimorfismo');
              }
            }, 480 * i);
          });
        };
      },
    },

    /* ------------------------------ 8 sobrescrita vs sobrecarga (quiz) */
    {
      fala: [
        'Cuidado com dois nomes parecidos que caem em prova: sobrescrita e sobrecarga.',
      ],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">O Gerente ter seu próprio <code>calcularSalario()</code> com a MESMA assinatura da base é...</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span><b>Sobrecarga</b>: mesmo nome, parâmetros diferentes, resolvida na compilação</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span><b>Sobrescrita</b>: mesma assinatura na subclasse, resolvida em tempo de execução</span></button>
          </div>
          <div class="note">Sobrecarga muda os parâmetros na mesma classe. Sobrescrita mantém a assinatura e troca o comportamento na subclasse.</div>`;

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
              ? 'Isso: mesma assinatura na subclasse é sobrescrita (override)'
              : 'É sobrescrita: mesma assinatura, comportamento novo, decidido em runtime');
          };
        });
      },
    },

    /* --------------------------------------------- 9 classe abstrata */
    {
      fala: [
        'Pensa bem: existe um "Funcionário" genérico pra contratar? Não. Só existem cargos concretos.',
        'Tenta instanciar o Funcionário genérico e veja o que acontece.',
      ],
      interativo: true,
      emocao: 'alerta',
      dica: 'Clique em executar',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: não se contrata um "profissional genérico"</div>
            <div class="analogia-cena"><div class="grande">🚫🧍</div><div>"o molde base existe, mas não vira produto sozinho"</div></div>
          </div>
          ${api.codigo(`abstract class Funcionario {
    public abstract double calcularSalario();   // cada cargo resolve
}`)}
          <div class="palco-escolhas">
            <button class="chip" id="btnRun">▶ new Funcionario()</button>
          </div>
          <div class="saida" id="saida" style="display:none"></div>`;

        host.querySelector('#btnRun').onclick = e => {
          e.target.disabled = true;
          api.som('barrado');
          const boom = document.createElement('div');
          boom.className = 'boom'; boom.textContent = '🚫';
          host.appendChild(boom);
          api.gsap.fromTo(boom, { scale: 0, opacity: 1 }, { scale: 2, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => boom.remove() });
          const saida = host.querySelector('#saida');
          saida.style.display = 'block';
          saida.innerHTML = `<span class="erro">Funcionario is abstract; cannot be instantiated</span>
<span class="neutro">Classe abstrata não vira objeto. Ela existe para ser base e
para obrigar cada subclasse a implementar o método abstrato.</span>`;
          api.gsap.from(saida, { y: 12, opacity: 0, duration: 0.35 });
          api.reagir('alerta');
          api.pronto('Abstrata = molde obrigatório para as filhas, mas nunca um objeto sozinho');
        };
      },
    },

    /* --------------------------------------------- 10 @Override salva */
    {
      fala: [
        'Última armadilha: escrever o método sobrescrito com um erro de digitação, sem `@Override`.',
        'Executa e veja o bug silencioso.',
      ],
      interativo: true,
      emocao: 'alerta',
      dica: 'Clique em executar',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: o revisor que confere o crachá</div>
            <div class="analogia-cena"><div class="grande">🔎</div><div>"@Override é quem pega o erro antes de virar problema"</div></div>
          </div>
          ${api.codigo(`class Gerente extends Funcionario {
    // sem @Override e com typo: nasce um método NOVO, não uma sobrescrita
    public double calcularSalarioo() { return super.calcularSalario() + bonus; }
}`)}
          <div class="palco-escolhas">
            <button class="chip" id="btnRun">▶ gerente.calcularSalario()</button>
          </div>
          <div class="saida" id="saida" style="display:none"></div>`;

        host.querySelector('#btnRun').onclick = e => {
          e.target.disabled = true;
          api.som('erro');
          const saida = host.querySelector('#saida');
          saida.style.display = 'block';
          saida.innerHTML = `<span class="erro">Rodou a versão da BASE: o bônus foi ignorado, e ninguém avisou.</span>
<span class="ok">Com @Override, o compilador barra o typo na hora:
"method does not override a method from its superclass".</span>`;
          api.gsap.from(saida, { y: 12, opacity: 0, duration: 0.35 });
          api.reagir('alerta');
          api.pronto('Use @Override sempre: transforma erro silencioso em erro de compilação');
        };
      },
    },

    /* ----------------------------------------------- 11 checagem final */
    {
      fala: [
        'Fecha com a pergunta que separa quem entende polimorfismo de quem chuta.',
      ],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; margin-bottom:12px">Numa lista de <code>Funcionario</code>, quem decide qual <code>calcularSalario()</code> roda?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>O tipo da variável (<code>Funcionario</code>), decidido na compilação</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>O tipo real do objeto, decidido em tempo de execução (late binding)</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Sempre a versão da classe base</span></button>
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
              ? 'Perfeito: o objeto real manda, em runtime. É a essência do polimorfismo'
              : 'É a B: a referência é Funcionario, mas o objeto real escolhe o método, em execução');
          };
        });
      },
    },

    /* ---------------------------------------------------------- 12 recap */
    {
      fala: [
        'Dois pilares no bolso. Seis imagens pra levar.',
      ],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [
          ['🧬', 'Herança é é-um', 'a subclasse ganha o que a base tem, com <code>extends</code>'],
          ['♻️', 'super reaproveita', 'sobrescreve sem duplicar a lógica da base'],
          ['🎼', 'Polimorfismo', 'um comando, cada objeto responde do seu jeito'],
          ['⚡', 'Decidido em runtime', 'o tipo real do objeto escolhe o método (late binding)'],
          ['🚫', 'Classe abstrata', 'molde obrigatório para as filhas, nunca um objeto sozinho'],
          ['🔎', '@Override sempre', 'vira erro de digitação em erro de compilação'],
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
