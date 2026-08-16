const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
let html = fs.readFileSync('/tmp/ilha_aprendiz.html', 'utf8');

const testScript = `
<script>
window.speechSynthesis = { cancel(){}, speak(){} };
window.SpeechSynthesisUtterance = function(t){ this.text=t; };
window.AudioContext = function(){ return { createOscillator(){return {connect(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},start(){},stop(){}} }, createGain(){return {connect(){},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}}} }, destination:{}, currentTime:0 }; };
window.setTimeout = function(){ return 0; };

let ok=0, fail=0;
function check(l,c){ if(c) ok++; else { fail++; console.log("FAIL: " + l); } }
function active(id){ return document.getElementById(id).classList.contains('active'); }

function passProva(containerId){ provaPassed[containerId] = true; provaScores[containerId] = {overallPct:100, perActivity:[], passed:true}; }
function fullyMasterContainer(containerId){
  const c = containerById(containerId);
  c.activities.forEach(a=>{
    activityLevel[a.id] = 5;
    mastery[a.id+":5"] = [true,true,true,true,true,true,true,true,true,true];
  });
}

// 1. Benjamin agora cai na tela de Ano Letivo (screen-menu), não numa lista de jogos
selectChild('benjamin');
check("Benjamin entra na tela de Ano Letivo (screen-menu ativa)", active('screen-menu'));
const anoGridHtml = document.getElementById('game-grid').innerHTML;
check("tela de Ano Letivo mostra o card 1º Ano Fundamental", anoGridHtml.includes('1º Ano Fundamental'));
check("tela de Ano Letivo NÃO lista atividades individuais (não é mais tudo numa página só)", !anoGridHtml.includes('Monte a Sílaba'));

// 2. abrir o card do ano letivo leva pra Matérias
openMaterias();
check("abre screen-materias", active('screen-materias'));
const materiasHtml = document.getElementById('materias-grid').innerHTML;
check("Matérias mostra Português", materiasHtml.includes('Português'));
check("Matérias mostra Matemática", materiasHtml.includes('Matemática'));
check("Matérias mostra a trilha futura (Histórias do Brasil)", materiasHtml.includes('Histórias do Brasil'));

// 3. abrir Português leva pra Módulos, agrupados por bimestre
openModulos('portugues');
check("abre screen-modulos", active('screen-modulos'));
const modulosPtHtml = document.getElementById('modulos-grid').innerHTML;
check("Módulos de Português mostra Módulo 1", modulosPtHtml.includes('Módulo 1'));
check("Módulos de Português agrupa por bimestre", modulosPtHtml.includes('1º bimestre') && modulosPtHtml.includes('2º bimestre'));
check("Módulo 2 aparece BLOQUEADO (Módulo 1 não dominado ainda)", modulosPtHtml.includes('Módulo 2') && modulosPtHtml.includes('🔒 Bloqueado'));

// 4. abrir o Módulo 1 leva pra Atividades
openAtividades('silabas');
check("abre screen-atividades", active('screen-atividades'));
const ativHtml = document.getElementById('atividades-grid').innerHTML;
check("Atividades do Módulo 1 mostra Monte a Sílaba", ativHtml.includes('Monte a Sílaba'));
check("Atividades do Módulo 1 mostra Caça-Letras", ativHtml.includes('Caça-Letras'));
check("Desafio Final NÃO aparece ainda (módulo não dominado)", !ativHtml.includes('Desafio Final'));

// 5. jogar uma atividade a partir da tela de atividades e voltar — deve cair
// de novo em Atividades (não no topo da árvore)
const card = Array.from(document.querySelectorAll('#atividades-grid .game-card')).find(c=>c.innerHTML.includes('Monte a Sílaba'));
check("achou o card de Monte a Sílaba", !!card);
card.onclick();
check("startGame abriu a tela de jogo", active('screen-game'));
check("navBack foi marcado como 'atividades'", state.navBack === 'atividades');
backToMenu();
check("Voltar depois do jogo retorna pra Atividades (não pro topo)", active('screen-atividades'));

// 6. dominar o Módulo 1 inteiro -> Desafio Final aparece na tela de Atividades
fullyMasterContainer('silabas');
openAtividades('silabas');
const ativHtml2 = document.getElementById('atividades-grid').innerHTML;
check("Desafio Final aparece quando o módulo está 100% dominado", ativHtml2.includes('Desafio Final'));

// 7. Módulo 2 continua bloqueado até passar no Desafio Final; depois de aprovar, desbloqueia
openModulos('portugues');
let modulosPtHtml2 = document.getElementById('modulos-grid').innerHTML;
check("Módulo 2 ainda bloqueado (falta o Desafio Final)", modulosPtHtml2.includes('🔒 Bloqueado'));
passProva('silabas');
openModulos('portugues');
modulosPtHtml2 = document.getElementById('modulos-grid').innerHTML;
check("Módulo 2 desbloqueado depois do Desafio Final aprovado", modulosPtHtml2.includes('Módulo 2') && !modulosPtHtml2.split('Módulo 2')[1].split('</div>')[0].includes('Bloqueado'));

// 8. abrir Matemática mostra os jogos extras (soma/subtração) na mesma tela de módulos
openModulos('matematica');
const modulosMatHtml = document.getElementById('modulos-grid').innerHTML;
check("Módulos de Matemática mostra M1", modulosMatHtml.includes('M1'));
check("Módulos de Matemática mostra jogos extras (Soma Divertida)", modulosMatHtml.includes('Soma Divertida'));
check("todos os módulos de Matemática aparecem desbloqueados (trilha independente)", !modulosMatHtml.includes('🔒 Bloqueado'));

// jogar um jogo extra de Matemática a partir da tela de módulos e voltar —
// deve cair de volta em Módulos (não em Atividades, que não existe pra esse jogo)
const somaCard = Array.from(document.querySelectorAll('#modulos-grid .game-card')).find(c=>c.innerHTML.includes('Soma Divertida'));
check("achou o card de Soma Divertida", !!somaCard);
somaCard.onclick();
check("navBack foi marcado como 'modulos' pro jogo extra", state.navBack === 'modulos');
backToMenu();
check("Voltar depois do jogo extra retorna pra Módulos", active('screen-modulos'));

// 9. o Desafio Final também navega e volta certo
fullyMasterContainer('mm1_numeros');
openAtividades('mm1_numeros');
const provaCard = Array.from(document.querySelectorAll('#atividades-grid .game-card')).find(c=>c.innerHTML.includes('Desafio Final'));
check("achou o card do Desafio Final do M1 de Matemática", !!provaCard);
provaCard.onclick();
check("Desafio Final abre a tela de jogo", active('screen-game'));
check("navBack do Desafio Final é 'atividades'", state.navBack === 'atividades');

// 10. painel dos módulos abre a partir do Ano Letivo e volta pra lá certo
backToAnoLetivo();
check("panel-btn visível na tela de Ano Letivo", document.getElementById('panel-btn').style.display !== 'none');
openPanel();
check("abre screen-panel", active('screen-panel'));
backFromPanel();
check("Voltar do painel retorna pro Ano Letivo", active('screen-menu'));

// 11. Joaquim continua com a lista simples de sempre (não passa pela árvore)
selectChild('joaquim');
check("Joaquim cai direto na tela de jogos (screen-menu)", active('screen-menu'));
check("panel-btn escondido pro Joaquim", document.getElementById('panel-btn').style.display === 'none');
const joaquimGridHtml = document.getElementById('game-grid').innerHTML;
check("tela do Joaquim já mostra os jogos dele direto (sem clicar em nada)", joaquimGridHtml.length > 0 && !joaquimGridHtml.includes('1º Ano Fundamental'));

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', ()=>{});
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
