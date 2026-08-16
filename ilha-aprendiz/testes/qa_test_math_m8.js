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
testMC("formas_no_mundo", 60, ()=>3);
testMC("nomeie_a_forma", 60, ()=>4);

// mm8FullyMastered gating
activityLevel.formas_no_mundo=1; mastery['formas_no_mundo:1']=[];
activityLevel.nomeie_a_forma=1; mastery['nomeie_a_forma:1']=[];
check("mm8FullyMastered false when not maxed", mm8FullyMastered() === false);
MM8_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
check("mm8FullyMastered true when all maxed", mm8FullyMastered() === true);

const mm8Mod = ALL_MODULES_BENJAMIN.find(m=>m.id==='mm8_formas');
check("M8 de Matemática sempre desbloqueado", isModuleUnlocked(mm8Mod) === true);

selectChild('benjamin');
openMaterias();
openModulos('matematica');
const modulosHtml = document.getElementById('modulos-grid').innerHTML;
check("tela de módulos de Matemática mostra M8 (Formas Geométricas)", modulosHtml.includes('M8') && modulosHtml.includes('Formas Geométricas'));
check("tela de módulos ainda mostra os módulos anteriores (M1 a M7)", modulosHtml.includes('M1') && modulosHtml.includes('M2') && modulosHtml.includes('M3') && modulosHtml.includes('M4') && modulosHtml.includes('M5') && modulosHtml.includes('M6') && modulosHtml.includes('M7'));
openAtividades('mm8_formas');
const gridHtml = document.getElementById('atividades-grid').innerHTML;
check("atividades do M8 mostra 2 atividades", document.querySelectorAll('#atividades-grid .game-card').length >= 2);
check("atividades do M8 mostra Formas no Mundo", gridHtml.includes('Formas no Mundo'));
check("atividades do M8 mostra Nomeie a Forma", gridHtml.includes('Nomeie a Forma'));

openAdmin();
const adminHtml = document.getElementById('admin-list').innerHTML;
check("admin mostra M8 de Matemática (2 atividades com nível)", adminHtml.includes('M8') && adminHtml.includes('(2 atividades com nível)'));

openPanel();
const panelHtml = document.getElementById('panel-list').innerHTML;
check("painel mostra atividades certas do M8 de Matemática", panelHtml.includes('Formas no Mundo') && panelHtml.includes('Nomeie a Forma'));

['formas_no_mundo','nomeie_a_forma'].forEach(g=>{
  let lastSpoken = [];
  const origSpeak = speak;
  speak = function(t){ lastSpoken.push(t); return origSpeak(t); };
  state.game=g; state.subgames=[g]; state.round=1; state.totalRounds=1;
  state.pools={}; state.roundPlan=[g]; state.currentRender=g;
  renderRound();
  check(g + ": speaks instruction automatically", lastSpoken.length > 0 && lastSpoken[0].length > 5);
});

// Nomeie a Forma: rotação sempre 0 nos níveis 1-2, e varia a partir do nível 3
let rotationOkLow = true, rotationVariesHigh = false;
[1,2].forEach(lvl=>{
  activityLevel.nomeie_a_forma = lvl;
  for(let i=0;i<20;i++){
    state.game='nomeie_a_forma'; state.subgames=['nomeie_a_forma']; state.round=1; state.totalRounds=1;
    state.pools={}; state.roundPlan=['nomeie_a_forma']; state.currentRender='nomeie_a_forma';
    renderRound();
    const html2 = document.getElementById("game-stage").innerHTML;
    if(!html2.includes('rotate(0deg)')) rotationOkLow = false;
  }
});
activityLevel.nomeie_a_forma = 5;
for(let i=0;i<20;i++){
  state.game='nomeie_a_forma'; state.subgames=['nomeie_a_forma']; state.round=1; state.totalRounds=1;
  state.pools={}; state.roundPlan=['nomeie_a_forma']; state.currentRender='nomeie_a_forma';
  renderRound();
  const html2 = document.getElementById("game-stage").innerHTML;
  if(!html2.includes('rotate(0deg)')) rotationVariesHigh = true;
}
check("Nomeie a Forma: rotação sempre 0 nos níveis 1-2 (posição de livro)", rotationOkLow);
check("Nomeie a Forma: rotação varia no nível 5 (diferentes disposições)", rotationVariesHigh);

// Formas no Mundo: cone/pirâmide só aparecem a partir do nível certo
let earlyLevelsRestricted = true;
[1,2].forEach(lvl=>{
  activityLevel.formas_no_mundo = lvl;
  for(let i=0;i<30;i++){
    state.game='formas_no_mundo'; state.subgames=['formas_no_mundo']; state.round=1; state.totalRounds=1;
    state.pools={}; state.roundPlan=['formas_no_mundo']; state.currentRender='formas_no_mundo';
    renderRound();
    const html2 = document.getElementById("game-stage").innerHTML;
    if(html2.includes('Cone') || html2.includes('Pirâmide')) earlyLevelsRestricted = false;
  }
});
check("Formas no Mundo: Cone/Pirâmide não aparecem como resposta certa nos níveis 1-2", earlyLevelsRestricted);

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', ()=>{});
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
