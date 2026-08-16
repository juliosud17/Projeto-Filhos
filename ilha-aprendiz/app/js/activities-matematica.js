// Funcoes de renderizacao das atividades de Matematica (Benjamin, modulos M1-M12 + jogos extras Soma/Subtracao).
function renderQuantosTem(stage){
  const lvl = activityLevel.quantos_tem || 5;
  const [min, max] = MM1_QTY_RANGE[lvl];
  const askOrdinal = Math.random() < 0.5 && max >= 3;

  if(!askOrdinal){
    const n = Math.floor(Math.random()*(max-min+1))+min;
    const emoji = COUNT_EMOJI[Math.floor(Math.random()*COUNT_EMOJI.length)];
    const row = Array(n).fill(emoji).join(" ");
    const wrongPool = [...new Set([n-2,n-1,n+1,n+2,n+3].filter(x=>x>=1 && x!==n))];
    const wrongs = pickRandom(wrongPool, 2);
    while(wrongs.length < 2){
      const cand = Math.floor(Math.random()*(max+3))+1;
      if(cand !== n && !wrongs.includes(cand)) wrongs.push(cand);
    }
    const options = shuffle([n, ...wrongs]);
    const qWord = EMOJI_GENDER_FEM[emoji] ? "Quantas" : "Quantos";
    const spoken = `${qWord} ${EMOJI_NAMES[emoji]||"itens"} você vê?`;
    stage.innerHTML = `<div class="prompt">${qWord} ${EMOJI_NAMES[emoji]||"itens"} você vê?</div>
      <div class="big-emoji-row">${row}</div>
      <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
      <div class="options-row" id="opts"></div>`;
    speak(spoken);
    const opts = stage.querySelector("#opts");
    options.forEach(num=>{
      const b = document.createElement("button");
      b.className = "option-btn";
      b.textContent = num;
      b.onclick = ()=> registerAnswer(num === n, b);
      opts.appendChild(b);
    });
  }else{
    const n = Math.min(Math.max(Math.floor(Math.random()*(max-min+1))+min, 3), ANIMAL_ROW_EMOJI.length);
    const rowAnimals = pickRandom(ANIMAL_ROW_EMOJI, n);
    const targetPos = Math.floor(Math.random()*n)+1;
    const correct = rowAnimals[targetPos-1];
    const decoyPositions = pickRandom([...Array(n).keys()].map(i=>i+1).filter(p=>p!==targetPos), Math.min(2, n-1));
    const options = shuffle([correct, ...decoyPositions.map(p=>rowAnimals[p-1])]);
    const row = rowAnimals.join(" ");
    const spoken = `Olhe a fila. Qual bichinho está em ${ORDINAL_WORDS[targetPos]||targetPos+"º"} lugar, da esquerda pra direita?`;
    stage.innerHTML = `<div class="prompt">Qual bichinho está em ${ORDINAL_WORDS[targetPos]||targetPos+"º"} lugar?</div>
      <div class="big-emoji-row">${row}</div>
      <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
      <div class="options-row" id="opts"></div>`;
    speak(spoken);
    const opts = stage.querySelector("#opts");
    options.forEach(a=>{
      const b = document.createElement("button");
      b.className = "option-btn";
      b.textContent = a;
      b.onclick = ()=> registerAnswer(a === correct, b);
      opts.appendChild(b);
    });
  }
}

/* --- Benjamin (Matemática M1): Conta Comigo (EF01MA02) — a mesma habilidade
   pede ESTRATÉGIAS DIFERENTES de contagem, não só "conte um a um" sempre.
   Nível 1-2: objetos soltos (contagem exata um a um). Nível 3: agrupados em
   pares (incentiva contar de 2 em 2). Nível 4: agrupados em grupos de 5
   (conta de 5 em 5). Nível 5: layout mais denso e opções mais próximas do
   valor certo, empurrando pra estimativa em vez de contagem perfeita
   garantida — aproximação honesta de "contagem aproximada" dentro do que dá
   pra fazer num app de clique (ver limitação documentada no índice). */
function renderContaComigoB(stage){
  const lvl = activityLevel.conta_comigo_b || 5;
  const [min, max] = MM1_QTY_RANGE[lvl];
  const n = Math.floor(Math.random()*(max-min+1))+min;
  const emoji = COUNT_EMOJI[Math.floor(Math.random()*COUNT_EMOJI.length)];
  const artWord = EMOJI_GENDER_FEM[emoji] ? "as" : "os";

  let row, strategyMsg;
  if(lvl <= 2){
    row = Array(n).fill(emoji).join(" ");
    strategyMsg = "Conte um a um.";
  }else if(lvl === 3){
    const pairs = Math.floor(n/2), rest = n % 2;
    const groups = Array(pairs).fill(emoji+emoji);
    if(rest) groups.push(emoji);
    row = groups.join("&nbsp;&nbsp;&nbsp;");
    strategyMsg = "Conte de 2 em 2.";
  }else if(lvl === 4){
    const fives = Math.floor(n/5), rest = n % 5;
    const groups = Array(fives).fill(emoji.repeat(5));
    if(rest) groups.push(emoji.repeat(rest));
    row = groups.join("&nbsp;&nbsp;&nbsp;");
    strategyMsg = "Conte de 5 em 5.";
  }else{
    row = Array(n).fill(emoji).join(" ");
    strategyMsg = "Conte com cuidado — as opções estão bem parecidas!";
  }

  const wrongGap = lvl === 5 ? 1 : (lvl === 4 ? 2 : 3);
  const wrongPool = [...new Set([n-2*wrongGap,n-wrongGap,n+wrongGap,n+2*wrongGap].filter(x=>x>=1 && x!==n))];
  const wrongs = pickRandom(wrongPool, 2);
  while(wrongs.length < 2){
    const cand = Math.floor(Math.random()*(max+5))+1;
    if(cand !== n && !wrongs.includes(cand)) wrongs.push(cand);
  }
  const options = shuffle([n, ...wrongs]);
  const spoken = `Conte ${artWord} ${EMOJI_NAMES[emoji]||"itens"}. ${strategyMsg}`;
  stage.innerHTML = `<div class="prompt">Conte ${artWord} ${EMOJI_NAMES[emoji]||"itens"} e toque no número certo</div>
    <div class="prompt" style="font-size:13px; color:#8480a3; margin-top:-6px;">${strategyMsg}</div>
    <div class="big-emoji-row">${row}</div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  options.forEach(num=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.textContent = num;
    b.onclick = ()=> registerAnswer(num === n, b);
    opts.appendChild(b);
  });
}

/* --- Benjamin (Matemática M1): Qual Tem Mais? (EF01MA03) — dois grupos de
   emoji diferentes, criança escolhe qual tem mais ou qual tem menos
   (alternado). A diferença entre os grupos ENCOLHE conforme o nível sobe
   (MM1_MAXGAP), forçando contagem/estimativa de verdade nos níveis altos em
   vez de perceber a diferença só de bater o olho. */
function renderQualTemMais(stage){
  const lvl = activityLevel.qual_tem_mais || 5;
  const [min, max] = MM1_QTY_RANGE[lvl];
  const maxGap = MM1_MAXGAP[lvl];
  let emojiA, emojiB;
  do{
    [emojiA, emojiB] = pickRandom(COUNT_EMOJI, 2);
  }while(emojiA === emojiB);

  let a, b;
  do{
    a = Math.floor(Math.random()*(max-min+1))+min;
    b = Math.floor(Math.random()*(max-min+1))+min;
  }while(a === b || Math.abs(a-b) > maxGap);

  const askMore = Math.random() < 0.5;
  const correct = askMore ? (a > b ? "A" : "B") : (a < b ? "A" : "B");
  const rowA = Array(a).fill(emojiA).join(" ");
  const rowB = Array(b).fill(emojiB).join(" ");
  const questionWord = askMore ? "MAIS" : "MENOS";
  const spoken = `Qual grupo tem ${questionWord} itens: A ou B?`;

  stage.innerHTML = `<div class="prompt">Qual grupo tem ${questionWord}?</div>
    <div style="display:flex; gap:18px; justify-content:center; margin:14px 0; flex-wrap:wrap;">
      <div style="background:#f7f5ff; border-radius:14px; padding:12px 16px; min-width:120px;">
        <div style="font-weight:800; color:var(--purple-dark); margin-bottom:6px;">Grupo A</div>
        <div class="big-emoji-row" style="font-size:22px;">${rowA}</div>
      </div>
      <div style="background:#f7f5ff; border-radius:14px; padding:12px 16px; min-width:120px;">
        <div style="font-weight:800; color:var(--purple-dark); margin-bottom:6px;">Grupo B</div>
        <div class="big-emoji-row" style="font-size:22px;">${rowB}</div>
      </div>
    </div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  ["A","B"].forEach(letter=>{
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = "Grupo " + letter;
    btn.onclick = ()=> registerAnswer(letter === correct, btn);
    opts.appendChild(btn);
  });
}

/* --- Benjamin (Matemática M2): Conta Até 100 (EF01MA04) — objetos agrupados
   em FILEIRAS DE 10 (apoio visual de valor posicional), quantidade total
   generativa dentro da faixa do nível. Última fileira pode ficar incompleta
   (resto), reforçando "10 dezenas cheias + resto de unidades" sem usar esse
   vocabulário formal ainda (isso é o Módulo M6, Compor e Decompor). */
function renderContaAte100(stage){
  const lvl = activityLevel.conta_ate_100 || 5;
  const [min, max] = MM2_QTY_RANGE[lvl];
  const n = Math.floor(Math.random()*(max-min+1))+min;
  const emoji = COUNT_EMOJI[Math.floor(Math.random()*COUNT_EMOJI.length)];
  const artWord = EMOJI_GENDER_FEM[emoji] ? "as" : "os";

  const fullRows = Math.floor(n/10), rest = n % 10;
  const rowsHtml = [];
  for(let i=0;i<fullRows;i++) rowsHtml.push(emoji.repeat(10));
  if(rest) rowsHtml.push(emoji.repeat(rest));
  const row = rowsHtml.join("<br>");

  const gap = lvl >= 4 ? 5 : 10;
  const wrongPool = [...new Set([n-2*gap,n-gap,n+gap,n+2*gap].filter(x=>x>=1 && x<=120 && x!==n))];
  const wrongs = pickRandom(wrongPool, 3);
  while(wrongs.length < 3){
    const cand = Math.floor(Math.random()*110)+1;
    if(cand !== n && !wrongs.includes(cand)) wrongs.push(cand);
  }
  const options = shuffle([n, ...wrongs]);
  const spoken = `Conte ${artWord} ${EMOJI_NAMES[emoji]||"itens"}, organizados em fileiras de 10. Quantos tem no total?`;
  stage.innerHTML = `<div class="prompt">Conte ${artWord} ${EMOJI_NAMES[emoji]||"itens"} — estão em fileiras de 10</div>
    <div class="big-emoji-row" style="font-size:20px; line-height:1.7;">${row}</div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  options.forEach(num=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.textContent = num;
    b.onclick = ()=> registerAnswer(num === n, b);
    opts.appendChild(b);
  });
}

/* --- Benjamin (Matemática M2): Pulando de Tantos em Tantos (EF01MA04,
   contagem por saltos como estratégia) — mostra uma sequência de 4 números
   pulando de 2, 5 ou 10 em 10 e pede o próximo. Foco é a ESTRATÉGIA DE
   CONTAR rápido até perto de 100, não reconhecimento abstrato de padrão
   (isso é o M3, EF01MA10, que é Álgebra). */
function renderPulandoDe10(stage){
  const lvl = activityLevel.pulando_de_10 || 5;
  const steps = MM2_STEP_BY_LEVEL[lvl];
  const step = steps[Math.floor(Math.random()*steps.length)];
  const maxStart = Math.max(1, 100 - step*5);
  const start = (Math.floor(Math.random()*Math.ceil(maxStart/step))*step) + step;
  const seq = [start, start+step, start+step*2, start+step*3];
  const correct = start + step*4;

  const wrongPool = [...new Set([correct-step+1, correct-1, correct+1, correct+step-1].filter(x=>x>=1 && x!==correct))];
  const wrongs = pickRandom(wrongPool, 2);
  while(wrongs.length < 2){
    const cand = correct + (Math.floor(Math.random()*10)-5);
    if(cand !== correct && cand >= 1 && !wrongs.includes(cand)) wrongs.push(cand);
  }
  const options = shuffle([correct, ...wrongs]);
  const spoken = `Contando de ${step} em ${step}: ${seq.join(", ")}. Qual número vem depois?`;
  stage.innerHTML = `<div class="prompt">Contando de ${step} em ${step}, qual número vem depois?</div>
    <div class="big-word" style="font-size:26px;">${seq.join(" → ")} → ?</div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  options.forEach(num=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.textContent = num;
    b.onclick = ()=> registerAnswer(num === correct, b);
    opts.appendChild(b);
  });
}

/* --- Benjamin: Soma Divertida --- */
/* --- Benjamin (Matemática M3): apoio visual usado por Qual é Maior? — nunca
   mostra o número abstrato sozinho, sempre com pontinhos organizados em
   fileiras de 10 do lado (mesma linguagem visual do M2), por pedido explícito
   do Júlio de dar mais apoio concreto em matemática. */
function mm3Visual(n){
  const full = Math.floor(n/10), rest = n % 10;
  const rows = [];
  for(let i=0;i<full;i++) rows.push("●●●●●●●●●●");
  if(rest) rows.push("●".repeat(rest));
  return rows.join("<br>");
}

/* --- Benjamin (Matemática M3): Qual é Maior? (EF01MA05) — compara dois
   números com apoio visual concreto (pontinhos) sempre do lado do número
   abstrato. Níveis 1-3: números pequenos/médios, comparação direta. Níveis
   4-5: números de duas ordens — a dica falada e escrita chama atenção pra
   olhar as dezenas primeiro, nunca deixando a criança "adivinhar". */
function renderQualEMaior(stage){
  const lvl = activityLevel.qual_e_maior || 5;
  const [min, max] = MM3_COMPARE_RANGE[lvl];
  let a, b;
  do{
    a = Math.floor(Math.random()*(max-min+1))+min;
    b = Math.floor(Math.random()*(max-min+1))+min;
  }while(a === b);

  const askBigger = Math.random() < 0.5;
  const correct = askBigger ? (a > b ? "A" : "B") : (a < b ? "A" : "B");
  const question = askBigger ? "MAIOR" : "MENOR";
  const tensHint = lvl >= 4
    ? `<div class="prompt" style="font-size:13px; color:#8480a3; margin-top:-6px;">Dica: olhe primeiro quantas fileiras de 10 cada um tem.</div>`
    : "";
  const spoken = `Qual número é ${question}: A ou B?` + (lvl >= 4 ? " Olhe primeiro quantas fileiras de 10 cada um tem." : "");

  stage.innerHTML = `<div class="prompt">Qual número é ${question}?</div>
    ${tensHint}
    <div style="display:flex; gap:18px; justify-content:center; margin:14px 0; flex-wrap:wrap;">
      <div style="background:#f7f5ff; border-radius:14px; padding:12px 16px; min-width:120px;">
        <div style="font-weight:800; color:var(--purple-dark); margin-bottom:6px;">A</div>
        <div class="big-word" style="font-size:28px;">${a}</div>
        <div class="big-emoji-row" style="font-size:15px; line-height:1.5; letter-spacing:2px;">${mm3Visual(a)}</div>
      </div>
      <div style="background:#f7f5ff; border-radius:14px; padding:12px 16px; min-width:120px;">
        <div style="font-weight:800; color:var(--purple-dark); margin-bottom:6px;">B</div>
        <div class="big-word" style="font-size:28px;">${b}</div>
        <div class="big-emoji-row" style="font-size:15px; line-height:1.5; letter-spacing:2px;">${mm3Visual(b)}</div>
      </div>
    </div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  ["A","B"].forEach(letter=>{
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = letter;
    btn.onclick = ()=> registerAnswer(letter === correct, btn);
    opts.appendChild(btn);
  });
}

/* --- Benjamin (Matemática M3): Organize por Tamanho (EF01MA09) — mostra de 3
   a 5 objetos do MESMO tipo em tamanhos visuais diferentes (alinhados pela
   base, como numa prateleira), pede pra achar o maior ou o menor. Manter o
   mesmo objeto em todos os itens é o que torna a comparação de tamanho justa
   e sem ambiguidade — nunca compara coisas diferentes entre si. */
function renderOrganizePorTamanho(stage){
  const lvl = activityLevel.organize_por_tamanho || 5;
  const count = MM3_ORDER_COUNT[lvl];
  const sizes = [];
  while(sizes.length < count){
    const s = Math.floor(Math.random()*9)+1;
    if(!sizes.includes(s)) sizes.push(s);
  }
  const emoji = pickRandom(["🐘","⭐","🎈","🌳","🐟","🍎"], 1)[0];
  const letters = "ABCDE".slice(0, count).split("");
  const askBiggest = Math.random() < 0.5;
  const correctIdx = askBiggest ? sizes.indexOf(Math.max(...sizes)) : sizes.indexOf(Math.min(...sizes));
  const correct = letters[correctIdx];
  const question = askBiggest ? "MAIOR" : "MENOR";
  const spoken = `Olhe o tamanho de cada um. Qual é o ${question}?`;

  const itemsHtml = letters.map((l,i)=>{
    const fontSize = 16 + sizes[i]*6;
    return `<div style="display:flex; flex-direction:column; align-items:center; margin:4px 10px;">
      <div style="font-size:${fontSize}px; line-height:1;">${emoji}</div>
      <div style="font-weight:800; color:var(--purple-dark); margin-top:4px;">${l}</div>
    </div>`;
  }).join("");

  stage.innerHTML = `<div class="prompt">Qual é o ${question}?</div>
    <div style="display:flex; justify-content:center; align-items:flex-end; flex-wrap:wrap; margin:14px 0;">${itemsHtml}</div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  letters.forEach(l=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.textContent = l;
    b.onclick = ()=> registerAnswer(l === correct, b);
    opts.appendChild(b);
  });
}

/* --- Benjamin (Matemática M3): O Que Vem Depois? (EF01MA10, Álgebra) — a
   regra do padrão é SEMPRE dita em voz alta e escrita na tela, a criança
   nunca precisa adivinhar a regra sem pista. Alterna entre padrão numérico
   (soma sempre X — usando passos 1,2,3,4,6,7, deliberadamente diferentes dos
   passos 2/5/10 do M2, pra testar reconhecimento de padrão de verdade e não
   só a mesma estratégia de contar por saltos) e padrão de figuras que se
   repetem (🔴🔵🔴🔵...). */
function renderOQueVemDepois(stage){
  const lvl = activityLevel.o_que_vem_depois || 5;
  const useShape = Math.random() < 0.5;

  if(useShape){
    const candidates = MM3_SHAPE_PATTERNS.filter(p=>p.level <= Math.min(lvl,2));
    const pattern = candidates[Math.floor(Math.random()*candidates.length)];
    const unit = pattern.unit;
    const cycles = 2 + Math.floor(Math.random()*2);
    const extra = Math.floor(Math.random()*unit.length);
    const seq = [];
    for(let i=0;i<cycles;i++) seq.push(...unit);
    for(let i=0;i<extra;i++) seq.push(unit[i]);
    const correct = unit[seq.length % unit.length];
    const ruleWords = unit.join(" ");
    const spoken = `Olhe o padrão. A regra é: sempre se repete assim, ${ruleWords}. O que vem depois?`;

    const wrongPool = unit.filter(u=>u!==correct);
    const wrongs = pickRandom(wrongPool, Math.min(2, wrongPool.length));
    const extraShapes = ["🟢","🔺","🟣","🌙","🟠"].filter(s=>!unit.includes(s));
    while(wrongs.length < 2){
      const cand = extraShapes[Math.floor(Math.random()*extraShapes.length)];
      if(cand !== correct && !wrongs.includes(cand)) wrongs.push(cand);
    }
    const options = shuffle([correct, ...wrongs]);
    stage.innerHTML = `<div class="prompt">O que vem depois?</div>
      <div class="prompt" style="font-size:13px; color:#8480a3; margin-top:-6px;">A regra é: sempre se repete assim → ${ruleWords}</div>
      <div class="big-word" style="font-size:26px;">${seq.join(" ")} → ?</div>
      <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
      <div class="options-row" id="opts"></div>`;
    speak(spoken);
    const opts = stage.querySelector("#opts");
    options.forEach(sym=>{
      const b = document.createElement("button");
      b.className = "option-btn";
      b.textContent = sym;
      b.onclick = ()=> registerAnswer(sym === correct, b);
      opts.appendChild(b);
    });
  }else{
    const steps = MM3_PATTERN_STEP[lvl];
    const step = steps[Math.floor(Math.random()*steps.length)];
    const start = Math.floor(Math.random()*20)+1;
    const seq = [start, start+step, start+step*2, start+step*3];
    const correct = start + step*4;
    const wrongPool = [...new Set([correct-step+1, correct-1, correct+1, correct+step-1].filter(x=>x>=1 && x!==correct))];
    const wrongs = pickRandom(wrongPool, 2);
    while(wrongs.length < 2){
      const cand = correct + (Math.floor(Math.random()*10)-5);
      if(cand !== correct && cand >= 1 && !wrongs.includes(cand)) wrongs.push(cand);
    }
    const options = shuffle([correct, ...wrongs]);
    const spoken = `Olhe o padrão. A regra é: sempre somar ${step}. ${seq.join(", ")}. O que vem depois?`;
    stage.innerHTML = `<div class="prompt">O que vem depois?</div>
      <div class="prompt" style="font-size:13px; color:#8480a3; margin-top:-6px;">A regra é: sempre soma ${step}</div>
      <div class="big-word" style="font-size:26px;">${seq.join(" → ")} → ?</div>
      <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
      <div class="options-row" id="opts"></div>`;
    speak(spoken);
    const opts = stage.querySelector("#opts");
    options.forEach(num=>{
      const b = document.createElement("button");
      b.className = "option-btn";
      b.textContent = num;
      b.onclick = ()=> registerAnswer(num === correct, b);
      opts.appendChild(b);
    });
  }
}

/* --- Benjamin (Matemática M4): Fatos da Soma (EF01MA06) — os dois números
   somados são derivados de um TOTAL sorteado dentro do teto do nível (nunca
   estoura os "fatos básicos até 20"), e SEMPRE aparecem como dois grupos de
   objetos concretos ao lado da conta abstrata "a + b" — níveis 1-3 usam
   pontinhos/objetos individuais, níveis 4-5 usam fileiras de 10 (mesma
   linguagem visual do M2/M3), nunca só a conta seca sem apoio. */
function renderFatosDaSoma(stage){
  const lvl = activityLevel.fatos_da_soma || 5;
  const [min, max] = MM4_SUM_RANGE[lvl];
  const total = Math.floor(Math.random()*(max-min+1))+min;
  const a = Math.floor(Math.random()*(total-1))+1;
  const b = total - a;
  const emoji = COUNT_EMOJI[Math.floor(Math.random()*COUNT_EMOJI.length)];

  const visualA = lvl <= 3 ? Array(a).fill(emoji).join(" ") : mm3Visual(a);
  const visualB = lvl <= 3 ? Array(b).fill(emoji).join(" ") : mm3Visual(b);
  const visualStyle = lvl <= 3 ? "" : ' style="font-size:15px; line-height:1.5; letter-spacing:2px;"';

  const wrongPool = [...new Set([total-2,total-1,total+1,total+2].filter(x=>x>=1 && x!==total))];
  const wrongs = pickRandom(wrongPool, 2);
  while(wrongs.length < 2){
    const cand = Math.floor(Math.random()*(max+3))+1;
    if(cand !== total && !wrongs.includes(cand)) wrongs.push(cand);
  }
  const options = shuffle([total, ...wrongs]);
  const spoken = `Quanto é ${a} mais ${b}?`;

  stage.innerHTML = `<div class="prompt">Quanto é ${a} + ${b}?</div>
    <div style="display:flex; gap:14px; justify-content:center; align-items:center; margin:14px 0; flex-wrap:wrap;">
      <div style="background:#f7f5ff; border-radius:14px; padding:10px 14px;">
        <div class="big-emoji-row"${visualStyle}>${visualA}</div>
      </div>
      <div style="font-size:26px; font-weight:800; color:var(--purple-dark);">+</div>
      <div style="background:#f7f5ff; border-radius:14px; padding:10px 14px;">
        <div class="big-emoji-row"${visualStyle}>${visualB}</div>
      </div>
    </div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  options.forEach(num=>{
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = num;
    btn.onclick = ()=> registerAnswer(num === total, btn);
    opts.appendChild(btn);
  });
}

/* --- Benjamin (Matemática M4): Problemas de Somar (EF01MA08) — mini-história
   contextualizada falada em voz (não conta seca), praticando reconhecer
   quando uma situação do dia a dia pede uma soma. Templates sorteados +
   números derivados do mesmo TOTAL-por-nível do Fatos da Soma, então a
   dificuldade numérica sobe igual às duas atividades do módulo. */
function renderProblemasDeSomar(stage){
  const lvl = activityLevel.problemas_de_somar || 5;
  const [min, max] = MM4_SUM_RANGE[lvl];
  const total = Math.floor(Math.random()*(max-min+1))+min;
  const a = Math.floor(Math.random()*(total-1))+1;
  const b = total - a;
  const tpl = MM4_PROBLEM_TEMPLATES[Math.floor(Math.random()*MM4_PROBLEM_TEMPLATES.length)];
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const quantWord = tpl.fem ? "quantas" : "quantos";

  const spoken = `${cap(tpl.subject)} tinha ${a} ${tpl.item}. Depois, ${tpl.subject} ${tpl.verb} mais ${b}. Com ${quantWord} ${tpl.item} ${tpl.subject} ficou?`;
  const wrongPool = [...new Set([total-2,total-1,total+1,total+2].filter(x=>x>=1 && x!==total))];
  const wrongs = pickRandom(wrongPool, 2);
  while(wrongs.length < 2){
    const cand = Math.floor(Math.random()*(max+3))+1;
    if(cand !== total && !wrongs.includes(cand)) wrongs.push(cand);
  }
  const options = shuffle([total, ...wrongs]);

  stage.innerHTML = `<div class="prompt">${cap(tpl.subject)} tinha ${a} ${tpl.item}. Depois, ${tpl.verb} mais ${b}.</div>
    <div class="prompt" style="font-size:16px;">Com ${quantWord} ${tpl.item} ${tpl.subject} ficou?</div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  options.forEach(num=>{
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = num;
    btn.onclick = ()=> registerAnswer(num === total, btn);
    opts.appendChild(btn);
  });
}

/* --- Benjamin (Matemática M5): apoio visual usado por Fatos da Subtração —
   mostra os objetos que ficaram normalmente e os que foram tirados riscados
   (mesma linguagem visual do jogo extra Subtração Divertida), organizados em
   fileiras de 10 pra continuar legível até 20 objetos. */
function mm5SubtractionVisual(total, remove, emoji){
  const keptCount = total - remove;
  const items = [];
  for(let i=0;i<keptCount;i++) items.push(emoji);
  for(let i=0;i<remove;i++) items.push(`<span class="crossed">${emoji}</span>`);
  const rows = [];
  for(let i=0;i<items.length;i+=10) rows.push(items.slice(i,i+10).join(" "));
  return rows.join("<br>");
}

/* --- Benjamin (Matemática M5): Fatos da Subtração (EF01MA08) — mesmo padrão
   do Fatos da Soma: apoio visual concreto sempre presente, resultado nunca
   negativo (remove é sempre menor que o total sorteado), teto de 20. */
function renderFatosDaSubtracao(stage){
  const lvl = activityLevel.fatos_da_subtracao || 5;
  const [min, max] = MM5_MINUEND_RANGE[lvl];
  const total = Math.floor(Math.random()*(max-min+1))+min;
  const remove = Math.floor(Math.random()*(total-1))+1;
  const result = total - remove;
  const emoji = COUNT_EMOJI[Math.floor(Math.random()*COUNT_EMOJI.length)];
  const visual = mm5SubtractionVisual(total, remove, emoji);

  const wrongPool = [...new Set([result-2,result-1,result+1,result+2].filter(x=>x>=0 && x!==result))];
  const wrongs = pickRandom(wrongPool, 2);
  while(wrongs.length < 2){
    const cand = Math.floor(Math.random()*(max+1));
    if(cand !== result && !wrongs.includes(cand)) wrongs.push(cand);
  }
  const options = shuffle([result, ...wrongs]);
  const spoken = `Tinha ${total}, tiraram ${remove}. Quanto sobrou?`;

  stage.innerHTML = `<div class="prompt">Tinha ${total}, tiraram ${remove}. Quanto sobrou?</div>
    <div class="big-emoji-row" style="font-size:20px; line-height:1.7;">${visual}</div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  options.forEach(num=>{
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = num;
    btn.onclick = ()=> registerAnswer(num === result, btn);
    opts.appendChild(btn);
  });
}

/* --- Benjamin (Matemática M5): Problemas de Tirar (EF01MA08) — mesmo padrão
   do Problemas de Somar, com verbos de perder/tirar/dar em vez de ganhar. */
function renderProblemasDeTirar(stage){
  const lvl = activityLevel.problemas_de_tirar || 5;
  const [min, max] = MM5_MINUEND_RANGE[lvl];
  const total = Math.floor(Math.random()*(max-min+1))+min;
  const remove = Math.floor(Math.random()*(total-1))+1;
  const result = total - remove;
  const tpl = MM5_PROBLEM_TEMPLATES[Math.floor(Math.random()*MM5_PROBLEM_TEMPLATES.length)];
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const quantWord = tpl.fem ? "quantas" : "quantos";

  const spoken = `${cap(tpl.subject)} tinha ${total} ${tpl.item}. Depois, ${tpl.subject} ${tpl.verb} ${remove}. Com ${quantWord} ${tpl.item} ${tpl.subject} ficou?`;
  const wrongPool = [...new Set([result-2,result-1,result+1,result+2].filter(x=>x>=0 && x!==result))];
  const wrongs = pickRandom(wrongPool, 2);
  while(wrongs.length < 2){
    const cand = Math.floor(Math.random()*(max+1));
    if(cand !== result && !wrongs.includes(cand)) wrongs.push(cand);
  }
  const options = shuffle([result, ...wrongs]);

  stage.innerHTML = `<div class="prompt">${cap(tpl.subject)} tinha ${total} ${tpl.item}. Depois, ${tpl.verb} ${remove}.</div>
    <div class="prompt" style="font-size:16px;">Com ${quantWord} ${tpl.item} ${tpl.subject} ficou?</div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  options.forEach(num=>{
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = num;
    btn.onclick = ()=> registerAnswer(num === result, btn);
    opts.appendChild(btn);
  });
}

/* --- Benjamin (Matemática M5): Soma ou Subtração? (EF01MA08) — a parte mais
   difícil da habilidade é reconhecer QUAL operação um problema pede, não só
   calcular. Em vez de forçar isso dentro do motor de clique único fingindo
   calcular a conta inteira, a atividade pergunta diretamente "é conta de
   somar ou de subtrair?", testando a habilidade central de forma honesta —
   reaproveita os bancos de história do M4 (ganhar = soma) e do M5 (perder =
   subtração), sem duplicar conteúdo. */
function renderSomaOuSubtracao(stage){
  const lvl = activityLevel.soma_ou_subtracao || 5;
  const [min, max] = MM5_MINUEND_RANGE[lvl];
  const isAddition = Math.random() < 0.5;
  const tpl = isAddition
    ? MM4_PROBLEM_TEMPLATES[Math.floor(Math.random()*MM4_PROBLEM_TEMPLATES.length)]
    : MM5_PROBLEM_TEMPLATES[Math.floor(Math.random()*MM5_PROBLEM_TEMPLATES.length)];
  const total = Math.floor(Math.random()*(max-min+1))+min;
  const b = Math.floor(Math.random()*(total-1))+1;
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const quantWord = tpl.fem ? "quantas" : "quantos";

  let sentence;
  if(isAddition){
    const a = total - b;
    sentence = `${cap(tpl.subject)} tinha ${a} ${tpl.item}. Depois, ${tpl.subject} ${tpl.verb} mais ${b}.`;
  }else{
    sentence = `${cap(tpl.subject)} tinha ${total} ${tpl.item}. Depois, ${tpl.subject} ${tpl.verb} ${b}.`;
  }
  const question = `Pra descobrir com ${quantWord} ${tpl.item} ${tpl.subject} ficou, é conta de SOMAR ou de SUBTRAIR?`;
  const spoken = `${sentence} ${question}`;

  stage.innerHTML = `<div class="prompt">${sentence}</div>
    <div class="prompt" style="font-size:16px;">${question}</div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  [{label:"➕ Somar", val:true},{label:"➖ Subtrair", val:false}].forEach(o=>{
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = o.label;
    btn.onclick = ()=> registerAnswer(o.val === isAddition, btn);
    opts.appendChild(btn);
  });
}

/* --- Benjamin (Matemática M6): Monte o Número (EF01MA07) — primeira vez que
   o app usa o vocabulário formal "dezena"/"unidade" numa equação de
   composição/decomposição (23 = 20 + ___). Sempre acompanhado do apoio
   visual em fileiras de 10 (mesma linguagem visual de mm3Visual, reutilizada
   desde o M2), nunca só a equação abstrata sozinha. */
function renderMonteONumero(stage){
  const lvl = activityLevel.monte_o_numero || 5;
  const [min, max] = MM6_NUMBER_RANGE[lvl];
  const n = Math.floor(Math.random()*(max-min+1))+min;
  const tens = Math.floor(n/10), units = n % 10;
  const askUnits = Math.random() < 0.5;
  const visual = mm3Visual(n);

  let equation, correct, wrongPool, spoken;
  if(askUnits){
    correct = units;
    equation = `${n} = ${tens*10} + ___`;
    wrongPool = [...new Set([units-2,units-1,units+1,units+2].filter(x=>x>=0 && x<=9 && x!==units))];
    spoken = `Complete: ${n} é igual a ${tens*10} mais quanto?`;
  }else{
    correct = tens*10;
    equation = `${n} = ___ + ${units}`;
    wrongPool = [...new Set([(tens-2)*10,(tens-1)*10,(tens+1)*10,(tens+2)*10].filter(x=>x>=0 && x<=90 && x!==correct))];
    spoken = `Complete: ${n} é igual a quanto mais ${units}?`;
  }
  const wrongs = pickRandom(wrongPool, 2);
  while(wrongs.length < 2){
    const cand = askUnits ? Math.floor(Math.random()*10) : Math.floor(Math.random()*10)*10;
    if(cand !== correct && !wrongs.includes(cand)) wrongs.push(cand);
  }
  const options = shuffle([correct, ...wrongs]);

  stage.innerHTML = `<div class="prompt">Complete: ${equation}</div>
    <div class="big-emoji-row" style="font-size:15px; line-height:1.5; letter-spacing:2px;">${visual}</div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  options.forEach(num=>{
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = num;
    btn.onclick = ()=> registerAnswer(num === correct, btn);
    opts.appendChild(btn);
  });
}

/* --- Benjamin (Matemática M6): Dezena e Unidade (EF01MA07) — pergunta
   direta usando o vocabulário formal, sempre explicado entre parênteses na
   primeira leitura ("dezenas, ou seja, grupos de 10") pra nunca deixar a
   criança adivinhar o que a palavra nova significa. */
function renderDezenaEUnidade(stage){
  const lvl = activityLevel.dezena_e_unidade || 5;
  const [min, max] = MM6_NUMBER_RANGE[lvl];
  const n = Math.floor(Math.random()*(max-min+1))+min;
  const tens = Math.floor(n/10), units = n % 10;
  const askTens = Math.random() < 0.5;
  const correct = askTens ? tens : units;
  const question = askTens
    ? "Quantas DEZENAS (ou seja, grupos de 10) esse número tem?"
    : "Quantas UNIDADES (ou seja, soltinhas, fora dos grupos de 10) esse número tem?";
  const visual = mm3Visual(n);

  const wrongPool = [...new Set([correct-2,correct-1,correct+1,correct+2].filter(x=>x>=0 && x<=9 && x!==correct))];
  const wrongs = pickRandom(wrongPool, 2);
  while(wrongs.length < 2){
    const cand = Math.floor(Math.random()*10);
    if(cand !== correct && !wrongs.includes(cand)) wrongs.push(cand);
  }
  const options = shuffle([correct, ...wrongs]);
  const spoken = `O número é ${n}. ${question}`;

  stage.innerHTML = `<div class="prompt">O número é ${n}</div>
    <div class="big-emoji-row" style="font-size:15px; line-height:1.5; letter-spacing:2px;">${visual}</div>
    <div class="prompt" style="font-size:16px;">${question}</div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  options.forEach(num=>{
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = num;
    btn.onclick = ()=> registerAnswer(num === correct, btn);
    opts.appendChild(btn);
  });
}

/* --- Benjamin (Matemática M7): Onde Está? (EF01MA11) — grade 3×3 fixa com 9
   bichinhos distintos, sempre visível por inteiro (a criança precisa
   localizar o bichinho perguntado e descrever a posição dele). O nível
   controla quais células entram no sorteio da pergunta (MM7_LEVEL_CELLS),
   não a grade em si — assim o vocabulário pedido cresce gradualmente
   (esquerda/direita isolados primeiro, cantos combinados só nos níveis
   altos), sem nunca mostrar uma grade incompleta ou ambígua. */
function renderOndeEsta(stage){
  const lvl = activityLevel.onde_esta || 5;
  const cellPool = MM7_LEVEL_CELLS[lvl];
  const animals = pickRandom(Object.keys(ANIMAL_NAMES), 9);
  const grid = [];
  for(let r=0;r<3;r++){ grid.push([animals[r*3], animals[r*3+1], animals[r*3+2]]); }

  const [tr, tc] = cellPool[Math.floor(Math.random()*cellPool.length)];
  const targetEmoji = grid[tr][tc];
  const targetInfo = ANIMAL_NAMES[targetEmoji];
  const correct = mm7CellLabel(tr, tc);

  const otherCells = [];
  for(let r=0;r<3;r++) for(let c=0;c<3;c++) if(!(r===tr && c===tc)) otherCells.push([r,c]);
  const distractorCells = pickRandom(otherCells, 2);
  const wrongs = distractorCells.map(([r,c])=>mm7CellLabel(r,c));
  const options = shuffle([correct, ...wrongs]);

  const article = targetInfo.fem ? "a" : "o";
  const spoken = `Onde está ${article} ${targetInfo.name}?`;
  const gridHtml = grid.map(row => row.map(e=>`<div style="font-size:30px; padding:6px;">${e}</div>`).join("")).join("");

  stage.innerHTML = `<div class="prompt">Onde está ${article} ${targetInfo.name} ${targetEmoji}?</div>
    <div style="display:grid; grid-template-columns:repeat(3,1fr); max-width:220px; margin:14px auto; background:#f7f5ff; border-radius:14px; text-align:center;">${gridHtml}</div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  options.forEach(label=>{
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = label;
    btn.onclick = ()=> registerAnswer(label === correct, btn);
    opts.appendChild(btn);
  });
}

/* --- Benjamin (Matemática M7): Siga o Mapa (EF01MA12) — grade 3×3 com um
   ponto de referência fixo (o robô 🤖, sempre no centro) e um alvo (🚩)
   sorteado. Níveis 1-3: alvo sempre na mesma linha ou coluna do robô, pede
   1 direção só. Níveis 4-5: alvo na diagonal, pede uma sequência de 2
   direções em ordem — sempre com o mapa visível, nunca só texto abstrato de
   "direita" e "esquerda" sem o desenho do trajeto. */
function renderSigaOMapa(stage){
  const lvl = activityLevel.siga_o_mapa || 5;
  const start = [1,1];
  const dirLabel = {cima:"Para cima", baixo:"Para baixo", esquerda:"Para a esquerda", direita:"Para a direita"};
  const opposite = {cima:"baixo", baixo:"cima", esquerda:"direita", direita:"esquerda"};

  let target;
  if(lvl <= 3){
    do{
      target = [Math.floor(Math.random()*3), Math.floor(Math.random()*3)];
    }while((target[0]===start[0] && target[1]===start[1]) || (target[0]!==start[0] && target[1]!==start[1]));
  }else{
    do{
      target = [Math.floor(Math.random()*3), Math.floor(Math.random()*3)];
    }while(target[0]===start[0] || target[1]===start[1]);
  }

  const gridCells = [];
  for(let r=0;r<3;r++) for(let c=0;c<3;c++){
    if(r===start[0] && c===start[1]) gridCells.push("🤖");
    else if(r===target[0] && c===target[1]) gridCells.push("🚩");
    else gridCells.push("⬜");
  }
  const gridHtml = gridCells.map(e=>`<div style="font-size:26px; padding:8px;">${e}</div>`).join("");

  const dr = target[0]-start[0], dc = target[1]-start[1];
  let correct, spoken, question;

  if(dr === 0 || dc === 0){
    const dir = dc > 0 ? "direita" : dc < 0 ? "esquerda" : (dr > 0 ? "baixo" : "cima");
    correct = dirLabel[dir];
    question = "Pra qual lado o robô 🤖 anda pra chegar na bandeira 🚩?";
    spoken = question;
    stage.innerHTML = `<div class="prompt">${question}</div>
      <div style="display:grid; grid-template-columns:repeat(3,1fr); max-width:180px; margin:14px auto; background:#f7f5ff; border-radius:14px; text-align:center;">${gridHtml}</div>
      <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
      <div class="options-row" id="opts"></div>`;
    speak(spoken);
    const opts = stage.querySelector("#opts");
    shuffle(Object.values(dirLabel)).forEach(label=>{
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = label;
      btn.onclick = ()=> registerAnswer(label === correct, btn);
      opts.appendChild(btn);
    });
  }else{
    const dirVert = dr > 0 ? "baixo" : "cima";
    const dirHoriz = dc > 0 ? "direita" : "esquerda";
    const vertFirst = Math.random() < 0.5;
    const seq = vertFirst ? [dirVert, dirHoriz] : [dirHoriz, dirVert];
    const seqLabel = s => `${dirLabel[s[0]]}, depois ${dirLabel[s[1]]}`;
    correct = seqLabel(seq);
    const wrong1 = seqLabel([opposite[seq[0]], seq[1]]);
    const wrong2 = seqLabel([seq[0], opposite[seq[1]]]);
    question = "Qual caminho leva o robô 🤖 até a bandeira 🚩?";
    spoken = `${question} ${correct}?`;
    stage.innerHTML = `<div class="prompt">${question}</div>
      <div style="display:grid; grid-template-columns:repeat(3,1fr); max-width:180px; margin:14px auto; background:#f7f5ff; border-radius:14px; text-align:center;">${gridHtml}</div>
      <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
      <div class="options-row" id="opts"></div>`;
    speak(spoken);
    const opts = stage.querySelector("#opts");
    shuffle([correct, wrong1, wrong2]).forEach(label=>{
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = label;
      btn.onclick = ()=> registerAnswer(label === correct, btn);
      opts.appendChild(btn);
    });
  }
}

/* --- Benjamin (Matemática M8): Formas no Mundo (EF01MA13) — objeto do dia a
   dia, pergunta a forma espacial que ele lembra. O nível controla quais das
   6 formas entram no sorteio (MM8_SPATIAL_LEVEL_SHAPES), não muda a
   mecânica — esfera/cubo primeiro, cone/pirâmide só nos níveis altos. */
function renderFormasNoMundo(stage){
  const lvl = activityLevel.formas_no_mundo || 5;
  const allowedShapes = MM8_SPATIAL_LEVEL_SHAPES[lvl];
  const pool = MM8_SPATIAL_ITEMS.filter(it=>allowedShapes.includes(it.shape));
  const item = pool[Math.floor(Math.random()*pool.length)];
  const correct = MM8_SHAPE_LABELS[item.shape];

  const wrongShapePool = allowedShapes.filter(s=>s!==item.shape);
  let wrongShapes = pickRandom(wrongShapePool, Math.min(2, wrongShapePool.length));
  const allShapes = Object.keys(MM8_SHAPE_LABELS);
  while(wrongShapes.length < 2){
    const cand = allShapes[Math.floor(Math.random()*allShapes.length)];
    if(cand !== item.shape && !wrongShapes.includes(cand)) wrongShapes.push(cand);
  }
  const options = shuffle([correct, ...wrongShapes.map(s=>MM8_SHAPE_LABELS[s])]);
  const spoken = `${item.name[0].toUpperCase()}${item.name.slice(1)} lembra qual forma geométrica?`;

  stage.innerHTML = `<div class="prompt">Que forma geométrica ${item.name} lembra?</div>
    <div style="font-size:70px; text-align:center; margin:14px 0;">${item.emoji}</div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  options.forEach(label=>{
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = label;
    btn.onclick = ()=> registerAnswer(label === correct, btn);
    opts.appendChild(btn);
  });
}

/* --- Benjamin (Matemática M8): Nomeie a Forma (EF01MA14) — desenha a figura
   plana de verdade em CSS (não emoji, pra ter controle real de rotação e
   tamanho). Níveis 1-2 sempre na posição "de livro" (rotação 0), a partir
   do nível 3 gira de verdade — atendendo a exigência da BNCC de reconhecer
   a forma em "diferentes disposições", não só numa posição fixa decorada. */
function mm8DrawShape(shape, rotateDeg, color){
  const base = `margin:0 auto; transform:rotate(${rotateDeg}deg);`;
  if(shape === "círculo") return `<div style="width:72px; height:72px; border-radius:50%; background:${color}; ${base}"></div>`;
  if(shape === "quadrado") return `<div style="width:72px; height:72px; background:${color}; ${base}"></div>`;
  if(shape === "retângulo") return `<div style="width:104px; height:56px; background:${color}; ${base}"></div>`;
  return `<div style="width:0; height:0; border-left:40px solid transparent; border-right:40px solid transparent; border-bottom:70px solid ${color}; ${base}"></div>`; // triângulo
}
function renderNomeieAForma(stage){
  const lvl = activityLevel.nomeie_a_forma || 5;
  const [rMin, rMax] = MM8_ROTATION_RANGE[lvl];
  const shape = MM8_PLANE_SHAPES[Math.floor(Math.random()*MM8_PLANE_SHAPES.length)];
  const rotate = rMin === rMax ? 0 : Math.floor(Math.random()*(rMax-rMin+1))+rMin;
  const color = MM8_PLANE_COLORS[Math.floor(Math.random()*MM8_PLANE_COLORS.length)];
  const shapeHtml = mm8DrawShape(shape, rotate, color);
  const options = shuffle([...MM8_PLANE_SHAPES]);
  const spoken = "Que forma é essa?";

  stage.innerHTML = `<div class="prompt">Que forma é essa?</div>
    <div style="min-height:90px; display:flex; align-items:center; justify-content:center; margin:14px 0;">${shapeHtml}</div>
    <button class="tts-btn" onclick="speak('${spoken}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  options.forEach(label=>{
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = label.charAt(0).toUpperCase() + label.slice(1);
    btn.onclick = ()=> registerAnswer(label === shape, btn);
    opts.appendChild(btn);
  });
}

/* --- Benjamin (Matemática M9): apoio visual usado por Comparar de Verdade —
   uma barra colorida cujo tamanho representa a medida (altura, comprimento
   ou largura, conforme a orientação), sem número nenhum — a comparação é
   puramente visual/perceptiva, exatamente como a BNCC pede pra essa
   habilidade (sem unidade de medida convencional). */
function mm9Bar(orientation, size, color){
  if(orientation === "vertical") return `<div style="width:30px; height:${size}px; background:${color}; border-radius:4px;"></div>`;
  if(orientation === "horizontal-thin") return `<div style="width:${Math.round(size*1.6)}px; height:14px; background:${color}; border-radius:4px;"></div>`;
  return `<div style="width:${Math.round(size*1.6)}px; height:40px; background:${color}; border-radius:4px;"></div>`; // horizontal-thick (largura)
}

/* --- Benjamin (Matemática M9): Comparar de Verdade (EF01MA15) — sorteia um
   dos 3 tipos de comparação linear (altura/comprimento/largura), cada um com
   seu próprio contexto (árvore/cobra/tapete) pra não misturar o vocabulário
   errado com o tipo de medida errado. A diferença mínima entre os dois
   tamanhos encolhe por nível, forçando comparação cuidadosa nos níveis
   altos. */
function renderCompararMedidas(stage){
  const lvl = activityLevel.comparar_medidas || 5;
  const dim = MM9_DIMENSIONS[Math.floor(Math.random()*MM9_DIMENSIONS.length)];
  const minGap = MM9_MIN_GAP[lvl];
  let sizeA, sizeB;
  do{
    sizeA = 30 + Math.floor(Math.random()*90);
    sizeB = 30 + Math.floor(Math.random()*90);
  }while(Math.abs(sizeA-sizeB) < minGap);

  const askPositive = Math.random() < 0.5;
  const term = askPositive ? dim.positive : dim.negative;
  const correct = askPositive ? (sizeA > sizeB ? "A" : "B") : (sizeA < sizeB ? "A" : "B");
  const spoken = `Qual ${dim.contextName} é ${term}: A ou B?`;
  const isVertical = dim.orientation === "vertical";
  const barA = mm9Bar(dim.orientation, sizeA, "#8b5cf6");
  const barB = mm9Bar(dim.orientation, sizeB, "#f59e0b");

  stage.innerHTML = `<div class="prompt">Qual ${dim.contextName} é ${term.toUpperCase()}?</div>
    <div style="display:flex; flex-direction:${isVertical?"row":"column"}; gap:18px; justify-content:center; align-items:${isVertical?"flex-end":"center"}; margin:16px 0; flex-wrap:wrap;">
      <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
        <div style="font-weight:800; color:var(--purple-dark);">A</div>
        ${barA}
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
        <div style="font-weight:800; color:var(--purple-dark);">B</div>
        ${barB}
      </div>
    </div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  ["A","B"].forEach(letter=>{
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = letter;
    btn.onclick = ()=> registerAnswer(letter === correct, btn);
    opts.appendChild(btn);
  });
}

/* --- Benjamin (Matemática M9): Cheio ou Vazio, Pesado ou Leve (EF01MA15) —
   alterna entre CAPACIDADE (copos com nível de líquido generativo, mesma
   lógica de diferença mínima por nível) e PESO (pares de objetos reais com
   relação óbvia — a única grandeza que não dá pra fingir visualmente numa
   tela sem inventar uma pista falsa, então usa conhecimento de mundo). */
function renderCheioOuVazio(stage){
  const lvl = activityLevel.cheio_ou_vazio || 5;
  const isCapacity = Math.random() < 0.5;

  if(isCapacity){
    const minGap = MM9_CONTAINER_GAP[lvl];
    let fillA, fillB;
    do{
      fillA = Math.floor(Math.random()*90)+5;
      fillB = Math.floor(Math.random()*90)+5;
    }while(Math.abs(fillA-fillB) < minGap);
    const askFull = Math.random() < 0.5;
    const term = askFull ? "mais cheio" : "mais vazio";
    const correct = askFull ? (fillA > fillB ? "A" : "B") : (fillA < fillB ? "A" : "B");
    const spoken = `Qual copo está ${term}: A ou B?`;
    const glass = fill => `<div style="width:44px; height:80px; border:3px solid var(--purple-dark); border-radius:0 0 8px 8px; display:flex; align-items:flex-end; overflow:hidden;">
        <div style="width:100%; height:${fill}%; background:#3b82f6;"></div>
      </div>`;

    stage.innerHTML = `<div class="prompt">Qual copo está ${term.toUpperCase()}?</div>
      <div style="display:flex; gap:24px; justify-content:center; align-items:flex-end; margin:16px 0;">
        <div style="display:flex; flex-direction:column; align-items:center; gap:6px;"><div style="font-weight:800; color:var(--purple-dark);">A</div>${glass(fillA)}</div>
        <div style="display:flex; flex-direction:column; align-items:center; gap:6px;"><div style="font-weight:800; color:var(--purple-dark);">B</div>${glass(fillB)}</div>
      </div>
      <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
      <div class="options-row" id="opts"></div>`;
    speak(spoken);
    const opts = stage.querySelector("#opts");
    ["A","B"].forEach(letter=>{
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = letter;
      btn.onclick = ()=> registerAnswer(letter === correct, btn);
      opts.appendChild(btn);
    });
  }else{
    const pair = MM9_WEIGHT_PAIRS[Math.floor(Math.random()*MM9_WEIGHT_PAIRS.length)];
    const askHeavier = Math.random() < 0.5;
    const heavierIsA = pair.heavier === "a";
    const correctItem = askHeavier ? (heavierIsA ? pair.a : pair.b) : (heavierIsA ? pair.b : pair.a);
    const term = askHeavier ? "mais pesado" : "mais leve";
    const spoken = `O que é ${term}: ${pair.a.name} ou ${pair.b.name}?`;
    const options = shuffle([pair.a, pair.b]);

    stage.innerHTML = `<div class="prompt">O que é ${term.toUpperCase()}?</div>
      <div style="display:flex; gap:24px; justify-content:center; margin:16px 0; font-size:50px;">
        <div>${pair.a.emoji}</div><div>${pair.b.emoji}</div>
      </div>
      <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
      <div class="options-row" id="opts"></div>`;
    speak(spoken);
    const opts = stage.querySelector("#opts");
    options.forEach(item=>{
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = item.name;
      btn.onclick = ()=> registerAnswer(item.name === correctItem.name, btn);
      opts.appendChild(btn);
    });
  }
}

/* --- Benjamin (Matemática M10): Ordem do Dia (EF01MA16) — a rotina do dia é
   uma ORDEM TOTAL fixa (MM10_ROUTINE), então qualquer par de eventos
   sorteado tem uma resposta certa inequívoca, mesmo sem serem vizinhos na
   lista. A distância entre os dois eventos encolhe por nível — pares bem
   distantes primeiro (óbvio: "acordar" × "dormir"), pares vizinhos só nos
   níveis altos (precisa saber a rotina de verdade). */
function renderOrdemDoDia(stage){
  const lvl = activityLevel.ordem_do_dia || 5;
  const [minGap, maxGap] = MM10_ROUTINE_GAP[lvl];
  const gap = Math.floor(Math.random()*(maxGap-minGap+1))+minGap;
  const idxA = Math.floor(Math.random()*(MM10_ROUTINE.length-gap));
  const idxB = idxA + gap;
  const swap = Math.random() < 0.5;
  const [labelA, orderA] = swap ? [MM10_ROUTINE[idxB], idxB] : [MM10_ROUTINE[idxA], idxA];
  const [labelB, orderB] = swap ? [MM10_ROUTINE[idxA], idxA] : [MM10_ROUTINE[idxB], idxB];

  const askFirst = Math.random() < 0.5;
  const term = askFirst ? "PRIMEIRO" : "POR ÚLTIMO";
  const correct = askFirst ? (orderA < orderB ? labelA : labelB) : (orderA > orderB ? labelA : labelB);
  const spoken = `O que acontece ${term}: ${labelA} ou ${labelB}?`;

  stage.innerHTML = `<div class="prompt">O que acontece ${term}?</div>
    <div style="display:flex; gap:18px; justify-content:center; margin:16px 0; flex-wrap:wrap;">
      <div style="background:#f7f5ff; border-radius:14px; padding:12px 16px; font-weight:700; color:var(--purple-dark); max-width:150px;">${labelA}</div>
      <div style="background:#f7f5ff; border-radius:14px; padding:12px 16px; font-weight:700; color:var(--purple-dark); max-width:150px;">${labelB}</div>
    </div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  [labelA, labelB].forEach(label=>{
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = label;
    btn.onclick = ()=> registerAnswer(label === correct, btn);
    opts.appendChild(btn);
  });
}

/* --- Benjamin (Matemática M10): Que Dia é Hoje? (EF01MA17) — alterna entre 3
   sub-perguntas conforme o nível libera: período do dia (nível 1+),
   dia-da-semana seguinte (nível 2+) e mês seguinte (nível 3+). Sempre 3
   opções, sempre com apoio de "próximo" claro (nunca pede pra decorar a
   lista inteira de uma vez). */
function renderQueDiaEHoje(stage){
  const lvl = activityLevel.que_dia_e_hoje || 5;
  const subtypes = lvl === 1 ? ["periodo"] : lvl === 2 ? ["periodo","dia"] : ["periodo","dia","mes"];
  const subtype = subtypes[Math.floor(Math.random()*subtypes.length)];

  let correct, question, spoken, options, visual;
  if(subtype === "periodo"){
    const p = MM10_PERIODS[Math.floor(Math.random()*MM10_PERIODS.length)];
    correct = mm10Cap(p.name);
    question = "Que período do dia é esse?";
    spoken = question;
    visual = `<div style="font-size:60px; text-align:center; margin:14px 0;">${p.emoji}</div>`;
    options = shuffle(MM10_PERIODS.map(x=>mm10Cap(x.name)));
  }else if(subtype === "dia"){
    const idx = Math.floor(Math.random()*7);
    correct = mm10Cap(MM10_DAYS[(idx+1)%7]);
    question = `Qual dia da semana vem DEPOIS de ${MM10_DAYS[idx]}?`;
    spoken = question;
    visual = `<div class="big-word" style="font-size:22px; text-align:center; margin:14px 0;">${mm10Cap(MM10_DAYS[idx])}</div>`;
    const wrongPool = MM10_DAYS.filter((d,i)=> i!==idx && i!==(idx+1)%7);
    options = shuffle([correct, ...pickRandom(wrongPool,2).map(mm10Cap)]);
  }else{
    const idx = Math.floor(Math.random()*12);
    correct = mm10Cap(MM10_MONTHS[(idx+1)%12]);
    question = `Qual mês vem DEPOIS de ${MM10_MONTHS[idx]}?`;
    spoken = question;
    visual = `<div class="big-word" style="font-size:22px; text-align:center; margin:14px 0;">${mm10Cap(MM10_MONTHS[idx])}</div>`;
    const wrongPool = MM10_MONTHS.filter((m,i)=> i!==idx && i!==(idx+1)%12);
    options = shuffle([correct, ...pickRandom(wrongPool,2).map(mm10Cap)]);
  }

  stage.innerHTML = `<div class="prompt">${question}</div>
    ${visual}
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  options.forEach(label=>{
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = label;
    btn.onclick = ()=> registerAnswer(label === correct, btn);
    opts.appendChild(btn);
  });
}

/* --- Benjamin (Matemática M10): Escreva a Data (EF01MA18) — aproximação
   honesta dentro do motor de clique único: em vez de fingir digitação livre
   de uma data inteira, mostra um "cartão de data" completo (dia da semana +
   número + mês) e pergunta sobre UMA das 3 partes por vez, praticando
   reconhecer cada peça que compõe uma data. */
function renderEscrevaAData(stage){
  const dayIdx = Math.floor(Math.random()*7);
  const dayNumber = Math.floor(Math.random()*28)+1;
  const monthIdx = Math.floor(Math.random()*12);
  const dateCard = `${mm10Cap(MM10_DAYS[dayIdx])}, dia ${dayNumber} de ${MM10_MONTHS[monthIdx]}`;
  const askType = ["dia_semana","numero","mes"][Math.floor(Math.random()*3)];

  let correct, question, options;
  if(askType === "dia_semana"){
    correct = mm10Cap(MM10_DAYS[dayIdx]);
    question = "Que dia da semana é esse?";
    const wrongPool = MM10_DAYS.filter((d,i)=>i!==dayIdx);
    options = shuffle([correct, ...pickRandom(wrongPool,2).map(mm10Cap)]);
  }else if(askType === "numero"){
    correct = dayNumber;
    question = "Que número é o dia?";
    const wrongPool = [...new Set([dayNumber-2,dayNumber-1,dayNumber+1,dayNumber+2].filter(x=>x>=1 && x<=31 && x!==dayNumber))];
    const wrongs = pickRandom(wrongPool,2);
    while(wrongs.length<2){
      const cand = Math.floor(Math.random()*31)+1;
      if(cand!==dayNumber && !wrongs.includes(cand)) wrongs.push(cand);
    }
    options = shuffle([correct, ...wrongs]);
  }else{
    correct = mm10Cap(MM10_MONTHS[monthIdx]);
    question = "Que mês é esse?";
    const wrongPool = MM10_MONTHS.filter((m,i)=>i!==monthIdx);
    options = shuffle([correct, ...pickRandom(wrongPool,2).map(mm10Cap)]);
  }
  const spoken = `A data é: ${dateCard}. ${question}`;

  stage.innerHTML = `<div class="prompt">A data é: ${dateCard}</div>
    <div class="prompt" style="font-size:16px;">${question}</div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  options.forEach(label=>{
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = label;
    btn.onclick = ()=> registerAnswer(label === correct, btn);
    opts.appendChild(btn);
  });
}

/* --- Benjamin (Matemática M11): apoio visual pra uma moeda/cédula — círculo
   dourado pra moeda, retângulo verde pra cédula, sempre com o valor escrito
   dentro (nunca só a forma sem o número, já que reconhecer o VALOR
   escrito é justamente a habilidade pedida). */
function mm11ItemVisual(item){
  if(item.type === "moeda"){
    return `<div style="width:70px; height:70px; border-radius:50%; background:#fbbf24; border:3px solid #b45309; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; color:#78350f; margin:0 auto;">${item.label}</div>`;
  }
  return `<div style="width:120px; height:56px; border-radius:8px; background:#86efac; border:3px solid #15803d; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:14px; color:#14532d; margin:0 auto;">${item.label}</div>`;
}

/* --- Benjamin (Matemática M11): Quanto Vale? (EF01MA19) — mostra uma moeda
   ou cédula e pergunta o valor escrito nela. O nível controla quais
   moedas/cédulas entram no sorteio (MM11_LEVEL_CENTS): reais inteiros
   "redondos" primeiro, moedas de centavos só a partir do nível 4. */
function renderQuantoVale(stage){
  const lvl = activityLevel.quanto_vale || 5;
  const pool = MM11_ITEMS.filter(it=>MM11_LEVEL_CENTS[lvl].includes(it.cents));
  const item = pool[Math.floor(Math.random()*pool.length)];
  const correct = item.label;

  const wrongPool = pool.filter(it=>it.cents!==item.cents).map(it=>it.label);
  let wrongs = pickRandom(wrongPool, Math.min(2, wrongPool.length));
  const allLabels = MM11_ITEMS.map(it=>it.label);
  while(wrongs.length < 2){
    const cand = allLabels[Math.floor(Math.random()*allLabels.length)];
    if(cand !== correct && !wrongs.includes(cand)) wrongs.push(cand);
  }
  const options = shuffle([correct, ...wrongs]);
  const spoken = `Quanto vale ess${item.type==="moeda"?"a moeda":"a cédula"}?`;

  stage.innerHTML = `<div class="prompt">Quanto vale ess${item.type==="moeda"?"a moeda":"a cédula"}?</div>
    <div style="margin:16px 0;">${mm11ItemVisual(item)}</div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  options.forEach(label=>{
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = label;
    btn.onclick = ()=> registerAnswer(label === correct, btn);
    opts.appendChild(btn);
  });
}

/* --- Benjamin (Matemática M11): Junte pra Comprar (EF01MA19) — soma um
   punhado de moedas/cédulas (com repetição permitida, como na vida real) e
   pergunta quanto dá ao todo. Trabalha inteiramente em centavos até o
   último momento, pra nunca ter erro de arredondamento na soma. */
function renderJuntePraComprar(stage){
  const lvl = activityLevel.junte_pra_comprar || 5;
  const pool = MM11_ITEMS.filter(it=>MM11_LEVEL_CENTS[lvl].includes(it.cents));
  const count = MM11_JUNTE_COUNT[lvl];
  const items = [];
  for(let i=0;i<count;i++) items.push(pool[Math.floor(Math.random()*pool.length)]);
  const totalCents = items.reduce((sum,it)=>sum+it.cents, 0);
  const correct = mm11FormatCents(totalCents);

  const gap = MM11_ITEMS[0].cents; // menor unidade disponível globalmente, pra distratores plausíveis
  const wrongCandidates = [...new Set([totalCents-gap*2, totalCents-gap, totalCents+gap, totalCents+gap*2].filter(x=>x>0 && x!==totalCents))];
  const wrongs = pickRandom(wrongCandidates, 2).map(mm11FormatCents);
  while(wrongs.length < 2){
    const cand = totalCents + (Math.floor(Math.random()*20)-10)*gap;
    if(cand > 0 && cand !== totalCents){
      const label = mm11FormatCents(cand);
      if(label !== correct && !wrongs.includes(label)) wrongs.push(label);
    }
  }
  const options = shuffle([correct, ...wrongs]);
  const itemsHtml = items.map(it=>mm11ItemVisual(it)).join("");
  const spoken = "Quanto dá tudo isso junto?";

  stage.innerHTML = `<div class="prompt">Quanto dá tudo isso junto?</div>
    <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin:16px 0;">${itemsHtml}</div>
    <button class="tts-btn" onclick="speak('${spoken}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  options.forEach(label=>{
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = label;
    btn.onclick = ()=> registerAnswer(label === correct, btn);
    opts.appendChild(btn);
  });
}

/* --- Benjamin (Matemática M12): Vai Acontecer? (EF01MA20) — 15 situações do
   dia a dia balanceadas em 3 categorias (certo/possível/impossível), 3 por
   nível. Sempre as mesmas 3 opções de resposta, então a criança aprende o
   VOCABULÁRIO da classificação, não decora qual botão clicar. */
function renderVaiAcontecer(stage){
  const lvl = activityLevel.vai_acontecer || 5;
  const item = pickWeightedByLevel(MM12_EVENTS, lvl, "MM12EVENTS");
  const correct = MM12_CATEGORY_LABELS[item.category];
  const options = shuffle(Object.values(MM12_CATEGORY_LABELS));
  const spoken = `${item.text}. Isso é certo, possível ou impossível de acontecer?`;

  stage.innerHTML = `<div class="prompt">${item.text}</div>
    <div class="prompt" style="font-size:16px;">Isso é certo, possível ou impossível de acontecer?</div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  options.forEach(label=>{
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = label;
    btn.onclick = ()=> registerAnswer(label === correct, btn);
    opts.appendChild(btn);
  });
}

/* --- Benjamin (Matemática M12): Leia o Gráfico (EF01MA21) — gráfico de
   colunas desenhado como QUADRADINHOS EMPILHADOS (não barra com altura
   livre), pra a criança poder CONTAR de verdade em vez de estimar por
   altura de pixel. Sempre 3 categorias, valores sempre distintos entre si
   (nunca empate), pra "qual tem mais/menos" e "diferença" serem sempre
   inequívocos. O tipo de pergunta liberado cresce por nível. */
function renderLeiaOGrafico(stage){
  const lvl = activityLevel.leia_o_grafico || 5;
  const theme = MM12_CHART_THEMES[Math.floor(Math.random()*MM12_CHART_THEMES.length)];
  const [min, max] = MM12_CHART_RANGE[lvl];
  const values = mm12DistinctValues(theme.categories.length, min, max);
  const colors = ["#8b5cf6","#f59e0b","#10b981"];

  const barsHtml = theme.categories.map((cat,i)=>{
    const squares = Array(values[i]).fill(`<div style="width:20px; height:12px; background:${colors[i]}; margin:1px auto; border-radius:2px;"></div>`).join("");
    return `<div style="display:flex; flex-direction:column-reverse; align-items:center; gap:2px;">
      <div style="font-size:22px;">${cat.icon}</div>
      <div style="display:flex; flex-direction:column-reverse;">${squares}</div>
    </div>`;
  }).join("");

  const types = MM12_QUESTION_TYPES[lvl];
  const qType = types[Math.floor(Math.random()*types.length)];
  let question, correct, options, spoken;

  if(qType === "mais_menos"){
    const askMore = Math.random() < 0.5;
    const targetIdx = askMore ? values.indexOf(Math.max(...values)) : values.indexOf(Math.min(...values));
    correct = theme.categories[targetIdx].name;
    question = askMore ? `Qual tem MAIS, no gráfico de ${theme.label}?` : `Qual tem MENOS, no gráfico de ${theme.label}?`;
    spoken = question;
    options = shuffle(theme.categories.map(c=>c.name));
  }else if(qType === "quantos"){
    const idx = Math.floor(Math.random()*theme.categories.length);
    correct = values[idx];
    question = `Quantos ${theme.categories[idx].name.toLowerCase()} tem no gráfico?`;
    spoken = question;
    const wrongPool = [...new Set([correct-2,correct-1,correct+1,correct+2].filter(x=>x>=0 && x!==correct))];
    const wrongs = pickRandom(wrongPool, 2);
    while(wrongs.length < 2){
      const cand = Math.floor(Math.random()*(max+3));
      if(cand !== correct && !wrongs.includes(cand)) wrongs.push(cand);
    }
    options = shuffle([correct, ...wrongs]);
  }else{
    const idxs = shuffle([0,1,2]).slice(0,2);
    correct = Math.abs(values[idxs[0]] - values[idxs[1]]);
    question = `Quantos ${theme.categories[idxs[0]].name.toLowerCase()} a mais ou a menos tem, comparado com ${theme.categories[idxs[1]].name.toLowerCase()}?`;
    spoken = question;
    const wrongPool = [...new Set([correct-2,correct-1,correct+1,correct+2].filter(x=>x>=0 && x!==correct))];
    const wrongs = pickRandom(wrongPool, 2);
    while(wrongs.length < 2){
      const cand = Math.floor(Math.random()*(max+3));
      if(cand !== correct && !wrongs.includes(cand)) wrongs.push(cand);
    }
    options = shuffle([correct, ...wrongs]);
  }

  stage.innerHTML = `<div class="prompt">${question}</div>
    <div style="display:flex; gap:20px; justify-content:center; align-items:flex-end; margin:16px 0; min-height:110px;">${barsHtml}</div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  options.forEach(label=>{
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = label;
    btn.onclick = ()=> registerAnswer(label === correct, btn);
    opts.appendChild(btn);
  });
}

function renderSoma(stage){
  const a = Math.floor(Math.random()*5)+1;
  const b_ = Math.floor(Math.random()*5)+1;
  const sum = a+b_;
  const emoji = COUNT_EMOJI[Math.floor(Math.random()*COUNT_EMOJI.length)];
  const rowA = Array(a).fill(emoji).join(" ");
  const rowB = Array(b_).fill(emoji).join(" ");
  let wrongs = shuffle([...Array(11).keys()].filter(x=>x!==sum && x>=0)).slice(0,3);
  const options = shuffle([sum, ...wrongs]);

  stage.innerHTML = `<div class="prompt">Quanto é ${a} + ${b_}?</div>
    <div class="big-emoji-row">${rowA} &nbsp;+&nbsp; ${rowB}</div>
    <button class="tts-btn" onclick="speak('Quanto é ${a} mais ${b_}?')">🔊</button>
    <div class="options-row" id="opts"></div>`;
  speak(`Quanto é ${a} mais ${b_}?`);
  const opts = stage.querySelector("#opts");
  options.forEach(num=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.textContent = num;
    b.onclick = ()=> registerAnswer(num === sum, b);
    opts.appendChild(b);
  });
}

/* --- Benjamin: Subtração Divertida --- */
function renderSubtracao(stage){
  const total = Math.floor(Math.random()*5)+4;
  const remove = Math.floor(Math.random()*(total-1))+1;
  const result = total - remove;
  const emoji = COUNT_EMOJI[Math.floor(Math.random()*COUNT_EMOJI.length)];
  const kept = Array(total-remove).fill(emoji).join(" ");
  const crossed = `<span class="crossed">${Array(remove).fill(emoji).join(" ")}</span>`;
  let wrongs = shuffle([...Array(total+1).keys()].filter(x=>x!==result)).slice(0,3);
  const options = shuffle([result, ...wrongs]);

  stage.innerHTML = `<div class="prompt">Tinha ${total}, tiraram ${remove}. Quantos ficaram?</div>
    <div class="big-emoji-row">${kept} ${crossed}</div>
    <button class="tts-btn" onclick="speak('Tinha ${total}, tiraram ${remove}. Quantos ficaram?')">🔊</button>
    <div class="options-row" id="opts"></div>`;
  speak(`Tinha ${total}, tiraram ${remove}. Quantos ficaram?`);
  const opts = stage.querySelector("#opts");
  options.forEach(num=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.textContent = num;
    b.onclick = ()=> registerAnswer(num === result, b);
    opts.appendChild(b);
  });
}

/* --- Benjamin: Som Inicial (compara a LETRA inicial das palavras, não o
   fonema real — EF01LP09; a discriminação sonora de verdade fica com a
   atividade Pares Mínimos, que testa fonema via TTS) --- */
