import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all days for all laborers (or filter as needed)
export const getAllDays = query({
  handler: async (ctx) => {
    return await ctx.db.query("workdays").collect();
  },
});

// Add a new day for a specific laborer
export const addDay = mutation({
  args: {
    laborerId: v.string(), // new argument
    date: v.string(),
    dayRate: v.number(),
    archived: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("workdays", {
      laborerId: args.laborerId,
      date: args.date,
      dayRate: args.dayRate,
      archived: args.archived,
    });
  },
});

// Delete a day by document ID
export const deleteDay = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Archive all days
export const archiveAllDays = mutation({
  handler: async (ctx) => {
    const allDays = await ctx.db.query("workdays").collect();
    for (const day of allDays) {
      if (!day.archived) {
        await ctx.db.patch(day._id, { archived: true });
      }
    }
  },
});

// Unarchive all days
export const unarchiveAllDays = mutation({
  handler: async (ctx) => {
    const allDays = await ctx.db.query("workdays").collect();
    for (const day of allDays) {
      if (day.archived) {
        await ctx.db.patch(day._id, { archived: false });
      }
    }
  },
});

// Archive a specific day
export const archiveSingleDay = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { archived: true });
  },
});

// Unarchive a specific day
export const unarchiveSingleDay = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { archived: false });
  },
});

// Delete all days
export const deleteAllDays = mutation({
  handler: async (ctx) => {
    const allDays = await ctx.db.query("workdays").collect();
    for (const day of allDays) {
      await ctx.db.delete(day._id);
    }
  },
});
