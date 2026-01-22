import { sanitizeStr } from "@/utils/sanitize-str";
import type { TodoPresenter } from "../schemas/todo.contract";
import { validateTodoDescription } from "../schemas/validate-todo-description";
import { makeNewTodo } from "./make-new-todo";

export function makeValidatedTodo(description: string): TodoPresenter {
  const cleanedDescription = sanitizeStr(description);
  const validatedDescription = validateTodoDescription(cleanedDescription);

  if (validatedDescription.success) {
    return {
      success: true,
      todo: makeNewTodo(cleanedDescription),
    };
  }

  return {
    success: false,
    errors: validatedDescription.errors,
  };
}
