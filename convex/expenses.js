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


export const deleteExpense = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});


export const archiveAllExpenses = mutation({
  handler: async (ctx) => {
    const allExpenses = await ctx.db.query("expenses").collect();
    for (const expense of allExpenses) {
      if (!expense.archived) {
        await ctx.db.patch(expense._id, { archived: true });
      }
    }

  },
});
export const unarchiveAllExpenses = mutation({
  handler: async (ctx) => {
    const allExpenses = await ctx.db.query("expenses").collect();
    for (const expense of allExpenses) {
      if (expense.archived) {
        await ctx.db.patch(expense._id, { archived: false });
      }
    }
  },
});
export const archiveSingleExpense = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    if (!expense.archived) {
      await ctx.db.patch(args.id, { archived: true });
    }
  },
});
export const unarchiveSingleExpense = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { archived: false });

  },
});
