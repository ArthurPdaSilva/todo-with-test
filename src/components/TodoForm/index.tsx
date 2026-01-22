"use client";
import type { CreateTodoAction } from "@/core/todo/actions/todo.action.types";
import { sanitizeStr } from "@/utils/sanitize-str";
import { CirclePlusIcon } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { Button } from "../Button";
import { InputText } from "../InputText";

export type TodoFormProps = {
  action: CreateTodoAction;
};

export function TodoForm({ action }: TodoFormProps) {
  const [isPending, startTransition] = useTransition();
  const [inputError, setInputError] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.stopPropagation();

    const input = ref.current;
    if (!input) return;
    const description = sanitizeStr(input.value);

    startTransition(async () => {
      const result = await action(description);
      if (!result.success) {
        setInputError(result.errors[0]);
        return;
      }

      input.value = "";
      setInputError("");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-6">
      <InputText
        name="description"
        labelText="Tarefa"
        placeholder="Digite sua tarefa"
        disabled={isPending}
        errorMessage={inputError}
        ref={ref}
      />

      <Button type="submit" disabled={isPending}>
        <CirclePlusIcon />
        {!isPending && <span>Criar tarefa</span>}
        {isPending && <span>Criando tarefa...</span>}
      </Button>
    </form>
  );
}
