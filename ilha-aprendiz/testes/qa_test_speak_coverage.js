const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
let html = fs.readFileSync('/tmp/ilha_aprendiz.html', 'utf8');

const testScript = `
<script>
window.speechSynthesis = { cancel(){}, speak(){} };
window.SpeechSynthesisUtterance = function(t){ this.text=t; };
window.AudioContext = function(){ return { createOscillator(){return {connect(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},start(){},stop(){}} }, createGain(){return {connect(){},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}}} }, destination:{}, currentTime:0 }; };

let ok=0, fail=0;
function check(l,c){ if(c) ok++; else { fail++; console.log("FAIL: " + l); } }

let lastSpoken = [];
const origSpeak = speak;
speak = function(t){ lastSpoken.push(t); return origSpeak(t); };

const games = ["letras","letras_b","numeros","contar","silabas","leitura","soma","subtracao","cominicial","pares_minimos","rimas","manipulacao","maiusc_minusc"];
games.forEach(g=>{
  lastSpoken = [];
  state.game=g; state.subgames=[g]; state.round=1; state.totalRounds=1;
  state.pools={}; state.usedSomLetters = new Set(); state.roundPlan=[g]; state.currentRender=g;
  try{
    renderRound();
  }catch(e){
    console.log("RENDER ERROR " + g + ": " + e.message);
  }
  const prompt = document.querySelector('.prompt');
  const promptText = prompt ? prompt.textContent.trim() : "";
  check(g + ": renderRound produced a .prompt element", !!prompt);
  check(g + ": speak() was called automatically at least once (len=" + lastSpoken.length + ")", lastSpoken.length > 0);
  if(lastSpoken.length > 0){
    console.log("  " + g + " prompt: \\"" + promptText + "\\" | spoken: \\"" + lastSpoken[0] + "\\"");
  }
});

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', (e)=>console.error('[jsdomError]', e.message));
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
