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

// 1. renderFrasesLeitura at each level, 40 rounds (mix of count/position questions)
for(let lvl=1; lvl<=5; lvl++){
  activityLevel.frases_leitura = lvl;
  mastery["frases_leitura:"+lvl] = [];
  let errors = 0, correctFound = 0;
  for(let round=0; round<40; round++){
    state.game="frases_leitura"; state.subgames=["frases_leitura"]; state.round=1; state.totalRounds=1;
    state.pools={}; state.roundPlan=["frases_leitura"]; state.currentRender="frases_leitura";
    state.roundFirstTryUsed=false;
    try{ renderRound(); }catch(e){ console.log("RENDER ERROR L"+lvl+": "+e.message); errors++; continue; }
    const opts = document.querySelectorAll('.option-btn');
    if(opts.length < 2){ console.log("WARN too few opts L"+lvl+": "+opts.length); errors++; continue; }
    // no duplicate option values (would make a question ambiguous)
    const texts = Array.from(opts).map(o=>o.textContent);
    if(new Set(texts).size !== texts.length){ console.log("WARN duplicate option text L"+lvl+": "+texts.join("|")); errors++; }
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
  check("frases_leitura L"+lvl+": 40 rounds no errors", errors===0);
  check("frases_leitura L"+lvl+": correct answer always found", correctFound===40);
}

// 2. word-count consistency check for all PHRASES entries: level N phrase should have N+1 words
let countOk = true;
PHRASES.forEach(p=>{
  if(p.words.length !== p.level + 1){ console.log("MISMATCH level="+p.level+" words="+p.words.length+" -> "+p.words.join(" ")); countOk = false; }
});
check("every PHRASES entry has words.length === level+1", countOk);

// 3. every PHRASES entry has distinct words (no ambiguous first/last)
let distinctOk = true;
PHRASES.forEach(p=>{
  if(new Set(p.words).size !== p.words.length){ console.log("DUPLICATE WORD in: " + p.words.join(" ")); distinctOk = false; }
});
check("every PHRASES entry has all-distinct words", distinctOk);

// 4. module2FullyMastered gating
activityLevel.leitura = 1; mastery['leitura:1'] = [];
activityLevel.frases_leitura = 1; mastery['frases_leitura:1'] = [];
check("module2FullyMastered false when not maxed", module2FullyMastered() === false);
MODULE2_ACTIVITIES.forEach(a=>{
  activityLevel[a.id] = 5;
  mastery[a.id+":5"] = [true,true,true,true,true,true,true,true,true,false];
});
check("module2FullyMastered true after both activities maxed", module2FullyMastered() === true);

// 5. módulo 3 (frases) unlock now depends on module2FullyMastered E na prova (Desafio Final) aprovada
const frasesMod = PT_MODULES_BENJAMIN.find(m=>m.id==='frases');
check("Módulo 3 ainda BLOQUEADO com Módulo 2 dominado mas sem a prova aprovada", isModuleUnlocked(frasesMod) === false);
passProva("leitura");
check("Módulo 3 unlocked once Módulo 2 fully mastered + Desafio Final aprovado", isModuleUnlocked(frasesMod) === true);
activityLevel.frases_leitura = 1; mastery['frases_leitura:1'] = [];
check("Módulo 3 re-locks if only 1 of 2 Módulo 2 activities maxed", isModuleUnlocked(frasesMod) === false);
// restore
activityLevel.frases_leitura = 5; mastery['frases_leitura:5'] = [true,true,true,true,true,true,true,true,true,false];

// 6. menu renders Módulo 2 with 2 activity cards when unlocked (módulo 1 também precisa
// estar totalmente dominado E com o Desafio Final aprovado)
MODULE1_ACTIVITIES.forEach(a=>{
  activityLevel[a.id] = 5;
  mastery[a.id+":5"] = [true,true,true,true,true,true,true,true,true,false];
});
passProva("silabas");
selectChild('benjamin');
openMaterias();
openModulos('portugues');
const modulosHtml = document.getElementById('modulos-grid').innerHTML;
check("menu shows Módulo 2 section title", modulosHtml.includes('Módulo 2'));
openAtividades('leitura');
const gridHtml = document.getElementById('atividades-grid').innerHTML;
check("menu shows 2 activity cards for Módulo 2", document.querySelectorAll('#atividades-grid .game-card').length >= 2);
check("menu shows Leitura Rápida activity card", gridHtml.includes('Leitura Rápida'));
check("menu shows Leia a Frase activity card", gridHtml.includes('Leia a Frase'));

// 7. admin panel shows Módulo 2 section with both activities leveled
openAdmin();
const adminHtml = document.getElementById('admin-list').innerHTML;
check("admin shows Módulo 2 section", adminHtml.includes('Módulo 2'));
check("admin shows Leitura Rápida leveled rows", (adminHtml.match(/Leitura Rápida/g)||[]).length >= 1);
check("admin shows Leia a Frase leveled rows", (adminHtml.match(/Leia a Frase/g)||[]).length >= 1);

// 8. locked-state menu message is accurate when módulo 1 not yet mastered (regression on the generalized lock message)
Object.keys(activityLevel).forEach(k=>activityLevel[k]=1);
Object.keys(mastery).forEach(k=>delete mastery[k]);
Object.keys(provaPassed).forEach(k=>delete provaPassed[k]);
Object.keys(provaScores).forEach(k=>delete provaScores[k]);
selectChild('benjamin');
openMaterias();
openModulos('portugues');
const lockedHtml = document.getElementById('modulos-grid').innerHTML;
check("locked message references Módulo 1 when módulo1 not mastered", lockedHtml.includes('atividades do Módulo 1'));

// 9. speak() coverage still intact for frases_leitura
let lastSpoken = [];
const origSpeak = speak;
speak = function(t){ lastSpoken.push(t); return origSpeak(t); };
state.game="frases_leitura"; state.subgames=["frases_leitura"]; state.round=1; state.totalRounds=1;
state.pools={}; state.roundPlan=["frases_leitura"]; state.currentRender="frases_leitura";
renderRound();
check("frases_leitura speaks the instruction automatically", lastSpoken.length > 0 && (lastSpoken[0].includes("Quantas palavras") || lastSpoken[0].includes("Qual é a")));

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', ()=>{});
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
