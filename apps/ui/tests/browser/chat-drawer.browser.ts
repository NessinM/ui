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

test("typing and resizing at the bottom never flashes jump to latest", async ({
  page,
}) => {
  await page.setViewportSize({ width: 393, height: 852 });
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
  await expect(viewport.getByRole("article").last()).toBeVisible();
  await expect.poll(gap).toBeLessThanOrEqual(1);
  // A settled screenshot alone cannot catch a button that appears for one frame.
  await page.evaluate(() => {
    const root = document.documentElement;
    root.setAttribute("data-jump-flashes", "0");
    new MutationObserver((records) => {
      for (const record of records)
        for (const node of record.addedNodes) {
          if (
            node instanceof Element &&
            (node.matches('[data-slot="chat-jump-to-latest"]') ||
              node.querySelector('[data-slot="chat-jump-to-latest"]'))
          ) {
            root.setAttribute(
              "data-jump-flashes",
              String(Number(root.getAttribute("data-jump-flashes")) + 1),
            );
          }
        }
    }).observe(document.body, { childList: true, subtree: true });
  });
  await composer.fill(
    "A message long enough to wrap onto a second line in the mobile composer.",
  );
  await expect.poll(gap).toBeLessThanOrEqual(1);
  // Observe a full settling window; polling alone can pass during oscillation.
  await page.waitForTimeout(500);
  const gaps = await viewport.evaluate(async (element) => {
    const values = [];
    for (let frame = 0; frame < 12; frame++) {
      await new Promise(requestAnimationFrame);
      values.push(
        Math.round(
          element.scrollHeight - element.scrollTop - element.clientHeight,
        ),
      );
    }
    return values;
  });
  expect(Math.max(...gaps)).toBeLessThanOrEqual(1);
  await expect(page.locator("html")).toHaveAttribute("data-jump-flashes", "0");
  await expect.poll(gap).toBeLessThanOrEqual(1);
  await composer.fill("");
  await page.setViewportSize({ width: 852, height: 393 });
  await expect(viewport.getByRole("article").last()).toBeVisible();
  await expect.poll(gap).toBeLessThanOrEqual(1);
  await expect(page.locator("html")).toHaveAttribute("data-jump-flashes", "0");
  await viewport.press("Home");
  await expect
    .poll(() => viewport.evaluate((el) => el.scrollTop))
    .toBeLessThanOrEqual(1);
  await composer.fill(
    "Typing while reading earlier messages must keep my place. ".repeat(3),
  );
  await page.waitForTimeout(500);
  await expect
    .poll(() => viewport.evaluate((el) => el.scrollTop))
    .toBeLessThanOrEqual(1);
  await expect(
    page.getByRole("button", { name: "Jump to latest", exact: true }),
  ).toBeVisible();
});
