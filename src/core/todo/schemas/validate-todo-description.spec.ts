import { validateTodoDescription } from "./validate-todo-description";

describe("validateTodoDescription (unit)", () => {
  test("deve retornar erros quando a descrição tem menos de 4 caracteres", () => {
    const description = "abc";
    const result = validateTodoDescription(description);
    expect(result.errors).toStrictEqual([
      "A descrição deve ter mais de 3 caracteres",
    ]);
    // toBe valores primitivos, toStrictEqual objetos e arrays
    expect(result.success).toBe(false);
  });

  test("deve retornar sucesso quando a descrição tem mais de 3 caracteres", () => {
    const description = "abcd";
    const result = validateTodoDescription(description);
    expect(result.errors).toStrictEqual([]);
    // toBe valores primitivos, toStrictEqual objetos e arrays
    expect(result.success).toBe(true);
  });
});
