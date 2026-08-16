// Painel de admin (pular nivel/atividade, reset).
function openAdmin(){
  renderAdmin();
  showScreen("screen-admin");
}

function adminSection(list, title){
  const h = document.createElement("div");
  h.style.cssText = "font-weight:800; color:#5b5780; margin:20px 0 6px 0; font-size:15px;";
  h.textContent = title;
  list.appendChild(h);
}

function adminLeveledCard(list, child, id, name, icon){
  const card = document.createElement("div");
  card.className = "panel-card";
  let rows = "";
  for(let lvl=1; lvl<=5; lvl++){
    const key = id + ":" + lvl;
    const hasData = !!mastery[key];
    const pct = masteryPercent(key);
    const isCurrent = activityLevel[id] === lvl;
    rows += `<div style="display:flex; align-items:center; gap:10px; padding:5px 0; border-top:1px solid #f0edff;">
      <span style="min-width:70px; ${isCurrent ? "font-weight:800; color:var(--purple-dark);" : ""}">Nível ${lvl}${isCurrent ? " (atual)" : ""}</span>
      <span style="color:#8480a3; font-size:12px; flex:1;">${hasData ? pct + "% domínio (" + mastery[key].length + " registros)" : "sem dados ainda"}</span>
      <button class="menu-btn" style="padding:5px 12px; font-size:12px;" onclick="adminPlay('${child}','${id}',${lvl})">▶️ Inspecionar</button>
    </div>`;
  }
  card.innerHTML = `<div class="panel-head">
      <div class="panel-icon">${icon}</div>
      <div><h3>${name}</h3><div class="panel-bimestre">nível atual: ${activityLevel[id]}/5</div></div>
      <button class="menu-btn" style="font-size:12px; margin-left:auto;" onclick="adminReset('${id}')">🔄 Resetar</button>
    </div>${rows}`;
  list.appendChild(card);
}

function adminSimpleCard(list, child, id, name, icon){
  const card = document.createElement("div");
  card.className = "panel-card";
  const hasData = !!mastery[id];
  const pct = masteryPercent(id);
  card.innerHTML = `<div class="panel-head">
      <div class="panel-icon">${icon}</div>
      <div><h3>${name}</h3><div class="panel-bimestre">${hasData ? pct + "% domínio" : "sem dados ainda"}</div></div>
      <button class="menu-btn" style="font-size:12px; margin-left:auto;" onclick="adminPlay('${child}','${id}')">▶️ Inspecionar</button>
      <button class="menu-btn" style="font-size:12px;" onclick="adminReset('${id}')">🔄 Resetar</button>
    </div>`;
  list.appendChild(card);
}

function adminProvaCard(list, containerId, mod){
  const passed = provaPassed[containerId];
  const score = provaScores[containerId];
  const card = document.createElement("div");
  card.className = "panel-card";
  const statusText = passed ? `✅ Aprovado (${score.overallPct}%)` : (score ? `⚠️ Não aprovado ainda (${score.overallPct}%)` : "— ainda não tentou");
  const breakdown = score
    ? `<div style="font-size:12px; color:#8480a3; margin-top:6px;">${score.perActivity.map(p=>`${p.act.icon} ${p.act.name}: ${p.correct}/${p.total} (${p.pct}%)`).join(" · ")}</div>`
    : "";
  card.innerHTML = `<div class="panel-head">
      <div class="panel-icon">🏁</div>
      <div><h3>Desafio Final — ${mod.name}</h3><div class="panel-bimestre">${statusText}</div></div>
      <button class="menu-btn" style="font-size:12px; margin-left:auto;" onclick="adminPlayProva('${containerId}')">▶️ Inspecionar</button>
      <button class="menu-btn" style="font-size:12px;" onclick="adminResetProva('${containerId}')">🔄 Resetar</button>
    </div>${breakdown}`;
  list.appendChild(card);
}

function adminNotBuiltCard(list, mod){
  const card = document.createElement("div");
  card.className = "panel-card";
  card.style.opacity = ".65";
  card.innerHTML = `<div class="panel-head">
      <div class="panel-icon">${mod.icon}</div>
      <div><h3>${mod.name}</h3><div class="panel-bimestre">${mod.bimestre}</div></div>
      <span class="panel-status building">🔮 ainda não implementado</span>
    </div><div style="font-size:13px; color:#8480a3;">Jogos previstos: ${(mod.jogos || []).join(", ") || "—"}</div>`;
  list.appendChild(card);
}

function renderAdmin(){
  const list = document.getElementById("admin-list");
  list.innerHTML = "";

  MODULE_CONTAINERS.forEach(c=>{
    const mod = ALL_MODULES_BENJAMIN.find(m=>m.id === c.containerId);
    const trilhaIcon = MATH_MODULES_BENJAMIN.some(m=>m.id===mod.id) ? "🔢" : "📘";
    adminSection(list, `${trilhaIcon} Benjamin · ${mod.name} (${c.activities.length} atividades com nível)`);
    c.activities.forEach(a => adminLeveledCard(list, "benjamin", a.id, a.name, a.icon));
    adminProvaCard(list, c.containerId, mod);
  });

  adminSection(list, "📘 Benjamin · Português — Módulos seguintes");
  PT_MODULES_BENJAMIN.filter(m => !m.isContainer).forEach(m=>{
    if(!m.built){ adminNotBuiltCard(list, m); }
    else if(activityLevel.hasOwnProperty(m.id)){ adminLeveledCard(list, "benjamin", m.id, m.name, m.icon); }
    else{ adminSimpleCard(list, "benjamin", m.id, m.name, m.icon); }
  });

  adminSection(list, "🔢 Benjamin · Matemática — Módulos seguintes");
  MATH_MODULES_BENJAMIN.filter(m => !m.isContainer).forEach(m=>{
    if(!m.built){ adminNotBuiltCard(list, m); }
    else if(activityLevel.hasOwnProperty(m.id)){ adminLeveledCard(list, "benjamin", m.id, m.name, m.icon); }
    else{ adminSimpleCard(list, "benjamin", m.id, m.name, m.icon); }
  });

  adminSection(list, "🔢 Benjamin · Matemática — jogos extras (sem nível)");
  MATH_GAMES_BENJAMIN.forEach(g => adminSimpleCard(list, "benjamin", g.id, g.name, g.icon));

  adminSection(list, "🦉 Joaquim");
  GAMES.joaquim.forEach(g=>{
    if(g.locked){
      const card = document.createElement("div");
      card.className = "panel-card";
      card.style.opacity = ".65";
      card.innerHTML = `<div class="panel-head"><div class="panel-icon">${g.icon}</div><div><h3>${g.name}</h3></div><span class="panel-status building">🔮 em breve</span></div>`;
      list.appendChild(card);
    }else{
      adminSimpleCard(list, "joaquim", g.id, g.name, g.icon);
    }
  });

  const resetAllBtn = document.createElement("button");
  resetAllBtn.className = "primary-btn";
  resetAllBtn.style.cssText = "background:var(--red); margin-top:18px;";
  resetAllBtn.textContent = "⚠️ Resetar TUDO — todos os níveis, domínio e estrelas";
  resetAllBtn.onclick = adminResetAll;
  list.appendChild(resetAllBtn);
}

/* Abre o jogo direto no nível pedido, sem checar módulo desbloqueado nem
   % de domínio — é justamente pra poder inspecionar sem "jogar até destravar". */
function adminPlay(child, gameId, level){
  state.child = child;
  state.fromAdmin = true;
  if(level && activityLevel.hasOwnProperty(gameId)) activityLevel[gameId] = level;
  startGame(gameId);
}

function adminReset(gameId){
  if(activityLevel.hasOwnProperty(gameId)) activityLevel[gameId] = 1;
  Object.keys(mastery).forEach(k=>{ if(k === gameId || k.startsWith(gameId + ":")) delete mastery[k]; });
  renderAdmin();
}

function adminPlayProva(containerId){
  state.child = "benjamin";
  state.fromAdmin = true;
  startProva(containerId);
}

function adminResetProva(containerId){
  delete provaPassed[containerId];
  delete provaScores[containerId];
  renderAdmin();
}

function adminResetAll(){
  Object.keys(activityLevel).forEach(k=> activityLevel[k] = 1);
  Object.keys(mastery).forEach(k=> delete mastery[k]);
  Object.keys(provaPassed).forEach(k=> delete provaPassed[k]);
  Object.keys(provaScores).forEach(k=> delete provaScores[k]);
  state.totalStars.joaquim = 0;
  state.totalStars.benjamin = 0;
  updateGlobalStars();
  renderAdmin();
}

function backToMenu(){
  speakStop();
  if(state.fromAdmin){
    state.fromAdmin = false;
    openAdmin();
    return;
  }
  // Benjamin navega numa árvore (Ano Letivo > Matéria > Módulo > Atividades)
  // — "Voltar"/"Ver outros jogos" depois de uma sessão retorna pra onde ele
  // veio (`state.navBack`, setado em cada card que chama startGame/startProva),
  // não sempre lá pro topo da árvore. Joaquim continua na lista simples.
  if(state.child === "benjamin"){
    if(state.navBack === "modulos"){
      renderModulos();
      showScreen("screen-modulos");
    }else{
      renderAtividades();
      showScreen("screen-atividades");
    }
    return;
  }
  renderMenu();
  showScreen("screen-menu");
}

/* ============ UTILITÁRIOS ============ */
