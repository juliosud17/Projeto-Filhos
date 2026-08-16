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

// 1. render + click-through for the 3 activities, all 5 levels, generative content
// (no fixed bank to validate — instead run MANY rounds per level to shake out
// intermittent issues from the random generation, same discipline used for
// Português quando o conteúdo é gerado/sorteado)
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
// muitas rodadas (conteúdo generativo, não banco fixo — precisa de volume alto
// pra pegar combinação rara que quebre, tipo pool de distratores vazio)
testMC("quantos_tem", 60);
testMC("conta_comigo_b", 60);
testMC("qual_tem_mais", 2, ()=>2); // sempre 2 opções (Grupo A / Grupo B)

// 2. mm1FullyMastered gating
activityLevel.quantos_tem=1; mastery['quantos_tem:1']=[];
activityLevel.conta_comigo_b=1; mastery['conta_comigo_b:1']=[];
activityLevel.qual_tem_mais=1; mastery['qual_tem_mais:1']=[];
check("mm1FullyMastered false when not maxed", mm1FullyMastered() === false);
MM1_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
check("mm1FullyMastered true when all 3 maxed", mm1FullyMastered() === true);

// 3. M1 é trilha independente — sempre desbloqueado, mesmo sem nada de Português feito
Object.keys(activityLevel).forEach(k=>{ activityLevel[k]=1; });
Object.keys(mastery).forEach(k=> delete mastery[k]);
const mm1Mod = ALL_MODULES_BENJAMIN.find(m=>m.id==='mm1_numeros');
check("M1 de Matemática sempre desbloqueado (trilha independente de Português)", isModuleUnlocked(mm1Mod) === true);

// 4. menu / admin / panel mostram M1 de Matemática corretamente (navegação
// em árvore: Ano Letivo > Matéria > Módulos > Atividades)
selectChild('benjamin');
openMaterias();
openModulos('matematica');
const modulosHtml = document.getElementById('modulos-grid').innerHTML;
check("tela de módulos de Matemática mostra M1 com 3 atividades", modulosHtml.includes('M1') && modulosHtml.includes('Números e Quantidades'));
check("tela de módulos ainda mostra jogos extras de Matemática (Soma/Subtração)", modulosHtml.includes('Soma Divertida') && modulosHtml.includes('Subtração Divertida'));
openAtividades('mm1_numeros');
const gridHtml = document.getElementById('atividades-grid').innerHTML;
check("atividades do M1 mostra 3 atividades", document.querySelectorAll('#atividades-grid .game-card').length >= 3);
check("menu mostra Quantos Tem?", gridHtml.includes('Quantos Tem?'));
check("menu mostra Conta Comigo", gridHtml.includes('Conta Comigo'));
check("menu mostra Qual Tem Mais?", gridHtml.includes('Qual Tem Mais?'));

openAdmin();
const adminHtml = document.getElementById('admin-list').innerHTML;
check("admin mostra M1 de Matemática (3 atividades com nível)", adminHtml.includes('Números e Quantidades') && adminHtml.includes('(3 atividades com nível)'));

openPanel();
const panelHtml = document.getElementById('panel-list').innerHTML;
check("painel mostra atividades certas do M1 de Matemática", panelHtml.includes('Quantos Tem?') && panelHtml.includes('Qual Tem Mais?'));
check("painel ainda mostra módulos de Português (trilha combinada)", panelHtml.includes('Módulo 1') && panelHtml.includes('Módulo 7'));

// 5. speak() coverage
['quantos_tem','conta_comigo_b','qual_tem_mais'].forEach(g=>{
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
