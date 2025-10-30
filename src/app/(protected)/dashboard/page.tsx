import { SubscriptionEntitlementQuery } from "@/convex/qurey.config";
import { combinedSlug } from "@/lib/utils";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ProjectProvider from "@/components/projects/list/provider";
import ProjectList from "@/components/projects/list";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const DashboardPage = async () => {
  try {
    const { entitlement, profileName } = await SubscriptionEntitlementQuery();
    

    
    const slug = combinedSlug(profileName!);
    redirect(`/dashboard/${slug}`);
   
  } catch (error) {
    console.error("Error in dashboard page:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground">
            We're having trouble loading your dashboard. Please try again later.
          </p>
        </div>
      </div>
    );
  }
};

const Page = async () => {
  try {
    const { entitlement, profileName } = await SubscriptionEntitlementQuery();
    const slug = combinedSlug(profileName!);
    
    // Redirect to the user's dashboard if we have a valid slug
    if (slug) {
      redirect(`/dashboard/${slug}`);
    }
    
    // Fallback in case redirect doesn't happen (shouldn't normally reach here)
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <ProjectProvider initialProjects={[]}>
          <ProjectList />
        </ProjectProvider>
      </Suspense>
    );
  } catch (error) {
    console.error("Error in dashboard page:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground">
            We're having trouble loading your dashboard. Please try again later.
          </p>
        </div>
      </div>
    );
  }
};

export default Page;