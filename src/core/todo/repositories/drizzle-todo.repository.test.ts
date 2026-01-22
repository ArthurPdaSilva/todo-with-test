import {
  insertTestTodos,
  makeTestTodoRepository,
} from "@/core/__tests__/utils/make-test-todo.repository";

describe("DrizzleTodoRepository (integration)", () => {
  beforeEach(async () => {
    const { deleteTodoNoWhereDb } = await makeTestTodoRepository();
    await deleteTodoNoWhereDb();
  });

  afterAll(async () => {
    const { deleteTodoNoWhereDb } = await makeTestTodoRepository();
    await deleteTodoNoWhereDb();
  });

  describe("findAll", () => {
    test("deve retornar um array vazio se a tabela estiver limpa", async () => {
      const { repository } = await makeTestTodoRepository();
      const result = await repository.findAll();
      expect(result).toStrictEqual([]);
      expect(result).toHaveLength(0);
    });
    test("deve retornar todos os todos em ordem decrescente", async () => {
      const { repository } = await makeTestTodoRepository();
      await insertTestTodos();
      const result = await repository.findAll();
      expect(result[0].createdAt).toBe("date 4");
      expect(result[1].createdAt).toBe("date 3");
      expect(result[2].createdAt).toBe("date 2");
      expect(result[3].createdAt).toBe("date 1");
      expect(result[4].createdAt).toBe("date 0");
    });
  });

  describe("create", () => {
    test("cria um todo se os dados estão válidos", async () => {
      const { repository, todos } = await makeTestTodoRepository();
      const newTodo = await repository.create(todos[0]);
      expect(newTodo).toStrictEqual({
        success: true,
        todo: todos[0],
      });
    });
    test("falha se houver uma descrição igual na tabela", async () => {
      const { repository, todos } = await makeTestTodoRepository();
      await repository.create(todos[0]);
      const anotherTodo = todos[1];
      anotherTodo.description = todos[0].description;
      const result = await repository.create(anotherTodo);

      expect(result).toStrictEqual({
        success: false,
        errors: ["Já existe um todo com  o Id ou a descrição informada."],
      });
    });
    test("falha se houver um ID igual na tabela", async () => {
      const { repository, todos } = await makeTestTodoRepository();
      await repository.create(todos[0]);
      const anotherTodo = todos[1];
      anotherTodo.id = todos[0].id;
      const result = await repository.create(anotherTodo);

      expect(result).toStrictEqual({
        success: false,
        errors: ["Já existe um todo com  o Id ou a descrição informada."],
      });
    });
    test("falha se houver um ID e Descrição iguais na tabela", async () => {
      const { repository, todos } = await makeTestTodoRepository();
      await repository.create(todos[0]);
      const anotherTodo = todos[1];
      anotherTodo.id = todos[0].id;
      anotherTodo.description = todos[0].description;
      const result = await repository.create(anotherTodo);

      expect(result).toStrictEqual({
        success: false,
        errors: ["Já existe um todo com  o Id ou a descrição informada."],
      });
    });
  });

  describe("delete", () => {
    test("apaga um todo se ele existir", async () => {
      const { todos, repository } = await makeTestTodoRepository();
      await insertTestTodos();
      const result = await repository.remove(todos[0].id);
      expect(result).toStrictEqual({
        success: true,
        todo: todos[0],
      });
    });
    test("falha ao apagar se o todo não existir", async () => {
      const { todos, repository } = await makeTestTodoRepository();
      const result = await repository.remove(todos[0].id);
      expect(result).toStrictEqual({
        success: false,
        errors: ["Todo não encontrado."],
      });
    });
  });
});
