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

// 1. every WRITING_PAIRS entry has distinct correct/wrong text and a visual
let dataOk = true;
WRITING_PAIRS.forEach(p=>{
  if(p.correct === p.wrong){ console.log("SAME correct/wrong: " + p.correct); dataOk = false; }
  if(!p.emoji && !p.svg){ console.log("NO VISUAL for: " + p.correct); dataOk = false; }
});
check("every WRITING_PAIRS entry has distinct correct/wrong and a visual", dataOk);

// 2. renderEscritaCerta across all 5 levels, 30 rounds each
for(let lvl=1; lvl<=5; lvl++){
  activityLevel.escrita_certa = lvl;
  mastery["escrita_certa:"+lvl] = [];
  let errors = 0, correctFound = 0;
  for(let round=0; round<30; round++){
    state.game="escrita_certa"; state.subgames=["escrita_certa"]; state.round=1; state.totalRounds=1;
    state.pools={}; state.roundPlan=["escrita_certa"]; state.currentRender="escrita_certa";
    state.roundFirstTryUsed=false;
    try{ renderRound(); }catch(e){ console.log("RENDER ERROR L"+lvl+": "+e.message); errors++; continue; }
    const opts = document.querySelectorAll('.option-btn');
    if(opts.length !== 2){ console.log("WARN opts!=2 L"+lvl+": "+opts.length); errors++; continue; }
    const texts = Array.from(opts).map(o=>o.textContent);
    if(new Set(texts).size !== 2){ console.log("WARN duplicate option text L"+lvl+": "+texts.join("|")); errors++; }
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
  check("escrita_certa L"+lvl+": 30 rounds no errors", errors===0);
  check("escrita_certa L"+lvl+": correct answer always found", correctFound===30);
}

// 3. module2FullyMastered now requires 3 activities, not 2
activityLevel.leitura = 5; mastery['leitura:5'] = [true,true,true,true,true,true,true,true,true,false];
activityLevel.frases_leitura = 5; mastery['frases_leitura:5'] = [true,true,true,true,true,true,true,true,true,false];
activityLevel.escrita_certa = 1; mastery['escrita_certa:1'] = [];
check("module2FullyMastered false with only 2 of 3 activities maxed", module2FullyMastered() === false);
activityLevel.escrita_certa = 5; mastery['escrita_certa:5'] = [true,true,true,true,true,true,true,true,true,false];
check("module2FullyMastered true with all 3 activities maxed", module2FullyMastered() === true);

// 4. menu shows 3 activities for Módulo 2 when unlocked (Módulo 1 dominado + Desafio Final aprovado)
MODULE1_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
provaPassed["silabas"] = true;
provaScores["silabas"] = {overallPct:100, perActivity:[], passed:true};
selectChild('benjamin');
openMaterias();
openModulos('portugues');
const modulosHtml = document.getElementById('modulos-grid').innerHTML;
check("menu shows Módulo 2", modulosHtml.includes('Módulo 2'));
openAtividades('leitura');
const gridHtml = document.getElementById('atividades-grid').innerHTML;
check("menu shows 3 activity cards for Módulo 2", document.querySelectorAll('#atividades-grid .game-card').length >= 3);
check("menu shows Escrita Certa card", gridHtml.includes('Escrita Certa'));

// 5. admin panel shows Escrita Certa leveled section
openAdmin();
const adminHtml = document.getElementById('admin-list').innerHTML;
check("admin shows Escrita Certa", adminHtml.includes('Escrita Certa'));
check("admin Módulo 2 section says 3 atividades", adminHtml.includes('Módulo 2') && adminHtml.includes('(3 atividades com nível)'));

// 6. speak() coverage
let lastSpoken = [];
const origSpeak = speak;
speak = function(t){ lastSpoken.push(t); return origSpeak(t); };
state.game="escrita_certa"; state.subgames=["escrita_certa"]; state.round=1; state.totalRounds=1;
state.pools={}; state.roundPlan=["escrita_certa"]; state.currentRender="escrita_certa";
renderRound();
check("escrita_certa speaks instruction automatically", lastSpoken.length > 0 && lastSpoken[0].includes("escrita do jeito certo"));

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', ()=>{});
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
