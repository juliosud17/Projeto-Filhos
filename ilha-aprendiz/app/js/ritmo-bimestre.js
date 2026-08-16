// Trava de ritmo por bimestre -- item 3 do docs/ROADMAP.md. Justificativa
// completa da escolha de formato em docs/DECISOES.md.
//
// Decisão de formato: bimestre como REFERÊNCIA, não bloqueio absoluto --
// nenhum módulo fica inacessível por causa disso (violaria "nunca trava a
// criança", princípio já registrado em CLAUDE.md). O que existe é um
// indicador puramente informativo pros pais/criança quando um módulo de
// Matemática (a trilha sem trava por domínio -- ver
// pedagogia/CURRICULO_BNCC_MATEMATICA.md) está "adiantado" em relação ao
// bimestre real do calendário. Só isso -- zero fricção no clique.
//
// Só se aplica a Matemática: Português já tem trava por domínio + Desafio
// Final entre módulos sequenciais, que já é um mecanismo de ritmo muito
// mais forte -- não precisa de sinal extra.
//
// Deliberadamente NÃO existe sinal de "atrasado" (bimestre real já passou
// o do módulo) -- só teria efeito de culpa, contra o tom "encorajador,
// nunca punitivo" já registrado em docs/ECOSSISTEMA.md, sem ganho real: a
// família pode estar simplesmente no ritmo dela.

/* Mapeia o mês do calendário pro bimestre "aproximado" do ano letivo
   brasileiro -- a própria palavra "aproximado" já está no docs/ROADMAP.md
   original: bimestre real varia por escola/estado, isso é só referência,
   não um calendário oficial. Aceita `date` opcional pra ser testável sem
   mockar o relógio do sistema. */
function bimestreCalendarAtual(date){
  const d = date || new Date();
  const mes = d.getMonth() + 1; // 1-12
  if(mes <= 3) return 1;
  if(mes <= 6) return 2;
  if(mes <= 9) return 3;
  return 4;
}

function bimestreNumero(label){
  const n = parseInt(label, 10);
  return Number.isInteger(n) ? n : null;
}

/* true só quando o módulo pertence a um bimestre à FRENTE do bimestre real
   atual. Nunca true pra "atrasado" (de propósito, ver nota acima). */
function moduloAdiantado(mod, date){
  const modBim = bimestreNumero(mod.bimestre);
  if(modBim === null) return false;
  return modBim > bimestreCalendarAtual(date);
}

function modulosAdiantadosDaTrilha(mods, date){
  return mods.filter(m => m.built && moduloAdiantado(m, date));
}
