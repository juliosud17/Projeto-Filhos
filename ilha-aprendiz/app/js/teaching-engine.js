// Motor de Ensino: fluxo da aula, navegacao entre passos, sugestao de revisao apos erros.
const lessonState = { activityId:null, stepIndex:0, resume:false, practiceOk:false };

/* Chamado ao clicar num card de atividade: mostra a Aula da Ilha só na
   primeira vez (por sessão) que a criança entra numa atividade que tem
   aula — nas próximas vezes, ou pra atividades sem aula ainda, vai direto
   pra prática, igual já funcionava antes. */
function maybeShowLesson(activityId){
  if(LESSONS[activityId] && !state.lessonsSeen.has(activityId)){
    showLesson(activityId, false);
  }else{
    startGame(activityId);
  }
}

/* Abre a Aula da Ilha. resume=true quando é reaberta de dentro de uma sessão
   já em andamento (botão "🎓 Rever aula" ou sugestão após erros seguidos) —
   nesse caso o botão final volta pra rodada em andamento em vez de reiniciar
   a atividade do zero. */
function showLesson(activityId, resume){
  if(!LESSONS[activityId]) return;
  lessonState.activityId = activityId;
  lessonState.stepIndex = 0;
  lessonState.resume = !!resume;
  lessonState.practiceOk = false;
  state.lessonsSeen.add(activityId);
  document.getElementById("lesson-skip-btn").textContent = resume ? "Voltar a praticar →" : "Pular aula →";
  renderLessonStep();
  showScreen("screen-lesson");
}

function renderLessonStep(){
  const lesson = LESSONS[lessonState.activityId];
  const steps = lesson.steps;
  const i = lessonState.stepIndex;
  const step = steps[i];
  document.getElementById("lesson-progress").textContent = `${lesson.icon} ${lesson.title} · Passo ${i+1} de ${steps.length}`;
  const card = document.getElementById("lesson-card");

  if(step.type === "practice"){
    lessonState.practiceOk = false;
    card.innerHTML = `<span class="lesson-badge">${step.badge}</span>${step.render()}`;
    speak(step.spoken);
    const opts = card.querySelector("#lesson-practice-opts");
    const hint = card.querySelector("#lesson-hint");
    step.options.forEach(o=>{
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = o.label;
      btn.onclick = ()=>{
        if(o.correct){
          btn.classList.add("correct-flash");
          hint.textContent = "✅ " + step.rightMsg;
          hint.style.color = "var(--green)";
          lessonState.practiceOk = true;
          renderLessonNav();
        }else{
          btn.classList.add("wrong-flash");
          setTimeout(()=>btn.classList.remove("wrong-flash"), 500);
          hint.textContent = "💡 " + step.hintMsg;
          hint.style.color = "var(--orange)";
        }
      };
      opts.appendChild(btn);
    });
  }else{
    card.innerHTML = `<span class="lesson-badge">${step.badge}</span>${step.html()}`;
    speak(step.spoken);
  }
  renderLessonNav();
}

function renderLessonNav(){
  const lesson = LESSONS[lessonState.activityId];
  const i = lessonState.stepIndex;
  const step = lesson.steps[i];
  const isLast = i === lesson.steps.length - 1;
  const nextDisabled = step.type === "practice" && !lessonState.practiceOk;
  const card = document.getElementById("lesson-card");
  const existingNav = card.querySelector(".lesson-nav-row");
  if(existingNav) existingNav.remove();

  let html = `<div class="lesson-nav-row">`;
  if(i > 0) html += `<button class="primary-btn" style="background:#b8b4d6;" onclick="lessonPrev()">← Anterior</button>`;
  html += isLast
    ? `<button class="primary-btn" onclick="finishLesson()">🎯 Começar a praticar!</button>`
    : `<button class="primary-btn" onclick="lessonNext()"${nextDisabled ? " disabled" : ""}>Próximo →</button>`;
  html += `</div>`;
  card.insertAdjacentHTML("beforeend", html);
}

function lessonNext(){
  const lesson = LESSONS[lessonState.activityId];
  if(lessonState.stepIndex < lesson.steps.length - 1){
    lessonState.stepIndex++;
    renderLessonStep();
  }
}
function lessonPrev(){
  if(lessonState.stepIndex > 0){
    lessonState.stepIndex--;
    renderLessonStep();
  }
}
/* "Pular aula" (primeira vez) manda direto pra prática; em modo resume,
   funciona como "voltar a praticar" — nenhum dos dois casos deveria travar
   a criança dentro da aula. */
function skipLesson(){
  const id = lessonState.activityId;
  speakStop();
  if(lessonState.resume){ showScreen("screen-game"); }
  else{ startGame(id); }
}
function finishLesson(){
  const id = lessonState.activityId;
  speakStop();
  if(lessonState.resume){
    state.wrongStreak = 0;
    showScreen("screen-game");
  }else{
    startGame(id);
  }
}

/* ============ MOTOR DE JOGO ============ */
/* Módulos com mais de uma atividade (ex.: Módulo 1) alternam entre os jogos
   listados em `games`. Isso evita que o domínio de um módulo inteiro seja
   medido por um único tipo de exercício. */
