import { createTodoAction } from "@/core/todo/actions/create-todo.action";
import { deleteTodoAction } from "@/core/todo/actions/delete-todo.action";
import { todoRepository } from "@/core/todo/repositories/default.repository";
import { TodoForm } from "../TodoForm";
import { TodoList } from "../TodoList";

export async function TodoContainer() {
  const todos = await todoRepository.findAll();

  return (
    <div className="max-w-md mx-auto p-8">
      <TodoList action={deleteTodoAction} todos={todos} />
      <TodoForm action={createTodoAction} />
    </div>
  );
}
