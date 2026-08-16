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

// ===== 1. bimestreCalendarAtual mapeia mês -> bimestre 1-4 =====
check("janeiro é 1º bimestre", bimestreCalendarAtual(new Date(2026,0,15)) === 1);
check("março é 1º bimestre (limite superior)", bimestreCalendarAtual(new Date(2026,2,31)) === 1);
check("abril é 2º bimestre (limite inferior)", bimestreCalendarAtual(new Date(2026,3,1)) === 2);
check("junho é 2º bimestre", bimestreCalendarAtual(new Date(2026,5,30)) === 2);
check("julho é 3º bimestre", bimestreCalendarAtual(new Date(2026,6,1)) === 3);
check("setembro é 3º bimestre", bimestreCalendarAtual(new Date(2026,8,30)) === 3);
check("outubro é 4º bimestre", bimestreCalendarAtual(new Date(2026,9,1)) === 4);
check("dezembro é 4º bimestre", bimestreCalendarAtual(new Date(2026,11,31)) === 4);
check("sem argumento usa a data real (não quebra)", bimestreCalendarAtual() >= 1 && bimestreCalendarAtual() <= 4);

// ===== 2. bimestreNumero extrai o número do rótulo =====
check("extrai número de '1º bimestre'", bimestreNumero("1º bimestre") === 1);
check("extrai número de '4º bimestre'", bimestreNumero("4º bimestre") === 4);
check("rótulo inválido devolve null, não quebra", bimestreNumero("bimestre nenhum") === null);

// ===== 3. moduloAdiantado: só true quando o módulo está À FRENTE do bimestre real =====
const modFuturo = {bimestre: "4º bimestre"};
const modAtual = {bimestre: "2º bimestre"};
const modPassado = {bimestre: "1º bimestre"};
const dataNoSegundoBimestre = new Date(2026,4,10); // maio -> 2º bimestre

check("módulo de bimestre futuro é sinalizado como adiantado", moduloAdiantado(modFuturo, dataNoSegundoBimestre) === true);
check("módulo do bimestre atual NÃO é adiantado", moduloAdiantado(modAtual, dataNoSegundoBimestre) === false);
check("módulo de bimestre passado NÃO é sinalizado (nunca 'atrasado', de propósito)", moduloAdiantado(modPassado, dataNoSegundoBimestre) === false);
check("módulo sem bimestre reconhecível nunca é adiantado", moduloAdiantado({bimestre:"?"}, dataNoSegundoBimestre) === false);

// ===== 4. modulosAdiantadosDaTrilha =====
const mods = [
  {built:true, bimestre:"1º bimestre"},
  {built:true, bimestre:"3º bimestre"},
  {built:true, bimestre:"4º bimestre"},
  {built:false, bimestre:"4º bimestre"}, // não construído -- não deve contar mesmo sendo "futuro"
];
const adiantados = modulosAdiantadosDaTrilha(mods, dataNoSegundoBimestre);
check("conta só os módulos construídos E à frente (3º e 4º, não o não-construído)", adiantados.length === 2);

// ===== 5. integração real: MATH_MODULES_BENJAMIN tem módulos de todos os 4 bimestres =====
const bimestresReais = new Set(MATH_MODULES_BENJAMIN.map(m=>bimestreNumero(m.bimestre)));
check("dados reais de Matemática cobrem os 4 bimestres", [1,2,3,4].every(b=>bimestresReais.has(b)));

// ===== 6. UI: card da trilha mostra contagem de adiantados quando existem =====
selectChild('benjamin');
openMaterias();
const gridSemFiltro = document.getElementById('materias-grid').innerHTML;
// sem forçar data, só confirma que a lógica não quebra o render (a contagem real depende do dia de hoje)
check("tela de Matérias renderiza sem erro com a lógica de ritmo plugada", gridSemFiltro.includes('Matemática'));

// Simula "estamos no 1º bimestre" só pra validar que o texto aparece quando há adiantados de verdade --
// sem mockar Date global (evita side-effect entre testes), usa a mesma função de detecção
// diretamente sobre os dados reais, comparando contra uma data forçada.
const adiantadosReaisNoComeco = modulosAdiantadosDaTrilha(MATH_MODULES_BENJAMIN, new Date(2026,0,15)); // janeiro -> 1º bimestre
check("em janeiro, boa parte dos módulos de Matemática está 'adiantada' (trilha sem freio nenhum hoje)", adiantadosReaisNoComeco.length >= 6);

// ===== 7. renderModulos: badge aparece no card certo, só em Matemática =====
openModulos("matematica");
// não force a data (usa o dia real do sistema) -- só confirma que, SE existir badge no HTML,
// ele usa o texto certo (não quebra a renderização de nenhum jeito)
const modulosHtml = document.getElementById('modulos-grid').innerHTML;
check("renderModulos (Matemática) renderiza sem erro com o sinal de ritmo plugado", modulosHtml.length > 0);
check("se aparecer o selo, é o texto certo (não 'undefined' nem quebrado)", !modulosHtml.includes('undefined') && !modulosHtml.includes('[object'));

openModulos("portugues");
const modulosPtHtml = document.getElementById('modulos-grid').innerHTML;
check("Português nunca mostra o selo de ritmo (mecanismo é só de Matemática)", !modulosPtHtml.includes('Adiantado'));

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', ()=>{});
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
