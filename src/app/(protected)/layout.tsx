import { ProfileQuery } from "@/convex/qurey.config";
import { normalizeProfile } from "@/types/user";
import { ConvexUserRaw } from "@/types/user";
import { redirect } from "next/navigation";
import { combinedSlug } from "@/lib/utils";

/**
 * Renders a protected layout that redirects unauthenticated users to the sign-in page.
 *
 * If a normalized user profile is not present, the route will redirect to `/auth/sign-in`.
 *
 * @param children - The layout's child nodes to render for authenticated users
 * @returns The element tree that renders `children` when a profile exists
 */
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