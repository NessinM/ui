import { notFound } from "next/navigation";
import { MessageScrollerFixture } from "@/tests/browser/message-scroller-fixture";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ native?: string; empty?: string }>;
}) {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.COSS_BROWSER_TESTS !== "1"
  )
    notFound();
  const params = await searchParams;
  return (
    <MessageScrollerFixture
      native={params.native === "1"}
      empty={params.empty === "1"}
    />
  );
}
