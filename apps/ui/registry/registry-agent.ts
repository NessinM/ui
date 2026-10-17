import type { Registry } from "shadcn/schema";

export const agent: Registry["items"] = [
  {
    name: "agent",
    type: "registry:ui",
    description:
      "Agent conversation, messages, message actions, and a screen reader announcer built on chat.",
    dependencies: ["lucide-react", "@base-ui/react"],
    registryDependencies: [
      "@coss/alert-dialog",
      "@coss/button",
      "@coss/chat",
      "@coss/combobox",
      "@coss/composer",
      "@coss/context-menu",
      "@coss/empty",
      "@coss/menu",
      "@coss/spinner",
      "@coss/toolbar",
      "@coss/tooltip",
      "@coss/use-copy-to-clipboard",
      "@coss/use-media-query",
      "@coss/utils",
    ],
    files: [
      {
        path: "agent/agent-action-bar.tsx",
        type: "registry:component",
        target: "@components/agent/agent-action-bar.tsx",
      },
      {
        path: "agent/agent-announcer.tsx",
        type: "registry:component",
        target: "@components/agent/agent-announcer.tsx",
      },
      {
        path: "agent/agent-conversation-menu.tsx",
        type: "registry:component",
        target: "@components/agent/agent-conversation-menu.tsx",
      },
      {
        path: "agent/agent-conversation.tsx",
        type: "registry:component",
        target: "@components/agent/agent-conversation.tsx",
      },
      {
        path: "agent/agent-history.tsx",
        type: "registry:component",
        target: "@components/agent/agent-history.tsx",
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
        path: "agent/lib/copy-agent-text.ts",
        type: "registry:component",
        target: "@components/agent/lib/copy-agent-text.ts",
      },
      {
        path: "agent/lib/filter-agent-history.ts",
        type: "registry:component",
        target: "@components/agent/lib/filter-agent-history.ts",
      },
      {
        path: "agent/lib/get-agent-announcement.ts",
        type: "registry:component",
        target: "@components/agent/lib/get-agent-announcement.ts",
      },
      {
        path: "agent/lib/get-agent-scroll-offset.ts",
        type: "registry:component",
        target: "@components/agent/lib/get-agent-scroll-offset.ts",
      },
      {
        path: "agent/lib/is-agent-session-unread.ts",
        type: "registry:component",
        target: "@components/agent/lib/is-agent-session-unread.ts",
      },
    ],
  },
];
