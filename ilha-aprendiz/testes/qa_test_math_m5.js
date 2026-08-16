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

function testMC(gameId, roundsPerLevel, expectedOptsFn){
  for(let lvl=1; lvl<=5; lvl++){
    activityLevel[gameId] = lvl;
    mastery[gameId+":"+lvl] = [];
    let errors=0, correctFound=0;
    for(let round=0; round<roundsPerLevel; round++){
      state.game=gameId; state.subgames=[gameId]; state.round=1; state.totalRounds=1;
      state.pools={}; state.roundPlan=[gameId]; state.currentRender=gameId;
      state.roundFirstTryUsed=false;
      try{ renderRound(); }catch(e){ console.log("RENDER ERROR "+gameId+" L"+lvl+": "+e.message); errors++; continue; }
      const opts = document.querySelectorAll('.option-btn');
      const expected = expectedOptsFn ? expectedOptsFn() : null;
      if(expected && opts.length !== expected){ console.log("WARN opts!="+expected+" "+gameId+" L"+lvl+": "+opts.length); errors++; continue; }
      if(opts.length < 2){ console.log("WARN opts<2 "+gameId+" L"+lvl+": "+opts.length); errors++; continue; }
      const texts = Array.from(opts).map(o=>o.textContent);
      if(new Set(texts).size !== texts.length){ console.log("WARN duplicate option "+gameId+" L"+lvl+": "+texts.join("|")); errors++; }
      state.sessionStars=0; let found=false;
      for(const b of opts){
        const before=state.sessionStars;
        if(b.onclick) b.onclick();
        if(state.sessionStars>before){ found=true; correctFound++; break; }
        state.roundFirstTryUsed=false;
      }
      if(!found){ console.log("no correct "+gameId+" L"+lvl); errors++; }
    }
    check(gameId+" L"+lvl+": no errors ("+roundsPerLevel+" rounds)", errors===0);
    check(gameId+" L"+lvl+": correct always found", correctFound===roundsPerLevel);
  }
}
testMC("fatos_da_subtracao", 60, ()=>3);
testMC("problemas_de_tirar", 60, ()=>3);
testMC("soma_ou_subtracao", 60, ()=>2);

// resultado nunca negativo em Fatos da Subtração / Problemas de Tirar
let neverNegative = true;
['fatos_da_subtracao'].forEach(g=>{
  for(let lvl=1; lvl<=5; lvl++){
    activityLevel[g]=lvl;
    for(let i=0;i<30;i++){
      state.game=g; state.subgames=[g]; state.round=1; state.totalRounds=1;
      state.pools={}; state.roundPlan=[g]; state.currentRender=g;
      renderRound();
      const promptText = document.querySelector('.prompt').textContent;
      const m = promptText.match(/Tinha (\\d+), tiraram (\\d+)/);
      if(!m || (parseInt(m[1])-parseInt(m[2])) < 0) neverNegative = false;
    }
  }
});
check("Fatos da Subtração: resultado nunca negativo", neverNegative);

// mm5FullyMastered gating
activityLevel.fatos_da_subtracao=1; mastery['fatos_da_subtracao:1']=[];
activityLevel.problemas_de_tirar=1; mastery['problemas_de_tirar:1']=[];
activityLevel.soma_ou_subtracao=1; mastery['soma_ou_subtracao:1']=[];
check("mm5FullyMastered false when not maxed", mm5FullyMastered() === false);
MM5_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
check("mm5FullyMastered true when all maxed", mm5FullyMastered() === true);

const mm5Mod = ALL_MODULES_BENJAMIN.find(m=>m.id==='mm5_subtracao');
check("M5 de Matemática sempre desbloqueado", isModuleUnlocked(mm5Mod) === true);

selectChild('benjamin');
openMaterias();
openModulos('matematica');
const modulosHtml = document.getElementById('modulos-grid').innerHTML;
check("tela de módulos de Matemática mostra M5 (Subtração e Problemas)", modulosHtml.includes('M5') && modulosHtml.includes('Subtração e Problemas'));
check("tela de módulos ainda mostra os módulos anteriores (M1 a M4)", modulosHtml.includes('M1') && modulosHtml.includes('M2') && modulosHtml.includes('M3') && modulosHtml.includes('M4'));
openAtividades('mm5_subtracao');
const gridHtml = document.getElementById('atividades-grid').innerHTML;
check("atividades do M5 mostra 3 atividades", document.querySelectorAll('#atividades-grid .game-card').length >= 3);
check("atividades do M5 mostra Fatos da Subtração", gridHtml.includes('Fatos da Subtração'));
check("atividades do M5 mostra Problemas de Tirar", gridHtml.includes('Problemas de Tirar'));
check("atividades do M5 mostra Soma ou Subtração?", gridHtml.includes('Soma ou Subtração?'));

openAdmin();
const adminHtml = document.getElementById('admin-list').innerHTML;
check("admin mostra M5 de Matemática (3 atividades com nível)", adminHtml.includes('M5') && adminHtml.includes('(3 atividades com nível)'));

openPanel();
const panelHtml = document.getElementById('panel-list').innerHTML;
check("painel mostra atividades certas do M5 de Matemática", panelHtml.includes('Fatos da Subtração') && panelHtml.includes('Soma ou Subtração?'));

['fatos_da_subtracao','problemas_de_tirar','soma_ou_subtracao'].forEach(g=>{
  let lastSpoken = [];
  const origSpeak = speak;
  speak = function(t){ lastSpoken.push(t); return origSpeak(t); };
  state.game=g; state.subgames=[g]; state.round=1; state.totalRounds=1;
  state.pools={}; state.roundPlan=[g]; state.currentRender=g;
  renderRound();
  check(g + ": speaks instruction automatically", lastSpoken.length > 0 && lastSpoken[0].length > 5);
});

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', ()=>{});
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
