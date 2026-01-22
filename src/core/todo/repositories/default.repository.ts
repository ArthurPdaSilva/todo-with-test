import { drizzleDatabase } from "@/db/drizzle";
import { DrizzleTodoRepository } from "./drizzle-todo.repository";
import type { TodoRepository } from "./todo.contract..repository";

export const todoRepository: TodoRepository = new DrizzleTodoRepository(
  drizzleDatabase.db,
);
