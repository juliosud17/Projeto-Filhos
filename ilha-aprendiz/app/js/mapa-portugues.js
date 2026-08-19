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
// aqui, como mais um filho de .map-region/.mundo-map__canvas -- não precisa
// de nenhuma mudança estrutural além de adicionar o elemento quando o asset
// da Lia existir.
//
// Rodada 3 (2026-08-17, ver docs/DECISOES.md): halo mais evidente pro
// destino atual + selo "✨" estático; popover não abre mais só com hover
// (só clique/toque/foco -- ver CSS); cabeçalho contextual conforme o
// progresso (mensagemDestinoAtual); mapa vira "arrastável" (scroll nativo,
// sem lib) abaixo de 600px de largura, porque o cálculo de distância real
// entre marcadores mostrou sobreposição de verdade em 360-430px (não só
// suposição -- ver a tabela em docs/DECISOES.md).
//
// Ponto de extensão preparado, não implementado (item 3 do pedido do
// Júlio): "abrir o popover automaticamente uma vez, na primeira visita".
// toggleMapaPopover()/fecharTodosPopoversMapa() já são reutilizáveis pra
// isso -- bastaria, com um flag futuro (state/localStorage) indicando que
// é a 1ª visita, chamar algo como
// `document.querySelector('[data-module="'+destinoAtualId+'"]').closest(".map-region").classList.add("is-open")`
// logo depois do render. Não implementado agora porque não existe esse
// flag ainda (nem é objetivo desta rodada).
//
// Ponto avaliado, adiado de propósito (item 5 do pedido do Júlio): a arte
// tem, sim, marcos/checkpoints visíveis ao longo do caminho dourado que
// liga as regiões -- daria pra destacar o checkpoint do destino atual com
// um pequeno overlay. Calibrar 8 coordenadas novas (uma por checkpoint) na
// mesma rodada em que várias outras coisas mudam é o tipo de "coordenada
// frágil" que vale mais adiar do que arriscar -- fica pro próximo round,
// reaproveitando o mesmo fluxo de ?calibrar=1 já usado pros hotspots.

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
  centralizarMapaNoDestino();
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

/* Próxima atividade não concluída de um módulo, na ordem em que aparecem
   no container (mesma ordem que a antiga grade de Atividades sempre
   mostrou) -- mesmo critério de "concluída" que moduleStatus()/doneCount
   já usam (nível 5 + 80% de domínio), só que devolve a atividade em si, não
   a contagem. null quando as 7 já estão concluídas (módulo MASTERED ou
   DESAFIO_APROVADO). Rodada 4 (2026-08-19, ver docs/DECISOES.md): o CTA do
   mapa passa a pular a grade de Atividades e abrir isso diretamente -- a
   criança não escolhe mais livremente entre as 7, segue uma de cada vez. */
function proximaAtividadeDoModulo(mod){
  const container = containerById(mod.id);
  if(!container) return null;
  return container.activities.find(a => !(activityLevel[a.id]===5 && masteryPercent(a.id+":5")>=80)) || null;
}

/* Cabeçalho contextual do mapa (rodada 3) -- substitui o "Próximo destino:
   X" fixo por uma mensagem que reflete onde a criança realmente está,
   sem inventar regra de mastery nova (só leitura de moduleStatus(), que já
   é a mesma fonte que computeDestinoAtual() usa). Como as regiões
   desbloqueiam em sequência, "destino sem nenhum progresso e não é a 1ª
   região" só acontece logo depois de terminar a anterior -- é um jeito
   simples de detectar "acabou de desbloquear" sem precisar guardar estado
   extra comparando renders. */
function mensagemDestinoAtual(destinoAtualId){
  if(!destinoAtualId) return "Você já explorou a ilha inteira! 🎉";
  const destino = PT_MAPA_REGIOES.find(r=>r.moduleId === destinoAtualId);
  const mod = PT_MODULES_BENJAMIN.find(m=>m.id === destinoAtualId);
  const status = moduleStatus(mod);
  if(status.doneCount > 0) return "Sua aventura continua na " + destino.nome + ".";
  const ehPrimeiraRegiao = PT_MAPA_REGIOES[0].moduleId === destinoAtualId;
  if(ehPrimeiraRegiao) return "✨ Sua primeira aventura começa na " + destino.nome + "!";
  return "✨ Novo destino: " + destino.nome + "!";
}

/* Matemática pura por trás da rolagem inicial no mobile -- separada do DOM
   de propósito, pra dar pra testar sem depender de layout real (jsdom não
   calcula CSS de verdade). Centraliza alvoPx dentro da janela visível,
   sem deixar a rolagem passar dos limites válidos. */
function calcularScrollCentralizado(alvoPx, larguraVisivelPx, larguraTotalPx){
  const bruto = alvoPx - larguraVisivelPx / 2;
  return Math.max(0, Math.min(bruto, larguraTotalPx - larguraVisivelPx));
}

/* Só tem efeito quando o mapa está maior que a área visível (modo mobile
   "arrastar pra explorar", abaixo de 600px -- ver app.css); em telas
   largas, canvas e viewport têm o mesmo tamanho, então scrollWidth <=
   clientWidth e a função não faz nada (inclusive em jsdom, que não calcula
   layout real e sempre devolve 0 pros dois -- o no-op é seguro por
   construção, não por sorte). */
function centralizarMapaNoDestino(){
  const viewport = document.getElementById("mapa-portugues-map");
  const canvas = document.getElementById("mapa-portugues-canvas");
  if(!viewport || !canvas) return;
  if(viewport.scrollWidth <= viewport.clientWidth) return;
  const destinoId = computeDestinoAtual();
  const regiao = (destinoId && PT_MAPA_REGIOES.find(r=>r.moduleId === destinoId)) || PT_MAPA_REGIOES[0];
  const alvoX = canvas.offsetWidth * (regiao.left / 100);
  viewport.scrollLeft = calcularScrollCentralizado(alvoX, viewport.clientWidth, viewport.scrollWidth);
}

function renderMapaPortugues(){
  const container = document.getElementById("mapa-portugues-regioes");
  container.innerHTML = "";
  const destinoAtualId = computeDestinoAtual();

  const subtitleEl = document.getElementById("mapa-portugues-subtitle");
  if(subtitleEl) subtitleEl.textContent = mensagemDestinoAtual(destinoAtualId);

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
      // Demais módulos (rodada 4, 2026-08-19): pula a grade de Atividades
      // -- vai direto pra próxima atividade não concluída (mesma função que
      // os cards da grade sempre usaram, maybeShowLesson -> startGame) ou
      // pro Desafio Final quando as 7 já estão concluídas.
      cta.onclick = (evt)=>{
        evt.stopPropagation();
        if(regiao.moduleId === "projetoleitor"){
          openProjetoLeitor();
        }else{
          state.navBack = "mapa-portugues";
          const proxima = proximaAtividadeDoModulo(mod);
          if(proxima){
            maybeShowLesson(proxima.id);
          }else{
            startProva(mod.id);
          }
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

  // Nomeia a atividade específica que o CTA abre (rodada 4, 2026-08-19) --
  // sem isso, o popover só dizia o nome da região, nunca qual dos 7
  // desafios ia abrir de fato; agora o CTA pula direto pra lá, então
  // precisa deixar claro o que vai acontecer antes de clicar.
  const proxima = proximaAtividadeDoModulo(mod);
  const proximaLinha = proxima
    ? `<p class="map-popover__detail">${proxima.icon} ${proxima.name}</p>`
    : `<p class="map-popover__detail">🏁 Desafio Final</p>`;

  return titulo + `<p class="map-popover__status">${statusLinha}</p>` + detalheLinha + proximaLinha +
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
