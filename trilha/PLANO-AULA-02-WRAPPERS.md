# Planejamento · Aula 2 · Wrappers, boxing e o cache do Integer

> **Status: implementada em `content/aula-wrappers.js`**, com uma melhoria didática
> sobre este plano: toda cena de conceito abre com uma faixa de **analogia do mundo
> real** (transportadora, bancada × estante, máquina de embrulho, cafeteria,
> encomenda não entregue) e só depois desce para o código. A analogia sempre vem primeiro.
>
> Lição: `fund-wrappers` (Unidade 1, Fundamentos)
> Módulo do curso: **7. Wrappers e boxing** · teoria: `docs/page_06.md`
> Arquivo a criar: `content/aula-wrappers.js` · registrar como `aula: 'wrappers'`
> Pré-requisito: aula 1 (`primitivos`), que já estabeleceu "tipo é gaveta de tamanho fixo"

---

## 1. Objetivo

Ao fim da aula o aluno consegue, sem consultar:

1. Explicar por que `List<int>` não existe e o que o wrapper resolve
2. Dizer o que o compilador **escreve por baixo** no autoboxing e no unboxing
3. Reproduzir a armadilha do cache de `Integer` e citar a faixa `-128..127`
4. Justificar por que `==` entre wrappers é bug, e quando usar `equals()`
5. Reconhecer o `NullPointerException` que nasce no unboxing
6. Decidir entre wrapper e primitivo num caso concreto

## 2. Metáfora central

**O wrapper é uma caixa de presente e o cache é um almoxarifado.**

| Conceito | Imagem no palco |
|---|---|
| primitivo | o valor cru, solto |
| wrapper | o valor dentro de uma caixinha, com etiqueta do tipo |
| stack × heap | o valor cru fica na bancada; a caixa vai para a prateleira |
| autoboxing | a caixa se fecha sozinha em volta do valor |
| unboxing | a caixa abre e devolve o valor |
| cache do Integer | prateleira com caixas **pré-fabricadas** de -128 a 127 |
| fora do cache | a fábrica monta uma caixa nova a cada pedido |
| NPE no unboxing | abrir uma caixa que não existe |

A metáfora conecta com a aula 1: lá o tipo era uma gaveta de tamanho fixo; aqui o
valor sai da gaveta e ganha um invólucro. É a mesma linha, um degrau acima.

## 3. Princípio pedagógico

O mesmo das aulas 1 e de Generics: **o aluno vê o problema antes de ouvir o nome dele.**
O cache do `Integer` não é anunciado; ele é **descoberto** quando duas comparações
idênticas em aparência dão respostas diferentes. Só depois vem a explicação.

Nenhuma cena avança sozinha nas etapas 2 a 11: o botão Continuar fica travado até a
interação acontecer.

---

## 4. Roteiro cena a cena

### Cena 1 · Abertura
- **Fala:** "Na aula passada, todo valor era cru: um `int` era só um número na gaveta. Hoje a gente coloca esse número **dentro de uma caixa**, e vê por que isso é necessário e onde isso morde."
- **Palco:** `int 42` cru à esquerda, seta, `Integer 42` dentro de uma caixinha à direita. Entrada com `stagger`.
- **Interação:** nenhuma (só Continuar)
- **Emoção:** normal

### Cena 2 · Por que a caixa existe
- **Fala:** "Tenta guardar um `int` cru numa `List`. Clica nele."
- **Palco:** bandeja com `int 42` cru e `Integer 42` encaixotado; uma `caixa.tipada` rotulada `List<?>`.
- **Interação:** clicar nos dois. O cru **quica** com `ERRO: unexpected type, List<int> não existe`; o encaixotado entra.
- **Som:** `barrado` / `pop` · **Emoção:** alerta no barrado
- **Conclui com:** "Coleções e generics só trabalham com objetos. Daí o wrapper."

### Cena 3 · Onde cada um mora
- **Fala:** "Não é só sintaxe. O primitivo e o wrapper moram em lugares diferentes da memória."
- **Palco:** duas áreas, **STACK** e **HEAP**. `int idade = 30` aparece na stack; `Integer idade = 30` cria o valor na heap e deixa só a **seta da referência** na stack.
- **Interação:** um chip alterna entre `int` e `Integer`; o desenho se refaz.
- **Reaproveita:** conceito já visto na lição `fund-memoria`, então serve de gancho.
- **Conclui com:** "Wrapper custa alocação. Por isso primitivo continua sendo o padrão."

### Cena 4 · O que o compilador escreve por você
- **Fala:** "Autoboxing parece mágica. Não é: o compilador escreve a chamada por você. Clica para ver o código real."
- **Palco:** duas linhas (`Integer objeto = 10;` e `int primitivo = objeto;`); ao clicar, cada uma se **reescreve** para `Integer.valueOf(10)` e `objeto.intValue()`, com o trecho inserido destacado (`.hl`).
- **Interação:** clicar nas duas linhas.
- **Por que importa:** é essa chamada invisível que explica o cache (cena 5) e a NPE (cena 9). Precisa vir **antes** das duas.

### Cena 5 · O almoxarifado
- **Fala:** "Agora repara nisso. Pede duas caixas com o valor 127."
- **Palco:** prateleira com caixas pré-fabricadas de `-128` a `127` (renderizar ~8 visíveis com reticências). Botão "pedir `Integer` 127".
- **Interação:** clicar duas vezes. Nas duas, a **mesma** caixa da prateleira acende e uma seta sai dela para as variáveis `a` e `b`.
- **Saída:** `a == b → true`
- **Som:** `pop` · **Emoção:** normal (ainda não é a revelação)

### Cena 6 · A fábrica
- **Fala:** "Mesma coisa, valor 128. Pede duas."
- **Palco:** a prateleira **não tem** o 128; cada pedido monta uma caixa nova, com posição diferente.
- **Interação:** clicar duas vezes; duas caixas distintas aparecem.
- **Saída:** `c == d → false`, em vermelho.
- **Som:** `erro` · **Emoção:** alerta
- **Conclui com:** "Mesmo código, mesma aparência, resultado oposto."

### Cena 7 · Nomeando o que ele acabou de ver
- **Fala:** "Isso tem nome: **cache de Integer**. A JVM mantém prontas as instâncias de -128 a 127, porque são as mais usadas. Fora dessa faixa, cada autoboxing cria um objeto novo."
- **Palco:** o quadro dos quatro resultados lado a lado, com a faixa destacada.
- **Interação:** nenhuma (é a consolidação)
- **Nota a incluir:** `Byte`, `Short`, `Long` e `Character` (0-127) têm cache equivalente; `Double` e `Float` **não** têm.

### Cena 8 · A correção
- **Fala:** "Então como se compara wrapper? Escolhe a linha certa."
- **Palco:** três opções: `c == d`, `c.equals(d)`, `c.intValue() == d.intValue()`.
- **Interação:** múltipla escolha; as **duas últimas** são aceitas (a segunda é a idiomática).
- **Registra resposta** (conta para o placar)
- **Conclui com:** "Regra sem exceção: `==` compara referência, `equals` compara valor."

### Cena 9 · A NPE que ninguém vê
- **Fala:** "Falta a pegadinha que mais derruba código em produção. Executa."
- **Palco:** `Integer quantidade = null;` / `int total = quantidade + 1;` e botão executar.
- **Interação:** ao clicar, o código **se reescreve** mostrando o `.intValue()` inserido pelo compilador, e então explode (`boom` 💥) com `NullPointerException`.
- **Som:** `erro` · **Emoção:** alerta
- **Conclui com:** "A NPE não veio de você chamar um método. Veio do método que o compilador chamou."

### Cena 10 · Wrapper ou primitivo?
- **Fala:** "Última coisa: quando usar cada um. Classifica os quatro casos."
- **Palco:** duas caixas rotuladas `primitivo` e `wrapper`; quatro cartões:
  - contador dentro de um laço → primitivo
  - elemento de `List` → wrapper
  - campo "desconto" que pode não existir → wrapper (distingue ausente de zero)
  - soma de 1 milhão de valores → primitivo (boxing em laço custa caro)
- **Interação:** clicar em cada cartão e escolher o lado; feedback imediato por cartão.
- **Registra resposta** por cartão

### Cena 11 · Checagem final
- **Pergunta:** "Por que `c == d` é `false` para 128 e `true` para 127?"
- **Opções:** (a) 128 não cabe em `Integer`; (b) o cache da JVM só cobre -128 a 127, fora disso cada autoboxing cria um objeto novo e `==` compara referências; (c) `==` não funciona com números grandes.
- **Correta:** b

### Cena 12 · Recap
Seis cartões em cascata:

| | |
|---|---|
| 📦 | wrapper embrulha o primitivo em um objeto na heap |
| 🪄 | autoboxing é `Integer.valueOf()` escrito pelo compilador |
| 🏭 | cache de -128 a 127; fora disso, objeto novo |
| ⚖️ | `==` compara referência, `equals` compara valor |
| 💥 | unboxing de `null` lança NPE |
| 🎯 | primitivo por padrão; wrapper em coleção, ausência e API |

---

## 5. O que já existe e o que precisa ser criado

**Reaproveitado sem mudança:** `.item`, `.caixa`, `.bandeja`, `.chip`, `.saida`,
`.options`, `.boom`, `.palco-escolhas`, `.compara`, e toda a API de cena
(`api.codigo`, `api.som`, `api.reagir`, `api.pronto`, `api.registrarResposta`).

**Novos componentes de CSS** (em `styles/aula.css`):

| Classe | Para quê | Cena |
|---|---|---|
| `.prateleira` | faixa horizontal de caixas do cache, com scroll | 5, 6 |
| `.slot` | cada caixa pré-fabricada; estado `.acesa` ao ser servida | 5, 6 |
| `.memoria` | duas colunas STACK / HEAP | 3 |
| `.ref-seta` | seta ligando referência da stack ao objeto na heap | 3, 5, 6 |
| `.classificar` | dois alvos lado a lado para a cena 10 | 10 |

Estimativa: ~70 linhas de CSS, todas seguindo o padrão mobile-first já
estabelecido (empilha abaixo de 720px).

## 6. Ritmo

12 cenas, 9 interativas. Alvo de **6 a 8 minutos**, igual às outras duas.
XP: 40 de base + 10 por acerto (6 avaliações possíveis → até 100 XP).

## 7. Critérios de aceite

- [ ] Roda de ponta a ponta no celular sem rolagem horizontal
- [ ] Nenhuma cena de 2 a 11 avança sem interação
- [ ] A palavra "cache" só aparece na cena 7, depois da descoberta
- [ ] O código reescrito pelo compilador (cenas 4 e 9) é o mesmo texto que a teoria de `fund-wrappers` usa
- [ ] Sons: `pop` no acerto de manipulação, `barrado` na rejeição, `erro` na NPE, `acerto`/`erro` nos quizzes
- [ ] Sem travessão no texto
- [ ] `node --check content/aula-wrappers.js` passa
- [ ] Registrar `aula: 'wrappers'` em `content/page06-fundamentos.js` na lição `fund-wrappers`

## 8. Ligações com o resto da trilha

- **Puxa de:** aula 1 (primitivos), lição `fund-memoria` (stack × heap)
- **Prepara:** `col-set-map` (por que `Integer` é boa chave de `HashMap`),
  `gen-basico` (a lista só guarda objetos), `fun-optional` (ausência explícita)
- **Cai em entrevista como:** "qual a saída de `Integer a = 127, b = 127; a == b`?"
  e "de onde vem esse `NullPointerException`?"
