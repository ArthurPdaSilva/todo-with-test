export type ValidateTodoDescription = {
  success: boolean;
  errors: string[];
};

export function validateTodoDescription(
  description: string,
): ValidateTodoDescription {
  const errors = [];

  if (description.length <= 3) {
    errors.push("A descrição deve ter mais de 3 caracteres");
  }

  return { success: errors.length === 0, errors };
}
