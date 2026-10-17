"use client";

import {
  type AgentResultItem,
  AgentResultList,
} from "@/registry/default/agent/agent-result-list";
import { Badge } from "@/registry/default/ui/badge";

const items: AgentResultItem[] = [
  { description: "Mon 09:30", href: "#", id: "1", title: "Design review" },
  {
    description: "Mon 11:00",
    href: "#",
    id: "2",
    title: "Hiring sync",
    trailing: (
      <Badge size="sm" variant="warning">
        Pending
      </Badge>
    ),
  },
  { description: "Tue 10:00", href: "#", id: "3", title: "Roadmap planning" },
  { description: "Tue 15:30", href: "#", id: "4", title: "1:1 with Priya" },
  {
    description: "Wed 09:00",
    href: "#",
    id: "5",
    title: "Customer call: Northwind",
    trailing: (
      <Badge size="sm" variant="secondary">
        External
      </Badge>
    ),
  },
  { description: "Wed 14:00", href: "#", id: "6", title: "Brand workshop" },
  { description: "Thu 10:00", href: "#", id: "7", title: "Sprint demo" },
  { description: "Fri 16:00", href: "#", id: "8", title: "Team retro" },
];

export default function Particle() {
  return (
    <AgentResultList
      className="max-w-sm"
      items={items}
      showLessLabel="Show less"
      showMoreLabel={(count) => `Show ${count} more`}
    />
  );
}
