// Teste de regressão da Fase 0.5 (PRODUCTION_AUDIT.md item 14, TAREFA 3):
// mediaCharacterVideo() (media-catalog.js) não passava characterId por
// mediaFileName() como toda outra função media*() deste arquivo -- um
// characterId com maiúscula/acento/espaço geraria um caminho não
// normalizado, incompatível com filesystem case-sensitive (GitHub Pages),
// repetindo o mesmo tipo de incidente que já ocorreu com 164 arquivos de
// áudio (ver docs/DECISOES.md).
//
// Não havia bug ATIVO: os 87 valores reais de `character` já são
// minúsculos/sem acento/espaço/ç. Este teste confirma as duas coisas:
// (1) que continua assim pro banco real (retrocompatibilidade -- nenhum
// asset precisou ser renomeado); (2) que a função agora normaliza de
// verdade um characterId "sujo" hipotético, fechando o risco futuro.

const { JSDOM, VirtualConsole } = require('jsdom');
let html = require('./_util/load_app_html').loadAppHtml();

const testScript = `
<script>
let ok=0, fail=0;
function check(l,c){ if(c) ok++; else { fail++; console.log("FAIL: " + l); } }

/* ---------- 1) retrocompatibilidade: banco real de 87 palavras não muda
   de caminho (mediaFileName é idempotente pra todo characterId já em uso) ---------- */
const semNormalizar = WORDS.map(w => "assets/video/personagens/" + w.character + "/" + w.character + "-intro.mp4");
const comNormalizar = WORDS.map(w => mediaCharacterVideo(w.character, "intro"));
check("caminho de vídeo de TODAS as 87 palavras é idêntico ao esperado sem normalização (nenhum asset real precisa ser renomeado)", JSON.stringify(semNormalizar) === JSON.stringify(comNormalizar));
check("nenhum caminho gerado tem maiúscula, espaço ou acento (banco real já limpo)", comNormalizar.every(p => p === p.toLowerCase() && !/[\\s\\u00C0-\\u024F]/.test(p.replace("assets/video/personagens/",""))));

/* ---------- 2) o risco que a auditoria apontou: characterId "sujo"
   hipotético agora É normalizado (antes da correção, ia cru pro caminho) ---------- */
check("characterId com maiúscula é normalizado pra minúsculo", mediaCharacterVideo("Vaca", "intro") === "assets/video/personagens/vaca/vaca-intro.mp4");
check("characterId com acento é normalizado (NFD, mesma regra de mediaFonetica/mediaLiaVoice)", mediaCharacterVideo("jacaré", "intro") === "assets/video/personagens/jacare/jacare-intro.mp4");
check("characterId com espaço vira hífen (mesma regra das demais funções media*)", mediaCharacterVideo("pé de moleque", "intro") === "assets/video/personagens/pe-de-moleque/pe-de-moleque-intro.mp4");
check("mediaCharacterSound normaliza characterId do mesmo jeito", mediaCharacterSound("Vaca", "muu") === "assets/audio/personagens/vaca/muu.mp3");

/* ---------- 3) consistência com as demais funções media*(): todas usam a
   mesma normalização, então nenhuma decide sozinha um caminho diferente ---------- */
check("mediaCharacterVideo e mediaFonetica normalizam maiúscula do mesmo jeito", mediaCharacterVideo("VACA","intro").includes("/vaca/") && mediaFonetica("palavra","VACA").endsWith("/vaca.mp3"));

console.log("RESULT: " + ok + " passed, " + fail + " failed");
</script>
`;

html = html.replace('</body>', testScript + '</body>');

const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (msg)=> console.log(msg));
virtualConsole.on('error', ()=>{});
virtualConsole.on('jsdomError', ()=>{});

new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
