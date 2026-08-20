// Teste de regressão da Fase 0.5 (PRODUCTION_AUDIT.md item 18.6, TAREFA 2):
// os campos `desc` das atividades em app/data/matematica-atividades.js e
// app/data/portugues-atividades.js terminam com o código de habilidade
// BNCC entre parênteses (ex. "(EF01MA01)"), e esse mesmo `desc` era
// interpolado sem filtro no card que a criança toca em renderAtividades()
// (navigation.js) -- violando o princípio obrigatório de CLAUDE.md "BNCC
// não deve poluir a interface infantil".
//
// A correção NÃO apaga o código de nenhum dado -- act.desc continua com o
// código embutido, disponível pra uso futuro (painel de responsáveis,
// documentação, admin). Só o ponto de renderização voltado à criança passa
// a exibir descricaoSemBncc(act.desc) em vez de act.desc cru.
//
// Este teste garante as duas pontas: (1) nenhum card de atividade, em
// nenhum módulo de nenhuma trilha, mostra um código BNCC na tela; (2) os
// dados de origem continuam intactos, com o código, pra não virar uma
// segunda forma de "apagar informação BNCC do projeto" (proibido pela
// TAREFA 2).

const { JSDOM, VirtualConsole } = require('jsdom');
let html = require('./_util/load_app_html').loadAppHtml();

const testScript = `
<script>
window.speechSynthesis = { cancel(){}, speak(){} };
window.SpeechSynthesisUtterance = function(t){ this.text=t; };
window.AudioContext = function(){ return { createOscillator(){return {connect(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},start(){},stop(){}} }, createGain(){return {connect(){},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}}} }, destination:{}, currentTime:0 }; };

let ok=0, fail=0;
function check(l,c){ if(c) ok++; else { fail++; console.log("FAIL: " + l); } }

const BNCC_RE = /\\(EF[0-9A-Z]+\\)/;

/* ---------- 1) unidade: as duas funções de utils.js fazem exatamente o
   que devem, nos dois lados (com código e sem código) ---------- */
check("descricaoSemBncc remove o código do fim da string", descricaoSemBncc("Contar quantidade (EF01MA01)") === "Contar quantidade");
check("descricaoSemBncc não mexe numa descrição sem código (ex.: Joaquim, sem BNCC)", descricaoSemBncc("Encontrar a letra certa") === "Encontrar a letra certa");
check("descricaoSemBncc lida com string vazia/undefined sem quebrar", descricaoSemBncc("") === "" && descricaoSemBncc(undefined) === "");
check("extrairCodigoBncc extrai o código quando existe", extrairCodigoBncc("Contar quantidade (EF01MA01)") === "EF01MA01");
check("extrairCodigoBncc devolve null quando não existe código", extrairCodigoBncc("Encontrar a letra certa") === null);

/* ---------- 2) controle positivo: confirma que os dados de origem AINDA
   têm o código (a correção não pode ter apagado a informação BNCC) ---------- */
const descComCodigoMat = MATH_MODULES_BENJAMIN.flatMap(m=> (containerById(m.id) ? containerById(m.id).activities : [])).filter(a=>a && BNCC_RE.test(a.desc || ""));
const descComCodigoPt = PT_MODULES_BENJAMIN.flatMap(m=> (containerById(m.id) ? containerById(m.id).activities : [])).filter(a=>a && BNCC_RE.test(a.desc || ""));
check("dados de origem (Matemática) continuam com código BNCC embutido em desc (não foi apagado)", descComCodigoMat.length >= 20);
check("dados de origem (Português) continuam com código BNCC embutido em desc (não foi apagado)", descComCodigoPt.length >= 6);

/* ---------- 3) fim-a-fim: renderAtividades() de TODO módulo com container
   (Matemática inteira + Português inteira) não deixa nenhum código BNCC
   visível no grid que a criança toca ---------- */
function resetProgress(){
  Object.keys(activityLevel).forEach(k=> activityLevel[k]=1);
  Object.keys(mastery).forEach(k=> delete mastery[k]);
}
resetProgress();
let modulosChecados = 0;
let vazamentos = [];
ALL_MODULES_BENJAMIN.forEach(mod=>{
  const container = containerById(mod.id);
  if(!container) return; // só módulos com trilha de atividades (ignora "em construção" etc.)
  state.currentTrilha = PT_MODULES_BENJAMIN.some(m=>m.id===mod.id) ? "portugues" : "matematica";
  openAtividades(mod.id);
  modulosChecados++;
  const gridHtml = document.getElementById("atividades-grid").innerHTML;
  if(BNCC_RE.test(gridHtml)) vazamentos.push(mod.id);
});
check("pelo menos os 19 módulos com container (7 PT + 12 MT) foram checados", modulosChecados >= 19);
check("NENHUM módulo mostra código BNCC no card de atividade que a criança toca: " + JSON.stringify(vazamentos), vazamentos.length === 0);

/* ---------- 4) o nome/ícone/nível continuam aparecendo normalmente
   (a correção não pode ter quebrado o card, só limpado o texto) ---------- */
state.currentTrilha = "matematica";
openAtividades("mm1_numeros");
const grid1 = document.getElementById("atividades-grid");
check("card de atividade continua mostrando nome, ícone e nível normalmente", grid1.querySelector("h4") && grid1.querySelector(".icon") && grid1.textContent.includes("Nível"));
check("card de atividade mostra a descrição (sem o código) -- não ficou em branco", grid1.querySelector("p").textContent.trim().length > 0);

console.log("RESULT: " + ok + " passed, " + fail + " failed");
</script>
`;

html = html.replace('</body>', testScript + '</body>');

const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (msg)=> console.log(msg));
virtualConsole.on('error', ()=>{});
virtualConsole.on('jsdomError', ()=>{});

new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
