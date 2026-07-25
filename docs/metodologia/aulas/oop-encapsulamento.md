# Aula · Encapsulamento e visibilidade `oop-encapsulamento`

> Primeira aula produzida pela esteira, serve de exemplo de referência do processo.
> Ver [metodologia](../README.md).

## Metadados

| | |
|---|---|
| Lição (trilha) | `oop-encapsulamento` |
| Unidade | 2. OOP Completo |
| Módulo do curso | 5. Mergulhando em orientação a objetos · 11. Encapsulamento, JavaBeans e Records |
| Prioridade | 🔴 |
| Fonte de revisão | `docs/page_01.md` (seção 1), checklist do sprint (Dia 1), cards Anki seção 2 |

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
Ao fim, o aluno consegue explicar e demonstrar por que um objeto esconde o
próprio estado e o expõe apenas por operações que o mantêm válido.

### O aluno consegue
- [x] Justificar por que campos devem ser `private`
- [x] Explicar por que expor operações de negócio em vez de `setSaldo()`
- [x] Descrever o papel da validação no construtor e nas operações
- [x] Ordenar os 4 modificadores de acesso e dizer quem cada um libera
- [x] Reconhecer o vazamento de referência ao devolver a coleção interna
- [x] Aplicar cópia defensiva (`List.copyOf` / view imutável)

### Conceito nuclear
O objeto é um **cofre**: guarda o próprio estado e só deixa alterá-lo por
operações que garantem que ele nunca fique inválido (o invariante).

### Erro comum
Deixar campos `public` ou criar `setSaldo()`, permitindo estado impossível
(saldo negativo, dinheiro do nada). E, mais sutil, devolver a coleção interna
num getter, furando o encapsulamento por referência.

### Pegadinha de entrevista
"Por que usar operações (`depositar`/`sacar`) em vez de um setter?" e "Seu campo
é private; o encapsulamento ainda pode ser furado?" (sim: vazamento de referência).

### Arco (problema antes da solução)
1. Problema sentido: conta com campo público, aluno seta saldo pra -5000 e 999999.
2. Consequência: objeto em estado impossível, sem ninguém impedir.
3. Solução: trancar o campo (`private`) e operar por guichê que valida.
4. Nome (só aqui): encapsulamento + os 4 modificadores de acesso.
5. Segunda armadilha: vazamento de referência (a cópia da chave) e a correção.
6. Consolidação: pergunta de entrevista.

### Ligações
- Puxa de: nenhuma (é a abertura de OOP).
- Prepara: `oop-heranca-polimorfismo` (protected), `col-set-map` (cópia defensiva), records (imutabilidade).

**Portão da etapa 1**: objetivos verificáveis ✅ · arco começa pelo problema ✅

---

## 2. Analogias · 🔗

| Conceito | Analogia | Manipulável? |
|----------|----------|--------------|
| campo `public` / `setSaldo` | gaveta/cofre com a porta aberta | aluno seta valores absurdos e vê o estrago |
| campo `private` | trancar o cofre | aluno clica no cadeado, o cofre fecha |
| operações de negócio | guichê do caixa | aluno testa depositar/sacar, guichê barra as inválidas |
| modificadores de acesso | níveis de crachá | aluno toca cada crachá e vê quem passa |
| vazamento de referência | entregar cópia da chave | aluno executa e vê o cofre esvaziar de fora |
| cópia defensiva | entregar a fotocópia | comparação antes/depois |

**Portão da etapa 2**: analogias manipuláveis ✅ · nome do conceito só na cena 6, após a vivência ✅

---

## 3. Storyboard · 🎨

12 cenas. Componentes reusados: `.analogia`, `.options`, `.chip`, `.saida`,
`.compara`, `.boom`, `.palco-escolhas`, `.cena-linha`, `.mini-tabela`, `.note`.
Componente novo: `.cofre` (com estados `.aberto`/`.trancado`).

1. Intro: cofre trancado 🔒 com saldo. Expositiva.
2. Conta aberta: cofre 🔓 + 2 chips que setam saldo absurdo. Interativa.
3. Quiz: qual a real falha do setter. Interativa (avaliação).
4. Trancar: campo vira `private`, aluno clica o cadeado, cofre fecha. Interativa.
5. Guichê: 3 operações; válidas atualizam, inválidas são barradas. Interativa.
6. Nomear encapsulamento: código canônico + receita. Expositiva.
7. Crachás: `.mini-tabela` clicável com os 4 modificadores. Interativa.
8. Quiz do modificador: protected. Interativa (avaliação).
9. Cópia da chave: getItens() devolve interna, executa, boom. Interativa.
10. Fotocópia: `.compara` antes/depois com `List.copyOf`. Expositiva.
11. Checagem final: operação vs setter. Interativa (avaliação).
12. Recap: 6 cartões.

**Portão da etapa 3**: cabe no palco mobile ✅ · componentes reusados ✅ (1 novo)

---

## 4. Design de animação e som · 🎬

- **Cofre aberto (cena 2/5)**: tremor horizontal (`x` yoyo) + som `barrado` na violação; `pop` e pulo de escala no valor quando a operação é válida.
- **Trancar (cena 4)**: cofre muda de classe aberta→trancada, `elastic.out` na escala, som `pop`, personagem `feliz`.
- **Crachás (cena 7)**: linha acende (`.acesa`), som `clique`.
- **Vazamento (cena 9)**: `boom` 💥 com scale/fade, som `erro`, personagem `alerta`.
- **Comparação (cena 10)** e **recap (cena 12)**: entrada em cascata `stagger` com `back.out`.
- **Emoções**: pensando (cena 2), feliz (4, 5, 12), alerta (9).
- **Som por evento** apenas; respeita `prefers-reduced-motion` (herdado do motor).

**Portão da etapa 4**: movimento com propósito ✅ · som por evento ✅

---

## 5. Desenvolvimento · 💻

- Arquivo: `trilha/content/aula-oop-encapsulamento.js` (`Aula.registrar`).
- CSS novo: `.cofre` e estados em `trilha/styles/aula.css` (~15 linhas).
- Registrado o `<script>` em `aula.html`; `aula: 'oop-encapsulamento'` marcado na lição em `content/page01-oop.js`.

### Verificação
- [x] `node --check content/aula-oop-encapsulamento.js`
- [x] `aula.html?id=oop-encapsulamento` responde 200
- [x] Estrutura: 12 cenas, 8 interativas, 6 analogias, 3 avaliações
- [x] `grep -c '—'` = 0

**Portão da etapa 5**: sintaxe ok, roda, sem travessão ✅

---

## 6. Revisão pedagógica · ✅

### Checklist de aceite
- [x] 12 cenas, 8 interativas
- [x] Analogia antes do conceito em toda cena de conceito
- [x] "Encapsulamento" nomeado só na cena 6, após a descoberta
- [x] 3 avaliações contam ponto (cenas 3, 8, 11)
- [x] Som por evento; personagem reage (pensando/feliz/alerta)
- [x] Mobile-first (herda o layout do motor de aula)
- [x] Conclui com `Progress.concluir` (via motor)
- [x] Cada "o aluno consegue" da etapa 1 é exercitado em ao menos uma cena
- [x] O conceito é aprendível só pela aula

### Veredito
- [x] **Aprovada**

### Ajustes aplicados
Nenhum no primeiro passe. Observação para as próximas aulas de OOP: a metáfora do
cofre/guichê pode ser reaproveitada em `oop-heranca` (o crachá `protected` já foi
plantado aqui), mantendo continuidade entre as aulas da unidade.
