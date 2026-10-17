"use client";

import type { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar";
import {
  CheckIcon,
  CircleAlertIcon,
  Loader2Icon,
  PlusIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { type FormEvent, type ReactElement, useState } from "react";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@/registry/default/ui/dialog";
import { Field, FieldLabel } from "@/registry/default/ui/field";
import { Fieldset, FieldsetLegend } from "@/registry/default/ui/fieldset";
import { Form } from "@/registry/default/ui/form";
import { Textarea } from "@/registry/default/ui/textarea";
import { Toggle } from "@/registry/default/ui/toggle";
import { ToolbarGroup } from "@/registry/default/ui/toolbar";
import { AgentMessageAction } from "./agent-message-actions";
import { useAgentPendingChoice } from "./hooks/use-agent-pending-choice";
import {
  type AgentFeedbackRating,
  type AgentFeedbackValue,
  getAgentFeedbackAction,
  getAgentFeedbackSubmission,
} from "./lib/get-agent-feedback";

export type AgentResponseFeedbackReason = {
  value: string;
  label: string;
};

export type AgentResponseFeedbackLabels = {
  /** Names the thumbs-up button, such as “Good response”. */
  positive: string;
  /** Names the thumbs-down button, such as “Bad response”. */
  negative: string;
  dialogTitle: string;
  dialogDescription?: string;
  /** The legend over the reasons, such as “What went wrong?”. */
  reasons?: string;
  details: string;
  detailsPlaceholder?: string;
  cancel: string;
  submit: string;
  /** Announced when feedback is saved, such as “Thanks for your feedback”. */
  submitted: string;
  /** Shown and announced when saving fails. */
  error: string;
};

export type AgentResponseFeedbackProps = Omit<
  ToolbarPrimitive.Group.Props,
  "children"
> & {
  /** The rating to show. Controlled: update it once `onFeedback` resolves. */
  value: AgentFeedbackRating | null;
  /**
   * Saves feedback, or `null` when the person presses the shown rating again to clear it.
   * A rejection shows the error state; retrying is up to your host.
   */
  onFeedback: (feedback: AgentFeedbackValue | null) => void | Promise<void>;
  labels: AgentResponseFeedbackLabels;
  /** Reasons offered after a thumbs down. When given, one is required to submit. */
  reasons?: readonly AgentResponseFeedbackReason[];
  /** Caps the details field, so text is never cut after the person typed it. */
  detailsMaxLength?: number;
  disabled?: boolean;
  /** Announces the saved and error labels. Pass `announcer.announce`. */
  announce?: (message: string) => void;
};

/**
 * Thumbs up and down for a reply. A thumbs down asks for reasons and details first.
 * Place it inside `AgentMessageActions`.
 */
export function AgentResponseFeedback({
  value,
  onFeedback,
  labels,
  reasons = [],
  detailsMaxLength,
  disabled = false,
  announce,
  className,
  ...props
}: AgentResponseFeedbackProps): ReactElement {
  const { clearFailure, failed, pending, run } =
    useAgentPendingChoice<AgentFeedbackRating>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [details, setDetails] = useState("");
  const submission = getAgentFeedbackSubmission({
    details,
    detailsMaxLength,
    reasons: selectedReasons,
    reasonsOffered: reasons.length > 0,
  });

  const save = async (
    rating: AgentFeedbackRating,
    feedback: AgentFeedbackValue | null,
  ): Promise<boolean> => {
    const outcome = await run(rating, () => onFeedback(feedback));
    if (outcome === "failed") announce?.(labels.error);
    if (outcome === "succeeded" && feedback) announce?.(labels.submitted);
    return outcome === "succeeded";
  };

  const rate = (next: AgentFeedbackRating): void => {
    if (pending) return;
    const action = getAgentFeedbackAction(value, next);
    if (action.type === "ask-details") {
      clearFailure();
      setDialogOpen(true);
    } else if (action.type === "clear") void save(next, null);
    else void save(next, action.feedback);
  };

  const submitDetails = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    if (!submission) return;
    if (await save("negative", submission)) setDialogOpen(false);
  };

  const ratings = [
    { icon: ThumbsUpIcon, label: labels.positive, rating: "positive" },
    { icon: ThumbsDownIcon, label: labels.negative, rating: "negative" },
  ] as const;

  return (
    <ToolbarGroup
      className={cn("gap-0.5", className)}
      data-slot="agent-response-feedback"
      data-state={pending ? "submitting" : failed ? "error" : "idle"}
      {...props}
    >
      {ratings.map(({ icon: Icon, label, rating }) => (
        <AgentMessageAction
          aria-pressed={value === rating}
          className="aria-pressed:bg-accent aria-pressed:text-foreground"
          disabled={disabled}
          key={rating}
          label={label}
          // Stays enabled while saving so focus isn't dropped; repeat presses are ignored.
          onClick={() => rate(rating)}
        >
          {pending === rating && !dialogOpen ? (
            <Loader2Icon
              aria-hidden="true"
              className="motion-safe:animate-spin"
            />
          ) : (
            <Icon aria-hidden="true" />
          )}
        </AgentMessageAction>
      ))}
      {failed && !dialogOpen && (
        <span
          className="flex items-center gap-1.5 px-1 text-destructive-foreground text-xs"
          data-slot="agent-response-feedback-error"
        >
          <CircleAlertIcon aria-hidden="true" className="size-3.5 shrink-0" />
          {labels.error}
        </span>
      )}
      <Dialog
        onOpenChange={(open) => {
          if (!pending) setDialogOpen(open);
        }}
        onOpenChangeComplete={(open) => {
          if (open) return;
          // Closing the form, saved or not, moves on from its failure.
          clearFailure();
          setSelectedReasons([]);
          setDetails("");
        }}
        open={dialogOpen}
      >
        <DialogPopup showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{labels.dialogTitle}</DialogTitle>
            {labels.dialogDescription && (
              <DialogDescription>{labels.dialogDescription}</DialogDescription>
            )}
          </DialogHeader>
          <Form
            className="contents"
            onSubmit={(event: FormEvent<HTMLFormElement>) =>
              void submitDetails(event)
            }
          >
            <DialogPanel className="flex flex-col gap-5">
              {reasons.length > 0 && (
                <Fieldset className="flex flex-col gap-2">
                  {labels.reasons && (
                    <FieldsetLegend className="font-medium text-sm">
                      {labels.reasons}
                    </FieldsetLegend>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {reasons.map((reason) => {
                      const selected = selectedReasons.includes(reason.value);
                      return (
                        <Toggle
                          disabled={pending !== null}
                          key={reason.value}
                          onPressedChange={(pressed: boolean) =>
                            setSelectedReasons((current) =>
                              pressed
                                ? [...current, reason.value]
                                : current.filter(
                                    (item) => item !== reason.value,
                                  ),
                            )
                          }
                          pressed={selected}
                          size="sm"
                          variant="outline"
                        >
                          {selected ? (
                            <CheckIcon aria-hidden="true" />
                          ) : (
                            <PlusIcon aria-hidden="true" />
                          )}
                          {reason.label}
                        </Toggle>
                      );
                    })}
                  </div>
                </Fieldset>
              )}
              <Field>
                <FieldLabel>{labels.details}</FieldLabel>
                <Textarea
                  disabled={pending !== null}
                  maxLength={detailsMaxLength}
                  name="details"
                  onChange={(event) => setDetails(event.target.value)}
                  placeholder={labels.detailsPlaceholder}
                  value={details}
                />
              </Field>
              {failed && (
                <p
                  className="flex items-center gap-1.5 text-destructive-foreground text-sm"
                  data-slot="agent-response-feedback-error"
                >
                  <CircleAlertIcon
                    aria-hidden="true"
                    className="size-4 shrink-0"
                  />
                  {labels.error}
                </p>
              )}
            </DialogPanel>
            <DialogFooter>
              <DialogClose
                disabled={pending !== null}
                render={<Button variant="ghost" />}
              >
                {labels.cancel}
              </DialogClose>
              {/* Stays enabled while saving so focus isn't dropped; repeat submits are ignored. */}
              <Button disabled={!submission} type="submit">
                {pending === "negative" && (
                  <Loader2Icon
                    aria-hidden="true"
                    className="motion-safe:animate-spin"
                  />
                )}
                {labels.submit}
              </Button>
            </DialogFooter>
          </Form>
        </DialogPopup>
      </Dialog>
    </ToolbarGroup>
  );
}
