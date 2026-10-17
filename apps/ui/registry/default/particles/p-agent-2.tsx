import {
  AgentMessage,
  AgentMessageText,
} from "@/registry/default/agent/agent-message";

export default function Particle() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <AgentMessage from="user">
        <AgentMessageText>What does tomorrow look like?</AgentMessageText>
      </AgentMessage>
      <AgentMessage from="assistant">
        <AgentMessageText>
          {
            "You have three meetings tomorrow:\n• 09:30 Design review\n• 13:00 Hiring sync\n• 16:00 Weekly planning\n\nThere’s a free hour after lunch if you need focus time."
          }
        </AgentMessageText>
      </AgentMessage>
    </div>
  );
}
