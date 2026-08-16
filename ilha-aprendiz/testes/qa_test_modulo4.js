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
let listsOk = true;
LISTS.forEach(it=>{ if(!it.items.includes("___")){ console.log("LIST missing blank: "+it.title); listsOk=false; } if(!it.answer){ listsOk=false; } });
check("every LISTS entry has a blank and an answer", listsOk);

let ftOk = true;
FUNCTIONAL_TEXTS.forEach(it=>{ if(!it.text.includes("___")){ console.log("FUNCTIONAL_TEXT missing blank: "+it.text); ftOk=false; } if(!it.answer){ ftOk=false; } });
check("every FUNCTIONAL_TEXTS entry has a blank and an answer", ftOk);

// 2. renderListaCompleta across levels — type correct answer (with lowercase+no accent) and wrong answer
function testTyped(gameId, lvl, correctAnswerGetter){
  activityLevel[gameId] = lvl;
  mastery[gameId+":"+lvl] = [];
  let errors = 0;
  for(let round=0; round<20; round++){
    state.game=gameId; state.subgames=[gameId]; state.round=1; state.totalRounds=1;
    state.pools={}; state.roundPlan=[gameId]; state.currentRender=gameId;
    state.roundFirstTryUsed=false;
    try{ renderRound(); }catch(e){ console.log("RENDER ERROR "+gameId+" L"+lvl+": "+e.message); errors++; continue; }
    const input = document.getElementById('typed-word');
    const confirmBtn = document.getElementById('confirm-typed');
    if(!input || !confirmBtn){ console.log("MISSING input/button "+gameId+" L"+lvl); errors++; continue; }
    const answer = correctAnswerGetter();
    if(!answer){ console.log("no answer resolvable "+gameId+" L"+lvl); errors++; continue; }
    // wrong answer first
    const before1 = state.sessionStars;
    input.value = "ZZZNOTAWORD";
    confirmBtn.onclick();
    if(state.sessionStars !== before1){ console.log("WARN wrong answer accepted "+gameId+" L"+lvl); errors++; }
    if(input.value !== ""){ console.log("WARN input not cleared after wrong "+gameId+" L"+lvl); errors++; }
    // correct answer, lowercase + stripped accent test
    const before2 = state.sessionStars;
    input.value = answer.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g,"");
    confirmBtn.onclick();
    if(state.sessionStars !== before2 + 1){ console.log("WARN correct (lowercase/no-accent) answer rejected "+gameId+" L"+lvl+" typed=["+input.value+"] wanted=["+answer+"]"); errors++; }
  }
  return errors;
}

// helper to read current answer from the currently-rendered round for each activity
let totalErrLC=0, totalErrTF=0, totalErrPC=0;
for(let lvl=1; lvl<=5; lvl++){
  // Lista Completa: re-render then grab the item's answer via a hack — instead, re-derive by scanning LISTS for the same level tier since pickWeightedByLevel is random; simpler: patch to track last item.
  totalErrLC += testTyped("lista_completa", lvl, ()=>{
    // find item whose displayed text matches the current .big-word
    const shown = document.querySelector('.big-word').textContent;
    const match = LISTS.find(it=>it.items.join(", ") === shown);
    return match ? match.answer : null;
  });
  totalErrTF += testTyped("texto_funcional", lvl, ()=>{
    const shown = document.querySelector('.big-word').textContent;
    const match = FUNCTIONAL_TEXTS.find(it=>it.text === shown);
    return match ? match.answer : null;
  });
  totalErrPC += testTyped("parlenda_de_cor", lvl, ()=>{
    const blankedHtml = document.querySelector('.big-word').innerHTML;
    // find which parlenda+line matches by checking which line, once blanked, appears in the current display
    for(const p of PARLENDAS){
      for(let i=0;i<p.lines.length;i++){
        const words = p.lines[i].replace(/[.,!?]/g,"").split(" ");
        const bw = words[words.length-1];
        const idx = p.lines[i].lastIndexOf(bw);
        const blanked = p.lines[i].slice(0,idx) + "___" + p.lines[i].slice(idx+bw.length);
        const candidateDisplay = p.lines.map((l,j)=> j===i ? blanked : l).join("<br>");
        if(blankedHtml === candidateDisplay) return bw;
      }
    }
    return null;
  });
}
check("lista_completa: typed-answer flow correct across 5 levels (100 rounds)", totalErrLC === 0);
check("texto_funcional: typed-answer flow correct across 5 levels (100 rounds)", totalErrTF === 0);
check("parlenda_de_cor: typed-answer flow correct across 5 levels (100 rounds)", totalErrPC === 0);

// 3. module4FullyMastered gating
activityLevel.lista_completa=1; mastery['lista_completa:1']=[];
activityLevel.texto_funcional=1; mastery['texto_funcional:1']=[];
activityLevel.parlenda_de_cor=1; mastery['parlenda_de_cor:1']=[];
check("module4FullyMastered false when not maxed", module4FullyMastered() === false);
MODULE4_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
check("module4FullyMastered true when all 3 maxed", module4FullyMastered() === true);

// 4. Módulo 4 unlock requires Módulo 3 fully mastered E o Desafio Final dele aprovado
const modulo4Mod = PT_MODULES_BENJAMIN.find(m=>m.id==='escrita');
MODULE3_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=1; mastery[a.id+":1"]=[]; });
check("Módulo 4 locked when Módulo 3 not fully mastered", isModuleUnlocked(modulo4Mod) === false);
MODULE3_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
check("Módulo 4 ainda BLOQUEADO com Módulo 3 dominado mas sem a prova aprovada", isModuleUnlocked(modulo4Mod) === false);
passProva("frases");
check("Módulo 4 unlocked once Módulo 3 fully mastered + Desafio Final aprovado", isModuleUnlocked(modulo4Mod) === true);

// 5. menu shows Módulo 4 with 3 activities once unlocked (all previous modules maxed + provas aprovadas too)
[MODULE1_ACTIVITIES, MODULE2_ACTIVITIES].forEach(list=>{
  list.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
});
passProva("silabas"); passProva("leitura");
selectChild('benjamin');
openMaterias();
openModulos('portugues');
const modulosHtml = document.getElementById('modulos-grid').innerHTML;
check("menu mostra Módulo 4", modulosHtml.includes('Módulo 4'));
openAtividades('escrita');
const gridHtml = document.getElementById('atividades-grid').innerHTML;
check("atividades do Módulo 4 mostra 3 atividades", document.querySelectorAll('#atividades-grid .game-card').length >= 3);
check("menu mostra Complete a Lista", gridHtml.includes('Complete a Lista'));
check("menu mostra Texto do Dia a Dia", gridHtml.includes('Texto do Dia a Dia'));
check("menu mostra Parlenda de Cor", gridHtml.includes('Parlenda de Cor'));

// 6. admin panel shows Módulo 4 leveled section
openAdmin();
const adminHtml = document.getElementById('admin-list').innerHTML;
check("admin mostra Módulo 4 (3 atividades com nível)", adminHtml.includes('Módulo 4') && adminHtml.includes('(3 atividades com nível)'));

// 7. renderPanel shows correct counts for Módulo 4 too (regression on the bug fixed last turn)
openPanel();
const panelHtml = document.getElementById('panel-list').innerHTML;
check("painel mostra atividades certas do Módulo 4", panelHtml.includes('Complete a Lista') && panelHtml.includes('Parlenda de Cor'));

// 8. speak() coverage for the 3 new activities
['lista_completa','texto_funcional','parlenda_de_cor'].forEach(g=>{
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
