#!/usr/bin/env node
/**
 * CLI da esteira de aulas guiadas. Ver docs/metodologia/README.md.
 *
 *   node tools/aula.mjs catalogo        gera docs/metodologia/ROTEIROS.md a partir de roteiros.json
 *   node tools/aula.mjs nova <aulaId>   monta o esqueleto de uma aula (etapa 5: scaffold) e fia na tela
 *   node tools/aula.mjs checar          roda o teste/revisao (Definition of Done) em todas as aulas
 *
 * Sem dependencias externas.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const TOOLS = path.dirname(fileURLToPath(import.meta.url));
const TRILHA = path.resolve(TOOLS, '..');
const RAIZ = path.resolve(TRILHA, '..');
const dados = JSON.parse(fs.readFileSync(path.join(TOOLS, 'roteiros.json'), 'utf8'));
const ROTEIROS = dados.roteiros;

const P = {
  aulaHtml: path.join(TRILHA, 'aula.html'),
  content: (id) => path.join(TRILHA, 'content', `aula-${id}.js`),
  catalogo: path.join(RAIZ, 'docs', 'metodologia', 'ROTEIROS.md'),
  docAula: (id) => path.join(RAIZ, 'docs', 'metodologia', 'aulas', `${id}.md`),
  template: path.join(RAIZ, 'docs', 'metodologia', 'TEMPLATE-aula.md'),
};

const ICONE = { alta: '🔴', media: '🟡', base: '🟢' };
const ler = (f) => fs.readFileSync(f, 'utf8');
const existe = (f) => fs.existsSync(f);

/* ------------------------------------------------------------ catalogo */

function catalogo() {
  const porUnidade = {};
  for (const r of ROTEIROS) (porUnidade[r.unidade] ||= []).push(r);

  const prontas = ROTEIROS.filter((r) => r.status === 'pronta').length;
  let md = `# Roteiros de todas as aulas\n\n`;
  md += `> Gerado por \`tools/aula.mjs catalogo\` a partir de \`tools/roteiros.json\`. Nao edite a mao.\n`;
  md += `> Saida das etapas 1-2 da esteira (pedagogia + especialista Java). Ver [metodologia](README.md).\n\n`;
  md += `**${prontas} de ${ROTEIROS.length} aulas prontas.**\n\n`;

  for (const [unidade, lista] of Object.entries(porUnidade)) {
    md += `## ${unidade}\n\n`;
    for (const r of lista) {
      const marca = r.status === 'pronta' ? '✅' : '☐';
      md += `### ${marca} ${ICONE[r.prioridade]} ${r.titulo} \`${r.aulaId}\`\n\n`;
      md += `- **Lição / módulo**: \`${r.licaoId}\` · módulo ${r.modulo}\n`;
      md += `- **Conceito nuclear**: ${r.conceito}\n`;
      md += `- **Analogia central**: ${r.analogia}\n`;
      md += `- **Arco**: ${r.arco.map((b, i) => `${i + 1}. ${b}`).join(' ')}\n`;
      md += `- **Pegadinha de entrevista**: ${r.pegadinha}\n\n`;
    }
  }
  fs.writeFileSync(P.catalogo, md);
  console.log(`✓ catálogo gerado: ${path.relative(RAIZ, P.catalogo)} (${ROTEIROS.length} roteiros)`);
}

/* ---------------------------------------------------------------- nova */

function gerarEsqueleto(r) {
  // uma cena por beat do arco, entre intro e recap; o dev preenche cada palco
  const cenas = r.arco.map((beat, i) => `
    /* ---- cena ${i + 2}: ${beat} ---- */
    {
      fala: [
        'TODO fala: ${beat.replace(/'/g, '')}',
      ],
      interativo: true,      // TODO: false se for cena expositiva
      dica: 'TODO instrução da interação',
      palco(host, api) {
        host.innerHTML = \`
          <div class="analogia">
            <div class="analogia-titulo">Mundo real</div>
            <div class="analogia-cena"><div class="grande">🧩</div><div>TODO analogia visual</div></div>
          </div>
          <div class="palco-titulo">${r.titulo}</div>\`;
        // TODO: montar o palco desta cena; chamar api.pronto(...) ao fim da interação.
        // Componentes: api.codigo(src), api.som(nome), api.reagir(emocao), api.registrarResposta(certo)
        api.pronto('TODO mensagem ao liberar o avanço');
      },
    },`).join('\n');

  return `/**
 * Aula guiada · ${r.titulo} (módulo ${r.modulo} · lição ${r.licaoId})
 *
 * ESQUELETO gerado por tools/aula.mjs. Preencha cada cena seguindo a esteira.
 * Roteiro (etapa 1-2): ${r.conceito}
 * Analogia: ${r.analogia}
 * Regra: analogia do mundo real ANTES do conceito; nome técnico só após a descoberta.
 */
Aula.registrar({
  id: '${r.aulaId}',
  licao: '${r.licaoId}',
  titulo: 'TODO título curto e vívido',
  personagem: { nome: 'Bean' },
  fechamento: 'TODO frase de fechamento',

  cenas: [

    /* ---- cena 1: intro ---- */
    {
      fala: [
        'TODO abertura do Bean, apresentando o tema.',
      ],
      palco(host, api) {
        host.innerHTML = \`
          <div style="text-align:center">
            <div class="analogia" style="margin:0 auto 16px; max-width:440px">
              <div class="analogia-titulo">A ideia de hoje</div>
              <div class="analogia-cena"><div class="grande">🧩</div><div>TODO imagem central</div></div>
            </div>
            <div class="palco-titulo">Módulo ${r.modulo} · ${r.unidade}</div>
          </div>\`;
      },
    },
${cenas}

    /* ---- cena ${r.arco.length + 2}: recap ---- */
    {
      fala: ['Fechou! Guarde estas imagens.'],
      emocao: 'feliz',
      palco(host, api) {
        host.innerHTML = \`<div class="palco-titulo">O que ficou</div>
          <div class="note">TODO 6 cartões de recap</div>\`;
      },
    },
  ],
});
`;
}

function docDaAula(r) {
  let doc = ler(P.template);
  doc = doc.replace('# Aula · <título> `<id>`', `# Aula · ${r.titulo} \`${r.aulaId}\``);
  doc = doc.replace('`<licao-id>` (ex.: `oop-encapsulamento`)', `\`${r.licaoId}\``);
  doc = doc.replace('| Unidade | <n. nome> |', `| Unidade | ${r.unidade} |`);
  doc = doc.replace('| Módulo do curso | <n. nome da pasta> |', `| Módulo do curso | ${r.modulo} |`);
  doc = doc.replace('| Prioridade | 🔴 / 🟡 / 🟢 |', `| Prioridade | ${ICONE[r.prioridade]} |`);
  return doc;
}

function fiar(r) {
  // 1. <script> em aula.html, antes do comentario "roteiros das aulas guiadas"
  let html = ler(P.aulaHtml);
  const tag = `<script src="content/aula-${r.aulaId}.js"></script>`;
  if (!html.includes(tag)) {
    const marca = '<!-- roteiros das aulas guiadas -->';
    html = html.replace(marca, `${marca}\n${tag}`);
    fs.writeFileSync(P.aulaHtml, html);
    console.log(`  ✓ fiado em aula.html`);
  } else {
    console.log(`  · já estava em aula.html`);
  }

  // 2. marca aula: '<id>' na licao, no page*.js correto
  const pages = fs.readdirSync(path.join(TRILHA, 'content')).filter((f) => /^page\d+/.test(f));
  for (const pg of pages) {
    const fp = path.join(TRILHA, 'content', pg);
    let src = ler(fp);
    const alvo = `      id: '${r.licaoId}',`;
    if (src.includes(alvo) && !src.includes(`aula: '${r.aulaId}'`)) {
      src = src.replace(alvo, `${alvo}\n      aula: '${r.aulaId}',   // aula guiada em aula.html?id=${r.aulaId}`);
      fs.writeFileSync(fp, src);
      console.log(`  ✓ lição marcada em content/${pg}`);
      return;
    }
    if (src.includes(`aula: '${r.aulaId}'`)) { console.log(`  · lição já marcada`); return; }
  }
  console.log(`  ! lição ${r.licaoId} não encontrada para marcar (marque à mão)`);
}

function nova(aulaId) {
  const r = ROTEIROS.find((x) => x.aulaId === aulaId);
  if (!r) return erro(`roteiro '${aulaId}' não existe em roteiros.json`);
  if (existe(P.content(aulaId))) return erro(`content/aula-${aulaId}.js já existe`);

  fs.writeFileSync(P.content(aulaId), gerarEsqueleto(r));
  console.log(`✓ esqueleto: ${path.relative(RAIZ, P.content(aulaId))}`);

  if (!existe(P.docAula(aulaId))) {
    fs.writeFileSync(P.docAula(aulaId), docDaAula(r));
    console.log(`✓ doc da esteira: ${path.relative(RAIZ, P.docAula(aulaId))}`);
  }

  fiar(r);
  console.log(`\nPróximo: preencha as ${r.arco.length + 2} cenas seguindo o roteiro, depois:`);
  console.log(`  node tools/aula.mjs checar`);
}

/* -------------------------------------------------------------- checar */

function contar(src, alvo) {
  return src.split(alvo).length - 1;
}

function checarUma(r) {
  const fp = P.content(r.aulaId);
  const falhas = [];
  if (!existe(fp)) return { aulaId: r.aulaId, status: r.status, existe: false, falhas: ['arquivo não existe'] };

  const src = ler(fp);
  // node --check
  try { execSync(`node --check ${JSON.stringify(fp)}`, { stdio: 'pipe' }); }
  catch { falhas.push('node --check falhou'); }

  const cenas = contar(src, 'palco(host');
  if (cenas < 10 || cenas > 14) falhas.push(`${cenas} cenas (esperado 10-14)`);

  const analogias = contar(src, 'analogia-titulo');
  if (analogias < 3) falhas.push(`${analogias} analogias (esperado >= 3)`);

  const avaliacoes = contar(src, 'registrarResposta');
  if (avaliacoes < 3) falhas.push(`${avaliacoes} avaliações (esperado >= 3)`);

  if (contar(src, '—') > 0) falhas.push('contém travessão');
  if (contar(src, 'TODO') > 0) falhas.push('contém TODO (esqueleto não preenchido)');

  const html = ler(P.aulaHtml);
  if (!html.includes(`content/aula-${r.aulaId}.js`)) falhas.push('não fiado em aula.html');

  const pages = fs.readdirSync(path.join(TRILHA, 'content')).filter((f) => /^page\d+/.test(f));
  const marcada = pages.some((pg) => ler(path.join(TRILHA, 'content', pg)).includes(`aula: '${r.aulaId}'`));
  if (!marcada) falhas.push('lição não marcada com aula:');

  return { aulaId: r.aulaId, status: r.status, existe: true, cenas, analogias, avaliacoes, falhas };
}

function checar() {
  const alvo = ROTEIROS.filter((r) => existe(P.content(r.aulaId)) || r.status === 'pronta');
  console.log(`Revisão automática (Definition of Done) · ${alvo.length} aulas\n`);
  let ok = 0;
  for (const r of alvo) {
    const res = checarUma(r);
    const marca = res.falhas.length === 0 ? '✅' : '❌';
    if (res.falhas.length === 0) ok++;
    const info = res.existe ? `${res.cenas} cenas, ${res.analogias} analogias, ${res.avaliacoes} aval.` : '';
    console.log(`${marca} ${res.aulaId.padEnd(22)} ${info}`);
    res.falhas.forEach((f) => console.log(`     - ${f}`));
  }
  console.log(`\n${ok}/${alvo.length} aulas passaram na revisão.`);
  if (ok < alvo.length) process.exitCode = 1;
}

/* --------------------------------------------------------------- main */

function erro(msg) { console.error(`✗ ${msg}`); process.exitCode = 1; }
function uso() {
  console.log(`Esteira de aulas guiadas\n
  node tools/aula.mjs catalogo        gera docs/metodologia/ROTEIROS.md
  node tools/aula.mjs nova <aulaId>   monta o esqueleto de uma aula e fia na tela
  node tools/aula.mjs checar          roda a revisão (Definition of Done) em todas

Roteiros disponíveis (status planejado):`);
  ROTEIROS.filter((r) => r.status !== 'pronta').forEach((r) =>
    console.log(`  ${ICONE[r.prioridade]} ${r.aulaId.padEnd(22)} ${r.titulo}`));
}

const [cmd, arg] = process.argv.slice(2);
if (cmd === 'catalogo') catalogo();
else if (cmd === 'nova' && arg) nova(arg);
else if (cmd === 'checar') checar();
else uso();
