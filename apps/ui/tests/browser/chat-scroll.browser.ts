import { expect, type Locator, test } from "@playwright/test";

async function top(row: Locator, viewport: Locator) {
  const frame = await viewport.boundingBox();
  const item = await row.boundingBox();
  if (!frame || !item) throw new Error("Expected chat layout");
  return Math.round(item.y - frame.y);
}

async function settle(viewport: Locator) {
  await viewport.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
      ),
  );
}

test("chat preserves the visible message when older history is prepended", async ({
  page,
}) => {
  await page.goto("/ui/test-fixtures/chat");
  const viewport = page.getByRole("region", { name: "Test chat", exact: true });
  await expect
    .poll(() =>
      top(viewport.getByText("Message 11", { exact: true }), viewport),
    )
    .toBe(238);
  await viewport.press("Home");
  const first = viewport.getByText("Message 0", { exact: true });
  await expect.poll(() => top(first, viewport)).toBe(0);
  await page.getByRole("button", { name: "Load older", exact: true }).click();
  await expect(viewport.getByText("Older message")).toBeAttached();
  await settle(viewport);
  await expect.poll(() => top(first, viewport)).toBe(0);
});

async function expectAtEnd(viewport: Locator, row: Locator) {
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const item = await row.boundingBox();
      if (!frame || !item) throw new Error("Expected chat layout");
      return Math.round(frame.y + frame.height - item.y - item.height);
    })
    .toBe(16);
}

test("chat follows incoming messages at the end, retains history and unread counts, and jumps back", async ({
  page,
}) => {
  await page.goto("/ui/test-fixtures/chat");
  const viewport = page.getByRole("region", { name: "Test chat", exact: true });
  await expectAtEnd(
    viewport,
    viewport.getByText("Message 11", { exact: true }),
  );
  await page.getByRole("button", { name: "Receive", exact: true }).click();
  await expectAtEnd(
    viewport,
    viewport.getByText("Received 12", { exact: true }),
  );
  await viewport.press("Home");
  const first = viewport.getByText("Message 0", { exact: true });
  await expect.poll(() => top(first, viewport)).toBe(0);
  await page.getByRole("button", { name: "Receive", exact: true }).click();
  await expect(
    viewport.getByText("Received 13", { exact: true }),
  ).toBeAttached();
  await settle(viewport);
  await expect.poll(() => top(first, viewport)).toBe(0);
  const jump = page.getByRole("button", { name: "1 unread", exact: true });
  await jump.click();
  await expectAtEnd(
    viewport,
    viewport.getByText("Received 13", { exact: true }),
  );
  await expect(jump).toHaveCount(0);
  await expect(viewport).toBeFocused();
});

test("sending from history returns to the new message without top anchoring", async ({
  page,
}) => {
  await page.goto("/ui/test-fixtures/chat");
  const viewport = page.getByRole("region", { name: "Test chat", exact: true });
  await expectAtEnd(
    viewport,
    viewport.getByText("Message 11", { exact: true }),
  );
  await viewport.press("Home");
  await expect
    .poll(() => top(viewport.getByText("Message 0", { exact: true }), viewport))
    .toBe(0);
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expectAtEnd(viewport, viewport.getByText("Sent 12", { exact: true }));
});

test("paused chat holds incoming messages and waits to navigate until the interaction resumes", async ({
  page,
}) => {
  await page.goto("/ui/test-fixtures/chat");
  const viewport = page.getByRole("region", { name: "Test chat", exact: true });
  const previous = viewport.getByText("Message 11", { exact: true });
  await expectAtEnd(viewport, previous);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await page.getByRole("button", { name: "Receive", exact: true }).click();
  await settle(viewport);
  await expectAtEnd(viewport, previous);
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await settle(viewport);
  await expectAtEnd(viewport, previous);
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await expectAtEnd(viewport, viewport.getByText("Sent 13", { exact: true }));
});

test("conversation resets honor start and end and manual return to the end resumes following", async ({
  page,
}) => {
  await page.goto("/ui/test-fixtures/chat");
  const viewport = page.getByRole("region", { name: "Test chat", exact: true });
  await expectAtEnd(
    viewport,
    viewport.getByText("Message 11", { exact: true }),
  );
  await page
    .getByRole("button", { name: "Reset to start", exact: true })
    .click();
  await expect
    .poll(() => top(viewport.getByText("Message 0", { exact: true }), viewport))
    .toBe(0);
  await viewport.press("End");
  await expectAtEnd(
    viewport,
    viewport.getByText("Message 11", { exact: true }),
  );
  await page.getByRole("button", { name: "Receive", exact: true }).click();
  await expectAtEnd(
    viewport,
    viewport.getByText("Received 12", { exact: true }),
  );
  await viewport.press("Home");
  await expect
    .poll(() => top(viewport.getByText("Message 0", { exact: true }), viewport))
    .toBe(0);
  await page.getByRole("button", { name: "Reset to end", exact: true }).click();
  await expectAtEnd(
    viewport,
    viewport.getByText("Received 12", { exact: true }),
  );
});

test("dragging the Base UI scrollbar releases following before new messages arrive", async ({
  page,
}) => {
  await page.goto("/ui/test-fixtures/chat");
  const viewport = page.getByRole("region", { name: "Test chat", exact: true });
  await expectAtEnd(
    viewport,
    viewport.getByText("Message 11", { exact: true }),
  );
  await viewport.hover();
  const thumb = page.locator(
    '[data-slot="scroll-area-scrollbar"][data-orientation="vertical"] [data-slot="scroll-area-thumb"]',
  );
  const box = await thumb.boundingBox();
  if (!box) throw new Error("Expected scrollbar thumb");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y - 250, { steps: 12 });
  await page.mouse.up();
  const first = viewport.getByText("Message 0", { exact: true });
  await expect.poll(() => top(first, viewport)).toBe(0);
  await page.getByRole("button", { name: "Receive", exact: true }).click();
  await settle(viewport);
  await expect.poll(() => top(first, viewport)).toBe(0);
  await expect(
    page.getByRole("button", { name: "1 unread", exact: true }),
  ).toBeVisible();
});
