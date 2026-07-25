# SPEC 003 · Conteúdo e renderização

| | |
|---|---|
| Realiza | [PRD 001](../prds/001-trilha-e-progressao.md), [PRD 003](../prds/003-paginas-teoria.md) |
| Arquivos | `content/curso.js`, `content/page*.js`, `js/render.js`, `js/trilha.js`, `js/teoria.js` |
| Atualizado | 2026-07-25 |

## 1. Modelo de conteúdo declarativo

### 1.1 Unidade

Cada `content/pageNN-*.js` registra uma unidade:

```js
Trilha.add({
  numero, titulo, icone, cor, prioridade,   // 'alta' | 'media' | 'base'
  doc,                                        // 'docs/page_06.md'
  modulos: [Number],                          // módulos do curso cobertos
  resumo,
  licoes: [ Licao ]
});
```

### 1.2 Lição

```js
{
  id, titulo, icone,
  modulo: Number | [Number],   // módulo(s) do curso desta lição
  aula: String | undefined,    // id do roteiro de aula guiada, se houver
  ancora: String | undefined,  // âncora no markdown de origem
  resumo,
  teoria: [ Bloco ],           // conteúdo de leitura
  passos: [ Passo ]            // exercícios (pode ser [])
}
```

Ao registrar, `Trilha.add` injeta em cada lição `l.unidade` e `l.indice`.

### 1.3 Bloco de conteúdo

Unidade mínima de conteúdo, interpretada por `Render`:

```
{ p: "texto" }                          parágrafo (mini-markdown)
{ h: "titulo" }                         subtítulo (vira id via slug)
{ ul: [..] } | { ol: [..] }             listas
{ code: "..." }                         bloco de código Java (realce)
{ nota: "..." }                         caixa de destaque
{ tabela: { head:[..], rows:[[..]] } }  tabela
```

## 2. `Curso` e `Trilha` (content/curso.js)

```js
Curso.docBase           // '../' no repo; reescrito para URL absoluta no bundle (SPEC 006)
Curso.MODULOS           // { 2: 'Fundamentos...', ..., 35: 'Reflection API' }
Curso.nome(n)  -> String
Curso.pasta(n) -> String   // caminho da pasta; trata o caso especial '26 - Optional'

Trilha.add(unidade)
Trilha.todas()      -> [Unidade]
Trilha.sequencia()  -> [Licao]        // todas as lições, na ordem = ordem de desbloqueio
Trilha.licao(id)    -> Licao | null
Trilha.liberada(id) -> Boolean        // true se anterior concluída ou modo livre
Trilha.proxima()    -> Licao | null   // primeira não concluída
```

## 3. `Render` (js/render.js)

```js
Render.escapar(s)         // escapa HTML
Render.realce(src)        // realce de Java em um passe (comentário, string, anotação, palavra-chave)
Render.inline(txt)        // mini-markdown: **negrito**, `código`
Render.bloco(b)           // um bloco -> HTML
Render.corpo(blocos)      // lista de blocos -> HTML
Render.slug(txt)          // id de âncora (sem acento, kebab)
Render.refModulo(mods, { compacto })  // caixa "Módulo N" com caminho da pasta
Render.refDoc(licao)      // caixa com link para o markdown de origem
```

O realce é **um único passe de regex** (sem reprocessar HTML já gerado), com
tokens: comentário, string, anotação `@Xxx` e uma lista fixa de palavras-chave
Java. Motivo: evitar dependência externa e reprocessamento.

## 4. Montagem do mapa (js/trilha.js)

- Para cada unidade, renderiza cabeçalho (cor, prioridade, módulos) e os nós das lições em caminho serpenteante (offsets horizontais ciclando em `[0,1,2,1,0,-1,-2,-1]`).
- Estado do nó decidido nesta ordem: `concluida` (estrela) > `aula` (▶) > só teoria (📖) > liberada (ícone) > bloqueada (cadeado).
- Destino do clique: `aula.html?id=<aula>` | `teoria.html?id=<id>` | `licao.html?id=<id>`.
- HUD e painel "Revisar hoje" alimentados por `Progress`.
- Botões: modo livre (alterna `Progress.modoLivre`), zerar, hub. `linkHub` usa `Curso.docBase`.

## 5. Montagem da teoria (js/teoria.js)

- Lê `?id=`; monta índice lateral de todas as unidades/lições.
- Renderiza cabeçalho, `refModulo`, `refDoc`, sumário "Nesta página" e o corpo (`Render.corpo(licao.teoria)`).
- `IntersectionObserver` destaca o item do sumário conforme a rolagem.
- CTA final: aula guiada (se `licao.aula`), praticar (se há `passos`), voltar; navegação anterior/próxima na ordem da trilha.

## 6. Regras de consistência

- A ordem dos `<script>` de `content/page*.js` define a sequência da trilha e deve ser idêntica nas 4 páginas HTML.
- Toda referência de módulo (`modulo`, `modulos`) deve existir em `Curso.MODULOS` e apontar para pasta real do repositório.
- Teoria e lição usam o **mesmo** `Render`; não há renderização paralela.
