import {
  insertTestTodos,
  makeTestTodoRepository,
} from "@/core/__tests__/utils/make-test-todo.repository";
import { expect, type Page, test } from "@playwright/test";

const HOME_URL = "/";
const HEADING = "Lista de tarefas";
const INPUT = "Tarefa";
const BUTTON = "Criar tarefa";
const BUTTON_BUSY = "Criando tarefa...";
const NEW_TODO_TEXT = "New Todo";

const getHeading = (p: Page) => p.getByRole("heading", { name: HEADING });
const getInput = (p: Page) => p.getByRole("textbox", { name: INPUT });
const getBtn = (p: Page) => p.getByRole("button", { name: BUTTON });
const getBtnBusy = (p: Page) => p.getByRole("button", { name: BUTTON_BUSY });

const getAll = (p: Page) => ({
  heading: getHeading(p),
  input: getInput(p),
  btn: getBtn(p),
  btnBusy: getBtnBusy(p),
});

test.beforeEach(async ({ page }) => {
  const { deleteTodoNoWhereDb } = await makeTestTodoRepository();
  await deleteTodoNoWhereDb();

  await page.goto(HOME_URL);
});

test.afterAll(async () => {
  const { deleteTodoNoWhereDb } = await makeTestTodoRepository();
  await deleteTodoNoWhereDb();
});

test.describe("<Home /> (E2E)", () => {
  test.describe("Renderização", () => {
    //A maioria das coisas que usamos no navegador é async
    test("deve ter o title da página correto", async ({ page }) => {
      // await page.waitForTimeout(5000); //isso aqui é só exemplo
      // await expect(page).toHaveTitle('Home');
      // Ou
      const title = await page.title();
      expect(title).toBe("Home");
    });

    test("deve renderizar o cabeçalho, o input e o botão para criar TODOs", async ({
      page,
    }) => {
      await expect(getHeading(page)).toBeVisible();
      await expect(getInput(page)).toBeVisible();
      await expect(getBtn(page)).toBeVisible();
    });
  });
  test.describe("Criação", () => {
    test("deve permitir criar um TODO", async ({ page }) => {
      const { btn, input } = getAll(page);
      await input.fill(NEW_TODO_TEXT);
      await btn.click();

      // const createdTodo = page.getByText(NEW_TODO_TEXT);
      const createdTodo = page
        .getByRole("listitem")
        .filter({ hasText: NEW_TODO_TEXT });
      await expect(createdTodo).toBeVisible();
    });

    test("deve fazer o trim da descrição do input", async ({ page }) => {
      const { btn, input } = await getAll(page);
      const textoToBeTrimmed = ` ${NEW_TODO_TEXT}   `;
      const trimmedText = textoToBeTrimmed.trim();
      await input.fill(textoToBeTrimmed);
      await btn.click();
      const createdTodo = page
        .getByRole("listitem")
        .filter({ hasText: trimmedText });
      const createdTodoText = await createdTodo.textContent();
      expect(createdTodoText).toBe(trimmedText);
    });

    test("deve permitir que eu crie mais de um TODO", async ({ page }) => {
      const { btn, input } = getAll(page);
      const todos = [NEW_TODO_TEXT, "Segundo TODO"];

      await input.fill(todos[0]);
      await btn.click();

      await input.fill(todos[1]);
      await btn.click();

      const todo1 = page.getByRole("listitem").filter({ hasText: todos[0] });
      const todo2 = page.getByRole("listitem").filter({ hasText: todos[1] });

      await expect(todo1).toBeVisible();
      await expect(todo2).toBeVisible();
    });

    // test.only só vai rodar o teste
    test("deve desativar o botão enquanto cria um TODO", async ({ page }) => {
      const { btn, input } = getAll(page);
      await input.fill(NEW_TODO_TEXT);
      await btn.click();

      await expect(getBtnBusy(page)).toBeVisible();
      await expect(getBtnBusy(page)).toBeDisabled();

      const createdTodo = page
        .getByRole("listitem")
        .filter({ hasText: NEW_TODO_TEXT });
      await expect(createdTodo).toBeVisible();
      await expect(btn).toBeVisible();
      await expect(btn).toBeEnabled();
    });

    test("deve desativar o input enquanto cria um TODO", async ({ page }) => {
      const { btn, input } = getAll(page);
      await input.fill(NEW_TODO_TEXT);
      await btn.click();

      await expect(input).toBeDisabled();

      const createdTodo = page
        .getByRole("listitem")
        .filter({ hasText: NEW_TODO_TEXT });
      await expect(createdTodo).toBeVisible();
      await expect(input).toBeEnabled();
    });

    test("deve limpar o input após criar um todo", async ({ page }) => {
      const { btn, input } = getAll(page);
      await input.fill(NEW_TODO_TEXT);
      await btn.click();

      await expect(input).toHaveValue("");
    });
  });

  test.describe("Exclusão", () => {
    test("deve permitir apagar um todo", async ({ page }) => {
      const todos = await insertTestTodos();
      await page.reload(); //só to dando reload, pq o nextjs as vezes da um caching mesmo dizendo q n
      const itemToDelete = page
        .getByRole("listitem")
        .filter({ hasText: todos[1].description });
      await expect(itemToDelete).toBeVisible();

      const deleteBtn = itemToDelete.getByRole("button");
      await deleteBtn.click();

      await itemToDelete.waitFor({ state: "detached" });
      await expect(itemToDelete).not.toBeVisible();
    });

    test("deve permitir apagar todos os TODOs", async ({ page }) => {
      await insertTestTodos();
      await page.reload();

      while (true) {
        const item = page.getByRole("listitem").first();
        const isVisible = await item.isVisible().catch(() => false);
        if (!isVisible) break;

        const text = await item.textContent();
        if (!text) {
          throw Error("Texto do item não foi encontrado");
        }

        const deleteBtn = item.getByRole("button");
        await deleteBtn.click();

        const renewedItem = page
          .getByRole("listitem")
          .filter({ hasText: text });
        await renewedItem.waitFor({ state: "detached" });
        await expect(renewedItem).not.toBeVisible();
      }
    });

    test("deve desativar os items da lista enquanto envia a action", async ({
      page,
    }) => {
      await insertTestTodos();
      await page.reload();

      const itemToDelete = page.getByRole("listitem").first();
      const itemToBeDeleteText = await itemToDelete.textContent();
      if (!itemToBeDeleteText) {
        throw Error("Texto do item não foi encontrado");
      }

      const deleteBtn = itemToDelete.getByRole("button");
      await deleteBtn.click();

      const allDeleteButtons = await page
        .getByRole("button", { name: /^apagar:/i })
        .all();
      for (const btn of allDeleteButtons) {
        await expect(btn).toBeDisabled();
      }

      const deleteItemNotVisible = page.getByRole("listitem").filter({
        hasText: itemToBeDeleteText,
      });

      await deleteItemNotVisible.waitFor({ state: "detached" });
      await expect(deleteItemNotVisible).not.toBeVisible();

      const renewedAllButton = await page
        .getByRole("button", { name: /^apagar:/i })
        .all();

      for (const btn of renewedAllButton) {
        await expect(btn).toBeEnabled();
      }
    });
  });

  test.describe("Erros", () => {
    test("deve mostrar erro se a descrção tem 3 ou menos caracteres", async ({
      page,
    }) => {
      const { input, btn } = getAll(page);

      await input.fill("abc");
      await btn.click();

      const errorText = "A descrição deve ter mais de 3 caracteres";
      const error = page.getByText(errorText);

      // attached é quando o elemento entra na DOM e detached é quando ele sai da DOM
      await error.waitFor({ state: "attached", timeout: 5000 });
      await expect(error).toBeVisible();
    });

    test("deve mostrar erro se um TODO já existir com a mesma descrição", async ({
      page,
    }) => {
      const { input, btn } = getAll(page);

      await input.fill("eu já existo");
      await btn.click();
      await input.fill("eu já existo");
      await btn.click();

      const errorText = "Já existe um todo com o Id ou a descrição informada.";
      const error = page.getByText(errorText);

      await error.waitFor({ state: "attached", timeout: 5000 });
      await expect(error).toBeVisible();
    });

    test("deve remover o erro da tela quando o usuário corrigir o erro", async ({
      page,
    }) => {
      const { input, btn } = getAll(page);

      await input.fill("abc");
      await btn.click();

      const errorText = "A descrição deve ter mais de 3 caracteres";
      const error = page.getByText(errorText);

      await error.waitFor({ state: "attached", timeout: 5000 });
      await expect(error).toBeVisible();

      await input.fill("Essa descrição é válida");
      await btn.click();

      await error.waitFor({ state: "detached", timeout: 5000 });
      await expect(error).not.toBeVisible();
    });
  });
});
