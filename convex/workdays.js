import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Return the last 100 tasks in a given task list.
export const getAllDays = query({
  handler: async (ctx) => {
    return await ctx.db.query("workdays").collect();
  },
});


export const addDay = mutation({
  args: {
    date: v.string(),
    dayRate: v.number(),
    archived: v.boolean(), // Or use v.literal("expense") if fixed
  },

  handler: async (ctx, args) => {

    await ctx.db.insert("workdays", {
      date: args.date,
      dayRate: args.dayRate,
      archived: args.archived,
    });
  },
});

export const deleteDay = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});




export const archiveAllDays = mutation({
  handler: async (ctx) => {
    // Fetch all workdays (you can add filtering here if needed)
    const allDays = await ctx.db.query("workdays").collect();
    // Loop and update each one
    for (const day of allDays) {
      // Only update if currently archived
      if (!day.archived) {
        await ctx.db.patch(day._id, { archived: true });
      }
    }
  },
});
export const unarchiveAllDays = mutation({
  handler: async (ctx) => {
    // Fetch all workdays (you can add filtering here if needed)
    const allDays = await ctx.db.query("workdays").collect();

    // Loop and update each one
    for (const day of allDays) {
      // Only update if currently archived
      if (day.archived) {
        await ctx.db.patch(day._id, { archived: false });
      }
    }
  },
});


export const archiveSingleDay = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    if (!day.archived) {
      await ctx.db.patch(args.id, { archived: true });
    }
  },
});
export const unarchiveSingleDay = mutation({
  args: {
    id: v.string(),
  }, handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { archived: false });

  },
});
