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

