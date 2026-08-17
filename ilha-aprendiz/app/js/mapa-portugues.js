// Ilha das Letras -- mapa interativo de Português (substitui a grade de
// Módulos só pra essa trilha; Matemática continua em renderModulos()
// inalterado). Reaproveita moduleStatus() (js/mastery.js) e openAtividades()
// (js/navigation.js) -- nenhuma lógica de domínio/desbloqueio duplicada
// aqui, só uma apresentação visual diferente do mesmo estado.
//
// Rodada 2 de UX (2026-08-17, ver docs/DECISOES.md): marcadores compactos
// (ícone + anel de progresso) em vez de cards grandes com nome/badge
// sempre visíveis; nome/status/progresso detalhado moraram pro popover
// sob demanda (.map-popover), que também é quem navega de fato (clicar
// no marcador só abre/fecha o popover agora).
//
// Ponto de extensão preparado, não implementado: um overlay de "posição da
// Lia" (map-guide) ou de transformação visual do mundo (árvore crescendo
// etc.) usaria exatamente o mesmo sistema de coordenadas --x/--y já em uso
// aqui, como mais um filho de .map-region/.mundo-map -- não precisa de
// nenhuma mudança estrutural além de adicionar o elemento quando o asset
// da Lia existir.

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

/* "Próximo destino": primeira região, na ordem pedagógica de
   PT_MAPA_REGIOES (que já segue a cadeia de pré-requisitos), que está
   desbloqueada e ainda não foi totalmente concluída (Desafio Final
   aprovado). null quando a ilha inteira já foi conquistada. Só leitura do
   estado que moduleStatus() já calcula -- nenhuma regra nova de
   domínio/desbloqueio, é puramente uma leitura visual pra destacar onde a
   criança deveria ir a seguir (ponto de extensão pra futura "Aventura de
   Hoje"). */
function computeDestinoAtual(){
  for(const regiao of PT_MAPA_REGIOES){
    const mod = PT_MODULES_BENJAMIN.find(m=>m.id === regiao.moduleId);
    if(!mod) continue;
    const status = moduleStatus(mod);
    if(status.unlocked && !(status.allDone && status.passed)) return regiao.moduleId;
  }
  return null;
}

function regionIsRecommendedToday(moduleId){
  return moduleId === computeDestinoAtual();
}

function renderMapaPortugues(){
  const container = document.getElementById("mapa-portugues-regioes");
  container.innerHTML = "";
  const destinoAtualId = computeDestinoAtual();

  const subtitleEl = document.getElementById("mapa-portugues-subtitle");
  if(subtitleEl){
    if(destinoAtualId){
      const destino = PT_MAPA_REGIOES.find(r=>r.moduleId === destinoAtualId);
      subtitleEl.textContent = "Próximo destino: " + destino.nome;
    }else{
      subtitleEl.textContent = "Você já explorou a ilha inteira! 🎉";
    }
  }

  PT_MAPA_REGIOES.forEach(regiao=>{
    const mod = PT_MODULES_BENJAMIN.find(m=>m.id === regiao.moduleId);
    if(!mod) return;
    const status = moduleStatus(mod);
    const isRecommended = regiao.moduleId === destinoAtualId;

    const wrap = document.createElement("div");
    wrap.className = "map-region";
    wrap.style.setProperty("--x", regiao.left + "%");
    wrap.style.setProperty("--y", regiao.top + "%");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "map-hotspot map-hotspot--" + status.state.toLowerCase();
    if(isRecommended) btn.classList.add("map-hotspot--recommended");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", regiao.nome + " — " + mapaEstadoLabel(status.state));
    btn.dataset.module = regiao.moduleId;
    btn.innerHTML = `<span class="map-hotspot__ring" style="--pct:${mapaProgressoPct(status)}">
        <span class="map-hotspot__pin">${regiao.icone}</span>
      </span>
      ${mapaSeloHtml(status)}`;
    btn.onclick = (evt)=>{ evt.stopPropagation(); toggleMapaPopover(wrap, btn); };

    const popover = document.createElement("div");
    popover.className = "map-popover";
    popover.innerHTML = mapaPopoverHtml(regiao, status, mod);
    const cta = popover.querySelector(".map-popover__cta");
    if(cta){
      // Módulo 8 (Castelo dos Livros) não é um jogo -- abre a tela do
      // Projeto Leitor, não a grade de atividades. Ver js/projeto-leitor.js.
      cta.onclick = (evt)=>{
        evt.stopPropagation();
        if(regiao.moduleId === "projetoleitor"){
          openProjetoLeitor();
        }else{
          state.navBack = "mapa-portugues";
          openAtividades(mod.id);
        }
      };
    }

    wrap.appendChild(btn);
    wrap.appendChild(popover);
    container.appendChild(wrap);
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

/* % de preenchimento do anel de progresso do marcador -- mesma leitura de
   doneCount/total que o badge "X/Y" fazia antes, só que virou um indicador
   visual discreto em vez de número solto no mapa (pedido do Júlio). */
function mapaProgressoPct(status){
  if(status.state === "MASTERED" || status.state === "DESAFIO_APROVADO") return 100;
  if(status.state === "LEARNING" && status.total > 0) return Math.round(status.doneCount / status.total * 100);
  return 0;
}

/* Selo no canto do marcador -- só nos estados "extremos" (bloqueado,
   dominado, aprovado); AVAILABLE/LEARNING já são comunicados pela cor e
   preenchimento do anel, não precisam de selo extra. */
function mapaSeloHtml(status){
  switch(status.state){
    case "LOCKED": return `<span class="map-hotspot__seal" aria-hidden="true">🔒</span>`;
    case "MASTERED": return `<span class="map-hotspot__seal" aria-hidden="true">✓</span>`;
    case "DESAFIO_APROVADO": return `<span class="map-hotspot__seal" aria-hidden="true">⭐</span>`;
    default: return "";
  }
}

function mapaCtaLabel(state){
  switch(state){
    case "AVAILABLE": return "Começar aventura";
    case "LEARNING": return "Continuar aventura";
    case "MASTERED": return "Fazer o Desafio Final";
    case "DESAFIO_APROVADO": return "Explorar de novo";
    default: return "Continuar aventura";
  }
}

/* Conteúdo do popover sob demanda -- nome + status por extenso + detalhe
   (progresso ou motivo do bloqueio) + botão que navega de fato. Região
   bloqueada não ganha botão (sem CTA), só a explicação. */
function mapaPopoverHtml(regiao, status, mod){
  const titulo = `<p class="map-popover__title">${regiao.icone} ${regiao.nome}</p>`;

  if(status.state === "LOCKED"){
    return titulo + `
      <p class="map-popover__status">🔒 Ainda não chegamos aqui.</p>
      <p class="map-popover__detail">Complete a aventura anterior para continuar.</p>`;
  }

  if(mod.id === "projetoleitor"){
    return titulo + `
      <p class="map-popover__status">Disponível</p>
      <p class="map-popover__detail">Escolha um livro para ler em família.</p>
      <button type="button" class="map-popover__cta">Abrir o castelo</button>`;
  }

  let statusLinha = "", detalheLinha = "";
  switch(status.state){
    case "AVAILABLE":
      statusLinha = "Disponível";
      break;
    case "LEARNING":
      statusLinha = "Em progresso";
      detalheLinha = `<p class="map-popover__detail">${status.doneCount} de ${status.total} desafios concluídos</p>`;
      break;
    case "MASTERED":
      statusLinha = "Todos os desafios concluídos!";
      detalheLinha = `<p class="map-popover__detail">Falta o Desafio Final</p>`;
      break;
    case "DESAFIO_APROVADO":
      statusLinha = "Desafio Final aprovado 🏅";
      break;
  }

  return titulo + `<p class="map-popover__status">${statusLinha}</p>` + detalheLinha +
    `<button type="button" class="map-popover__cta">${mapaCtaLabel(status.state)}</button>`;
}

/* Abrir/fechar popover ao clicar/tocar o marcador (cobre mobile, onde não
   existe hover). Hover e foco por teclado já são resolvidos em CSS puro
   (:hover/:focus-within em .map-region), sem precisar de JS. Só uma
   região fica aberta por vez. */
function toggleMapaPopover(wrap, btn){
  const vaiAbrir = !wrap.classList.contains("is-open");
  fecharTodosPopoversMapa();
  if(vaiAbrir){
    wrap.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
  }
}
function fecharTodosPopoversMapa(){
  document.querySelectorAll(".map-region.is-open").forEach(regiaoEl=>{
    regiaoEl.classList.remove("is-open");
    const b = regiaoEl.querySelector(".map-hotspot");
    if(b) b.setAttribute("aria-expanded", "false");
  });
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
