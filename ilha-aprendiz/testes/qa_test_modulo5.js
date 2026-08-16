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
function passProva(containerId){ provaPassed[containerId] = true; provaScores[containerId] = {overallPct:100, perActivity:[], passed:true}; }

// 1. data integrity
let relOk = true;
WORD_RELATIONS.forEach(it=>{
  const opts = [it.correct, ...it.wrongs];
  if(new Set(opts).size !== opts.length){ console.log("DUPLICATE option in WORD_RELATIONS: "+it.word); relOk=false; }
  if(it.wrongs.length < 2){ relOk=false; }
});
check("every WORD_RELATIONS entry has 3 distinct options", relOk);

let genreOk = true;
TEXT_GENRES.forEach(it=>{
  const opts = [it.genre, ...it.wrongs];
  if(new Set(opts).size !== opts.length){ console.log("DUPLICATE option in TEXT_GENRES: "+it.excerpt); genreOk=false; }
});
check("every TEXT_GENRES entry has distinct genre options", genreOk);

let curiosOk = true;
CURIOSITIES.forEach(it=>{
  const opts = [it.correct, ...it.wrongs];
  if(new Set(opts).size !== opts.length){ console.log("DUPLICATE option in CURIOSITIES: "+it.text); curiosOk=false; }
});
check("every CURIOSITIES entry has distinct answer options", curiosOk);

// 2. render + click-through for the 3 new activities, all 5 levels, 30 rounds each
function testMC(gameId, roundsPerLevel){
  let totalErrors = 0;
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
      if(opts.length !== 3){ console.log("WARN opts!=3 "+gameId+" L"+lvl+": "+opts.length); errors++; continue; }
      const texts = Array.from(opts).map(o=>o.textContent);
      if(new Set(texts).size !== 3){ console.log("WARN duplicate option "+gameId+" L"+lvl+": "+texts.join("|")); errors++; }
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
testMC("sinonimos_antonimos", 30);
testMC("genero_textual", 20);
testMC("ler_responder", 20);

// 3. module5FullyMastered gating
activityLevel.sinonimos_antonimos=1; mastery['sinonimos_antonimos:1']=[];
activityLevel.genero_textual=1; mastery['genero_textual:1']=[];
activityLevel.ler_responder=1; mastery['ler_responder:1']=[];
check("module5FullyMastered false when not maxed", module5FullyMastered() === false);
MODULE5_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
check("module5FullyMastered true when all 3 maxed", module5FullyMastered() === true);

// 4. Módulo 5 unlock requires Módulo 4 fully mastered E o Desafio Final dele aprovado
const modulo5Mod = PT_MODULES_BENJAMIN.find(m=>m.id==='compreensao');
MODULE4_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=1; mastery[a.id+":1"]=[]; });
check("Módulo 5 locked when Módulo 4 not fully mastered", isModuleUnlocked(modulo5Mod) === false);
MODULE4_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
check("Módulo 5 ainda BLOQUEADO com Módulo 4 dominado mas sem a prova aprovada", isModuleUnlocked(modulo5Mod) === false);
passProva("escrita");
check("Módulo 5 unlocked once Módulo 4 fully mastered + Desafio Final aprovado", isModuleUnlocked(modulo5Mod) === true);

// 5. menu / admin / panel show correct data for Módulo 5
[MODULE1_ACTIVITIES, MODULE2_ACTIVITIES, MODULE3_ACTIVITIES].forEach(list=>{
  list.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
});
passProva("silabas"); passProva("leitura"); passProva("frases");
selectChild('benjamin');
openMaterias();
openModulos('portugues');
const modulosHtml = document.getElementById('modulos-grid').innerHTML;
check("menu mostra Módulo 5", modulosHtml.includes('Módulo 5'));
openAtividades('compreensao');
const gridHtml = document.getElementById('atividades-grid').innerHTML;
check("atividades do Módulo 5 mostra 3 atividades", document.querySelectorAll('#atividades-grid .game-card').length >= 3);
check("menu mostra Sinônimos e Antônimos", gridHtml.includes('Sinônimos e Antônimos'));
check("menu mostra Qual é o Gênero?", gridHtml.includes('Qual é o Gênero?'));
check("menu mostra Ler e Responder", gridHtml.includes('Ler e Responder'));

openAdmin();
const adminHtml = document.getElementById('admin-list').innerHTML;
check("admin mostra Módulo 5 (3 atividades com nível)", adminHtml.includes('Módulo 5') && adminHtml.includes('(3 atividades com nível)'));

openPanel();
const panelHtml = document.getElementById('panel-list').innerHTML;
check("painel mostra atividades certas do Módulo 5", panelHtml.includes('Sinônimos e Antônimos') && panelHtml.includes('Ler e Responder'));

// 6. speak() coverage
['sinonimos_antonimos','genero_textual','ler_responder'].forEach(g=>{
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
