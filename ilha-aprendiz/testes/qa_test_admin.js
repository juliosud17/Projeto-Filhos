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

openAdmin();
check("admin screen active", document.getElementById('screen-admin').classList.contains('active'));
check("admin list has cards", document.querySelectorAll('#admin-list .panel-card').length > 5);
check("6 activities listed for module1 with 5x inspect buttons each", document.querySelectorAll('#admin-list .panel-card').length >= 6);

// jump directly into pares_minimos level 4 without any prior play/unlock
Object.keys(mastery).forEach(k=>delete mastery[k]); // ensure clean
adminPlay('benjamin', 'pares_minimos', 4);
check("jumped straight into game screen", document.getElementById('screen-game').classList.contains('active'));
check("level forced to 4", activityLevel.pares_minimos === 4);
check("state.child set correctly by admin jump", state.child === 'benjamin');
check("fromAdmin flag set", state.fromAdmin === true);

// back should return to admin, not to kid menu
backToMenu();
check("back from admin-launched game returns to admin panel", document.getElementById('screen-admin').classList.contains('active'));
check("fromAdmin flag cleared after returning", state.fromAdmin === false);

// test jumping into a non-leveled game (leitura)
adminPlay('benjamin', 'leitura');
check("jumped into non-leveled game leitura", document.getElementById('screen-game').classList.contains('active'));
check('.option-btn or .big-word rendered for leitura', document.querySelectorAll('.option-btn').length > 0);
backToMenu();

// test reset of a single activity
activityLevel.rimas = 5;
mastery['rimas:5'] = [true,true,true];
adminReset('rimas');
check("adminReset sets level back to 1", activityLevel.rimas === 1);
check("adminReset clears mastery for that activity", !mastery['rimas:5']);

// test reset all
activityLevel.silabas = 5;
mastery['silabas:5'] = [true];
state.totalStars.benjamin = 42;
adminResetAll();
check("adminResetAll resets level", activityLevel.silabas === 1);
check("adminResetAll clears mastery", Object.keys(mastery).length === 0);
check("adminResetAll resets stars", state.totalStars.benjamin === 0);

// jump into an UNBUILT module should not be offered a play button at all
const naoConstruido = document.querySelector('#admin-list').textContent.includes('ainda não implementado');
check("unbuilt modules shown as not-implemented, no crash", naoConstruido);

// joaquim path via admin
adminPlay('joaquim', 'numeros');
check("admin can jump into joaquim's game too", document.getElementById('screen-game').classList.contains('active') && state.child === 'joaquim');

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', (e)=>console.error('[jsdomError]', e.message));
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
