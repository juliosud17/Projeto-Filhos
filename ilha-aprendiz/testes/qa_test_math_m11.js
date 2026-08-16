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
testMC("quanto_vale", 60, ()=>3);
testMC("junte_pra_comprar", 60, ()=>3);

// mm11FullyMastered gating
activityLevel.quanto_vale=1; mastery['quanto_vale:1']=[];
activityLevel.junte_pra_comprar=1; mastery['junte_pra_comprar:1']=[];
check("mm11FullyMastered false when not maxed", mm11FullyMastered() === false);
MM11_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
check("mm11FullyMastered true when all maxed", mm11FullyMastered() === true);

const mm11Mod = ALL_MODULES_BENJAMIN.find(m=>m.id==='mm11_dinheiro');
check("M11 de Matemática sempre desbloqueado", isModuleUnlocked(mm11Mod) === true);

selectChild('benjamin');
openMaterias();
openModulos('matematica');
const modulosHtml = document.getElementById('modulos-grid').innerHTML;
check("tela de módulos de Matemática mostra M11 (Dinheiro)", modulosHtml.includes('M11') && modulosHtml.includes('Dinheiro'));
check("tela de módulos ainda mostra os módulos anteriores (M1 a M10)", modulosHtml.includes('M1') && modulosHtml.includes('M2') && modulosHtml.includes('M3') && modulosHtml.includes('M4') && modulosHtml.includes('M5') && modulosHtml.includes('M6') && modulosHtml.includes('M7') && modulosHtml.includes('M8') && modulosHtml.includes('M9') && modulosHtml.includes('M10'));
openAtividades('mm11_dinheiro');
const gridHtml = document.getElementById('atividades-grid').innerHTML;
check("atividades do M11 mostra 2 atividades", document.querySelectorAll('#atividades-grid .game-card').length >= 2);
check("atividades do M11 mostra Quanto Vale?", gridHtml.includes('Quanto Vale?'));
check("atividades do M11 mostra Junte pra Comprar", gridHtml.includes('Junte pra Comprar'));

openAdmin();
const adminHtml = document.getElementById('admin-list').innerHTML;
check("admin mostra M11 de Matemática (2 atividades com nível)", adminHtml.includes('M11') && adminHtml.includes('(2 atividades com nível)'));

openPanel();
const panelHtml = document.getElementById('panel-list').innerHTML;
check("painel mostra atividades certas do M11 de Matemática", panelHtml.includes('Quanto Vale?') && panelHtml.includes('Junte pra Comprar'));

['quanto_vale','junte_pra_comprar'].forEach(g=>{
  let lastSpoken = [];
  const origSpeak = speak;
  speak = function(t){ lastSpoken.push(t); return origSpeak(t); };
  state.game=g; state.subgames=[g]; state.round=1; state.totalRounds=1;
  state.pools={}; state.roundPlan=[g]; state.currentRender=g;
  renderRound();
  check(g + ": speaks instruction automatically", lastSpoken.length > 0 && lastSpoken[0].length > 5);
});

// Quanto Vale?: moedas de centavos (R$0,05/0,10/0,25/0,50) só a partir do nível 4
let earlyLevelsNoCentavos = true;
[1,2,3].forEach(lvl=>{
  activityLevel.quanto_vale = lvl;
  for(let i=0;i<30;i++){
    state.game='quanto_vale'; state.subgames=['quanto_vale']; state.round=1; state.totalRounds=1;
    state.pools={}; state.roundPlan=['quanto_vale']; state.currentRender='quanto_vale';
    renderRound();
    const html2 = document.getElementById("game-stage").innerHTML;
    if(html2.includes('R\$ 0,05') || html2.includes('R\$ 0,10') || html2.includes('R\$ 0,25')) earlyLevelsNoCentavos = false;
  }
});
check("Quanto Vale?: moedas de centavos só aparecem a partir do nível 4", earlyLevelsNoCentavos);

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', ()=>{});
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
