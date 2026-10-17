import { describe, expect, it } from "bun:test";
import {
  assignRef,
  resolveDialogContainer,
} from "../../registry/default/ui/combobox";

type FakeNode = {
  attributes: Record<string, string>;
  parentElement: FakeNode | null;
  getAttribute(name: string): string | null;
};

function node(
  attributes: Record<string, string>,
  parentElement: FakeNode | null = null,
): FakeNode {
  return {
    attributes,
    parentElement,
    getAttribute(name) {
      return this.attributes[name] ?? null;
    },
  };
}

describe("resolveDialogContainer", () => {
  it("returns the enclosing dialog for an anchor inside it", () => {
    const dialog = node({ role: "dialog" });
    const anchor = node({}, dialog);

    expect(resolveDialogContainer<FakeNode>(anchor)).toBe(dialog);
  });

  it("treats an alertdialog as a container too", () => {
    const dialog = node({ role: "alertdialog" });
    const anchor = node({}, dialog);

    expect(resolveDialogContainer<FakeNode>(anchor)).toBe(dialog);
  });

  it("returns null when the anchor has no dialog ancestor", () => {
    const anchor = node({}, node({ role: "region" }));

    expect(resolveDialogContainer<FakeNode>(anchor)).toBeNull();
  });

  it("returns null for a missing anchor", () => {
    expect(resolveDialogContainer<FakeNode>(null)).toBeNull();
  });

  it("skips a nested combobox popup to portal into the outer dialog", () => {
    const outerDialog = node({ role: "dialog" });
    const popup = node(
      { role: "dialog", "data-slot": "combobox-popup" },
      outerDialog,
    );
    const anchor = node({}, popup);

    expect(resolveDialogContainer<FakeNode>(anchor)).toBe(outerDialog);
  });

  it("never resolves a popup as its own container when no outer dialog exists", () => {
    const popup = node({ role: "dialog", "data-slot": "combobox-popup" });
    const anchor = node({}, popup);

    expect(resolveDialogContainer<FakeNode>(anchor)).toBeNull();
  });
});

describe("assignRef", () => {
  it("passes the node to a callback ref", () => {
    const seen: Array<HTMLElement | null> = [];
    const node = { tagName: "DIV" } as HTMLElement;

    const record = (value: HTMLElement | null) => {
      seen.push(value);
    };

    assignRef<HTMLElement>(record, node);
    assignRef<HTMLElement>(record, null);

    expect(seen).toEqual([node, null]);
  });

  it("writes the node onto an object ref", () => {
    const ref = { current: null as HTMLElement | null };
    const node = { tagName: "DIV" } as HTMLElement;

    assignRef(ref, node);

    expect(ref.current).toBe(node);
  });

  it("ignores a missing ref", () => {
    expect(() =>
      assignRef(undefined, { tagName: "DIV" } as HTMLElement),
    ).not.toThrow();
    expect(() =>
      assignRef(null, { tagName: "DIV" } as HTMLElement),
    ).not.toThrow();
  });
});
