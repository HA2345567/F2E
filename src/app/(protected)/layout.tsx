import { ProfileQuery } from "@/convex/qurey.config";
import { normalizeProfile } from "@/types/user";
import { ConvexUserRaw } from "@/types/user";
import { redirect } from "next/navigation";
import { combinedSlug } from "@/lib/utils";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rawProfile = await ProfileQuery();
  const profile = normalizeProfile(
    rawProfile._valueJSON as unknown as ConvexUserRaw | null
  );

  if (!profile) {
    redirect("/auth/sign-in");
  }

  // Only redirect if accessing /dashboard directly (not a specific session)
  // This prevents infinite loops when already in a session

  return <>{children}</>;
}
