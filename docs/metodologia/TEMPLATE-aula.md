# Aula · <título> `<id>`

> Copie este arquivo para `docs/metodologia/aulas/<id>.md` e preencha uma seção
> por etapa. O documento viaja pela esteira; cada papel preenche a sua seção e
> passa adiante. Ver [metodologia](../README.md).

## Metadados

| | |
|---|---|
| Lição (trilha) | `<licao-id>` (ex.: `oop-encapsulamento`) |
| Unidade | <n. nome> |
| Módulo do curso | <n. nome da pasta> |
| Prioridade | 🔴 / 🟡 / 🟢 |
| Fonte de revisão | `docs/page_XX.md` (seção), item(s) da checklist, cards Anki |

### Status por etapa

| Etapa | Papel | Status |
|-------|-------|--------|
| 1 Briefing | 🎓 Pedagogo | ☐ |
| 2 Analogias | 🔗 Roteirista | ☐ |
| 3 Storyboard | 🎨 Ilustrador | ☐ |
| 4 Animação/som | 🎬 Designer | ☐ |
| 5 Desenvolvimento | 💻 Dev | ☐ |
| 6 Revisão | ✅ Revisor | ☐ |

---

## 1. Briefing pedagógico · 🎓

### Objetivo
Uma frase: ao fim, o aluno consegue ______.

### O aluno consegue (5 a 7, verificáveis)
- [ ] ...
- [ ] ...

### Conceito nuclear
A ideia única que sustenta tudo (a "gaveta de tamanho fixo", a "placa gravada").

### Erro comum
O que o aluno tipicamente faz errado, que a aula vai expor.

### Pegadinha de entrevista
A pergunta clássica sobre este tema (extraída dos cards / da teoria).

### Arco (problema antes da solução)
Sequência de descoberta: primeiro o aluno SENTE o problema, depois a solução,
depois o nome técnico, depois a prática. Liste os beats:
1. Problema sentido: ...
2. Tentativa/consequência: ...
3. Solução apresentada: ...
4. Nome do conceito (só aqui): ...
5. Consolidação/checagem: ...

### Ligações
- Puxa de: <lições anteriores>
- Prepara: <lições seguintes>

**Portão da etapa 1**: objetivos verificáveis? arco começa pelo problema? ☐

---

## 2. Analogias · 🔗

### Mapa conceito → analogia

| Conceito | Analogia do mundo real | Manipulável? (como o aluno age) |
|----------|------------------------|---------------------------------|
| ... | ... | ... |

### Garantia "analogia antes do conceito"
Confirme que, em cada cena de conceito, a imagem física aparece e é manipulada
antes de o código e o nome técnico entrarem.

**Portão da etapa 2**: analogia manipulável (não só ilustrativa)? nome depois? ☐

---

## 3. Storyboard · 🎨

Uma linha por cena. Alvo: 10 a 12 cenas.

### Cena N · <título curto>
- **Analogia/foco**: ...
- **O que aparece**: elementos na tela (ex.: bandeja com 3 itens, caixa rotulada).
- **Estados**: o que muda ao interagir (ex.: item quica, slot acende).
- **Interação**: o que o aluno faz para liberar o avanço (ou "expositiva").
- **Componentes reusados**: `.analogia`, `.caixa`, `.prateleira`/`.slot`, `.placa`, `.memoria`, `.chip`, `.options`, `.item`, `.bandeja`, `.compara`, `.mini-tabela`, `.regua`, `.contador`, `.linha-click`, `.class-card` (marque os que servem; proponha novos se faltar).

*(repita por cena)*

**Portão da etapa 3**: cada cena cabe no palco mobile? componentes reusados? ☐

---

## 4. Design de animação e som · 🎬

Por cena, o movimento e o áudio.

### Cena N
- **Entrada**: o que anima ao abrir (ex.: cascata `stagger`, `back.out`).
- **Feedback**: acerto (ex.: pulo + `acerto`) / erro (ex.: tremor + `barrado`).
- **Transições internas**: ex.: código se reescreve com `.hl`, boom `💥`.
- **Som por evento**: `clique` / `pop` / `acerto` / `erro` / `barrado` / `revelar` / `passo` / `conclusao`.
- **Personagem (emoção)**: `normal` / `feliz` / `alerta` / `pensando`.

**Portão da etapa 4**: todo movimento tem propósito? `prefers-reduced-motion`? som por evento? ☐

---

## 5. Desenvolvimento · 💻

Referência: [SPEC 005](../specs/005-motor-de-aula-e-som.md).

### Checklist de implementação
- [ ] `content/aula-<id>.js` com `Aula.registrar({ id, licao, titulo, personagem, fechamento, cenas })`
- [ ] Cada cena: `fala`, `palco(host, api)`, `interativo`, `dica`, `emocao`
- [ ] Cenas interativas travam o avanço até `api.pronto(...)`
- [ ] Avaliações via `api.registrarResposta(certo)`
- [ ] Som via `api.som(...)`; código via `api.codigo(...)`
- [ ] CSS novo (se houver) em `styles/aula.css`, mobile-first
- [ ] `<script src="content/aula-<id>.js">` em `aula.html`
- [ ] `aula: '<id>'` marcado na lição em `content/pageXX-*.js`

### Notas de implementação
(componentes novos criados, decisões, pendências)

### Verificação
- [ ] `node --check content/aula-<id>.js`
- [ ] Smoke test: `aula.html?id=<id>` responde 200
- [ ] Rodou no navegador, mobile sem rolagem horizontal
- [ ] `grep -c '—'` = 0

**Portão da etapa 5**: sintaxe ok, roda, mobile ok, sem travessão? ☐

---

## 6. Revisão pedagógica · ✅

Percorra a aula inteira como aluno e valide contra a etapa 1.

### Checklist de aceite (Definition of Done)
- [ ] 10 a 12 cenas, a maioria interativa
- [ ] Analogia antes do conceito em toda cena de conceito
- [ ] Nome técnico só após a descoberta
- [ ] 3 a 5 avaliações contam ponto
- [ ] Som por evento; personagem reage
- [ ] Mobile-first, sem rolagem horizontal
- [ ] Conclui com `Progress.concluir`
- [ ] Cada "o aluno consegue" da etapa 1 é exercitado
- [ ] O revisor consegue aprender o conceito só pela aula

### Veredito
- [ ] **Aprovada**
- [ ] **Devolvida** para a etapa ___ pelo motivo: ...

### Ajustes aplicados
(lista de correções após o loop de retorno)
