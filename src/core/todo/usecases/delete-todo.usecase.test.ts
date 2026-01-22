import { makeTestTodoRepository } from "@/core/__tests__/utils/make-test-todo.repository";
import type { InvalidTodo, ValidTodo } from "../schemas/todo.contract";
import { deleteTodoUseCase } from "./delete-todo.usecase";

describe("deleteTodoUseCase (integration)", () => {
  beforeEach(async () => {
    const { deleteTodoNoWhereDb } = await makeTestTodoRepository();
    await deleteTodoNoWhereDb();
  });

  afterAll(async () => {
    const { deleteTodoNoWhereDb } = await makeTestTodoRepository();
    await deleteTodoNoWhereDb();
  });

  test("deve retornar erro se o ID for inválido", async () => {
    const result = (await deleteTodoUseCase("")) as InvalidTodo;
    expect(result.success).toBe(false);
    expect(result.errors).toEqual(["ID inválido"]);
  });

  test("deve retornar sucesso se o todo existe na base dados", async () => {
    const { insertTodoDb, todos } = await makeTestTodoRepository();
    await insertTodoDb().values(todos[0]);
    const result = (await deleteTodoUseCase(todos[0].id)) as ValidTodo;
    expect(result.success).toBe(true);
    expect(result.todo).toStrictEqual(todos[0]);
  });

  test("deve retornar error se o todo não existe na base dados", async () => {
    const { todos } = await makeTestTodoRepository();
    const result = (await deleteTodoUseCase(todos[0].id)) as InvalidTodo;
    expect(result.success).toBe(false);
    expect(result.errors).toStrictEqual(["Todo não encontrado."]);
  });
});
