// Tela do Modulo 8 (Projeto Leitor) -- aberta pelo hotspot "Castelo dos
// Livros" na Ilha das Letras. Nao e um jogo (Modulo 8 e fora da tela por
// design), entao nao chama startGame/openAtividades -- so mostra o
// conteudo ja existente em pedagogia/MODULO8_PROJETO_LEITOR.md (livros +
// roteiro de perguntas), estruturado em data/projeto-leitor.js.

function openProjetoLeitor(){
  renderProjetoLeitor();
  showScreen("screen-projeto-leitor");
}

function backFromProjetoLeitor(){
  // sempre volta pro mapa -- só existe caminho pra cá vindo da Ilha das
  // Letras (Módulo 8 não aparece em nenhuma outra tela).
  openMapaPortugues();
}

function renderProjetoLeitor(){
  const livrosHtml = PROJETO_LEITOR_LIVROS.map((livro, i)=>{
    const comprarHtml = livro.comprar.length
      ? livro.comprar.map(l=>`<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`).join(" · ")
      : `<span style="color:#8480a3;">${livro.comprarNota}</span>`;
    const ebookHtml = livro.ebook.map(l=>`<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`).join(" · ");
    return `<div class="panel-card" style="margin-bottom:12px;">
      <h4 style="margin:0 0 2px 0; color:var(--purple-dark);">${i+1}. ${livro.titulo}</h4>
      <p style="margin:0 0 6px 0; color:#8480a3; font-size:13px;">${livro.autor} — ${livro.genero}</p>
      <p style="margin:0 0 2px 0; font-size:13px;"><b>📖 Comprar físico:</b> ${comprarHtml}</p>
      <p style="margin:0; font-size:13px;"><b>💻 E-book grátis (se não der pra comprar):</b> ${ebookHtml}</p>
    </div>`;
  }).join("");

  const roteiroHtml = PROJETO_LEITOR_ROTEIRO.map(p=>`<li>${p}</li>`).join("");

  const el = document.getElementById("projeto-leitor-content");
  el.innerHTML = `
    <p>Diferente dos outros módulos, este não é um jogo — é <b>1 livro por semana, lido com um adulto</b>, com uma conversa curta depois. O valor está na leitura compartilhada em si, não em marcar resposta certa numa tela.</p>
    <h3 style="color:var(--purple-dark);">📚 Roteiro de perguntas pós-leitura</h3>
    <p style="font-size:13px; color:#8480a3;">Uma conversa curta (2-3 minutos já basta) depois da leitura:</p>
    <ul>${roteiroHtml}</ul>
    <h3 style="color:var(--purple-dark);">📖 Livros sugeridos</h3>
    <p style="font-size:13px; color:#8480a3;">Um livro por semana, no ritmo do Benjamin — sem pressa e sem cobrança de terminar todos.</p>
    ${livrosHtml}
  `;
}
