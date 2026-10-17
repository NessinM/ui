import { describe, expect, it } from "bun:test";
import { filterAgentHistory } from "../../registry/default/agent/lib/filter-agent-history";

const offsite = {
  id: "offsite",
  title: "Plan the Lisbon offsite",
  updatedAt: new Date("2026-10-15T10:00:00Z"),
};
const invoices = {
  id: "invoices",
  title: "Chase overdue invoices",
  updatedAt: new Date("2026-10-17T08:00:00Z"),
};
const lisbon = {
  id: "flights",
  title: "Flights to LISBON",
  updatedAt: new Date("2026-10-16T12:00:00Z"),
};
const items = [offsite, invoices, lisbon];

describe("agent history filter", () => {
  it("lists every conversation, newest first, for an empty query", () => {
    expect(filterAgentHistory(items, "").map((item) => item.id)).toEqual([
      "invoices",
      "flights",
      "offsite",
    ]);
  });

  it("matches titles without regard to case or surrounding spaces", () => {
    expect(
      filterAgentHistory(items, "  lisbon ").map((item) => item.id),
    ).toEqual(["flights", "offsite"]);
  });

  it("returns nothing when no title matches", () => {
    expect(filterAgentHistory(items, "standup")).toEqual([]);
  });

  it("leaves the host's list in its original order", () => {
    filterAgentHistory(items, "");
    expect(items.map((item) => item.id)).toEqual([
      "offsite",
      "invoices",
      "flights",
    ]);
  });
});
