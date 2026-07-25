/**
 * Aula guiada · Records e imutabilidade (módulo 11 · docs/page_01.md)
 * Esteira docs/metodologia. Analogia: a ficha lacrada.
 */
Aula.registrar({
  id: 'oop-records',
  licao: 'oop-records',
  titulo: 'Records: a ficha de dados que se lacra sozinha',
  personagem: { nome: 'Bean' },
  fechamento: 'Record é ficha lacrada: uma linha gera tudo, valida no carimbo e nunca mais muda. Cuidado só com a lista dentro.',

  cenas: [

    /* 1 intro */
    {
      fala: [
        'Records são o atalho para dados **imutáveis**. A imagem: uma **ficha lacrada**.',
        'Você carimba os dados uma vez, ela valida, sela, e ninguém altera depois.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div style="text-align:center">
            <div class="analogia" style="margin:0 auto 16px; max-width:420px">
              <div class="analogia-titulo">A ideia de hoje</div>
              <div class="analogia-cena"><div class="grande">🪪</div><div>ficha lacrada: <code>record Cliente(nome, cpf)</code></div></div>
            </div>
            <div class="palco-titulo">Módulo 11 · Records</div>
            <p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p>
          </div>`;
        api.gsap.from(host.querySelector('.analogia-cena'), { y: 20, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' });
      },
    },

    /* 2 problema: boilerplate */
    {
      fala: [
        'Antes, uma classe de dados era um formulário gigante escrito à mão: campos, getters, `equals`, `hashCode`, `toString`.',
        'Toca para ver o tamanho do boilerplate de um simples Cliente.',
      ],
      interativo: true, emocao: 'pensando', dica: 'Clique em "revelar a classe"',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: preencher a mão o formulário inteiro</div>
            <div class="analogia-cena"><div class="grande">📝</div><div>"nome, cpf... e 60 linhas de sempre a mesma coisa"</div></div>
          </div>
          <div class="palco-escolhas"><button class="chip" id="btn">revelar a classe Cliente</button></div>
          <div id="host" style="margin-top:12px"></div>`;
        host.querySelector('#btn').onclick = e => {
          e.target.disabled = true; api.som('barrado'); api.reagir('pensando');
          host.querySelector('#host').innerHTML = api.codigo(`class Cliente {
    private final String nome;
    private final String cpf;
    public Cliente(String nome, String cpf) { this.nome = nome; this.cpf = cpf; }
    public String getNome() { return nome; }
    public String getCpf() { return cpf; }
    @Override public boolean equals(Object o) { /* 8 linhas */ }
    @Override public int hashCode() { return Objects.hash(nome, cpf); }
    @Override public String toString() { /* ... */ }
}   // ~60 linhas para carregar 2 campos`);
          api.gsap.from(host.querySelector('#host'), { y: 12, opacity: 0, duration: 0.35 });
          api.pronto('Tudo isso para transportar dois dados. É boilerplate que envelhece e dá bug');
        };
      },
    },

    /* 3 solucao: lacrar numa linha */
    {
      fala: [
        'O record faz isso tudo em **uma linha**. Toca para lacrar.',
      ],
      interativo: true, emocao: 'feliz', dica: 'Clique em "lacrar como record"',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: a máquina que carimba e lacra</div>
            <div class="analogia-cena"><div class="grande">🎫</div><div>"uma linha e a ficha está pronta"</div></div>
          </div>
          <div id="host">${api.codigo(`class Cliente {  /* ...60 linhas... */  }`)}</div>
          <div class="palco-escolhas"><button class="chip" id="btn">lacrar como record</button></div>`;
        host.querySelector('#btn').onclick = e => {
          e.target.disabled = true; api.som('acerto'); api.reagir('feliz');
          host.querySelector('#host').innerHTML = api.codigo(`record Cliente(String nome, String cpf) { }
// gera construtor, nome(), cpf(), equals, hashCode e toString`);
          api.gsap.fromTo(host.querySelector('#host'), { scale: 0.9, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' });
          api.pronto('60 linhas viram 1. O compilador gera o resto');
        };
      },
    },

    /* 4 nomear: o que gera */
    {
      fala: [
        'Isso é um **record**: um portador de dados imutável. Os acessores não têm prefixo `get`.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">O conceito, agora com nome</div>
          ${api.codigo(`record Cliente(String nome, String cpf, int idade) { }

Cliente c = new Cliente("Ana", "111", 30);
c.nome();                    // acessor sem "get"
c.equals(outro);             // compara todos os componentes
System.out.println(c);       // Cliente[nome=Ana, cpf=111, idade=30]`)}
          <div class="note">Os componentes são <b>final</b>. Como <code>equals</code> e <code>hashCode</code> vêm de graça, record é chave ideal de <code>HashMap</code>.</div>`;
        api.gsap.from(host.children, { y: 18, opacity: 0, duration: 0.45, stagger: 0.15 });
      },
    },

    /* 5 construtor compacto valida */
    {
      fala: [
        'A validação vai no **construtor compacto**: o carimbo confere antes de lacrar.',
        'Tenta criar um Produto com preço negativo.',
      ],
      interativo: true, emocao: 'alerta', dica: 'Clique em executar',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: o carimbo que confere antes de selar</div>
            <div class="analogia-cena"><div class="grande">🛑</div><div>"preço negativo? a ficha não é emitida"</div></div>
          </div>
          ${api.codigo(`record Produto(String nome, double preco) {
    Produto {                                  // construtor compacto
        if (preco < 0) throw new IllegalArgumentException("preco negativo");
        nome = nome.trim();                    // normaliza antes de atribuir
    }
}`)}
          <div class="palco-escolhas"><button class="chip" id="btn">new Produto("Caneta", -5)</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick = e => {
          e.target.disabled = true; api.som('barrado');
          const s = host.querySelector('#saida'); s.style.display = 'block';
          s.innerHTML = `<span class="erro">IllegalArgumentException: preco negativo</span>
<span class="neutro">A ficha inválida nem chega a existir. O record nasce sempre consistente.</span>`;
          api.gsap.from(s, { y: 10, opacity: 0, duration: 0.3 });
          api.reagir('alerta');
          api.pronto('Validação no carimbo: record imutável e sempre válido');
        };
      },
    },

    /* 6 o que record nao permite (quiz) */
    {
      fala: ['Record tem limites de propósito. Qual destas ele NÃO permite?'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">O que um <code>record</code> NÃO permite?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Implementar interfaces</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Ter métodos e membros estáticos</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Estender outra classe ou ter campos mutáveis</span></button>
          </div>
          <div class="note">Record pode implementar interfaces, ter métodos e estáticos. Não pode herdar (já estende Record) nem ser mutável.</div>`;
        const ok = 2;
        host.querySelectorAll('.option').forEach(b => b.onclick = () => {
          const e = Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o, i) => { o.classList.add('disabled'); o.onclick = null; if (i === ok) o.classList.add('right'); else if (i === e) o.classList.add('wrong'); });
          api.registrarResposta(e === ok);
          api.pronto(e === ok ? 'Isso: record não herda de classe nem muda de estado' : 'É a C: record implementa interface e tem métodos, mas não herda nem muta');
        });
      },
    },

    /* 7 imutabilidade rasa (armadilha) */
    {
      fala: [
        'Agora a pegadinha que engana muita gente: a imutabilidade do record é **rasa**.',
        'Se um componente é uma `List`, quem tem a referência ainda mexe nela. Executa e veja.',
      ],
      interativo: true, emocao: 'alerta', dica: 'Clique em executar',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: a ficha lacrada com um anexo solto</div>
            <div class="analogia-cena"><div class="grande">📎</div><div>"lacrei a ficha, mas o anexo continua editável"</div></div>
          </div>
          ${api.codigo(`record Pedido(List<Item> itens) { }

List<Item> lista = new ArrayList<>();
Pedido p = new Pedido(lista);
lista.add(new Item());     // alterou por fora... e o pedido "imutável" mudou`)}
          <div class="palco-escolhas"><button class="chip" id="btn">executar lista.add(...)</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick = e => {
          e.target.disabled = true; api.som('erro');
          const boom = document.createElement('div'); boom.className = 'boom'; boom.textContent = '💥';
          host.appendChild(boom);
          api.gsap.fromTo(boom, { scale: 0, opacity: 1 }, { scale: 2, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => boom.remove() });
          const s = host.querySelector('#saida'); s.style.display = 'block';
          s.innerHTML = `<span class="erro">p.itens() agora tem o item novo. O record "imutável" foi alterado por fora.</span>
<span class="neutro">O final protege a referência, não o objeto apontado. Igual ao vazamento da aula de encapsulamento.</span>`;
          api.gsap.from(s, { y: 10, opacity: 0, duration: 0.3 });
          api.reagir('alerta');
          api.pronto('Imutabilidade rasa: o record não copia a lista sozinho');
        };
      },
    },

    /* 8 a correcao */
    {
      fala: ['A correção é a mesma cópia defensiva de antes, feita no construtor compacto.'],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Anexo solto x anexo lacrado junto</div>
          <div class="compara">
            <div class="compara-col antes"><h4>✗ guarda a lista original</h4>${api.codigo(`record Pedido(List<Item> itens) { }
// referência externa ainda muta`)}</div>
            <div class="compara-col depois"><h4>✓ copia no carimbo</h4>${api.codigo(`record Pedido(List<Item> itens) {
    Pedido {
        itens = List.copyOf(itens);
    }
}`)}</div>
          </div>
          <div class="note"><code>List.copyOf</code> no construtor compacto sela também o anexo: agora a imutabilidade é de verdade.</div>`;
        api.gsap.from(host.querySelectorAll('.compara-col, .note'), { y: 20, opacity: 0, duration: 0.45, stagger: 0.15, ease: 'power2.out' });
      },
    },

    /* 9 record x classe (quiz) */
    {
      fala: ['Quando usar record e quando usar classe comum?'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Para qual caso o <code>record</code> encaixa melhor?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Uma entidade com ciclo de vida e estado que muda o tempo todo</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Um DTO ou value object imutável (CPF, coordenada, dados de resposta)</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Uma classe que precisa herdar de outra</span></button>
          </div>`;
        const ok = 1;
        host.querySelectorAll('.option').forEach(b => b.onclick = () => {
          const e = Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o, i) => { o.classList.add('disabled'); o.onclick = null; if (i === ok) o.classList.add('right'); else if (i === e) o.classList.add('wrong'); });
          api.registrarResposta(e === ok);
          api.pronto(e === ok ? 'Isso: record brilha em dados imutáveis' : 'É a B: estado mutável ou herança pedem classe; record é para value objects');
        });
      },
    },

    /* 10 record pode */
    {
      fala: ['E o que o record permite, que muita gente nem tenta: implementar interface, ter métodos e fábricas estáticas.'],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Record também é uma classe</div>
          ${api.codigo(`record Produto(String nome, double preco) implements Comparable<Produto> {

    double precoComImposto() { return preco * 1.1; }        // método comum

    static Produto gratuito(String nome) {                  // fábrica estática
        return new Produto(nome, 0);
    }

    public int compareTo(Produto o) { return Double.compare(preco, o.preco); }
}`)}
          <div class="note">Só não pode herdar de outra classe (já estende <code>Record</code>) nem mudar de estado.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },

    /* 11 checagem final */
    {
      fala: ['Fecha com a pegadinha que separa quem leu de quem entendeu.'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; margin-bottom:12px">Um <code>record Pedido(List&lt;Item&gt; itens)</code> é totalmente imutável?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Sim, record é sempre 100% imutável</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Não: a imutabilidade é rasa; sem cópia defensiva, a lista interna ainda pode ser alterada por fora</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Só se todos os campos forem <code>String</code></span></button>
          </div>`;
        const ok = 1;
        host.querySelectorAll('.option').forEach(b => b.onclick = () => {
          const e = Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o, i) => { o.classList.add('disabled'); o.onclick = null; if (i === ok) o.classList.add('right'); else if (i === e) o.classList.add('wrong'); });
          api.registrarResposta(e === ok);
          api.pronto(e === ok ? 'Perfeito: imutabilidade rasa, copie a coleção no construtor compacto' : 'É a B: sem List.copyOf, o anexo continua editável');
        });
      },
    },

    /* 12 recap */
    {
      fala: ['Records no bolso. Seis imagens pra levar.'],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [
          ['🪪', 'Record é ficha lacrada', 'dados imutáveis, componentes final'],
          ['✂️', 'Uma linha gera tudo', 'construtor, acessores, equals, hashCode, toString'],
          ['🛑', 'Carimbo que valida', 'validação no construtor compacto'],
          ['🚫', 'Não herda, não muta', 'mas implementa interface e tem métodos'],
          ['📎', 'Imutabilidade rasa', 'a List dentro ainda pode ser mexida por fora'],
          ['🔒', 'Copie a coleção', '<code>List.copyOf</code> no construtor compacto'],
        ];
        host.innerHTML = `<div class="palco-titulo">O que ficou</div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px">
            ${cards.map(([i, t, d]) => `<div class="recap-card" style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px">
              <div style="font-size:1.4rem; margin-bottom:5px">${i}</div><div style="font-weight:700; font-size:0.84rem; margin-bottom:3px">${t}</div>
              <div style="color:var(--muted); font-size:0.76rem; line-height:1.5">${d}</div></div>`).join('')}
          </div>`;
        api.gsap.from(host.querySelectorAll('.recap-card'), { y: 26, opacity: 0, scale: 0.94, duration: 0.45, stagger: 0.08, ease: 'back.out(1.4)' });
      },
    },
  ],
});
