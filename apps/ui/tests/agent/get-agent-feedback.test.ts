import { describe, expect, it } from "bun:test";
import {
  getAgentFeedbackAction,
  getAgentFeedbackSubmission,
} from "../../registry/default/agent/lib/get-agent-feedback";

describe("agent feedback action", () => {
  it("submits a thumbs up straight away", () => {
    expect(getAgentFeedbackAction(null, "positive")).toEqual({
      type: "submit",
      feedback: { details: "", rating: "positive", reasons: [] },
    });
  });

  it("asks for details before submitting a thumbs down", () => {
    expect(getAgentFeedbackAction(null, "negative")).toEqual({
      type: "describe",
    });
    expect(getAgentFeedbackAction("positive", "negative")).toEqual({
      type: "describe",
    });
  });

  it("clears the rating when the shown rating is pressed again", () => {
    expect(getAgentFeedbackAction("positive", "positive")).toEqual({
      type: "clear",
    });
    expect(getAgentFeedbackAction("negative", "negative")).toEqual({
      type: "clear",
    });
  });
});

describe("agent feedback submission", () => {
  it("submits the picked reasons and trimmed details", () => {
    expect(
      getAgentFeedbackSubmission({
        reasons: ["wrong_time"],
        details: "  It booked 3 pm, not 3 am.  ",
        reasonsOffered: true,
      }),
    ).toEqual({
      rating: "negative",
      reasons: ["wrong_time"],
      details: "It booked 3 pm, not 3 am.",
    });
  });

  it("caps the details at the max length after trimming", () => {
    expect(
      getAgentFeedbackSubmission({
        reasons: [],
        details: "  abcdefgh  ",
        reasonsOffered: false,
        detailsMaxLength: 5,
      })?.details,
    ).toBe("abcde");
  });

  it("waits for a reason when reasons are offered", () => {
    expect(
      getAgentFeedbackSubmission({
        reasons: [],
        details: "Something else",
        reasonsOffered: true,
      }),
    ).toBeNull();
  });

  it("submits a bare thumbs down when no reasons are offered", () => {
    expect(
      getAgentFeedbackSubmission({
        reasons: [],
        details: "   ",
        reasonsOffered: false,
      }),
    ).toEqual({ rating: "negative", reasons: [], details: "" });
  });
});
