# SPEC 004 · Motor de lição

| | |
|---|---|
| Realiza | [PRD 004](../prds/004-exercicios-praticos.md) |
| Arquivos | `trilha/js/licao.js`, `trilha/js/editor.js` |
| Atualizado | 2026-07-25 |

## 1. Máquina de passos

`licao.js` lê `?id=`, monta `passos = [{ tipo: 'teoria' }, ...licao.passos]` e
executa um passo por tela.

Estado interno: `atual`, `acertos`, `avaliaveis`, `xp`, `respondido`.

Ciclo:

```
render() -> RENDER[passo.tipo](passo)   // desenha o passo
usuário interage -> marcar(certo, msg, detalhe)  // registra 1x por passo
avancar() -> próximo passo | final()
final() -> Progress.concluir(id, { xp, acertos, total }) + tela de resumo
```

`marcar()` é idempotente por passo (`respondido`), soma XP no acerto e dispara o
som (`acerto`/`erro`).

## 2. Barra de feedback

`pe({ estado, msg, botao, acao, extra })` desenha a barra fixa inferior (verde no
acerto, vermelha no erro). `esconderPe()` limpa. Enter e espaço acionam o botão.

## 3. Tipos de passo (RENDER)

| Tipo | Interação | XP |
|------|-----------|----|
| `teoria` | leitura + refs do módulo | 5 |
| `flashcard` | vira o card, autoavaliação (acertei / revisar) | 5 |
| `quiz` | múltipla escolha, verificar, explicação | 10 |
| `completar` | preenche lacunas (`___`), respostas normalizadas | 10 |
| `qa` | resposta aberta, revela gabarito, autoavaliação | 10 |
| `codigo` | editor + verificação estática | 25 |

Normalização do `completar`: `trim`, colapsa espaços, `toLowerCase`; aceita lista
de respostas por lacuna.

### 3.1 Passo de código

```js
{
  tipo: 'codigo', enunciado, sub, arquivo, base, solucao, explicacao,
  testes: [
    { desc, re: RegExp }        // aprova se casar
    { desc, nao: RegExp }       // aprova se NÃO casar
    { desc, fn: (src, plano) => Boolean }  // predicado livre
  ]
}
```

- `plano` = `src` com espaços colapsados, para regras tolerantes a formatação.
- Cada teste acende verde/vermelho. Só conclui quando todos passam.
- "Ver solução" revela o gabarito, conta como não acerto e agenda revisão.
- A verificação é **estática** (texto/regex), nunca compila Java. A UI declara isso ao aluno.

## 4. Editor (js/editor.js)

```js
Editor.criar(host, { valor, linguagem }) -> Promise<{ getValue, setValue, foco }>
```

- Carrega **Monaco** por CDN (`cdn.jsdelivr.net/npm/monaco-editor@0.52.2`), tema `vs-dark`, sem minimap, `automaticLayout`.
- **Fallback**: em erro ou timeout de 8s, cria um `<textarea>` com a mesma interface. A Promise **sempre resolve**, com Monaco ou com textarea.
- Rationale: o exercício não pode quebrar por falta de rede.

## 5. Tela final

Mostra XP ganho, acertos/avaliados e dias até a próxima revisão; oferece próxima
lição e volta à trilha. Chama `Progress.concluir` uma única vez.

## 6. Autoria

Adicionar exercícios é preencher o array `passos` da lição em `content/page*.js`.
Nenhuma mudança em `licao.js` é necessária para novos exercícios dos tipos
existentes.
