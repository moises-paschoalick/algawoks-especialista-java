# SPEC 005 · Motor de aula e som

| | |
|---|---|
| Realiza | [PRD 005](../prds/005-aulas-guiadas-interativas.md) |
| Arquivos | `trilha/js/aula.js`, `trilha/js/som.js`, `trilha/content/aula-*.js`, `trilha/styles/aula.css` |
| Atualizado | 2026-07-25 |

## 1. Modelo de roteiro

```js
Aula.registrar({
  id, licao,            // id do roteiro e id da lição que ele conclui
  titulo, personagem: { nome },
  fechamento,
  cenas: [ Cena ]
});
Aula.obter(id) -> Roteiro | null
Aula.iniciar(roteiro)
```

### Cena

```js
{
  fala: String | [String],   // narração (mini-markdown)
  palco(host, api),          // desenha o palco desta cena
  interativo: Boolean,       // trava o Continuar até api.pronto()
  dica: String,              // texto de apoio
  emocao: 'normal' | 'feliz' | 'alerta' | 'pensando'
}
```

## 2. API do palco (injetada em cada cena)

```js
api.gsap                      // instância GSAP
api.som(nome)                 // dispara efeito (SPEC, seção 5)
api.codigo(src) -> htmlString // bloco de código com realce (via Render)
api.inline(txt) -> htmlString
api.reagir(emocao)            // muda a expressão do personagem
api.pronto(msg)               // libera o Continuar (fim da interação); toca 'pop'
api.registrarResposta(certo)  // contabiliza acerto + som + reação
api.falar(linhas)             // reescreve a narração
```

## 3. Ciclo de execução (aula.js)

```
iniciar(roteiro):
  monta trilha de passos no topo
  anima o personagem (respiração, vapor, piscar)
  ir(0)

ir(i):
  atualiza passos; trava Continuar se cena.interativo
  fade-out/in do palco; chama cena.palco(host, api)
  reagir(cena.emocao); falar(cena.fala) em máquina de escrever

avancar(): só se liberado; ir(i+1) ou concluir()
concluir(): Progress.concluir(licao, { xp: 40 + 10*acertos, acertos, total }) + tela final
```

Enter/espaço acionam Continuar. Trocar de cena rola o palco para o topo e toca
`passo`.

## 4. Personagem (SVG + GSAP)

- SVG inline em `aula.html` (grão de café "Bean"): corpo em gradiente, olhos, `.pupila`, `.boca`, `.sob-esq`/`.sob-dir`, `.braco-*`, `.blush`, `.vapor`.
- **Vida contínua**: respiração (`y` yoyo infinito), vapor subindo, piscar em intervalo aleatório (1.8 a 5s).
- **Expressões** (`ROSTO`): normal, feliz, alerta, pensando. `reagir()` interpola os paths de boca e sobrancelhas e a opacidade do blush; feliz também pula e agita os braços; alerta treme.

## 5. Motor de som (js/som.js)

Web Audio API, **sem arquivos**. `AudioContext` criado no primeiro gesto do
usuário (política dos navegadores) e retomado se suspenso.

Primitivas:
- `nota({ freq, dur, tipo, vol, atraso, glide })`: oscilador + envelope (ataque 12ms, decaimento exponencial), com glide opcional.
- `ruido({ dur, vol, corte })`: buffer de ruído branco decaindo, com filtro passa-baixa.

Efeitos (`Som.tocar(nome)`):

| nome | uso |
|------|-----|
| `clique` | toque leve em opção/chip |
| `pop` | item aceito / liberar avanço |
| `acerto` | acorde C-E-G ascendente |
| `erro` | dois tons descendentes suaves |
| `barrado` | ruído filtrado + tom grave (rejeição) |
| `revelar` | glide ascendente (compilador reescreve) |
| `passo` | troca de cena |
| `conclusao` | fanfarra de 4 notas |

Controle: `Som.alternar()` liga/desliga (persistido em `trilha-java-som`);
`Som.ativo()`. Sem trilha de fundo. Falha em silêncio se a API não existir.

## 6. Padrão didático obrigatório (analogia antes do conceito)

Regra de autoria verificável nas cenas de conceito:
1. A cena abre com a faixa `.analogia` (visual dourado) mostrando a imagem do mundo real.
2. O aluno interage com essa imagem.
3. Só depois o código formaliza, e o **nome técnico** do conceito aparece após a descoberta, não antes.

## 7. Autoria de uma nova aula

1. Criar `content/aula-<tema>.js` com `Aula.registrar({...})`.
2. Incluir o `<script>` em `aula.html`.
3. Marcar `aula: '<tema>'` na lição correspondente em `content/page*.js`.
4. Componentes de cena reutilizáveis vivem em `styles/aula.css` (`.analogia`, `.prateleira`, `.caixa`, `.chip`, etc.).

Planos de aula em `trilha/PLANO-AULA-*.md`.
