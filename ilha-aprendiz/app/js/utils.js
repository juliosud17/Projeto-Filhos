// Utilitarios compartilhados: sorteio, fala (Web Speech API), efeito sonoro, resolucao de icone/emoji.
function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}
function pickRandom(arr, n){ return shuffle(arr).slice(0,n); }
function speak(text){
  try{
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "pt-BR";
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  }catch(e){}
}
function speakStop(){ try{ window.speechSynthesis.cancel(); }catch(e){} }

/* Devolve o "visual" de um item: emoji quando existe um bom, ou um ícone SVG
   próprio (item.svg) quando a palavra não tem emoji reconhecível — isso é o
   que destrava o banco de conteúdo de depender só do que já existe como
   emoji Unicode. O SVG usa width/height:1em, então herda o tamanho de fonte
   do elemento que o envolve (mesmo truque que já usávamos pra emoji). */
function visual(item){ return item.svg || item.emoji || ""; }

/* Separação desc infantil vs metadado BNCC (Fase 0.5, PRODUCTION_AUDIT.md
   item 18.6/TAREFA 2): os campos `desc` das atividades em
   app/data/matematica-atividades.js e app/data/portugues-atividades.js
   terminam com o código de habilidade BNCC entre parênteses, ex.:
   "Contar quantidade... (EF01MA01)". Isso é intencional e correto como
   METADADO -- serve documentação pedagógica, painel de responsáveis e
   administração -- mas nunca deveria aparecer na tela que a criança vê
   (princípio obrigatório em CLAUDE.md: "BNCC não deve poluir a interface
   infantil"). O achado da auditoria foi que renderAtividades()
   (navigation.js) interpola `act.desc` cru no card que a criança toca.

   Correção mínima: NÃO tocar nos 38+ campos `desc` (continuam a fonte
   única, com o código embutido, disponível pra quem precisar dele no
   futuro -- painel admin, docs). Em vez disso, duas funções puras que
   separam as duas leituras de uma mesma string:
   - descricaoSemBncc(desc): o texto sem o código, pra exibir à criança.
   - extrairCodigoBncc(desc): só o código (ou null), pra uso futuro em
     telas administrativas/de responsável.
   Único ponto de renderização já corrigido para usar a primeira:
   navigation.js, renderAtividades(). */
function descricaoSemBncc(desc){
  return (desc || "").replace(/\s*\(EF[0-9A-Z]+\)\s*$/, "").trim();
}
function extrairCodigoBncc(desc){
  const m = /\((EF[0-9A-Z]+)\)\s*$/.exec(desc || "");
  return m ? m[1] : null;
}

function beep(kind){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = "sine";
    if(kind === "ok"){
      o.frequency.setValueAtTime(520, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18);
    }else{
      o.frequency.setValueAtTime(220, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.25);
    }
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    o.start(); o.stop(ctx.currentTime + 0.3);
  }catch(e){}
}

/* ============ MOTOR DE ENSINO (AULAS DA ILHA) ============
   Protótipo do "Motor de Ensino" discutido com o Júlio: hoje o app avalia
   bem mas ensina pouco — uma atividade como "Compor e Decompor Números"
   pressupõe que um adulto já explicou o conceito antes. Isso cobre só 2 das
   53 atividades (Monte o Número / Dezena e Unidade, Módulo M6 de
   Matemática) como prova de conceito; o próximo passo é auditar as outras
   51 e classificar quais precisam do mesmo tratamento (ver README).

   Cada LESSONS[id] é uma mini-aula de 3 passos, no espírito
   Aprender → Ver exemplo → Fazer comigo, seguida por um passo final "Agora
   é você" que só então manda pra prática de verdade (a que conta pro
   domínio via recordMastery). Narração automática (Web Speech) em cada
   passo, igual ao resto do app — criança de 6 anos não deveria depender de
   saber ler pra aprender o conceito.

   Passos tipo "info" são só conteúdo + narração. O passo tipo "practice"
   ("Fazer comigo") exige acertar pelo menos uma vez pra liberar o botão
   "Próximo" — errar não penaliza nem trava, só mostra uma dica e deixa
   tentar de novo (mesma filosofia de erro do resto do app). */
