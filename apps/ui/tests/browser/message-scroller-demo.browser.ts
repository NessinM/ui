import { expect, type Locator, test } from "@playwright/test";

async function offset(row: Locator, viewport: Locator) {
  const frame = await viewport.boundingBox();
  const item = await row.boundingBox();
  if (!frame || !item) throw new Error("Expected visible message and viewport");
  return Math.round(item.y - frame.y);
}

test.use({ reducedMotion: "no-preference" });

test("the streaming demo sends editable prompts, anchors follow-ups, and resets", async ({
  page,
}) => {
  await page.goto("/ui/docs/components/message-scroller");
  const viewport = page.getByRole("region", {
    name: "Workshop conversation",
    exact: true,
  });
  await expect(
    viewport.getByText("Send a prompt to start a conversation."),
  ).toBeVisible();
  const draft = page.getByRole("textbox", { name: "Message", exact: true });
  const send = page.getByRole("button", { name: "Send", exact: true });
  await send.click();
  await expect(
    viewport.getByText("Help me plan a team workshop."),
  ).toBeVisible();
  await expect(
    page.getByText("Writing a reply…", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Writing a reply…", { exact: true })).toHaveCount(
    0,
    { timeout: 10000 },
  );
  await draft.fill("How should we follow up?");
  await send.click();
  const prompt = viewport
    .getByText("How should we follow up?", { exact: true })
    .locator("..");
  await expect.poll(() => offset(prompt, viewport)).toBe(16);
  await viewport.press("Home");
  await expect(
    page.getByRole("button", { name: "Jump to latest", exact: true }),
  ).toBeVisible();
  const first = viewport
    .getByText("Help me plan a team workshop.")
    .locator("..");
  await expect(page.getByText("Writing a reply…", { exact: true })).toHaveCount(
    0,
    { timeout: 10000 },
  );
  await expect.poll(() => offset(first, viewport)).toBe(16);
  await page
    .getByRole("button", { name: "Jump to latest", exact: true })
    .click();
  await expect(
    viewport.locator("..").locator('[data-slot="message-scroller-button"]'),
  ).toHaveAttribute("data-active", "false");
  const newChat = page.getByRole("button", { name: "New chat", exact: true });
  await newChat.click();
  await expect(
    viewport.getByText("Send a prompt to start a conversation."),
  ).toBeVisible();
  await expect(
    viewport.getByText("How should we follow up?", { exact: true }),
  ).toHaveCount(0);
  await expect(draft).toHaveValue("Help me plan a team workshop.");
});

test("the saved demo navigates by message ID and preserves reading when loading history", async ({
  page,
}) => {
  await page.goto("/ui/docs/components/message-scroller");
  const viewport = page.getByRole("region", {
    name: "Saved workshop conversation",
    exact: true,
  });
  const last = viewport
    .getByText("How should we follow up afterward?", { exact: true })
    .locator("..");
  await expect.poll(() => offset(last, viewport)).toBe(16);
  await page.getByRole("button", { name: "Go to agenda", exact: true }).click();
  const agenda = viewport
    .getByText("Can you suggest an agenda?", { exact: true })
    .locator("..");
  await expect.poll(() => offset(agenda, viewport)).toBe(16);
  await page
    .getByRole("button", { name: "Load earlier messages", exact: true })
    .click();
  await expect(
    viewport.getByText("Earlier note 1:", { exact: false }),
  ).toBeAttached();
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
      ),
  );
  await expect.poll(() => offset(agenda, viewport)).toBe(16);
  await page.getByRole("button", { name: "Start", exact: true }).click();
  const first = viewport
    .getByText("What should our workshop achieve?", { exact: true })
    .locator("..");
  await expect.poll(() => offset(first, viewport)).toBe(16);
});

test("the human chat demo follows new messages at the bottom and preserves history reading", async ({
  page,
}) => {
  await page.goto("/ui/docs/components/message-scroller#human-chat");
  const viewport = page.getByRole("region", {
    name: "Team conversation",
    exact: true,
  });
  await expect(viewport).toBeVisible();
  const receive = page.getByRole("button", {
    name: "Receive a message",
    exact: true,
  });
  await receive.click();
  const incoming = viewport
    .getByText("I’ve added the meeting notes to our shared folder.", {
      exact: true,
    })
    .locator("..");
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const row = await incoming.boundingBox();
      return Math.round(
        (frame?.y ?? 0) +
          (frame?.height ?? 0) -
          (row?.y ?? -1000) -
          (row?.height ?? 0),
      );
    })
    .toBe(16);
  await expect.poll(() => offset(incoming, viewport)).toBeGreaterThan(100);
  await viewport.press("Home");
  const first = viewport
    .getByText("Are we still meeting at ten tomorrow?", { exact: true })
    .locator("..");
  await expect.poll(() => offset(first, viewport)).toBe(16);
  await receive.click();
  await expect(
    viewport.getByText("The room is booked. We’ll have a whiteboard too.", {
      exact: true,
    }),
  ).toBeAttached();
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
      ),
  );
  await expect.poll(() => offset(first, viewport)).toBe(16);
  await page
    .getByRole("button", { name: "Latest chat messages", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Chat message", exact: true })
    .fill("Thanks, see you tomorrow!");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  const sent = viewport
    .getByText("Thanks, see you tomorrow!", { exact: true })
    .locator("..");
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const row = await sent.boundingBox();
      return Math.round(
        (frame?.y ?? 0) +
          (frame?.height ?? 0) -
          (row?.y ?? -1000) -
          (row?.height ?? 0),
      );
    })
    .toBe(16);
});
