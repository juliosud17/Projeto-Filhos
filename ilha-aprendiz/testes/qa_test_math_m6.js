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
testMC("monte_o_numero", 60, ()=>3);
testMC("dezena_e_unidade", 60, ()=>3);

// mm6FullyMastered gating
activityLevel.monte_o_numero=1; mastery['monte_o_numero:1']=[];
activityLevel.dezena_e_unidade=1; mastery['dezena_e_unidade:1']=[];
check("mm6FullyMastered false when not maxed", mm6FullyMastered() === false);
MM6_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
check("mm6FullyMastered true when all maxed", mm6FullyMastered() === true);

const mm6Mod = ALL_MODULES_BENJAMIN.find(m=>m.id==='mm6_compor_decompor');
check("M6 de Matemática sempre desbloqueado", isModuleUnlocked(mm6Mod) === true);

selectChild('benjamin');
openMaterias();
openModulos('matematica');
const modulosHtml = document.getElementById('modulos-grid').innerHTML;
check("tela de módulos de Matemática mostra M6 (Compor e Decompor Números)", modulosHtml.includes('M6') && modulosHtml.includes('Compor e Decompor Números'));
check("tela de módulos ainda mostra os módulos anteriores (M1 a M5)", modulosHtml.includes('M1') && modulosHtml.includes('M2') && modulosHtml.includes('M3') && modulosHtml.includes('M4') && modulosHtml.includes('M5'));
openAtividades('mm6_compor_decompor');
const gridHtml = document.getElementById('atividades-grid').innerHTML;
check("atividades do M6 mostra 2 atividades", document.querySelectorAll('#atividades-grid .game-card').length >= 2);
check("atividades do M6 mostra Monte o Número", gridHtml.includes('Monte o Número'));
check("atividades do M6 mostra Dezena e Unidade", gridHtml.includes('Dezena e Unidade'));

openAdmin();
const adminHtml = document.getElementById('admin-list').innerHTML;
check("admin mostra M6 de Matemática (2 atividades com nível)", adminHtml.includes('M6') && adminHtml.includes('(2 atividades com nível)'));

openPanel();
const panelHtml = document.getElementById('panel-list').innerHTML;
check("painel mostra atividades certas do M6 de Matemática", panelHtml.includes('Monte o Número') && panelHtml.includes('Dezena e Unidade'));

['monte_o_numero','dezena_e_unidade'].forEach(g=>{
  let lastSpoken = [];
  const origSpeak = speak;
  speak = function(t){ lastSpoken.push(t); return origSpeak(t); };
  state.game=g; state.subgames=[g]; state.round=1; state.totalRounds=1;
  state.pools={}; state.roundPlan=[g]; state.currentRender=g;
  renderRound();
  check(g + ": speaks instruction automatically", lastSpoken.length > 0 && lastSpoken[0].length > 5);
});

// vocabulário formal sempre explicado entre parênteses em Dezena e Unidade
let vocabAlwaysExplained = true;
for(let lvl=1; lvl<=5; lvl++){
  activityLevel.dezena_e_unidade = lvl;
  for(let i=0;i<30;i++){
    state.game='dezena_e_unidade'; state.subgames=['dezena_e_unidade']; state.round=1; state.totalRounds=1;
    state.pools={}; state.roundPlan=['dezena_e_unidade']; state.currentRender='dezena_e_unidade';
    renderRound();
    const html2 = document.getElementById("game-stage").innerHTML;
    const hasExplain = html2.includes("grupos de 10");
    if(!hasExplain) vocabAlwaysExplained = false;
  }
}
check("Dezena e Unidade: vocabulário formal sempre explicado (grupos de 10)", vocabAlwaysExplained);

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', ()=>{});
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
