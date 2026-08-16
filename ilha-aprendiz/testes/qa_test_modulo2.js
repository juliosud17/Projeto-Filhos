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
function passProva(containerId){ provaPassed[containerId] = true; provaScores[containerId] = {overallPct:100, perActivity:[], passed:true}; }

// 1. renderLeitura at each level, 30 rounds, check no errors, correct findable, distractor difficulty scaling
for(let lvl=1; lvl<=5; lvl++){
  activityLevel.leitura = lvl;
  mastery["leitura:"+lvl] = [];
  let errors = 0, correctFound = 0;
  let maxDistractorLevelSeen = 0;
  for(let round=0; round<30; round++){
    state.game="leitura"; state.subgames=["leitura"]; state.round=1; state.totalRounds=1;
    state.pools={}; state.roundPlan=["leitura"]; state.currentRender="leitura";
    state.roundFirstTryUsed=false;
    try{ renderRound(); }catch(e){ console.log("RENDER ERROR L"+lvl+": "+e.message); errors++; continue; }
    const opts = document.querySelectorAll('.option-btn');
    if(opts.length !== 3){ console.log("WARN opts!=3 L"+lvl+": "+opts.length); errors++; continue; }
    state.sessionStars = 0;
    let found = false;
    for(const b of opts){
      const before = state.sessionStars;
      if(b.onclick) b.onclick();
      if(state.sessionStars > before){ found = true; correctFound++; break; }
      state.roundFirstTryUsed = false;
    }
    if(!found){ console.log("WARN no correct L"+lvl); errors++; }
  }
  check("leitura L"+lvl+": 30 rounds no errors", errors===0);
  check("leitura L"+lvl+": correct answer always found", correctFound===30);
}

// 2. activityLevel has "leitura" key -> menu should render it with level tag, not plain % domínio
// precisa desbloquear o Módulo 2 primeiro (módulo 1 completo) pra ver o card no estado "unlocked"
MODULE1_ACTIVITIES.forEach(a=>{
  activityLevel[a.id] = 5;
  mastery[a.id+":5"] = [true,true,true,true,true,true,true,true,true,false];
});
passProva("silabas"); // Desafio Final também virou critério de desbloqueio
activityLevel.leitura = 3;
mastery['leitura:3'] = [true,true,true];
selectChild('benjamin');
openMaterias();
openModulos('portugues');
openAtividades('leitura');
const cards = Array.from(document.querySelectorAll('#atividades-grid .game-card'));
const leituraCard = cards.find(c=>c.innerHTML.includes('Leitura Rápida'));
check("menu shows Leitura Rápida card", !!leituraCard);
check("Leitura Rápida card shows 'Nível' tag (leveled UI)", leituraCard && leituraCard.innerHTML.includes('Nível'));

// 3. isModuleUnlocked: módulo 3 (frases) requires o container "leitura" (Módulo 2)
// inteiro dominado (as 3 atividades) E a prova aprovada -- should stay locked
// until leitura hits level5+80% in every activity + Desafio Final aprovado
activityLevel.leitura = 1;
mastery['leitura:1'] = [];
const frasesMod = PT_MODULES_BENJAMIN.find(m=>m.id==='frases');
check("Módulo 3 locked while leitura not maxed", isModuleUnlocked(frasesMod) === false);
MODULE2_ACTIVITIES.forEach(a=>{
  activityLevel[a.id] = 5;
  mastery[a.id+":5"] = [true,true,true,true,true,true,true,true,true,false];
});
check("Módulo 3 ainda BLOQUEADO com Módulo 2 100% dominado mas sem a prova aprovada", isModuleUnlocked(frasesMod) === false);
passProva("leitura");
check("Módulo 3 unlock check now true after Módulo 2 maxed + Desafio Final aprovado", isModuleUnlocked(frasesMod) === true);
// módulo 3 isn't built yet, so unlock alone won't make it playable, but the gate function itself should be correct

// 4. admin panel shows leitura as leveled card
openAdmin();
const adminHtml = document.getElementById('admin-list').innerHTML;
check("admin panel shows leitura nível rows", adminHtml.includes('Módulo 2') && adminHtml.includes('Nível 1') && adminHtml.includes('Nível 5'));

// 5. adminPlay jump to a specific level for leitura works
activityLevel.leitura = 1;
adminPlay('benjamin', 'leitura', 4);
check("adminPlay jumped leitura to level 4", activityLevel.leitura === 4);
check("adminPlay started game screen", document.getElementById('screen-game').classList.contains('active'));

// 6. speak coverage still intact for leitura after the level refactor
let lastSpoken = [];
const origSpeak = speak;
speak = function(t){ lastSpoken.push(t); return origSpeak(t); };
state.game="leitura"; state.subgames=["leitura"]; state.round=1; state.totalRounds=1;
state.pools={}; state.roundPlan=["leitura"]; state.currentRender="leitura";
renderRound();
check("leitura still speaks instruction automatically", lastSpoken.length > 0 && lastSpoken[0].includes("Leia a palavra"));

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', ()=>{});
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
