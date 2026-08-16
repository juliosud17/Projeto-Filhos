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
function passProva(containerId){ provaPassed[containerId] = true; provaScores[containerId] = {overallPct:100, perActivity:[], passed:true}; }

// 1. data integrity
let wcOk = true;
WORD_CLASS.forEach(it=>{
  const opts = [it.correct, ...it.wrongs];
  if(new Set(opts).size !== opts.length){ console.log("DUPLICATE option in WORD_CLASS: "+it.word); wcOk=false; }
});
check("every WORD_CLASS entry has distinct options", wcOk);

let amOk = true;
ACTION_MATCHES.forEach(it=>{
  const opts = [it.correct, ...it.wrongs];
  if(new Set(opts).size !== opts.length){ console.log("DUPLICATE option in ACTION_MATCHES: "+it.subject); amOk=false; }
});
check("every ACTION_MATCHES entry has distinct options", amOk);

let tpOk = true;
TEXT_PUNCT.forEach(it=>{
  const opts = [it.correct, ...it.wrongs];
  if(new Set(opts).size !== opts.length){ console.log("DUPLICATE option in TEXT_PUNCT: "+it.text2); tpOk=false; }
  if(it.correct !== "." && it.correct !== "?"){ tpOk=false; }
});
check("every TEXT_PUNCT entry has distinct valid punctuation options", tpOk);

// 2. render + click-through for the 3 new activities, all 5 levels
function testMC(gameId, roundsPerLevel, expectedOpts){
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
      if(opts.length !== expectedOpts){ console.log("WARN opts!="+expectedOpts+" "+gameId+" L"+lvl+": "+opts.length); errors++; continue; }
      const texts = Array.from(opts).map(o=>o.textContent);
      if(new Set(texts).size !== expectedOpts){ console.log("WARN duplicate option "+gameId+" L"+lvl+": "+texts.join("|")); errors++; }
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
testMC("substantivo_verbo", 30, 2);
testMC("acao_combina", 20, 3);
testMC("pontuacao_texto", 20, 2);

// 3. module7FullyMastered gating
activityLevel.substantivo_verbo=1; mastery['substantivo_verbo:1']=[];
activityLevel.acao_combina=1; mastery['acao_combina:1']=[];
activityLevel.pontuacao_texto=1; mastery['pontuacao_texto:1']=[];
check("module7FullyMastered false when not maxed", module7FullyMastered() === false);
MODULE7_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
check("module7FullyMastered true when all 3 maxed", module7FullyMastered() === true);

// 4. Módulo 7 unlock requires Módulo 6 fully mastered E o Desafio Final dele aprovado
const modulo7Mod = PT_MODULES_BENJAMIN.find(m=>m.id==='gramatica');
MODULE6_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=1; mastery[a.id+":1"]=[]; });
check("Módulo 7 locked when Módulo 6 not fully mastered", isModuleUnlocked(modulo7Mod) === false);
MODULE6_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
check("Módulo 7 ainda BLOQUEADO com Módulo 6 dominado mas sem a prova aprovada", isModuleUnlocked(modulo7Mod) === false);
passProva("narrativas");
check("Módulo 7 unlocked once Módulo 6 fully mastered + Desafio Final aprovado", isModuleUnlocked(modulo7Mod) === true);

// 5. menu / admin / panel show correct data for Módulo 7
[MODULE1_ACTIVITIES, MODULE2_ACTIVITIES, MODULE3_ACTIVITIES, MODULE4_ACTIVITIES, MODULE5_ACTIVITIES].forEach(list=>{
  list.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
});
passProva("silabas"); passProva("leitura"); passProva("frases"); passProva("escrita"); passProva("compreensao");
selectChild('benjamin');
openMaterias();
openModulos('portugues');
const modulosHtml = document.getElementById('modulos-grid').innerHTML;
check("menu mostra Módulo 7", modulosHtml.includes('Módulo 7'));
openAtividades('gramatica');
const gridHtml = document.getElementById('atividades-grid').innerHTML;
check("atividades do Módulo 7 mostra 3 atividades", document.querySelectorAll('#atividades-grid .game-card').length >= 3);
check("menu mostra Substantivo ou Verbo?", gridHtml.includes('Substantivo ou Verbo?'));
check("menu mostra Que Ação Combina?", gridHtml.includes('Que Ação Combina?'));
check("menu mostra Pontuação no Textinho", gridHtml.includes('Pontuação no Textinho'));

openAdmin();
const adminHtml = document.getElementById('admin-list').innerHTML;
check("admin mostra Módulo 7 (3 atividades com nível)", adminHtml.includes('Módulo 7') && adminHtml.includes('(3 atividades com nível)'));

openPanel();
const panelHtml = document.getElementById('panel-list').innerHTML;
check("painel mostra atividades certas do Módulo 7", panelHtml.includes('Substantivo ou Verbo?') && panelHtml.includes('Pontuação no Textinho'));

// 6. speak() coverage
['substantivo_verbo','acao_combina','pontuacao_texto'].forEach(g=>{
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
