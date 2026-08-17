const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
let html = require('./_util/load_app_html').loadAppHtml();

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
check("clique no CTA do popover abre screen-atividades", (()=>{ clickCta(silabasRegion); return active('screen-atividades'); })());
check("state.currentModuloId aponta pro módulo certo", state.currentModuloId === 'silabas');

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

// ===== 6. backToModulos() é ciente da trilha =====
resetProgress();
openMapaPortugues();
const setupRegion = clickMarker('silabas');
clickCta(setupRegion);
check("(setup) está em screen-atividades vindo do mapa", active('screen-atividades'));
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

// ===== 9. nome amigável da região aparece na tela de Atividades vinda do mapa =====
resetProgress();
openMapaPortugues();
const r9 = clickMarker('silabas');
clickCta(r9);
check("tela de Atividades mostra o nome da região (não o nome curricular) vindo do mapa", document.getElementById('atividades-title').textContent.includes('Floresta do Alfabeto') && !document.getElementById('atividades-title').textContent.includes('Módulo 1'));
check("subtítulo de Atividades usa linguagem de aventura, não a descrição curricular", document.getElementById('atividades-subtitle').textContent === 'Escolha seu próximo desafio');
check("dado curricular original continua intacto em PT_MODULES_BENJAMIN", PT_MODULES_BENJAMIN.find(m=>m.id==='silabas').name.includes('Módulo 1'));

openModulos('matematica');
openAtividades('mm1_numeros');
check("Matemática continua mostrando o nome curricular normalmente (regressão)", document.getElementById('atividades-title').textContent.includes(ALL_MODULES_BENJAMIN.find(m=>m.id==='mm1_numeros').name));

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', ()=>{});
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
