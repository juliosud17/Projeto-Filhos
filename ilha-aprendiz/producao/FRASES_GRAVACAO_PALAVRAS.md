# Frases-molde pra gravar as palavras inteiras (ElevenLabs + corte no CapCut)

*Corrige uma orientação errada que dei antes: o bloco de instruções em inglês que mandei pra "colar no ElevenLabs" não funciona — o ElevenLabs de texto-pra-voz fala LITERALMENTE tudo que está no campo de texto, ele não obedece instrução meta tipo "fale devagar". O jeito certo é o que o Júlio já vinha fazendo: gerar a palavra dentro de uma frase natural em português (dá contexto/ritmo pro modelo) e cortar só a palavra depois. Esse arquivo dá uma frase-molde única, sempre no mesmo formato, pra não precisar pensar uma frase diferente pra cada palavra.*

## Por que isso resolve o problema

Uma palavra sozinha (principalmente curta, 3-4 letras) não dá contexto nenhum pro modelo de voz — ele não tem "de onde vir" nem "pra onde ir", então dispara rápido e sem entonação. Uma frase de verdade, com começo, meio e fim, força o modelo a tratar aquilo como fala natural, com o ritmo calmo de quem está falando de verdade — e a palavra-alvo, no meio/fim da frase, sai com a entonação natural de frase, não de "robô lendo lista".

## A frase-molde (sempre a mesma, só troca a palavra)

```
Agora, vamos ouvir a palavra: [palavra].
```

**Por que essa estrutura:**
- "Agora, vamos ouvir a palavra:" dá o contexto/ritmo calmo antes — e sempre pausa naturalmente depois dos dois-pontos, o que ajuda MUITO na hora de cortar (é fácil achar esse ponto de silêncio no CapCut).
- A palavra fica sozinha no final da frase, com o ponto final logo depois — isso também cria uma pausa natural DEPOIS da palavra, então o corte fica limpo dos dois lados.
- É neutra de propósito (sem "Que legal!" ou exclamação) — mantém a regra de sempre: fonética não tem entonação de celebração, isso é trabalho da Lia.

**Como cortar:** gera a frase inteira, aí no CapCut corta só o trecho da palavra-alvo (do fim da pausa depois de "palavra:" até o fim da pausa antes do próximo silêncio/corte da frase) — descarta "Agora, vamos ouvir a palavra:" e o ponto final não deve ficar audível como som.

## As 67 frases prontas (uma por linha, copia e cola cada uma por vez)

Agora, vamos ouvir a palavra: cama.
Agora, vamos ouvir a palavra: lua.
Agora, vamos ouvir a palavra: ovo.
Agora, vamos ouvir a palavra: uva.
Agora, vamos ouvir a palavra: vela.
Agora, vamos ouvir a palavra: dente.
Agora, vamos ouvir a palavra: fogo.
Agora, vamos ouvir a palavra: coco.
Agora, vamos ouvir a palavra: dado.
Agora, vamos ouvir a palavra: tatu.
Agora, vamos ouvir a palavra: rio.
Agora, vamos ouvir a palavra: leite.
Agora, vamos ouvir a palavra: neve.
Agora, vamos ouvir a palavra: mola.
Agora, vamos ouvir a palavra: muro.
Agora, vamos ouvir a palavra: fita.
Agora, vamos ouvir a palavra: gelo.
Agora, vamos ouvir a palavra: duna.
Agora, vamos ouvir a palavra: nove.
Agora, vamos ouvir a palavra: bico.
Agora, vamos ouvir a palavra: fada.
Agora, vamos ouvir a palavra: foca.
Agora, vamos ouvir a palavra: pipa.
Agora, vamos ouvir a palavra: suco.
Agora, vamos ouvir a palavra: bolo.
Agora, vamos ouvir a palavra: bala.
Agora, vamos ouvir a palavra: anel.
Agora, vamos ouvir a palavra: arco.
Agora, vamos ouvir a palavra: chave.
Agora, vamos ouvir a palavra: queijo.
Agora, vamos ouvir a palavra: kiwi.
Agora, vamos ouvir a palavra: ilha.
Agora, vamos ouvir a palavra: zebra.
Agora, vamos ouvir a palavra: festa.
Agora, vamos ouvir a palavra: pudim.
Agora, vamos ouvir a palavra: ninho.
Agora, vamos ouvir a palavra: ferro.
Agora, vamos ouvir a palavra: osso.
Agora, vamos ouvir a palavra: massa.
Agora, vamos ouvir a palavra: milho.
Agora, vamos ouvir a palavra: julho.
Agora, vamos ouvir a palavra: porco.
Agora, vamos ouvir a palavra: cobra.
Agora, vamos ouvir a palavra: lápis.
Agora, vamos ouvir a palavra: tigre.
Agora, vamos ouvir a palavra: urso.
Agora, vamos ouvir a palavra: livro.
Agora, vamos ouvir a palavra: barco.
Agora, vamos ouvir a palavra: bota.
Agora, vamos ouvir a palavra: nuvem.
Agora, vamos ouvir a palavra: xadrez.
Agora, vamos ouvir a palavra: vulcão.
Agora, vamos ouvir a palavra: banana.
Agora, vamos ouvir a palavra: cavalo.
Agora, vamos ouvir a palavra: girafa.
Agora, vamos ouvir a palavra: jacaré.
Agora, vamos ouvir a palavra: macaco.
Agora, vamos ouvir a palavra: navio.
Agora, vamos ouvir a palavra: sorvete.
Agora, vamos ouvir a palavra: tomate.
Agora, vamos ouvir a palavra: coelho.
Agora, vamos ouvir a palavra: cebola.
Agora, vamos ouvir a palavra: cidade.
Agora, vamos ouvir a palavra: agulha.
Agora, vamos ouvir a palavra: garrafa.
Agora, vamos ouvir a palavra: buraco.
Agora, vamos ouvir a palavra: jiboia.

## FUMAÇA fica de fora por enquanto

Mesmo motivo de sempre: ainda não decidimos como tratar o som do Ç no nome do arquivo (ver `CHECKLIST_PRODUCAO.md`). Pode gerar a frase se quiser adiantar ("Agora, vamos ouvir a palavra: fumaça.") mas não nomeia/entrega o arquivo ainda — combinamos isso antes.

## Se quiser aplicar a mesma ideia pras sílabas que faltam (boi, gar, lho, nho)

Sílaba sozinha é mais difícil de "carregar" numa frase natural porque não é uma palavra de verdade. O jeito que costuma funcionar é simular o momento de "separar a palavra em sílabas", bem devagar, e cortar cada pedaço:

```
Vamos separar em sílabas: ji... boia.       (BOI de JIBOIA)
Vamos separar em sílabas: gar... rafa.      (GAR de GARRAFA)
Vamos separar em sílabas: mi... lho.        (LHO de MILHO)
Vamos separar em sílabas: ni... nho.        (NHO de NINHO)
```

As reticências entre as sílabas ajudam o modelo a criar uma pausa curta ali — é esse pedaço de silêncio que facilita cortar cada sílaba separada da frase.
