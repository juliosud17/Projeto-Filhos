// QA da Fase 2 (migração controlada para Vite): valida a SAÍDA de
// `npm run build`, sem depender de jsdom -- usa só `fs`/`path` do Node.
// Motivo de não usar jsdom aqui (diferente do resto de testes/): este
// script precisa rodar em qualquer máquina, inclusive nas onde
// `require('jsdom')` trava (ver docs/VITE_MIGRATION_CHECKLIST.md,
// PASSO 9), então fica deliberadamente livre dessa dependência.
//
// Pré-requisito: rodar `npm run build` ANTES deste script (ele só lê
// dist/, não builda sozinho -- mantém a mesma convenção do resto da
// suíte, que também não builda nada, só verifica).
//
// O que valida:
// 1. dist/ existe e não está vazio (build de fato rodou).
// 2. dist/index.html existe (entry point mínimo, redireciona pro app real).
// 3. dist/ilha_aprendiz.html existe E é byte-idêntico ao app/ilha_aprendiz.html
//    de origem -- garante que o build NÃO alterou o app real (publicDir
//    é passthrough puro, ver vite.config.mjs).
// 4. Os 24 <script src> aparecem em dist/ilha_aprendiz.html, na MESMA
//    ordem documentada em docs/RUNTIME_DEPENDENCIES.md.
// 5. Exatamente 1 <script type="module"> em dist/ilha_aprendiz.html:
//    somente supabase-client.js (Fase 4.3). Os 24 scripts clássicos
//    permanecem sem type="module".
// 6. css/app.css existe em dist/ e é idêntico ao de origem.
// 7. Assets críticos existem em dist/ (amostra: mapa da Ilha das Letras;
//    demais assets de mídia dependem do que estiver fisicamente presente
///    em app/assets/ no ambiente onde o build rodou -- não é listado
//    exaustivamente aqui pelo mesmo motivo de qa_test_assets_qa.js).

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APP_HTML = path.join(ROOT, 'app', 'ilha_aprendiz.html');
const APP_CSS = path.join(ROOT, 'app', 'css', 'app.css');
const DIST = path.join(ROOT, 'dist');
const DIST_HTML = path.join(DIST, 'ilha_aprendiz.html');
const DIST_CSS = path.join(DIST, 'css', 'app.css');
const DIST_INDEX = path.join(DIST, 'index.html');

let ok = 0, fail = 0;
function check(label, cond) {
  if (cond) ok++;
  else { fail++; console.log('FAIL: ' + label); }
}

const EXPECTED_SCRIPT_ORDER = [
  'data/icones.js', 'data/portugues-conteudo.js', 'data/emoji-visuais.js',
  'data/registro-modulos.js', 'data/portugues-atividades.js', 'data/matematica-atividades.js',
  'data/mapa-portugues.js', 'data/projeto-leitor.js', 'js/mastery.js', 'js/ritmo-bimestre.js',
  'js/navigation.js', 'js/mapa-portugues.js', 'js/projeto-leitor.js', 'js/revisao-espacada.js',
  'js/storage.js', 'js/admin.js', 'js/utils.js', 'js/media-catalog.js', 'js/audio-manager.js',
  'data/licoes.js', 'js/teaching-engine.js', 'js/game-loop.js', 'js/activities-portugues.js',
  'js/activities-matematica.js',
];

// dist/ só existe depois de "npm run build" -- este teste é descoberto
// automaticamente por testes/_run_all.js junto com o resto da suíte
// (mesmo padrão de auto-discovery de qa_test_*.js), então "npm test"
// sozinho, sem build antes, não pode virar falha nova: ausência de dist/
// vira aviso (mesma convenção de graceful-skip de qa_test_assets_qa.js
// pra app/assets/ ausente), não FAIL. Rode "npm run build && npm test"
// (ou só este arquivo depois do build) pra validação de verdade.
const distExists = fs.existsSync(DIST);
if (!distExists) {
  console.log('--- aviso (não conta como falha): dist/ não existe neste ambiente -- rode "npm run build" antes deste teste pra validação real da saída do Vite.');
  console.log('RESULT: ' + ok + ' passed, ' + fail + ' failed');
  process.exit(0);
}
check('dist/ existe e o build foi executado', distExists);

check('dist/index.html existe (entry point mínimo)', fs.existsSync(DIST_INDEX));
check('dist/ilha_aprendiz.html existe (app real copiado)', fs.existsSync(DIST_HTML));

if (fs.existsSync(DIST_HTML) && fs.existsSync(APP_HTML)) {
  const distHtml = fs.readFileSync(DIST_HTML, 'utf8');
  const srcHtml = fs.readFileSync(APP_HTML, 'utf8');
  check('dist/ilha_aprendiz.html é byte-idêntico ao app/ilha_aprendiz.html de origem (build não alterou o app)', distHtml === srcHtml);

  const foundScripts = [...distHtml.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
  check('24 <script src> encontrados em dist/ilha_aprendiz.html', foundScripts.length === 24);
  check('ordem dos <script src> em dist/ bate com docs/RUNTIME_DEPENDENCIES.md',
    JSON.stringify(foundScripts) === JSON.stringify(EXPECTED_SCRIPT_ORDER));
  if (JSON.stringify(foundScripts) !== JSON.stringify(EXPECTED_SCRIPT_ORDER)) {
    console.log('  esperado: ' + JSON.stringify(EXPECTED_SCRIPT_ORDER));
    console.log('  encontrado: ' + JSON.stringify(foundScripts));
  }

  const moduleScripts = (distHtml.match(/type=["']module["']/g) || []);
  check('exatamente 1 <script type="module"> (supabase-client.js) em dist/ilha_aprendiz.html',
    moduleScripts.length === 1 && /supabase-client\.js/.test(distHtml));
}

if (fs.existsSync(DIST_CSS) && fs.existsSync(APP_CSS)) {
  check('dist/css/app.css é byte-idêntico ao de origem', fs.readFileSync(DIST_CSS, 'utf8') === fs.readFileSync(APP_CSS, 'utf8'));
} else {
  check('dist/css/app.css existe', fs.existsSync(DIST_CSS));
}

// Amostra de assets críticos -- se app/assets/maps existir no ambiente
// (varia por máquina, ver qa_test_assets_qa.js), confere que o build
// copiou. Não falha se app/assets/ não existir aqui (ambiente sem os
// binários reais) -- mesma lógica de graceful-skip já usada em
// qa_test_assets_qa.js.
const MAPA_SRC = path.join(ROOT, 'app', 'assets', 'maps', 'ilha-das-letras.webp');
const MAPA_DIST = path.join(DIST, 'assets', 'maps', 'ilha-das-letras.webp');
if (fs.existsSync(MAPA_SRC)) {
  check('mapa da Ilha das Letras (app/assets/maps/ilha-das-letras.webp) presente em dist/', fs.existsSync(MAPA_DIST));
  if (fs.existsSync(MAPA_DIST)) {
    check('mapa em dist/ tem o mesmo tamanho de bytes do original (cópia binária íntegra)',
      fs.statSync(MAPA_SRC).size === fs.statSync(MAPA_DIST).size);
  }
} else {
  console.log('--- aviso (não conta como falha): app/assets/maps/ilha-das-letras.webp não encontrado neste ambiente -- pulei a checagem de cópia de asset. Rode dentro do projeto real pra checagem de verdade.');
}

console.log('RESULT: ' + ok + ' passed, ' + fail + ' failed');
process.exit(fail > 0 ? 1 : 0);
