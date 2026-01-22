import type { createTodoAction } from "./create-todo.action";
import type { deleteTodoAction } from "./delete-todo.action";

export type CreateTodoAction = typeof createTodoAction;
export type DeleteTodoAction = typeof deleteTodoAction;
