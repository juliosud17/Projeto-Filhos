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
   verdade. Simula SUCESSO por padrão (dispara 'playing' e depois 'ended'):
   reflete o estado real do projeto desde 2026-08-19/20, banco de mídia
   100% completo (ver CHECKLIST_PRODUCAO.md) -- o cenário antigo era o
   oposto (tudo falhava, porque nenhum mp3 existia ainda em 2026-08-17).
   audioLog registra a URL de cada Audio() criado, na ordem -- é como os
   testes abaixo verificam QUAL áudio real tocou e em que ordem, agora que
   a checagem via TTS (spokenLog) não serve mais pra isso (ver seção 3). */
window.Audio = function(url){ this._url = url; this._listeners = {}; this.volume = 1; audioLog.push(url); };
window.Audio.prototype.addEventListener = function(evt, cb){ (this._listeners[evt] = this._listeners[evt] || []).push(cb); };
window.Audio.prototype.play = function(){
  const self = this;
  return Promise.resolve().then(()=>{
    (self._listeners.playing || []).forEach(cb=>cb());
    return Promise.resolve().then(()=>{ (self._listeners.ended || []).forEach(cb=>cb()); });
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
let audioLog = [];

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

/* Bug do Ç (achado em 2026-08-18, corrigido a pedido do Júlio, ver
   docs/DECISOES.md): Ç NÃO é acento comum, tem som próprio (/s/, diferente
   do /k/ de C antes de A/O/U). Antes da correção, mediaFileName("ÇA")
   colidia com mediaFileName("CA") (os dois viravam "ca.mp3") -- tocaria o
   som errado pra qualquer palavra com ÇA/ÇO/ÇU. */
check("mediaFonetica('silaba','ÇA') NÃO colide com CA (bug do Ç corrigido)", mediaFonetica("silaba","ÇA") === "assets/audio/fonetica/silabas/ssa.mp3" && mediaFonetica("silaba","ÇA") !== mediaFonetica("silaba","CA"));
check("WORDS.FUMACA usa 'ÇA' (não 'CA') na 3ª sílaba -- grafia real da palavra", WORDS.find(w=>w.word==="FUMACA").syl[2] === "ÇA");
check("mediaLiaVoice monta categoria/nome", mediaLiaVoice("comuns","monte-o-nome") === "assets/audio/lia/comuns/monte-o-nome.mp3");
check("mediaLiaVoice monta a variante de gênero masculino", mediaLiaVoice("comuns","monte-o-nome-genero-masculino") === "assets/audio/lia/comuns/monte-o-nome-genero-masculino.mp3");
check("mediaCharacterVideo monta personagem/personagem-estado", mediaCharacterVideo("vaca","intro") === "assets/video/personagens/vaca/vaca-intro.mp4");
check("mediaSfx monta grupo/nome", mediaSfx("feedback","acerto") === "assets/audio/sfx/feedback/acerto.mp3");

/* ---------- 2) dado: banco INTEIRO tem 'character' agora (2026-08-18,
   depois de escalar Lote A -> nível 1 -> banco quase completo -> MURO (o
   último que faltava, confirmado pelo Júlio que o parede.mp4 era o vídeo
   dele) -- as 87 palavras têm vídeo real). Em vez de manter uma lista
   hardcoded de nomes (ficou insustentável em 87 palavras), a checagem é
   ESTRUTURAL: toda palavra tem 'character' preenchido, 'genero' válido, e
   'character' igual ao lowercase de 'word' (mesma convenção de pasta em
   app/assets/video/personagens/). ---------- */
const vacaItem = WORDS.find(w=>w.word==="VACA");
check("WORDS.VACA tem character:'vaca'", vacaItem && vacaItem.character === "vaca");
const comCharacter = WORDS.filter(w=>w.character);
check("banco INTEIRO (87 palavras) tem 'character' produzido (2026-08-18: última, MURO, confirmada)", comCharacter.length === WORDS.length);
const characterErrado = comCharacter.filter(w => w.character !== w.word.toLowerCase());
check("todo 'character' bate com lowercase(word) (mesma convenção da pasta de vídeo)", characterErrado.length === 0);
const generoInvalido = comCharacter.filter(w => w.genero !== "m" && w.genero !== "f");
check("toda palavra tem 'genero' explícito e válido ('m'|'f')", generoInvalido.length === 0);

/* ---------- 3) TTS PROIBIDO no módulo (2026-08-20, pedido direto do
   Júlio, ver setTtsAllowed em audio-manager.js): antes, quando o áudio
   real falhava, o TTS entrava como rede de segurança ("nunca fica mudo").
   Isso foi INTENCIONALMENTE revogado -- no celular, mesmo com folga maior
   (GRACE_MS 1800ms), o TTS ainda atravessava/cortava a voz da Lia, e o
   Júlio pediu pra tirar de vez. Agora, mesmo simulando uma falha REAL do
   áudio (stub de Audio.play trocado só pra esta checagem), o TTS NUNCA
   deve tocar -- silêncio é o comportamento esperado, não mais TTS. Em
   produção quem desliga o TTS é renderSilabas() (chamado 1x, cobre todo o
   módulo) -- como este teste chama AudioManager.queueVoice() diretamente,
   sem passar por renderSilabas(), precisa ligar o mesmo interruptor aqui
   à mão pra simular o estado real de quando a criança está jogando. ---------- */
AudioManager.setTtsAllowed(false);
spokenLog = [];
const originalPlay = window.Audio.prototype.play;
window.Audio.prototype.play = function(){
  const self = this;
  return Promise.resolve().then(()=>{
    (self._listeners.error || []).forEach(cb=>cb());
    throw new Error("simulado: falha real de mp3 (mesmo assim, TTS continua proibido)");
  });
};
let queueDone = false;
AudioManager.queueVoice([
  { url: mediaLiaVoice("comuns","monte-o-nome"), fallbackText: "Olha quem chegou por aqui! Observe com atenção... e monte o nome dela!" }
], ()=>{ queueDone = true; });
await wait(2200); // folga maior que GRACE_MS (1800ms) -- tempo de sobra pro TTS "tentar" entrar, se fosse permitido
check("mesmo com o áudio real falhando de verdade, o TTS NÃO toca (proibido no módulo, 2026-08-20)", spokenLog.length === 0);
await wait(400); // com TTS proibido, giveUpToTts() resolve rápido agora (200ms fixo, não tem fala nenhuma pra esperar terminar -- ver finishDelayMs em audio-manager.js)
check("a fila de voz termina mesmo sem tocar nada (nunca trava a criança esperando um áudio que não veio)", queueDone === true);
window.Audio.prototype.play = originalPlay;

/* ---------- 4) renderSilabas, 1º encontro: vídeo indisponível cai pro
   fallback, instrução NÃO revela mais a resposta (era o bug original:
   speak("Monte a palavra " + word)), opções liberam só depois. Áudio real
   (stub simula sucesso, banco 100% completo) -- checagem via audioLog, não
   mais via spokenLog (TTS proibido no módulo, ver seção 3). ---------- */
spokenLog = [];
audioLog = [];
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

await wait(500); // áudio real "toca" rápido agora (stub resolve por microtask) -- vídeo falha (stub sempre rejeita) -> fallback -> instrução toca -> opções liberam
check("nenhum áudio tocado nesta rodada é a pronúncia da palavra 'vaca' (a resposta não é entregue na instrução)", !audioLog.includes(mediaFonetica("palavra","VACA")));
check("a instrução tocada é o arquivo certo da Lia (monte-o-nome.mp3, VACA é 'f')", audioLog.includes(mediaLiaVoice("comuns","monte-o-nome")));
check("TTS não entra nesta rodada (áudio real funcionou; e mesmo se falhasse, está proibido no módulo)", spokenLog.length === 0);
optsAfterRender = Array.from(document.querySelectorAll(".option-btn"));
check("opções são liberadas depois que a instrução termina", optsAfterRender.every(b=>b.disabled === false));

/* ---------- 5) 2º encontro na mesma sessão: vídeo completo TAMBÉM toca de
   novo (decisão do Júlio em 2026-08-17: o vídeo prende a atenção da
   criança, então nunca deve ser pulado -- revogou a redução original do
   piloto, que pulava o vídeo em reencontros na mesma sessão) ---------- */
spokenLog = [];
audioLog = [];
const stage2 = document.getElementById("game-stage");
window.pickWeightedByLevel = function(){ return vacaItem; };
try{
  renderSilabas(stage2);
}catch(e){
  console.log("RENDER ERROR (silabas/vaca, 2o encontro): " + e.message);
  fail++;
}
check("2º encontro: o vídeo é criado de novo (nunca pula, prende a atenção da criança)", document.querySelectorAll("video").length === 1);
await wait(500); // vídeo falha (stub) -> fallback -> instrução toca de novo (áudio real)
check("2º encontro: a instrução toca de novo mesmo depois do vídeo (áudio real, não TTS)", audioLog.includes(mediaLiaVoice("comuns","monte-o-nome")));
check("2º encontro: TTS continua não entrando", spokenLog.length === 0);
window.pickWeightedByLevel = originalPick;

/* ---------- 6) acerto do piloto: SFX + Lia (personalidade) + fonética
   (pronúncia oficial) como peças SEPARADAS, nunca uma frase só. Rodada 2 do
   piloto (orquestração por Promise): a função é async agora -- await direto
   na Promise real, sem adivinhar quanto tempo o áudio leva. Checagem via
   audioLog (URLs reais tocados, na ordem) -- TTS proibido no módulo desde
   2026-08-20 (ver seção 3), então spokenLog não serve mais pra verificar
   sequência/conteúdo aqui. ---------- */
spokenLog = [];
audioLog = [];
beepLog = [];
let nextRoundAudioCount = null;
window.nextRound = function(){ nextRoundAudioCount = audioLog.length; };
await registerAnswerWithCharacterFeedback(true, vacaItem);
check("acerto: SFX toca o áudio real (sfx/feedback/acerto.mp3 existe -- banco 100% completo, sem precisar do beep de fallback)", audioLog.includes(mediaSfx("feedback","acerto")) && !beepLog.includes("ok"));
check("acerto: 4 áudios tocados -- frase da Lia + as 3 pronúncias oficiais separadas (VA, CA, VACA), nunca 1 frase só (o SFX não conta, é canal independente)", audioLog.filter(u=>u!==mediaSfx("feedback","acerto")).length === 4);
check("acerto: 1º item tocado é a Lia (personalidade), não a fonética", audioLog[1] === mediaLiaVoice("comuns","acerto-01"));
check("acerto: fonética de VA tocada isoladamente", audioLog.includes(mediaFonetica("silaba","VA")));
check("acerto: fonética de CA tocada isoladamente", audioLog.includes(mediaFonetica("silaba","CA")));
check("acerto: fonética da palavra inteira tocada por último", audioLog[audioLog.length-1] === mediaFonetica("palavra","VACA"));
check("acerto: TTS não entra em nenhum momento (proibido no módulo)", spokenLog.length === 0);
check("nenhum elemento fica com .is-speaking depois que a sequência de acerto termina (sem vazamento visual)", document.querySelectorAll(".is-speaking").length === 0);
await wait(1000); // margem pro setTimeout curto de registerAnswer (nextRoundDelay) disparar
check("nextRound só é chamado DEPOIS que os 4 áudios de voz já foram registrados -- sincronização real via Promise, não um timeout adivinhado em paralelo", nextRoundAudioCount === 5); // 4 de voz + 1 do sfx, já tocados antes do nextRoundDelay
window.nextRound = function(){};

/* ---------- 7) erro do piloto: dica revela só a 1ª sílaba, nunca a palavra ---------- */
spokenLog = [];
audioLog = [];
await registerAnswerWithCharacterFeedback(false, vacaItem);
check("erro: dica tem 2 áudios (frase da Lia + só a 1ª sílaba)", audioLog.length === 2);
check("erro: a dica toca só 'VA' (não a palavra inteira)", audioLog[1] === mediaFonetica("silaba","VA"));
check("erro: nenhum áudio desta dica é a palavra completa 'VACA'", !audioLog.includes(mediaFonetica("palavra","VACA")));
check("erro: TTS não entra (proibido no módulo)", spokenLog.length === 0);
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
    // Ç não é tratado como acento comum (ver mediaFileName, media-catalog.js e
    // docs/DECISOES.md 2026-08-18) -- soa /s/, viraria "ss" no arquivo, não
    // pode colidir com C (som /k/). O nome esperado aqui já reflete isso.
    const nomeEsperado = s.toLowerCase().replace(/ç/g, "ss");
    check(wordName + ": mediaFonetica('silaba','" + s + "') resolve (sem heurística de tamanho)", mediaFonetica("silaba", s) === "assets/audio/fonetica/silabas/" + nomeEsperado + ".mp3");
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
