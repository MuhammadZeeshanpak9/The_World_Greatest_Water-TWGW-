import type { Metadata } from "next";
import ChatPageClient from "./ChatPageClient";

export const metadata: Metadata = {
  title: "ELEV8 V.A.",
  description:
    "Chat with ELEV8 V.A., your personal guide to THE WORLD'S GREATEST WATER ecosystem.",
};

export default function ChatPage() {
  return <ChatPageClient />;
}
