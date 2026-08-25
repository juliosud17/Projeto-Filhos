// Configuração Vite — Fase 2 (migração controlada file:// -> HTTP).
//
// Princípio central desta fase: Vite é INFRAESTRUTURA, não uma desculpa
// pra reescrever a arquitetura do jogo. app/ilha_aprendiz.html e os 24
// <script src> clássicos que ele carrega continuam exatamente como estão
// -- nenhum vira ES Module, nenhum é renomeado, nenhum é movido.
//
// Como isso é alcançado: `publicDir` aponta pra app/ inteiro. Vite copia
// (build) ou serve (dev) o CONTEÚDO de publicDir sem nenhum processamento
// -- sem bundling, sem minificação, sem reescrita de <script src>. Isso
// preserva 100% do comportamento atual: ordem de carga dos scripts,
// MEDIA_BASE="assets/", o path literal do mapa, tudo.
//
// O único arquivo que o Vite de fato PROCESSA é o novo `index.html` na
// raiz do projeto -- um stub de 12 linhas que só redireciona pra
// /ilha_aprendiz.html (ver esse arquivo pro motivo). Ele existe só porque
// o Rollup exige pelo menos 1 entry HTML pra "vite build" não falhar, e
// porque dá uma URL "/" sensata em dev/preview/GitHub Pages.
//
// Ver docs/VITE_MIGRATION_CHECKLIST.md e docs/DEV_SETUP.md pro contexto
// completo desta decisão.

import { defineConfig } from 'vite';

export default defineConfig({
  // base relativo -- funciona tanto em localhost (dev/preview) quanto se
  // o build (`dist/`) vier a ser publicado em qualquer subpath no futuro,
  // sem precisar decidir agora onde exatamente. Hoje o GitHub Pages
  // continua servindo os arquivos-fonte direto (sem usar dist/ nenhum),
  // então este `base` não afeta o deploy atual -- só o build novo.
  base: './',

  // Todo o app de verdade (HTML real, css/, data/, js/, assets/) vive
  // aqui e é copiado/servido bit-a-bit, sem nenhuma transformação.
  publicDir: 'app',

  build: {
    outDir: 'dist',
    // Zero aviso sobre chunk grande sendo esperado -- o "app" de verdade
    // nem passa pelo pipeline de bundle, só a página de redirecionamento
    // e o supabase-client.js (Fase 4.3).
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: {
        index: './index.html',
        // Segundo entry ES Module -- processado pelo Vite (resolve npm import,
        // injeta import.meta.env). NÃO fica em app/ (publicDir = cópia estática).
        'supabase-client': './supabase-client.js',
      },
      output: {
        // Nome fixo só para supabase-client porque app/ilha_aprendiz.html é
        // copiado estaticamente (publicDir) e não pode referenciar hash
        // desconhecido em build-time. Demais entries/chunks mantêm hash.
        entryFileNames: chunkInfo =>
          chunkInfo.name === 'supabase-client'
            ? 'supabase-client.js'
            : 'assets/[name]-[hash].js',
      },
    },
  },

  server: {
    // Porta fixa e previsível pra facilitar documentação/troubleshooting;
    // Vite tenta a próxima livre automaticamente se estiver ocupada.
    port: 5173,
  },

  preview: {
    port: 4173,
  },
});
