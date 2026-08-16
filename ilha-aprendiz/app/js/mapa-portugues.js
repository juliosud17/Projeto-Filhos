// Ilha das Letras -- mapa interativo de Português (substitui a grade de
// Módulos só pra essa trilha; Matemática continua em renderModulos()
// inalterado). Reaproveita moduleStatus() (js/mastery.js) e openAtividades()
// (js/navigation.js) -- nenhuma lógica de domínio/desbloqueio duplicada
// aqui, só uma apresentação visual diferente do mesmo estado.

function openMapaPortugues(){
  // Mesmo papel que openModulos("portugues") tinha antes -- backToModulos()
  // usa isso pra saber que "← Voltar" de dentro de Atividades deve
  // retornar pro mapa, não pra grade de Módulos (que Português não usa
  // mais). Ver js/navigation.js, backToModulos().
  state.currentTrilha = "portugues";
  // Carrega o asset só na primeira vez que a tela é aberta -- quem nunca
  // visita a Ilha das Letras (ex.: sessão só de Matemática) nunca baixa
  // esse peso extra. Ver docs do plano da Ilha das Letras, seção I.
  const bg = document.getElementById("mapa-portugues-bg");
  if(bg && !bg.getAttribute("src")){
    bg.src = "assets/maps/ilha-das-letras.webp";
  }
  renderMapaPortugues();
  showScreen("screen-mapa-portugues");
}

/* Estado independente de domínio/desbloqueio, pra destacar visualmente o
   destino da futura "Aventura de Hoje" (ver docs do plano da Ilha das
   Letras) -- hoje sempre false, propositalmente não implementado ainda.
   Isolado numa função própria pra já existir o ponto de extensão sem
   mexer no resto do render quando isso for construído de verdade. */
function regionIsRecommendedToday(moduleId){
  return false;
}

function renderMapaPortugues(){
  const container = document.getElementById("mapa-portugues-regioes");
  container.innerHTML = "";

  PT_MAPA_REGIOES.forEach(regiao=>{
    const mod = PT_MODULES_BENJAMIN.find(m=>m.id === regiao.moduleId);
    if(!mod) return;
    const status = moduleStatus(mod);

    const btn = document.createElement("button");
    btn.className = "map-hotspot map-hotspot--" + status.state.toLowerCase();
    if(regionIsRecommendedToday(regiao.moduleId)) btn.classList.add("map-hotspot--recommended");
    btn.style.setProperty("--x", regiao.left + "%");
    btn.style.setProperty("--y", regiao.top + "%");
    btn.setAttribute("aria-label", regiao.nome + " — " + mapaEstadoLabel(status.state));
    btn.dataset.module = regiao.moduleId;

    const badge = mapaBadgeHtml(status);
    btn.innerHTML = `<span class="map-hotspot__icon">${regiao.icone}</span>
      <span class="map-hotspot__nome">${regiao.nome}</span>
      ${badge}`;

    // Módulo 8 (Castelo dos Livros) não é um jogo -- abre a tela do
    // Projeto Leitor, não a grade de atividades. Ver js/projeto-leitor.js.
    if(status.unlocked){
      if(regiao.moduleId === "projetoleitor"){
        btn.onclick = ()=> openProjetoLeitor();
      }else{
        btn.onclick = ()=> { state.navBack = "mapa-portugues"; openAtividades(mod.id); };
      }
    }
    // bloqueado: sem onclick, mesmo comportamento de hoje pros cartões bloqueados.

    container.appendChild(btn);
  });
}

function mapaEstadoLabel(state){
  switch(state){
    case "LOCKED": return "bloqueado";
    case "AVAILABLE": return "disponível";
    case "LEARNING": return "em progresso";
    case "MASTERED": return "dominado, falta o Desafio Final";
    case "DESAFIO_APROVADO": return "Desafio Final aprovado";
    default: return "";
  }
}

function mapaBadgeHtml(status){
  switch(status.state){
    case "LOCKED": return `<span class="map-hotspot__badge">🔒</span>`;
    case "AVAILABLE": return `<span class="map-hotspot__badge">✨</span>`;
    case "LEARNING": return `<span class="map-hotspot__badge">${status.doneCount}/${status.total}</span>`;
    case "MASTERED": return `<span class="map-hotspot__badge">🏁</span>`;
    case "DESAFIO_APROVADO": return `<span class="map-hotspot__badge">🏅</span>`;
    default: return "";
  }
}

/* Modo de calibração (dev-only): abrir o app com ?calibrar=1 na URL e
   clicar em qualquer ponto do mapa imprime a coordenada %,% no console --
   pra ajustar PT_MAPA_REGIOES contra o asset final rapidinho, sem precisar
   medir pixel manualmente. Não afeta o uso normal (fica inativo sem o
   parâmetro). */
function mapaCalibracaoAtiva(){
  try { return new URLSearchParams(window.location.search).get("calibrar") === "1"; }
  catch(e){ return false; }
}
function calibrarCoordenadas(evt){
  if(!mapaCalibracaoAtiva()) return;
  const rect = evt.currentTarget.getBoundingClientRect();
  const x = ((evt.clientX - rect.left) / rect.width * 100).toFixed(1);
  const y = ((evt.clientY - rect.top) / rect.height * 100).toFixed(1);
  console.log("Ilha das Letras — coordenada clicada: left:" + x + "%, top:" + y + "%");
}
