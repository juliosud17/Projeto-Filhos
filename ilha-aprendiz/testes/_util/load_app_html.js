// Helper compartilhado de carregamento do app para toda a suite de testes.
//
// Resolve duas coisas de uma vez:
// 1. O caminho fixo `/tmp/ilha_aprendiz.html` que a suite inteira usava antes
//    (pendencia registrada em docs/ARQUITETURA.md) -- agora le direto do
//    repositorio, sem depender de copiar o arquivo pra /tmp.
// 2. A modularizacao do app em varios arquivos (css/, data/, js/) -- os
//    testes continuam recebendo UMA STRING HTML com tudo inline, exatamente
//    como recebiam do arquivo unico antes. Este helper "achata" de volta
//    qualquer <link rel="stylesheet" href="..."> e <script src="..."> local
//    (classico, sem type="module") para dentro do proprio HTML antes de
//    devolver -- o resto de cada teste (que faz html.replace('</body>', ...)
//    e joga em jsdom) nao precisa saber que o app virou multi-arquivo.
//
// Se o app nunca for modularizado, este helper e so um readFileSync com o
// caminho certo. Se for, continua funcionando sem tocar nos 29 arquivos de
// teste de novo.

const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '..', '..', 'app');
const APP_HTML = path.join(APP_DIR, 'ilha_aprendiz.html');

function isLocalRef(ref) {
  return ref && !/^https?:\/\//i.test(ref) && !ref.startsWith('//');
}

function inlineStylesheets(html) {
  return html.replace(
    /<link\s+rel=["']stylesheet["']\s+href=["']([^"']+)["']\s*\/?>/gi,
    (match, href) => {
      if (!isLocalRef(href)) return match;
      const css = fs.readFileSync(path.join(APP_DIR, href), 'utf8');
      return `<style>\n${css}\n</style>`;
    }
  );
}

function inlineScripts(html) {
  return html.replace(
    /<script\s+src=["']([^"']+)["']\s*><\/script>/gi,
    (match, src) => {
      if (!isLocalRef(src)) return match;
      const js = fs.readFileSync(path.join(APP_DIR, src), 'utf8');
      return `<script>\n${js}\n</script>`;
    }
  );
}

function loadAppHtml() {
  let html = fs.readFileSync(APP_HTML, 'utf8');
  html = inlineStylesheets(html);
  html = inlineScripts(html);
  return html;
}

module.exports = { loadAppHtml, APP_HTML, APP_DIR };
