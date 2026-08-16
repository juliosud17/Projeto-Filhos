// Revisao espacada -- item 2 do docs/ROADMAP.md. Design completo e a
// justificativa de cada escolha em pedagogia/REVISAO_ESPACADA.md e
// docs/DECISOES.md (2026-08-16). Resumo: quando uma atividade é dominada
// pela primeira vez (nível 5 + 80%+), entra num ciclo de revisão com
// intervalos crescentes (tipo curva de repetição espaçada clássica) --
// "🔁 Revisão de Hoje" na tela de Ano Letivo do Benjamin junta as
// atividades vencidas numa sessão só, reaproveitando o mesmo loop de jogo
// de sempre (nextRound/renderRound/registerAnswer), só que multi-atividade
// em vez de uma só repetida. Pontuação de revisão fica numa trilha
// separada (`state.revisaoResults`) -- igual ao Desafio Final, nunca mexe
// em `mastery` nem em `activityLevel`, pra não distorcer as estatísticas
// de domínio da prática normal.

const REVIEW_INTERVALS_DAYS = [2, 5, 10, 21, 45]; // cresce a cada revisão OK; fica no último pra sempre -- o objetivo é retenção contínua, não "graduar" do ciclo
const REVIEW_ROUNDS_PER_ACTIVITY = 2;
const REVIEW_PASS_PER_ACTIVITY = 60; // % de acerto na sessão pra avançar de estágio -- mesmo limiar usado por atividade no Desafio Final, por consistência

const reviewState = {}; // {activityId: {stage:0..4, lastReviewedAt: ISOString}}

function daysSince(isoDate){
  return (Date.now() - new Date(isoDate).getTime()) / (1000 * 60 * 60 * 24);
}

/* Chamado de dentro de endSession() na primeira vez que uma atividade fica
   dominada (nível 5, 80%+). Só cria a entrada uma vez -- se a criança
   rejogar o nível 5 por diversão depois de já dominado, isso não deve
   resetar o relógio da revisão toda hora. */
function registerActivityMastered(activityId){
  if(reviewState[activityId]) return;
  reviewState[activityId] = { stage: 0, lastReviewedAt: new Date().toISOString() };
}

function isDueForReview(activityId){
  const r = reviewState[activityId];
  if(!r) return false;
  const stage = Math.min(r.stage, REVIEW_INTERVALS_DAYS.length - 1);
  return daysSince(r.lastReviewedAt) >= REVIEW_INTERVALS_DAYS[stage];
}

function dueReviewActivities(){
  return Object.keys(reviewState).filter(isDueForReview);
}

/* Monta e inicia uma sessão de revisão multi-atividade -- mesmo padrão de
   startGame()/startProva(), mas o "jogo" não é uma atividade real: é um
   roundPlan feito de várias atividades já dominadas, embaralhadas. */
function startRevisao(){
  const due = dueReviewActivities();
  if(due.length === 0) return;
  state.revisaoMode = true;
  state.revisaoResults = {};
  due.forEach(id => state.revisaoResults[id] = {correct:0, total:0});
  state.game = "revisao";
  state.subgames = due;
  state.round = 0;
  state.sessionStars = 0;
  state.pools = {};
  state.usedSomLetters = new Set();
  document.getElementById("session-stars").textContent = 0;
  const revisitBtn = document.getElementById("lesson-revisit-btn");
  if(revisitBtn) revisitBtn.style.display = "none"; // sessão multi-atividade, não faz sentido reabrir 1 aula
  let plan = [];
  due.forEach(id=>{ for(let i=0;i<REVIEW_ROUNDS_PER_ACTIVITY;i++) plan.push(id); });
  state.roundPlan = shuffle(plan);
  state.totalRounds = state.roundPlan.length;
  nextRound();
  showScreen("screen-game");
}

/* Fecha a sessão de revisão: por atividade incluída, se o desempenho bateu
   o limiar avança o estágio (intervalo maior da próxima vez); erra ou não
   bate o limiar, tenta de novo no mesmo estágio -- nunca RECUA de estágio
   (princípio "nunca penalizar erro" do CLAUDE.md aplicado aqui: o pior que
   acontece é a próxima revisão vir um pouco mais cedo, nunca perde
   progresso conquistado). Em ambos os casos o relógio reinicia agora, pra
   não voltar a cutucar de novo amanhã. */
function endRevisao(){
  state.totalStars[state.child] += state.sessionStars;
  updateGlobalStars();

  const activityIds = Object.keys(state.revisaoResults);
  activityIds.forEach(id=>{
    const r = state.revisaoResults[id];
    const pct = r.total ? Math.round((r.correct / r.total) * 100) : 0;
    const entry = reviewState[id];
    if(!entry) return;
    if(pct >= REVIEW_PASS_PER_ACTIVITY && entry.stage < REVIEW_INTERVALS_DAYS.length - 1){
      entry.stage++;
    }
    entry.lastReviewedAt = new Date().toISOString();
  });

  state.revisaoMode = false;
  saveProgress();

  document.getElementById("end-name").textContent = CHILD_INFO[state.child].name;
  const playAgainBtn = document.getElementById("play-again-btn");
  playAgainBtn.textContent = "Voltar";
  playAgainBtn.onclick = backToMenu;
  document.getElementById("end-summary").textContent =
    `🔁 Revisão concluída! Você ganhou ${state.sessionStars} de ${state.totalRounds} estrelas revisando ${activityIds.length} atividade${activityIds.length===1?"":"s"} já dominada${activityIds.length===1?"":"s"}. Total geral: ${state.totalStars[state.child]} ⭐.`;
  showScreen("screen-end");
}
