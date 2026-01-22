import { makeTestTodoRepository } from "@/core/__tests__/utils/make-test-todo.repository";
import type { InvalidTodo, ValidTodo } from "../schemas/todo.contract";
import { createTodoUseCase } from "./create-todo.usecase";

describe("createTodoUseCase (integration)", () => {
  beforeEach(async () => {
    const { deleteTodoNoWhereDb } = await makeTestTodoRepository();
    await deleteTodoNoWhereDb();
  });

  afterAll(async () => {
    const { deleteTodoNoWhereDb } = await makeTestTodoRepository();
    await deleteTodoNoWhereDb();
  });

  test("deve retornar erro se a validação falhar", async () => {
    const result = (await createTodoUseCase("")) as InvalidTodo;
    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
  });

  test("deve retornar o Todo se a validação passar", async () => {
    const description = "abcd";
    const result = (await createTodoUseCase(description)) as ValidTodo;
    expect(result.success).toBe(true);
    expect(result.todo).toStrictEqual({
      createdAt: expect.any(String),
      id: expect.any(String),
      description,
    });
  });

  test("deve retornar erro se o repositório falhar", async () => {
    // Arrange
    const description = "abcd";
    await createTodoUseCase(description);

    // Act
    const result = (await createTodoUseCase(description)) as InvalidTodo;

    // Assert
    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
  });
});
