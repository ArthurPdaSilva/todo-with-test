// Solução técnica para expirar
import * as sanitizeStrMod from "@/utils/sanitize-str";
import type { InvalidTodo, Todo, ValidTodo } from "../schemas/todo.contract";
import * as validateTodoDescriptionMod from "../schemas/validate-todo-description";
import * as makeNewTodoMod from "./make-new-todo";
import { makeValidatedTodo } from "./make-validated-todo";

describe("makeValidatedTodo (unit)", () => {
  test("deve chamar a função sanitizeStr com o valor correto", () => {
    // Mockar (mock) -> substituir algumaa coisa por outra para fins de teste
    // vi.mock -> mockar módulo
    // vi.spyOn -> mockar uma função específica e verificar alguma coisa da função
    // vi.stubGlobal -> mockar uma função global
    // vi.stubEnv -> mockar variáveis de ambiente
    // vi.mocked -> mockar um módulo e garantir que ele foi chamado

    // Arrange
    // const description = "abcd";
    // // const sanitizeStrSpy = vi.spyOn(sanitizeStrMod, "sanitizeStr");
    // const sanitizeStrSpy = vi
    //   .spyOn(sanitizeStrMod, "sanitizeStr")
    //   // Assim tira a dependência de sanitizeStrMod e substitui por algo padrão, assim não temos mais um teste de integração e sim unitário
    //   .mockReturnValue("abcd"); //Se for promise, usar .mockResolvedValue
    const { description, sanitizeStrSpy } = makeTestTodoMocks();

    // Act
    makeValidatedTodo(description);

    // Assert
    expect(sanitizeStrSpy).toHaveBeenCalledExactlyOnceWith(description);
    // expect(sanitizeStrSpy).toHaveBeenCalledTimes(1);
    // expect(sanitizeStrSpy).toHaveBeenCalledWith(description);

    // Se eu tentasse chamar dnv o toHaveBeenCalledExactlyOnceWith no segundo teste, ele vai dar erro pq a função ja foi chamada no primeiro teste. Ai eu limpei isso no vitest global
  });

  test("deve chamar a função validateTodoDescription com o retorno de sanitizeStr", () => {
    // Arrange
    const { description, sanitizeStrSpy, validateTodoDescriptionSpy } =
      makeTestTodoMocks();
    const sanitizeStrReturn = "retorno da sanitizeStr";
    sanitizeStrSpy.mockReturnValue(sanitizeStrReturn);

    // Act
    makeValidatedTodo(description);

    // Assert
    expect(validateTodoDescriptionSpy).toHaveBeenCalledExactlyOnceWith(
      sanitizeStrReturn,
    );
  });

  test("deve chamar a função makeValidatedTodo se validateTodoDescription retornar sucesso", () => {
    const { description } = makeTestTodoMocks();
    const result = makeValidatedTodo(description) as ValidTodo;

    expect(result.success).toBe(true);
    expect(result.todo).toStrictEqual(
      expect.objectContaining({
        id: "any-id",
        description,
        createdAt: expect.any(String),
      }),
    );

    // expect(result.success).toBe(true)
    ////@ts-expect-error: Ignora o erro de tipagem temporariamente para testar a função com um tipo inválido
    // expect(result.data).toStrictEqual(
    //   expect.objectContaining({
    //     id: expect.any(String),
    //     description,
    //     // Ou assim createdAt: expect.any(String),
    //   }),
    // );
  });

  test("deve retornar validatedDescription.error se a função falhou", () => {
    const { errors, description, validateTodoDescriptionSpy } =
      makeTestTodoMocks("abc");
    validateTodoDescriptionSpy.mockReturnValue({
      success: false,
      errors,
    });
    const result = makeValidatedTodo(description) as InvalidTodo;

    // expect(result.success).toBe(false);
    // expect(result.errors).toStrictEqual(errors);
    expect(result).toStrictEqual({
      errors,
      success: false,
    });
  });
});

// Como eu mockei todos as func de make validated todo, logo ele é um teste unitário
const makeTestTodoMocks = (description = "abcd") => {
  const errors = ["ANY", "ERROR"];
  const sanitizeStrSpy = vi
    .spyOn(sanitizeStrMod, "sanitizeStr")
    .mockReturnValue("abcd");

  const validateTodoDescriptionSpy = vi
    .spyOn(validateTodoDescriptionMod, "validateTodoDescription")
    .mockReturnValue({
      success: true,
      errors: [],
    });

  const simpleTodo: Todo = {
    id: "any-id",
    description,
    createdAt: new Date().toISOString(),
  };

  const makeNewTodoSpy = vi
    .spyOn(makeNewTodoMod, "makeNewTodo")
    .mockReturnValue(simpleTodo);

  return {
    errors,
    description,
    simpleTodo,
    sanitizeStrSpy,
    validateTodoDescriptionSpy,
    makeNewTodoSpy,
  };
};
