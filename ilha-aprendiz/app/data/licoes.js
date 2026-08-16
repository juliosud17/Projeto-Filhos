// Conteudo do Motor de Ensino (aulas: Aprender -> Ver exemplo -> Fazer comigo -> Agora e voce).
const LESSONS = {
  monte_o_numero: {
    title: "Compor e Decompor Números",
    icon: "🧱",
    steps: [
      { type:"info", badge:"📖 Aprender",
        spoken:"Todo número maior que nove pode ser separado em dezenas e unidades. Uma dezena é um grupo de dez. Vamos descobrir o que existe dentro do número catorze!",
        html: () => `
          <div class="prompt">Vamos descobrir o que existe dentro do número 14!</div>
          <div class="big-emoji-row lesson-blocks">${mm3Visual(14)}</div>
          <div class="prompt" style="font-size:20px;">10 + 4 = 14</div>
          <p class="lesson-explain">Quando <b>juntamos</b> 10 e 4, estamos <b>compondo</b> o número 14. Quando <b>separamos</b> 14 em 10 e 4, estamos <b>decompondo</b> o número.</p>`
      },
      { type:"info", badge:"👀 Ver exemplo",
        spoken:"Olha como eu resolvo: vinte e três é igual a vinte mais quanto? Vinte e três tem duas dezenas, que valem vinte, e três unidades soltinhas. Então vinte e três é igual a vinte mais três.",
        html: () => `
          <div class="prompt">Complete: 23 = 20 + ___</div>
          <div class="big-emoji-row lesson-blocks">${mm3Visual(23)}</div>
          <p class="lesson-explain">23 tem <b>2 dezenas</b> (fileiras cheias de 10 = 20) e <b>3 unidades</b> soltinhas. Então: 23 = 20 + <b>3</b>.</p>`
      },
      { type:"practice", badge:"🤝 Fazer comigo",
        spoken:"Agora tenta você, com a minha ajuda. Treze é igual a dez mais quanto?",
        render: () => `
          <div class="prompt">Complete: 13 = 10 + ___</div>
          <div class="big-emoji-row lesson-blocks">${mm3Visual(13)}</div>
          <button class="tts-btn" onclick="speak('Treze é igual a dez mais quanto?')">🔊 Ouvir de novo</button>
          <div class="options-row" id="lesson-practice-opts"></div>
          <div class="lesson-hint" id="lesson-hint"></div>`,
        options: [ {label:2, correct:false}, {label:3, correct:true}, {label:5, correct:false} ],
        rightMsg:"Isso mesmo! 10 e 3 juntos formam 13.",
        hintMsg:"Conta as bolinhas soltas, fora da fileira de 10 — é quanto falta pra completar o 13."
      },
      { type:"final", badge:"🎯 Agora é você",
        spoken:"Muito bem! Agora é sua vez de praticar sozinho.",
        html: () => `
          <div class="prompt">Você já entendeu como montar um número com dezenas e unidades!</div>
          <p class="lesson-explain">Agora é sua vez de praticar sozinho — cada acerto conta pra você dominar essa habilidade.</p>`
      }
    ]
  },
  dezena_e_unidade: {
    title: "Dezena e Unidade",
    icon: "🔟",
    steps: [
      { type:"info", badge:"📖 Aprender",
        spoken:"Vamos contar quantas dezenas e quantas unidades um número tem. Repara no número dezessete: uma fileira cheia de dez bolinhas, e sete soltinhas.",
        html: () => `
          <div class="prompt">O número é 17</div>
          <div class="big-emoji-row lesson-blocks">${mm3Visual(17)}</div>
          <p class="lesson-explain">17 tem <b>1 dezena</b> (10, ou seja, um grupo de 10) e <b>7 unidades</b> (soltinhas, fora do grupo de 10).</p>`
      },
      { type:"info", badge:"👀 Ver exemplo",
        spoken:"Olha como eu conto: vinte e cinco tem duas fileiras cheias de dez, ou seja, duas dezenas. E sobram cinco bolinhas soltas, ou seja, cinco unidades.",
        html: () => `
          <div class="prompt">O número é 25 — quantas dezenas e quantas unidades?</div>
          <div class="big-emoji-row lesson-blocks">${mm3Visual(25)}</div>
          <p class="lesson-explain">25 tem <b>2 dezenas</b> (2 fileiras cheias de 10) e <b>5 unidades</b> (o restinho solto).</p>`
      },
      { type:"practice", badge:"🤝 Fazer comigo",
        spoken:"Agora tenta você. O número é doze. Quantas UNIDADES, ou seja, bolinhas soltas fora da fileira de dez, esse número tem?",
        render: () => `
          <div class="prompt">O número é 12</div>
          <div class="big-emoji-row lesson-blocks">${mm3Visual(12)}</div>
          <div class="prompt" style="font-size:16px;">Quantas UNIDADES (soltinhas, fora da fileira de 10) esse número tem?</div>
          <button class="tts-btn" onclick="speak('O número é doze. Quantas unidades esse número tem?')">🔊 Ouvir de novo</button>
          <div class="options-row" id="lesson-practice-opts"></div>
          <div class="lesson-hint" id="lesson-hint"></div>`,
        options: [ {label:1, correct:false}, {label:2, correct:true}, {label:12, correct:false} ],
        rightMsg:"Isso mesmo! 12 tem 1 dezena (10) e 2 unidades soltinhas.",
        hintMsg:"Não conta a fileira cheia — conta só as bolinhas soltas que sobraram."
      },
      { type:"final", badge:"🎯 Agora é você",
        spoken:"Muito bem! Agora é sua vez de praticar sozinho.",
        html: () => `
          <div class="prompt">Você já sabe contar dezenas e unidades!</div>
          <p class="lesson-explain">Agora é sua vez de praticar sozinho — cada acerto conta pra você dominar essa habilidade.</p>`
      }
    ]
  }
};

