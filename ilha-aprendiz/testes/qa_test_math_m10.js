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
testMC("ordem_do_dia", 60, ()=>2);
testMC("que_dia_e_hoje", 60, ()=>3);
testMC("escreva_a_data", 60, ()=>3);

// mm10FullyMastered gating
activityLevel.ordem_do_dia=1; mastery['ordem_do_dia:1']=[];
activityLevel.que_dia_e_hoje=1; mastery['que_dia_e_hoje:1']=[];
activityLevel.escreva_a_data=1; mastery['escreva_a_data:1']=[];
check("mm10FullyMastered false when not maxed", mm10FullyMastered() === false);
MM10_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
check("mm10FullyMastered true when all maxed", mm10FullyMastered() === true);

const mm10Mod = ALL_MODULES_BENJAMIN.find(m=>m.id==='mm10_tempo');
check("M10 de Matemática sempre desbloqueado", isModuleUnlocked(mm10Mod) === true);

selectChild('benjamin');
openMaterias();
openModulos('matematica');
const modulosHtml = document.getElementById('modulos-grid').innerHTML;
check("tela de módulos de Matemática mostra M10 (Tempo e Calendário)", modulosHtml.includes('M10') && modulosHtml.includes('Tempo e Calendário'));
check("tela de módulos ainda mostra os módulos anteriores (M1 a M9)", modulosHtml.includes('M1') && modulosHtml.includes('M2') && modulosHtml.includes('M3') && modulosHtml.includes('M4') && modulosHtml.includes('M5') && modulosHtml.includes('M6') && modulosHtml.includes('M7') && modulosHtml.includes('M8') && modulosHtml.includes('M9'));
openAtividades('mm10_tempo');
const gridHtml = document.getElementById('atividades-grid').innerHTML;
check("atividades do M10 mostra 3 atividades", document.querySelectorAll('#atividades-grid .game-card').length >= 3);
check("atividades do M10 mostra Ordem do Dia", gridHtml.includes('Ordem do Dia'));
check("atividades do M10 mostra Que Dia é Hoje?", gridHtml.includes('Que Dia é Hoje?'));
check("atividades do M10 mostra Escreva a Data", gridHtml.includes('Escreva a Data'));

openAdmin();
const adminHtml = document.getElementById('admin-list').innerHTML;
check("admin mostra M10 de Matemática (3 atividades com nível)", adminHtml.includes('M10') && adminHtml.includes('(3 atividades com nível)'));

openPanel();
const panelHtml = document.getElementById('panel-list').innerHTML;
check("painel mostra atividades certas do M10 de Matemática", panelHtml.includes('Ordem do Dia') && panelHtml.includes('Escreva a Data'));

['ordem_do_dia','que_dia_e_hoje','escreva_a_data'].forEach(g=>{
  let lastSpoken = [];
  const origSpeak = speak;
  speak = function(t){ lastSpoken.push(t); return origSpeak(t); };
  state.game=g; state.subgames=[g]; state.round=1; state.totalRounds=1;
  state.pools={}; state.roundPlan=[g]; state.currentRender=g;
  renderRound();
  check(g + ": speaks instruction automatically", lastSpoken.length > 0 && lastSpoken[0].length > 5);
});

// Que Dia é Hoje?: nível 1 só período, nível 2 só período/dia (sem mês), nível 3+ pode ter mês
let level1OnlyPeriodo = true, level2NoMonth = true;
activityLevel.que_dia_e_hoje = 1;
for(let i=0;i<30;i++){
  state.game='que_dia_e_hoje'; state.subgames=['que_dia_e_hoje']; state.round=1; state.totalRounds=1;
  state.pools={}; state.roundPlan=['que_dia_e_hoje']; state.currentRender='que_dia_e_hoje';
  renderRound();
  const p = document.querySelector('.prompt').textContent;
  if(!p.includes('período')) level1OnlyPeriodo = false;
}
activityLevel.que_dia_e_hoje = 2;
for(let i=0;i<30;i++){
  state.game='que_dia_e_hoje'; state.subgames=['que_dia_e_hoje']; state.round=1; state.totalRounds=1;
  state.pools={}; state.roundPlan=['que_dia_e_hoje']; state.currentRender='que_dia_e_hoje';
  renderRound();
  const p = document.querySelector('.prompt').textContent;
  if(p.includes('mês')) level2NoMonth = false;
}
check("Que Dia é Hoje?: nível 1 só pergunta período do dia", level1OnlyPeriodo);
check("Que Dia é Hoje?: nível 2 nunca pergunta mês", level2NoMonth);

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', ()=>{});
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
