import { sanitizeStr } from "@/utils/sanitize-str";
import { todoRepository } from "../repositories/default.repository";

export async function deleteTodoUseCase(id: string) {
  const sanitizedId = sanitizeStr(id);

  if (!sanitizedId) {
    return {
      success: false,
      errors: ["ID inválido"],
    };
  }

  const deleteResult = await todoRepository.remove(sanitizedId);
  return deleteResult;
}
