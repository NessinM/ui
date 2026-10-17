import type { Registry } from "shadcn/schema";

export const agent: Registry["items"] = [
  {
    name: "agent",
    type: "registry:ui",
    description:
      "Agent conversation, messages, message actions, and a screen reader announcer built on chat.",
    dependencies: ["lucide-react", "@base-ui/react"],
    registryDependencies: [
      "@coss/button",
      "@coss/card",
      "@coss/chat",
      "@coss/collapsible",
      "@coss/composer",
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
        path: "agent/agent-conversation.tsx",
        type: "registry:component",
        target: "@components/agent/agent-conversation.tsx",
      },
      {
        path: "agent/agent-disclosure-trigger.tsx",
        type: "registry:component",
        target: "@components/agent/agent-disclosure-trigger.tsx",
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
        path: "agent/agent-reasoning.tsx",
        type: "registry:component",
        target: "@components/agent/agent-reasoning.tsx",
      },
      {
        path: "agent/agent-result-list.tsx",
        type: "registry:component",
        target: "@components/agent/agent-result-list.tsx",
      },
      {
        path: "agent/agent-status-indicator.tsx",
        type: "registry:component",
        target: "@components/agent/agent-status-indicator.tsx",
      },
      {
        path: "agent/agent-tool-activity.tsx",
        type: "registry:component",
        target: "@components/agent/agent-tool-activity.tsx",
      },
      {
        path: "agent/agent-turn.tsx",
        type: "registry:component",
        target: "@components/agent/agent-turn.tsx",
      },
      {
        path: "agent/hooks/use-agent-announcer.ts",
        type: "registry:component",
        target: "@components/agent/hooks/use-agent-announcer.ts",
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
        path: "agent/lib/get-agent-reasoning-state.ts",
        type: "registry:component",
        target: "@components/agent/lib/get-agent-reasoning-state.ts",
      },
      {
        path: "agent/lib/get-agent-scroll-offset.ts",
        type: "registry:component",
        target: "@components/agent/lib/get-agent-scroll-offset.ts",
      },
      {
        path: "agent/lib/get-agent-tool-summary.ts",
        type: "registry:component",
        target: "@components/agent/lib/get-agent-tool-summary.ts",
      },
      {
        path: "agent/lib/group-agent-tool-runs.ts",
        type: "registry:component",
        target: "@components/agent/lib/group-agent-tool-runs.ts",
      },
      {
        path: "agent/lib/split-agent-result-items.ts",
        type: "registry:component",
        target: "@components/agent/lib/split-agent-result-items.ts",
      },
    ],
  },
];
