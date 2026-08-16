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
testMC("vai_acontecer", 60, ()=>3);
testMC("leia_o_grafico", 60, ()=>3);

// mm12FullyMastered gating
activityLevel.vai_acontecer=1; mastery['vai_acontecer:1']=[];
activityLevel.leia_o_grafico=1; mastery['leia_o_grafico:1']=[];
check("mm12FullyMastered false when not maxed", mm12FullyMastered() === false);
MM12_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
check("mm12FullyMastered true when all maxed", mm12FullyMastered() === true);

const mm12Mod = ALL_MODULES_BENJAMIN.find(m=>m.id==='mm12_probabilidade');
check("M12 de Matemática sempre desbloqueado", isModuleUnlocked(mm12Mod) === true);

selectChild('benjamin');
openMaterias();
openModulos('matematica');
const modulosHtml = document.getElementById('modulos-grid').innerHTML;
check("tela de módulos de Matemática mostra M12 (Probabilidade e Gráficos)", modulosHtml.includes('M12') && modulosHtml.includes('Probabilidade e Gráficos'));
check("tela de módulos ainda mostra os módulos anteriores (M1 a M11)", modulosHtml.includes('M1') && modulosHtml.includes('M2') && modulosHtml.includes('M3') && modulosHtml.includes('M4') && modulosHtml.includes('M5') && modulosHtml.includes('M6') && modulosHtml.includes('M7') && modulosHtml.includes('M8') && modulosHtml.includes('M9') && modulosHtml.includes('M10') && modulosHtml.includes('M11'));
openAtividades('mm12_probabilidade');
const gridHtml = document.getElementById('atividades-grid').innerHTML;
check("atividades do M12 mostra 2 atividades", document.querySelectorAll('#atividades-grid .game-card').length >= 2);
check("atividades do M12 mostra Vai Acontecer?", gridHtml.includes('Vai Acontecer?'));
check("atividades do M12 mostra Leia o Gráfico", gridHtml.includes('Leia o Gráfico'));

openAdmin();
const adminHtml = document.getElementById('admin-list').innerHTML;
check("admin mostra M12 de Matemática (2 atividades com nível)", adminHtml.includes('M12') && adminHtml.includes('(2 atividades com nível)'));

openPanel();
const panelHtml = document.getElementById('panel-list').innerHTML;
check("painel mostra atividades certas do M12 de Matemática", panelHtml.includes('Vai Acontecer?') && panelHtml.includes('Leia o Gráfico'));

['vai_acontecer','leia_o_grafico'].forEach(g=>{
  let lastSpoken = [];
  const origSpeak = speak;
  speak = function(t){ lastSpoken.push(t); return origSpeak(t); };
  state.game=g; state.subgames=[g]; state.round=1; state.totalRounds=1;
  state.pools={}; state.roundPlan=[g]; state.currentRender=g;
  renderRound();
  check(g + ": speaks instruction automatically", lastSpoken.length > 0 && lastSpoken[0].length > 5);
});

// Leia o Gráfico: nível 1 só pergunta mais/menos (nunca "quantos" ou "diferença")
let level1OnlyMaisMenos = true;
activityLevel.leia_o_grafico = 1;
for(let i=0;i<30;i++){
  state.game='leia_o_grafico'; state.subgames=['leia_o_grafico']; state.round=1; state.totalRounds=1;
  state.pools={}; state.roundPlan=['leia_o_grafico']; state.currentRender='leia_o_grafico';
  renderRound();
  const p = document.querySelector('.prompt').textContent;
  if(!(p.includes('MAIS') || p.includes('MENOS'))) level1OnlyMaisMenos = false;
}
check("Leia o Gráfico: nível 1 só pergunta mais/menos", level1OnlyMaisMenos);

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', ()=>{});
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
