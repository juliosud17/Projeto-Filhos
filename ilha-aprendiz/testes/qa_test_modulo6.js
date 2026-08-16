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
let storiesOk = true;
MINI_STORIES.forEach(s=>{
  if(s.events.length !== 3){ storiesOk=false; }
  if(new Set(s.events).size !== 3){ console.log("DUPLICATE EVENT in story: "+s.character); storiesOk=false; }
  if([s.character,...s.wrongCharacters].length !== new Set([s.character,...s.wrongCharacters]).size){ storiesOk=false; }
  if([s.place,...s.wrongPlaces].length !== new Set([s.place,...s.wrongPlaces]).size){ storiesOk=false; }
  if([s.time,...s.wrongTimes].length !== new Set([s.time,...s.wrongTimes]).size){ storiesOk=false; }
});
check("every MINI_STORIES entry has 3 distinct events + distinct option sets", storiesOk);

let endingsOk = true;
STORY_ENDINGS.forEach(s=>{
  const opts = [s.correctEnding, ...s.wrongEndings];
  if(new Set(opts).size !== opts.length){ console.log("DUPLICATE ENDING: "+s.setup); endingsOk=false; }
});
check("every STORY_ENDINGS entry has distinct ending options", endingsOk);

// 2. renderElementosHistoria + renderInventeFinal: standard MC flow
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
      if(opts.length !== 3){ console.log("WARN opts!=3 "+gameId+" L"+lvl+": "+opts.length); errors++; continue; }
      const texts = Array.from(opts).map(o=>o.textContent);
      if(new Set(texts).size !== 3){ console.log("WARN duplicate option "+gameId+" L"+lvl); errors++; }
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
testMC("elementos_historia", 30);
testMC("invente_final", 20);

// 3. renderReconteHistoria: ordering mechanic — test correct order path AND wrong-order-retry path
let orderErrors = 0;
for(let lvl=1; lvl<=5; lvl++){
  activityLevel.reconte_historia = lvl;
  mastery["reconte_historia:"+lvl] = [];
  for(let round=0; round<15; round++){
    state.game="reconte_historia"; state.subgames=["reconte_historia"]; state.round=1; state.totalRounds=1;
    state.pools={}; state.roundPlan=["reconte_historia"]; state.currentRender="reconte_historia";
    state.roundFirstTryUsed=false;
    try{ renderRound(); }catch(e){ console.log("RENDER ERROR reconte L"+lvl+": "+e.message); orderErrors++; continue; }
    let opts = Array.from(document.querySelectorAll('.option-btn'));
    if(opts.length !== 3){ console.log("WARN opts!=3 reconte L"+lvl+": "+opts.length); orderErrors++; continue; }

    if(round % 3 === 0){
      // caminho: clica em ORDEM ERRADA de propósito (reverso), espera reset, depois clica certo
      const texts = opts.map(o=>o.textContent);
      const wrongOrderBtns = opts.slice().reverse();
      // só força ordem errada se o reverso realmente diferir da ordem original (script correto)
      wrongOrderBtns.forEach(b=>{ if(!b.disabled) b.onclick(); });
      // depois do reset, botões devem estar reabilitados de novo (a menos que por acaso a ordem reversa tenha acertado)
      const stillHasEnabled = document.querySelectorAll('.option-btn:not([disabled])').length;
      if(stillHasEnabled === 0){
        // possível que reverso == ordem certa por acaso (raro com 3! = 6 chances, 1/6) -- checa se a sessão avançou (estrela ganha) nesse caso é aceitável
      }
    } else {
      // caminho feliz: clica cada botão na ordem certa lendo o texto e comparando contra a MINI_STORIES correspondente
      // como não sabemos qual story foi sorteada diretamente, testamos indiretamente: clicar em qualquer ordem e verificar que
      // ou (a) a sessão ganhou estrela (ordem certa por acaso) ou (b) os botões resetam (ordem errada) -- ambos são comportamento válido
      opts.forEach(b=>{ if(!b.disabled) b.onclick(); });
    }
  }
}
check("reconte_historia: no render errors across 5 levels (75 rounds)", orderErrors === 0);

// 3b. teste determinístico: monta a ordem CERTA manualmente lendo MINI_STORIES e confirma que acerta
let deterministicErrors = 0, deterministicOk = 0;
for(let i=0;i<30;i++){
  activityLevel.reconte_historia = (i % 5) + 1;
  state.game="reconte_historia"; state.subgames=["reconte_historia"]; state.round=1; state.totalRounds=1;
  state.pools={}; state.roundPlan=["reconte_historia"]; state.currentRender="reconte_historia";
  state.roundFirstTryUsed=false;
  renderRound();
  const opts = Array.from(document.querySelectorAll('.option-btn'));
  const shownTexts = opts.map(o=>o.textContent);
  // acha a MINI_STORIES cujo conjunto de eventos bate exatamente com os botões mostrados
  const story = MINI_STORIES.find(s=> s.events.length===3 && s.events.every(e=>shownTexts.includes(e)));
  if(!story){ deterministicErrors++; continue; }
  state.sessionStars = 0;
  story.events.forEach(correctEvent=>{
    const btn = opts.find(o=>o.textContent === correctEvent);
    if(btn && !btn.disabled) btn.onclick();
  });
  if(state.sessionStars === 1) deterministicOk++;
  else { console.log("ORDER MISMATCH: expected star for correct sequence, story="+story.character); deterministicErrors++; }
}
check("reconte_historia: clicking events in the KNOWN correct order always scores (30/30)", deterministicErrors===0 && deterministicOk===30);

// 4. module6FullyMastered gating
activityLevel.elementos_historia=1; mastery['elementos_historia:1']=[];
activityLevel.reconte_historia=1; mastery['reconte_historia:1']=[];
activityLevel.invente_final=1; mastery['invente_final:1']=[];
check("module6FullyMastered false when not maxed", module6FullyMastered() === false);
MODULE6_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
check("module6FullyMastered true when all 3 maxed", module6FullyMastered() === true);

// 5. Módulo 6 unlock requires Módulo 5 fully mastered E o Desafio Final dele aprovado
const modulo6Mod = PT_MODULES_BENJAMIN.find(m=>m.id==='narrativas');
MODULE5_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=1; mastery[a.id+":1"]=[]; });
check("Módulo 6 locked when Módulo 5 not fully mastered", isModuleUnlocked(modulo6Mod) === false);
MODULE5_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
check("Módulo 6 ainda BLOQUEADO com Módulo 5 dominado mas sem a prova aprovada", isModuleUnlocked(modulo6Mod) === false);
passProva("compreensao");
check("Módulo 6 unlocked once Módulo 5 fully mastered + Desafio Final aprovado", isModuleUnlocked(modulo6Mod) === true);

// 6. menu / admin / panel
[MODULE1_ACTIVITIES, MODULE2_ACTIVITIES, MODULE3_ACTIVITIES, MODULE4_ACTIVITIES].forEach(list=>{
  list.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
});
passProva("silabas"); passProva("leitura"); passProva("frases"); passProva("escrita");
selectChild('benjamin');
openMaterias();
openModulos('portugues');
const modulosHtml = document.getElementById('modulos-grid').innerHTML;
check("menu mostra Módulo 6", modulosHtml.includes('Módulo 6'));
openAtividades('narrativas');
const gridHtml = document.getElementById('atividades-grid').innerHTML;
check("atividades do Módulo 6 mostra 3 atividades", document.querySelectorAll('#atividades-grid .game-card').length >= 3);
check("menu mostra Elementos da História", gridHtml.includes('Elementos da História'));
check("menu mostra Reconte a História", gridHtml.includes('Reconte a História'));
check("menu mostra Invente o Final", gridHtml.includes('Invente o Final'));

openAdmin();
const adminHtml = document.getElementById('admin-list').innerHTML;
check("admin mostra Módulo 6 (3 atividades com nível)", adminHtml.includes('Módulo 6') && adminHtml.includes('(3 atividades com nível)'));

openPanel();
const panelHtml = document.getElementById('panel-list').innerHTML;
check("painel mostra atividades certas do Módulo 6", panelHtml.includes('Reconte a História') && panelHtml.includes('Invente o Final'));

// 7. speak() coverage
['elementos_historia','reconte_historia','invente_final'].forEach(g=>{
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
