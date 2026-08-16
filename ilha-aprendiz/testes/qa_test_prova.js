const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
let html = fs.readFileSync('/tmp/ilha_aprendiz.html', 'utf8');

const testScript = `
<script>
window.speechSynthesis = { cancel(){}, speak(){} };
window.SpeechSynthesisUtterance = function(t){ this.text=t; };
window.AudioContext = function(){ return { createOscillator(){return {connect(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},start(){},stop(){}} }, createGain(){return {connect(){},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}}} }, destination:{}, currentTime:0 }; };
// nextRound normalmente é agendado via setTimeout(nextRound, 1100) numa
// resposta certa — em vez de deixar o timer real do Node disparar depois
// (o que causaria um SEGUNDO avanço de rodada bem depois do teste já ter
// terminado e impresso o resultado), viramos o setTimeout um no-op e
// avançamos a rodada manualmente logo após cada clique certo, controlando
// o tempo do teste inteiramente à mão.
window.setTimeout = function(){ return 0; };

let ok=0, fail=0;
function check(l,c){ if(c) ok++; else { fail++; console.log("FAIL: " + l); } }

function fullyMasterContainer(containerId){
  const c = containerById(containerId);
  c.activities.forEach(a=>{
    activityLevel[a.id] = 5;
    mastery[a.id+":5"] = [true,true,true,true,true,true,true,true,true,true];
  });
}

function answerAllCorrect(){
  // resolve todas as rodadas da sessão atual acertando de primeira (setTimeout
  // é no-op, então avançamos a rodada manualmente após cada acerto). Trata os
  // dois formatos de UI que existem no jogo: multipla-escolha (.option-btn,
  // inclusive o modo "monte a sílaba" em tiles, que também usa .option-btn)
  // e o "Digite a palavra" do nível 5 de Sílabas (#typed-word/#confirm-typed,
  // sem nenhum .option-btn na tela).
  let guard = 0;
  while(guard < 200){
    guard++;
    const typedInput = document.getElementById('typed-word');
    const typedBtn = document.getElementById('confirm-typed');
    let gotCorrect = false;
    if(typedInput && typedBtn){
      const emojiShown = document.querySelector('.game-stage > div[style]').textContent;
      const match = WORDS.find(w=>w.emoji === emojiShown && w.level === 5) || WORDS.find(w=>w.emoji===emojiShown);
      if(match){
        const before = state.sessionStars;
        typedInput.value = match.word;
        typedBtn.onclick();
        if(state.sessionStars > before || typedInput.disabled === true) gotCorrect = true;
      }
    }else{
      const opts = document.querySelectorAll('.option-btn');
      if(opts.length === 0) break;
      // Não sabemos de antemão qual botão é o certo (a lógica de cada jogo é
      // interna ao closure do onclick), então achamos por eliminação clicando
      // um a um. Isso conta várias "primeiras tentativas" na pontuação real do
      // app — mas pra prova só o resultado de UMA tentativa limpa e certa deve
      // valer (é isso que estamos testando: acertar tudo de primeira). Por
      // isso guardamos o placar da atividade ANTES da eliminação e, ao achar o
      // botão certo, sobrescrevemos com exatamente +1 acerto/+1 pergunta —
      // descartando a poluição dos cliques errados de eliminação do teste.
      const key = state.currentRender;
      const before = state.provaMode ? {...state.provaResults[key]} : null;
      for(const b of opts){
        const beforeStars = state.sessionStars;
        if(b.onclick) b.onclick();
        if(state.sessionStars > beforeStars){ gotCorrect = true; break; }
        state.roundFirstTryUsed = false;
      }
      if(gotCorrect && before){
        state.provaResults[key] = {correct: before.correct + 1, total: before.total + 1};
      }
    }
    if(!gotCorrect) break;
    nextRound();
    if(!state.provaMode && document.getElementById("screen-end").classList.contains("active")) break;
    if(document.getElementById("screen-prova-result").classList.contains("active")) break;
  }
}

selectChild('benjamin');

// 1. Módulo 1 (silabas) ainda não devia ter o Desafio Final disponível (nada dominado)
check("Sem domínio nenhum, provaScores fica vazio", Object.keys(provaScores).length === 0);

// 2. Domina o Módulo 1 inteiro e faz a prova (todas certas) — deve passar
fullyMasterContainer("silabas");
check("module1FullyMastered true após dominar tudo", module1FullyMastered() === true);

const module2Mod = ALL_MODULES_BENJAMIN.find(m=>m.id==='leitura');
check("Módulo 2 ainda BLOQUEADO mesmo com Módulo 1 100% dominado (falta a prova)", isModuleUnlocked(module2Mod) === false);

startProva("silabas");
check("startProva entra em provaMode", state.provaMode === true);
check("startProva monta o número certo de perguntas (3 por atividade)", state.totalRounds === MODULE1_ACTIVITIES.length * 3);
answerAllCorrect();
check("Depois de acertar tudo, prova não está mais em provaMode (terminou)", state.provaMode === false);
check("provaPassed[silabas] true depois de acertar tudo", provaPassed["silabas"] === true);
check("provaScores[silabas].overallPct é 100 quando acerta tudo", provaScores["silabas"].overallPct === 100);
check("Módulo 2 agora DESBLOQUEADO depois da prova aprovada", isModuleUnlocked(module2Mod) === true);
check("mastery da prática normal não foi tocado pela prova (só provaResults)", mastery["silabas:5"] === undefined || mastery["silabas:5"].length <= 10);

// 3. Resetar a prova via admin e checar que volta a bloquear
adminResetProva("silabas");
check("Depois de adminResetProva, provaPassed some", provaPassed["silabas"] === undefined);
check("Módulo 2 volta a ficar bloqueado sem a prova aprovada", isModuleUnlocked(module2Mod) === false);

// 4. Refaz a prova pra deixar aprovada de novo (necessário pros checks seguintes)
startProva("silabas");
answerAllCorrect();
check("Módulo 2 desbloqueado de novo após reaprovar", isModuleUnlocked(module2Mod) === true);

// 5. menu mostra o card do Desafio Final quando módulo está fully mastered
// (agora dentro da tela de Atividades do módulo, na árvore de navegação)
selectChild('benjamin');
openMaterias();
openModulos('portugues');
openAtividades('silabas');
const gridHtml = document.getElementById('atividades-grid').innerHTML;
check("menu mostra card do Desafio Final do Módulo 1", gridHtml.includes('Desafio Final') && gridHtml.includes('Aprovado'));

// 6. admin mostra status da prova
openAdmin();
const adminHtml = document.getElementById('admin-list').innerHTML;
check("admin mostra Desafio Final — Módulo 1 com status aprovado", adminHtml.includes('Desafio Final') && adminHtml.includes('Aprovado'));

// 7. painel (meus módulos) mostra status da prova
openPanel();
const panelHtml = document.getElementById('panel-list').innerHTML;
check("painel mostra seção Desafio Final com aprovado", panelHtml.includes('Desafio Final') && panelHtml.includes('Aprovado'));

// 8. Matemática: prova não afeta desbloqueio (trilha independente, requires:null sempre)
fullyMasterContainer("mm1_numeros");
const mm2Mod = ALL_MODULES_BENJAMIN.find(m=>m.id==='mm2_contagem100');
check("M2 de Matemática continua desbloqueado mesmo sem prova do M1 de Matemática (trilha independente)", isModuleUnlocked(mm2Mod) === true);

// 9. adminResetAll limpa provaPassed/provaScores também
check("Antes do resetAll, ainda tem provaPassed registrado", Object.keys(provaPassed).length > 0);
adminResetAll();
check("adminResetAll limpa provaPassed", Object.keys(provaPassed).length === 0);
check("adminResetAll limpa provaScores", Object.keys(provaScores).length === 0);
check("Módulo 2 volta a ficar bloqueado após resetAll (nem domínio nem prova)", isModuleUnlocked(module2Mod) === false);

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', ()=>{});
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
