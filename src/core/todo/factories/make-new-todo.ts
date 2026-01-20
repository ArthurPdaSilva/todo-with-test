export interface Todo {
  id: string;
  description: string;
  createdAt: string;
}

export function makeNewTodo(description: string): Todo {
  return {
    id: crypto.randomUUID(),
    description,
    createdAt: new Date().toISOString(),
  };
}
