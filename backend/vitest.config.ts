import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Apenas arquivos .unit.test.ts — exclui testes de integração que precisam
    // de serviços externos em execução (ex: whatsappIntegration.test.ts)
    include: ['src/**/*.unit.test.ts'],
  },
});
