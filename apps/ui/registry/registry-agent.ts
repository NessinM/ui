import type { Registry } from "shadcn/schema";

export const agent: Registry["items"] = [
  {
    name: "agent",
    type: "registry:ui",
    description:
      "Agent conversation, messages, message actions, and a screen reader announcer built on chat.",
    dependencies: ["lucide-react", "@base-ui/react"],
    registryDependencies: [
      "@coss/badge",
      "@coss/button",
      "@coss/card",
      "@coss/chat",
      "@coss/composer",
      "@coss/dialog",
      "@coss/field",
      "@coss/fieldset",
      "@coss/form",
      "@coss/textarea",
      "@coss/toggle",
      "@coss/toolbar",
      "@coss/tooltip",
      "@coss/use-copy-to-clipboard",
      "@coss/use-media-query",
      "@coss/utils",
    ],
    files: [
      {
        path: "agent/agent-announcer.tsx",
        type: "registry:component",
        target: "@components/agent/agent-announcer.tsx",
      },
      {
        path: "agent/agent-approval-card.tsx",
        type: "registry:component",
        target: "@components/agent/agent-approval-card.tsx",
      },
      {
        path: "agent/agent-conversation.tsx",
        type: "registry:component",
        target: "@components/agent/agent-conversation.tsx",
      },
      {
        path: "agent/agent-error-recovery.tsx",
        type: "registry:component",
        target: "@components/agent/agent-error-recovery.tsx",
      },
      {
        path: "agent/agent-message-actions.tsx",
        type: "registry:component",
        target: "@components/agent/agent-message-actions.tsx",
      },
      {
        path: "agent/agent-message.tsx",
        type: "registry:component",
        target: "@components/agent/agent-message.tsx",
      },
      {
        path: "agent/agent-response-feedback.tsx",
        type: "registry:component",
        target: "@components/agent/agent-response-feedback.tsx",
      },
      {
        path: "agent/hooks/use-agent-announcer.ts",
        type: "registry:component",
        target: "@components/agent/hooks/use-agent-announcer.ts",
      },
      {
        path: "agent/hooks/use-agent-pending-choice.ts",
        type: "registry:component",
        target: "@components/agent/hooks/use-agent-pending-choice.ts",
      },
      {
        path: "agent/hooks/use-agent-reduced-motion.ts",
        type: "registry:component",
        target: "@components/agent/hooks/use-agent-reduced-motion.ts",
      },
      {
        path: "agent/lib/get-agent-announcement.ts",
        type: "registry:component",
        target: "@components/agent/lib/get-agent-announcement.ts",
      },
      {
        path: "agent/lib/get-agent-approval-state.ts",
        type: "registry:component",
        target: "@components/agent/lib/get-agent-approval-state.ts",
      },
      {
        path: "agent/lib/get-agent-feedback.ts",
        type: "registry:component",
        target: "@components/agent/lib/get-agent-feedback.ts",
      },
      {
        path: "agent/lib/get-agent-scroll-offset.ts",
        type: "registry:component",
        target: "@components/agent/lib/get-agent-scroll-offset.ts",
      },
    ],
  },
];
