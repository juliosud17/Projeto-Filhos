// Dominio/progressao: activityLevel, mastery, MODULE_CONTAINERS, isModuleUnlocked, Desafio Final (constantes e checagem de dominio).
const activityLevel = {silabas:1, letras_b:1, cominicial:1, pares_minimos:1, rimas:1, manipulacao:1, maiusc_minusc:1, leitura:1, frases_leitura:1, escrita_certa:1, parlendas:1, silaba_meio_fim:1, pontuacao:1, lista_completa:1, texto_funcional:1, parlenda_de_cor:1, sinonimos_antonimos:1, genero_textual:1, ler_responder:1, elementos_historia:1, reconte_historia:1, invente_final:1, substantivo_verbo:1, acao_combina:1, pontuacao_texto:1, quantos_tem:1, conta_comigo_b:1, qual_tem_mais:1, conta_ate_100:1, pulando_de_10:1, qual_e_maior:1, organize_por_tamanho:1, o_que_vem_depois:1, fatos_da_soma:1, problemas_de_somar:1, fatos_da_subtracao:1, problemas_de_tirar:1, soma_ou_subtracao:1, monte_o_numero:1, dezena_e_unidade:1, onde_esta:1, siga_o_mapa:1, formas_no_mundo:1, nomeie_a_forma:1, comparar_medidas:1, cheio_ou_vazio:1, ordem_do_dia:1, que_dia_e_hoje:1, escreva_a_data:1, quanto_vale:1, junte_pra_comprar:1, vai_acontecer:1, leia_o_grafico:1};

/* Checagem genérica de "módulo completo": todas as atividades da lista no
   nível 5 com pelo menos 80% de domínio. Usada por todo módulo container
   (Módulo 1 a 6 e qualquer futuro com o mesmo padrão de níveis). */
function activitiesFullyMastered(list){
  return list.every(a=>{
    return activityLevel[a.id] === 5 && masteryPercent(a.id + ":5") >= 80;
  });
}
function module1FullyMastered(){ return activitiesFullyMastered(MODULE1_ACTIVITIES); }
function module2FullyMastered(){ return activitiesFullyMastered(MODULE2_ACTIVITIES); }
function module3FullyMastered(){ return activitiesFullyMastered(MODULE3_ACTIVITIES); }
function module4FullyMastered(){ return activitiesFullyMastered(MODULE4_ACTIVITIES); }
function module5FullyMastered(){ return activitiesFullyMastered(MODULE5_ACTIVITIES); }
function module6FullyMastered(){ return activitiesFullyMastered(MODULE6_ACTIVITIES); }
function module7FullyMastered(){ return activitiesFullyMastered(MODULE7_ACTIVITIES); }
function mm1FullyMastered(){ return activitiesFullyMastered(MM1_ACTIVITIES); }
function mm2FullyMastered(){ return activitiesFullyMastered(MM2_ACTIVITIES); }
function mm3FullyMastered(){ return activitiesFullyMastered(MM3_ACTIVITIES); }
function mm4FullyMastered(){ return activitiesFullyMastered(MM4_ACTIVITIES); }
function mm5FullyMastered(){ return activitiesFullyMastered(MM5_ACTIVITIES); }
function mm6FullyMastered(){ return activitiesFullyMastered(MM6_ACTIVITIES); }
function mm7FullyMastered(){ return activitiesFullyMastered(MM7_ACTIVITIES); }
function mm8FullyMastered(){ return activitiesFullyMastered(MM8_ACTIVITIES); }
function mm9FullyMastered(){ return activitiesFullyMastered(MM9_ACTIVITIES); }
function mm10FullyMastered(){ return activitiesFullyMastered(MM10_ACTIVITIES); }
function mm11FullyMastered(){ return activitiesFullyMastered(MM11_ACTIVITIES); }
function mm12FullyMastered(){ return activitiesFullyMastered(MM12_ACTIVITIES); }

/* Registro central de todo módulo "container" (várias atividades leveled,
   desbloqueia o próximo só quando todas estão no nível 5 com 80%+). Motor
   genérico usado por isModuleUnlocked, endSession, renderMenu, renderPanel e
   renderAdmin — adicionar um Módulo 7+ no mesmo padrão significa só acrescentar
   uma linha aqui, não duplicar lógica em 5 lugares diferentes. */
const MODULE_CONTAINERS = [
  {activities: MODULE1_ACTIVITIES, containerId:"silabas", fullyMastered: module1FullyMastered},
  {activities: MODULE2_ACTIVITIES, containerId:"leitura",  fullyMastered: module2FullyMastered},
  {activities: MODULE3_ACTIVITIES, containerId:"frases",   fullyMastered: module3FullyMastered},
  {activities: MODULE4_ACTIVITIES, containerId:"escrita",  fullyMastered: module4FullyMastered},
  {activities: MODULE5_ACTIVITIES, containerId:"compreensao", fullyMastered: module5FullyMastered},
  {activities: MODULE6_ACTIVITIES, containerId:"narrativas", fullyMastered: module6FullyMastered},
  {activities: MODULE7_ACTIVITIES, containerId:"gramatica", fullyMastered: module7FullyMastered},
  {activities: MM1_ACTIVITIES, containerId:"mm1_numeros", fullyMastered: mm1FullyMastered},
  {activities: MM2_ACTIVITIES, containerId:"mm2_contagem100", fullyMastered: mm2FullyMastered},
  {activities: MM3_ACTIVITIES, containerId:"mm3_comparar", fullyMastered: mm3FullyMastered},
  {activities: MM4_ACTIVITIES, containerId:"mm4_adicao", fullyMastered: mm4FullyMastered},
  {activities: MM5_ACTIVITIES, containerId:"mm5_subtracao", fullyMastered: mm5FullyMastered},
  {activities: MM6_ACTIVITIES, containerId:"mm6_compor_decompor", fullyMastered: mm6FullyMastered},
  {activities: MM7_ACTIVITIES, containerId:"mm7_espaco", fullyMastered: mm7FullyMastered},
  {activities: MM8_ACTIVITIES, containerId:"mm8_formas", fullyMastered: mm8FullyMastered},
  {activities: MM9_ACTIVITIES, containerId:"mm9_medidas", fullyMastered: mm9FullyMastered},
  {activities: MM10_ACTIVITIES, containerId:"mm10_tempo", fullyMastered: mm10FullyMastered},
  {activities: MM11_ACTIVITIES, containerId:"mm11_dinheiro", fullyMastered: mm11FullyMastered},
  {activities: MM12_ACTIVITIES, containerId:"mm12_probabilidade", fullyMastered: mm12FullyMastered},
];
function containerById(containerId){ return MODULE_CONTAINERS.find(c=>c.containerId === containerId) || null; }
function containerForActivity(activityId){ return MODULE_CONTAINERS.find(c=>c.activities.some(a=>a.id===activityId)) || null; }

const MATH_GAMES_BENJAMIN = [
  {id:"soma", name:"Soma Divertida", icon:"➕", desc:"Adição com objetos", tag:"Grátis"},
  {id:"subtracao", name:"Subtração Divertida", icon:"➖", desc:"Subtração com objetos", tag:"Grátis"},
];
const FUTURE_BENJAMIN = [
  {id:"cultura_b", name:"Histórias do Brasil", icon:"📚", desc:"Módulo cultural — em breve", tag:"Em breve", locked:true},
];

const CHILD_INFO = {
  joaquim: {name:"Joaquim", avatar:"🦉"},
  benjamin:{name:"Benjamin", avatar:"🦊"}
};

/* ============ ESTADO (em memória, sem localStorage) ============ */
const state = {
  child:null,
  game:null,
  round:0,
  totalRounds:6,
  sessionStars:0,
  totalStars:{joaquim:0, benjamin:0},
  currentRoundData:null,
  roundFirstTryUsed:false,
  fromAdmin:false, /* true quando o jogo foi aberto pelo painel de auditoria — "Voltar" retorna pro painel, não pro menu da criança */
  provaMode:false, /* true durante uma sessão de Desafio Final (prova) — muda o registro de pontuação e a tela de fim de sessão */
  provaContainerId:null,
  provaResults:null,
  currentTrilha:null, /* "portugues" | "matematica" — matéria aberta na árvore de navegação do Benjamin */
  currentModuloId:null, /* id do módulo container aberto (tela de atividades) */
  navBack:null, /* "atividades" | "modulos" | null — pra onde "← Voltar"/"Ver outros jogos" retorna depois de uma sessão, na árvore do Benjamin */
  lessonsSeen:new Set(), /* ids de atividade cuja "Aula da Ilha" já foi mostrada nesta sessão do app (sem persistência ainda, reseta ao recarregar a aba) */
  wrongStreak:0, /* erros seguidos de primeira tentativa na atividade atual — usado só pra sugerir "rever a aula", nunca trava nem penaliza */
  freePracticeMode:false /* true durante "Praticar de novo" (rever atividade já dominada, pelo popover do mapa) — mesmo padrão de isolamento do Desafio Final/Revisão Espaçada: não grava em mastery/activityLevel, só o registerAnswer() sabe disso (js/game-loop.js) */
};

/* Domínio (mastery) por jogo: guarda os últimos 10 resultados de PRIMEIRA tentativa
   de cada rodada, por jogo. Usado para calcular a % de domínio e destravar módulos. */
const mastery = {};
function recordMastery(gameId, correct){
  if(!mastery[gameId]) mastery[gameId] = [];
  mastery[gameId].push(correct);
  if(mastery[gameId].length > 10) mastery[gameId].shift();
}
function masteryPercent(gameId){
  const arr = mastery[gameId];
  if(!arr || arr.length === 0) return 0;
  return Math.round((arr.filter(x=>x).length / arr.length) * 100);
}
/* ============ DESAFIO FINAL (PROVA DE MÓDULO) ============
   Checkpoint formal ao final de cada módulo container: mistura perguntas de
   TODAS as atividades do módulo (em vez de treinar uma de cada vez), com
   aprovação exigindo 80% geral E pelo menos 60% em CADA atividade — não dá
   pra "carregar" uma atividade fraca com o resultado forte de outra. Pedido
   explícito do Júlio: a prova passa a ser critério de desbloqueio do
   próximo módulo, junto com o domínio de 80%/nível 5 que já existia. Como
   a trilha de Matemática é inteiramente independente (nenhum módulo exige
   outro), esse gate só tem efeito prático na trilha de Português — mas a
   prova em si existe (e é rastreada) em todos os módulos das duas trilhas. */
const PROVA_QUESTIONS_PER_ACTIVITY = 3;
const PROVA_PASS_OVERALL = 80;
const PROVA_PASS_PER_ACTIVITY = 60;
const provaPassed = {};  // {containerId: true} quando aprovado
const provaScores = {};  // {containerId: {overallPct, perActivity:[...], passed}} — último resultado, pro admin

function isModuleUnlocked(mod){
  if(!mod.requires) return true;
  // pré-requisito é um módulo container (Módulo 1, 2, 3...) — só desbloqueia
  // quando TODAS as atividades dele estiverem no nível 5 com 80%+ de domínio
  // E o Desafio Final (prova) daquele módulo tiver sido aprovado
  const reqContainer = containerById(mod.requires);
  if(reqContainer) return reqContainer.fullyMastered() && !!provaPassed[mod.requires];
  // pré-requisito é uma atividade avulsa com nível próprio (não um container)
  // só desbloqueia com nível 5 + 80% de domínio — masteryPercent(id) sozinho
  // não funciona aqui, porque o domínio é registrado por nível ("id:5"), não
  // na chave plana.
  if(activityLevel.hasOwnProperty(mod.requires)){
    const lvl = activityLevel[mod.requires];
    return lvl === 5 && masteryPercent(mod.requires + ":" + lvl) >= 80;
  }
  return masteryPercent(mod.requires) >= mod.unlockAt;
}

/* Calcula o estado real de um módulo container (bloqueado/progresso/
   aprovado) a partir do mesmo estado de domínio/prova que o resto do app
   já usa -- extraído em 2026-08-16 de dentro de renderModulos() pra ser
   reaproveitado também por renderMapaPortugues() (Ilha das Letras), sem
   duplicar a conta em dois lugares. Módulo sem container (hoje só
   "projetoleitor", Módulo 8 -- fora da tela por design, sem atividade
   digital) não tem os 5 estados normais: só LOCKED/AVAILABLE, seguindo o
   mesmo pré-requisito de sempre (isModuleUnlocked). */
function moduleStatus(mod){
  const unlocked = isModuleUnlocked(mod);
  const container = containerById(mod.id);
  if(!container){
    return { unlocked, container:null, doneCount:0, total:0, allDone:false, passed:false, state: unlocked ? "AVAILABLE" : "LOCKED" };
  }
  const doneCount = container.activities.filter(a=>activityLevel[a.id]===5 && masteryPercent(a.id+":5")>=80).length;
  const total = container.activities.length;
  const allDone = doneCount === total;
  const passed = !!provaPassed[mod.id];
  let state;
  if(!unlocked) state = "LOCKED";
  else if(allDone && passed) state = "DESAFIO_APROVADO";
  else if(allDone) state = "MASTERED";
  else if(doneCount > 0) state = "LEARNING";
  else state = "AVAILABLE";
  return { unlocked, container, doneCount, total, allDone, passed, state };
}

/* ============ NAVEGAÇÃO ============ */
