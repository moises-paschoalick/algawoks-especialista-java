# PRD 005 · Aulas guiadas interativas

| | |
|---|---|
| Status | Parcial (3 aulas prontas: Primitivos, Wrappers, Strings) |
| Arquivos | `trilha/aula.html`, `trilha/js/aula.js`, `trilha/js/som.js`, `trilha/content/aula-*.js`, `trilha/styles/aula.css` |
| Depende de | [002 Progresso](002-progresso-e-revisao-espacada.md), [003 Renderização](003-paginas-teoria.md) |
| Atualizado | 2026-07-25 |

## 1. Contexto e problema

O aluno pediu explicitamente: aprender o conteúdo **sem precisar ler tudo**, com
o material aparecendo **item a item**, de forma **lúdica e interativa**, com um
**personagem** que explica e usa **analogias do mundo real** (caixas, objetos
reais). O formato de leitura (PRD 003) e o de exercício (PRD 004) não cobrem esse
momento de descoberta guiada.

## 2. Objetivo

Ensinar um conceito passo a passo, conduzido por um personagem narrador, em que
**cada etapa abre com uma analogia do mundo real e só depois formaliza no código**,
e o aluno interage para avançar.

## 3. Caso de uso

O aluno entra na aula, o personagem (Bean) se apresenta e conduz cena a cena.
Em cada cena de conceito ele vê primeiro uma imagem física (uma transportadora,
uma placa de pedra, uma prateleira de cafeteria), mexe nela, e então o Java
aparece como formalização do que ele acabou de sentir. Ao fim, ganha XP e a
lição entra na revisão espaçada.

## 4. Escopo funcional

### 4.1 Motor de cenas
- A aula é um roteiro declarativo: lista de cenas, cada uma com `fala`, função de `palco` e marcação `interativo`.
- Progresso por pontos no topo (feito / atual).
- Cenas interativas **travam o botão Continuar** até a interação acontecer; cenas expositivas liberam ao fim da fala.
- Ao concluir: XP (40 de base + 10 por acerto), registro na revisão espaçada e tela de encerramento com atalhos para praticar ou ver a teoria.

### 4.2 Personagem narrador (Bean)
- Grão de café em SVG inline, com corpo em gradiente, olhos, sobrancelhas, boca e braços.
- **Vida contínua**: respiração, vapor e piscada em intervalo irregular.
- **Expressões animadas** (boca e sobrancelhas por path, via GSAP): normal, feliz, alerta, pensando. Reage a acerto (pula, agita os braços) e a erro (treme, franze).
- Fala em máquina de escrever; tocar no balão pula para o texto completo.

### 4.3 Analogia antes do conceito (regra didática central)
- Toda cena de conceito abre com uma faixa de **analogia do mundo real** (visual dourado) e só então desce para o código.
- O nome técnico do conceito só aparece **depois** que o aluno o descobriu pela interação (ex.: "cache" e "String Pool" são nomeados após a experiência, não antes).

### 4.4 Palco animado e interativo
- Cada cena renderiza um palco próprio: caixas que se movem, prateleiras que acendem, código que o compilador "reescreve", quizzes, classificação de casos, contadores.
- Animações com **GSAP** (vendorizado, sem CDN): entrada em cascata, quique, elástico, explosões.

### 4.5 Som reativo (`som.js`)
- Efeitos **sintetizados na Web Audio API**, sem nenhum arquivo de áudio. Sem trilha de fundo.
- Eventos: acerto (acorde ascendente), erro (tons descendentes suaves), item aceito/barrado, clique, revelação, conclusão (fanfarra).
- `AudioContext` só nasce no primeiro gesto do usuário; botão liga/desliga com preferência persistida.

## 5. Requisitos não funcionais

- **Offline-first**: GSAP local em `trilha/vendor/`, som sintetizado, zero dependência de rede.
- **Mobile-first**: layout de app em `100dvh`, palco rolável, narrador fixo, `safe-area`, alvos de toque generosos.
- **Acessibilidade de movimento**: respeita `prefers-reduced-motion` no que é decorativo.
- **Autoria isolada**: nova aula é um novo `content/aula-*.js`; o motor entrega `gsap`, `som`, `codigo`, `reagir`, `pronto`, `registrarResposta`.

## 6. Fora de escopo

- Narração em áudio (voz); a "fala" é textual.
- Personagens alternativos ou customização de avatar.

## 7. Métricas de sucesso

- Cada aula tem 12 cenas, a maioria interativa, e roda em 6 a 8 minutos.
- O conceito é nomeado somente após a descoberta.
- Roda no celular sem rolagem horizontal; funciona sem internet.

## 8. Estado atual e roadmap

Aulas prontas (Unidade 1, Fundamentos):

| Aula | Analogias centrais |
|------|--------------------|
| Primitivos e conversões | gaveta de tamanho fixo, régua de estouro |
| Wrappers e cache do Integer | transportadora, bancada × estante, máquina de embrulho, cafeteria, encomenda não entregue |
| String, pool e StringBuilder | placa gravada em pedra, biblioteca de exemplar único, gráfica, copista × fichário |

Planos escritos em `trilha/PLANO-AULA-*.md`.

Próximas candidatas: Controle de fluxo/switch, Stack-Heap-GC, e então avançar
para OOP e Collections seguindo a ordem da trilha.

## 9. Dependências e referências

- Animação: `trilha/vendor/gsap.min.js`.
- Som: `trilha/js/som.js`.
- Registro de conclusão: [PRD 002](002-progresso-e-revisao-espacada.md).
