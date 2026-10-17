import { expect, test } from "@playwright/test";

test.use({ reducedMotion: "no-preference" });

test("the real chat drawer sends, preserves history for a reply, and supports focused replies", async ({
  page,
}) => {
  await page.goto("/ui/test-fixtures/chat?drawer=1");
  await page.getByRole("button", { name: "Open chat", exact: true }).click();
  const viewport = page.getByRole("region", {
    name: "Conversation messages",
    exact: true,
  });
  const composer = page.getByRole("textbox", { name: "Message", exact: true });
  const gap = () =>
    viewport.evaluate((el) =>
      Math.round(el.scrollHeight - el.scrollTop - el.clientHeight),
    );
  await expect.poll(gap).toBeLessThanOrEqual(1);
  await composer.fill("Can we test this conversation?");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(
    viewport.getByText("Can we test this conversation?", { exact: true }),
  ).toBeVisible();
  await expect.poll(gap).toBeLessThanOrEqual(1);
  await viewport.press("Home");
  await expect
    .poll(() => viewport.evaluate((el) => el.scrollTop))
    .toBeLessThanOrEqual(1);
  const unread = page.getByRole("button", {
    name: "1 new message",
    exact: true,
  });
  await expect(unread).toBeVisible();
  await expect
    .poll(() => viewport.evaluate((el) => el.scrollTop))
    .toBeLessThanOrEqual(1);
  await unread.click();
  await expect.poll(gap).toBeLessThanOrEqual(1);
  const own = viewport.getByRole("article", { name: /^Sam Rivera,/ }).last();
  await own.hover();
  const more = own.getByRole("button", {
    name: "More actions for Sam Rivera's message",
    exact: true,
  });
  await more.click();
  await page
    .getByRole("menuitem", { name: "Message info", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Message info", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Back to conversation", exact: true })
    .click();
  await expect(more).toBeFocused();
  const reply = viewport.getByRole("button", { name: /Reply to Maya/ }).last();
  await reply.locator("..").hover();
  await reply.click();
  const cancel = page.getByRole("button", {
    name: "Cancel reply",
    exact: true,
  });
  await expect(cancel.first()).toBeVisible();
  await expect(composer).toBeFocused();
  await composer.fill("Thanks for the reply.");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(cancel).toHaveCount(0);
  await expect(
    viewport.getByText("Thanks for the reply.", { exact: true }),
  ).toBeVisible();
  await expect.poll(gap).toBeLessThanOrEqual(1);
});
