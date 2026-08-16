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
testMC("onde_esta", 60, ()=>3);
testMC("siga_o_mapa", 60); // opts varia (4 single-axis nível 1-3, 3 diagonal nível 4-5)

// mm7FullyMastered gating
activityLevel.onde_esta=1; mastery['onde_esta:1']=[];
activityLevel.siga_o_mapa=1; mastery['siga_o_mapa:1']=[];
check("mm7FullyMastered false when not maxed", mm7FullyMastered() === false);
MM7_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
check("mm7FullyMastered true when all maxed", mm7FullyMastered() === true);

const mm7Mod = ALL_MODULES_BENJAMIN.find(m=>m.id==='mm7_espaco');
check("M7 de Matemática sempre desbloqueado", isModuleUnlocked(mm7Mod) === true);

selectChild('benjamin');
openMaterias();
openModulos('matematica');
const modulosHtml = document.getElementById('modulos-grid').innerHTML;
check("tela de módulos de Matemática mostra M7 (Espaço e Localização)", modulosHtml.includes('M7') && modulosHtml.includes('Espaço e Localização'));
check("tela de módulos ainda mostra os módulos anteriores (M1 a M6)", modulosHtml.includes('M1') && modulosHtml.includes('M2') && modulosHtml.includes('M3') && modulosHtml.includes('M4') && modulosHtml.includes('M5') && modulosHtml.includes('M6'));
openAtividades('mm7_espaco');
const gridHtml = document.getElementById('atividades-grid').innerHTML;
check("atividades do M7 mostra 2 atividades", document.querySelectorAll('#atividades-grid .game-card').length >= 2);
check("atividades do M7 mostra Onde Está?", gridHtml.includes('Onde Está?'));
check("atividades do M7 mostra Siga o Mapa", gridHtml.includes('Siga o Mapa'));

openAdmin();
const adminHtml = document.getElementById('admin-list').innerHTML;
check("admin mostra M7 de Matemática (2 atividades com nível)", adminHtml.includes('M7') && adminHtml.includes('(2 atividades com nível)'));

openPanel();
const panelHtml = document.getElementById('panel-list').innerHTML;
check("painel mostra atividades certas do M7 de Matemática", panelHtml.includes('Onde Está?') && panelHtml.includes('Siga o Mapa'));

['onde_esta','siga_o_mapa'].forEach(g=>{
  let lastSpoken = [];
  const origSpeak = speak;
  speak = function(t){ lastSpoken.push(t); return origSpeak(t); };
  state.game=g; state.subgames=[g]; state.round=1; state.totalRounds=1;
  state.pools={}; state.roundPlan=[g]; state.currentRender=g;
  renderRound();
  check(g + ": speaks instruction automatically", lastSpoken.length > 0 && lastSpoken[0].length > 5);
});

// Siga o Mapa nível 1-3 sempre 4 opções (single-axis), nível 4-5 sempre 3 opções (diagonal 2-passos)
let axisOptsOk = true, diagOptsOk = true;
[1,2,3].forEach(lvl=>{
  activityLevel.siga_o_mapa = lvl;
  for(let i=0;i<20;i++){
    state.game='siga_o_mapa'; state.subgames=['siga_o_mapa']; state.round=1; state.totalRounds=1;
    state.pools={}; state.roundPlan=['siga_o_mapa']; state.currentRender='siga_o_mapa';
    renderRound();
    if(document.querySelectorAll('.option-btn').length !== 4) axisOptsOk = false;
  }
});
[4,5].forEach(lvl=>{
  activityLevel.siga_o_mapa = lvl;
  for(let i=0;i<20;i++){
    state.game='siga_o_mapa'; state.subgames=['siga_o_mapa']; state.round=1; state.totalRounds=1;
    state.pools={}; state.roundPlan=['siga_o_mapa']; state.currentRender='siga_o_mapa';
    renderRound();
    if(document.querySelectorAll('.option-btn').length !== 3) diagOptsOk = false;
  }
});
check("Siga o Mapa: níveis 1-3 sempre 4 opções (1 direção)", axisOptsOk);
check("Siga o Mapa: níveis 4-5 sempre 3 opções (2 direções em sequência)", diagOptsOk);

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', ()=>{});
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
