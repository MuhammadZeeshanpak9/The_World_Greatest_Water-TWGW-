import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1A0A2E",
            color: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.1)",
            fontFamily: "var(--font-inter)",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#10B981", secondary: "#1A0A2E" } },
          error: { iconTheme: { primary: "#EF4444", secondary: "#1A0A2E" } },
        }}
      />
    </>
  );
}
