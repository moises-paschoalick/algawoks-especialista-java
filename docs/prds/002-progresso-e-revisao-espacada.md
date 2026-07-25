# PRD 002 · Progresso e revisão espaçada

| | |
|---|---|
| Status | Implementado |
| Arquivos | `trilha/js/progress.js` |
| Usado por | [001 Trilha](001-trilha-e-progressao.md), [004 Exercícios](004-exercicios-praticos.md), [005 Aulas guiadas](005-aulas-guiadas-interativas.md) |
| Atualizado | 2026-07-25 |

## 1. Contexto e problema

Revisão de conteúdo antigo só funciona se for **repetida no tempo certo**.
Reler tudo de uma vez não fixa; o esquecimento precisa ser combatido com
repasses espaçados. Além disso, o aluno precisa de sinais de progresso
(XP, ofensiva) para manter a constância, e de retomada de onde parou, sem
qualquer cadastro.

## 2. Objetivo

Registrar a conclusão de cada lição, agendar sua próxima revisão em intervalos
crescentes, e manter os indicadores de engajamento (XP e ofensiva de dias),
tudo localmente no navegador.

## 3. Caso de uso

Ao concluir uma lição, o aluno ganha XP e a lição entra na fila de revisão.
Dias depois, ela aparece no painel "Revisar hoje" com selo vermelho no mapa.
Revisar de novo empurra a próxima revisão para um intervalo maior.

## 4. Escopo funcional

### 4.1 Conclusão de lição
- Registra a lição como concluída, com acertos, total avaliado e XP ganho.
- Acumula XP no total geral.
- Marca o dia como ativo (para a ofensiva).

### 4.2 Revisão espaçada
- Intervalos crescentes em dias: **1, 3, 7, 15, 30, 90**.
- Cada repasse avança um degrau na sequência; após o último, mantém 90 dias.
- Uma lição "precisa revisão" quando o intervalo do degrau atual já passou desde o último repasse.
- Expõe quantos dias faltam para a próxima revisão de cada lição.

### 4.3 Ofensiva (streak)
- Conta dias consecutivos de estudo até hoje.
- Se hoje ainda não houve estudo, conta até ontem (não zera o dia em andamento).

### 4.4 Indicadores
- XP total e número de lições concluídas.
- Modo livre (destravar a trilha) persistido junto ao progresso.

### 4.5 Reset
- Apaga todo o progresso (XP, ofensiva, lições e revisões).

## 5. Requisitos não funcionais

- **Persistência local**: `localStorage`, chave única `trilha-java-v1`, serializado em JSON.
- **Tolerante a dados ausentes/corrompidos**: carga com fallback para estado vazio.
- **Sem backend, sem rede**: funciona offline e por dispositivo.

## 6. Fora de escopo

- Sincronização entre dispositivos ou navegadores.
- Algoritmo adaptativo por desempenho (tipo SM-2 do Anki); os intervalos são fixos por degrau.

## 7. Métricas de sucesso

- Fechar e reabrir o navegador preserva XP, ofensiva e lições concluídas.
- Uma lição concluída reaparece para revisão exatamente após o intervalo do degrau.
- Estudar em dias seguidos incrementa a ofensiva; pular um dia a reinicia.

## 8. Dependências e referências

- Consumido pelo mapa da trilha ([PRD 001](001-trilha-e-progressao.md)) e por todos os modos de lição.
- Inspiração: sistema de revisão do `state-game`/`strategy-game` (localStorage + intervalos fixos).
