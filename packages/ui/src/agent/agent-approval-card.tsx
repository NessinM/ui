"use client";

import { Badge } from "@coss/ui/components/badge";
import { Button } from "@coss/ui/components/button";
import {
  Card,
  CardFrame,
  CardFrameFooter,
  CardPanel,
} from "@coss/ui/components/card";
import { cn } from "@coss/ui/lib/utils";
import {
  CheckIcon,
  CircleAlertIcon,
  InfoIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";
import {
  type ComponentProps,
  type ReactElement,
  useEffect,
  useId,
  useRef,
} from "react";
import { useAgentPendingChoice } from "./hooks/use-agent-pending-choice";
import {
  type AgentApprovalDecision,
  type AgentApprovalGroupItem,
  type AgentApprovalPrompt,
  type AgentApprovalState,
  getAgentApprovalGroupShared,
  getAgentApprovalState,
} from "./lib/get-agent-approval-state";

type AgentApprovalBaseProps = Omit<
  ComponentProps<typeof CardFrame>,
  "children"
> & {
  /** Called with the person's answer. Return a promise to show the card responding until it settles; a rejection shows the error. */
  onRespond: (decision: AgentApprovalDecision) => void | Promise<void>;
  /** The answer your agent runtime recorded. Set it to show the resolved state. */
  decision?: AgentApprovalDecision | null;
  /** An answer is on its way through your runtime. The card also responds while `onRespond`'s promise runs. */
  responding?: boolean;
  /** The last answer didn't land. The card also shows an error when `onRespond`'s promise rejects. */
  error?: boolean;
  /** Blocks answering, for example while another turn is running. */
  disabled?: boolean;
  /** Announces the error label when `onRespond` rejects. Pass `announcer.announce`. */
  announce?: (message: string) => void;
};

type AgentApprovalFooterLabels = {
  approve: string;
  deny: string;
  approved: string;
  denied: string;
  error: string;
  hint?: string;
};

function useAgentApproval({
  onRespond,
  decision,
  responding = false,
  error = false,
  errorLabel,
  announce,
}: Pick<
  AgentApprovalBaseProps,
  "onRespond" | "decision" | "responding" | "error" | "announce"
> & { errorLabel: string }) {
  const { failed, pending, run } =
    useAgentPendingChoice<AgentApprovalDecision>();
  const state = getAgentApprovalState({
    decision,
    error: error || failed,
    responding: responding || pending !== null,
  });
  const respond = async (choice: AgentApprovalDecision): Promise<void> => {
    const outcome = await run(choice, () => onRespond(choice));
    if (outcome === "failed") announce?.(errorLabel);
  };
  return { pending, respond, state };
}

function AgentApprovalPromptBody({
  prompt,
  questionId,
  showQuestion = true,
}: {
  prompt: AgentApprovalPrompt;
  questionId?: string;
  showQuestion?: boolean;
}): ReactElement {
  return (
    <div className="flex flex-col gap-3" data-slot="agent-approval-prompt">
      <div className="flex flex-col gap-1.5">
        {showQuestion && (
          <p
            className="font-medium text-foreground text-sm"
            data-slot="agent-approval-question"
            id={questionId}
          >
            {prompt.question}
          </p>
        )}
        {prompt.context && (
          <p className="flex items-start gap-1.5 text-muted-foreground text-xs">
            <span className="flex h-lh shrink-0 items-center">
              <InfoIcon aria-hidden="true" className="size-3.5" />
            </span>
            {prompt.context}
          </p>
        )}
        {prompt.details?.length ? (
          <ul className="flex list-disc flex-col gap-0.5 ps-4 text-muted-foreground text-xs">
            {prompt.details.map((detail, index) => (
              <li key={`${index}-${detail}`}>{detail}</li>
            ))}
          </ul>
        ) : null}
      </div>
      {prompt.badge && (
        <Badge className="self-start" variant="secondary">
          {prompt.badge}
        </Badge>
      )}
    </div>
  );
}

function AgentApprovalFooter({
  state,
  pending,
  disabled,
  labels,
  onChoose,
}: {
  state: AgentApprovalState;
  pending: AgentApprovalDecision | null;
  disabled: boolean;
  labels: AgentApprovalFooterLabels;
  onChoose: (decision: AgentApprovalDecision) => void;
}): ReactElement {
  const statusRef = useRef<HTMLParagraphElement>(null);
  const approveRef = useRef<HTMLButtonElement>(null);
  const denyRef = useRef<HTMLButtonElement>(null);
  const hadFocusRef = useRef(false);
  const lastChoiceRef = useRef<AgentApprovalDecision>("approved");
  const resolved = state === "approved" || state === "denied";
  const blocked = disabled || state === "responding";

  // Answering disables, then removes, the focused button. Once the card settles,
  // hand focus to the resolved line, or back to the button after an error.
  useEffect(() => {
    if (!hadFocusRef.current || state === "responding") return;
    const active = document.activeElement;
    if (active && active !== document.body) return;
    if (state === "approved" || state === "denied") statusRef.current?.focus();
    else if (lastChoiceRef.current === "denied") denyRef.current?.focus();
    else approveRef.current?.focus();
  }, [state]);

  const choose = (choice: AgentApprovalDecision): void => {
    lastChoiceRef.current = choice;
    onChoose(choice);
  };

  return (
    <CardFrameFooter
      className="flex flex-wrap items-center justify-end gap-2 px-3 py-2"
      data-slot="agent-approval-footer"
      onBlur={(event) => {
        // No related target means focus went nowhere, as when the button was disabled or removed.
        if (
          event.relatedTarget &&
          !event.currentTarget.contains(event.relatedTarget)
        )
          hadFocusRef.current = false;
      }}
      onFocus={() => {
        hadFocusRef.current = true;
      }}
    >
      {resolved ? (
        <p
          className="me-auto flex min-h-7 items-center gap-1.5 text-muted-foreground text-xs outline-none"
          data-slot="agent-approval-status"
          ref={statusRef}
          tabIndex={-1}
        >
          {state === "approved" ? (
            <>
              <CheckIcon aria-hidden="true" className="size-3.5 shrink-0" />
              {labels.approved}
            </>
          ) : (
            <>
              <XIcon aria-hidden="true" className="size-3.5 shrink-0" />
              {labels.denied}
            </>
          )}
        </p>
      ) : (
        <>
          {state === "error" ? (
            <p
              className="me-auto flex items-center gap-1.5 text-destructive-foreground text-xs"
              data-slot="agent-approval-status"
            >
              <CircleAlertIcon
                aria-hidden="true"
                className="size-3.5 shrink-0"
              />
              {labels.error}
            </p>
          ) : (
            labels.hint && (
              <p
                className="me-auto text-muted-foreground text-xs"
                data-slot="agent-approval-hint"
              >
                {labels.hint}
              </p>
            )
          )}
          <div className="flex gap-2">
            <Button
              data-slot="agent-approval-deny"
              disabled={blocked}
              onClick={() => choose("denied")}
              ref={denyRef}
              size="xs"
              variant="ghost"
            >
              {pending === "denied" && <AgentApprovalPendingIcon />}
              {labels.deny}
            </Button>
            <Button
              data-slot="agent-approval-approve"
              disabled={blocked}
              onClick={() => choose("approved")}
              ref={approveRef}
              size="xs"
            >
              {pending === "approved" && <AgentApprovalPendingIcon />}
              {labels.approve}
            </Button>
          </div>
        </>
      )}
    </CardFrameFooter>
  );
}

function AgentApprovalPendingIcon(): ReactElement {
  return (
    <Loader2Icon aria-hidden="true" className="motion-safe:animate-spin" />
  );
}

export type AgentApprovalCardLabels = {
  /** Default approve verb, such as “Confirm”. `prompt.approveLabel` overrides it. */
  approve: string;
  /** Default deny verb, such as “Cancel”. `prompt.denyLabel` overrides it. */
  deny: string;
  /** The resolved line after approving, such as “Approved”. */
  approved: string;
  /** The resolved line after denying, such as “Skipped”. */
  denied: string;
  /** Shown beside the actions when the answer didn't land. */
  error: string;
  /** Optional line beside the actions, such as how to request changes. */
  hint?: string;
};

export type AgentApprovalCardProps = AgentApprovalBaseProps & {
  prompt: AgentApprovalPrompt;
  labels: AgentApprovalCardLabels;
};

/** Asks the person to approve one agent action, then shows how it resolved. */
export function AgentApprovalCard({
  prompt,
  labels,
  onRespond,
  decision,
  responding,
  error,
  disabled = false,
  announce,
  className,
  ...props
}: AgentApprovalCardProps): ReactElement {
  const questionId = useId();
  const approval = useAgentApproval({
    announce,
    decision,
    error,
    errorLabel: labels.error,
    onRespond,
    responding,
  });

  return (
    <CardFrame
      aria-labelledby={questionId}
      className={cn("w-full", className)}
      data-slot="agent-approval-card"
      data-state={approval.state}
      role="group"
      {...props}
    >
      <Card>
        <CardPanel className="p-4">
          <AgentApprovalPromptBody prompt={prompt} questionId={questionId} />
        </CardPanel>
      </Card>
      <AgentApprovalFooter
        disabled={disabled}
        labels={{
          ...labels,
          approve: prompt.approveLabel ?? labels.approve,
          deny: prompt.denyLabel ?? labels.deny,
        }}
        onChoose={(choice) => void approval.respond(choice)}
        pending={approval.pending}
        state={approval.state}
      />
    </CardFrame>
  );
}

export type AgentApprovalGroupCardLabels = {
  /** Approves every item, such as “Approve all”. A verb every item shares replaces it. */
  approveAll: string;
  /** Denies every item, such as “Skip all”. */
  skipAll: string;
  /** The resolved line after approving all. */
  approved: string;
  /** The resolved line after skipping all. */
  denied: string;
  /** Shown beside the actions when the answer didn't land. */
  error: string;
  /** Optional line beside the actions, such as “Skip first to request changes”. */
  hint?: string;
};

export type AgentApprovalGroupCardProps = AgentApprovalBaseProps & {
  items: readonly AgentApprovalGroupItem[];
  labels: AgentApprovalGroupCardLabels;
};

/**
 * Asks the person to approve several agent actions at once. Every item gets the same answer:
 * `onRespond` is called once, and your host answers each item.
 */
export function AgentApprovalGroupCard({
  items,
  labels,
  onRespond,
  decision,
  responding,
  error,
  disabled = false,
  announce,
  className,
  ...props
}: AgentApprovalGroupCardProps): ReactElement | null {
  const questionId = useId();
  const approval = useAgentApproval({
    announce,
    decision,
    error,
    errorLabel: labels.error,
    onRespond,
    responding,
  });
  if (items.length === 0) return null;
  const shared = getAgentApprovalGroupShared(items);

  return (
    <CardFrame
      aria-labelledby={shared.question ? questionId : undefined}
      className={cn("w-full", className)}
      data-slot="agent-approval-group-card"
      data-state={approval.state}
      // Without a shared question there's no name for the group; each item names itself.
      role={shared.question ? "group" : undefined}
      {...props}
    >
      <Card>
        <CardPanel className="flex flex-col gap-4 p-4">
          {shared.question && (
            <p
              className="font-medium text-foreground text-sm"
              data-slot="agent-approval-question"
              id={questionId}
            >
              {shared.question}
            </p>
          )}
          <ul className="flex flex-col gap-4">
            {items.map((item) => (
              <li data-slot="agent-approval-group-item" key={item.id}>
                <AgentApprovalPromptBody
                  prompt={item.prompt}
                  showQuestion={!shared.question}
                />
              </li>
            ))}
          </ul>
        </CardPanel>
      </Card>
      <AgentApprovalFooter
        disabled={disabled}
        labels={{
          ...labels,
          approve: shared.approveLabel ?? labels.approveAll,
          deny: labels.skipAll,
        }}
        onChoose={(choice) => void approval.respond(choice)}
        pending={approval.pending}
        state={approval.state}
      />
    </CardFrame>
  );
}
