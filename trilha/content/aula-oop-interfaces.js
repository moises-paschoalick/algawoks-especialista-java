/**
 * Aula guiada · Interfaces e abstração (módulo 14 · docs/page_01.md)
 * Esteira docs/metodologia. Analogia: a tomada padrão (contrato).
 */
Aula.registrar({
  id: 'oop-interfaces',
  licao: 'oop-interfaces',
  titulo: 'Interfaces: a tomada padrão do seu código',
  personagem: { nome: 'Bean' },
  fechamento: 'Interface é contrato: você programa para a tomada, e troca o aparelho sem reformar a casa.',

  cenas: [

    /* 1 intro */
    {
      fala: [
        'Quarto pilar em foco: **interface**. A imagem é a **tomada padrão**.',
        'Qualquer aparelho com o plugue certo funciona na tomada. Ela não sabe nem se importa qual é o aparelho.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div style="text-align:center">
            <div class="analogia" style="margin:0 auto 16px; max-width:440px">
              <div class="analogia-titulo">A ideia de hoje</div>
              <div class="analogia-cena">
                <div class="tomada"><div class="tomada-icone">🔌</div><div class="tomada-tag">Notificador</div></div>
                <div style="font-size:0.82rem; color:var(--muted)">aceita qualquer aparelho compatível</div>
              </div>
            </div>
            <div class="palco-titulo">Módulo 14 · Interfaces</div>
            <p style="color:var(--muted); max-width:400px; margin:0 auto; line-height:1.7; font-size:0.85rem">12 etapas. Analogia primeiro, código depois.</p>
          </div>`;
        api.gsap.from(host.querySelectorAll('.tomada, .analogia-cena > div'), { y: 20, opacity: 0, duration: 0.5, stagger: 0.12, ease: 'back.out(1.5)' });
      },
    },

    /* 2 problema: acoplado ao concreto */
    {
      fala: [
        'Sem interface, o serviço solda o aparelho na parede: depende da classe **concreta** `EmailNotificador`.',
        'Tenta trocar o e-mail por SMS e veja o que quebra.',
      ],
      interativo: true, emocao: 'pensando', dica: 'Clique em "trocar por SMS"',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: aparelho soldado na parede</div>
            <div class="analogia-cena"><div class="grande">🔩</div><div>"pra trocar, tem que quebrar a parede"</div></div>
          </div>
          ${api.codigo(`class PedidoService {
    private EmailNotificador notificador = new EmailNotificador();
    void finalizar(Pedido p) { notificador.enviar(...); }
}`)}
          <div class="palco-escolhas"><button class="chip" id="btn">trocar por SMS</button></div>
          <div class="saida" id="saida" style="display:none"></div>`;
        host.querySelector('#btn').onclick = e => {
          e.target.disabled = true; api.som('barrado'); api.reagir('alerta');
          const s = host.querySelector('#saida'); s.style.display = 'block';
          s.innerHTML = `<span class="erro">Pra usar SMS você reescreve o campo, o construtor e todo uso dentro do serviço.</span>
<span class="neutro">O serviço está acoplado à classe concreta. Isso é a parede soldada.</span>`;
          api.gsap.from(s, { y: 10, opacity: 0, duration: 0.3 });
          api.pronto('Depender do concreto é soldar: mudar um detalhe obriga a mexer em tudo');
        };
      },
    },

    /* 3 quiz do problema */
    {
      fala: ['Qual é a raiz do problema?'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:14px">Por que trocar de e-mail para SMS quebrou o serviço?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>SMS é mais lento que e-mail</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>O serviço depende da classe <b>concreta</b>, não de um contrato; qualquer troca vaza para dentro dele</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Java não deixa ter duas formas de notificar</span></button>
          </div>`;
        const ok = 1;
        host.querySelectorAll('.option').forEach(b => b.onclick = () => {
          const e = Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o, i) => { o.classList.add('disabled'); o.onclick = null; if (i === ok) o.classList.add('right'); else if (i === e) o.classList.add('wrong'); });
          api.registrarResposta(e === ok);
          api.pronto(e === ok ? 'Isso: o acoplamento ao concreto é a raiz' : 'É a B: o serviço conhece a classe concreta demais');
        });
      },
    },

    /* 4 solucao: padronizar a tomada */
    {
      fala: [
        'A interface é a **tomada**: define o que o aparelho deve saber fazer (`enviar`), sem dizer como.',
        'Toca para padronizar a tomada.',
      ],
      interativo: true, dica: 'Clique em "criar a tomada"',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: o padrão do plugue</div>
            <div class="analogia-cena"><div class="grande">🔌</div><div>"a tomada define o formato; o aparelho se encaixa"</div></div>
          </div>
          <div id="host"></div>
          <div class="palco-escolhas"><button class="chip" id="btn">criar a interface Notificador</button></div>`;
        host.querySelector('#btn').onclick = e => {
          e.target.disabled = true; api.som('pop'); api.reagir('feliz');
          host.querySelector('#host').innerHTML = api.codigo(`interface Notificador {
    void enviar(String destino, String msg);   // o contrato: o QUE, não o COMO
}

class EmailNotificador implements Notificador { public void enviar(...) { } }
class SmsNotificador   implements Notificador { public void enviar(...) { } }`);
          api.gsap.from(host.querySelector('#host'), { y: 14, opacity: 0, duration: 0.4 });
          api.pronto('Cada aparelho implementa o mesmo plugue. Agora o serviço fala com a tomada');
        };
      },
    },

    /* 5 nomear: contrato */
    {
      fala: [
        'Isso é uma **interface**: um contrato de comportamento. A classe que assina promete cumprir os métodos.',
        'O serviço passa a depender do contrato, não do aparelho.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">O conceito, agora com nome</div>
          ${api.codigo(`class PedidoService {
    private final Notificador notificador;          // depende do CONTRATO

    PedidoService(Notificador notificador) {         // recebe qualquer aparelho
        this.notificador = notificador;
    }
}`)}
          <div class="note">Método sem corpo é <b>public abstract</b> implícito. Constante é <b>public static final</b> implícito. A classe promete implementar tudo que assinou.</div>`;
        api.gsap.from(host.children, { y: 18, opacity: 0, duration: 0.45, stagger: 0.15 });
      },
    },

    /* 6 trocar o aparelho */
    {
      fala: [
        'Agora a mágica: troque o aparelho na tomada. O serviço nem percebe.',
        'Escolhe qual notificador plugar.',
      ],
      interativo: true, emocao: 'feliz', dica: 'Plugue os três aparelhos',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: trocar o aparelho na mesma tomada</div>
            <div class="analogia-cena"><div class="grande">🔌</div><div>"e-mail, SMS ou push: a tomada é a mesma"</div></div>
          </div>
          <div class="palco-escolhas">
            <button class="chip" data-n="Email">📧 EmailNotificador</button>
            <button class="chip" data-n="Sms">📱 SmsNotificador</button>
            <button class="chip" data-n="Push">🔔 PushNotificador</button>
          </div>
          <div class="saida" id="saida">new PedidoService( ??? )</div>`;
        const s = host.querySelector('#saida'); const vistos = new Set();
        host.querySelectorAll('.chip').forEach(chip => chip.onclick = () => {
          host.querySelectorAll('.chip').forEach(c => c.classList.remove('ativo')); chip.classList.add('ativo');
          api.som('pop');
          s.innerHTML = `<span class="ok">new PedidoService(new ${chip.dataset.n}Notificador());
// o serviço roda igual: zero linha alterada nele</span>`;
          api.gsap.from(s, { opacity: 0, x: -8, duration: 0.25 });
          vistos.add(chip.dataset.n);
          if (vistos.size === 3) api.pronto('Três aparelhos, um serviço intacto. Isso é programar para a interface');
        });
      },
    },

    /* 7 default method */
    {
      fala: [
        'E se o contrato precisar crescer? O **default method** já traz uma implementação pronta, sem quebrar quem já assinou.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Evoluir o contrato sem quebrar ninguém</div>
          ${api.codigo(`interface Notificador {
    void enviar(String destino, String msg);

    default void enviarUrgente(String destino, String msg) {   // Java 8+
        enviar(destino, "[URGENTE] " + msg);   // reaproveita o método do contrato
    }
}`)}
          <div class="note">As classes que já implementavam <code>Notificador</code> ganham <code>enviarUrgente</code> de graça, sem alterar uma linha.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },

    /* 8 varios contratos */
    {
      fala: [
        'Uma classe estende **uma** só classe, mas assina **quantas interfaces quiser**. É a herança múltipla de tipo.',
        'Toca em cada contrato que o RelatorioPdf assina.',
      ],
      interativo: true, dica: 'Toque nos três contratos',
      palco(host, api) {
        host.innerHTML = `
          <div class="analogia">
            <div class="analogia-titulo">Mundo real: um aparelho com vários plugues</div>
            <div class="analogia-cena"><div class="grande">🔌🔌🔌</div><div>"assina vários contratos ao mesmo tempo"</div></div>
          </div>
          <div class="org-filhos" style="margin-bottom:10px">
            <div class="cracha" data-c="Imprimivel"><div class="cracha-tipo">contrato</div><div class="cracha-nome">Imprimivel</div></div>
            <div class="cracha" data-c="Exportavel"><div class="cracha-tipo">contrato</div><div class="cracha-nome">Exportavel</div></div>
            <div class="cracha" data-c="Comparable"><div class="cracha-tipo">contrato</div><div class="cracha-nome">Comparable</div></div>
          </div>
          <div class="saida" id="saida">class RelatorioPdf implements ...</div>`;
        const s = host.querySelector('#saida'); const vistos = new Set();
        host.querySelectorAll('.cracha').forEach(c => c.onclick = () => {
          if (c.dataset.feito) return; c.dataset.feito = '1'; c.style.borderColor = 'var(--green)';
          api.som('clique'); vistos.add(c.dataset.c);
          api.gsap.fromTo(c, { scale: 1.1 }, { scale: 1, duration: 0.3 });
          s.innerHTML = `<span class="ok">class RelatorioPdf implements ${[...vistos].join(', ')} { }</span>`;
          if (vistos.size === 3) api.pronto('Herança de classe é uma; de contrato, quantas precisar');
        });
      },
    },

    /* 9 interface x abstrata (quiz) */
    {
      fala: ['A dúvida clássica de entrevista: interface ou classe abstrata?'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem rápida</div>
          <h2 style="text-align:center; margin-bottom:12px">Quando escolher <b>classe abstrata</b> em vez de interface?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>Quando preciso compartilhar <b>estado</b> (campos) e código entre parentes próximos</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Sempre: classe abstrata é melhor que interface</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Quando a classe precisa assinar vários contratos</span></button>
          </div>
          <div class="note">Interface: contrato sem estado, herança múltipla. Classe abstrata: estado e implementação parcial compartilhados, herança simples.</div>`;
        const ok = 0;
        host.querySelectorAll('.option').forEach(b => b.onclick = () => {
          const e = Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o, i) => { o.classList.add('disabled'); o.onclick = null; if (i === ok) o.classList.add('right'); else if (i === e) o.classList.add('wrong'); });
          api.registrarResposta(e === ok);
          api.pronto(e === ok ? 'Isso: estado compartilhado pede classe abstrata' : 'É a A: comece pela interface; só promova a abstrata quando houver estado a compartilhar');
        });
      },
    },

    /* 10 interface funcional */
    {
      fala: [
        'Um caso especial: interface com **um único método abstrato** vira uma lambda.',
        'É a base dos Streams, que você vê mais pra frente.',
      ],
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Interface funcional</div>
          ${api.codigo(`@FunctionalInterface
interface Validador<T> {
    boolean valida(T valor);       // um método abstrato só
}

Validador<String> naoVazio = s -> s != null && !s.isBlank();   // vira lambda`)}
          <div class="note"><code>@FunctionalInterface</code> faz o compilador garantir que há exatamente um método abstrato.</div>`;
        api.gsap.from(host.children, { y: 16, opacity: 0, duration: 0.4, stagger: 0.12 });
      },
    },

    /* 11 checagem final */
    {
      fala: ['Fecha com o porquê de tudo isso.'],
      interativo: true,
      palco(host, api) {
        host.innerHTML = `
          <div class="palco-titulo">Checagem final</div>
          <h2 style="text-align:center; margin-bottom:12px">Qual o ganho real de programar para a interface?</h2>
          <div class="options">
            <button class="option" data-i="0"><span class="option-key">A</span><span>O código fica mais curto</span></button>
            <button class="option" data-i="1"><span class="option-key">B</span><span>Desacopla: você troca a implementação (e-mail por SMS, JDBC por memória) sem tocar em quem usa o contrato</span></button>
            <button class="option" data-i="2"><span class="option-key">C</span><span>Roda mais rápido em produção</span></button>
          </div>`;
        const ok = 1;
        host.querySelectorAll('.option').forEach(b => b.onclick = () => {
          const e = Number(b.dataset.i);
          host.querySelectorAll('.option').forEach((o, i) => { o.classList.add('disabled'); o.onclick = null; if (i === ok) o.classList.add('right'); else if (i === e) o.classList.add('wrong'); });
          api.registrarResposta(e === ok);
          api.pronto(e === ok ? 'Perfeito: desacoplamento. Trocar o aparelho sem reformar a casa' : 'É a B: o ganho é desacoplar, trocar a implementação sem quebrar o resto');
        });
      },
    },

    /* 12 recap */
    {
      fala: ['Quatro pilares fechados. Seis imagens pra levar.'],
      emocao: 'feliz',
      palco(host, api) {
        const cards = [
          ['🔌', 'Interface é tomada', 'o contrato: o que faz, não como'],
          ['🔗', 'Programe para o contrato', 'dependa da interface, não da classe concreta'],
          ['🔄', 'Troque o aparelho', 'e-mail, SMS, push: o serviço não muda'],
          ['➕', 'default method', 'evolui o contrato sem quebrar quem assinou'],
          ['🪪', 'Vários contratos', 'uma classe assina quantas interfaces quiser'],
          ['⚖️', 'Interface x abstrata', 'estado a compartilhar? abstrata. Senão, interface'],
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
