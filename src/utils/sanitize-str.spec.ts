import { sanitizeStr } from "./sanitize-str";

describe("sanitizeStr (unit)", () => {
  // Tenta o máximo possível de testes terem apenas uma função a ser executada
  test("retorna uma string vazia quando recebe o valor false", () => {
    // @ts-expect-error: Ignora o erro de tipagem temporariamente para testar a função com um tipo inválido
    expect(sanitizeStr(false)).toBe("");
  });

  test("retorna uma string vazia quando recebe um valor que não é uma string", () => {
    // @ts-expect-error: Ignora o erro de tipagem temporariamente para testar a função com um tipo inválido
    expect(sanitizeStr(1234567890)).toBe("");
  });

  test("garante o trim da string enviada", () => {
    expect(sanitizeStr("   Hello World!   ")).toBe("Hello World!");
  });

  test("garante que a string é normaliza com NFC", () => {
    const original = "e\u0301";
    const expected = "é";
    // AssertionError: expected 'é' to be 'é' // Object.is equality
    // Expected: "é"
    // Received: "é"
    // expect(expected).toBe(original);
    expect(sanitizeStr(original)).toBe(expected);
  });
});
