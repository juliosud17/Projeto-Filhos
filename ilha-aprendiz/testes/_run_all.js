// Roda todo arquivo qa_test_*.js da pasta em sequencia, num processo Node
// separado por arquivo (isolamento -- cada teste monta seu proprio jsdom do
// zero), e imprime um resumo no final. Uso: npm test (ou node testes/_run_all.js).

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const dir = __dirname;
const files = fs.readdirSync(dir)
  .filter(f => f.startsWith('qa_test_') && f.endsWith('.js'))
  .sort();

let allOk = true;
const summary = [];

for (const file of files) {
  const full = path.join(dir, file);
  let output = '';
  let crashed = false;
  try {
    output = execFileSync('node', [full], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
  } catch (err) {
    crashed = true;
    output = err.stdout || '';
  }
  // Dois formatos de saida convivem na suite hoje: "RESULT: N passed, M failed"
  // (a maioria) e "TOTAL ERRORS: N" (qa_test_new_activities.js). Aceita os dois.
  const resultLine = output.split('\n').reverse().find(l => l.includes('RESULT:') || l.includes('TOTAL ERRORS:'))
    || (crashed ? 'CRASHOU (sem RESULT:/TOTAL ERRORS: na saida)' : '(sem RESULT:/TOTAL ERRORS: na saida)');
  const failed = crashed
    || / [1-9]\d* failed/.test(resultLine)
    || /TOTAL ERRORS: [1-9]/.test(resultLine);
  if (failed) allOk = false;
  summary.push({ file, resultLine: resultLine.trim(), failed });
}

console.log('\n=== RESUMO DA SUITE ===');
for (const s of summary) {
  console.log(`${s.failed ? 'FAIL' : 'ok  '}  ${s.file.padEnd(32)} ${s.resultLine}`);
}
console.log(`\n${summary.filter(s=>!s.failed).length}/${summary.length} arquivos sem falha.`);
process.exit(allOk ? 0 : 1);
