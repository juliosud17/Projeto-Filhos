// Funcoes de renderizacao das atividades de Portugues (Benjamin, modulos 1-7) e da trilha simples do Joaquim.
function renderLetras(stage){
  // Nível só se aplica à versão leveled do Benjamin (letras_b); Joaquim usa o alfabeto todo
  const leveled = state.game === "letras_b";
  const lvl = leveled ? activityLevel.letras_b : 5;
  const cumulativePool = LETTERS.filter(l => (LETTER_LEVELS[l]||5) <= lvl);
  const target = leveled
    ? pickWeightedByLevel(LETTERS, lvl, "LETTERS")
    : pickFromPool("LETTERS_ALL", cumulativePool);
  const distractorPool = cumulativePool.filter(l=>l!==target);
  const distractors = distractorPool.length >= 3
    ? pickRandom(distractorPool, 3)
    : pickRandom(LETTERS.filter(l=>l!==target), 3);
  const options = shuffle([target, ...distractors]);

  if(leveled){
    // Benjamin (6 anos): reconhecimento pelo SOM, sem mostrar a letra escrita —
    // senão vira "achar a igual" visual, sem testar a associação som-letra (EF01LP10).
    stage.innerHTML = `<div class="prompt">Ouça e encontre a letra:</div>
      <button class="tts-btn" onclick="speak('${target}')">🔊</button>
      <div class="options-row" id="opts"></div>`;
  }else{
    // Joaquim (3 anos): ainda não associa som à letra — reconhecimento visual é a etapa certa.
    stage.innerHTML = `<div class="prompt">Encontre a letra:</div>
      <div class="big-word">${target}</div>
      <button class="tts-btn" onclick="speak('Encontre a letra ${target}')">🔊</button>
      <div class="options-row" id="opts"></div>`;
  }
  const opts = stage.querySelector("#opts");
  options.forEach(letter=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.textContent = letter;
    b.onclick = ()=> registerAnswer(letter === target, b);
    opts.appendChild(b);
  });
  speak(leveled ? ("Ouça e encontre a letra " + target) : ("Encontre a letra " + target));
}

/* --- Joaquim: Números Mágicos (quantidade -> número) --- */
function renderNumeros(stage){
  const n = Math.floor(Math.random()*10)+1;
  const emoji = COUNT_EMOJI[Math.floor(Math.random()*COUNT_EMOJI.length)];
  const row = Array(n).fill(emoji).join(" ");
  let wrongs = shuffle([...Array(10).keys()].map(x=>x+1).filter(x=>x!==n)).slice(0,3);
  const options = shuffle([n, ...wrongs]);

  const qWord = EMOJI_GENDER_FEM[emoji] ? "Quantas" : "Quantos";
  stage.innerHTML = `<div class="prompt">${qWord} ${emoji} você vê?</div>
    <div class="big-emoji-row">${row}</div>
    <button class="tts-btn" onclick="speak('${qWord} ${EMOJI_NAMES[emoji]||"itens"} você vê?')">🔊</button>
    <div class="options-row" id="opts"></div>`;
  speak(`${qWord} ${EMOJI_NAMES[emoji]||"itens"} você vê?`);
  const opts = stage.querySelector("#opts");
  options.forEach(num=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.textContent = num;
    b.onclick = ()=> registerAnswer(num === n, b);
    opts.appendChild(b);
  });
}

/* --- Joaquim: Conta Comigo (mesma mecânica com foco em contagem falada) --- */
function renderContar(stage){
  const n = Math.floor(Math.random()*8)+2;
  const emoji = COUNT_EMOJI[Math.floor(Math.random()*COUNT_EMOJI.length)];
  const row = Array(n).fill(emoji).join(" ");
  let wrongs = shuffle([...Array(10).keys()].map(x=>x+1).filter(x=>Math.abs(x-n)<=3 && x!==n)).slice(0,3);
  while(wrongs.length<3){
    const cand = Math.floor(Math.random()*10)+1;
    if(cand!==n && !wrongs.includes(cand)) wrongs.push(cand);
  }
  const options = shuffle([n, ...wrongs]);

  const artWord = EMOJI_GENDER_FEM[emoji] ? "as" : "os";
  stage.innerHTML = `<div class="prompt">Conte em voz alta e toque no número certo:</div>
    <div class="big-emoji-row">${row}</div>
    <button class="tts-btn" onclick="speak('Conte ${artWord} ${EMOJI_NAMES[emoji]||"itens"} e toque no número certo')">🔊</button>
    <div class="options-row" id="opts"></div>`;
  speak(`Conte ${artWord} ${EMOJI_NAMES[emoji]||"itens"} e toque no número certo`);
  const opts = stage.querySelector("#opts");
  options.forEach(num=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.textContent = num;
    b.onclick = ()=> registerAnswer(num === n, b);
    opts.appendChild(b);
  });
}

/* Remove acentos e espaços extras pra comparar o que a criança digitou —
   ela pode não ter acento fácil no teclado, isso não deve contar como erro. */
function normalizeTyped(v){
  return v.trim().toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/* --- Benjamin: Monte a Sílaba (nível 5 vira "Digite a Palavra" —
   em vez de clicar sílabas prontas, a criança escreve a palavra toda,
   reforçando EF01LP02 "escrever palavras de forma alfabética") --- */
function renderSilabas(stage){
  const lvl = activityLevel.silabas || 5;
  const item = pickWeightedByLevel(WORDS, lvl, "WORDS");
  if(lvl === 5){ return renderDigitePalavra(stage, item); }
  const correctTiles = item.syl;
  const otherWords = WORDS.filter(w=>w.word!==item.word);
  const distractorPool = shuffle(otherWords.flatMap(w=>w.syl)).filter(s=>!correctTiles.includes(s));
  const distractors = distractorPool.slice(0,2);
  const tiles = shuffle([...correctTiles, ...distractors]);

  const filled = new Array(correctTiles.length).fill(null);
  /* Piloto VACA (2026-08-17): só entra no fluxo de personagem+Lia+fonética
     quando o item sorteado tem `character` (hoje só VACA, de propósito --
     vertical slice, ver docs/DECISOES.md) e o Audio Manager está carregado.
     Qualquer outra palavra de WORDS continua exatamente no fluxo de TTS
     genérico de sempre, sem nenhuma mudança de comportamento. */
  const hasCharacter = !!(item.character && typeof AudioManager !== "undefined");

  stage.innerHTML = `${hasCharacter ? '<div id="character-intro-area"></div>' : ''}
    <div class="prompt">Monte a palavra:</div>
    <div style="font-size:60px;" id="silabas-visual">${hasCharacter ? '' : visual(item)}</div>
    <div class="syll-slots" id="slots"></div>
    <div class="options-row" id="opts"></div>`;

  const slotsEl = stage.querySelector("#slots");
  correctTiles.forEach((_,i)=>{
    const s = document.createElement("div");
    s.className = "slot";
    s.id = "slot"+i;
    s.textContent = "";
    slotsEl.appendChild(s);
  });

  const opts = stage.querySelector("#opts");
  const optionButtons = [];
  tiles.forEach(tile=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.textContent = tile;
    // Com personagem: opções ficam visíveis mas desabilitadas até a
    // instrução da Lia terminar (seção 17 da arquitetura) -- evita clique
    // de reflexo antes da criança entender o que fazer. Sem personagem:
    // comportamento de sempre, habilitado desde já.
    if(hasCharacter) b.disabled = true;
    b.onclick = ()=>{
      const nextIdx = filled.findIndex(x=>x===null);
      if(nextIdx === -1) return;
      filled[nextIdx] = tile;
      document.getElementById("slot"+nextIdx).textContent = tile;
      b.disabled = true;
      b.style.visibility = "hidden";
      if(filled.every(x=>x!==null)){
        const isCorrect = filled.join("") === correctTiles.join("");
        setTimeout(()=>{
          if(hasCharacter){
            registerAnswerWithCharacterFeedback(isCorrect, item);
          }else if(isCorrect){
            registerAnswer(true, null);
          }else{
            registerAnswer(false, null);
          }
          if(!isCorrect){
            filled.fill(null);
            correctTiles.forEach((_,i)=> document.getElementById("slot"+i).textContent = "");
            opts.querySelectorAll("button").forEach(bb=>{ bb.disabled=false; bb.style.visibility="visible"; });
          }
        }, 300);
      }
    };
    opts.appendChild(b);
    optionButtons.push(b);
  });

  if(hasCharacter){
    runWordIntro(stage, item, optionButtons);
  }else{
    speak("Monte a palavra " + item.word);
  }
}

/* --- Piloto VACA: personagem em vídeo + voz da Lia + fonética, 2026-08-17,
   orquestração por Promise/async-await desde a rodada 2 (mesmo dia, ver
   docs/DECISOES.md) --- Ver docs/audio/MEDIA_GUIDELINES.md ("Orquestração
   de cena") e docs/characters/CHARACTER_BIBLE.md. */

/* Vídeo completo do personagem TODA vez que ele aparecer, mesmo repetindo
   na mesma sessão (decisão do Júlio em 2026-08-17, revertendo a redução
   original do piloto: o vídeo prende a atenção da criança, e por isso não
   deve ser pulado -- ver docs/DECISOES.md). Fica registrado quem já foi
   visto (state.characterIntroSeen) só pra eventual uso futuro, mas hoje
   isso NÃO pula mais o vídeo.
   Escrita como uma sequência await legível -- render -> vídeo -> instrução
   da Lia -> libera opções -- em vez de callbacks aninhados;
   playCharacterIntro/AudioManager.queueVoice (js/audio-manager.js) fazem
   todo o trabalho pesado (incl. fallback de autoplay/arquivo ausente),
   aqui só orquestra a ORDEM. */
async function runWordIntro(stage, item, optionButtons){
  state.characterIntroSeen = state.characterIntroSeen || new Set();
  state.characterIntroSeen.add(item.character);

  const introArea = stage.querySelector("#character-intro-area");

  await playCharacterIntro(introArea, item.character, visual(item));

  // Instrução da Lia -- nunca cita a palavra-alvo (regra pedagógica
  // fundamental, seção 26 da arquitetura). Só ao terminar (com sucesso OU
  // via fallback de TTS) é que as opções são liberadas.
  await AudioManager.queueVoice([
    { url: mediaLiaVoice("comuns", "monte-o-nome"),
      fallbackText: "Olha quem chegou por aqui! Observe com atenção... e monte o nome dela!" }
  ]);
  optionButtons.forEach(b=> b.disabled = false);
}

/* Acerto/erro do piloto: Lia (personalidade/encorajamento) e fonética
   (pronúncia pedagógica oficial) tocam como arquivos SEPARADOS, nunca a
   mesma frase da Lia contendo a pronúncia embutida -- assim dá pra revisar
   ou trocar a pronúncia sem regenerar a fala emocional (ajuste pedido pelo
   Júlio na aprovação da arquitetura, registrado em docs/DECISOES.md).
   `async` desde a rodada 2 do piloto: cada trecho de fala é `await`ado (via
   pronounceAndHighlight, js/audio-manager.js) e sincronizado com um
   destaque visual no elemento correspondente -- SLOT por sílaba, depois os
   slots inteiros pra palavra completa. registerAnswer() só é chamado DEPOIS
   que todo o áudio já tocou de verdade -- nextRoundDelay deixa de ser um
   chute pra "cobrir" a fala (era 4800ms) e vira só o respiro final. */
async function registerAnswerWithCharacterFeedback(isCorrect, item){
  if(isCorrect){
    // Canal de SFX é independente -- dispara e não espera nada, pode
    // coexistir com o início da voz (regra da arquitetura aprovada).
    AudioManager.playSfx(mediaSfx("feedback", "acerto"), { fallbackBeep: "ok" });
    await AudioManager.playVoice({ url: mediaLiaVoice("comuns", "acerto-01"), fallbackText: "Isso! Muito bem!" });
    for(let i = 0; i < item.syl.length; i++){
      await pronounceAndHighlight(document.getElementById("slot" + i),
        { url: mediaFonetica("silaba", item.syl[i]), fallbackText: item.syl[i] });
    }
    await pronounceAndHighlight(document.getElementById("slots"),
      { url: mediaFonetica("palavra", item.word), fallbackText: item.word });
    registerAnswer(true, null, { skipBeep: true, nextRoundDelay: 700 });
  }else{
    // Slots já foram limpos por renderSilabas nesse momento (não espera o
    // áudio pra deixar a criança tentar de novo -- nunca trava por erro).
    // O destaque da dica vai no BOTÃO de opção com a 1ª sílaba certa, que
    // continua visível/clicável na tela.
    const hintBtn = Array.from(document.querySelectorAll("#opts .option-btn"))
      .find(b => b.textContent === item.syl[0]);
    await AudioManager.playVoice({ url: mediaLiaVoice("comuns", "dica-vamos-ouvir-o-comeco"), fallbackText: "Quase! Vamos ouvir o começo?" });
    await pronounceAndHighlight(hintBtn, { url: mediaFonetica("silaba", item.syl[0]), fallbackText: item.syl[0] });
    registerAnswer(false, null);
  }
}

function renderDigitePalavra(stage, item){
  stage.innerHTML = `<div class="prompt">Digite a palavra:</div>
    <div style="font-size:60px;">${visual(item)}</div>
    <button class="tts-btn" onclick="speak('${item.word}')">🔊</button>
    <input type="text" class="type-input" id="typed-word" autocomplete="off" autocapitalize="characters" placeholder="digite aqui">
    <button class="primary-btn" id="confirm-typed">Confirmar</button>`;
  const input = stage.querySelector("#typed-word");
  const confirmBtn = stage.querySelector("#confirm-typed");
  const check = ()=>{
    if(!confirmBtn.onclick) return; // já respondido nesta rodada
    const val = normalizeTyped(input.value);
    const isCorrect = val === item.word;
    if(isCorrect){
      confirmBtn.onclick = null;
      input.disabled = true;
      registerAnswer(true, null);
    }else{
      registerAnswer(false, null);
      input.value = "";
      input.focus();
    }
  };
  confirmBtn.onclick = check;
  input.addEventListener("keydown", e=>{ if(e.key === "Enter") check(); });
  input.focus();
  speak("Digite a palavra " + item.word);
}

/* --- Benjamin: Leitura Rápida (Módulo 2 — mesmo motor de nível 1-5 do Módulo 1,
   agora priorizando palavras do nível atual (65%) com revisão dos níveis
   anteriores (35%), em vez de sortear entre as 53 palavras do banco inteiro
   direto no nível 1. Distratores também cumulativos até o nível atual, pra não
   misturar palavra de 1 sílaba com opção de 3 sílabas logo de cara. --- */
function renderLeitura(stage){
  const lvl = activityLevel.leitura || 5;
  const item = pickWeightedByLevel(WORDS, lvl, "WORDS");
  const distractorPool = WORDS.filter(w=>w.word!==item.word && w.level <= lvl);
  const others = pickRandom(distractorPool.length >= 2 ? distractorPool : WORDS.filter(w=>w.word!==item.word), 2);
  const options = shuffle([item, ...others]);

  stage.innerHTML = `<div class="prompt">Leia a palavra:</div>
    <div class="big-word">${item.word}</div>
    <button class="tts-btn" onclick="speak('${item.word}')">🔊</button>
    <div class="options-row" id="opts"></div>`;
  // fala só a instrução, sem revelar a palavra em voz — senão vira ditado, não leitura
  speak("Leia a palavra e toque na figura certa");
  const opts = stage.querySelector("#opts");
  options.forEach(o=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.style.fontSize = "40px";
    b.innerHTML = visual(o);
    b.onclick = ()=> registerAnswer(o.word === item.word, b);
    opts.appendChild(b);
  });
}

/* --- Benjamin: Leia a Frase (Módulo 2, 2ª atividade) — ver comentário do
   PHRASES/MODULE2_ACTIVITIES lá em cima pra escopo e habilidades cobertas. --- */
function renderFrasesLeitura(stage){
  const lvl = activityLevel.frases_leitura || 5;
  const phrase = pickWeightedByLevel(PHRASES, lvl, "PHRASES");
  const sentence = phrase.words.join(" ");
  const askCount = Math.random() < 0.5;

  if(askCount){
    // EF01LP12 — separação de palavras por espaço em branco
    const n = phrase.words.length;
    let wrongs = shuffle([...Array(8).keys()].map(x=>x+1).filter(x=>x!==n)).slice(0,3);
    const options = shuffle([n, ...wrongs]);
    stage.innerHTML = `<div class="prompt">Quantas palavras tem essa frase?</div>
      <div class="big-word" style="font-size:32px;">${sentence}</div>
      <button class="tts-btn" onclick="speak('${sentence}')">🔊</button>
      <div class="options-row" id="opts"></div>`;
    speak(`Quantas palavras tem essa frase? ${sentence}`);
    const opts = stage.querySelector("#opts");
    options.forEach(num=>{
      const b = document.createElement("button");
      b.className = "option-btn";
      b.textContent = num;
      b.onclick = ()=> registerAnswer(num === n, b);
      opts.appendChild(b);
    });
  }else{
    // EF01LP01 — direção da leitura (primeira/última palavra)
    const askFirst = Math.random() < 0.5;
    const target = askFirst ? phrase.words[0] : phrase.words[phrase.words.length - 1];
    // botões únicos por palavra — se a frase repetir uma palavra (ex.: "O"),
    // um botão só representa as duas, sem ambiguidade na resposta certa
    const uniqueWords = [...new Set(phrase.words)];
    stage.innerHTML = `<div class="prompt">Qual é a ${askFirst ? "PRIMEIRA" : "ÚLTIMA"} palavra da frase?</div>
      <div class="big-word" style="font-size:32px;">${sentence}</div>
      <button class="tts-btn" onclick="speak('${sentence}')">🔊</button>
      <div class="options-row" id="opts"></div>`;
    speak(`Qual é a ${askFirst ? "primeira" : "última"} palavra da frase? ${sentence}`);
    const opts = stage.querySelector("#opts");
    shuffle(uniqueWords).forEach(w=>{
      const b = document.createElement("button");
      b.className = "option-btn";
      b.textContent = w;
      b.onclick = ()=> registerAnswer(w === target, b);
      opts.appendChild(b);
    });
  }
}

/* --- Benjamin: Escrita Certa (Módulo 2, 3ª atividade — EF01LP03).
   A imagem fica visível o tempo todo: a criança não precisa decifrar a
   palavra do zero, só comparar as duas grafias mostradas e apontar qual é a
   convencional. O nome certo da palavra é falado como parte do enunciado
   (contexto necessário, não spoiler — o teste é sobre a GRAFIA, não sobre
   adivinhar a palavra). --- */
function renderEscritaCerta(stage){
  const lvl = activityLevel.escrita_certa || 5;
  const pair = pickWeightedByLevel(WRITING_PAIRS, lvl, "WRITINGPAIRS");
  const options = shuffle([pair.correct, pair.wrong]);

  stage.innerHTML = `<div class="prompt">Qual das duas está escrita do jeito CERTO?</div>
    <div style="font-size:60px; margin:6px 0;">${visual(pair)}</div>
    <button class="tts-btn" onclick="speak('${pair.correct}')">🔊</button>
    <div class="options-row" id="opts"></div>`;
  speak(`Qual das duas está escrita do jeito certo: ${pair.correct}?`);
  const opts = stage.querySelector("#opts");
  options.forEach(w=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.style.fontSize = "28px";
    b.textContent = w;
    b.onclick = ()=> registerAnswer(w === pair.correct, b);
    opts.appendChild(b);
  });
}

/* Guarda o texto completo da parlenda atual pro botão "ouvir de novo" —
   evita ter que escapar aspas/pontuação da parlenda dentro de um atributo
   onclick inline (frases têm vírgula, ponto, etc.). */
let currentParlendaText = "";

/* --- Benjamin: Parlendas e Trava-Línguas (Módulo 3, EF01LP16 — com exposição
   a EF01LP19 via botão de "ouvir e recitar junto", sem pontuar recitação:
   ver limitação documentada no índice de currículo). --- */
function renderParlendas(stage){
  const lvl = activityLevel.parlendas || 5;
  const item = pickWeightedByLevel(PARLENDAS, lvl, "PARLENDAS");
  currentParlendaText = item.lines.join(" ");
  // com só 1 verso (nível 1), "qual é a primeira/última linha" não tem opção
  // nenhuma pra escolher (só existe 1 botão) — força a pergunta de contagem
  // nesse caso, que continua válida mesmo com 1 verso só
  const askCount = item.lines.length < 2 || Math.random() < 0.5;

  if(askCount){
    // EF01LP16 — compreender a estrutura de uma parlenda (quantos versos)
    const n = item.lines.length;
    let wrongs = shuffle([...Array(6).keys()].map(x=>x+1).filter(x=>x!==n)).slice(0,3);
    const options = shuffle([n, ...wrongs]);
    stage.innerHTML = `<div class="prompt">Quantos versos tem essa parlenda?</div>
      <div class="big-word" style="font-size:20px; line-height:1.7;">${item.lines.join("<br>")}</div>
      <button class="tts-btn" onclick="speak(currentParlendaText)">🔊 Ouvir e recitar junto</button>
      <div class="options-row" id="opts"></div>`;
    speak(`Quantos versos tem essa parlenda? ${currentParlendaText}`);
    const opts = stage.querySelector("#opts");
    options.forEach(num=>{
      const b = document.createElement("button");
      b.className = "option-btn";
      b.textContent = num;
      b.onclick = ()=> registerAnswer(num === n, b);
      opts.appendChild(b);
    });
  }else{
    // EF01LP01/16 — direção da leitura aplicada a um texto de verdade, não só uma frase solta
    const askFirst = Math.random() < 0.5;
    const target = askFirst ? item.lines[0] : item.lines[item.lines.length - 1];
    stage.innerHTML = `<div class="prompt">Qual é o ${askFirst ? "PRIMEIRO" : "ÚLTIMO"} verso da parlenda?</div>
      <div class="big-word" style="font-size:20px; line-height:1.7;">${item.lines.join("<br>")}</div>
      <button class="tts-btn" onclick="speak(currentParlendaText)">🔊 Ouvir e recitar junto</button>
      <div class="options-row" id="opts" style="flex-direction:column; align-items:stretch;"></div>`;
    speak(`Qual é o ${askFirst ? "primeiro" : "último"} verso da parlenda? ${currentParlendaText}`);
    const opts = stage.querySelector("#opts");
    shuffle(item.lines).forEach(line=>{
      const b = document.createElement("button");
      b.className = "option-btn";
      b.style.fontSize = "16px";
      b.textContent = line;
      b.onclick = ()=> registerAnswer(line === target, b);
      opts.appendChild(b);
    });
  }
}

/* --- Benjamin: Som do Meio e do Fim (Módulo 3, EF01LP13) — consciência
   silábica por POSIÇÃO da sílaba (meio ou fim), não pelo som da palavra
   inteira (isso já é papel da Rimas, no Módulo 1). Mesmo padrão de
   grupo+distratores da Rimas, mas com banco próprio (MEDIAL_FINAL_GROUPS). --- */
function renderSilabaMeioFim(stage){
  const lvl = activityLevel.silaba_meio_fim || 5;
  const group = pickWeightedByLevel(MEDIAL_FINAL_GROUPS, lvl, "SYLPOS");
  const picks = shuffle(group.words).slice(0,2);
  const target = picks[0], correct = picks[1];
  const usedVisuals = new Set([visual(target), visual(correct)]);
  // dedupe por visual, não só filtra o target/correto: MACACO (por exemplo)
  // aparece em 2 grupos diferentes (CO final e CA medial), então o flatMap
  // abaixo podia conter a MESMA palavra duas vezes — sem dedupe, pickRandom
  // podia sortear ela duas vezes e gerar duas opções idênticas na tela.
  const otherWords = [];
  MEDIAL_FINAL_GROUPS.filter(g=>g!==group).flatMap(g=>g.words).forEach(w=>{
    const v = visual(w);
    if(!usedVisuals.has(v)){ usedVisuals.add(v); otherWords.push(w); }
  });
  const distractors = pickRandom(otherWords, 2);
  const options = shuffle([correct, ...distractors]);
  const posLabel = group.type === "medial" ? "do MEIO" : "do FIM";

  stage.innerHTML = `<div class="prompt">Qual palavra tem a mesma sílaba ${posLabel} que <b>${target.word}</b> ${visual(target)}?</div>
    <button class="tts-btn" onclick="speak('${target.word}')">🔊</button>
    <div class="options-row" id="opts"></div>`;
  const opts = stage.querySelector("#opts");
  options.forEach(o=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.style.fontSize = "40px";
    b.innerHTML = visual(o);
    b.onclick = ()=> registerAnswer(o.word === correct.word, b);
    opts.appendChild(b);
  });
  speak("Qual palavra tem a mesma sílaba " + posLabel.toLowerCase() + " que " + target.word);
}

/* --- Benjamin: Pontuação Certa (Módulo 3, EF01LP14). --- */
function renderPontuacao(stage){
  const lvl = activityLevel.pontuacao || 5;
  const item = pickWeightedByLevel(PUNCTUATION_SENTENCES, lvl, "PUNCT");
  const options = shuffle([".", "?", "!"]);

  stage.innerHTML = `<div class="prompt">Qual pontuação combina com essa frase?</div>
    <div class="big-word" style="font-size:26px;">${item.text} ___</div>
    <button class="tts-btn" onclick="speak('${item.text}')">🔊</button>
    <div class="options-row" id="opts"></div>`;
  speak(`Qual pontuação combina com essa frase? ${item.text}`);
  const opts = stage.querySelector("#opts");
  options.forEach(p=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.style.fontSize = "40px";
    b.textContent = p;
    b.onclick = ()=> registerAnswer(p === item.correct, b);
    opts.appendChild(b);
  });
}

/* Mecânica compartilhada de "digitar a resposta" usada pelas 3 atividades do
   Módulo 4 — mesmo padrão testado do Digite a Palavra (Módulo 1), mas
   parametrizado pra aceitar qualquer prompt/conteúdo/resposta em vez de só
   uma palavra do banco WORDS. Aceita minúscula e sem acento (normalizeTyped),
   igual ao Digite a Palavra. */
function renderTypedAnswer(stage, opts){
  stage.innerHTML = `<div class="prompt">${opts.promptHtml}</div>
    ${opts.contentHtml}
    <input type="text" class="type-input" id="typed-word" autocomplete="off" autocapitalize="characters" placeholder="digite aqui">
    <button class="primary-btn" id="confirm-typed">Confirmar</button>`;
  const input = stage.querySelector("#typed-word");
  const confirmBtn = stage.querySelector("#confirm-typed");
  const check = ()=>{
    if(!confirmBtn.onclick) return; // já respondido nesta rodada
    const val = normalizeTyped(input.value);
    const isCorrect = val === normalizeTyped(opts.answer);
    if(isCorrect){
      confirmBtn.onclick = null;
      input.disabled = true;
      registerAnswer(true, null);
    }else{
      registerAnswer(false, null);
      input.value = "";
      input.focus();
    }
  };
  confirmBtn.onclick = check;
  input.addEventListener("keydown", e=>{ if(e.key === "Enter") check(); });
  input.focus();
  speak(opts.spokenText);
}

/* --- Benjamin: Complete a Lista (Módulo 4, EF01LP17). --- */
function renderListaCompleta(stage){
  const lvl = activityLevel.lista_completa || 5;
  const item = pickWeightedByLevel(LISTS, lvl, "LISTS");
  const itemsText = item.items.join(", ");
  renderTypedAnswer(stage, {
    promptHtml: `${item.title} — complete a lista:`,
    contentHtml: `<div class="big-word" style="font-size:24px;">${itemsText}</div>
      <div style="font-size:44px;">${item.hint}</div>`,
    answer: item.answer,
    spokenText: `${item.title}. Complete a lista: ${itemsText}`
  });
}

/* --- Benjamin: Texto do Dia a Dia (Módulo 4, EF01LP17/21). --- */
function renderTextoFuncional(stage){
  const lvl = activityLevel.texto_funcional || 5;
  const item = pickWeightedByLevel(FUNCTIONAL_TEXTS, lvl, "FUNCTEXT");
  renderTypedAnswer(stage, {
    promptHtml: "Complete a palavra que falta:",
    contentHtml: `<div class="big-word" style="font-size:22px;">${item.text}</div>
      <div style="font-size:44px;">${item.hint}</div>`,
    answer: item.answer,
    spokenText: "Complete a palavra que falta: " + item.text
  });
}

/* --- Benjamin: Parlenda de Cor (Módulo 4, EF01LP18) — reaproveita o banco
   PARLENDAS do Módulo 3, apaga a última palavra de um verso sorteado e pede
   pra escrever de memória, depois de ouvir a parlenda inteira. --- */
function renderParlendaDeCor(stage){
  const lvl = activityLevel.parlenda_de_cor || 5;
  const item = pickWeightedByLevel(PARLENDAS, lvl, "PARLENDAS");
  const lineIdx = Math.floor(Math.random() * item.lines.length);
  const line = item.lines[lineIdx];
  const wordsInLine = line.replace(/[.,!?]/g, "").split(" ");
  const blankWord = wordsInLine[wordsInLine.length - 1];
  const idx = line.lastIndexOf(blankWord);
  const blankedLine = line.slice(0, idx) + "___" + line.slice(idx + blankWord.length);
  const displayLines = item.lines.map((l, i) => i === lineIdx ? blankedLine : l);
  currentParlendaText = item.lines.join(" ");
  renderTypedAnswer(stage, {
    promptHtml: "Ouça a parlenda toda e escreva a palavra que falta:",
    contentHtml: `<div class="big-word" style="font-size:19px; line-height:1.7;">${displayLines.join("<br>")}</div>
      <button class="tts-btn" onclick="speak(currentParlendaText)">🔊 Ouvir de novo</button>`,
    answer: blankWord,
    spokenText: "Ouça a parlenda toda e escreva a palavra que falta: " + currentParlendaText
  });
}

/* --- Benjamin: Sinônimos e Antônimos (Módulo 5, EF01LP15). --- */
function renderSinonimosAntonimos(stage){
  const lvl = activityLevel.sinonimos_antonimos || 5;
  const item = pickWeightedByLevel(WORD_RELATIONS, lvl, "WORDREL");
  const options = shuffle([item.correct, ...item.wrongs]);

  stage.innerHTML = `<div class="prompt">Qual é o ${item.type} de <b>${item.word}</b>?</div>
    <button class="tts-btn" onclick="speak('${item.word}')">🔊</button>
    <div class="options-row" id="opts"></div>`;
  speak(`Qual é o ${item.type} de ${item.word}?`);
  const opts = stage.querySelector("#opts");
  options.forEach(w=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.style.fontSize = "26px";
    b.textContent = w;
    b.onclick = ()=> registerAnswer(w === item.correct, b);
    opts.appendChild(b);
  });
}

/* --- Benjamin: Qual é o Gênero? (Módulo 5, EF01LP20). --- */
function renderGeneroTextual(stage){
  const lvl = activityLevel.genero_textual || 5;
  const item = pickWeightedByLevel(TEXT_GENRES, lvl, "GENRE");
  const options = shuffle([item.genre, ...item.wrongs]);

  stage.innerHTML = `<div class="prompt">Que tipo de texto é esse?</div>
    <div class="big-word" style="font-size:20px;">"${item.excerpt}"</div>
    <button class="tts-btn" onclick="speak('${item.excerpt}')">🔊</button>
    <div class="options-row" id="opts"></div>`;
  speak(`Que tipo de texto é esse? ${item.excerpt}`);
  const opts = stage.querySelector("#opts");
  options.forEach(g=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.style.fontSize = "20px";
    b.textContent = g;
    b.onclick = ()=> registerAnswer(g === item.genre, b);
    opts.appendChild(b);
  });
}

/* Guarda o texto completo da curiosidade atual pro botão "ouvir de novo" —
   mesmo motivo do currentParlendaText: evita escapar aspas/pontuação dentro
   de um atributo onclick inline. */
let currentCuriosityText = "";

/* --- Benjamin: Ler e Responder (Módulo 5, EF01LP22/24) — primeira atividade
   do app que testa compreensão de texto de verdade (interpretar o que foi
   lido), não só decodificação/reconhecimento. --- */
function renderLerResponder(stage){
  const lvl = activityLevel.ler_responder || 5;
  const item = pickWeightedByLevel(CURIOSITIES, lvl, "CURIOS");
  currentCuriosityText = item.text;
  const options = shuffle([item.correct, ...item.wrongs]);

  stage.innerHTML = `<div class="prompt">Leia a curiosidade e responda:</div>
    <div class="big-word" style="font-size:18px; line-height:1.6;">${item.text}</div>
    <div class="prompt" style="margin-top:10px; font-size:16px;">${item.question}</div>
    <button class="tts-btn" onclick="speak(currentCuriosityText)">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(item.text + " " + item.question);
  const opts = stage.querySelector("#opts");
  options.forEach(a=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.style.fontSize = "18px";
    b.textContent = a;
    b.onclick = ()=> registerAnswer(a === item.correct, b);
    opts.appendChild(b);
  });
}

/* Guarda o texto da história/curiosidade atual pro botão "ouvir de novo" —
   mesmo motivo do currentParlendaText/currentCuriosityText: evita escapar
   aspas/pontuação dentro de um atributo onclick inline. */
let currentStoryText = "";

/* --- Benjamin: Elementos da História (Módulo 6, EF01LP26). --- */
function renderElementosHistoria(stage){
  const lvl = activityLevel.elementos_historia || 5;
  const story = pickWeightedByLevel(MINI_STORIES, lvl, "STORIES");
  const fullText = story.events.join(" ");
  const questionType = ["quem","onde","quando"][Math.floor(Math.random()*3)];
  let questionText, correct, wrongs;
  if(questionType === "quem"){
    questionText = "Quem é o personagem dessa história?";
    correct = story.character; wrongs = story.wrongCharacters;
  }else if(questionType === "onde"){
    questionText = "Onde essa história aconteceu?";
    correct = story.place; wrongs = story.wrongPlaces;
  }else{
    questionText = "Quando essa história aconteceu?";
    correct = story.time; wrongs = story.wrongTimes;
  }
  const options = shuffle([correct, ...wrongs]);
  currentStoryText = fullText + " " + questionText;

  stage.innerHTML = `<div class="prompt">Leia a história:</div>
    <div class="big-word" style="font-size:17px; line-height:1.6;">${fullText}</div>
    <div class="prompt" style="margin-top:10px; font-size:16px;">${questionText}</div>
    <button class="tts-btn" onclick="speak(currentStoryText)">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(currentStoryText);
  const opts = stage.querySelector("#opts");
  options.forEach(o=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.style.fontSize = "18px";
    b.textContent = o;
    b.onclick = ()=> registerAnswer(o === correct, b);
    opts.appendChild(b);
  });
}

/* --- Benjamin: Reconte a História (Módulo 6, EF01LP25) — primeira atividade
   do app com mecânica de ORDENAR: a criança toca os 3 acontecimentos na
   sequência certa (não escolhe entre opções soltas de uma vez só). Se errar
   a ordem final, reabilita os botões pra tentar de novo (só a 1ª tentativa
   conta pro domínio, igual ao resto do app). --- */
function renderReconteHistoria(stage){
  const lvl = activityLevel.reconte_historia || 5;
  const story = pickWeightedByLevel(MINI_STORIES, lvl, "STORIES");
  const shuffledEvents = shuffle(story.events);
  let selectedOrder = [];
  currentStoryText = story.events.join(" ");

  stage.innerHTML = `<div class="prompt">Toque nos acontecimentos na ORDEM certa da história:</div>
    <button class="tts-btn" onclick="speak(currentStoryText)">🔊 Ouvir a história</button>
    <div class="options-row" id="opts" style="flex-direction:column; align-items:stretch;"></div>
    <div id="order-feedback" style="margin-top:8px; font-weight:700; color:var(--purple-dark);"></div>`;
  speak("Toque nos acontecimentos na ordem certa da história. " + currentStoryText);
  const opts = stage.querySelector("#opts");
  const feedback = stage.querySelector("#order-feedback");

  function resetSelection(){
    selectedOrder = [];
    Array.from(opts.children).forEach(btn=>{
      btn.disabled = false;
      btn.style.opacity = "1";
      btn.style.borderColor = "";
    });
    feedback.textContent = "";
  }

  shuffledEvents.forEach(ev=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.style.fontSize = "15px";
    b.textContent = ev;
    b.onclick = ()=>{
      if(b.disabled) return;
      selectedOrder.push(ev);
      b.disabled = true;
      b.style.opacity = "0.5";
      b.style.borderColor = "var(--purple-dark)";
      feedback.textContent = `${selectedOrder.length}ª escolhida de ${story.events.length}`;
      if(selectedOrder.length === story.events.length){
        const isCorrect = selectedOrder.every((e,i)=> e === story.events[i]);
        registerAnswer(isCorrect, null);
        if(!isCorrect) resetSelection();
      }
    };
    opts.appendChild(b);
  });
}

/* --- Benjamin: Invente o Final (Módulo 6, EF01LP25/26) — final coerente vs.
   2 finais propositalmente absurdos, não apenas "diferentes". --- */
function renderInventeFinal(stage){
  const lvl = activityLevel.invente_final || 5;
  const item = pickWeightedByLevel(STORY_ENDINGS, lvl, "ENDINGS");
  const options = shuffle([item.correctEnding, ...item.wrongEndings]);
  currentStoryText = item.setup;

  stage.innerHTML = `<div class="prompt">Leia o começo da história e escolha o final que faz mais sentido:</div>
    <div class="big-word" style="font-size:18px; line-height:1.6;">${item.setup}</div>
    <button class="tts-btn" onclick="speak(currentStoryText)">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts" style="flex-direction:column; align-items:stretch;"></div>`;
  speak("Leia o começo da história e escolha o final que faz mais sentido. " + item.setup);
  const opts = stage.querySelector("#opts");
  options.forEach(end=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.style.fontSize = "16px";
    b.textContent = end;
    b.onclick = ()=> registerAnswer(end === item.correctEnding, b);
    opts.appendChild(b);
  });
}

/* --- Benjamin: Substantivo ou Verbo? (Módulo 7) — reconhecimento pela
   FUNÇÃO (nome de algo vs. ação), sem termos gramaticais formais. --- */
function renderSubstantivoVerbo(stage){
  const lvl = activityLevel.substantivo_verbo || 5;
  const item = pickWeightedByLevel(WORD_CLASS, lvl, "WORDCLASS");
  const options = shuffle([item.correct, ...item.wrongs]);
  const spoken = `A palavra ${item.word} é o NOME de algo ou é uma AÇÃO?`;

  stage.innerHTML = `<div class="prompt">É o NOME de algo ou é uma AÇÃO?</div>
    <div class="big-word">${item.word}</div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak(spoken);
  const opts = stage.querySelector("#opts");
  options.forEach(o=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.style.fontSize = "18px";
    b.textContent = o;
    b.onclick = ()=> registerAnswer(o === item.correct, b);
    opts.appendChild(b);
  });
}

/* --- Benjamin: Que Ação Combina? (Módulo 7) — verbo de ação certo pra cada
   personagem, reforçando "verbo = o que o personagem FAZ". --- */
function renderAcaoCombina(stage){
  const lvl = activityLevel.acao_combina || 5;
  const item = pickWeightedByLevel(ACTION_MATCHES, lvl, "ACTIONS");
  const options = shuffle([item.correct, ...item.wrongs]);
  const spoken = `${item.subject}... o que ele faz?`;

  stage.innerHTML = `<div class="prompt">Que ação combina com ${item.subject}?</div>
    <div class="big-word" style="font-size:22px;">${item.subject}</div>
    <button class="tts-btn" onclick="speak('${spoken.replace(/'/g,"\\'")}')">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts" style="flex-direction:column; align-items:stretch;"></div>`;
  speak(`Que ação combina com ${item.subject}?`);
  const opts = stage.querySelector("#opts");
  options.forEach(o=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.style.fontSize = "16px";
    b.textContent = o;
    b.onclick = ()=> registerAnswer(o === item.correct, b);
    opts.appendChild(b);
  });
}

/* --- Benjamin: Pontuação no Textinho (Módulo 7, EF01LP14 aprofundado) —
   mini-texto de 2 frases; a criança escolhe ponto final ou de interrogação
   pro fim da 2ª frase, indo além da frase isolada do Módulo 3. --- */
function renderPontuacaoTexto(stage){
  const lvl = activityLevel.pontuacao_texto || 5;
  const item = pickWeightedByLevel(TEXT_PUNCT, lvl, "TEXTPUNCT");
  const options = shuffle([item.correct, ...item.wrongs]);
  currentStoryText = item.text1 + " " + item.text2 + (item.correct === "?" ? "?" : ".");

  stage.innerHTML = `<div class="prompt">Escolha a pontuação certa pra 2ª frase:</div>
    <div class="big-word" style="font-size:17px; line-height:1.6;">${item.text1}<br>${item.text2}___</div>
    <button class="tts-btn" onclick="speak(currentStoryText)">🔊 Ouvir de novo</button>
    <div class="options-row" id="opts"></div>`;
  speak("Escolha a pontuação certa pra segunda frase. " + currentStoryText);
  const opts = stage.querySelector("#opts");
  options.forEach(o=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.style.fontSize = "24px";
    b.textContent = o;
    b.onclick = ()=> registerAnswer(o === item.correct, b);
    opts.appendChild(b);
  });
}

/* --- Benjamin (Matemática M1): Quantos Tem? (EF01MA01) — alterna entre
   pergunta de QUANTIDADE (número como indicador de quantidade) e pergunta de
   ORDEM/posição numa fila (número como indicador de ordem), as duas metades
   da própria habilidade — sem isso a atividade só testaria "quantidade",
   nunca o lado de "ordem" que a habilidade também pede. Totalmente
   generativa: sorteia emoji + quantidade dentro da faixa do nível a cada
   rodada, não usa banco fixo. */

// --- Atividades do Modulo 1 adicionadas depois (Som Inicial, Pares Minimos, Rimas, Troca-Letra, Maiuscula/Minuscula) ---
function renderComInicial(stage){
  const lvl = activityLevel.cominicial || 5;
  // pool cumulativo com mínimo de nível 2 para garantir pares de letra suficientes
  const pool = WORDS.filter(w=>w.level <= Math.max(2, lvl));
  const byLetter = {};
  pool.forEach(w=>{
    const L = w.word[0];
    (byLetter[L] = byLetter[L] || []).push(w);
  });
  // prioriza letras que têm pelo menos 1 palavra do nível atual (não só revisão de níveis fáceis)
  const groupHasCurrentTier = l => byLetter[l].some(w=>w.level===lvl);
  let eligibleAll = Object.keys(byLetter).filter(l => byLetter[l].length >= 2 && !state.usedSomLetters.has(l));
  let eligible = eligibleAll.filter(groupHasCurrentTier);
  if(eligible.length === 0 || Math.random() >= 0.65) eligible = eligibleAll;
  if(eligible.length === 0){
    state.usedSomLetters.clear();
    eligible = Object.keys(byLetter).filter(l => byLetter[l].length >= 2);
  }
  const letter = eligible[Math.floor(Math.random()*eligible.length)];
  state.usedSomLetters.add(letter);
  const pair = shuffle(byLetter[letter]).slice(0,2);
  const target = pair[0], correct = pair[1];
  const distractors = pickRandom(pool.filter(w=>w.word[0]!==letter), 2);
  const options = shuffle([correct, ...distractors]);

  stage.innerHTML = `<div class="prompt">Qual palavra começa com a mesma LETRA de <b>${target.word}</b> ${visual(target)}?</div>
    <button class="tts-btn" onclick="speak('${target.word}')">🔊</button>
    <div class="options-row" id="opts"></div>`;
  const opts = stage.querySelector("#opts");
  options.forEach(o=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.style.fontSize = "40px";
    b.innerHTML = visual(o);
    b.onclick = ()=> registerAnswer(o.word === correct.word, b);
    opts.appendChild(b);
  });
  speak("Qual palavra começa com a mesma letra de " + target.word);
}

/* --- Benjamin: Pares Mínimos (discriminação sonora real por fonema, via TTS) --- */
function renderParesMinimos(stage){
  const lvl = activityLevel.pares_minimos || 5;
  const pair = pickWeightedByLevel(MIN_PAIRS, lvl, "MINPAIRS");
  const target = Math.random() < 0.5 ? pair.a : pair.b;
  const other = (target === pair.a) ? pair.b : pair.a;
  const options = shuffle([target, other]);

  stage.innerHTML = `<div class="prompt">Ouça com atenção. Qual é a palavra?</div>
    <button class="tts-btn" onclick="speak('${target.word}')">🔊</button>
    <div class="options-row" id="opts"></div>`;
  const opts = stage.querySelector("#opts");
  options.forEach(o=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.style.fontSize = "40px";
    b.innerHTML = visual(o);
    b.onclick = ()=> registerAnswer(o.word === target.word, b);
    opts.appendChild(b);
  });
  speak("Ouça com atenção. Qual é a palavra? " + target.word);
}

/* --- Benjamin: Rimas (mesmo som final, não mesma letra) --- */
function renderRimas(stage){
  const lvl = activityLevel.rimas || 5;
  const group = pickWeightedByLevel(RHYME_GROUPS, lvl, "RHYME");
  const picks = shuffle(group.words).slice(0,2);
  const target = picks[0], correct = picks[1];
  // exclui emojis já em uso (target/correto) do pool de distratores — palavras
  // diferentes podem usar emoji parecido/igual (ex.: GATINHO e GATO), e isso
  // deixaria duas opções visualmente idênticas na tela, impossível de diferenciar.
  const usedVisuals = new Set([visual(target), visual(correct)]);
  const otherWords = RHYME_GROUPS.filter(g=>g!==group).flatMap(g=>g.words).filter(w=>!usedVisuals.has(visual(w)));
  const distractors = pickRandom(otherWords, 2);
  const options = shuffle([correct, ...distractors]);

  stage.innerHTML = `<div class="prompt">Qual palavra RIMA com <b>${target.word}</b> ${visual(target)}?</div>
    <button class="tts-btn" onclick="speak('${target.word}')">🔊</button>
    <div class="options-row" id="opts"></div>`;
  const opts = stage.querySelector("#opts");
  options.forEach(o=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.style.fontSize = "40px";
    b.innerHTML = visual(o);
    b.onclick = ()=> registerAnswer(o.word === correct.word, b);
    opts.appendChild(b);
  });
  speak("Qual palavra rima com " + target.word);
}

/* --- Benjamin: Troca-Letra / Manipulação de Palavra (motor de manipulação) --- */
function renderManipulacao(stage){
  const lvl = activityLevel.manipulacao || 5;
  const fam = pickWeightedByLevel(WORD_FAMILIES, lvl, "FAMILIES");
  const variants = shuffle(fam.variants);
  const from = variants[0];
  const to = variants.length > 1 ? variants[1] : variants[0];
  const familyOptions = fam.variants.map(v=>({word:v.word, emoji:v.emoji, svg:v.svg}));
  const usedVisuals = new Set(familyOptions.map(visual));
  const extraPool = WORDS.filter(w => !fam.variants.some(v=>v.word===w.word) && !usedVisuals.has(visual(w)));
  const extra = pickRandom(extraPool, Math.max(0, 3 - familyOptions.length));
  const options = shuffle([...familyOptions, ...extra]);

  stage.innerHTML = `<div class="prompt">${from.word} ${visual(from)} → troque a primeira letra por <b>${to.letter}</b>. Que palavra fica?</div>
    <button class="tts-btn" onclick="speak('${to.word}')">🔊</button>
    <div class="options-row" id="opts"></div>`;
  const opts = stage.querySelector("#opts");
  options.forEach(o=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.style.fontSize = "40px";
    b.innerHTML = visual(o);
    b.onclick = ()=> registerAnswer(o.word === to.word, b);
    opts.appendChild(b);
  });
  speak("Troque a primeira letra de " + from.word + " por " + to.letter);
}

/* --- Benjamin: Maiúscula ↔ Minúscula (EF01LP11 — imprensa/cursiva, maiúscula/minúscula).
   Escopo: a mecânica testada de verdade é maiúscula↔minúscula (clicável e avaliável
   com precisão); a exposição a imprensa/cursiva é visual — mostra a letra também
   estilizada num tipo de letra manuscrita, mas sem cobrar isso na pontuação, porque
   fontes cursivas variam demais entre dispositivos pra ser critério de acerto/erro. --- */
function renderMaiuscMinusc(stage){
  const lvl = activityLevel.maiusc_minusc || 5;
  const target = pickWeightedByLevel(LETTERS, lvl, "MAIUSCMIN");
  const askLower = Math.random() < 0.5; // direção sorteada: mostra maiúscula pede minúscula, ou o contrário
  const shown = askLower ? target : target.toLowerCase();
  const correct = askLower ? target.toLowerCase() : target;
  const cumulativePool = LETTERS.filter(l => (LETTER_LEVELS[l]||5) <= lvl && l !== target);
  const distractorLetters = cumulativePool.length >= 3
    ? pickRandom(cumulativePool, 3)
    : pickRandom(LETTERS.filter(l=>l!==target), 3);
  const distractors = distractorLetters.map(l => askLower ? l.toLowerCase() : l);
  const options = shuffle([correct, ...distractors]);

  stage.innerHTML = `<div class="prompt">Qual é a mesma letra em ${askLower ? "MINÚSCULA" : "MAIÚSCULA"}?</div>
    <div class="big-word">${shown}</div>
    <div style="font-size:22px; font-family:'Brush Script MT','Segoe Script',cursive; color:#8480a3;">também se escreve assim à mão: ${shown}</div>
    <button class="tts-btn" onclick="speak('${target}')">🔊</button>
    <div class="options-row" id="opts"></div>`;
  const opts = stage.querySelector("#opts");
  options.forEach(o=>{
    const b = document.createElement("button");
    b.className = "option-btn";
    b.textContent = o;
    b.onclick = ()=> registerAnswer(o === correct, b);
    opts.appendChild(b);
  });
  speak("Qual é a mesma letra em " + (askLower ? "minúscula" : "maiúscula") + "? " + target);
}
