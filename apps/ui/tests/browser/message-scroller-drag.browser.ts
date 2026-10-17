import { expect, type Page, test } from "@playwright/test";

async function historyOffset(page: Page) {
  return page
    .getByRole("article", { name: "History 0", exact: true })
    .evaluate(
      (element) =>
        element.getBoundingClientRect().top -
        (element.closest('[role="region"]')?.getBoundingClientRect().top ?? 0),
    );
}

for (const native of [false, true]) {
  test(`scrollbar drag releases a short anchored turn (${native ? "upstream scroll-only path" : "Base UI thumb"})`, async ({
    page,
  }) => {
    await page.goto(
      `/ui/test-fixtures/message-scroller${native ? "?native=1" : ""}`,
    );
    await page
      .getByRole("button", { name: "Send prompt", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Start reply", exact: true })
      .click();
    const viewport = page.getByRole("region", {
      name: "Agent conversation",
      exact: true,
    });
    const prompt = page.getByRole("article", {
      name: "New prompt",
      exact: true,
    });
    await expect
      .poll(async () =>
        Math.round(
          ((await prompt.boundingBox())?.y ?? -1000) -
            ((await viewport.boundingBox())?.y ?? 0),
        ),
      )
      .toBe(16);
    await viewport.hover();
    if (native) {
      // A native scrollbar changes scrollTop without wheel/touch/key events.
      // Drive that public DOM path directly; Base UI below uses the real thumb.
      await viewport.evaluate((element) => {
        element.scrollTop = 0;
      });
    } else {
      const thumb = page.locator(
        '[data-slot="scroll-area-scrollbar"][data-orientation="vertical"] [data-slot="scroll-area-thumb"]',
      );
      const box = await thumb.boundingBox();
      if (!box) throw new Error("Scrollbar thumb is not rendered");
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2, box.y - 250, { steps: 12 });
    }
    await page.mouse.up();
    await expect.poll(() => historyOffset(page)).toBe(16);
    await page
      .getByRole("button", { name: "Continue reply", exact: true })
      .click();
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
        ),
    );
    test.fail(
      true,
      "@shadcn/react 0.3.1 retains its anchor after scroll-only interruption; no public release API.",
    );
    await expect.poll(() => historyOffset(page)).toBe(16);
  });
}
