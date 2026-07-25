# Aula · Herança, polimorfismo e classes abstratas `oop-heranca`

> Produzida pela esteira de [metodologia](../README.md).

## Metadados

| | |
|---|---|
| Lição (trilha) | `oop-heranca-polimorfismo` |
| Roteiro (id da aula) | `oop-heranca` |
| Unidade | 2. OOP Completo |
| Módulo do curso | 12. Herança · 13. Polimorfismo e classes abstratas |
| Prioridade | 🔴 |
| Fonte de revisão | `docs/page_01.md` (seções Herança, Polimorfismo, Sobrecarga vs sobrescrita, Classe abstrata, final), checklist Dia 1, cards seção 2 |

### Status por etapa

| Etapa | Papel | Status |
|-------|-------|--------|
| 1 Briefing | 🎓 Pedagogo | ✅ |
| 2 Analogias | 🔗 Roteirista | ✅ |
| 3 Storyboard | 🎨 Ilustrador | ✅ |
| 4 Animação/som | 🎬 Designer | ✅ |
| 5 Desenvolvimento | 💻 Dev | ✅ |
| 6 Revisão | ✅ Revisor | ✅ Aprovada |

---

## 1. Briefing pedagógico · 🎓

### Objetivo
Ao fim, o aluno reaproveita código por herança, faz cada tipo responder ao seu
modo por polimorfismo, e sabe quando um método é sobrescrito, quando a classe é
abstrata e por que `@Override` importa.

### O aluno consegue
- [x] Explicar a relação é-um e usar `extends` e `super`
- [x] Sobrescrever um método reaproveitando a base com `super`
- [x] Distinguir sobrescrita de sobrecarga
- [x] Explicar polimorfismo como despacho em tempo de execução (late binding)
- [x] Justificar por que uma classe abstrata não é instanciável
- [x] Explicar o que `@Override` previne

### Conceito nuclear
Um comando, cada tipo do seu jeito: a mesma chamada (`calcularSalario()`) roda a
implementação do objeto real, decidida em runtime.

### Erro comum
Duplicar a lógica da base em vez de usar `super`; encadear `if instanceof` no
lugar de polimorfismo; sobrescrever com typo sem `@Override` (bug silencioso).

### Pegadinha de entrevista
"Numa lista da superclasse, quem decide qual método roda?" (o objeto real, em
runtime) e "diferença entre sobrescrita e sobrecarga".

### Arco
1. Problema: três cargos copiando os mesmos campos (repetição).
2. Solução: extrair a base `Funcionario` (`extends`).
3. Nome: herança + `super`.
4. Sobrescrita: Gerente calcula diferente reaproveitando a base.
5. Problema 2: pagar uma lista mista vira `if instanceof` sem fim.
6. Solução/nome: polimorfismo (um comando, cada um se paga).
7. Armadilhas: classe abstrata e `@Override`.
8. Consolidação: pergunta de entrevista sobre late binding.

### Ligações
- Puxa de: `oop-encapsulamento` (reusa o crachá `protected`, plantado lá).
- Prepara: `oop-interfaces` (contrato sem estado), `col-ordenacao` (Comparable).

**Portão da etapa 1**: objetivos verificáveis ✅ · começa pelo problema ✅

---

## 2. Analogias · 🔗

| Conceito | Analogia | Manipulável? |
|----------|----------|--------------|
| herança | crachá base + cargos que o estendem | aluno extrai a base com um clique |
| sobrescrita | reescrever a regra herdada com super | aluno escolhe a forma certa |
| polimorfismo | um comando, cada instrumento toca sua parte | aluno roda a folha e vê cada cargo se pagar |
| classe abstrata | cargo genérico que não se contrata | aluno tenta `new Funcionario()` e é barrado |
| @Override | o revisor que confere o crachá | aluno executa e vê o bug silencioso |

**Portão da etapa 2**: analogias manipuláveis ✅ · nomes após a vivência (herança na 4, polimorfismo na 7) ✅

---

## 3. Storyboard · 🎨

12 cenas. Componente novo: `.cracha` (e `.cracha-org`, `.org-filhos`, `.org-seta`).
Reusa `.analogia`, `.options`, `.chip`, `.saida`, `.note`, `.boom`, `.palco-escolhas`.

1. Intro: organograma Funcionário → Gerente/Vendedor. Expositiva.
2. Repetição: 3 chips de cargo revelam o mesmo código repetido. Interativa.
3. Extrair base: botão sobe o comum para `Funcionario`. Interativa.
4. Nomear herança: código com extends/super. Expositiva.
5. Sobrescrita: quiz de 3 opções (super). Interativa (avaliação).
6. Problema do pagamento: `if instanceof` feio. Expositiva.
7. Polimorfismo: rodar a folha, 3 crachás se pagam em cascata. Interativa.
8. Sobrescrita vs sobrecarga: quiz. Interativa (avaliação).
9. Classe abstrata: `new Funcionario()` barrado, 🚫. Interativa.
10. @Override: typo sem override, bug silencioso. Interativa.
11. Checagem final: late binding. Interativa (avaliação).
12. Recap: 6 cartões.

**Portão da etapa 3**: cabe no mobile ✅ · componentes reusados ✅ (1 novo)

---

## 4. Design de animação e som · 🎬

- Organograma (1) e recap (12): entrada em cascata `back.out`.
- Extrair base (3): antes some, base sobe com `y` + fade, som `pop`.
- Rodar a folha (7): crachás pagam em cascata (`setTimeout` escalonado), cada um com `pop`, escala `back.out` e borda verde. Personagem feliz no fim.
- Abstrata (9): 🚫 com scale/fade, som `barrado`, personagem alerta.
- @Override (10): som `erro`, personagem alerta.
- Emoções: pensando (2, 6), feliz (3, 7, 12), alerta (9, 10).

**Portão da etapa 4**: movimento com propósito ✅ · som por evento ✅

---

## 5. Desenvolvimento · 💻

- Arquivo: `trilha/content/aula-oop-heranca.js`.
- CSS novo: `.cracha` e derivados em `styles/aula.css` (~22 linhas).
- Registrado `<script>` em `aula.html`; `aula: 'oop-heranca'` marcado em `content/page01-oop.js`.

### Verificação
- [x] `node --check` limpo
- [x] `aula.html?id=oop-heranca` responde 200
- [x] Estrutura: 12 cenas, 8 interativas, 7 analogias, 3 avaliações
- [x] `grep -c '—'` = 0

**Portão da etapa 5**: sintaxe ok, roda, sem travessão ✅

---

## 6. Revisão pedagógica · ✅

### Checklist de aceite
- [x] 12 cenas, 8 interativas
- [x] Analogia antes do conceito em toda cena de conceito
- [x] "Herança" e "polimorfismo" nomeados após a descoberta (cenas 4 e 7)
- [x] 3 avaliações contam ponto (cenas 5, 8, 11)
- [x] Som por evento; personagem reage
- [x] Mobile-first (herda o motor, agora com narrador no topo e Voltar/Refazer)
- [x] Conclui com `Progress.concluir`
- [x] Cada "o aluno consegue" exercitado em ao menos uma cena
- [x] Conceito aprendível só pela aula

### Veredito
- [x] **Aprovada**

### Ajustes aplicados
Nenhum no primeiro passe. Continuidade cumprida: o crachá `protected` da aula de
encapsulamento é retomado na cena 3. Para a próxima aula da unidade (`oop-interfaces`),
a metáfora de contrato/cargo pode evoluir para "contrato assinado sem herança de estado".
