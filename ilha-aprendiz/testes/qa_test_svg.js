const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
let html = require('./_util/load_app_html').loadAppHtml();

const testScript = `
<script>
window.speechSynthesis = { cancel(){}, speak(){} };
window.SpeechSynthesisUtterance = function(t){ this.text=t; };
window.AudioContext = function(){ return { createOscillator(){return {connect(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},start(){},stop(){}} }, createGain(){return {connect(){},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}}} }, destination:{}, currentTime:0 }; };

let ok=0, fail=0;
function check(l,c){ if(c) ok++; else { fail++; console.log("FAIL: " + l); } }

// force pares_minimos level 3/4 many times to try to hit the COLA/GOLA and COLEIRA/GOLEIRA svg pairs
let sawSvgInParesMinimos = false;
for(let i=0;i<200;i++){
  activityLevel.pares_minimos = 3 + (i % 2);
  state.game="pares_minimos"; state.subgames=["pares_minimos"]; state.round=1; state.totalRounds=1;
  state.pools={}; state.roundPlan=["pares_minimos"]; state.currentRender="pares_minimos";
  renderRound();
  const opts = document.querySelectorAll('.option-btn');
  if(Array.from(opts).some(b=>b.innerHTML.includes('<svg'))) sawSvgInParesMinimos = true;
}
check("Pares Mínimos rendered an SVG option at least once in 200 tries", sawSvgInParesMinimos);

let sawSvgInManip = false;
for(let i=0;i<200;i++){
  activityLevel.manipulacao = 2;
  state.game="manipulacao"; state.subgames=["manipulacao"]; state.round=1; state.totalRounds=1;
  state.pools={}; state.roundPlan=["manipulacao"]; state.currentRender="manipulacao";
  renderRound();
  const opts = document.querySelectorAll('.option-btn');
  if(Array.from(opts).some(b=>b.innerHTML.includes('<svg'))) sawSvgInManip = true;
}
check("Troca-Letra rendered an SVG option at least once in 200 tries (family _OLA)", sawSvgInManip);

// Monte a Sílaba / Digite a Palavra with TATU (level 2 word)
let sawTatuSvg = false;
for(let i=0;i<100;i++){
  activityLevel.silabas = 2;
  state.game="silabas"; state.subgames=["silabas"]; state.round=1; state.totalRounds=1;
  state.pools={}; state.roundPlan=["silabas"]; state.currentRender="silabas";
  renderRound();
  const emojiDiv = document.querySelector('.game-stage > div[style]');
  if(emojiDiv && emojiDiv.innerHTML.includes('<svg')) sawTatuSvg = true;
}
check("Monte a Sílaba (tile mode) rendered TATU's SVG at least once in 100 tries", sawTatuSvg);

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', (e)=>console.error('[jsdomError]', e.message));
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
