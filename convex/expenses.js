import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Return the last 100 tasks in a given task list.
export const getAllExpenses = query({
  args: {
    userId: v.optional(v.id("user")),
  },
  handler: async (ctx, args) => {
    const expenses = await ctx.db
      .query("expenses")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    return expenses
  },
});


export const addExpense = mutation({
  args: {
    userId: v.id("user"),
    date: v.string(),
    amount: v.number(),
    description: v.optional(v.string()),
    type: v.string(), // Or use v.literal("expense") if fixed
    archived: v.boolean(), // Or use v.literal("expense") if fixed
  },

  handler: async (ctx, args) => {

    // Validate user exists
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Create expense
    const expenseId = await ctx.db.insert("expenses", {
      userId: args.userId,
      date: args.date,
      amount: args.amount,
      description: args.description,
      type: args.type,
      archived: args.archived,
    });

    return await ctx.db.get(expenseId);
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
  args: {
    userId: v.id("user"),
  },
  handler: async (ctx, args) => {
    const allExpenses = await ctx.db
      .query("expenses")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    for (const expense of allExpenses) {
      if (!expense.archived) {
        await ctx.db.patch(expense._id, { archived: true });
      }
    }

  },
});
export const unarchiveAllExpenses = mutation({
  handler: async (ctx) => {
    const allExpenses = await ctx.db
      .query("expenses")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
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
    await ctx.db.patch(args.id, { archived: true });

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

export const deleteAllExpense = mutation({
  args: {
    userId: v.string()
  },
  handler: async (ctx, args) => {
    const allExpenses = await ctx.db.query("expenses").filter((q) => q.eq(q.field("userId"), args.userId)).collect();
    for (const expense of allExpenses) {
      await ctx.db.delete(expense._id);
    }
  },
})