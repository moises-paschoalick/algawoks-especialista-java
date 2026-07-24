/**
 * Monaco Editor via CDN, com queda para <textarea> se não houver rede.
 * Mesma configuração usada no CardEditor do memrise (tema vs-dark, sem minimap).
 */
const Editor = (() => {
  const CDN = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs';
  let carregando = null;

  function carregarMonaco() {
    if (carregando) return carregando;

    carregando = new Promise((resolve, reject) => {
      if (window.monaco) return resolve(window.monaco);

      const script = document.createElement('script');
      script.src = `${CDN}/loader.js`;
      script.onerror = () => reject(new Error('CDN do Monaco indisponível'));
      script.onload = () => {
        window.require.config({ paths: { vs: CDN } });
        window.require(['vs/editor/editor.main'], () => resolve(window.monaco), reject);
      };
      document.head.appendChild(script);

      setTimeout(() => reject(new Error('timeout ao carregar o Monaco')), 8000);
    });

    return carregando;
  }

  function fallback(host, valor) {
    const ta = document.createElement('textarea');
    ta.className = 'editor-fallback';
    ta.spellcheck = false;
    ta.value = valor;
    host.innerHTML = '';
    host.appendChild(ta);
    return { getValue: () => ta.value, setValue: v => { ta.value = v; }, foco: () => ta.focus() };
  }

  /**
   * Cria um editor dentro de `host`. Resolve sempre — com Monaco ou com textarea.
   * @returns {Promise<{getValue:Function, setValue:Function, foco:Function}>}
   */
  async function criar(host, { valor = '', linguagem = 'java' } = {}) {
    try {
      const monaco = await carregarMonaco();
      host.innerHTML = '';
      const ed = monaco.editor.create(host, {
        value: valor,
        language: linguagem,
        theme: 'vs-dark',
        fontSize: 13,
        lineNumbers: 'on',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        renderLineHighlight: 'none',
        padding: { top: 12, bottom: 12 },
      });
      return {
        getValue: () => ed.getValue(),
        setValue: v => ed.setValue(v),
        foco: () => ed.focus(),
      };
    } catch {
      return fallback(host, valor);
    }
  }

  return { criar };
})();
