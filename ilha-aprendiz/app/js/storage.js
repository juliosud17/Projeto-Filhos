// Persistencia de progresso (localStorage) -- item 1 do docs/ROADMAP.md,
// pre-requisito de tudo mais (revisao espacada, trava de ritmo, avaliacao
// real com o Benjamin). Decisao registrada em docs/DECISOES.md.
//
// O que persiste: activityLevel (nivel 1-5 de cada atividade), mastery
// (historico das ultimas 10 tentativas de PRIMEIRA jogada por nivel --
// o Julio pediu "tudo", incluindo esse historico fino, nao so o nivel),
// provaPassed/provaScores (Desafio Final) e state.totalStars.
//
// O que NAO persiste, de proposito: a tela/rodada em que a crianca estava
// no meio de uma sessao -- ao reabrir o app, sempre comeca pela tela de
// selecao de crianca (screen-home), como hoje, so que com os niveis,
// estrelas e desafios finais certos ja restaurados. Retomar uma sessao a
// meio de uma rodada especifica adicionaria risco (ex.: reabrir dentro de
// um Desafio Final em andamento) sem ganho real -- perder no maximo os
// dados da sessao em curso e um custo aceitavel comparado a hoje, que perde
// TUDO a cada fechar de aba.

const STORAGE_KEY = "ilhaAprendizProgresso";
const STORAGE_VERSION = 1;

function hasLocalStorage(){
  try {
    return typeof localStorage !== "undefined" && localStorage !== null;
  } catch(e){
    return false; // Safari em modo privado antigo, ou storage bloqueado por politica
  }
}

/* Salva o estado atual. Chamada depois de cada mudanca real (fim de rodada
   com registro de mastery, fim de sessao, fim de Desafio Final, resets do
   admin) -- nao em loop nem em cada clique, so nos pontos onde o estado
   realmente muda. Falha de escrita (quota cheia, modo privado) nunca trava
   o jogo -- só fica sem salvar essa mudanca especifica. */
function saveProgress(){
  if(!hasLocalStorage()) return;
  try {
    const payload = {
      version: STORAGE_VERSION,
      activityLevel,
      mastery,
      provaPassed,
      provaScores,
      reviewState,
      totalStars: state.totalStars,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch(e){
    console.warn("Ilha Aprendiz: não foi possível salvar o progresso.", e);
  }
}

/* Restaura o estado salvo por cima dos objetos já existentes (activityLevel,
   mastery, provaPassed, provaScores, state.totalStars são todos `const` --
   mutar propriedade, nunca substituir a referência, senão os outros
   arquivos que já seguram essas referências ficariam apontando pro objeto
   velho). Validação leve em cada campo: só aplica valor com o tipo/forma
   esperada, ignora o resto -- protege contra um localStorage adulterado à
   mão ou de uma versão futura incompatível corromper o estado em memória. */
function loadProgress(){
  if(!hasLocalStorage()) return;
  let raw;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch(e){ return; }
  if(!raw) return;

  let saved;
  try {
    saved = JSON.parse(raw);
  } catch(e){
    console.warn("Ilha Aprendiz: progresso salvo estava corrompido, ignorando.", e);
    return;
  }
  if(!saved || saved.version !== STORAGE_VERSION) return;

  if(saved.activityLevel && typeof saved.activityLevel === "object"){
    Object.keys(saved.activityLevel).forEach(k=>{
      const v = saved.activityLevel[k];
      if(activityLevel.hasOwnProperty(k) && Number.isInteger(v) && v >= 1 && v <= 5){
        activityLevel[k] = v;
      }
    });
  }
  if(saved.mastery && typeof saved.mastery === "object"){
    Object.keys(saved.mastery).forEach(k=>{
      const arr = saved.mastery[k];
      if(Array.isArray(arr)){
        mastery[k] = arr.filter(x=>typeof x === "boolean").slice(-10);
      }
    });
  }
  if(saved.provaPassed && typeof saved.provaPassed === "object"){
    Object.keys(saved.provaPassed).forEach(k=>{
      if(saved.provaPassed[k] === true) provaPassed[k] = true;
    });
  }
  if(saved.provaScores && typeof saved.provaScores === "object"){
    Object.keys(saved.provaScores).forEach(k=>{
      const s = saved.provaScores[k];
      if(s && typeof s === "object" && Array.isArray(s.perActivity)){
        provaScores[k] = s;
      }
    });
  }
  if(saved.reviewState && typeof saved.reviewState === "object"){
    Object.keys(saved.reviewState).forEach(k=>{
      const r = saved.reviewState[k];
      if(r && typeof r === "object" && Number.isInteger(r.stage) && r.stage >= 0 && r.stage < REVIEW_INTERVALS_DAYS.length && typeof r.lastReviewedAt === "string" && !isNaN(Date.parse(r.lastReviewedAt))){
        reviewState[k] = { stage: r.stage, lastReviewedAt: r.lastReviewedAt };
      }
    });
  }
  if(saved.totalStars && typeof saved.totalStars === "object"){
    ["joaquim","benjamin"].forEach(child=>{
      const v = saved.totalStars[child];
      if(Number.isFinite(v) && v >= 0) state.totalStars[child] = v;
    });
  }
}

/* Apaga todo progresso salvo -- usado pelo "Resetar TUDO" do admin, pra que
   um reset sobreviva ao proximo carregamento em vez de a proxima sessao
   restaurar os dados antigos por cima do reset que acabou de acontecer. */
function clearProgress(){
  if(!hasLocalStorage()) return;
  try { localStorage.removeItem(STORAGE_KEY); } catch(e){}
}

// Restaura o progresso assim que o script carrega (fim do <body>, DOM já
// parseado) e atualiza o contador de estrelas visível na tela inicial.
loadProgress();
updateGlobalStars();
