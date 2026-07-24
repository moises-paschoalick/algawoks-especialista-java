# Planejamento · Aula 3 · String, pool e StringBuilder

> **Status: implementada em `content/aula-strings.js`.** Segue a regra didática
> firmada na aula 2: toda cena de conceito abre com uma faixa de **analogia do
> mundo real** e só depois desce para o código.
>
> Lição: `fund-strings` (Unidade 1, Fundamentos)
> Módulo do curso: **20. Trabalhando com strings** · teoria: `docs/page_06.md`
> Arquivo: `content/aula-strings.js` · registrada como `aula: 'strings'`
> Pré-requisitos: aula 1 (gaveta), aula 2 (caixa, prateleira da JVM)

---

## 1. Objetivo

Ao fim, o aluno consegue:

1. Explicar por que `s.toUpperCase()` sozinho "não faz nada"
2. Reproduzir o comportamento do String Pool com literais e com `new String()`
3. Justificar a regra "compare String com `equals`, nunca com `==`"
4. Explicar POR QUE a imutabilidade é o que torna o pool possível
5. Dizer por que `+` em loop é O(n²) e trocar por `StringBuilder`

## 2. Metáforas centrais (uma por bloco)

| Conceito | Analogia |
|---|---|
| Imutabilidade | **placa gravada em pedra**: não se edita, grava-se outra |
| String Pool | **biblioteca de exemplar único**: todo mundo que pede "Java" recebe o MESMO exemplar da estante |
| `new String()` | **gráfica**: mandar imprimir uma cópia própria de um livro que a biblioteca já tem |
| `+` em loop | **copista**: a cada página nova, recopia o livro inteiro e joga o antigo fora |
| `StringBuilder` | **fichário de argolas**: só encaixa páginas; encaderna uma vez, no `toString()` |

As analogias conversam com as aulas anteriores: a "prateleira da JVM" do cache
de Integer (aula 2) reaparece aqui como a estante da biblioteca, e o aluno
percebe que é o mesmo mecanismo com outro nome.

## 3. Roteiro (12 cenas, 8 interativas)

1. **Intro**: placa de pedra com "java" gravado. Sem interação.
2. **A placa não se edita**: executar `texto.toUpperCase()` e ver uma placa NOVA surgir, com a original intacta. A variável continua apontando para a antiga.
3. **Quiz da imutabilidade**: o que imprime `s.toUpperCase(); println(s)`.
4. **A biblioteca**: pedir o literal `"Java"` duas vezes; o mesmo exemplar da estante acende (reuso visual da prateleira da aula 2). `a == b → true`.
5. **A gráfica**: antes de rodar, o aluno **aposta** no resultado de `a == c` com `c = new String("Java")`; depois vê a cópia própria sair da gráfica com endereço `@9f31`. Conta ponto.
6. **Nomear: String Pool**: consolidação com código, `intern()` na nota.
7. **Quiz do pool**: literal vs `new`, qual comparação dá `true`.
8. **O copista**: clicar "somar página" 4 vezes; a cada clique o livro inteiro é recopiado e a versão velha vai para a pilha de lixo. Contador de páginas recopiadas cresce 1+2+3+4.
9. **O fichário**: mesmas 4 páginas no `StringBuilder`; contador não cresce, lixo zero; "encadernar" = `toString()`.
10. **Lado a lado**: o mesmo loop com `+` e com `StringBuilder`, com os números das cenas 8 e 9. Sem interação.
11. **Checagem final**: "por que a imutabilidade é o que PERMITE o pool existir?" (amarra os dois blocos da aula).
12. **Recap**: 6 cartões.

## 4. Componentes novos de CSS

`.placa` (pedra gravada, com estado `.nova`), `.pilha-lixo` (versões descartadas
do copista), `.contador` (páginas recopiadas). O resto reaproveita `.analogia`,
`.prateleira`/`.slot`, `.pedidos`, `.chip`, `.options`.

## 5. Critérios de aceite

- [ ] Analogia sempre antes do código, em toda cena de conceito
- [ ] "String Pool" só é nomeado na cena 6, depois da descoberta
- [ ] Roda no celular sem rolagem horizontal
- [ ] 4 avaliações contam ponto (cenas 3, 5, 7, 11)
- [ ] Sem travessão; `node --check` passa
- [ ] Registrada em `page06-fundamentos.js` e em `aula.html`
