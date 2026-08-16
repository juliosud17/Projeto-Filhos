const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
let html = require('./_util/load_app_html').loadAppHtml();

const testScript = `
<script>
window.speechSynthesis = { cancel(){}, speak(){} };
window.SpeechSynthesisUtterance = function(t){ this.text=t; };
window.AudioContext = function(){ return { createOscillator(){return {connect(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},start(){},stop(){}} }, createGain(){return {connect(){},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}}} }, destination:{}, currentTime:0 }; };
window.setTimeout = function(fn){ if(typeof fn === "function") fn(); return 0; }; // executa "depois" na hora, sincroniza os testes

let ok=0, fail=0;
function check(label, cond){ if(cond) ok++; else { fail++; console.log("FAIL: " + label); } }
function daysAgoIso(n){ return new Date(Date.now() - n*24*60*60*1000).toISOString(); }

// ===== 1. registerActivityMastered =====
check("reviewState começa vazio", Object.keys(reviewState).length === 0);
registerActivityMastered('rimas');
check("registra a atividade dominada pela primeira vez", !!reviewState.rimas);
check("stage inicial é 0", reviewState.rimas.stage === 0);
const firstTimestamp = reviewState.rimas.lastReviewedAt;
registerActivityMastered('rimas'); // chamar de novo (ex.: rejogar nível 5 por diversão) não deve resetar o relógio
check("registrar de novo não reseta o relógio", reviewState.rimas.lastReviewedAt === firstTimestamp);

// ===== 2. isDueForReview / dueReviewActivities =====
reviewState.rimas.lastReviewedAt = new Date().toISOString(); // agora mesmo -- não vencida ainda
check("não vencida logo depois de dominada (estágio 0, intervalo 2 dias)", !isDueForReview('rimas'));
reviewState.rimas.lastReviewedAt = daysAgoIso(3); // 3 dias > intervalo de 2 dias do estágio 0
check("vencida depois do intervalo do estágio", isDueForReview('rimas'));
check("atividade nunca dominada não aparece como vencida", !isDueForReview('atividade_inexistente'));

reviewState.leitura = { stage: 3, lastReviewedAt: daysAgoIso(10) }; // estágio 3 = intervalo de 21 dias
check("estágio mais alto respeita intervalo maior (10 dias < 21, não vencida)", !isDueForReview('leitura'));
reviewState.leitura.lastReviewedAt = daysAgoIso(25);
check("estágio mais alto fica vencido depois do intervalo dele (25 > 21)", isDueForReview('leitura'));

const due = dueReviewActivities();
check("dueReviewActivities lista as duas vencidas", due.includes('rimas') && due.includes('leitura') && due.length === 2);

// ===== 3. startRevisao monta a sessão certa =====
state.child = 'benjamin';
startRevisao();
check("entra na tela de jogo", document.getElementById('screen-game').classList.contains('active'));
check("state.revisaoMode ligado", state.revisaoMode === true);
check("state.game é o id sintético 'revisao'", state.game === 'revisao');
check("roundPlan tem 2 rodadas por atividade vencida (2x2=4)", state.roundPlan.length === 4);
check("revisaoResults tem entrada pra cada atividade vencida", Object.keys(state.revisaoResults).length === 2);
check("botão de rever aula escondido (sessão multi-atividade)", document.getElementById('lesson-revisit-btn').style.display === 'none');
check("round-info mostra o rótulo de Revisão", document.getElementById('round-info').textContent.includes('Revisão de Hoje'));

// ===== 4. registerAnswer durante revisão pontua em revisaoResults, não em mastery =====
const masteryKeysBefore = Object.keys(mastery).length;
const currentAct = state.currentRender; // 'rimas' ou 'leitura', o que caiu na 1ª rodada
registerAnswer(true, null);
check("acerto em revisão soma em revisaoResults", state.revisaoResults[currentAct].correct >= 1);
check("registerAnswer em revisão NÃO grava em mastery", Object.keys(mastery).length === masteryKeysBefore);

// termina a sessão inteira (setTimeout foi sobrescrito acima pra rodar na hora).
// Cada rodada só avança no clique CERTO -- tenta os botões da rodada um a um
// até acertar (ou esgotar), então segue pra próxima rodada.
let safety = 0;
while(state.revisaoMode && safety < 20){
  safety++;
  const roundBefore = state.round;
  const btns = Array.from(document.querySelectorAll('.option-btn'));
  for(const b of btns){
    b.click();
    if(state.round !== roundBefore || !state.revisaoMode) break;
  }
  if(state.round === roundBefore && state.revisaoMode) break; // não avançou -- evita loop infinito
}
check("sessão de revisão termina (revisaoMode desliga)", state.revisaoMode === false);
check("volta pra tela de fim de sessão", document.getElementById('screen-end').classList.contains('active'));
check("resumo de fim de sessão menciona revisão", document.getElementById('end-summary').textContent.includes('Revisão concluída'));

// ===== 5. endRevisao avança estágio só quando bate o limiar =====
// Situação controlada: força os resultados finais em vez de confiar em cliques aleatórios.
reviewState.rimas = { stage: 0, lastReviewedAt: daysAgoIso(3) };
reviewState.leitura = { stage: 0, lastReviewedAt: daysAgoIso(3) };
state.revisaoMode = true;
state.child = 'benjamin';
state.sessionStars = 2;
state.totalRounds = 4;
state.revisaoResults = {
  rimas: {correct: 2, total: 2},   // 100% -- bate o limiar de 60%
  leitura: {correct: 1, total: 2}  // 50% -- não bate
};
endRevisao();
check("atividade com bom desempenho avança de estágio", reviewState.rimas.stage === 1);
check("atividade com desempenho fraco NÃO avança de estágio", reviewState.leitura.stage === 0);
check("relógio reinicia nas duas, independente do resultado", !isDueForReview('rimas') && !isDueForReview('leitura'));

// ===== 6. navegação de volta (navBack = "anoletivo") =====
state.navBack = 'anoletivo';
document.getElementById('play-again-btn').onclick();
check("'Voltar' depois da revisão retorna pra tela de Ano Letivo", document.getElementById('screen-menu').classList.contains('active'));

// ===== 7. card "Revisão de Hoje" só aparece quando há atividade vencida =====
Object.keys(reviewState).forEach(k=>delete reviewState[k]);
renderAnoLetivo();
check("sem atividade vencida, card de revisão não aparece", !document.getElementById('game-grid').innerHTML.includes('Revisão de Hoje'));
reviewState.rimas = { stage: 0, lastReviewedAt: daysAgoIso(5) };
renderAnoLetivo();
check("com atividade vencida, card de revisão aparece", document.getElementById('game-grid').innerHTML.includes('Revisão de Hoje'));

// ===== 8. integração: endSession() registra a atividade no ciclo na primeira dominação =====
Object.keys(reviewState).forEach(k=>delete reviewState[k]);
activityLevel.pontuacao = 5;
mastery['pontuacao:5'] = [true,true,true,true,true,true,true,true,true,true]; // 100%
state.game = 'pontuacao';
state.child = 'benjamin';
state.sessionStars = 6;
state.totalRounds = 6;
endSession();
check("endSession registra a atividade recém-dominada no ciclo de revisão", !!reviewState.pontuacao);

// ===== 9. resets do admin limpam o reviewState =====
reviewState.rimas = { stage: 2, lastReviewedAt: daysAgoIso(1) };
adminReset('rimas');
check("adminReset remove a atividade do ciclo de revisão", !reviewState.rimas);

reviewState.leitura = { stage: 1, lastReviewedAt: daysAgoIso(1) };
reviewState.pontuacao = { stage: 0, lastReviewedAt: daysAgoIso(1) };
adminResetAll();
check("adminResetAll limpa o reviewState inteiro", Object.keys(reviewState).length === 0);

// ===== 10. persistência (round-trip via storage.js) =====
reviewState.rimas = { stage: 2, lastReviewedAt: daysAgoIso(7) };
saveProgress();
const savedRaw = JSON.parse(localStorage.getItem('ilhaAprendizProgresso'));
check("saveProgress inclui reviewState no payload", savedRaw.reviewState && savedRaw.reviewState.rimas && savedRaw.reviewState.rimas.stage === 2);

delete reviewState.rimas; // "esquece" em memória, igual reabrir a aba
loadProgress();
check("loadProgress restaura reviewState", reviewState.rimas && reviewState.rimas.stage === 2);

// defesas: entrada malformada é ignorada, não corrompe nem trava
localStorage.setItem('ilhaAprendizProgresso', JSON.stringify({
  version: 1,
  reviewState: {
    valido: {stage: 1, lastReviewedAt: daysAgoIso(1)},
    stage_fora_do_range: {stage: 99, lastReviewedAt: daysAgoIso(1)},
    sem_data: {stage: 1},
    data_invalida: {stage: 1, lastReviewedAt: "não é uma data"}
  }
}));
Object.keys(reviewState).forEach(k=>delete reviewState[k]);
let threw = false;
try { loadProgress(); } catch(e){ threw = true; }
check("loadProgress não lança exceção com reviewState malformado", !threw);
check("loadProgress aceita a entrada válida", reviewState.valido && reviewState.valido.stage === 1);
check("loadProgress ignora stage fora do range", !reviewState.stage_fora_do_range);
check("loadProgress ignora entrada sem data", !reviewState.sem_data);
check("loadProgress ignora entrada com data inválida", !reviewState.data_invalida);

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', ()=>{});
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
