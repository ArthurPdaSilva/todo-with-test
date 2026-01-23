import { devOnlyDelay } from "@/utils/dev-only-delay";
import { revalidatePath } from "next/cache";
import { deleteTodoUseCase } from "../usecases/delete-todo.usecase";

export async function deleteTodoAction(id: string) {
  "use server";
  await devOnlyDelay(100);
  const deleteResult = await deleteTodoUseCase(id);
  if (deleteResult.success) {
    revalidatePath("/");
  }

  return deleteResult;
}
