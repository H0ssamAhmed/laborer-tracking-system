import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

export const signIn = mutation({
  args: {
    usecode: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by usecode
    const user = await ctx.db
      .query("user")
      .withIndex("by_usecode", (q) => q.eq("usecode", args.usecode))
      .first();

    const CheckUserCredentials = user && user.password === args.password;
    if (!CheckUserCredentials) {
      return ({ ok: false, message: "اسم المستخدم او كلمة المرور خطاء" });
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, ok: true };
  },
});

export const signUp = mutation({
  args: {
    f_name: v.string(),
    l_name: v.string(),
    usecode: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if usercode already exists
    const existingUser = await ctx.db
      .query("user")
      .withIndex("by_usecode", (q) => q.eq("usecode", args.usecode))
      .first();

    if (existingUser) {
      return {
        message: "اسم المستخدم موجود بالفعل",
        ok: false,
      };
    }

    // Create the user
    const userId = await ctx.db.insert("user", {
      f_name: args.f_name,
      l_name: args.l_name,
      usecode: args.usecode,
      password: args.password,
    });

    const user = await ctx.db.get(userId);
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, ok: true };
  },
});

export const getUserData = query({
  args: {
    userId: v.id("user"),
  },
  handler: async (ctx, args) => {
    // Validate user session and get user data
    const user = await validateUserSession(ctx, args.userId);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
});

export const updateUserData = mutation({
  args: {
    userId: v.id("user"),
    f_name: v.optional(v.string()),
    l_name: v.optional(v.string()),
    currentPassword: v.optional(v.string()),
    newPassword: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate user session
    const user = await validateUserSession(ctx, args.userId);

    const updates = {
      updated_at: new Date().toISOString(),
    };

    // Update name fields if provided
    if (args.f_name) updates.f_name = args.f_name;
    if (args.l_name) updates.l_name = args.l_name;

    // Update password if provided
    if (args.currentPassword && args.newPassword) {
      // Verify current password
      const isPasswordValid = await bcrypt.compare(args.currentPassword, user.password);
      if (!isPasswordValid) {
        throw new ConvexError({ message: "كلمة المرور الحالية غير صحيحة" });
      }
      // Hash and update new password
      updates.password = await bcrypt.hash(args.newPassword, 10);
    }

    // Update user data
    await ctx.db.patch(args.userId, updates);

    // Return updated user data
    const updatedUser = await ctx.db.get(args.userId);
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },
});

export const deleteUser = mutation({
  args: {
    userId: v.id("user"),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate user session
    const user = await validateUserSession(ctx, args.userId);

    // Verify password before deletion
    const isPasswordValid = await bcrypt.compare(args.password, user.password);
    if (!isPasswordValid) {
      throw new ConvexError({ message: "كلمة المرور غير صحيحة" });
    }

    // Delete user data
    await ctx.db.delete(args.userId);
    return { message: "تم حذف الحساب بنجاح" };
  },
});
