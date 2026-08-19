const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
let html = require('./_util/load_app_html').loadAppHtml();

const testScript = `
<script>
window.speechSynthesis = { cancel(){}, speak(){} };
window.SpeechSynthesisUtterance = function(t){ this.text=t; };
window.AudioContext = function(){ return { createOscillator(){return {connect(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},start(){},stop(){}} }, createGain(){return {connect(){},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}}} }, destination:{}, currentTime:0 }; };
/* nível 5 (Digite a Palavra) passou a usar AudioManager.queueVoice em vez de
   speak() direto (2026-08-18, ver docs/DECISOES.md) -- precisa dos mesmos
   stubs de mídia que qa_test_piloto_vaca.js/qa_test_svg.js, senão jsdom trava
   tentando tocar áudio de verdade. */
window.HTMLMediaElement.prototype.play = function(){ return Promise.reject(new Error("jsdom: arquivo de mídia não existe (stub de teste)")); };
window.HTMLMediaElement.prototype.pause = function(){};
window.HTMLMediaElement.prototype.load = function(){};
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
function check(label, cond){ if(cond) ok++; else { fail++; console.log("FAIL: " + label); } }

activityLevel.silabas = 5;
mastery['silabas:5'] = [];
for(let i=0;i<15;i++){
  state.game = "silabas"; state.subgames=["silabas"]; state.round=1; state.totalRounds=1;
  state.pools={}; state.usedSomLetters=new Set(); state.roundPlan=["silabas"]; state.currentRender="silabas";
  state.roundFirstTryUsed = false;
  renderRound();
  const input = document.getElementById('typed-word');
  const btn = document.getElementById('confirm-typed');
  check("typing UI rendered round " + i, !!input && !!btn);
  if(!input) continue;
  // find target word from prompt context: we don't have direct access, so try wrong first then rely on emoji lookup
  // Instead, grab word via WORDS matching emoji shown
  const emojiShown = document.querySelector('.game-stage > div[style]').textContent;
  const match = WORDS.find(w=>w.emoji === emojiShown && w.level === 5) || WORDS.find(w=>w.emoji===emojiShown);
  check("found matching WORDS entry for emoji " + emojiShown, !!match);
  if(!match) continue;
  // test wrong answer first
  input.value = "XXXXX";
  btn.onclick();
  check("wrong answer doesn't crash, input cleared", input.value === "");
  // test lowercase + accent-insensitive correct answer
  input.value = match.word.toLowerCase();
  const before = state.sessionStars;
  btn.onclick();
  check("correct (lowercase) typed answer accepted round " + i, state.sessionStars > before || input.disabled === true);
}
console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', (e)=>console.error('[jsdomError]', e.message));
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
