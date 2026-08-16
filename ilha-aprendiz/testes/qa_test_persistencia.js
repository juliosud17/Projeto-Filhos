const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
let html = require('./_util/load_app_html').loadAppHtml();

const testScript = `
<script>
window.speechSynthesis = { cancel(){}, speak(){} };
window.SpeechSynthesisUtterance = function(t){ this.text=t; };
window.AudioContext = function(){ return { createOscillator(){return {connect(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},start(){},stop(){}} }, createGain(){return {connect(){},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}}} }, destination:{}, currentTime:0 }; };

let ok=0, fail=0;
function check(label, cond){ if(cond) ok++; else { fail++; console.log("FAIL: " + label); } }

// sanidade: localStorage existe neste ambiente (jsdom com url http://localhost/)
check("localStorage disponível", typeof localStorage !== "undefined" && localStorage !== null);

// loadProgress() já rodou uma vez ao carregar o script (bottom de storage.js) --
// nesse ponto o localStorage estava vazio, então nada devia ter mudado.
check("estado inicial: activityLevel.pares_minimos = 1", activityLevel.pares_minimos === 1);
check("estado inicial: mastery vazio", Object.keys(mastery).length === 0);
check("estado inicial: totalStars zerado", state.totalStars.benjamin === 0 && state.totalStars.joaquim === 0);

// ===== 1. round-trip básico: salvar, "resetar" em memória, restaurar =====
activityLevel.pares_minimos = 3;
mastery['pares_minimos:3'] = [true, true, false];
provaPassed.silabas = true;
provaScores.silabas = {overallPct: 90, perActivity: [{act:{icon:'x',name:'x'}, correct:9, total:10, pct:90}], passed:true};
state.totalStars.benjamin = 15;
state.totalStars.joaquim = 4;
saveProgress();

const raw = localStorage.getItem('ilhaAprendizProgresso');
check("saveProgress grava no localStorage", !!raw);
const parsed = JSON.parse(raw);
check("payload salvo tem version correta", parsed.version === 1);
check("payload salvo tem activityLevel.pares_minimos = 3", parsed.activityLevel.pares_minimos === 3);
check("payload salvo tem mastery certo", JSON.stringify(parsed.mastery['pares_minimos:3']) === JSON.stringify([true,true,false]));
check("payload salvo tem provaPassed.silabas", parsed.provaPassed.silabas === true);
check("payload salvo tem totalStars certo", parsed.totalStars.benjamin === 15 && parsed.totalStars.joaquim === 4);

// "esquece" tudo em memória (simula reabrir a aba com estado fresco) --
// sem mexer no localStorage, que é onde o progresso de verdade mora.
activityLevel.pares_minimos = 1;
delete mastery['pares_minimos:3'];
delete provaPassed.silabas;
delete provaScores.silabas;
state.totalStars.benjamin = 0;
state.totalStars.joaquim = 0;

loadProgress();
check("loadProgress restaura activityLevel", activityLevel.pares_minimos === 3);
check("loadProgress restaura mastery", JSON.stringify(mastery['pares_minimos:3']) === JSON.stringify([true,true,false]));
check("loadProgress restaura provaPassed", provaPassed.silabas === true);
check("loadProgress restaura provaScores", provaScores.silabas && provaScores.silabas.overallPct === 90);
check("loadProgress restaura totalStars", state.totalStars.benjamin === 15 && state.totalStars.joaquim === 4);

// ===== 2. defesas contra dado salvo malformado/incompatível =====
localStorage.setItem('ilhaAprendizProgresso', '{ isso não é json válido');
let threw = false;
try { loadProgress(); } catch(e){ threw = true; }
check("loadProgress não lança exceção com JSON corrompido", !threw);
check("estado em memória continua intacto após JSON corrompido", activityLevel.pares_minimos === 3);

localStorage.setItem('ilhaAprendizProgresso', JSON.stringify({version: 999, activityLevel:{pares_minimos:5}}));
activityLevel.pares_minimos = 3; // marca conhecida antes de tentar carregar versão errada
loadProgress();
check("loadProgress ignora payload de versão desconhecida", activityLevel.pares_minimos === 3);

localStorage.setItem('ilhaAprendizProgresso', JSON.stringify({
  version: 1,
  activityLevel: {pares_minimos: 99, chave_inexistente: 3},
  mastery: {"rimas:5": "não é array"},
  totalStars: {benjamin: -5}
}));
activityLevel.pares_minimos = 3;
loadProgress();
check("loadProgress ignora nível fora do range 1-5", activityLevel.pares_minimos === 3);
check("loadProgress ignora chave que não existe em activityLevel", !activityLevel.hasOwnProperty('chave_inexistente'));
check("loadProgress ignora mastery que não é array", !mastery['rimas:5']);
check("loadProgress ignora totalStars negativo", state.totalStars.benjamin !== -5);

// ===== 3. clearProgress =====
saveProgress();
check("localStorage populado antes do clear", !!localStorage.getItem('ilhaAprendizProgresso'));
clearProgress();
check("clearProgress remove a chave", localStorage.getItem('ilhaAprendizProgresso') === null);

// ===== 4. hooks reais (admin) persistem/limpam de verdade =====
activityLevel.rimas = 5;
mastery['rimas:5'] = [true,true,true];
saveProgress();
adminReset('rimas');
const afterReset = JSON.parse(localStorage.getItem('ilhaAprendizProgresso'));
check("adminReset já grava o reset no localStorage", afterReset.activityLevel.rimas === 1);

activityLevel.silabas = 5;
state.totalStars.benjamin = 42;
saveProgress();
adminResetAll();
check("adminResetAll limpa o localStorage (clearProgress)", localStorage.getItem('ilhaAprendizProgresso') === null);

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', ()=>{});
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
