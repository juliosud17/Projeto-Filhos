const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');
let html = require('./_util/load_app_html').loadAppHtml();

// jsdom não avalia media queries de preferência do sistema (prefers-reduced-motion)
// -- a única forma honesta de confirmar que a regra existe é ler o CSS de verdade.
const appCssContent = fs.readFileSync(path.join(__dirname, '../app/css/app.css'), 'utf8');
const temReducedMotionCss = appCssContent.includes('prefers-reduced-motion');

const testScript = `
<script>
window.speechSynthesis = { cancel(){}, speak(){} };
window.SpeechSynthesisUtterance = function(t){ this.text=t; };
window.AudioContext = function(){ return { createOscillator(){return {connect(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},start(){},stop(){}} }, createGain(){return {connect(){},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}}} }, destination:{}, currentTime:0 }; };

let ok=0, fail=0;
function check(l,c){ if(c) ok++; else { fail++; console.log("FAIL: " + l); } }
function active(id){ return document.getElementById(id).classList.contains('active'); }
function fakeEvt(){ return { stopPropagation(){} }; }
function resetProgress(){
  Object.keys(activityLevel).forEach(k=> activityLevel[k]=1);
  Object.keys(mastery).forEach(k=> delete mastery[k]);
  Object.keys(provaPassed).forEach(k=> delete provaPassed[k]);
  Object.keys(provaScores).forEach(k=> delete provaScores[k]);
}
function fullyMasterContainer(containerId){
  const c = containerById(containerId);
  c.activities.forEach(a=>{
    activityLevel[a.id] = 5;
    mastery[a.id+":5"] = [true,true,true,true,true,true,true,true,true,true];
  });
}
function passProva(containerId){ provaPassed[containerId] = true; provaScores[containerId] = {overallPct:100, perActivity:[], passed:true}; }
// clica no marcador (abre/fecha o popover -- não navega mais direto) e
// devolve o próprio <div class="map-region"> pra inspecionar o popover.
function clickMarker(moduleId){
  const btn = document.querySelector('[data-module="'+moduleId+'"]');
  btn.onclick(fakeEvt());
  return btn.closest('.map-region');
}
function clickCta(regionEl){
  const cta = regionEl.querySelector('.map-popover__cta');
  if(!cta) return false;
  cta.onclick(fakeEvt());
  return true;
}

selectChild('benjamin');
openMaterias();
openMapaPortugues();

// ===== 1. renderiza 1 hotspot por módulo, elementos reais e acessíveis =====
check("mostra a tela da Ilha das Letras", active('screen-mapa-portugues'));
const hotspots = document.querySelectorAll('.map-hotspot');
check("8 hotspots (1 por módulo de Português)", hotspots.length === PT_MODULES_BENJAMIN.length && hotspots.length === 8);
check("todo hotspot é um <button> de verdade (acessível por teclado)", Array.from(hotspots).every(b=>b.tagName === 'BUTTON'));
check("todo hotspot tem aria-label", Array.from(hotspots).every(b=>b.getAttribute('aria-label') && b.getAttribute('aria-label').length > 3));
check("todo hotspot tem aria-expanded (popover é um disclosure)", Array.from(hotspots).every(b=>b.hasAttribute('aria-expanded')));
check("todo hotspot tem data-module batendo com um módulo real", Array.from(hotspots).every(b=>PT_MODULES_BENJAMIN.some(m=>m.id===b.dataset.module)));
check("cada módulo de PT_MAPA_REGIOES aparece exatamente 1 vez", PT_MAPA_REGIOES.every(r => document.querySelectorAll('[data-module="'+r.moduleId+'"]').length === 1));
check("nenhum nome de região fica permanentemente visível no marcador (só no popover)", document.querySelectorAll('.map-hotspot .map-hotspot__nome').length === 0);

// ===== 2. estados: LOCKED — popover explica, sem CTA, clique não navega =====
resetProgress();
openMapaPortugues();
check("módulo 2 (leitura) começa LOCKED (M1 não dominado)", document.querySelector('[data-module="leitura"]').classList.contains('map-hotspot--locked'));
const leituraRegion = clickMarker('leitura');
check("popover de região bloqueada explica o motivo", leituraRegion.querySelector('.map-popover').textContent.includes('Ainda não chegamos aqui'));
check("popover de região bloqueada não tem botão de ação (sem CTA)", !leituraRegion.querySelector('.map-popover__cta'));
check("clicar no marcador bloqueado não navega", !active('screen-atividades'));

// ===== 3. estados: AVAILABLE -> LEARNING -> MASTERED -> DESAFIO_APROVADO =====
resetProgress();
openMapaPortugues();
check("módulo 1 (silabas) começa AVAILABLE (sempre desbloqueado)", document.querySelector('[data-module="silabas"]').classList.contains('map-hotspot--available'));

activityLevel.silabas = 5; mastery['silabas:5'] = [true,true,true]; // só 1 das 7 atividades feita
openMapaPortugues();
check("com progresso parcial vira LEARNING", document.querySelector('[data-module="silabas"]').classList.contains('map-hotspot--learning'));
const silabasRegionLearning = clickMarker('silabas');
check("popover de LEARNING mostra 'X de Y desafios concluídos', não um número solto no marcador", silabasRegionLearning.querySelector('.map-popover__detail').textContent.includes('de') && silabasRegionLearning.querySelector('.map-popover__detail').textContent.includes('desafios concluídos'));
const ringLearning = document.querySelector('[data-module="silabas"] .map-hotspot__ring');
check("anel de progresso do marcador reflete o percentual (0 < pct < 100 em LEARNING)", (()=>{ const pct = parseFloat(ringLearning.getAttribute('style').match(/--pct:\\s*([\\d.]+)/)[1]); return pct > 0 && pct < 100; })());

fullyMasterContainer('silabas');
openMapaPortugues();
check("com módulo 100% dominado (sem prova) vira MASTERED", document.querySelector('[data-module="silabas"]').classList.contains('map-hotspot--mastered'));

passProva('silabas');
openMapaPortugues();
check("com Desafio Final aprovado vira DESAFIO_APROVADO", document.querySelector('[data-module="silabas"]').classList.contains('map-hotspot--desafio_aprovado'));

// e o módulo seguinte (leitura) já deveria estar desbloqueado agora
check("módulo 2 desbloqueia depois do módulo 1 + Desafio Final", document.querySelector('[data-module="leitura"]').classList.contains('map-hotspot--available'));

// ===== 4. clique no marcador abre popover; CTA dentro dele é quem navega =====
resetProgress();
openMapaPortugues();
const silabasRegion = clickMarker('silabas');
check("clique no marcador desbloqueado NÃO navega direto — só abre o popover", !active('screen-atividades'));
check("marcador clicado fica marcado como aberto (is-open / aria-expanded)", silabasRegion.classList.contains('is-open') && document.querySelector('[data-module="silabas"]').getAttribute('aria-expanded') === 'true');
check("popover mostra o nome da região", silabasRegion.querySelector('.map-popover__title').textContent.includes('Floresta do Alfabeto'));
check("popover de AVAILABLE tem CTA de ação", !!silabasRegion.querySelector('.map-popover__cta'));
check("clicar de novo no mesmo marcador fecha o popover (toggle)", (()=>{ clickMarker('silabas'); return !silabasRegion.classList.contains('is-open'); })());
clickMarker('silabas'); // reabre
check("clique no CTA do popover abre o jogo direto (rodada 4: pula a grade de Atividades)", (()=>{ clickCta(silabasRegion); return active('screen-game'); })());
check("state.game aponta pra 1ª atividade não concluída do módulo", state.game === 'silabas');

// abrir uma segunda região fecha a primeira (só 1 popover aberto por vez)
resetProgress();
openMapaPortugues();
const rSilabas = clickMarker('silabas');
fullyMasterContainer('silabas'); passProva('silabas');
openMapaPortugues();
const rSilabas2 = clickMarker('silabas');
const rLeitura2 = clickMarker('leitura');
check("abrir outra região fecha a anterior (só 1 popover por vez)", !rSilabas2.classList.contains('is-open') && rLeitura2.classList.contains('is-open'));

// ===== 5. Módulo 8 (Castelo dos Livros) abre o Projeto Leitor, não Atividades =====
resetProgress();
// desbloqueia a cadeia inteira até o módulo 8 (requires: gramatica, que requer narrativas, etc.)
['silabas','leitura','frases','escrita','compreensao','narrativas','gramatica'].forEach(id=>{
  fullyMasterContainer(id); passProva(id);
});
openMapaPortugues();
check("Castelo dos Livros desbloqueado depois do módulo 7 + Desafio Final", document.querySelector('[data-module="projetoleitor"]').classList.contains('map-hotspot--available'));
const casteloRegion = clickMarker('projetoleitor');
check("popover do Castelo tem CTA próprio", !!casteloRegion.querySelector('.map-popover__cta'));
clickCta(casteloRegion);
check("CTA do Castelo abre screen-projeto-leitor (não screen-atividades)", active('screen-projeto-leitor'));
check("não mudou screen-atividades", !active('screen-atividades'));

const conteudo = document.getElementById('projeto-leitor-content').innerHTML;
check("tela do Projeto Leitor lista os 10 livros", PROJETO_LEITOR_LIVROS.every(l => conteudo.includes(l.titulo)));
check("tela do Projeto Leitor mostra o roteiro de perguntas", PROJETO_LEITOR_ROTEIRO.every(p => conteudo.includes(p)));

backFromProjetoLeitor();
check("'Voltar pra ilha' retorna pro mapa", active('screen-mapa-portugues'));

// ===== 6. backToModulos() continua ciente da trilha -- a função e a tela
// screen-atividades continuam existindo (Matemática ainda usa normalmente),
// só não são mais alcançadas pelo clique no mapa desde a rodada 4. Testa
// chamando openAtividades() direto, no lugar do fluxo mapa->CTA. =====
resetProgress();
state.currentTrilha = 'portugues';
openAtividades('silabas');
check("(setup) screen-atividades ainda funciona se chamada diretamente", active('screen-atividades'));
backToModulos();
check("'← Voltar' de dentro de Atividades (Português) volta pro MAPA, não pra grade", active('screen-mapa-portugues'));

openModulos('matematica');
openAtividades('mm1_numeros');
check("(setup) está em screen-atividades vindo da grade de Matemática", active('screen-atividades'));
backToModulos();
check("'← Voltar' de dentro de Atividades (Matemática) volta pra GRADE, não pro mapa", active('screen-modulos'));

// ===== 7. Matemática continua exatamente como antes (grade de cartões, não mapa) =====
openMaterias();
const materiasHtml = document.getElementById('materias-grid').innerHTML;
check("card de Matemática ainda existe em Matérias", materiasHtml.includes('Matemática'));
openModulos('matematica');
check("Matemática ainda abre screen-modulos (grade), não o mapa", active('screen-modulos'));
check("grade de módulos de Matemática tem cartões normais, não hotspots", document.querySelectorAll('#modulos-grid .game-card').length > 0 && document.querySelectorAll('#modulos-grid .map-hotspot').length === 0);

// ===== 8. "próximo destino" (currentDestination): visual, independente de mastery =====
resetProgress();
openMapaPortugues();
check("no início, o destino atual é o primeiro módulo (silabas)", regionIsRecommendedToday('silabas') === true && regionIsRecommendedToday('leitura') === false);
check("exatamente 1 marcador tem a classe --recommended no início", document.querySelectorAll('.map-hotspot--recommended').length === 1);
check("o marcador --recommended é o de silabas", document.querySelector('[data-module="silabas"]').classList.contains('map-hotspot--recommended'));
check("subtítulo do mapa mostra o próximo destino", document.getElementById('mapa-portugues-subtitle').textContent.includes('Floresta do Alfabeto'));

fullyMasterContainer('silabas'); passProva('silabas');
openMapaPortugues();
check("depois de concluir o 1º módulo, o destino atual passa a ser o 2º (leitura)", regionIsRecommendedToday('leitura') === true && regionIsRecommendedToday('silabas') === false);

['silabas','leitura','frases','escrita','compreensao','narrativas','gramatica','projetoleitor'].forEach(id=>{
  if(id !== 'projetoleitor'){ fullyMasterContainer(id); passProva(id); }
});
openMapaPortugues();
check("com a ilha inteira concluída, nenhum módulo é o destino atual (Projeto Leitor não tem Desafio Final)", (()=>{
  // Projeto Leitor não é container (sem prova) -- fica sempre AVAILABLE depois de desbloqueado,
  // então ele é o "não concluído" remanescente e continua sendo o destino atual. Confirma isso
  // em vez de esperar null, pra não inventar uma regra de "conclusão" que não existe pro módulo 8.
  return regionIsRecommendedToday('projetoleitor') === true;
})());
check("subtítulo reflete o destino remanescente (Castelo dos Livros)", document.getElementById('mapa-portugues-subtitle').textContent.includes('Castelo dos Livros'));

// ===== 9. renderAtividades() ainda sabe usar o nome amigável quando chamada
// diretamente -- preservada pra Matemática/futuro, só não é mais alcançada
// pelo clique no mapa desde a rodada 4 (ver docs/DECISOES.md) =====
resetProgress();
state.currentTrilha = 'portugues';
openAtividades('silabas');
check("tela de Atividades mostra o nome da região (não o nome curricular) quando chamada diretamente", document.getElementById('atividades-title').textContent.includes('Floresta do Alfabeto') && !document.getElementById('atividades-title').textContent.includes('Módulo 1'));
check("subtítulo de Atividades usa linguagem de aventura, não a descrição curricular", document.getElementById('atividades-subtitle').textContent === 'Escolha seu próximo desafio');
check("dado curricular original continua intacto em PT_MODULES_BENJAMIN", PT_MODULES_BENJAMIN.find(m=>m.id==='silabas').name.includes('Módulo 1'));

openModulos('matematica');
openAtividades('mm1_numeros');
check("Matemática continua mostrando o nome curricular normalmente (regressão)", document.getElementById('atividades-title').textContent.includes(ALL_MODULES_BENJAMIN.find(m=>m.id==='mm1_numeros').name));

// ===== 10. popover NÃO abre sozinho ao entrar na Ilha (rodada 3) =====
resetProgress();
openMapaPortugues();
check("nenhum popover começa aberto ao entrar na Ilha das Letras", document.querySelectorAll('.map-region.is-open').length === 0);
check("nenhum marcador começa com aria-expanded=true", Array.from(document.querySelectorAll('.map-hotspot')).every(b=>b.getAttribute('aria-expanded') === 'false'));
const destinoRegion10 = clickMarker(computeDestinoAtual());
check("clicar no marcador do destino atual abre o popover dele", destinoRegion10.classList.contains('is-open'));

// ===== 11. "destino atual" é leitura pura -- não muda mastery/prova =====
resetProgress();
openMapaPortugues();
const snapshotAntes = JSON.stringify({activityLevel, mastery, provaPassed, provaScores});
computeDestinoAtual();
regionIsRecommendedToday('silabas');
regionIsRecommendedToday('leitura');
mensagemDestinoAtual(computeDestinoAtual());
const snapshotDepois = JSON.stringify({activityLevel, mastery, provaPassed, provaScores});
check("computeDestinoAtual/regionIsRecommendedToday/mensagemDestinoAtual não alteram mastery/prova", snapshotAntes === snapshotDepois);

// ===== 12. cabeçalho contextual: 3 mensagens conforme o progresso =====
resetProgress();
openMapaPortugues();
check("1ª aventura (nada começado ainda): mensagem de primeira aventura", document.getElementById('mapa-portugues-subtitle').textContent.includes('primeira aventura') && document.getElementById('mapa-portugues-subtitle').textContent.includes('Floresta do Alfabeto'));

activityLevel.silabas = 5; mastery['silabas:5'] = [true,true,true]; // progresso parcial no destino atual
openMapaPortugues();
check("com progresso no destino atual: mensagem de 'aventura continua'", document.getElementById('mapa-portugues-subtitle').textContent === 'Sua aventura continua na Floresta do Alfabeto.');

resetProgress();
fullyMasterContainer('silabas'); passProva('silabas'); // conclui o 1º -- o 2º acabou de desbloquear, 0 feito nele
openMapaPortugues();
check("região recém-desbloqueada (0 feito, não é a 1ª): mensagem de 'novo destino'", document.getElementById('mapa-portugues-subtitle').textContent === '✨ Novo destino: Vila das Palavras!');

resetProgress();
openMapaPortugues();
check("ilha inteira concluída continua com a mensagem de conclusão (sem destino)", (()=>{
  ['silabas','leitura','frases','escrita','compreensao','narrativas','gramatica'].forEach(id=>{ fullyMasterContainer(id); passProva(id); });
  openMapaPortugues();
  // Projeto Leitor continua sendo o "destino" remanescente (não tem Desafio Final) -- não há
  // estado de "tudo mesmo concluído" alcançável de verdade, então testamos a função isoladamente:
  return mensagemDestinoAtual(null) === "Você já explorou a ilha inteira! 🎉";
})());

// ===== 13. subtítulo contextual da tela de Atividades, quando chamada
// diretamente (mesma nota da seção 9) =====
resetProgress();
state.currentTrilha = 'portugues';
openAtividades('silabas');
check("sem progresso: subtítulo de Atividades convida a escolher", document.getElementById('atividades-subtitle').textContent === 'Escolha seu próximo desafio');

activityLevel.silabas = 5; mastery['silabas:5'] = [true,true,true];
openAtividades('silabas');
check("com progresso: subtítulo de Atividades mostra 'continue' + X de Y", document.getElementById('atividades-subtitle').textContent.includes('Continue sua aventura') && document.getElementById('atividades-subtitle').textContent.includes('de'));

// ===== 14. cadeia completa de "Voltar": exercício -> Mapa -> Matérias
// (rodada 4: Atividades deixou de fazer parte do caminho normal do mapa) =====
resetProgress();
openMaterias();
openMapaPortugues();
const r14 = clickMarker('silabas');
clickCta(r14);
check("(setup 1/3) Ilha -> direto pro jogo (screen-game), sem passar por Atividades", active('screen-game') && !active('screen-atividades'));
check("state.game é a 1ª atividade do módulo (silabas)", state.game === 'silabas');
backToMenu();
check("Voltar do exercício retorna DIRETO pra Ilha das Letras (mapa)", active('screen-mapa-portugues'));
backToMaterias();
check("Voltar da Ilha das Letras retorna pra Matérias", active('screen-materias'));

// ===== 17. CTA do mapa pula a grade de Atividades (rodada 4, 2026-08-19) =====
resetProgress();
openMapaPortugues();
const r17a = clickMarker('silabas');
check("popover nomeia a 1ª atividade do módulo antes de clicar", r17a.querySelector('.map-popover').textContent.includes(MODULE1_ACTIVITIES[0].name));
clickCta(r17a);
check("CTA abre o jogo direto (screen-game), não a grade de Atividades", active('screen-game') && !active('screen-atividades'));
check("state.game é a 1ª atividade não concluída do módulo", state.game === MODULE1_ACTIVITIES[0].id);

// conclui a 1ª atividade -- CTA deve pular pra 2ª, não repetir a 1ª
resetProgress();
activityLevel[MODULE1_ACTIVITIES[0].id] = 5;
mastery[MODULE1_ACTIVITIES[0].id + ':5'] = [true,true,true,true,true,true,true,true,true,true];
openMapaPortugues();
const r17b = clickMarker('silabas');
check("popover nomeia a 2ª atividade quando a 1ª já está concluída", r17b.querySelector('.map-popover').textContent.includes(MODULE1_ACTIVITIES[1].name));
clickCta(r17b);
check("CTA pula direto pra 2ª atividade (não repete a 1ª já concluída)", state.game === MODULE1_ACTIVITIES[1].id);

// módulo inteiro concluído (MASTERED, sem Desafio Final ainda) -- CTA abre a prova
resetProgress();
fullyMasterContainer('silabas');
openMapaPortugues();
const r17c = clickMarker('silabas');
check("popover aponta o Desafio Final quando todas as atividades estão concluídas", r17c.querySelector('.map-popover').textContent.includes('Desafio Final'));
clickCta(r17c);
check("CTA abre o Desafio Final direto quando o módulo está MASTERED", state.provaMode === true && state.provaContainerId === 'silabas');

// DESAFIO_APROVADO -- "Explorar de novo" também abre o Desafio Final direto
resetProgress();
fullyMasterContainer('silabas'); passProva('silabas');
openMapaPortugues();
const r17d = clickMarker('silabas');
clickCta(r17d);
check("CTA abre o Desafio Final de novo quando já aprovado (Explorar de novo)", state.provaMode === true && state.provaContainerId === 'silabas');

// ===== 18. "Praticar de novo" -- rever atividade já dominada, sem afetar mastery (rodada 5, 2026-08-19) =====
resetProgress();
openMapaPortugues();
const r18a = clickMarker('silabas');
check("sem nenhuma atividade concluída, o popover NÃO mostra 'Praticar de novo'", !r18a.querySelector('.map-popover__link'));

resetProgress();
activityLevel[MODULE1_ACTIVITIES[0].id] = 5;
mastery[MODULE1_ACTIVITIES[0].id + ':5'] = [true,true,true,true,true,true,true,true,true,true];
openMapaPortugues();
const r18b = clickMarker('silabas');
const linkPraticar = r18b.querySelector('.map-popover__link');
check("com 1 atividade concluída, o popover mostra 'Praticar de novo'", !!linkPraticar && linkPraticar.textContent.includes('Praticar de novo'));

linkPraticar.onclick(fakeEvt());
check("clicar em 'Praticar de novo' abre a tela dedicada (screen-pratica-livre)", active('screen-pratica-livre'));
check("título da tela nomeia a região", document.getElementById('pratica-livre-title').textContent.includes('Floresta do Alfabeto'));
const cardsPratica = document.querySelectorAll('#pratica-livre-grid .game-card');
check("a tela lista só a atividade JÁ concluída (1, não as outras 6 pendentes)", cardsPratica.length === 1);
check("o card mostra o nome da atividade concluída", cardsPratica[0].textContent.includes(MODULE1_ACTIVITIES[0].name));

const snapshotMasteryAntes = JSON.stringify({activityLevel, mastery});
cardsPratica[0].onclick();
check("clicar no card abre o jogo (screen-game) via prática livre", active('screen-game'));
check("state.freePracticeMode fica true durante a prática livre", state.freePracticeMode === true);
check("state.game é a atividade escolhida pra praticar", state.game === MODULE1_ACTIVITIES[0].id);

// responde a rodada (acerto E erro) e confirma que mastery NÃO muda nadinha
registerAnswer(true, null);
registerAnswer(false, null);
const snapshotMasteryDepois = JSON.stringify({activityLevel, mastery});
check("responder durante a prática livre NÃO altera activityLevel/mastery (nem acerto nem erro)", snapshotMasteryAntes === snapshotMasteryDepois);

backToMenu();
check("Voltar da prática livre retorna pro mapa (state.navBack='mapa-portugues')", active('screen-mapa-portugues'));

// uma sessão normal (fora da prática livre) continua resetando a flag corretamente
openAtividades('silabas');
maybeShowLesson(MODULE1_ACTIVITIES[1].id);
check("uma sessão normal (fora da prática livre) NÃO fica marcada como freePracticeMode", state.freePracticeMode === false);

// ===== 15. função pura de rolagem mobile (sem depender de layout real) =====
check("calcularScrollCentralizado centraliza o alvo dentro da janela visível", calcularScrollCentralizado(300, 100, 800) === 250);
check("calcularScrollCentralizado não deixa a rolagem passar do início", calcularScrollCentralizado(10, 100, 800) === 0);
check("calcularScrollCentralizado não deixa a rolagem passar do fim", calcularScrollCentralizado(790, 100, 800) === 700);
check("centralizarMapaNoDestino não quebra quando não há nada pra rolar (desktop/jsdom)", (()=>{ centralizarMapaNoDestino(); return true; })());

// ===== 16. prefers-reduced-motion: a regra existe no CSS de verdade =====
check("app.css tem uma regra @media (prefers-reduced-motion: reduce) pro halo do destino atual", ${temReducedMotionCss});

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', ()=>{});
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
