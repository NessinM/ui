"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@coss/ui/lib/utils";
import { Fragment, type ReactElement, type ReactNode } from "react";
import {
  AgentToolActivity,
  type AgentToolRenderers,
} from "./agent-tool-activity";
import type {
  AgentToolActivityLabels,
  AgentToolCall,
} from "./lib/get-agent-tool-summary";
import {
  type AgentTurnItem,
  groupAgentToolRuns,
} from "./lib/group-agent-tool-runs";

export type AgentTurnTools<TPart> = {
  /** Returns the tool call a part stands for, or `undefined` for any other part. */
  getCall: (part: TPart, index: number) => AgentToolCall | undefined;
  labels: AgentToolActivityLabels;
  /** How each tool's calls look, by tool name. */
  renderers?: AgentToolRenderers;
};

export type AgentTurnProps<TPart> = Omit<
  useRender.ComponentProps<"div">,
  "children"
> & {
  /** The turn's parts, in order, as your application models them. */
  parts: readonly TPart[];
  /** Renders a part that isn't a tool call. Return `null` to hide it; a hidden part doesn't split a run of tool calls. */
  renderPart: (part: TPart, index: number) => ReactNode;
  /** Groups each run of consecutive tool calls behind one tool activity disclosure. */
  tools?: AgentTurnTools<TPart>;
  /** Replaces the neutral busy glyph in tool activity. */
  indicator?: ReactNode;
};

function isHidden(node: ReactNode): boolean {
  return node === null || node === undefined || typeof node === "boolean";
}

/** The content of one agent turn: your parts in order, with runs of tool calls grouped. */
export function AgentTurn<TPart>({
  parts,
  renderPart,
  tools,
  indicator,
  className,
  render,
  ...props
}: AgentTurnProps<TPart>): ReactElement {
  const items = parts.map((part, index): AgentTurnItem<ReactNode> => {
    const call = tools?.getCall(part, index);
    if (call) return { call, type: "tool" };
    const node = renderPart(part, index);
    return isHidden(node) ? null : { content: node, type: "content" };
  });

  const defaultProps = {
    children: groupAgentToolRuns(items).map((segment) => {
      if (segment.type === "content")
        return <Fragment key={segment.key}>{segment.content}</Fragment>;
      // Tool segments only come from `tools.getCall`.
      return (
        tools && (
          <AgentToolActivity
            calls={segment.calls}
            indicator={indicator}
            key={segment.key}
            labels={tools.labels}
            renderers={tools.renderers}
          />
        )
      );
    }),
    className: cn("flex min-w-0 flex-col gap-3", className),
    "data-slot": "agent-turn",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}
