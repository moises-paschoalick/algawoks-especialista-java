# tools · esteira de aulas guiadas

Mecanismo que operacionaliza a [metodologia](../../docs/metodologia/README.md):
o banco de roteiros de todas as aulas e o CLI que dirige a produção.

## Peças

| Arquivo | Papel |
|---------|-------|
| `roteiros.json` | **Banco de roteiros** das 36 aulas (saída das etapas 1-2: pedagogia + especialista Java). Fonte de verdade. |
| `aula.mjs` | **CLI da esteira**: gera catálogo, monta esqueleto e roda a revisão. |

## Comandos

```bash
# gera docs/metodologia/ROTEIROS.md a partir do banco (catálogo legível)
node tools/aula.mjs catalogo

# monta o esqueleto de uma aula (etapa 5: scaffold) e fia na tela:
#   cria content/aula-<id>.js com uma cena por beat do arco,
#   copia o template da esteira para docs/metodologia/aulas/<id>.md,
#   insere o <script> em aula.html e marca aula: '<id>' na lição.
node tools/aula.mjs nova <aulaId>

# roda o teste/revisão (Definition of Done) em todas as aulas
node tools/aula.mjs checar
```

Sem argumento, `aula.mjs` lista os roteiros ainda planejados.

## Como a esteira roda um tema

1. **Pedagogia + Java** já entregaram o roteiro em `roteiros.json` (conceito, analogia central, arco, pegadinha). Ajuste ali se precisar refinar.
2. `node tools/aula.mjs nova <aulaId>` monta o scaffold e a fiação.
3. **Ilustrador / designer / dev** preenchem cada cena em `content/aula-<id>.js`: a analogia visual (banner `.analogia`), os componentes de palco, as animações (GSAP), o som por evento e as interações. Registram as decisões no doc da esteira.
4. `node tools/aula.mjs checar` faz a **revisão automática** (equipe de teste): conta cenas, exige analogias e avaliações, barra travessão e TODO, confere fiação e marcação da lição.
5. **Revisão pedagógica** final: percorre a aula contra os objetivos da etapa 1 e aprova no doc.

## O que a revisão automática cobra

Por aula: `node --check` limpo; 10 a 14 cenas; ao menos 3 analogias (banner
`.analogia`); ao menos 3 avaliações (`registrarResposta`); sem travessão; sem
`TODO` sobrando; fiada em `aula.html`; lição marcada com `aula:`.

Ela não substitui a revisão pedagógica humana (etapa 6), que julga se a aula
realmente ensina; é o filtro mecânico antes dela.
