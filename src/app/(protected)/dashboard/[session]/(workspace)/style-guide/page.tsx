import { ThemeContent } from "@/components/style/theme";
import { TabsContent } from "@/components/ui/tabs";
import { MoodBoardImagesQuery, StyleGuideQuery } from "@/convex/qurey.config";
import { MoodBoardImages } from "@/hooks/use-style";
import { StyleGuide } from "@/redux/api/style-guide";
import { Palette } from "lucide-react";
import { mockStyleGuide } from "@/lib/mockData";
import StyleGuideTypography from "@/components/style/typography";
import MoodBoard from "@/components/style/mood-board";


type Props = {
  searchParams: Promise<{ project: string }>;
};

const Page = async ({ searchParams }: Props) => {
  const projectId = (await searchParams).project;
  const existingStyleGuide = await StyleGuideQuery(projectId);
  const guide = (existingStyleGuide.styleGuide?._valueJSON as unknown as StyleGuide) || mockStyleGuide;
  const colorGuide = guide?.colorSections || mockStyleGuide.colorSections;
  const typographyGuide = guide?.typographySections || mockStyleGuide.typographySections;

  let guideImages: MoodBoardImages[] = [];
  try {
    const moodBoardResponse = await MoodBoardImagesQuery(projectId);
    if (moodBoardResponse?.images?._valueJSON) {
      guideImages = Array.isArray(moodBoardResponse.images._valueJSON) 
        ? (moodBoardResponse.images._valueJSON as unknown as MoodBoardImages[])
        : [];
    }
  } catch (error) {
    console.error('Error fetching mood board images:', error);
    guideImages = [];
  }

  return (
    <div className="p-6">
      <TabsContent value="colours" className="space-y-8">
        {!guideImages?.length ? (
          <div className="space-y-8">
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center">
                <Palette className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No colors generated yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                Upload images to your mood board and generate an AI-powered style guide with colors and typography.
              </p>
            </div>
          </div>
        ) : (
        
            <ThemeContent colorGuide={colorGuide} />
        )} 
      </TabsContent>
      <TabsContent value="typography">
        <StyleGuideTypography typographyGuide={typographyGuide}/>
      </TabsContent>

      <TabsContent value="moodboard">
        <MoodBoard  guideImages={guideImages} />
      </TabsContent>
    </div>
  );
};

export default Page;
