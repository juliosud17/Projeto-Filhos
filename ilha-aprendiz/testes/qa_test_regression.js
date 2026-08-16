const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
let html = fs.readFileSync('/tmp/ilha_aprendiz.html', 'utf8');

const testScript = `
<script>
window.speechSynthesis = { cancel(){}, speak(){} };
window.SpeechSynthesisUtterance = function(t){ this.text=t; };
window.AudioContext = function(){ return { createOscillator(){return {connect(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},start(){},stop(){}} }, createGain(){return {connect(){},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}}} }, destination:{}, currentTime:0 }; };

let ok = 0, fail = 0;
function check(label, cond){ if(cond){ ok++; } else { fail++; console.log("FAIL: " + label); } }

selectChild('benjamin');
check("Benjamin cai na tela de Ano Letivo (não numa lista flat gigante)", document.getElementById('screen-menu').classList.contains('active'));
openMaterias();
openModulos('portugues');
check("menu de módulos mostra Módulo 1", document.getElementById('modulos-grid').innerHTML.includes('Módulo 1'));
openAtividades('silabas');
check("menu renders 7+ activity cards for module1", document.querySelectorAll('#atividades-grid .game-card').length >= 7);
check("module1FullyMastered starts false", module1FullyMastered() === false);

// force all 7 activities to level 5 with 90% mastery
MODULE1_ACTIVITIES.forEach(a=>{
  activityLevel[a.id] = 5;
  mastery[a.id+":5"] = [true,true,true,true,true,true,true,true,true,false];
});
check("module1FullyMastered true after all 7 maxed", module1FullyMastered() === true);
check("Módulo 2 ainda BLOQUEADO sem a prova aprovada (Desafio Final também virou critério de desbloqueio)", isModuleUnlocked(PT_MODULES_BENJAMIN.find(m=>m.id==='leitura')) === false);

openPanel();
check("panel shows 7/7 atividades completas com aviso do Desafio Final pendente", document.getElementById('panel-list').textContent.includes('7/7 atividades — falta o 🏁 Desafio Final'));

provaPassed["silabas"] = true;
provaScores["silabas"] = {overallPct:100, perActivity:[], passed:true};
check("Módulo 2 unlocked depois da prova aprovada", isModuleUnlocked(PT_MODULES_BENJAMIN.find(m=>m.id==='leitura')) === true);

openPanel();
check("panel shows 7/7 aprovado depois da prova", document.getElementById('panel-list').textContent.includes('7/7 atividades + 🏁 aprovado'));

// reset and test a session end -> level up flow for pares_minimos
activityLevel.pares_minimos = 1;
mastery['pares_minimos:1'] = [];
startGame('pares_minimos');
check("game screen active after startGame", document.getElementById('screen-game').classList.contains('active'));
// simulate winning all rounds
for(let i=0;i<state.totalRounds;i++){
  const opts = document.querySelectorAll('.option-btn');
  // find correct option by trying each (test harness trick: click all, first success stops via disableOptions)
  let clicked = false;
  for(const b of opts){
    if(!b.onclick) continue;
    const before = state.sessionStars;
    b.onclick();
    if(state.sessionStars > before){ clicked = true; break; }
  }
  if(!clicked) console.log("  no correct click found round " + i);
}
check("session ended on end screen", document.getElementById('screen-end').classList.contains('active'));
check("mastery recorded for pares_minimos:1", mastery['pares_minimos:1'] && mastery['pares_minimos:1'].length > 0);

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;

html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', ()=>{}); // ignore async timer noise after test completes
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
