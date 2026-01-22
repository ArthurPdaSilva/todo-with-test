import { makeTestTodoMocks } from "@/core/__tests__/utils/make-test-todo-mocks";
import { createTodoAction } from "./create-todo.action";

vi.mock("next/cache", () => {
  return {
    revalidatePath: vi.fn(),
  };
});

describe("createTodoAction (unit)", () => {
  test("deve chamar o createTodoUseCase com os valores corretos", async () => {
    const { createTodoUseCaseSpy } = makeTestTodoMocks();
    const expectedParamCall = "Usecase should be called with this";
    //Posso chamar de suv para a função que eu quero testar o valor real
    await createTodoAction(expectedParamCall); //await suv()
    expect(createTodoUseCaseSpy).toHaveBeenCalledExactlyOnceWith(
      expectedParamCall,
    );
  });
  test("deve chamar o revalidatePath se o usecase retornar sucesso", async () => {
    const { revalidatePathMocked } = makeTestTodoMocks();
    const description = "description";
    await createTodoAction(description);
    expect(revalidatePathMocked).toHaveBeenCalledExactlyOnceWith("/");
  });
  test("deve retornar o mesmo valor do usecase em caso de sucesso", async () => {
    const { successResult } = makeTestTodoMocks();
    const description = "description";

    const result = await createTodoAction(description);

    expect(result).toStrictEqual(successResult);
  });
  test("deve retornar o mesmo valor do usecase em caso de erro", async () => {
    const { errorResult, createTodoUseCaseSpy } = makeTestTodoMocks();
    createTodoUseCaseSpy.mockResolvedValue(errorResult);
    const description = "description";

    const result = await createTodoAction(description);

    expect(result).toStrictEqual(errorResult);
  });
});
