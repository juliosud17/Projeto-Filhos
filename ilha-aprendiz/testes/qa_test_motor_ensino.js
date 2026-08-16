const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
let html = fs.readFileSync('/tmp/ilha_aprendiz.html', 'utf8');

const testScript = `
<script>
window.speechSynthesis = { cancel(){}, speak(){} };
window.SpeechSynthesisUtterance = function(t){ this.text=t; };
window.AudioContext = function(){ return { createOscillator(){return {connect(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},start(){},stop(){}} }, createGain(){return {connect(){},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}}} }, destination:{}, currentTime:0 }; };

let ok=0, fail=0;
function check(l,c){ if(c) ok++; else { fail++; console.log("FAIL: " + l); } }

// --- sanity: LESSONS data exists for the two M6 activities ---
check("LESSONS.monte_o_numero existe com 4 passos", LESSONS.monte_o_numero && LESSONS.monte_o_numero.steps.length === 4);
check("LESSONS.dezena_e_unidade existe com 4 passos", LESSONS.dezena_e_unidade && LESSONS.dezena_e_unidade.steps.length === 4);
check("Atividade sem aula ainda (ex.: letras) não tem LESSONS", !LESSONS.letras);

// --- 1) primeira entrada na atividade mostra a aula, não o jogo direto ---
state.lessonsSeen = new Set();
selectChild('benjamin');
maybeShowLesson('monte_o_numero');
check("primeira vez: mostra screen-lesson", document.getElementById('screen-lesson').classList.contains('active'));
check("primeira vez: NÃO mostra screen-game ainda", !document.getElementById('screen-game').classList.contains('active'));
check("lesson-progress mostra passo 1 de 4", document.getElementById('lesson-progress').textContent.includes('Passo 1 de 4'));
check("passo 1 (Aprender) mostra o número 14 na explicação", document.getElementById('lesson-card').innerHTML.includes('14'));

// --- 2) botão Próximo avança pros passos info ---
lessonNext();
check("avança pro passo 2 (Ver exemplo)", document.getElementById('lesson-progress').textContent.includes('Passo 2 de 4'));
lessonNext();
check("avança pro passo 3 (Fazer comigo)", document.getElementById('lesson-progress').textContent.includes('Passo 3 de 4'));

// --- 3) passo de prática: botão Próximo fica desabilitado até acertar ---
let nextBtn = Array.from(document.querySelectorAll('#lesson-card .lesson-nav-row button')).find(b=>b.textContent.includes('Próximo'));
check("passo prática: botão Próximo começa desabilitado", nextBtn && nextBtn.disabled === true);

// clica numa opção errada primeiro
const practiceOpts = document.querySelectorAll('#lesson-practice-opts .option-btn');
check("passo prática mostra opções", practiceOpts.length >= 2);
const wrongOpt = Array.from(practiceOpts).find(b => b.textContent !== '3');
if(wrongOpt && wrongOpt.onclick) wrongOpt.onclick();
check("erro na prática mostra dica, sem travar", document.getElementById('lesson-hint').textContent.includes('💡'));
nextBtn = Array.from(document.querySelectorAll('#lesson-card .lesson-nav-row button')).find(b=>b.textContent.includes('Próximo'));
check("ainda desabilitado após errar", nextBtn && nextBtn.disabled === true);

// clica na opção certa
const correctOpt = Array.from(document.querySelectorAll('#lesson-practice-opts .option-btn')).find(b => b.textContent === '3');
if(correctOpt && correctOpt.onclick) correctOpt.onclick();
check("acerto na prática mostra feedback positivo", document.getElementById('lesson-hint').textContent.includes('✅'));
nextBtn = Array.from(document.querySelectorAll('#lesson-card .lesson-nav-row button')).find(b=>b.textContent.includes('Próximo'));
check("botão Próximo libera depois de acertar", nextBtn && nextBtn.disabled === false);

// --- 4) passo final abre a prática de verdade ---
lessonNext();
check("chegou no passo final (4 de 4)", document.getElementById('lesson-progress').textContent.includes('Passo 4 de 4'));
const finishBtn = Array.from(document.querySelectorAll('#lesson-card .lesson-nav-row button')).find(b=>b.textContent.includes('Começar a praticar'));
check("passo final tem botão 'Começar a praticar!'", !!finishBtn);
finishBtn.onclick();
check("depois da aula, entra na prática de verdade (screen-game)", document.getElementById('screen-game').classList.contains('active'));
check("startGame realmente rodou (round 1 de N)", document.getElementById('round-info').textContent.includes('Rodada 1'));
check("botão 'Rever aula' aparece pro jogo com lição", document.getElementById('lesson-revisit-btn').style.display !== 'none');

// --- 5) segunda vez na mesma atividade não repete a aula ---
maybeShowLesson('monte_o_numero');
check("segunda vez: NÃO reabre a aula, vai direto pro jogo", document.getElementById('screen-game').classList.contains('active') && !document.getElementById('screen-lesson').classList.contains('active'));

// --- 6) atividade sem aula continua indo direto pro jogo (comportamento antigo preservado) ---
state.lessonsSeen = new Set();
maybeShowLesson('letras');
check("atividade sem aula (letras) vai direto pro jogo", document.getElementById('screen-game').classList.contains('active'));
check("botão 'Rever aula' some pra atividade sem lição", document.getElementById('lesson-revisit-btn').style.display === 'none');

// --- 7) "Pular aula" na primeira vez também manda direto pro jogo ---
state.lessonsSeen = new Set();
maybeShowLesson('dezena_e_unidade');
check("dezena_e_unidade: mostra a aula na primeira vez", document.getElementById('screen-lesson').classList.contains('active'));
skipLesson();
check("Pular aula: vai direto pro jogo sem passar pelos outros passos", document.getElementById('screen-game').classList.contains('active'));
check("Pular aula ainda marca a aula como vista (não reaparece)", state.lessonsSeen.has('dezena_e_unidade'));

// --- 8) sugestão de "rever a aulinha" depois de 3 erros seguidos ---
state.lessonsSeen = new Set();
startGame('monte_o_numero');
state.wrongStreak = 0;
for(let i=0;i<3;i++){
  state.roundFirstTryUsed = false;
  registerAnswer(false, null);
}
check("depois de 3 erros seguidos, sugere rever a aulinha", document.getElementById('feedback-msg').innerHTML.includes('Rever a aulinha'));
check("wrongStreak chegou a 3", state.wrongStreak === 3);

// clicar no link de revisão (simulando showLesson com resume=true)
showLesson('monte_o_numero', true);
check("resume=true: abre a aula em modo retomar", document.getElementById('screen-lesson').classList.contains('active'));
check("resume=true: botão muda pra 'Voltar a praticar'", document.getElementById('lesson-skip-btn').textContent.includes('Voltar a praticar'));
// avança até o fim e confere que finishLesson volta pro jogo (sem reiniciar startGame)
lessonNext(); lessonNext();
const opt3 = Array.from(document.querySelectorAll('#lesson-practice-opts .option-btn')).find(b => b.textContent === '3');
if(opt3 && opt3.onclick) opt3.onclick();
lessonNext();
const finishBtn2 = Array.from(document.querySelectorAll('#lesson-card .lesson-nav-row button')).find(b=>b.textContent.includes('Começar a praticar'));
finishBtn2.onclick();
check("resume: 'Começar a praticar!' volta pro jogo em andamento", document.getElementById('screen-game').classList.contains('active'));
check("resume: wrongStreak reseta ao voltar da aula", state.wrongStreak === 0);

// --- 9) card da atividade no painel mostra selo de aula disponível ---
selectChild('benjamin');
openMaterias();
openModulos('matematica');
openAtividades('mm6_compor_decompor');
const gridHtml = document.getElementById('atividades-grid').innerHTML;
check("card do Monte o Número mostra selo 'Tem aulinha'", gridHtml.includes('Tem aulinha'));

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;

html = html.replace('</body>', testScript + '</body>');

const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...args)=>console.log(...args));
virtualConsole.on('error', (...args)=>console.error('[jsdom error]', ...args));
virtualConsole.on('jsdomError', (e)=>console.error('[jsdomError]', e.stack || e.message));

new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
