import { ChatMessage } from "@/registry/default/chat/chat-message";
import { ChatMessageMarkdown } from "@/registry/default/chat/chat-message-markdown";

export default function Particle() {
  return (
    <ChatMessage
      side="incoming"
      author="Assistant"
      bubble={false}
      className="w-full max-w-md"
    >
      <ChatMessageMarkdown className="px-1">
        <h3>Interview schedule</h3>
        <p>
          The earliest window that works for every interviewer is{" "}
          <strong>Tuesday at 10:30</strong>. Check the{" "}
          <a href="#availability">shared availability</a> before you send
          invites.
        </p>
        <ol>
          <li>Confirm each interviewer’s calendar</li>
          <li>
            Send booking links with a <code>15m</code> buffer
          </li>
          <li>Hold a short debrief after each call</li>
        </ol>
        <table>
          <thead>
            <tr>
              <th>Team</th>
              <th>Open slots</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Design</td>
              <td>4</td>
            </tr>
            <tr>
              <td>Engineering</td>
              <td>7</td>
            </tr>
          </tbody>
        </table>
        <pre>
          <code>{"buffer: 15\nminimumNotice: 24h"}</code>
        </pre>
        <blockquote>
          <p>Keep Tuesday morning free for focus time.</p>
        </blockquote>
      </ChatMessageMarkdown>
    </ChatMessage>
  );
}
