import type { DrizzleDatabase } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { todoTable } from "../schemas/drizzle-todo-table.schema";
import type { Todo, TodoPresenter } from "../schemas/todo.contract";
import type { TodoRepository } from "./todo.contract..repository";

export class DrizzleTodoRepository implements TodoRepository {
  private readonly db: DrizzleDatabase;
  constructor(db: DrizzleDatabase) {
    this.db = db;
  }

  async findAll(): Promise<Todo[]> {
    return await this.db.query.todo.findMany({
      orderBy: (todo, { desc }) => [
        desc(todo.createdAt),
        desc(todo.description),
      ],
    });
  }

  async create(todo: Todo): Promise<TodoPresenter> {
    const existingTodo = await this.db.query.todo.findFirst({
      where: (todoTable, { eq, or }) =>
        or(
          eq(todoTable.id, todo.id),
          eq(todoTable.description, todo.description),
        ),
    });

    if (existingTodo) {
      return {
        success: false,
        errors: ["Já existe um todo com  o Id ou a descrição informada."],
      };
    }

    await this.db.insert(todoTable).values(todo);
    return { success: true, todo: todo };
  }

  async remove(id: string): Promise<TodoPresenter> {
    const existingTodo = await this.db.query.todo.findFirst({
      where: (todoTable, { eq, or }) => or(eq(todoTable.id, id)),
    });

    if (!existingTodo) {
      return {
        success: false,
        errors: ["Todo não encontrado."],
      };
    }

    await this.db.delete(todoTable).where(eq(todoTable.id, id));
    return { success: true, todo: existingTodo };
  }
}
