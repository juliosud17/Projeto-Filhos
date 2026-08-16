// Navegacao: arvore Ano Letivo -> Materia -> Modulo -> Atividades, selecao de crianca, painel dos modulos.
function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function updateGlobalStars(){
  const total = state.totalStars.joaquim + state.totalStars.benjamin;
  document.getElementById("global-stars").textContent = total;
}

function selectChild(child){
  state.child = child;
  if(child === "benjamin"){
    // Benjamin tem 21 módulos — em vez de uma lista única gigante, a
    // navegação vira uma árvore de 3 níveis (pedido explícito do Júlio):
    // Ano Letivo > Matéria (Português/Matemática) > Módulo > Atividades.
    renderAnoLetivo();
    showScreen("screen-menu");
  }else{
    // Joaquim tem só um punhado de jogos sem nível — continua na lista
    // simples de sempre, não precisa de containers aninhados.
    renderMenu();
    showScreen("screen-menu");
  }
}

function goHome(){
  state.child = null;
  showScreen("screen-home");
}

/* renderMenu(): lista simples de jogos, usada só pro Joaquim (poucos jogos
   sem nível, não precisa de containers aninhados — decisão explícita do
   Júlio ao pedir a reorganização em Ano Letivo > Matéria > Módulo). */
function renderMenu(){
  const info = CHILD_INFO[state.child];
  document.getElementById("menu-avatar").textContent = info.avatar;
  document.getElementById("menu-name").textContent = info.name;
  document.getElementById("menu-stars").textContent = "⭐ " + state.totalStars[state.child] + " estrelas conquistadas";
  document.getElementById("panel-btn").style.display = "none";

  const grid = document.getElementById("game-grid");
  grid.innerHTML = "";

  GAMES[state.child].forEach(g=>{
    const card = document.createElement("div");
    card.className = "game-card" + (g.locked ? " locked" : "");
    card.innerHTML = `<span class="tag">${g.tag}</span><div class="icon">${g.icon}</div><h4>${g.name}</h4><p>${g.desc}</p>`;
    if(!g.locked){
      card.onclick = ()=> { state.navBack = null; startGame(g.id); };
    }
    grid.appendChild(card);
  });
}

/* ============ NAVEGAÇÃO EM ÁRVORE DO BENJAMIN ============
   Ano Letivo > Matéria (Português/Matemática) > Módulo > Atividades.
   Cada nível tem sua própria tela ("Telas separadas", escolha do Júlio),
   com botão "← Voltar" subindo um nível por vez. `state.currentTrilha` e
   `state.currentModuloId` guardam onde a criança está na árvore, e
   `state.navBack` diz pra onde "← Voltar" (na tela de jogo/prova) deve
   retornar depois de terminar uma sessão. */

function renderAnoLetivo(){
  const info = CHILD_INFO[state.child];
  document.getElementById("menu-avatar").textContent = info.avatar;
  document.getElementById("menu-name").textContent = info.name;
  document.getElementById("menu-stars").textContent = "⭐ " + state.totalStars[state.child] + " estrelas conquistadas";
  document.getElementById("panel-btn").style.display = "inline-block";

  const grid = document.getElementById("game-grid");
  grid.innerHTML = "";

  // Revisão espaçada: só aparece quando há pelo menos 1 atividade já
  // dominada vencida pra revisão (ver js/revisao-espacada.js). Fica em
  // destaque, antes do card do ano letivo, pra não competir por atenção
  // com os módulos normais nem exigir a criança lembrar de procurar.
  const due = dueReviewActivities();
  if(due.length > 0){
    const revCard = document.createElement("div");
    revCard.className = "game-card";
    revCard.style.border = "2px solid var(--orange)";
    revCard.innerHTML = `<span class="tag">${due.length} atividade${due.length===1?"":"s"}</span>
      <div class="icon">🔁</div>
      <h4>Revisão de Hoje</h4>
      <p>Já dominou isso antes — vamos relembrar rapidinho pra não esquecer!</p>`;
    revCard.onclick = ()=> { state.navBack = "anoletivo"; startRevisao(); };
    grid.appendChild(revCard);
  }

  const allMods = ALL_MODULES_BENJAMIN.filter(m=>m.built);
  const doneMods = allMods.filter(m=>{
    const c = containerById(m.id);
    return c ? (c.fullyMastered() && !!provaPassed[m.id]) : (masteryPercent(m.id) >= (m.unlockAt || 80));
  });

  const card = document.createElement("div");
  card.className = "game-card";
  card.innerHTML = `<span class="tag">${doneMods.length}/${allMods.length} módulos</span>
    <div class="icon">🏫</div>
    <h4>1º Ano Fundamental — 2026</h4>
    <p>Trilhas de Português e Matemática, um ano à frente da matrícula (adiantado, mesmo ritmo de sempre)</p>`;
  card.onclick = ()=> openMaterias();
  grid.appendChild(card);
}

function openMaterias(){
  renderMaterias();
  showScreen("screen-materias");
}
function backToAnoLetivo(){
  renderAnoLetivo();
  showScreen("screen-menu");
}

function renderMaterias(){
  document.getElementById("materias-title").textContent = "🏫 1º Ano Fundamental — Matérias";
  document.getElementById("materias-subtitle").textContent = "Escolha uma trilha pra ver os módulos.";

  const grid = document.getElementById("materias-grid");
  grid.innerHTML = "";

  function trilhaProgress(mods){
    let done = 0, total = 0;
    mods.forEach(mod=>{
      const c = containerById(mod.id);
      if(!c) return;
      total += c.activities.length;
      done += c.activities.filter(a=>activityLevel[a.id]===5 && masteryPercent(a.id+":5")>=80).length;
    });
    return {done, total};
  }

  const pt = trilhaProgress(PT_MODULES_BENJAMIN);
  const ptCard = document.createElement("div");
  ptCard.className = "game-card";
  ptCard.innerHTML = `<span class="tag">${pt.done}/${pt.total} atividades</span><div class="icon">📘</div><h4>Português</h4><p>Sílabas, leitura, escrita, compreensão, narrativas e gramática — ${PT_MODULES_BENJAMIN.length} módulos</p>`;
  ptCard.onclick = ()=> openModulos("portugues");
  grid.appendChild(ptCard);

  const mt = trilhaProgress(MATH_MODULES_BENJAMIN);
  const mtCard = document.createElement("div");
  mtCard.className = "game-card";
  mtCard.innerHTML = `<span class="tag">${mt.done}/${mt.total} atividades</span><div class="icon">🔢</div><h4>Matemática</h4><p>Números, geometria, medidas, dinheiro e mais — ${MATH_MODULES_BENJAMIN.length} módulos</p>`;
  mtCard.onclick = ()=> openModulos("matematica");
  grid.appendChild(mtCard);

  FUTURE_BENJAMIN.forEach(g=>{
    const card = document.createElement("div");
    card.className = "game-card locked";
    card.innerHTML = `<span class="tag">${g.tag}</span><div class="icon">${g.icon}</div><h4>${g.name}</h4><p>${g.desc}</p>`;
    grid.appendChild(card);
  });
}

function openModulos(trilha){
  state.currentTrilha = trilha;
  renderModulos();
  showScreen("screen-modulos");
}
function backToMaterias(){
  renderMaterias();
  showScreen("screen-materias");
}

function renderModulos(){
  const trilha = state.currentTrilha;
  const mods = trilha === "portugues" ? PT_MODULES_BENJAMIN : MATH_MODULES_BENJAMIN;
  const label = trilha === "portugues" ? "📘 Português" : "🔢 Matemática";
  document.getElementById("modulos-title").textContent = `${label} — Módulos`;
  document.getElementById("modulos-subtitle").textContent = "Escolha um módulo pra praticar. Cada bimestre agrupa os módulos daquele período do ano.";

  const grid = document.getElementById("modulos-grid");
  grid.innerHTML = "";

  let lastBimestre = null;
  mods.forEach(mod=>{
    if(mod.bimestre !== lastBimestre){
      renderSectionTitle(grid, mod.bimestre);
      lastBimestre = mod.bimestre;
    }
    const unlocked = isModuleUnlocked(mod);
    const container = containerById(mod.id);
    const card = document.createElement("div");

    if(container){
      const doneCount = container.activities.filter(a=>activityLevel[a.id]===5 && masteryPercent(a.id+":5")>=80).length;
      const allDone = doneCount === container.activities.length;
      const passed = provaPassed[mod.id];
      card.className = "game-card" + (unlocked ? "" : " locked");
      let tag, extraHtml = "";
      if(!unlocked){
        tag = "🔒 Bloqueado";
        const reqMod = ALL_MODULES_BENJAMIN.find(m=>m.id === mod.requires);
        const reqContainerForMsg = containerById(mod.requires);
        const reqLabel = reqContainerForMsg ? `as ${reqContainerForMsg.activities.length} atividades do ${reqMod.name}` : `o ${reqMod ? reqMod.name : "módulo anterior"}`;
        const provaHint = reqContainerForMsg ? " e passe no 🏁 Desafio Final dele" : "";
        extraHtml = `<p style="margin-top:6px; color:#b8452e; font-weight:700; font-size:12px;">Complete ${reqLabel} (nível 5)${provaHint} para desbloquear</p>`;
      }else if(allDone && passed){
        tag = "🏅 Aprovado";
      }else if(allDone){
        tag = "🏁 Falta o Desafio Final";
      }else{
        tag = `${doneCount}/${container.activities.length} atividades`;
      }
      card.innerHTML = `<span class="tag">${tag}</span><div class="icon">${mod.icon}</div><h4>${mod.name}</h4><p>${mod.desc}</p>${extraHtml}`;
      if(unlocked) card.onclick = ()=> openAtividades(mod.id);
    }else if(!mod.built){
      card.className = "game-card locked";
      card.innerHTML = `<span class="tag">🔮 Em construção</span><div class="icon">${mod.icon}</div><h4>${mod.name}</h4><p>${mod.desc}</p>
        <p style="margin-top:6px; color:#8480a3; font-weight:700; font-size:12px;">Próximo módulo a ser criado nesta trilha</p>`;
    }else{
      // módulo avulso sem container (não há nenhum hoje nas trilhas de PT/Mat, mas
      // mantém o fluxo genérico caso um módulo simples de atividade única volte a existir)
      const playable = mod.built && unlocked;
      const pct = masteryPercent(mod.id);
      card.className = "game-card" + (playable ? "" : " locked");
      card.innerHTML = `<span class="tag">${unlocked ? pct + "% domínio" : "🔒 Bloqueado"}</span><div class="icon">${mod.icon}</div><h4>${mod.name}</h4><p>${mod.desc}</p>`;
      if(playable) card.onclick = ()=> { state.navBack = "modulos"; startGame(mod.id); };
    }
    grid.appendChild(card);
  });

  if(trilha === "matematica"){
    renderSectionTitle(grid, "🎮 Jogos extras (sem nível, prática livre)");
    MATH_GAMES_BENJAMIN.forEach(g=>{
      const pct = masteryPercent(g.id);
      const card = document.createElement("div");
      card.className = "game-card";
      card.innerHTML = `<span class="tag">${mastery[g.id] ? pct + "% domínio" : g.tag}</span><div class="icon">${g.icon}</div><h4>${g.name}</h4><p>${g.desc}</p>`;
      card.onclick = ()=> { state.navBack = "modulos"; startGame(g.id); };
      grid.appendChild(card);
    });
  }
}

function openAtividades(moduleId){
  state.currentModuloId = moduleId;
  renderAtividades();
  showScreen("screen-atividades");
}
function backToModulos(){
  renderModulos();
  showScreen("screen-modulos");
}

function renderAtividades(){
  const mod = ALL_MODULES_BENJAMIN.find(m=>m.id === state.currentModuloId);
  const container = containerById(mod.id);
  document.getElementById("atividades-title").textContent = `${mod.icon} ${mod.name}`;
  document.getElementById("atividades-subtitle").textContent = mod.desc;

  const grid = document.getElementById("atividades-grid");
  grid.innerHTML = "";

  container.activities.forEach(act=>{
    const lvl = activityLevel[act.id];
    const pct = masteryPercent(act.id + ":" + lvl);
    const complete = (lvl === 5 && pct >= 80);
    const card = document.createElement("div");
    card.className = "game-card";
    const tag = complete ? "🏆 Completo" : `Nível ${lvl}/5`;
    const lessonNote = LESSONS[act.id] ? `<p style="margin-top:4px; color:var(--purple-dark); font-weight:800; font-size:12px;">🎓 Tem aulinha antes de praticar</p>` : "";
    card.innerHTML = `<span class="tag">${tag}</span><div class="icon">${act.icon}</div><h4>${act.name}</h4><p>${act.desc}</p>
      <p style="margin-top:6px; color:#8480a3; font-size:12px;">Domínio no nível atual: ${pct}%</p>${lessonNote}`;
    card.onclick = ()=> { state.navBack = "atividades"; maybeShowLesson(act.id); };
    grid.appendChild(card);
  });

  // Card do Desafio Final (prova) — só aparece depois que todas as
  // atividades do módulo estão em nível 5 com 80%+ de domínio.
  if(container.fullyMastered()){
    const passed = provaPassed[mod.id];
    const score = provaScores[mod.id];
    const card = document.createElement("div");
    card.className = "game-card";
    card.style.border = "2px solid " + (passed ? "#22c55e" : "var(--purple)");
    const tag = passed ? `🏅 Aprovado (${score.overallPct}%)` : (score ? `⚠️ ${score.overallPct}% — tenta de novo` : "🎯 Disponível");
    card.innerHTML = `<span class="tag">${tag}</span><div class="icon">🏁</div><h4>Desafio Final — ${mod.name}</h4><p>Mistura tudo que você aprendeu neste módulo pra destravar o próximo!</p>`;
    card.onclick = ()=> { state.navBack = "atividades"; startProva(mod.id); };
    grid.appendChild(card);
  }
}

function renderSectionTitle(grid, text){
  const title = document.createElement("div");
  title.style.cssText = "grid-column:1/-1; font-weight:800; color:#5b5780; margin:14px 0 -4px 0; font-size:15px;";
  title.textContent = text;
  grid.appendChild(title);
}

function openPanel(){
  renderPanel();
  showScreen("screen-panel");
}
function backFromPanel(){
  // O painel só é acessível pro Benjamin (pais), a partir da tela de Ano
  // Letivo — "Voltar" sempre retorna pra lá, independente de onde a criança
  // estava navegando na árvore antes de um adulto abrir o painel.
  if(state.child === "benjamin"){
    renderAnoLetivo();
    showScreen("screen-menu");
  }else{
    renderMenu();
    showScreen("screen-menu");
  }
}

function renderPanel(){
  const list = document.getElementById("panel-list");
  list.innerHTML = "";
  ALL_MODULES_BENJAMIN.forEach(mod=>{
    const unlocked = isModuleUnlocked(mod);
    const playable = mod.built && unlocked;
    let statusClass, statusText;
    // Bug real corrigido aqui: essa checagem "isContainer" usava sempre
    // MODULE1_ACTIVITIES hardcoded, então o card do Módulo 2/3 no painel
    // "meus módulos" mostraria o progresso ERRADO (do Módulo 1) — desde que
    // "leitura" virou isContainer:true, esse painel (diferente do de
    // auditoria) nunca tinha sido testado com um 2º módulo container.
    const containerInfo = containerById(mod.id);
    if(containerInfo){
      const doneCount = containerInfo.activities.filter(a=>activityLevel[a.id]===5 && masteryPercent(a.id+":5")>=80).length;
      const allDone = doneCount === containerInfo.activities.length;
      const passed = provaPassed[mod.id];
      if(allDone && passed){ statusClass="playable"; statusText = `${doneCount}/${doneCount} atividades + 🏁 aprovado`; }
      else if(allDone){ statusClass="building"; statusText = `${doneCount}/${doneCount} atividades — falta o 🏁 Desafio Final`; }
      else{ statusClass="building"; statusText = `${doneCount} de ${containerInfo.activities.length} atividades completas`; }
    }else if(!mod.built){ statusClass="building"; statusText="Em construção"; }
    else if(playable){ statusClass="playable"; statusText = masteryPercent(mod.id) + "% domínio"; }
    else { statusClass="locked"; statusText="Bloqueado"; }

    const atividadesHtml = containerInfo
      ? `<h5>Atividades (5 níveis cada)</h5><ul>${containerInfo.activities.map(a=>{
          const lvl = activityLevel[a.id];
          const pct = masteryPercent(a.id+":"+lvl);
          return `<li>${a.icon} ${a.name} — Nível ${lvl}/5 (${pct}% de domínio no nível atual)</li>`;
        }).join("")}</ul>`
      : "";

    const provaHtml = containerInfo
      ? `<h5>🏁 Desafio Final</h5><p style="margin:0 0 8px 0;">${
          provaPassed[mod.id] ? `✅ Aprovado (${provaScores[mod.id].overallPct}%)`
          : provaScores[mod.id] ? `⚠️ Tentado — ${provaScores[mod.id].overallPct}% (precisa de ${PROVA_PASS_OVERALL}%+ no total e ${PROVA_PASS_PER_ACTIVITY}%+ em cada atividade)`
          : "Ainda não tentou (disponível quando todas as atividades estiverem no nível 5 com 80%+)"
        }</p>`
      : "";

    const habilidadesHtml = mod.habilidades.length
      ? `<h5>Habilidades BNCC cobertas</h5><ul>${mod.habilidades.map(h=>`<li>${h}</li>`).join("")}</ul>`
      : "";
    const alemHtml = mod.alem.length
      ? `<h5>Além da BNCC (indo mais longe)</h5><ul>${mod.alem.map(h=>`<li>${h}</li>`).join("")}</ul>`
      : "";
    const jogosHtml = mod.jogos && mod.jogos.length
      ? `<div class="panel-games">🎮 Jogos: ${mod.jogos.join(", ")}</div>`
      : "";

    const card = document.createElement("div");
    card.className = "panel-card";
    card.innerHTML = `
      <div class="panel-head">
        <div class="panel-icon">${mod.icon}</div>
        <div>
          <h3>${mod.name}</h3>
          <div class="panel-bimestre">${mod.bimestre}</div>
        </div>
        <span class="panel-status ${statusClass}">${statusText}</span>
      </div>
      <div>${mod.desc}</div>
      ${atividadesHtml}
      ${provaHtml}
      ${habilidadesHtml}
      ${alemHtml}
      ${jogosHtml}
    `;
    list.appendChild(card);
  });
}

/* ============ PAINEL DE AUDITORIA (adulto) ============ */
/* Acesso direto a qualquer atividade/nível, sem passar pelo fluxo de
   desbloqueio da criança — pra inspecionar conteúdo, testar e auditar. */
