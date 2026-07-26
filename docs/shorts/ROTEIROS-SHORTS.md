# Java em 30 segundos · Roteiros dos shorts

Série de vídeos curtos (30s cada, formato vertical 9:16) de introdução ao Java.
Cada short segue o formato **gancho → roteiro → dica**.

- **Dados**: `trilha/content/shorts.js` (fonte única) e `../remotion/src/java-shorts/shorts.ts` (espelho para render).
- **Player**: no topo do hub da trilha (`index.html`), toca a versão animada e encaixa o MP4 quando renderizado.
- **Render**: pelo projeto Remotion (ver `docs/shorts/RENDER.md`).

---

## Short 1 · O que torna o Java especial?

**Gancho:** Por que aprender Java em 2024?

**Roteiro:**
- Java é fortemente tipada e orientada a objetos: sua lógica gira em torno de classes e objetos.
- O tipo de uma variável nunca muda durante a execução: menos surpresa, mais segurança.
- E é independente de plataforma: escreva uma vez, rode em qualquer sistema, graças à JVM.

**Código:** `System.out.println("Olá, mundo!");`

**Dica:** Java é portabilidade e segurança.

---

## Short 2 · Classe e objeto: o molde e a peça

**Gancho:** Qual a diferença entre classe e objeto?

**Roteiro:**
- A classe é o molde: define quais dados e comportamentos algo vai ter.
- O objeto é a peça feita a partir do molde, com valores próprios.
- De uma classe Carro você cria mil objetos carro, cada um com sua cor e placa.

**Código:** `Carro meu = new Carro("preto");`

**Dica:** Classe é a receita; objeto é o bolo.

---

## Short 3 · Os 8 tipos primitivos

**Gancho:** Quantos tipos básicos o Java tem?

**Roteiro:**
- São 8 primitivos: byte, short, int, long, float, double, boolean e char.
- Cada um é uma gaveta de tamanho fixo: int guarda inteiros, double guarda decimais.
- Eles não são objetos: são o valor cru, rápidos e diretos.

**Código:** `int idade = 30; double preco = 9.90;`

**Dica:** Na dúvida entre inteiros, use int.

---

## Short 4 · Variáveis e tipagem forte

**Gancho:** Por que o Java não deixa misturar tipos?

**Roteiro:**
- Toda variável declara o seu tipo, e ele não muda: isso é tipagem forte.
- Um int guarda inteiro; tentar pôr um texto ali nem compila.
- O compilador vira sua rede de segurança: pega o erro antes de rodar.

**Código:** `int n = 10; n = "dez"; // não compila`

**Dica:** Erro na compilação é melhor que erro em produção.

---

## Short 5 · Métodos: o que os objetos fazem

**Gancho:** Onde mora o comportamento no Java?

**Roteiro:**
- Método é uma ação que o objeto sabe executar, com nome de verbo.
- Ele recebe parâmetros, faz algo e pode devolver um resultado.
- Todo programa começa pelo método main: a porta de entrada.

**Código:** `public static void main(String[] args) { }`

**Dica:** Classe é substantivo; método é verbo.

---

## Short 6 · Decisões: if, else e ternário

**Gancho:** Como o Java toma decisões?

**Roteiro:**
- O if executa um bloco só quando a condição é verdadeira; o else cobre o resto.
- Para escolhas rápidas existe o ternário: condição, valor se sim, valor se não.
- E o switch moderno decide entre vários casos sem repetir if.

**Código:** `String r = (idade >= 18) ? "adulto" : "menor";`

**Dica:** Ternário é um if de uma linha.

---

## Short 7 · Laços: repetir sem repetir código

**Gancho:** Como repetir uma ação mil vezes?

**Roteiro:**
- O for repete com um contador conhecido: início, condição e passo.
- O while repete enquanto uma condição for verdadeira.
- E o for-each percorre uma coleção inteira, item por item.

**Código:** `for (int i = 0; i < 10; i++) { }`

**Dica:** Contador conhecido? for. Condição aberta? while.

---

## Short 8 · == vs equals: a pegadinha nº 1

**Gancho:** Por que "Java" == "Java" pode dar false?

**Roteiro:**
- O == compara referências: se é o mesmo objeto na memória.
- O equals compara o conteúdo: se o valor é igual.
- Para textos e objetos, use sempre equals; o == engana.

**Código:** `a.equals(b); // conteúdo — a == b; // referência`

**Dica:** Compare objetos com equals, nunca com ==.

---

## Estrutura de tempo de cada short (30s · 900 frames a 30fps)

| Trecho | Tempo | Frames |
|--------|-------|--------|
| Gancho (pergunta) | 0s – 4s | 0 – 120 |
| Beat 1 do roteiro | 4s – 11s | 120 – 330 |
| Beat 2 | 11s – 18s | 330 – 540 |
| Beat 3 + código | 18s – 26s | 540 – 780 |
| Dica (fecho) | 26s – 30s | 780 – 900 |
