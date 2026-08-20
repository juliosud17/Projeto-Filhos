// Teste de regressão da Fase 0.5 (PRODUCTION_AUDIT.md item 13, TAREFA 1):
// AudioManager.setTtsAllowed(false), chamado 1x dentro de renderSilabas(),
// não tinha nenhum caminho de volta -- uma vez que a criança visitasse
// "Monte a Sílaba", o TTS ficava desligado pro resto da sessão em QUALQUER
// outra atividade, mesmo em atividades que dependem só de speak() como
// única narração.
//
// A correção (game-loop.js, renderRound()) torna a política contextual:
// a cada rodada, de qualquer atividade, o TTS é permitido ou proibido de
// acordo com a atividade da vez -- só "Monte a Sílaba" continua proibida.
//
// Este teste prova as DUAS pontas do bug original:
// 1. Dentro de "Monte a Sílaba", TTS continua proibido (não pode virar
//    regressão da proteção original).
// 2. Depois de sair de "Monte a Sílaba" e entrar em outra atividade que usa
//    TTS, a narração volta a funcionar (era isto que estava quebrado).

const { JSDOM, VirtualConsole } = require('jsdom');
let html = require('./_util/load_app_html').loadAppHtml();

const testScript = `
<script>
window.speechSynthesis = { cancel(){}, speak(){} };
window.SpeechSynthesisUtterance = function(t){ this.text=t; };
window.AudioContext = function(){ return { createOscillator(){return {connect(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},start(){},stop(){}} }, createGain(){return {connect(){},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}}} }, destination:{}, currentTime:0 }; };
window.HTMLMediaElement.prototype.play = function(){ return Promise.reject(new Error("jsdom: sem midia real (stub de teste)")); };
window.HTMLMediaElement.prototype.pause = function(){};
window.HTMLMediaElement.prototype.load = function(){};
window.Audio = function(url){ this._url = url; this._listeners = {}; this.volume = 1; };
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
window.nextRound = function(){};

(async function(){

// Estado mínimo de rodada válido (mesmo padrão do resto da suíte, ver
// qa_test_piloto_vaca.js) -- evita que timers reais de fim de rodada
// quebrem ao chamar renderRound() fora do fluxo completo startGame().
state.game = "silabas";
state.subgames = ["silabas"];
state.round = 1;
state.totalRounds = 1;
state.pools = {};
state.usedSomLetters = new Set();
state.roundPlan = ["silabas"];
state.roundFirstTryUsed = false;
state.sessionStars = 0;
state.characterIntroSeen = new Set(["vaca","tatu","bola","gato","pato","sapo","casa","galo","lobo","carro","sino"]); // pula intro de personagem, não é o que este teste checa

/* ---------- 1) dentro de "Monte a Sílaba": TTS continua proibido ---------- */
state.currentRender = "silabas";
renderRound(); // passa pelo funil real (game-loop.js), como em produção
await wait(50);
spokenLog = [];
await AudioManager.playVoice({ url: null, fallbackText: "isto não pode tocar" });
check("dentro de Monte a Sílaba (renderRound com currentRender=silabas), TTS continua proibido", spokenLog.length === 0);

/* ---------- 2) saindo de "Monte a Sílaba" pra outra atividade: TTS volta ---------- */
state.currentRender = "letras";
renderRound(); // mesma passagem pelo funil, atividade diferente
await wait(50);
spokenLog = [];
await AudioManager.playVoice({ url: null, fallbackText: "isto precisa tocar" });
check("BUG CORRIGIDO: depois de sair de Monte a Sílaba, TTS volta a funcionar em outra atividade (antes ficava mudo pro resto da sessão)", spokenLog.length === 1 && spokenLog[0] === "isto precisa tocar");

/* ---------- 3) voltando de novo a "Monte a Sílaba": continua proibido (a política é por rodada, não "liga só 1 vez") ---------- */
state.currentRender = "silabas";
renderRound();
await wait(50);
spokenLog = [];
await AudioManager.playVoice({ url: null, fallbackText: "isto não pode tocar de novo" });
check("voltando a Monte a Sílaba numa sessão que já usou outra atividade, TTS continua proibido (política reavaliada a cada rodada)", spokenLog.length === 0);

console.log("RESULT: " + ok + " passed, " + fail + " failed");
})();
</script>
`;

html = html.replace('</body>', testScript + '</body>');

const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (msg)=> console.log(msg));
virtualConsole.on('error', ()=>{});
virtualConsole.on('jsdomError', ()=>{});

new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
