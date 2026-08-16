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

// 1. data integrity checks
let phrasesOk = true;
PARLENDAS.forEach(p=>{ if(p.lines.length !== p.level){ console.log("PARLENDA level mismatch: "+p.level+" lines="+p.lines.length); phrasesOk=false; } });
check("every PARLENDAS entry has lines.length === level", phrasesOk);

let groupsOk = true;
MEDIAL_FINAL_GROUPS.forEach(g=>{
  if(g.words.length < 2){ console.log("GROUP too small: "+g.syllable); groupsOk=false; }
  const uniqWords = new Set(g.words.map(w=>w.word));
  if(uniqWords.size !== g.words.length){ console.log("GROUP has duplicate word: "+g.syllable); groupsOk=false; }
});
check("every MEDIAL_FINAL_GROUPS entry has >=2 distinct words", groupsOk);

let punctOk = true;
PUNCTUATION_SENTENCES.forEach(p=>{ if(![".","?","!"].includes(p.correct)){ console.log("BAD punctuation: "+p.text); punctOk=false; } });
check("every PUNCTUATION_SENTENCES entry has valid correct mark", punctOk);

// 2. renderParlendas across levels, 40 rounds
for(let lvl=1; lvl<=5; lvl++){
  activityLevel.parlendas = lvl;
  mastery["parlendas:"+lvl] = [];
  let errors=0, correctFound=0;
  for(let round=0; round<40; round++){
    state.game="parlendas"; state.subgames=["parlendas"]; state.round=1; state.totalRounds=1;
    state.pools={}; state.roundPlan=["parlendas"]; state.currentRender="parlendas";
    state.roundFirstTryUsed=false;
    try{ renderRound(); }catch(e){ console.log("RENDER ERROR parlendas L"+lvl+": "+e.message); errors++; continue; }
    const opts = document.querySelectorAll('.option-btn');
    if(opts.length < 2){ errors++; continue; }
    state.sessionStars=0; let found=false;
    for(const b of opts){
      const before=state.sessionStars;
      if(b.onclick) b.onclick();
      if(state.sessionStars>before){ found=true; correctFound++; break; }
      state.roundFirstTryUsed=false;
    }
    if(!found){ console.log("no correct parlendas L"+lvl); errors++; }
  }
  check("parlendas L"+lvl+": no errors (40 rounds)", errors===0);
  check("parlendas L"+lvl+": correct always found", correctFound===40);
}

// 3. renderSilabaMeioFim across levels, 40 rounds
for(let lvl=1; lvl<=5; lvl++){
  activityLevel.silaba_meio_fim = lvl;
  mastery["silaba_meio_fim:"+lvl] = [];
  let errors=0, correctFound=0;
  for(let round=0; round<40; round++){
    state.game="silaba_meio_fim"; state.subgames=["silaba_meio_fim"]; state.round=1; state.totalRounds=1;
    state.pools={}; state.roundPlan=["silaba_meio_fim"]; state.currentRender="silaba_meio_fim";
    state.roundFirstTryUsed=false;
    try{ renderRound(); }catch(e){ console.log("RENDER ERROR silaba_meio_fim L"+lvl+": "+e.message); errors++; continue; }
    const opts = document.querySelectorAll('.option-btn');
    if(opts.length !== 3){ console.log("WARN opts!=3 silaba_meio_fim L"+lvl+": "+opts.length); errors++; continue; }
    const htmls = Array.from(opts).map(o=>o.innerHTML);
    if(new Set(htmls).size !== htmls.length){ console.log("WARN duplicate option silaba_meio_fim L"+lvl); errors++; }
    state.sessionStars=0; let found=false;
    for(const b of opts){
      const before=state.sessionStars;
      if(b.onclick) b.onclick();
      if(state.sessionStars>before){ found=true; correctFound++; break; }
      state.roundFirstTryUsed=false;
    }
    if(!found){ console.log("no correct silaba_meio_fim L"+lvl); errors++; }
  }
  check("silaba_meio_fim L"+lvl+": no errors (40 rounds)", errors===0);
  check("silaba_meio_fim L"+lvl+": correct always found", correctFound===40);
}

// 4. renderPontuacao across levels, 30 rounds
for(let lvl=1; lvl<=5; lvl++){
  activityLevel.pontuacao = lvl;
  mastery["pontuacao:"+lvl] = [];
  let errors=0, correctFound=0;
  for(let round=0; round<30; round++){
    state.game="pontuacao"; state.subgames=["pontuacao"]; state.round=1; state.totalRounds=1;
    state.pools={}; state.roundPlan=["pontuacao"]; state.currentRender="pontuacao";
    state.roundFirstTryUsed=false;
    try{ renderRound(); }catch(e){ console.log("RENDER ERROR pontuacao L"+lvl+": "+e.message); errors++; continue; }
    const opts = document.querySelectorAll('.option-btn');
    if(opts.length !== 3){ errors++; continue; }
    state.sessionStars=0; let found=false;
    for(const b of opts){
      const before=state.sessionStars;
      if(b.onclick) b.onclick();
      if(state.sessionStars>before){ found=true; correctFound++; break; }
      state.roundFirstTryUsed=false;
    }
    if(!found){ console.log("no correct pontuacao L"+lvl); errors++; }
  }
  check("pontuacao L"+lvl+": no errors (30 rounds)", errors===0);
  check("pontuacao L"+lvl+": correct always found", correctFound===30);
}

// 5. module3FullyMastered gating
activityLevel.parlendas=1; mastery['parlendas:1']=[];
activityLevel.silaba_meio_fim=1; mastery['silaba_meio_fim:1']=[];
activityLevel.pontuacao=1; mastery['pontuacao:1']=[];
check("module3FullyMastered false when not maxed", module3FullyMastered() === false);
MODULE3_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
check("module3FullyMastered true when all 3 maxed", module3FullyMastered() === true);

// 6. Módulo 3 unlock requires Módulo 2 fully mastered (not just some activity) E o Desafio Final aprovado
MODULE2_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=1; mastery[a.id+":1"]=[]; });
const modulo3Mod = PT_MODULES_BENJAMIN.find(m=>m.id==='frases');
check("Módulo 3 locked when Módulo 2 not fully mastered", isModuleUnlocked(modulo3Mod) === false);
MODULE2_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
check("Módulo 3 ainda BLOQUEADO com Módulo 2 dominado mas sem a prova aprovada", isModuleUnlocked(modulo3Mod) === false);
passProva("leitura");
check("Módulo 3 unlocked once Módulo 2 fully mastered + Desafio Final aprovado", isModuleUnlocked(modulo3Mod) === true);

// 7. renderPanel no longer shows wrong data for Módulo 2/3 (the real bug found+fixed this turn)
MODULE1_ACTIVITIES.forEach(a=>{ activityLevel[a.id]=5; mastery[a.id+":5"]=[true,true,true,true,true,true,true,true,true,false]; });
selectChild('benjamin');
openPanel();
const panelHtml = document.getElementById('panel-list').innerHTML;
check("painel mostra 'X de 3 atividades completas' pro Módulo 2 (não mais herdando contagem do Módulo 1)", panelHtml.includes('de 3 atividades completas'));
check("painel mostra 'Leia a Frase' na lista de atividades do Módulo 2", panelHtml.includes('Leia a Frase'));

// 8. menu shows Módulo 3 with 3 activities once unlocked
selectChild('benjamin');
openMaterias();
openModulos('portugues');
const modulosHtml = document.getElementById('modulos-grid').innerHTML;
check("menu mostra Módulo 3", modulosHtml.includes('Módulo 3'));
openAtividades('frases');
const gridHtml = document.getElementById('atividades-grid').innerHTML;
check("atividades do Módulo 3 mostra 3 atividades", document.querySelectorAll('#atividades-grid .game-card').length >= 3);
check("menu mostra Parlendas e Trava-Línguas", gridHtml.includes('Parlendas e Trava-Línguas'));
check("menu mostra Som do Meio e do Fim", gridHtml.includes('Som do Meio e do Fim'));
check("menu mostra Pontuação Certa", gridHtml.includes('Pontuação Certa'));

// 9. admin panel shows Módulo 3 leveled section
openAdmin();
const adminHtml = document.getElementById('admin-list').innerHTML;
check("admin mostra Módulo 3 (3 atividades com nível)", adminHtml.includes('Módulo 3') && adminHtml.includes('(3 atividades com nível)'));
check("admin mostra as 3 atividades do Módulo 3", adminHtml.includes('Parlendas e Trava-Línguas') && adminHtml.includes('Som do Meio e do Fim') && adminHtml.includes('Pontuação Certa'));

// 10. speak() coverage for the 3 new activities
['parlendas','silaba_meio_fim','pontuacao'].forEach(g=>{
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
