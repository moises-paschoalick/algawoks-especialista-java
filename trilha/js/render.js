/**
 * Renderização de conteúdo — compartilhada pela página de teoria e pela lição.
 * O conteúdo é autorado como blocos ({p}, {h}, {ul}, {code}, {tabela}, {nota})
 * para que o realce de sintaxe e o mini-markdown fiquem centralizados aqui.
 */
const Render = (() => {

  const escapar = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const PALAVRAS = [
    'abstract','assert','boolean','break','byte','case','catch','char','class','const','continue',
    'default','do','double','else','enum','extends','final','finally','float','for','if','implements',
    'import','instanceof','int','interface','long','native','new','package','private','protected',
    'public','record','return','sealed','short','static','strictfp','super','switch','synchronized',
    'this','throw','throws','transient','try','var','void','volatile','while','yield','permits',
    'true','false','null','String','List','Map','Set','Optional','Stream',
  ];

  const TOKEN = new RegExp(
    '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)' +   // 1 comentário
    '|("(?:\\\\.|[^"\\\\])*")' +                  // 2 string
    '|(@\\w+)' +                                   // 3 anotação
    `|\\b(${PALAVRAS.join('|')})\\b`,              // 4 palavra-chave
    'g'
  );

  /** Realce de Java em um passe único — nada de reprocessar HTML já gerado. */
  function realce(src) {
    return escapar(src).replace(TOKEN, (m, com, str, ann, kw) => {
      if (com) return `<span class="cm">${com}</span>`;
      if (str) return `<span class="st">${str}</span>`;
      if (ann) return `<span class="an">${ann}</span>`;
      return `<span class="kw">${kw}</span>`;
    });
  }

  /** Mini-markdown inline: **negrito** e `código`. */
  function inline(txt) {
    return escapar(txt)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  function bloco(b) {
    if (b.h)    return `<h3 id="${slug(b.h)}">${inline(b.h)}</h3>`;
    if (b.p)    return `<p>${inline(b.p)}</p>`;
    if (b.ul)   return `<ul>${b.ul.map(i => `<li>${inline(i)}</li>`).join('')}</ul>`;
    if (b.ol)   return `<ol>${b.ol.map(i => `<li>${inline(i)}</li>`).join('')}</ol>`;
    if (b.code) return `<pre class="code">${realce(b.code)}</pre>`;
    if (b.nota) return `<div class="note">${inline(b.nota)}</div>`;
    if (b.tabela) {
      const { head, rows } = b.tabela;
      return `<table>
        <thead><tr>${head.map(h => `<th>${inline(h)}</th>`).join('')}</tr></thead>
        <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>`;
    }
    return '';
  }

  const corpo = blocos => (blocos || []).map(bloco).join('');

  function slug(txt) {
    return String(txt).toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  /** Caixa apontando para o módulo do curso — onde está o vídeo e o código commitado. */
  function refModulo(numeros, { compacto = false } = {}) {
    return [].concat(numeros).map(m => `
      <div class="modref">
        <div class="modref-icon">📹</div>
        <div class="modref-body">
          <b>Módulo ${m} — ${Curso.nome(m)}</b>
          ${compacto ? '' : 'Reveja a aula se travar em algum ponto. Seu código deste módulo está em:'}
          <div class="modref-path">${Curso.pasta(m)}/</div>
        </div>
      </div>`).join('');
  }

  function refDoc(licao) {
    return `
      <div class="modref" style="border-left-color:var(--purple)">
        <div class="modref-icon">📄</div>
        <div class="modref-body">
          <b>Teoria completa em markdown</b>
          <a href="${Curso.docBase}${licao.unidade.doc}" target="_blank">${licao.unidade.doc}</a>
          — a página de referência deste tema.
        </div>
      </div>`;
  }

  return { escapar, realce, inline, bloco, corpo, slug, refModulo, refDoc };
})();
