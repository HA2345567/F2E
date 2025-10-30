import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

type Image = {
  id: string;
  url: string | null;
  uploaded: boolean;
  uploading: boolean;
  index: number;
};

export const getMoodBoardImages = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, { projectId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    
    const project = await ctx.db.get(projectId);
    if (!project || project.userId !== userId) {
      return [];
    }
    
    const storageIds = project.moodBoardImages || [];
    const images = await Promise.all(
      storageIds.map(async (storageId: string, index: number) => {
        try {
          const url = await ctx.storage.getUrl(storageId);
          return {
            id: `convex-${storageId}`,
            url,
            uploaded: true,
            uploading: false,
            index,
          };
        } catch (error) {
          return null;
        }
      })
    );
    
    return images.filter((image): image is Image => image !== null);
  },
});

export const generateUploadUrl = mutation({
  handler: async(ctx) => {
    const userId = await getAuthUserId(ctx)
    if(!userId){
      throw new Error('Not authentication')
    }

    return await ctx.storage.generateUploadUrl()
  },
})

export const removeMoodBoardImage = mutation({
  args: {
    projectId: v.id('projects'),
    storageId: v.id('_storage'),
  },
  handler: async(ctx, {projectId, storageId}) =>{
    const userId = await getAuthUserId(ctx)
    if(!userId){
      throw new Error('Not authentication')
    }

    const project = await ctx.db.get(projectId)
    if(!project){
      throw new Error('Not authentication')
    }

   if(project.userId !== userId){
    throw new Error('Access denied');
   }

   const currentImages = project.moodBoardImages || []
   const updatedImages = currentImages.filter((id) => id !== storageId)
   await ctx.db.patch(projectId,{
    moodBoardImages: updatedImages,
    lastModified: Date.now(),
   })

   try{
    await ctx.storage.delete(storageId)
   }catch(e){
    console.error(
      `Failed to delete image ${storageId}:`, e
    )
   }
     return {success: true, imageCount: updatedImages.length}
  },
})

export const addMoodBoardImage = mutation({
  args: {
    projectId: v.id('projects'),
    storageId: v.id('_storage'),
  },
  handler: async (ctx, { projectId, storageId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const project = await ctx.db.get(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    if (project.userId !== userId) {
      throw new Error('Access denied');
    }

    // Verify the storage item exists before adding to the project
    try {
      const url = await ctx.storage.getUrl(storageId);
      if (!url) {
        throw new Error('File not found in storage');
      }
    } catch (error) {
      console.error('Error verifying storage item:', error);
      throw new Error('Failed to verify uploaded file');
    }

    const currentImages = project.moodBoardImages || [];
    
    // Prevent duplicate storage IDs
    if (!currentImages.includes(storageId)) {
      const updatedImages = [...currentImages, storageId];
      
      await ctx.db.patch(projectId, {
        moodBoardImages: updatedImages,
        lastModified: Date.now(),
      });
      
      return { success: true, imageCount: updatedImages.length };
    }
    
    return { success: true, imageCount: currentImages.length };
  },
});