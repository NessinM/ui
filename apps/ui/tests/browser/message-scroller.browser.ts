import { expect, test } from "@playwright/test";

test("a newly sent prompt starts near the top of the conversation", async ({
  page,
}) => {
  await page.goto("/ui/test-fixtures/message-scroller");
  await page.getByRole("button", { name: "Send prompt", exact: true }).click();
  const viewport = page.getByRole("region", {
    name: "Agent conversation",
    exact: true,
  });
  const prompt = page.getByRole("article", { name: "New prompt", exact: true });
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const row = await prompt.boundingBox();
      return Math.round((row?.y ?? -1000) - (frame?.y ?? 0));
    })
    .toBe(16);
});

test("a reply fills the space below its prompt before following the live end", async ({
  page,
}) => {
  await page.goto("/ui/test-fixtures/message-scroller");
  await page.getByRole("button", { name: "Send prompt", exact: true }).click();
  await page.getByRole("button", { name: "Start reply", exact: true }).click();
  const viewport = page.getByRole("region", {
    name: "Agent conversation",
    exact: true,
  });
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const row = await page
        .getByRole("article", { name: "New prompt", exact: true })
        .boundingBox();
      return Math.round((row?.y ?? -1000) - (frame?.y ?? 0));
    })
    .toBe(16);
  await page
    .getByRole("button", { name: "Continue reply", exact: true })
    .click();
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const row = await page
        .getByRole("article", { name: "Agent reply", exact: true })
        .boundingBox();
      return Math.round(
        (frame?.y ?? 0) +
          (frame?.height ?? 0) -
          (row?.y ?? -1000) -
          (row?.height ?? 0),
      );
    })
    .toBe(16);
});

test("reading history interrupts following and jump to latest resumes it", async ({
  page,
}) => {
  await page.goto("/ui/test-fixtures/message-scroller");
  await page.getByRole("button", { name: "Send prompt", exact: true }).click();
  await page
    .getByRole("button", { name: "Continue reply", exact: true })
    .click();
  const viewport = page.getByRole("region", {
    name: "Agent conversation",
    exact: true,
  });
  await viewport.press("Home");
  const first = page.getByRole("article", { name: "History 0", exact: true });
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const row = await first.boundingBox();
      return Math.round((row?.y ?? -1000) - (frame?.y ?? 0));
    })
    .toBe(16);
  await page.getByRole("button", { name: "More reply", exact: true }).click();
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
      ),
  );
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const row = await first.boundingBox();
      return Math.round((row?.y ?? -1000) - (frame?.y ?? 0));
    })
    .toBe(16);
  await page
    .getByRole("button", { name: "Jump to latest", exact: true })
    .click();
  await page.getByRole("button", { name: "More reply", exact: true }).click();
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const row = await page
        .getByRole("article", { name: "Agent reply", exact: true })
        .boundingBox();
      return Math.round(
        (frame?.y ?? 0) +
          (frame?.height ?? 0) -
          (row?.y ?? -1000) -
          (row?.height ?? 0),
      );
    })
    .toBe(16);
});

test("autoScroll stops ordinary following and restores it when enabled", async ({
  page,
}) => {
  await page.goto("/ui/test-fixtures/message-scroller");
  await page.getByRole("button", { name: "Send prompt", exact: true }).click();
  await page
    .getByRole("button", { name: "Continue reply", exact: true })
    .click();
  const viewport = page.getByRole("region", {
    name: "Agent conversation",
    exact: true,
  });
  const reply = page.getByRole("article", { name: "Agent reply", exact: true });
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const row = await reply.boundingBox();
      return Math.round(
        (frame?.y ?? 0) +
          (frame?.height ?? 0) -
          (row?.y ?? -1000) -
          (row?.height ?? 0),
      );
    })
    .toBe(16);
  await page
    .getByRole("button", { name: "Toggle following", exact: true })
    .click();
  const before = await reply.boundingBox();
  await page.getByRole("button", { name: "More reply", exact: true }).click();
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
      ),
  );
  await expect
    .poll(async () => Math.round((await reply.boundingBox())?.y ?? -1000))
    .toBe(Math.round(before?.y ?? 0));
  await page
    .getByRole("button", { name: "Toggle following", exact: true })
    .click();
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const row = await reply.boundingBox();
      return Math.round(
        (frame?.y ?? 0) +
          (frame?.height ?? 0) -
          (row?.y ?? -1000) -
          (row?.height ?? 0),
      );
    })
    .toBe(16);
});

test("prepending an older anchored turn preserves the row being read", async ({
  page,
}) => {
  await page.goto("/ui/test-fixtures/message-scroller");
  await page.getByRole("button", { name: "Send prompt", exact: true }).click();
  await page
    .getByRole("button", { name: "Continue reply", exact: true })
    .click();
  const viewport = page.getByRole("region", {
    name: "Agent conversation",
    exact: true,
  });
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const row = await page
        .getByRole("article", { name: "Agent reply", exact: true })
        .boundingBox();
      return Math.round(
        (frame?.y ?? 0) +
          (frame?.height ?? 0) -
          (row?.y ?? -1000) -
          (row?.height ?? 0),
      );
    })
    .toBe(16);
  await viewport.press("Home");
  const first = page.getByRole("article", { name: "History 0", exact: true });
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const row = await first.boundingBox();
      return Math.round((row?.y ?? -1000) - (frame?.y ?? 0));
    })
    .toBe(16);
  await page.getByRole("button", { name: "Load history", exact: true }).click();
  await expect(
    page.getByRole("article", { name: "Older prompt", exact: true }),
  ).toBeAttached();
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
      ),
  );
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const row = await first.boundingBox();
      return Math.round((row?.y ?? -1000) - (frame?.y ?? 0));
    })
    .toBe(16);
});

test("a saved conversation can open at the end", async ({ page }) => {
  await page.goto("/ui/test-fixtures/message-scroller");
  await page
    .getByRole("button", { name: "Open saved conversation", exact: true })
    .click();
  const viewport = page.getByRole("region", {
    name: "Agent conversation",
    exact: true,
  });
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const row = await page
        .getByRole("article", { name: "Agent reply", exact: true })
        .boundingBox();
      return Math.round(
        (frame?.y ?? 0) +
          (frame?.height ?? 0) -
          (row?.y ?? -1000) -
          (row?.height ?? 0),
      );
    })
    .toBe(16);
});

test("keyboard jump returns focus to the named viewport without token announcements", async ({
  page,
}) => {
  await page.goto("/ui/test-fixtures/message-scroller");
  await page.getByRole("button", { name: "Send prompt", exact: true }).click();
  await page
    .getByRole("button", { name: "Continue reply", exact: true })
    .click();
  const viewport = page.getByRole("region", {
    name: "Agent conversation",
    exact: true,
  });
  await expect(viewport).toHaveCount(1);
  await expect(viewport.getByRole("log")).toHaveAttribute("aria-live", "off");
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const row = await page
        .getByRole("article", { name: "Agent reply", exact: true })
        .boundingBox();
      return Math.round(
        (frame?.y ?? 0) +
          (frame?.height ?? 0) -
          (row?.y ?? -1000) -
          (row?.height ?? 0),
      );
    })
    .toBe(16);
  await viewport.press("Home");
  const jump = page.getByRole("button", {
    name: "Jump to latest",
    exact: true,
  });
  await jump.focus();
  await page.keyboard.press("Enter");
  await expect(viewport).toBeFocused();
  await expect(jump).toHaveAttribute("inert", "");
});

test("wheel scrolling releases following while a reply grows", async ({
  page,
}) => {
  await page.goto("/ui/test-fixtures/message-scroller");
  await page.getByRole("button", { name: "Send prompt", exact: true }).click();
  await page
    .getByRole("button", { name: "Continue reply", exact: true })
    .click();
  const viewport = page.getByRole("region", {
    name: "Agent conversation",
    exact: true,
  });
  const reply = page.getByRole("article", { name: "Agent reply", exact: true });
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const row = await reply.boundingBox();
      return Math.round(
        (frame?.y ?? 0) +
          (frame?.height ?? 0) -
          (row?.y ?? -1000) -
          (row?.height ?? 0),
      );
    })
    .toBe(16);
  await viewport.hover();
  await page.mouse.wheel(0, -400);
  await expect(
    page.getByRole("button", { name: "Jump to latest", exact: true }),
  ).toBeVisible();
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
      ),
  );
  const before = await reply.boundingBox();
  await page.getByRole("button", { name: "More reply", exact: true }).click();
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
      ),
  );
  await expect
    .poll(async () => Math.round((await reply.boundingBox())?.y ?? -1000))
    .toBe(Math.round(before?.y ?? 0));
});

test("reading an initially populated conversation survives Strict Mode effect replay", async ({
  page,
}) => {
  await page.goto("/ui/test-fixtures/message-scroller");
  const viewport = page.getByRole("region", {
    name: "Agent conversation",
    exact: true,
  });
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const row = await page
        .getByRole("article", { name: "History 7", exact: true })
        .boundingBox();
      return Math.round(
        (frame?.y ?? 0) +
          (frame?.height ?? 0) -
          (row?.y ?? -1000) -
          (row?.height ?? 0),
      );
    })
    .toBe(16);
  await viewport.press("Home");
  await expect(
    page.getByRole("button", { name: "Jump to latest", exact: true }),
  ).toBeVisible();
});

test("disabling following still permits new anchors and re-enabling respects a history reader", async ({
  page,
}) => {
  await page.goto("/ui/test-fixtures/message-scroller");
  await page
    .getByRole("button", { name: "Toggle following", exact: true })
    .click();
  await page.getByRole("button", { name: "Send prompt", exact: true }).click();
  const viewport = page.getByRole("region", {
    name: "Agent conversation",
    exact: true,
  });
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const row = await page
        .getByRole("article", { name: "New prompt", exact: true })
        .boundingBox();
      return Math.round((row?.y ?? -1000) - (frame?.y ?? 0));
    })
    .toBe(16);
  await viewport.press("Home");
  await expect(
    page.getByRole("button", { name: "Jump to latest", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Continue reply", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Toggle following", exact: true })
    .click();
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
      ),
  );
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const row = await page
        .getByRole("article", { name: "History 0", exact: true })
        .boundingBox();
      return Math.round((row?.y ?? -1000) - (frame?.y ?? 0));
    })
    .toBe(16);
});

test("a focused jump returns focus when a new anchored prompt makes it inactive", async ({
  page,
}) => {
  await page.goto("/ui/test-fixtures/message-scroller");
  const viewport = page.getByRole("region", {
    name: "Agent conversation",
    exact: true,
  });
  await viewport.press("Home");
  const jump = page.getByRole("button", {
    name: "Jump to latest",
    exact: true,
  });
  await jump.focus();
  await page
    .getByRole("button", { name: "Send prompt", exact: true })
    .evaluate((element) => {
      if (element instanceof HTMLElement) element.click();
    });
  await expect(
    page.locator('[data-slot="message-scroller-button"]'),
  ).toHaveAttribute("inert", "");
  await expect(viewport).toBeFocused();
});

test("navigation hooks work outside the scroll frame", async ({ page }) => {
  await page.goto("/ui/test-fixtures/message-scroller");
  await page
    .getByRole("button", { name: "Jump to first", exact: true })
    .click();
  const viewport = page.getByRole("region", {
    name: "Agent conversation",
    exact: true,
  });
  const first = page.getByRole("article", { name: "History 0", exact: true });
  await expect
    .poll(async () =>
      Math.round(
        ((await first.boundingBox())?.y ?? -1000) -
          ((await viewport.boundingBox())?.y ?? 0),
      ),
    )
    .toBe(16);
  await page
    .getByRole("button", { name: "Jump to history 3", exact: true })
    .click();
  const target = page.getByRole("article", { name: "History 3", exact: true });
  await expect
    .poll(async () =>
      Math.round(
        ((await target.boundingBox())?.y ?? -1000) -
          ((await viewport.boundingBox())?.y ?? 0),
      ),
    )
    .toBe(16);
});

test("an asynchronously loaded long conversation opens at its last prompt", async ({
  page,
}) => {
  await page.goto("/ui/test-fixtures/message-scroller?empty=1");
  const viewport = page.getByRole("region", {
    name: "Agent conversation",
    exact: true,
  });
  await expect(viewport.getByRole("article")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Load conversation", exact: true })
    .click();
  const prompt = page.getByRole("article", { name: "New prompt", exact: true });
  await expect
    .poll(async () =>
      Math.round(
        ((await prompt.boundingBox())?.y ?? -1000) -
          ((await viewport.boundingBox())?.y ?? 0),
      ),
    )
    .toBe(16);
});

test("the jump button reaches its destination without animation under reduced motion", async ({
  page,
}) => {
  await page.goto("/ui/test-fixtures/message-scroller");
  const viewport = page.getByRole("region", {
    name: "Agent conversation",
    exact: true,
  });
  const last = page.getByRole("article", { name: "History 7", exact: true });
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const row = await last.boundingBox();
      return Math.round(
        (frame?.y ?? 0) +
          (frame?.height ?? 0) -
          (row?.y ?? -1000) -
          (row?.height ?? 0),
      );
    })
    .toBe(16);
  await page
    .getByRole("button", { name: "Jump to first", exact: true })
    .click();
  await expect
    .poll(async () => {
      const frame = await viewport.boundingBox();
      const first = await page
        .getByRole("article", { name: "History 0", exact: true })
        .boundingBox();
      return Math.round((first?.y ?? -1000) - (frame?.y ?? 0));
    })
    .toBe(16);
  const jump = page.getByRole("button", {
    name: "Jump to latest",
    exact: true,
  });
  await expect(jump).toHaveAttribute("data-active", "true");
  const gap = await page
    .getByRole("button", { name: "Jump to latest", exact: true })
    .evaluate(async (element) => {
      if (!(element instanceof HTMLElement))
        throw new Error("Expected a button");
      element.click();
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
      const viewport = document.querySelector(
        '[data-slot="message-scroller-viewport"]',
      );
      if (!viewport) throw new Error("Viewport is not rendered");
      return viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop;
    });
  expect(gap).toBeLessThanOrEqual(1);
});
