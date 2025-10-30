import { ProjectQuery } from "@/convex/qurey.config";
import { combinedSlug } from "@/lib/utils";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ProjectProvider from "@/components/projects/list/provider";
import ProjectList from "@/components/projects/list";
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// FIX 1: Correctly define the PageProps interface for the dynamic route.
// [session] from the folder path and [project] from the query string.
interface PageProps {
  params: {
    session: string; // The profile name slug from the URL path
  };
  searchParams: {
    project: string | undefined; // The project ID from the URL query
  };
}

const Page = async ({ params, searchParams }: PageProps) => {
  try {
    const { session } = params; 
    const projectId = searchParams.project; // Get the project ID

    // Assuming ProjectQuery handles authentication and data fetching correctly.
    const { profile } = await ProjectQuery(); 
    // NOTE: You'll likely need a separate query here to get project-specific style data

    // --- Authentication Check ---
    if (!profile) {
      return (
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Authentication Required
            </h1>
            <p className="text-muted-foreground">
              Please sign in to view this style guide.
            </p>
          </div>
        </div>
      );
    }
    
    // --- URL Validation/Redirection Check ---
    const profileSlug = combinedSlug(profile.name!);
    if (session !== profileSlug) {
      // Redirect to correct session URL if mismatch
      redirect(`/dashboard/${profileSlug}/style-guide?project=${projectId}`);
    }

    // --- Project List Layout ---
    return (
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <ProjectProvider initialProjects={[]}>
          
              <ProjectList />
    
          </ProjectProvider>
        </Suspense>
      </div>
    );
    
    // --- Project ID Check ---
    if (!projectId) {
        return (
            <div className="container mx-auto py-8 text-center">
                <h1 className="text-2xl font-bold text-foreground">
                    Project Not Specified
                </h1>
                <p className="text-muted-foreground">
                    Please select a project to view its style guide.
                </p>
            </div>
        )
    }

    // --- Success Render ---
    // Use Suspense to handle the loading state of the ProjectProvider 
    // or the Convex data fetch inside the component.
   
  } catch (error) {
    console.error("Error loading style guide:", error);
    
    // --- Error Render ---
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Error Loading Style Guide
          </h1>
          <p className="text-muted-foreground">
            We encountered an error while loading the style guide. Please try again later.
          </p>
        </div>
      </div>
    );
  }
};

export default Page;