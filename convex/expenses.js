import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Return the last 100 tasks in a given task list.
export const getAllExpenses = query({
  handler: async (ctx) => {
    return await ctx.db.query("expenses").collect();
  },
});


export const addExpense = mutation({
  args: {
    date: v.string(),
    amount: v.number(),
    description: v.optional(v.string()),
    type: v.string(), // Or use v.literal("expense") if fixed
    archived: v.boolean(), // Or use v.literal("expense") if fixed
  },

  handler: async (ctx, args) => {

    await ctx.db.insert("expenses", {
      date: args.date,
      amount: args.amount,
      description: args.description,
      type: args.type,
      archived: args.archived,
    });
  },
});