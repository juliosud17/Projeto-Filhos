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
testMC("fatos_da_soma", 60, ()=>3);
testMC("problemas_de_somar", 60, ()=>3);

// mm4FullyMastered gating
activityLevel.fatos_da_soma=1; mastery['fatos_da_soma:1']=[];
activityLevel.problemas_de_somar=1; mastery['problemas_de_somar:1']=[];
check("mm4FullyMastered false when not maxed", mm4FullyMastered() === false);
MM4_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
check("mm4FullyMastered true when all maxed", mm4FullyMastered() === true);

const mm4Mod = ALL_MODULES_BENJAMIN.find(m=>m.id==='mm4_adicao');
check("M4 de Matemática sempre desbloqueado", isModuleUnlocked(mm4Mod) === true);

selectChild('benjamin');
openMaterias();
openModulos('matematica');
const modulosHtml = document.getElementById('modulos-grid').innerHTML;
check("tela de módulos de Matemática mostra M4 (Adição)", modulosHtml.includes('M4') && modulosHtml.includes('Adição'));
check("tela de módulos ainda mostra os módulos anteriores (M1 a M3)", modulosHtml.includes('M1') && modulosHtml.includes('M2') && modulosHtml.includes('M3'));
openAtividades('mm4_adicao');
const gridHtml = document.getElementById('atividades-grid').innerHTML;
check("atividades do M4 mostra 2 atividades", document.querySelectorAll('#atividades-grid .game-card').length >= 2);
check("atividades do M4 mostra Fatos da Soma", gridHtml.includes('Fatos da Soma'));
check("atividades do M4 mostra Problemas de Somar", gridHtml.includes('Problemas de Somar'));

openAdmin();
const adminHtml = document.getElementById('admin-list').innerHTML;
check("admin mostra M4 de Matemática (2 atividades com nível)", adminHtml.includes('M4') && adminHtml.includes('(2 atividades com nível)'));

openPanel();
const panelHtml = document.getElementById('panel-list').innerHTML;
check("painel mostra atividades certas do M4 de Matemática", panelHtml.includes('Fatos da Soma') && panelHtml.includes('Problemas de Somar'));

['fatos_da_soma','problemas_de_somar'].forEach(g=>{
  let lastSpoken = [];
  const origSpeak = speak;
  speak = function(t){ lastSpoken.push(t); return origSpeak(t); };
  state.game=g; state.subgames=[g]; state.round=1; state.totalRounds=1;
  state.pools={}; state.roundPlan=[g]; state.currentRender=g;
  renderRound();
  check(g + ": speaks instruction automatically", lastSpoken.length > 0 && lastSpoken[0].length > 5);
});

// soma nunca estoura o teto de 20 (fatos básicos) em nenhum nível
let sumOk = true;
for(let lvl=1; lvl<=5; lvl++){
  activityLevel.fatos_da_soma = lvl;
  for(let i=0;i<40;i++){
    state.game='fatos_da_soma'; state.subgames=['fatos_da_soma']; state.round=1; state.totalRounds=1;
    state.pools={}; state.roundPlan=['fatos_da_soma']; state.currentRender='fatos_da_soma';
    renderRound();
    const promptText = document.querySelector('.prompt').textContent;
    const m = promptText.match(/Quanto é (\\d+) \\+ (\\d+)\\?/);
    if(!m || (parseInt(m[1])+parseInt(m[2])) > 20) sumOk = false;
  }
}
check("Fatos da Soma: soma nunca passa de 20 em nenhum nível", sumOk);

// apoio visual concreto sempre presente (nunca só a conta abstrata sozinha)
let visualAlwaysShown = true;
for(let lvl=1; lvl<=5; lvl++){
  activityLevel.fatos_da_soma = lvl;
  for(let i=0;i<20;i++){
    state.game='fatos_da_soma'; state.subgames=['fatos_da_soma']; state.round=1; state.totalRounds=1;
    state.pools={}; state.roundPlan=['fatos_da_soma']; state.currentRender='fatos_da_soma';
    renderRound();
    const rows = document.querySelectorAll('.big-emoji-row');
    if(rows.length < 2 || !rows[0].textContent.trim() || !rows[1].textContent.trim()) visualAlwaysShown = false;
  }
}
check("Fatos da Soma: apoio visual concreto sempre presente nos 5 níveis", visualAlwaysShown);

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', ()=>{});
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
