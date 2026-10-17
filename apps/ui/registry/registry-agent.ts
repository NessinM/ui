import type { Registry } from "shadcn/schema";

export const agent: Registry["items"] = [
  {
    name: "agent",
    type: "registry:ui",
    description:
      "Agent conversation, messages, message actions, and a screen reader announcer.",
    dependencies: ["lucide-react", "@base-ui/react"],
    registryDependencies: [
      "@coss/button",
      "@coss/composer",
      "@coss/scroll-area",
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
        path: "agent/lib/get-agent-announcement.ts",
        type: "registry:component",
        target: "@components/agent/lib/get-agent-announcement.ts",
      },
      {
        path: "agent/lib/agent-scroll.ts",
        type: "registry:component",
        target: "@components/agent/lib/agent-scroll.ts",
      },
    ],
  },
];
