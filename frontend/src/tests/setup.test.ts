import { describe, it, expect } from 'vitest';

describe('Frontend bootstrap', () => {
  it('ambiente de teste está ativo', () => {
    expect(true).toBe(true);
  });

  it('variável de API está acessível via import.meta.env ou fallback', () => {
    // Em testes Vitest/jsdom import.meta.env é injetado pelo Vite
    const apiUrl = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:3000';
    expect(apiUrl).toBeTruthy();
  });
});
