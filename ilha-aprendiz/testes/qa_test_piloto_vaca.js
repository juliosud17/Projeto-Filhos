// Testes do piloto VACA: media-catalog.js (paths), integração em
// renderSilabas (personagem/Lia/fonética) e fallback quando a mídia real
// (que ainda não existe no projeto) falha ao carregar/tocar.
//
// Padrão igual ao resto da suíte: jsdom + stubs das APIs de navegador que
// jsdom não implementa (speechSynthesis, AudioContext -- já existentes nos
// outros testes) + stubs NOVOS pra Audio/HTMLMediaElement.play(), que sem
// stub travam o processo (jsdom tenta "de verdade" e nunca resolve) -- não
// é bug do app, é limitação conhecida do jsdom com elementos de mídia.
//
// Vários dos fluxos aqui são assíncronos por natureza (fila de voz, fallback
// otimista pra TTS) -- o teste roda como uma função async com pequenas
// esperas reais, igual a como o navegador de verdade se comportaria.

const { JSDOM, VirtualConsole } = require('jsdom');
let html = require('./_util/load_app_html').loadAppHtml();

const testScript = `
<script>
window.speechSynthesis = { cancel(){}, speak(){} };
window.SpeechSynthesisUtterance = function(t){ this.text=t; };
window.AudioContext = function(){ return { createOscillator(){return {connect(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},start(){},stop(){}} }, createGain(){return {connect(){},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}}} }, destination:{}, currentTime:0 }; };
/* jsdom não implementa reprodução de mídia de verdade -- chamar .play() num
   <video> REAL sem este stub trava o processo indefinidamente. O piloto usa
   <video> real pro personagem (mountCharacterIntro), então este stub é
   necessário mesmo sem tocar em audio-manager.js. Rejeita com um erro
   "genérico" (não NotAllowedError) -- simula o estado real de hoje, onde
   vaca-intro.mp4 simplesmente não existe no projeto ainda. */
window.HTMLMediaElement.prototype.play = function(){ return Promise.reject(new Error("jsdom: arquivo de mídia não existe (stub de teste)")); };
window.HTMLMediaElement.prototype.pause = function(){};
window.HTMLMediaElement.prototype.load = function(){};
/* Audio (voz/SFX) fake -- resolve por microtask, sem tocar rede/arquivo de
   verdade. Qualquer URL falha (mesmo cenário: nenhum MP3 existe ainda). */
window.Audio = function(url){ this._url = url; this._listeners = {}; this.volume = 1; };
window.Audio.prototype.addEventListener = function(evt, cb){ (this._listeners[evt] = this._listeners[evt] || []).push(cb); };
window.Audio.prototype.play = function(){
  const self = this;
  return Promise.resolve().then(()=>{
    (self._listeners.error || []).forEach(cb=>cb());
    throw new Error("simulado: mp3 não existe (estado real do projeto hoje)");
  });
};

let ok=0, fail=0;
function check(l,c){ if(c) ok++; else { fail++; console.log("FAIL: " + l); } }
function wait(ms){ return new Promise(r=>setTimeout(r, ms)); }

let spokenLog = [];
const realSpeak = speak;
window.speak = function(t){ spokenLog.push(t); return realSpeak(t); };
let beepLog = [];
const realBeep = beep;
window.beep = function(kind){ beepLog.push(kind); return realBeep(kind); };

(async function(){

// Estado mínimo de rodada válido (mesmo padrão dos outros arquivos de teste)
// -- evita que o setTimeout(nextRound,...) real de registerAnswer() quebre
// ao tentar ler state.roundPlan[...] quando chamamos as funções do piloto
// diretamente, fora do fluxo completo startGame()->nextRound().
state.game = "silabas";
state.subgames = ["silabas"];
state.round = 1;
state.totalRounds = 1;
state.pools = {};
state.usedSomLetters = new Set();
state.roundPlan = ["silabas"];
state.currentRender = "silabas";
state.roundFirstTryUsed = false;
state.sessionStars = 0;
// registerAnswer() real agenda setTimeout(nextRound,...) -- fora do fluxo
// completo startGame() a transição de rodada não importa pra este teste
// (só a camada de áudio/feedback do piloto), então vira no-op aqui.
window.nextRound = function(){};

/* ---------- 1) media-catalog.js: paths puros, sem heurística de tamanho ---------- */
check("mediaFonetica('silaba','VA') usa a pasta silabas", mediaFonetica("silaba","VA") === "assets/audio/fonetica/silabas/va.mp3");
check("mediaFonetica('silaba','CHA') -- 3 letras, NÃO cai em 'palavras' (prova que não há heurística de tamanho)", mediaFonetica("silaba","CHA") === "assets/audio/fonetica/silabas/cha.mp3");
check("mediaFonetica('palavra','VACA') usa a pasta palavras", mediaFonetica("palavra","VACA") === "assets/audio/fonetica/palavras/vaca.mp3");
check("mediaFonetica('letra','A') usa a pasta letras", mediaFonetica("letra","A") === "assets/audio/fonetica/letras/a.mp3");
check("mediaFonetica('numero','10') usa a pasta numeros", mediaFonetica("numero","10") === "assets/audio/fonetica/numeros/10.mp3");
check("mediaFonetica com tipo desconhecido devolve null (não path errado)", mediaFonetica("silabao","VA") === null);
check("mediaLiaVoice monta categoria/nome", mediaLiaVoice("comuns","monte-o-nome") === "assets/audio/lia/comuns/monte-o-nome.mp3");
check("mediaLiaVoice monta a variante de gênero masculino", mediaLiaVoice("comuns","monte-o-nome-genero-masculino") === "assets/audio/lia/comuns/monte-o-nome-genero-masculino.mp3");
check("mediaCharacterVideo monta personagem/personagem-estado", mediaCharacterVideo("vaca","intro") === "assets/video/personagens/vaca/vaca-intro.mp4");
check("mediaSfx monta grupo/nome", mediaSfx("feedback","acerto") === "assets/audio/sfx/feedback/acerto.mp3");

/* ---------- 2) dado: banco quase inteiro tem 'character' agora (2026-08-18,
   depois de escalar Lote A -> nível 1 -> banco quase completo, conforme a
   mídia real foi sendo produzida). Em vez de manter uma lista hardcoded de
   nomes (ficou insustentável em 87 palavras), a checagem virou ESTRUTURAL:
   toda palavra com 'character' tem que ter 'genero' válido e 'character'
   igual ao lowercase de 'word' (mesma convenção de pasta em
   app/assets/video/personagens/), e a única exceção conhecida sem mídia
   ainda é MURO (ver producao/CHECKLIST_PRODUCAO.md). ---------- */
const vacaItem = WORDS.find(w=>w.word==="VACA");
check("WORDS.VACA tem character:'vaca'", vacaItem && vacaItem.character === "vaca");
const comCharacter = WORDS.filter(w=>w.character);
check("banco tem pelo menos 80 palavras com 'character' já produzido (2026-08-18: quase o banco inteiro)", comCharacter.length >= 80);
const characterErrado = comCharacter.filter(w => w.character !== w.word.toLowerCase());
check("todo 'character' bate com lowercase(word) (mesma convenção da pasta de vídeo)", characterErrado.length === 0);
const generoInvalido = comCharacter.filter(w => w.genero !== "m" && w.genero !== "f");
check("toda palavra com 'character' tem 'genero' explícito e válido ('m'|'f')", generoInvalido.length === 0);
const semCharacterAindaEsperado = WORDS.filter(w => !w.character).map(w=>w.word);
check("a única palavra do banco ainda sem 'character' é MURO (falta vídeo -- ver CHECKLIST_PRODUCAO.md)", semCharacterAindaEsperado.length === 1 && semCharacterAindaEsperado[0] === "MURO");

/* ---------- 3) AudioManager: fallback pra TTS quando o áudio "real" falha
   (o stub de Audio deste teste SEMPRE falha, simulando arquivo ausente) --
   ajuste de 2026-08-17: o TTS não fala mais junto/imediato por padrão (isso
   causava DUAS vozes sobrepostas quando o MP3 real existe e funciona) --
   só entra depois que o áudio real não confirma que tocou (aqui, via
   erro), então o teste espera um pouco antes de checar, em vez de checar
   de forma síncrona. ---------- */
spokenLog = [];
let queueDone = false;
AudioManager.queueVoice([
  { url: mediaLiaVoice("comuns","monte-o-nome"), fallbackText: "Olha quem chegou por aqui! Observe com atenção... e monte o nome dela!" }
], ()=>{ queueDone = true; });
check("logo após chamar queueVoice, o TTS AINDA NÃO falou (dá chance do áudio real, evita sobrepor vozes)", spokenLog.length === 0);
await wait(500); // o áudio "real" (stub) já falhou por microtask; passado esse tempo o TTS deve ter assumido
check("depois da folga, o TTS assumiu porque o áudio real falhou (nunca fica mudo)", spokenLog.length === 1);
check("o texto de fallback da instrução NUNCA cita a palavra-alvo (regra pedagógica)", spokenLog[0].toUpperCase().indexOf("VACA") === -1);
await wait(4500);
check("a fila de voz eventualmente termina (mesmo só com fallback de TTS)", queueDone === true);

/* ---------- 4) renderSilabas, 1º encontro: vídeo indisponível cai pro
   fallback, instrução NÃO revela mais a resposta (era o bug original:
   speak("Monte a palavra " + word)), opções liberam só depois ---------- */
spokenLog = [];
state.characterIntroSeen = new Set(); // força "1º encontro" pra este teste
const stage1 = document.getElementById("game-stage");
const originalPick = window.pickWeightedByLevel;
window.pickWeightedByLevel = function(){ return vacaItem; };
activityLevel.silabas = 1;
try{
  renderSilabas(stage1);
}catch(e){
  console.log("RENDER ERROR (silabas/vaca, 1o encontro): " + e.message);
  fail++;
}

let optsAfterRender = Array.from(document.querySelectorAll(".option-btn"));
check("renderSilabas(VACA) produz as opções de sílaba (VA/CA + distratores)", optsAfterRender.length >= 3);
check("opções começam DESABILITADAS até a Lia terminar a instrução (evita clique de reflexo)", optsAfterRender.every(b=>b.disabled === true));

await wait(4500); // vídeo falha -> fallback -> instrução falada -> opções liberadas
check("nenhuma fala desta rodada contém 'VACA' (a resposta não é entregue)", !spokenLog.some(t => t.toUpperCase().indexOf("VACA") !== -1));
check("a instrução falada é a versão segura (não revela a palavra)", spokenLog.some(t => t.indexOf("monte o nome dela") !== -1));
optsAfterRender = Array.from(document.querySelectorAll(".option-btn"));
check("opções são liberadas depois que a instrução termina", optsAfterRender.every(b=>b.disabled === false));

/* ---------- 5) 2º encontro na mesma sessão: vídeo completo TAMBÉM toca de
   novo (decisão do Júlio em 2026-08-17: o vídeo prende a atenção da
   criança, então nunca deve ser pulado -- revogou a redução original do
   piloto, que pulava o vídeo em reencontros na mesma sessão) ---------- */
spokenLog = [];
const stage2 = document.getElementById("game-stage");
window.pickWeightedByLevel = function(){ return vacaItem; };
try{
  renderSilabas(stage2);
}catch(e){
  console.log("RENDER ERROR (silabas/vaca, 2o encontro): " + e.message);
  fail++;
}
check("2º encontro: o vídeo é criado de novo (nunca pula, prende a atenção da criança)", document.querySelectorAll("video").length === 1);
await wait(4500); // vídeo falha (stub) -> fallback -> instrução falada
check("2º encontro: a instrução é falada mesmo depois do vídeo (via fallback)", spokenLog.length >= 1);
window.pickWeightedByLevel = originalPick;

/* ---------- 6) acerto do piloto: SFX + Lia (personalidade) + fonética
   (pronúncia oficial) como peças SEPARADAS, nunca uma frase só. Rodada 2 do
   piloto (orquestração por Promise): a função é async agora -- await direto
   na Promise real, sem adivinhar quanto tempo o áudio leva. ---------- */
spokenLog = [];
beepLog = [];
let nextRoundSpokenCount = null;
window.nextRound = function(){ nextRoundSpokenCount = spokenLog.length; };
await registerAnswerWithCharacterFeedback(true, vacaItem);
check("acerto: SFX com fallback pro beep('ok') (sfx-acerto.mp3 ainda não existe)", beepLog.includes("ok"));
check("acerto: fala tem a frase da Lia + as 3 pronúncias oficiais separadas (VA, CA, VACA) -- 4 itens, não 1 frase só", spokenLog.length === 4);
check("acerto: 1º item falado é a Lia (personalidade), não a fonética", spokenLog[0] && spokenLog[0].toUpperCase().indexOf("ISSO") !== -1);
check("acerto: fonética de VA falada isoladamente", spokenLog.includes("VA"));
check("acerto: fonética de CA falada isoladamente", spokenLog.includes("CA"));
check("acerto: fonética da palavra inteira falada por último", spokenLog[3] === "VACA");
check("nenhum elemento fica com .is-speaking depois que a sequência de acerto termina (sem vazamento visual)", document.querySelectorAll(".is-speaking").length === 0);
await wait(1000); // margem pro setTimeout curto de registerAnswer (nextRoundDelay) disparar
check("nextRound só é chamado DEPOIS que as 4 falas já foram registradas -- sincronização real via Promise, não um timeout adivinhado em paralelo", nextRoundSpokenCount === 4);
window.nextRound = function(){};

/* ---------- 7) erro do piloto: dica revela só a 1ª sílaba, nunca a palavra ---------- */
spokenLog = [];
await registerAnswerWithCharacterFeedback(false, vacaItem);
check("erro: dica tem 2 itens (frase da Lia + só a 1ª sílaba)", spokenLog.length === 2);
check("erro: a dica revela só 'VA' (não a palavra inteira)", spokenLog[1] === "VA");
check("erro: nenhuma fala desta dica é a palavra completa 'VACA'", !spokenLog.some(t=>t.toUpperCase()==="VACA"));
check("erro: nenhum elemento fica com .is-speaking depois que a dica termina", document.querySelectorAll(".is-speaking").length === 0);

/* ---------- 8) API nova do Audio Manager (rodada 2 do piloto) ---------- */
check("AudioManager.playVoice existe e retorna uma Promise", typeof AudioManager.playVoice === "function");
check("AudioManager.queueVoice retorna uma Promise (além de continuar aceitando onDone)", typeof AudioManager.queueVoice([]).then === "function");
check("playCharacterIntro existe (Promise-wrapper de mountCharacterIntro)", typeof playCharacterIntro === "function");
check("pronounceAndHighlight existe (helper genérico de destaque sincronizado)", typeof pronounceAndHighlight === "function");

/* pronounceAndHighlight, isolado: contrato determinístico -- adiciona
   is-speaking ANTES da Promise resolver, remove DEPOIS. Testado à parte da
   cena inteira porque, no fluxo completo, o momento intermediário passa
   rápido demais pra flagrar de forma confiável. */
const fakeEl = document.createElement("div");
const highlightPromise = pronounceAndHighlight(fakeEl, { fallbackText: "VA" });
check("pronounceAndHighlight adiciona .is-speaking de imediato (síncrono, antes do áudio resolver)", fakeEl.classList.contains("is-speaking"));
await highlightPromise;
check("pronounceAndHighlight remove .is-speaking depois que a Promise resolve", !fakeEl.classList.contains("is-speaking"));

/* ---------- 9) escala do banco inteiro (2026-08-17 Lote A -> 2026-08-18
   banco quase completo): todos os outros personagens (além da Vaca, já
   testada a fundo acima) entram no MESMO fluxo de personagem+Lia+fonética
   -- smoke test estrutural em todos eles (não repete as 30+ checagens já
   feitas com a Vaca, só confirma que cada um entra no fluxo certo e produz
   os caminhos de mídia certos). Roda em TODAS as palavras com 'character'
   (não mais uma lista fixa) -- generaliza junto com o banco. ---------- */
const outrasComCharacter = comCharacter.filter(w=>w.word!=="VACA").map(w=>w.word);
for(const wordName of outrasComCharacter){
  const item = WORDS.find(w=>w.word===wordName);
  if(!item){ console.log("PALAVRA COM CHARACTER FALTANDO EM WORDS: " + wordName); fail++; continue; }
  spokenLog = [];
  const stageN = document.getElementById("game-stage");
  window.pickWeightedByLevel = function(){ return item; };
  try{
    renderSilabas(stageN);
  }catch(e){
    console.log("RENDER ERROR (silabas/" + wordName + "): " + e.message);
    fail++;
    continue;
  }
  check(wordName + ": vídeo do personagem é criado", document.querySelectorAll("video").length === 1);
  check(wordName + ": opções começam desabilitadas (mesmo padrão da Vaca)", Array.from(document.querySelectorAll(".option-btn")).every(b=>b.disabled===true));
  check(wordName + ": mediaCharacterVideo resolve o caminho esperado", mediaCharacterVideo(item.character,"intro") === "assets/video/personagens/" + item.character + "/" + item.character + "-intro.mp4");
  item.syl.forEach(s=>{
    check(wordName + ": mediaFonetica('silaba','" + s + "') resolve (sem heurística de tamanho)", mediaFonetica("silaba", s) === "assets/audio/fonetica/silabas/" + s.toLowerCase() + ".mp3");
  });
  check(wordName + ": mediaFonetica('palavra',...) resolve", mediaFonetica("palavra", item.word) === "assets/audio/fonetica/palavras/" + item.word.toLowerCase() + ".mp3");

  /* Concordância de gênero (2026-08-17): 'genero' é SEMPRE explícito no
     dado (nunca inferido da palavra) -- ver comentário em
     montaFalaIntroPersonagem, activities-portugues.js. Testado direto na
     função (sem esperar o fluxo de áudio inteiro), rápido e determinístico. */
  check(wordName + ": tem 'genero' explícito ('m' ou 'f'), nunca inferido da palavra", item.genero === "m" || item.genero === "f");
  const falaIntro = montaFalaIntroPersonagem(item);
  const generoEsperado = item.genero === "m" ? "dele" : "dela";
  const arquivoEsperado = item.genero === "m" ? "monte-o-nome-genero-masculino" : "monte-o-nome";
  check(wordName + ": fala de intro concorda em gênero ('" + generoEsperado + "')", falaIntro.fallbackText.indexOf(generoEsperado) !== -1);
  check(wordName + ": usa o arquivo de Lia certo pro gênero (" + arquivoEsperado + ".mp3)", falaIntro.url === "assets/audio/lia/comuns/" + arquivoEsperado + ".mp3");
}
window.pickWeightedByLevel = originalPick;

/* Concordância de gênero, caso de borda: item SEM 'genero' -- não deve
   quebrar (cai pro feminino como fallback de segurança + avisa no
   console), mas o certo é sempre corrigir o dado, nunca depender disso. */
const semGeneroFake = { word:"TESTE", character:"x" };
const falaSemGenero = montaFalaIntroPersonagem(semGeneroFake);
check("item sem 'genero' não quebra (fallback de segurança pro feminino, com aviso)", falaSemGenero.fallbackText.indexOf("dela") !== -1);

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
})();
<\/script>
`;

html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', (e)=>console.error('[jsdomError]', e.message));
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
