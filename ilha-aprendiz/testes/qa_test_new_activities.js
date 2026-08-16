const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
let html = fs.readFileSync('/tmp/ilha_aprendiz.html', 'utf8');

const testScript = `
<script>
window.speechSynthesis = { cancel(){}, speak(){} };
window.SpeechSynthesisUtterance = function(t){ this.text=t; };
window.AudioContext = function(){ return { createOscillator(){return {connect(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},start(){},stop(){}} }, createGain(){return {connect(){},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}}} }, destination:{}, currentTime:0 }; };

const activities = ["pares_minimos","rimas","manipulacao","maiusc_minusc"];
let totalErrors = 0;
activities.forEach(act=>{
  console.log("=== " + act + " ===");
  for(let lvl=1; lvl<=5; lvl++){
    activityLevel[act] = lvl;
    mastery[act+":"+lvl] = [];
    let errors = 0;
    let optCounts = [];
    let correctCounts = 0;
    for(let round=0; round<30; round++){
      state.game = act;
      state.subgames = [act];
      state.round = 1; state.totalRounds = 1;
      state.pools = {}; state.usedSomLetters = new Set();
      state.roundPlan = [act];
      state.currentRender = act;
      state.roundFirstTryUsed = false;
      try{
        renderRound();
      }catch(e){
        console.log("  RENDER ERROR L" + lvl + ": " + e.message);
        errors++; totalErrors++;
        continue;
      }
      const opts = document.querySelectorAll('.option-btn');
      optCounts.push(opts.length);
      if(opts.length < 2){ console.log("  WARN <2 options L" + lvl); errors++; totalErrors++; continue; }
      // Check no duplicate options — compara innerHTML (não textContent, que fica
      // vazio pra ícones SVG e mascararia colisão entre dois SVGs diferentes)
      const texts = Array.from(opts).map(o=>o.innerHTML);
      const uniq = new Set(texts);
      if(uniq.size !== texts.length){
        console.log("  WARN duplicate options L" + lvl + ": " + texts.join(" | "));
      }
      // Checa se algum item usa ícone SVG e se ele de fato foi renderizado (não ficou vazio)
      Array.from(opts).forEach(b=>{
        if(b.innerHTML.trim() === ""){ console.log("  WARN empty option rendered L" + lvl); }
      });
      // click each button, find the one that increments sessionStars (correct)
      state.sessionStars = 0;
      let foundCorrect = false;
      for(const b of opts){
        const before = state.sessionStars;
        if(b.onclick) b.onclick();
        if(state.sessionStars > before){ foundCorrect = true; correctCounts++; break; }
        state.roundFirstTryUsed = false; // reset so next click counts as first try too (test hack)
      }
      if(!foundCorrect){ console.log("  WARN: no option registered correct L" + lvl); errors++; totalErrors++; }
    }
    const minOpt = Math.min(...optCounts), maxOpt = Math.max(...optCounts);
    console.log("  L" + lvl + ": rounds=30 errors=" + errors + " opts(min-max)=" + minOpt + "-" + maxOpt + " correctFound=" + correctCounts + "/30");
  }
});
console.log("\\nTOTAL ERRORS: " + totalErrors);
<\/script>
`;

html = html.replace('</body>', testScript + '</body>');

const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...args)=>console.log(...args));
virtualConsole.on('error', (...args)=>console.error('[jsdom error]', ...args));
virtualConsole.on('jsdomError', (e)=>console.error('[jsdomError]', e.stack || e.message));

new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
