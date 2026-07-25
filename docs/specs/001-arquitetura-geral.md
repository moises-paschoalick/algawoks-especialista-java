# SPEC 001 · Arquitetura geral

| | |
|---|---|
| Realiza | Todos os PRDs |
| Atualizado | 2026-07-25 |

## 1. Visão

Aplicação **estática e sem build**. Cada página HTML carrega, na ordem, os
módulos de infraestrutura, o conteúdo declarativo e por fim o script que monta a
tela. Não há framework, empacotador nem etapa de compilação: o navegador executa
os arquivos como estão.

## 2. Estrutura de arquivos

```
trilha/
├── index.html          mapa da trilha
├── teoria.html         página de leitura
├── licao.html          exercícios
├── aula.html           aula guiada
├── styles/
│   ├── app.css         base, mapa, teoria, lição
│   └── aula.css        aula guiada (palco, personagem, componentes de cena)
├── js/
│   ├── progress.js     estado e revisão espaçada        (SPEC 002)
│   ├── curso.js*       * fica em content/, ver abaixo
│   ├── render.js       renderização de blocos            (SPEC 003)
│   ├── trilha.js       monta o mapa                      (SPEC 003)
│   ├── teoria.js       monta a página de teoria          (SPEC 003)
│   ├── licao.js        motor de exercícios               (SPEC 004)
│   ├── editor.js       Monaco + fallback                 (SPEC 004)
│   ├── aula.js         motor de cenas                    (SPEC 005)
│   └── som.js          síntese de áudio                  (SPEC 005)
├── content/
│   ├── curso.js        índice do curso + registro de unidades
│   ├── page01..10.js   10 unidades (dados declarativos)
│   └── aula-*.js       roteiros das aulas guiadas
├── vendor/
│   └── gsap.min.js     animação (offline)
└── build.sh            gera o bundle publicável          (SPEC 006)
```

## 3. Namespaces globais

Cada módulo expõe um objeto global via IIFE. Não há sistema de módulos ES; a
comunicação é por esses singletons.

| Global | Arquivo | Papel |
|--------|---------|-------|
| `Progress` | `js/progress.js` | estado do aluno, XP, revisão |
| `Curso` | `content/curso.js` | índice dos 35 módulos, `docBase` |
| `Trilha` | `content/curso.js` | registro e consulta de unidades/lições |
| `Render` | `js/render.js` | blocos de conteúdo em HTML, realce Java |
| `Editor` | `js/editor.js` | fábrica de editor de código |
| `Som` | `js/som.js` | efeitos sonoros |
| `Aula` | `js/aula.js` | registro e execução de roteiros |

## 4. Ordem de carregamento

A ordem dos `<script>` importa e é **a mesma em todas as páginas**, porque
`content/page*.js` chama `Trilha.add(...)` na carga, definindo a sequência da
trilha. Padrão por página:

```
infra (progress, som, curso, render, editor conforme a tela)
  → content/page06, page01, page02, ... (ordem da trilha)
  → content/aula-*.js (apenas em aula.html)
  → script que monta a tela (trilha.js | teoria.js | licao.js | aula.js)
```

`content/page06-fundamentos.js` vem primeiro porque Fundamentos é a unidade 1.

## 5. Fluxo de dados

```
content/page*.js  --Trilha.add-->  Trilha (registro em memória)
                                      |
       URL ?id=<licao>                v
  trilha.js / teoria.js / licao.js / aula.js  --lê-->  Trilha, Progress
                                      |
                                      v
                          DOM montado + Render(blocos)
                                      |
                 interação do aluno --> Progress.concluir(...) --> localStorage
```

Não há estado compartilhado mutável entre páginas além do `localStorage`; cada
página é carregada do zero e reconstrói a tela a partir dos dados declarativos e
do progresso salvo.

## 6. Decisões de arquitetura

| Decisão | Motivo |
|---------|--------|
| Sem build/bundler | zero fricção de setup; abre no navegador; publicável como arquivos |
| Globais via IIFE | simplicidade; o produto é pequeno e não precisa de módulos ES |
| Conteúdo declarativo em `content/` | autor edita dados, não lógica; mesma fonte alimenta teoria e prática |
| Renderização centralizada (`Render`) | teoria e lição nunca divergem de formatação |
| GSAP vendorizado, Monaco via CDN com fallback | animação é essencial e offline; editor é opcional e degrada |
| Estado só em `localStorage` | sem backend, sem login, privacidade por dispositivo |

## 7. Requisitos de compatibilidade

- JavaScript ES2020 (optional chaining, `??`, `Array.flatMap`).
- CSS moderno: grid, flexbox, `100dvh`, `env(safe-area-inset-*)`, `@media (prefers-reduced-motion)`.
- Web Audio API (degrada em silêncio se ausente).
- Sem polyfills; alvo é navegador atual de desktop e mobile.
