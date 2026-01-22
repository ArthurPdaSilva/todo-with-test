import { revalidatePath } from "next/cache";
import { createTodoUseCase } from "../usecases/create-todo.usecase";

export async function createTodoAction(description: string) {
  "use server";
  // Client Component
  // useActionState -> forms -> params: state: any, formData: FormData -> return state
  // useTransition -> any -> params: any -> return any
  // useOptimistic -> any -> params: state, updateFn(currentValue, optimistValue)
  const createResult = await createTodoUseCase(description);
  if (createResult.success) {
    revalidatePath("/");
  }

  return createResult;
}
