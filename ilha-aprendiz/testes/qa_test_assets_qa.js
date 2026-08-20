// QA de nomenclatura/existência de assets de mídia (Fase 0.5,
// PRODUCTION_AUDIT.md itens 3/14/25, TAREFA 6): script simples, sem
// dependência nova (só `fs`/`path` do Node + jsdom já usado no resto da
// suíte), pra detectar exatamente a classe de bug que já causou um
// incidente real em produção -- 164 arquivos de áudio `.MP3` funcionando
// no Windows (case-insensitive) e dando 404 no GitHub Pages
// (case-sensitive), ver docs/DECISOES.md.
//
// Duas checagens independentes:
//
// 1) NOMENCLATURA: todo arquivo/pasta dentro de app/assets/ deve ser
//    minúsculo, sem espaço, sem acento, sem "ç" -- convenção documentada em
//    docs/audio/MEDIA_GUIDELINES.md. Varre o disco de verdade (fs real),
//    não confia em nenhum dado do app.
//
// 2) REFERÊNCIA x ARQUIVO REAL: pra cada palavra do banco (WORDS,
//    app/data/portugues-conteudo.js), calcula o caminho de vídeo/fonética
//    que o app REALMENTE pede em runtime (via mediaCharacterVideo/
//    mediaFonetica, app/js/media-catalog.js) e confere se existe um
//    arquivo com ESSE MESMO NOME, exatamente com essa caixa -- não só "um
//    arquivo parecido". Um match só por case-insensitive é reportado como
//    achado (funcionaria no Windows, quebraria em hosting Linux), não como
//    sucesso.
//
// Não corrige nada sozinho -- só reporta. Decidir o que fazer com cada
// achado (renomear, mover pra _a_revisar, ignorar) é decisão humana, fora
// do escopo desta Fase 0.5 (ver PRODUCTION_AUDIT.md, "não altere código
// nesta fase" -- este script É o código da fase, os ASSETS que ele aponta
// não são tocados).

const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const APP_DIR = path.join(__dirname, '..', 'app');
const ASSETS_DIR = path.join(APP_DIR, 'assets');

let ok = 0, fail = 0, warnings = [];
function check(l, c){ if(c) ok++; else { fail++; console.log("FAIL: " + l); } }
function warn(msg){ warnings.push(msg); }

/* ---------- 1) nomenclatura: varredura real do disco ---------- */
const NAMING_ISSUES = []; // {relPath, tipo: 'maiuscula'|'espaco'|'acento'|'cedilha'}

function walk(dir){
  let entries;
  try{ entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch(e){ return; } // app/assets pode não existir neste ambiente de checagem -- tratado depois
  entries.forEach(entry=>{
    const full = path.join(dir, entry.name);
    const rel = path.relative(ASSETS_DIR, full);
    if(/[A-ZÀ-Ý]/.test(entry.name)) NAMING_ISSUES.push({relPath: rel, tipo: 'maiuscula'});
    if(/\s/.test(entry.name)) NAMING_ISSUES.push({relPath: rel, tipo: 'espaco'});
    // acento: qualquer caractere fora do NFD básico depois de tirar letras
    // simples/dígitos/-/_/. -- pega á,é,í,ó,ú,ã,õ,â,ê,ô etc. (maiúsculo já
    // capturado acima, aqui pega também a versão minúscula acentuada)
    if(/[áéíóúâêîôûãõäëïöüàèìòù]/.test(entry.name)) NAMING_ISSUES.push({relPath: rel, tipo: 'acento'});
    if(/[çÇ]/.test(entry.name)) NAMING_ISSUES.push({relPath: rel, tipo: 'cedilha'});
    if(entry.isDirectory()) walk(full);
  });
}

const assetsExist = fs.existsSync(ASSETS_DIR);
// app/assets/ não é aviso condicional de bug -- em ambientes de checagem
// sem os arquivos binários reais (ex.: cópia de trabalho num container sem
// os assets grandes copiados) simplesmente não roda a parte que depende de
// disco, sem contar como falha. No projeto real (rodando via `npm test`
// dentro de D:\10_PROJETO_FILHOS\ilha-aprendiz, como o resto da suíte já
// faz), app/assets/ sempre existe.
if(!assetsExist) warn("app/assets/ não encontrado neste ambiente -- pulei a varredura de nomenclatura/referência (rode este teste dentro do projeto real pra checagem de verdade)");
if(assetsExist){
  walk(ASSETS_DIR);
  // Dedup por relPath (um arquivo pode disparar mais de um tipo, ex. maiúscula E espaço)
  const porArquivo = {};
  NAMING_ISSUES.forEach(i=>{ (porArquivo[i.relPath] = porArquivo[i.relPath] || []).push(i.tipo); });
  const arquivosComProblema = Object.keys(porArquivo);
  check("nenhum arquivo/pasta em app/assets/ viola a convenção de nomenclatura (minúsculo/sem espaço/sem acento/sem ç) -- ver lista abaixo se falhar", arquivosComProblema.length === 0);
  if(arquivosComProblema.length){
    arquivosComProblema.forEach(rel=> console.log("  ACHADO nomenclatura: " + rel + " (" + porArquivo[rel].join(", ") + ")"));
  }
}

/* ---------- 2) referência (dado do app) x arquivo real no disco ---------- */
let html = require('./_util/load_app_html').loadAppHtml();
const captureScript = `
<script>
window.speechSynthesis = { cancel(){}, speak(){} };
window.SpeechSynthesisUtterance = function(t){ this.text=t; };
const videos = WORDS.map(w => ({ character: w.character, path: mediaCharacterVideo(w.character, "intro") }));
const foneticaPalavras = WORDS.map(w => ({ word: w.word, path: mediaFonetica("palavra", w.word) }));
const silabasUnicas = Array.from(new Set(WORDS.flatMap(w => w.syl)));
const foneticaSilabas = silabasUnicas.map(s => ({ silaba: s, path: mediaFonetica("silaba", s) }));
console.log("QA_ASSETS_JSON:" + JSON.stringify({ videos, foneticaPalavras, foneticaSilabas }));
</script>
`;
html = html.replace('</body>', captureScript + '</body>');

let capturedJson = null;
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (msg)=>{
  if(typeof msg === 'string' && msg.indexOf('QA_ASSETS_JSON:') === 0){
    capturedJson = msg.slice('QA_ASSETS_JSON:'.length);
  }
});
virtualConsole.on('jsdomError', ()=>{});
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });

check("consegui extrair os caminhos esperados de mídia a partir do banco real (WORDS + media-catalog.js)", !!capturedJson);

if(capturedJson && assetsExist){
  const expected = JSON.parse(capturedJson);

  // Índice case-insensitive de tudo que existe de verdade em app/assets/,
  // pra distinguir "não existe" de "existe, mas com caixa diferente"
  // (o caso que funcionaria no Windows e quebraria no GitHub Pages).
  const realFilesLower = new Set();
  const realFilesExact = new Set();
  (function indexar(dir){
    let entries;
    try{ entries = fs.readdirSync(dir, { withFileTypes: true }); } catch(e){ return; }
    entries.forEach(entry=>{
      const full = path.join(dir, entry.name);
      const rel = path.relative(ASSETS_DIR, full).split(path.sep).join('/');
      if(entry.isDirectory()) indexar(full);
      else { realFilesExact.add(rel); realFilesLower.add(rel.toLowerCase()); }
    });
  })(ASSETS_DIR);

  function conferirGrupo(nome, itens){
    const faltando = [];
    const caixaErrada = [];
    itens.forEach(item=>{
      const rel = item.path.replace(/^assets\//, "");
      if(realFilesExact.has(rel)) return; // ok, existe exatamente como referenciado
      if(realFilesLower.has(rel.toLowerCase())){ caixaErrada.push(item); return; } // existe, caixa diferente
      faltando.push(item); // não existe de jeito nenhum
    });
    check(nome + ": nenhum arquivo referenciado tem CAIXA diferente do arquivo real (funcionaria no Windows, quebraria no GitHub Pages)", caixaErrada.length === 0);
    if(caixaErrada.length) caixaErrada.forEach(i=> console.log('  ACHADO case-sensitivity (' + nome + '): esperado "' + i.path + '" existe no disco só com outra caixa'));
    if(faltando.length) warn(nome + ": " + faltando.length + " de " + itens.length + " referenciados não têm arquivo real (pode ser produção ainda incompleta, não necessariamente bug -- ver lista)");
    if(faltando.length && faltando.length <= 15) faltando.forEach(i=> console.log("  (info, não falha) ausente (" + nome + "): " + i.path));
  }

  conferirGrupo("vídeo de personagem (87 palavras)", expected.videos);
  conferirGrupo("fonética de palavra (87 palavras)", expected.foneticaPalavras);
  conferirGrupo("fonética de sílaba (bancos únicos)", expected.foneticaSilabas);
}

if(warnings.length){
  console.log("--- avisos (não contam como falha, só informação) ---");
  warnings.forEach(w=> console.log("  " + w));
}

console.log("RESULT: " + ok + " passed, " + fail + " failed");
