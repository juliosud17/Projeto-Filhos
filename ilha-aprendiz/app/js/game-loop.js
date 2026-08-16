// Loop do jogo: iniciar atividade, proxima rodada, registrar resposta, Desafio Final (fluxo).
function gamesForId(id){
  const mod = ALL_MODULES_BENJAMIN.find(m=>m.id===id);
  if(mod && mod.games && mod.games.length) return mod.games;
  return [id];
}

function startGame(gameId){
  state.game = gameId;
  state.subgames = gamesForId(gameId);
  state.round = 0;
  state.sessionStars = 0;
  state.pools = {};        // pools anti-repetição (palavras, letras) por sessão
  state.usedSomLetters = new Set();
  state.wrongStreak = 0;
  document.getElementById("session-stars").textContent = 0;
  const revisitBtn = document.getElementById("lesson-revisit-btn");
  if(revisitBtn) revisitBtn.style.display = LESSONS[gameId] ? "inline-block" : "none";
  // fila balanceada: cada atividade do módulo aparece o mesmo número de vezes
  // (mínimo 2 rodadas por atividade, sessão de pelo menos 6 rodadas), embaralhada
  const roundsPerSubgame = Math.max(2, Math.ceil(6 / state.subgames.length));
  let plan = [];
  state.subgames.forEach(g=>{ for(let i=0;i<roundsPerSubgame;i++) plan.push(g); });
  state.roundPlan = shuffle(plan);
  state.totalRounds = state.roundPlan.length;
  nextRound();
  showScreen("screen-game");
}

function playAgainSameGame(){
  startGame(state.game);
}

function nextRound(){
  state.round++;
  state.roundFirstTryUsed = false;
  document.getElementById("feedback-msg").textContent = "";
  document.getElementById("feedback-msg").className = "feedback-msg";
  if(state.round > state.totalRounds){
    if(state.provaMode){ endProva(); } else { endSession(); }
    return;
  }
  // sorteia qual das atividades do módulo aparece nesta rodada
  state.currentRender = state.roundPlan[state.round - 1];
  if(state.provaMode){
    document.getElementById("round-info").textContent = `🏁 Desafio Final · Pergunta ${state.round} de ${state.totalRounds}`;
  }else{
    const levelTag = activityLevel.hasOwnProperty(state.game) ? ` · Nível ${activityLevel[state.game]}/5` : "";
    document.getElementById("round-info").textContent = `Rodada ${state.round} de ${state.totalRounds}${levelTag}`;
  }
  renderRound();
}

/* Inicia o Desafio Final de um módulo: sorteia PROVA_QUESTIONS_PER_ACTIVITY
   perguntas de CADA atividade do módulo (sempre no nível em que a atividade
   está — que só pode ser nível 5, já que a prova só fica disponível depois
   do módulo inteiro dominado), embaralhadas entre si. Não usa `recordMastery`
   nem mexe em `activityLevel` — é uma trilha de pontuação inteiramente
   separada da prática normal, pra não distorcer as estatísticas de domínio
   com uma sessão propositalmente mais exigente (sem repetição forçada de
   nível de dificuldade — apenas 1 tentativa "vale" por pergunta). */
function startProva(containerId){
  const container = containerById(containerId);
  if(!container) return;
  state.provaMode = true;
  state.provaContainerId = containerId;
  state.provaResults = {};
  container.activities.forEach(a=> state.provaResults[a.id] = {correct:0, total:0});
  state.game = containerId;
  state.subgames = container.activities.map(a=>a.id);
  state.round = 0;
  state.sessionStars = 0;
  state.pools = {};
  state.usedSomLetters = new Set();
  document.getElementById("session-stars").textContent = 0;
  let plan = [];
  container.activities.forEach(a=>{ for(let i=0;i<PROVA_QUESTIONS_PER_ACTIVITY;i++) plan.push(a.id); });
  state.roundPlan = shuffle(plan);
  state.totalRounds = state.roundPlan.length;
  nextRound();
  showScreen("screen-game");
}

function retryProva(){
  startProva(state.provaContainerId);
}

/* Fecha o Desafio Final: calcula % geral e % por atividade, aplica os dois
   critérios de aprovação (80% geral E 60%+ em cada atividade — pra não
   deixar uma atividade fraca escondida atrás da média), grava o resultado
   em `provaScores` (histórico do último resultado, visível no admin) e, se
   aprovado, marca `provaPassed[containerId] = true` — o único gatilho que
   destrava o próximo módulo junto com o domínio de 80%/nível 5. */
function endProva(){
  const container = containerById(state.provaContainerId);
  const mod = ALL_MODULES_BENJAMIN.find(m=>m.id === state.provaContainerId);
  let totalCorrect = 0, totalQuestions = 0;
  const perActivity = container.activities.map(a=>{
    const r = state.provaResults[a.id];
    totalCorrect += r.correct; totalQuestions += r.total;
    const pct = r.total ? Math.round((r.correct/r.total)*100) : 0;
    return {act:a, correct:r.correct, total:r.total, pct};
  });
  const overallPct = totalQuestions ? Math.round((totalCorrect/totalQuestions)*100) : 0;
  const allActivitiesOk = perActivity.every(p=>p.pct >= PROVA_PASS_PER_ACTIVITY);
  const passed = overallPct >= PROVA_PASS_OVERALL && allActivitiesOk;

  provaScores[state.provaContainerId] = {overallPct, perActivity, passed};
  if(passed) provaPassed[state.provaContainerId] = true;

  state.totalStars[state.child] += state.sessionStars;
  updateGlobalStars();

  const nextMod = ALL_MODULES_BENJAMIN.find(m=>m.requires === state.provaContainerId);
  document.getElementById("prova-badge").textContent = passed ? "🏅" : "🔁";
  document.getElementById("prova-title").textContent = passed
    ? `Parabéns, ${CHILD_INFO[state.child].name}! Desafio Final concluído!`
    : `Quase lá, ${CHILD_INFO[state.child].name}!`;
  let summary = `Você acertou ${totalCorrect} de ${totalQuestions} perguntas (${overallPct}%) do ${mod.name}.`;
  if(passed){
    summary += nextMod ? ` O ${nextMod.name} ${nextMod.built ? "já está desbloqueado!" : "ainda está em construção."}` : " Você concluiu esse módulo com louvor! 🎉";
  }else{
    summary += ` Pra passar, precisa de pelo menos ${PROVA_PASS_OVERALL}% no total e ${PROVA_PASS_PER_ACTIVITY}% em cada atividade. Bora treinar mais um pouco e tentar de novo!`;
  }
  document.getElementById("prova-summary").textContent = summary;

  const breakdown = document.getElementById("prova-breakdown");
  breakdown.innerHTML = "<h5 style='margin-bottom:6px; color:var(--purple-dark);'>Como você foi em cada atividade:</h5><ul style='margin:0; padding-left:18px;'>" +
    perActivity.map(p=>`<li>${p.act.icon} ${p.act.name}: ${p.correct}/${p.total} (${p.pct}%) ${p.pct>=PROVA_PASS_PER_ACTIVITY?"✅":"⚠️"}</li>`).join("") +
    "</ul>";

  document.getElementById("prova-retry-btn").textContent = passed ? "🔁 Fazer de novo (por diversão)" : "🔁 Tentar de novo";

  state.provaMode = false;
  saveProgress(); // provaPassed/provaScores e estrelas mudaram acima
  showScreen("screen-prova-result");
}

/* Pool anti-repetição: embaralha o array uma vez por sessão e vai "consumindo"
   itens, recarregando só quando tudo já foi usado. Evita repetir a mesma
   palavra/letra na mesma sessão de jogo. */
function pickFromPool(poolName, sourceArray){
  if(!state.pools[poolName] || state.pools[poolName].length === 0){
    state.pools[poolName] = shuffle(sourceArray);
  }
  return state.pools[poolName].pop();
}

/* Sorteia priorizando o nível atual (65% das vezes) e revisando níveis
   anteriores (35%), em vez de um pool cumulativo onde o conteúdo fácil
   dos níveis passados continua dominando as rodadas e disfarça a evolução
   de dificuldade. Funciona tanto para WORDS (objetos com .level) quanto
   para LETTERS (strings, usando LETTER_LEVELS). */
function pickWeightedByLevel(sourceArray, lvl, poolPrefix){
  const levelOf = x => (typeof x === "object" ? x.level : (LETTER_LEVELS[x] || 5));
  const exactTier = sourceArray.filter(x => levelOf(x) === lvl);
  const reviewTier = sourceArray.filter(x => levelOf(x) < lvl);
  // só tenta o nível exato se ele de fato tem conteúdo — bancos menores (ex.: Rimas,
  // Famílias de troca de letra) nem sempre têm item em todo nível 1-5, diferente de
  // WORDS/LETTERS que são densos; sem essa checagem, pickFromPool podia receber um
  // array vazio e devolver undefined.
  let useExact = exactTier.length > 0 && (reviewTier.length === 0 || Math.random() < 0.65);
  let tierPool = useExact ? exactTier : reviewTier;
  let tag = useExact ? "E" : "R";
  if(tierPool.length === 0){ tierPool = sourceArray; tag = "A"; } // fallback final de segurança
  return pickFromPool(poolPrefix + "_" + lvl + "_" + tag, tierPool);
}

function endSession(){
  state.totalStars[state.child] += state.sessionStars;
  updateGlobalStars();
  document.getElementById("end-name").textContent = CHILD_INFO[state.child].name;

  let msg = "";
  const playAgainBtn = document.getElementById("play-again-btn");
  playAgainBtn.textContent = "Jogar de novo"; // padrão, sobrescrito abaixo quando faz sentido
  playAgainBtn.onclick = playAgainSameGame; // padrão, sobrescrito abaixo quando faz sentido

  if(activityLevel.hasOwnProperty(state.game)){
    // Atividade do Módulo 1 com 5 níveis próprios
    const lvl = activityLevel[state.game];
    const pct = masteryPercent(state.game + ":" + lvl);
    if(pct >= 80 && lvl < 5){
      activityLevel[state.game] = lvl + 1;
      msg = ` Nível ${lvl} dominado (${pct}%) — você subiu para o Nível ${lvl+1} de 5! 🎉`;
      playAgainBtn.textContent = `▶️ Ir para o Nível ${lvl+1}`;
    }else if(pct >= 80 && lvl === 5){
      msg = ` Nível 5 dominado (${pct}%) — atividade completa! 🏆`;
      // acha o container dessa atividade (Módulo 1, 2, 3...) e, se ele acabou
      // de ficar completo, avisa sobre o desbloqueio do próximo módulo —
      // genérico, funciona pra qualquer atividade de qualquer módulo leveled.
      // Desde que o Desafio Final virou critério de desbloqueio, "completo"
      // não é mais sinônimo de "próximo módulo liberado" — só avisa que
      // liberou de verdade depois da prova aprovada; senão, convida pro
      // Desafio Final diretamente no botão.
      const container = containerForActivity(state.game);
      if(container && container.fullyMastered()){
        const containerMod = ALL_MODULES_BENJAMIN.find(m=>m.id === container.containerId);
        const nextMod = ALL_MODULES_BENJAMIN.find(m=>m.requires === container.containerId);
        if(provaPassed[container.containerId]){
          if(containerMod && nextMod){
            msg += ` As ${container.activities.length} atividades do ${containerMod.name} estão completas e o Desafio Final já foi conquistado — o ${nextMod.name} ${nextMod.built ? "está desbloqueado!" : "ainda está em construção."}`;
          }
          playAgainBtn.textContent = "🔁 Jogar Nível 5 de novo";
        }else{
          msg += ` As ${container.activities.length} atividades do ${containerMod.name} estão completas — falta o 🏁 Desafio Final para desbloquear o próximo módulo!`;
          playAgainBtn.textContent = "🏁 Fazer o Desafio Final";
          playAgainBtn.onclick = ()=> { state.navBack = "atividades"; startProva(container.containerId); };
        }
      }else{
        playAgainBtn.textContent = "🔁 Jogar Nível 5 de novo";
      }
    }else{
      msg = ` Domínio no Nível ${lvl} de 5: ${pct}% (precisa de 80% para subir de nível).`;
      playAgainBtn.textContent = `🔁 Tentar de novo (Nível ${lvl})`;
    }
  }else{
    const pct = masteryPercent(state.game);
    const nextMod = ALL_MODULES_BENJAMIN.find(m=>m.requires === state.game);
    if(nextMod && nextMod.built){
      msg = pct >= nextMod.unlockAt
        ? ` Domínio de ${pct}% — o ${nextMod.name} já está desbloqueado! 🎉`
        : ` Domínio atual: ${pct}% (precisa de ${nextMod.unlockAt}% para desbloquear o próximo módulo).`;
    }else if(nextMod && !nextMod.built){
      msg = ` Domínio atual: ${pct}%. O próximo módulo (${nextMod.name}) ainda está em construção.`;
    }
  }
  document.getElementById("end-summary").textContent =
    `Você ganhou ${state.sessionStars} de ${state.totalRounds} estrelas nesta rodada. Total geral: ${state.totalStars[state.child]} ⭐.${msg}`;
  saveProgress(); // nível pode ter subido e/ou estrelas mudaram acima
  showScreen("screen-end");
}

function registerAnswer(isCorrect, btnEl){
  if(!state.roundFirstTryUsed){
    state.roundFirstTryUsed = true;
    if(state.provaMode){
      // Desafio Final: pontua na trilha separada de provaResults, NUNCA em
      // `mastery` — a prova não deve distorcer as estatísticas de domínio
      // da prática normal.
      const r = state.provaResults[state.currentRender];
      r.total++;
      if(isCorrect) r.correct++;
    }else{
      const key = activityLevel.hasOwnProperty(state.game)
        ? state.game + ":" + activityLevel[state.game]
        : state.game;
      recordMastery(key, isCorrect);
      saveProgress();
      // erros seguidos de PRIMEIRA tentativa na atividade atual — só pra
      // sugerir gentilmente "rever a aula", nunca pra travar ou penalizar.
      state.wrongStreak = isCorrect ? 0 : (state.wrongStreak || 0) + 1;
    }
  }
  if(isCorrect){
    beep("ok");
    state.sessionStars++;
    document.getElementById("session-stars").textContent = state.sessionStars;
    const fb = document.getElementById("feedback-msg");
    fb.textContent = ["Isso aí! 🌟","Muito bem! 🎉","Você acertou! ✨","Excelente! 👏"][Math.floor(Math.random()*4)];
    fb.className = "feedback-msg ok";
    if(btnEl) btnEl.classList.add("correct-flash");
    disableOptions();
    setTimeout(nextRound, 1100);
  }else{
    beep("no");
    const fb = document.getElementById("feedback-msg");
    // Errou 3+ vezes seguidas nesta atividade e ela tem Aula da Ilha: em vez
    // de só "tenta de novo", oferece um jeito fácil de rever a explicação —
    // sinal de que provavelmente não é distração, é o conceito mesmo que
    // ainda não pegou.
    if(!state.provaMode && state.wrongStreak >= 3 && LESSONS[state.game]){
      fb.innerHTML = 'Quase! Tenta de novo 💪 &nbsp;<a href="#" onclick="showLesson(state.game, true); return false;" style="color:var(--purple-dark); text-decoration:underline; font-weight:800;">👀 Rever a aulinha?</a>';
    }else{
      fb.textContent = "Quase! Tenta de novo 💪";
    }
    fb.className = "feedback-msg no";
    if(btnEl){
      btnEl.classList.add("wrong-flash");
      setTimeout(()=>btnEl.classList.remove("wrong-flash"), 500);
    }
  }
}

function disableOptions(){
  document.querySelectorAll(".option-btn").forEach(b=> b.onclick = null);
}

/* ============ RENDER DE CADA JOGO ============ */
function renderRound(){
  const stage = document.getElementById("game-stage");
  stage.innerHTML = "";

  switch(state.currentRender){
    case "letras": return renderLetras(stage);
    case "letras_b": return renderLetras(stage);
    case "numeros": return renderNumeros(stage);
    case "contar": return renderContar(stage);
    case "silabas": return renderSilabas(stage);
    case "leitura": return renderLeitura(stage);
    case "frases_leitura": return renderFrasesLeitura(stage);
    case "escrita_certa": return renderEscritaCerta(stage);
    case "parlendas": return renderParlendas(stage);
    case "silaba_meio_fim": return renderSilabaMeioFim(stage);
    case "pontuacao": return renderPontuacao(stage);
    case "lista_completa": return renderListaCompleta(stage);
    case "texto_funcional": return renderTextoFuncional(stage);
    case "parlenda_de_cor": return renderParlendaDeCor(stage);
    case "sinonimos_antonimos": return renderSinonimosAntonimos(stage);
    case "genero_textual": return renderGeneroTextual(stage);
    case "ler_responder": return renderLerResponder(stage);
    case "elementos_historia": return renderElementosHistoria(stage);
    case "reconte_historia": return renderReconteHistoria(stage);
    case "invente_final": return renderInventeFinal(stage);
    case "substantivo_verbo": return renderSubstantivoVerbo(stage);
    case "acao_combina": return renderAcaoCombina(stage);
    case "pontuacao_texto": return renderPontuacaoTexto(stage);
    case "quantos_tem": return renderQuantosTem(stage);
    case "conta_comigo_b": return renderContaComigoB(stage);
    case "qual_tem_mais": return renderQualTemMais(stage);
    case "conta_ate_100": return renderContaAte100(stage);
    case "pulando_de_10": return renderPulandoDe10(stage);
    case "qual_e_maior": return renderQualEMaior(stage);
    case "organize_por_tamanho": return renderOrganizePorTamanho(stage);
    case "o_que_vem_depois": return renderOQueVemDepois(stage);
    case "fatos_da_soma": return renderFatosDaSoma(stage);
    case "problemas_de_somar": return renderProblemasDeSomar(stage);
    case "fatos_da_subtracao": return renderFatosDaSubtracao(stage);
    case "problemas_de_tirar": return renderProblemasDeTirar(stage);
    case "soma_ou_subtracao": return renderSomaOuSubtracao(stage);
    case "monte_o_numero": return renderMonteONumero(stage);
    case "dezena_e_unidade": return renderDezenaEUnidade(stage);
    case "onde_esta": return renderOndeEsta(stage);
    case "siga_o_mapa": return renderSigaOMapa(stage);
    case "formas_no_mundo": return renderFormasNoMundo(stage);
    case "nomeie_a_forma": return renderNomeieAForma(stage);
    case "comparar_medidas": return renderCompararMedidas(stage);
    case "cheio_ou_vazio": return renderCheioOuVazio(stage);
    case "ordem_do_dia": return renderOrdemDoDia(stage);
    case "que_dia_e_hoje": return renderQueDiaEHoje(stage);
    case "escreva_a_data": return renderEscrevaAData(stage);
    case "quanto_vale": return renderQuantoVale(stage);
    case "junte_pra_comprar": return renderJuntePraComprar(stage);
    case "vai_acontecer": return renderVaiAcontecer(stage);
    case "leia_o_grafico": return renderLeiaOGrafico(stage);
    case "soma": return renderSoma(stage);
    case "subtracao": return renderSubtracao(stage);
    case "cominicial": return renderComInicial(stage);
    case "pares_minimos": return renderParesMinimos(stage);
    case "rimas": return renderRimas(stage);
    case "manipulacao": return renderManipulacao(stage);
    case "maiusc_minusc": return renderMaiuscMinusc(stage);
  }
}

/* --- Joaquim: Caça-Letras --- */
