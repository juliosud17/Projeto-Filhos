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

selectChild('benjamin');
openMaterias();
openMapaPortugues();

// ===== 1. renderiza 1 hotspot por módulo, elementos reais e acessíveis =====
check("mostra a tela da Ilha das Letras", active('screen-mapa-portugues'));
const hotspots = document.querySelectorAll('.map-hotspot');
check("8 hotspots (1 por módulo de Português)", hotspots.length === PT_MODULES_BENJAMIN.length && hotspots.length === 8);
check("todo hotspot é um <button> de verdade (acessível por teclado)", Array.from(hotspots).every(b=>b.tagName === 'BUTTON'));
check("todo hotspot tem aria-label", Array.from(hotspots).every(b=>b.getAttribute('aria-label') && b.getAttribute('aria-label').length > 3));
check("todo hotspot tem data-module batendo com um módulo real", Array.from(hotspots).every(b=>PT_MODULES_BENJAMIN.some(m=>m.id===b.dataset.module)));
check("cada módulo de PT_MAPA_REGIOES aparece exatamente 1 vez", PT_MAPA_REGIOES.every(r => document.querySelectorAll('[data-module="'+r.moduleId+'"]').length === 1));

// ===== 2. estados: LOCKED =====
resetProgress();
openMapaPortugues();
const leituraBtn = document.querySelector('[data-module="leitura"]'); // requer silabas (M1)
check("módulo 2 (leitura) começa LOCKED (M1 não dominado)", leituraBtn.classList.contains('map-hotspot--locked'));
check("hotspot LOCKED não navega ao clicar", (()=>{
  const before = active('screen-atividades');
  if(leituraBtn.onclick) leituraBtn.onclick();
  return active('screen-atividades') === before && !active('screen-atividades');
})());

// ===== 3. estados: AVAILABLE -> LEARNING -> MASTERED -> DESAFIO_APROVADO =====
resetProgress();
openMapaPortugues();
const silabasBtn = () => document.querySelector('[data-module="silabas"]'); // M1 sem pré-requisito
check("módulo 1 (silabas) começa AVAILABLE (sempre desbloqueado)", silabasBtn().classList.contains('map-hotspot--available'));

activityLevel.silabas = 5; mastery['silabas:5'] = [true,true,true]; // só 1 das 7 atividades feita
openMapaPortugues();
check("com progresso parcial vira LEARNING", silabasBtn().classList.contains('map-hotspot--learning'));
check("badge de LEARNING mostra X/Y", document.querySelector('[data-module="silabas"] .map-hotspot__badge').textContent.includes('/'));

fullyMasterContainer('silabas');
openMapaPortugues();
check("com módulo 100% dominado (sem prova) vira MASTERED", silabasBtn().classList.contains('map-hotspot--mastered'));

passProva('silabas');
openMapaPortugues();
check("com Desafio Final aprovado vira DESAFIO_APROVADO", silabasBtn().classList.contains('map-hotspot--desafio_aprovado'));

// e o módulo seguinte (leitura) já deveria estar desbloqueado agora
check("módulo 2 desbloqueia depois do módulo 1 + Desafio Final", document.querySelector('[data-module="leitura"]').classList.contains('map-hotspot--available'));

// ===== 4. clique num hotspot desbloqueado abre Atividades =====
resetProgress();
openMapaPortugues();
document.querySelector('[data-module="silabas"]').onclick();
check("clique num hotspot desbloqueado abre screen-atividades", active('screen-atividades'));
check("state.currentModuloId aponta pro módulo certo", state.currentModuloId === 'silabas');

// ===== 5. Módulo 8 (Castelo dos Livros) abre o Projeto Leitor, não Atividades =====
resetProgress();
// desbloqueia a cadeia inteira até o módulo 8 (requires: gramatica, que requer narrativas, etc.)
['silabas','leitura','frases','escrita','compreensao','narrativas','gramatica'].forEach(id=>{
  fullyMasterContainer(id); passProva(id);
});
openMapaPortugues();
const castelo = document.querySelector('[data-module="projetoleitor"]');
check("Castelo dos Livros desbloqueado depois do módulo 7 + Desafio Final", castelo.classList.contains('map-hotspot--available'));
castelo.onclick();
check("clique no Castelo abre screen-projeto-leitor (não screen-atividades)", active('screen-projeto-leitor'));
check("não mudou screen-atividades", !active('screen-atividades'));

const conteudo = document.getElementById('projeto-leitor-content').innerHTML;
check("tela do Projeto Leitor lista os 10 livros", PROJETO_LEITOR_LIVROS.every(l => conteudo.includes(l.titulo)));
check("tela do Projeto Leitor mostra o roteiro de perguntas", PROJETO_LEITOR_ROTEIRO.every(p => conteudo.includes(p)));

backFromProjetoLeitor();
check("'Voltar pra ilha' retorna pro mapa", active('screen-mapa-portugues'));

// ===== 6. backToModulos() é ciente da trilha =====
resetProgress();
openMapaPortugues();
document.querySelector('[data-module="silabas"]').onclick();
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

// ===== 8. flag "recomendado hoje" existe mas não afeta nada ainda (ponto de extensão) =====
check("regionIsRecommendedToday existe e hoje sempre retorna false", typeof regionIsRecommendedToday === 'function' && PT_MAPA_REGIOES.every(r => regionIsRecommendedToday(r.moduleId) === false));
resetProgress();
openMapaPortugues();
check("nenhum hotspot tem a classe --recommended ainda (não implementado de propósito)", document.querySelectorAll('.map-hotspot--recommended').length === 0);

// ===== 9. modo de calibração (dev-only) =====
check("mapaCalibracaoAtiva() é false sem o parâmetro na URL", mapaCalibracaoAtiva() === false);

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', ()=>{});
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
