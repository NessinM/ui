# MessageScroller browser tests

Run from the repository root:

```sh
bun install --frozen-lockfile
cd apps/ui
bunx playwright install chromium firefox webkit
bun run test:browser
```

CI installs browser system dependencies with `playwright install --with-deps`.
The suite starts its own Next development server on port 4020 with Strict Mode
enabled. The fixture route requires development mode and `COSS_BROWSER_TESTS=1`;
it returns 404 otherwise. Specs use `.browser.ts` so Bun does not discover them.

## Public boundary

Tests compose the six public parts and exercise the exported navigation hooks.
They use the actual registry source, @shadcn/react 0.3.1, Base UI 1.9.0, and browser
layout, without mocking the scroll engine, observers, or geometry. Fixed-height
fixture bodies make message positions independent of font metrics. Separate
checks exercise the real documentation demos, including sending custom prompts,
resetting, opening saved history, navigating by message ID, and human-chat
bottom following without anchors.

Coverage includes prompt anchoring, short-to-long reply growth, wheel and keyboard
interruption, jump/resume, controlled following, prepend preservation, saved and
empty-to-populated initialization, focus, and reduced-motion navigation. Fixture
checks use reduced motion; documentation demos run with normal motion. The suite
does not replace screen-reader or physical touch-device testing.

## Provider defaults and application choices

Provider options retain upstream defaults: autoScroll=false, opening=end,
edge threshold=8, previous-item peek=64, scroll margin=0. The streaming demo and
fixture explicitly choose a zero edge threshold so a small keyboard movement
away from the end releases following. This is not imposed by the component.

`autoScroll=false` follows upstream semantics: it disables ordinary following,
not anchors, initial positioning, explicit navigation, or prepend compensation.
Full dialog suspension remains outside this release. Conversation changes/reset
remount the provider; the removed wrapper’s frozen opening preference and custom
duplicate-ID warning are no longer part of the API.

## Known upstream regression

`message-scroller-drag.browser.ts` reproduces an anchored turn pulling a reader
back after scrollbar interruption and subsequent reply growth. It tests both the
actual Base UI thumb and the upstream viewport’s scroll-only DOM path with the
same content. The native comparison sets scrollTop directly; it is not a claim
of automated native-thumb input coverage.

These are expected-failing tests, not passing behavior checks. They first verify
that the reader reached history, then mark only the final preservation check as
an expected failure. A future upstream fix causes an unexpected pass and requires
removing the annotation. Do not interpret a green suite as proof this bug is fixed.

The package provides no public release-anchor command. coss does not dispatch
synthetic wheel events, manipulate private controller state, patch the dependency,
or maintain a competing scroll engine to hide the limitation.
