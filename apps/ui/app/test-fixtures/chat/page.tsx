import { notFound } from "next/navigation";
import {
  ChatDrawerFixture,
  ChatScrollFixture,
} from "@/tests/browser/chat-scroll-fixture";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ drawer?: string }>;
}) {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.COSS_BROWSER_TESTS !== "1"
  )
    notFound();
  return (await searchParams).drawer === "1" ? (
    <ChatDrawerFixture />
  ) : (
    <ChatScrollFixture />
  );
}
