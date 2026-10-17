"use client";

import { ArrowUpIcon, SquareIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/registry/default/ui/button";
import {
  Composer,
  ComposerActionGroup,
  ComposerActions,
  ComposerInput,
  ComposerSubmit,
  type ComposerValue,
} from "@/registry/default/ui/composer";

export default function Particle() {
  const [value, setValue] = useState<ComposerValue>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const replyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(replyTimer.current), []);

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <Composer
        busy={busy}
        onStop={() => {
          clearTimeout(replyTimer.current);
          setBusy(false);
          setNotice("Stopped.");
        }}
        onSubmit={() => {
          setValue([]);
          setBusy(true);
          setNotice("Generating a reply…");
          replyTimer.current = setTimeout(() => {
            setBusy(false);
            setNotice("Reply ready.");
          }, 4000);
        }}
        onValueChange={setValue}
        value={value}
      >
        <ComposerInput aria-label="Message" placeholder="Ask anything…" />
        <ComposerActions>
          <ComposerActionGroup align="end">
            <ComposerSubmit
              render={
                <Button aria-label="Send message" size="icon">
                  <ArrowUpIcon aria-hidden="true" />
                </Button>
              }
              stopRender={
                <Button aria-label="Stop generating" size="icon">
                  <SquareIcon aria-hidden="true" className="fill-current" />
                </Button>
              }
            />
          </ComposerActionGroup>
        </ComposerActions>
      </Composer>
      <p className="min-h-5 text-muted-foreground text-sm" role="status">
        {notice}
      </p>
    </div>
  );
}
