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

function testMC(gameId, roundsPerLevel){
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
testMC("conta_ate_100", 60);
testMC("pulando_de_10", 60);

// mm2FullyMastered gating
activityLevel.conta_ate_100=1; mastery['conta_ate_100:1']=[];
activityLevel.pulando_de_10=1; mastery['pulando_de_10:1']=[];
check("mm2FullyMastered false when not maxed", mm2FullyMastered() === false);
MM2_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
check("mm2FullyMastered true when all maxed", mm2FullyMastered() === true);

const mm2Mod = ALL_MODULES_BENJAMIN.find(m=>m.id==='mm2_contagem100');
check("M2 de Matemática sempre desbloqueado", isModuleUnlocked(mm2Mod) === true);

selectChild('benjamin');
openMaterias();
openModulos('matematica');
const modulosHtml = document.getElementById('modulos-grid').innerHTML;
check("tela de módulos de Matemática mostra M2 (Contagem até 100)", modulosHtml.includes('M2') && modulosHtml.includes('Contagem até 100'));
check("tela de módulos ainda mostra os módulos anteriores (M1)", modulosHtml.includes('M1'));
openAtividades('mm2_contagem100');
const gridHtml = document.getElementById('atividades-grid').innerHTML;
check("atividades do M2 mostra 2 atividades", document.querySelectorAll('#atividades-grid .game-card').length >= 2);
check("atividades do M2 mostra Conta Até 100", gridHtml.includes('Conta Até 100'));
check("atividades do M2 mostra Pulando de Tantos em Tantos", gridHtml.includes('Pulando de Tantos em Tantos'));

openAdmin();
const adminHtml = document.getElementById('admin-list').innerHTML;
check("admin mostra M2 de Matemática (2 atividades com nível)", adminHtml.includes('Contagem até 100') && adminHtml.includes('(2 atividades com nível)'));

openPanel();
const panelHtml = document.getElementById('panel-list').innerHTML;
check("painel mostra atividades certas do M2 de Matemática", panelHtml.includes('Conta Até 100') && panelHtml.includes('Pulando de Tantos em Tantos'));

['conta_ate_100','pulando_de_10'].forEach(g=>{
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
