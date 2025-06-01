import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// Helper function to validate user session
const validateUserSession = async (ctx, userId) => {
  if (!userId) {
    throw new ConvexError({ message: "غير مصرح لك بالوصول" });
  }
  const user = await ctx.db.get(userId);
  if (!user) {
    throw new ConvexError({ message: "المستخدم غير موجود" });
  }
  return user;
};

// Get all days for a specific user
export const getAllDays = query({
  args: {
    userId: v.optional(v.id("user")),
  },
  handler: async (ctx, args) => {
    if (!args.userId) {
      return [];
    }
    return await ctx.db
      .query("workdays")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
  },
});

// Add a new day for a specific user
export const addDay = mutation({
  args: {
    userId: v.id("user"),
    date: v.string(),
    dayRate: v.number(),
    archived: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Validate user exists
    await validateUserSession(ctx, args.userId);

    const dayId = await ctx.db.insert("workdays", {
      userId: args.userId,
      date: args.date,
      dayRate: args.dayRate,
      archived: args.archived,
    });

    return await ctx.db.get(dayId);
  },
});

// Delete a day by document ID
export const deleteDay = mutation({
  args: {
    id: v.id("workdays"),
    userId: v.id("user"),
  },
  handler: async (ctx, args) => {
    // Validate user session
    await validateUserSession(ctx, args.userId);

    // Get the workday
    const workday = await ctx.db.get(args.id);
    if (!workday) {
      throw new ConvexError({ message: "يوم العمل غير موجود" });
    }

    // Verify the workday belongs to the user
    if (workday.userId !== args.userId) {
      throw new ConvexError({ message: "غير مصرح لك بحذف هذا اليوم" });
    }

    await ctx.db.delete(args.id);
  },
});

// Archive all days for a specific user
export const archiveAllDays = mutation({
  args: {
    userId: v.id("user"),
  },
  handler: async (ctx, args) => {
    // Validate user session
    await validateUserSession(ctx, args.userId);

    const days = await ctx.db
      .query("workdays")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    for (const day of days) {
      if (!day.archived) {
        await ctx.db.patch(day._id, { archived: true });
      }
    }
  },
});

// Unarchive all days for a specific user
export const unarchiveAllDays = mutation({
  args: {
    userId: v.id("user"),
  },
  handler: async (ctx, args) => {
    // Validate user session
    await validateUserSession(ctx, args.userId);

    const days = await ctx.db
      .query("workdays")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    for (const day of days) {
      if (day.archived) {
        await ctx.db.patch(day._id, { archived: false });
      }
    }
  },
});

// Archive a specific day
export const archiveSingleDay = mutation({
  args: {
    id: v.id("workdays"),
    userId: v.id("user"),
  },
  handler: async (ctx, args) => {
    // Validate user session
    await validateUserSession(ctx, args.userId);

    // Get the workday
    const workday = await ctx.db.get(args.id);
    if (!workday) {
      throw new ConvexError({ message: "يوم العمل غير موجود" });
    }

    // Verify the workday belongs to the user
    if (workday.userId !== args.userId) {
      throw new ConvexError({ message: "غير مصرح لك بأرشفة هذا اليوم" });
    }

    await ctx.db.patch(args.id, { archived: true });
  },
});

// Unarchive a specific day
export const unarchiveSingleDay = mutation({
  args: {
    id: v.id("workdays"),
    userId: v.id("user"),
  },
  handler: async (ctx, args) => {
    // Validate user session
    await validateUserSession(ctx, args.userId);

    // Get the workday
    const workday = await ctx.db.get(args.id);
    if (!workday) {
      throw new ConvexError({ message: "يوم العمل غير موجود" });
    }

    // Verify the workday belongs to the user
    if (workday.userId !== args.userId) {
      throw new ConvexError({ message: "غير مصرح لك بإلغاء أرشفة هذا اليوم" });
    }

    await ctx.db.patch(args.id, { archived: false });
  },
});

// Delete all days for a specific user
export const deleteAllDays = mutation({
  args: {
    userId: v.id("user"),
  },
  handler: async (ctx, args) => {
    // Validate user session
    await validateUserSession(ctx, args.userId);

    const days = await ctx.db
      .query("workdays")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    for (const day of days) {
      await ctx.db.delete(day._id);
    }
  },
});
