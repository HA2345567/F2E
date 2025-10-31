import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// ===========================
//  Query: Get a Single Project
// ===========================
export const getProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authorized");

    const project = await ctx.db.get(projectId);
    if (!project) throw new Error("Project not found");

    if (project.userId !== userId && !project.isPublic) {
      throw new Error("Access denied");
    }

    return project;
  },
});

// ===========================
//  Mutation: Create a Project
// ===========================
export const createProject = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    sketchesData: v.any(),
    thumbnail: v.optional(v.string()),
  },
  handler: async (ctx, { userId, name, sketchesData, thumbnail }) => {
    console.log("[convex] Creating project for user:", userId);

    const projectNumber = await getNextProjectNumber(ctx, userId);
    const projectName = name || `Project ${projectNumber}`;

    const projectId = await ctx.db.insert("projects", {
      userId,
      name: projectName,
      sketchesData,
      thumbnail,
      projectNumber,
      lastModified: Date.now(),
      created: Date.now(),
      isPublic: false,
    });

    console.log("[convex] Project created", {
      projectId,
      name: projectName,
      projectNumber,
    });

    return {
      projectId,
      name: projectName,
      projectNumber,
    };
  },
});

// ===========================
//  Helper: Get Next Project Number
/**
 * Allocate and return the next sequential project number for a user.
 *
 * This function advances the stored per-user project counter so subsequent
 * calls yield increasing numbers.
 *
 * @param userId - ID of the user to allocate the project number for
 * @returns The project number to assign to the user's new project; returns 1 for the user's first project
 */
async function getNextProjectNumber(ctx: any, userId: string): Promise<number> {
  const counter = await ctx.db
    .query("project_counters")
    .withIndex("by_userId", (q: any) => q.eq("userId", userId))
    .first();

  if (!counter) {
    await ctx.db.insert("project_counters", {
      userId,
      nextProjectNumber: 2,
    });
    return 1;
  }

  const projectNumber = counter.nextProjectNumber;
  await ctx.db.patch(counter._id, {
    nextProjectNumber: projectNumber + 1,
  });

  return projectNumber;
}

// ===========================
//  Query: Get All Projects for a User
// ===========================
export const getUserProjects = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { userId, limit = 20 }) => {
    const allProjects = await ctx.db
      .query("projects")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const projects = allProjects.slice(0, limit);

    return projects.map((project) => ({
      _id: project._id,
      name: project.name,
      projectNumber: project.projectNumber,
      thumbnail: project.thumbnail,
      lastModified: project.lastModified,
      createdAt: project.created,
      isPublic: project.isPublic,
    }));
  },
});

export const getProjectStyleGuide= query({
  args: { projectId:v.id('projects')},
  handler: async(ctx, {projectId}) =>{
    const userId = await getAuthUserId(ctx)
    if(!userId ) throw new Error('Not authenticated')
      
      const project = await ctx.db.get(projectId)
      if(!project) throw new Error('project not found')
        if(project.userId !== userId && !project.isPublic){
          throw new Error('Accesss denied')
        }

        return project.styleGuide ? JSON.parse(project.styleGuide): null 
  }
})

