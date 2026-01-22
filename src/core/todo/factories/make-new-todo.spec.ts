import type { Todo } from "../schemas/todo.contract";
import { makeNewTodo } from "./make-new-todo";

// Describe serve para agrupar um bloco de teste
describe("makeNewTodo (unit)", () => {
  // As funções it/test dão no mesmo
  // Posso ter um describe("Create", () => {}) como contexto interno
  it("Deve retornar um novo todo válido", () => {
    // AAA - Arrange, Act, Assert
    //Arrange -> Criar as coisas que eu preciso
    const expectedTodo: Todo = {
      //Como id é algo dinâmico, não posso saber exatamente qual será. Então uso o expect.any(String)
      id: expect.any(String),
      description: "Meu novo todo",
      createdAt: expect.any(String),
    };

    // Act -> Executar a função que quero testar
    const resultTodo = makeNewTodo("Meu novo todo");

    // Assert -> Verificar se o resultado é como esperado
    expect(resultTodo.description).toBe(expectedTodo.description);
    // toBe é basicamente '==='
    // Quando for objeto usa: toEqual  ou toStrictEqual
    expect(resultTodo).toStrictEqual(expectedTodo);
    //Rodar sem scripts: npx vitest
  });
});
