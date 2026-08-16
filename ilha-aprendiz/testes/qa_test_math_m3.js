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
testMC("qual_e_maior", 60, ()=>2);
testMC("organize_por_tamanho", 60);
testMC("o_que_vem_depois", 60, ()=>3);

// mm3FullyMastered gating
activityLevel.qual_e_maior=1; mastery['qual_e_maior:1']=[];
activityLevel.organize_por_tamanho=1; mastery['organize_por_tamanho:1']=[];
activityLevel.o_que_vem_depois=1; mastery['o_que_vem_depois:1']=[];
check("mm3FullyMastered false when not maxed", mm3FullyMastered() === false);
MM3_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
check("mm3FullyMastered true when all maxed", mm3FullyMastered() === true);

const mm3Mod = ALL_MODULES_BENJAMIN.find(m=>m.id==='mm3_comparar');
check("M3 de Matemática sempre desbloqueado", isModuleUnlocked(mm3Mod) === true);

selectChild('benjamin');
openMaterias();
openModulos('matematica');
const modulosHtml = document.getElementById('modulos-grid').innerHTML;
check("tela de módulos de Matemática mostra M3 (Comparar, Ordenar e Sequenciar)", modulosHtml.includes('M3') && modulosHtml.includes('Comparar, Ordenar e Sequenciar'));
check("tela de módulos ainda mostra os módulos anteriores (M1 a M2)", modulosHtml.includes('M1') && modulosHtml.includes('M2'));
openAtividades('mm3_comparar');
const gridHtml = document.getElementById('atividades-grid').innerHTML;
check("atividades do M3 mostra 3 atividades", document.querySelectorAll('#atividades-grid .game-card').length >= 3);
check("atividades do M3 mostra Qual é Maior?", gridHtml.includes('Qual é Maior?'));
check("atividades do M3 mostra Organize por Tamanho", gridHtml.includes('Organize por Tamanho'));
check("atividades do M3 mostra O Que Vem Depois?", gridHtml.includes('O Que Vem Depois?'));

openAdmin();
const adminHtml = document.getElementById('admin-list').innerHTML;
check("admin mostra M3 de Matemática (3 atividades com nível)", adminHtml.includes('Comparar, Ordenar e Sequenciar') && adminHtml.includes('(3 atividades com nível)'));

openPanel();
const panelHtml = document.getElementById('panel-list').innerHTML;
check("painel mostra atividades certas do M3 de Matemática", panelHtml.includes('Qual é Maior?') && panelHtml.includes('O Que Vem Depois?'));

['qual_e_maior','organize_por_tamanho','o_que_vem_depois'].forEach(g=>{
  let lastSpoken = [];
  const origSpeak = speak;
  speak = function(t){ lastSpoken.push(t); return origSpeak(t); };
  state.game=g; state.subgames=[g]; state.round=1; state.totalRounds=1;
  state.pools={}; state.roundPlan=[g]; state.currentRender=g;
  renderRound();
  check(g + ": speaks instruction automatically", lastSpoken.length > 0 && lastSpoken[0].length > 5);
});

// regra sempre explicitada no texto visivel (não só falada) — pedido explícito do Júlio
activityLevel.o_que_vem_depois = 5;
let ruleAlwaysShown = true;
for(let i=0;i<40;i++){
  state.game='o_que_vem_depois'; state.subgames=['o_que_vem_depois']; state.round=1; state.totalRounds=1;
  state.pools={}; state.roundPlan=['o_que_vem_depois']; state.currentRender='o_que_vem_depois';
  renderRound();
  if(!document.getElementById("game-stage").innerHTML.includes('A regra é')) ruleAlwaysShown = false;
}
check("O Que Vem Depois?: regra sempre explicitada no texto (nunca só falada)", ruleAlwaysShown);

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', ()=>{});
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
