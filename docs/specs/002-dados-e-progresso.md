# SPEC 002 · Dados e progresso

| | |
|---|---|
| Realiza | [PRD 002](../prds/002-progresso-e-revisao-espacada.md) |
| Arquivo | `trilha/js/progress.js` (global `Progress`) |
| Atualizado | 2026-07-25 |

## 1. Schema do localStorage

Chave única: **`trilha-java-v1`**. Valor: JSON com o formato:

```js
{
  xp: Number,                 // XP total acumulado
  livre: Boolean,             // modo livre (trilha destravada)
  diasAtivos: [ "YYYY-MM-DD" ], // dias em que houve estudo, ordenados
  licoes: {
    [licaoId]: {
      concluida: Boolean,
      acertos: Number,
      total: Number,
      xp: Number,             // XP acumulado nesta lição
      revisoes: [ Number ]    // timestamps (ms) de cada conclusão/repasse
    }
  }
}
```

A carga faz merge sobre um estado vazio (`Object.assign(vazio(), parse)`), então
campos ausentes assumem o padrão. JSON inválido cai para o estado vazio, sem
quebrar a página.

## 2. Algoritmo de revisão espaçada

Intervalos fixos, em dias, indexados pelo número de repasses:

```
INTERVALOS = [1, 3, 7, 15, 30, 90]
```

- `intervaloAtual(id)`: degrau = `min(revisoes.length - 1, 5)`; retorna `INTERVALOS[degrau]`.
- `precisaRevisar(id)`: lição concluída e `(agora - ultimaRevisao) / 1dia >= intervaloAtual`.
- `diasParaRevisar(id)`: `ceil(intervalo - diasPassados)`, mínimo 0.

Cada conclusão faz `push(Date.now())` em `revisoes`, avançando o degrau. Após o
sexto repasse, o intervalo satura em 90 dias.

## 3. Ofensiva (streak)

```
ofensiva():
  se diasAtivos vazio -> 0
  cursor = hoje; se hoje não está em diasAtivos, cursor = ontem
  conta dias consecutivos para trás enquanto existirem em diasAtivos
```

Regra-chave: se o aluno ainda não estudou hoje, a contagem parte de ontem, para
não zerar a ofensiva durante o dia corrente.

## 4. Contrato público de `Progress`

```js
// conclusão
concluir(id, { xp = 0, acertos = 0, total = 0 })  // registra, agenda revisão, marca o dia
concluida(id) -> Boolean
daLicao(id) -> objetoDaLicao | null

// revisão
precisaRevisar(id) -> Boolean
diasParaRevisar(id) -> Number | null
intervaloAtual(id) -> Number | null

// indicadores
ofensiva() -> Number         // dias consecutivos
xpTotal() -> Number
totalConcluidas() -> Number

// controle
modoLivre()        -> Boolean       // getter
modoLivre(valor)   -> Boolean       // setter (persiste)
zerar()                             // apaga tudo
```

Toda mutação persiste imediatamente (`salvar()` grava o JSON).

## 5. Invariantes

- `revisoes` nunca encolhe; seu tamanho é o número de repasses.
- `diasAtivos` é um conjunto ordenado sem duplicatas (data em `YYYY-MM-DD`).
- XP só cresce, exceto no `zerar()`.
- Ler o estado nunca lança: qualquer erro de parse retorna estado vazio.

## 6. Uso pelos consumidores

- **Mapa** (SPEC 003): estados do nó (`concluida`, `precisaRevisar`), HUD (`xpTotal`, `ofensiva`, `totalConcluidas`) e `modoLivre`.
- **Lição** (SPEC 004) e **Aula** (SPEC 005): chamam `concluir(id, {...})` ao final, com XP e acertos.

## 7. Fora de escopo desta SPEC

- Sincronização remota e algoritmo adaptativo por desempenho (ver PRD 002, "Fora de escopo").
