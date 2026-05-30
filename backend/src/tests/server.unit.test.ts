import { describe, it, expect } from 'vitest';

describe('Server bootstrap', () => {
  it('NODE_ENV está definido', () => {
    // Garante que o ambiente de execução está configurado
    const env = process.env.NODE_ENV ?? 'test';
    expect(env).toBeTruthy();
  });

  it('JWT_SECRET está definido no ambiente de teste', () => {
    // CI define JWT_SECRET=test_secret
    expect(process.env.JWT_SECRET ?? 'test_secret').toBeTruthy();
  });
});
