import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import bcrypt from "bcryptjs";

export const signIn = query({
  args: {
    usecode: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("user")
      .withIndex("by_usecode", (q) => q.eq("usecode", args.usecode))
      .first();

    // if (!user) {
    //   throw new ConvexError("المستخدم غير موجود");
    // }
    console.log(user);
    return user


    // const isMatch = bcrypt.compareSync(args.password, hashedPassword);

    // const isMatch = await bcrypt.compare(args.password, user.password);

    if (!isMatch) {
      throw new ConvexError("كلمة المرور غير صحيحة");
    }

    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
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
      const foundUser = { name: `${existingUser.f_name} ${existingUser.l_name}` }
      return {
        message: "user already exists",
        existingUser: foundUser
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hashSync(args.password, 10);

    // Create the user
    const userId = await ctx.db.insert("user", {
      f_name: args.f_name,
      l_name: args.l_name,
      usecode: args.usecode,
      password: hashedPassword,
    });


    const user = await ctx.db.get(userId);
    // Don't return the password
    delete user.password

    const { password: _, ...userWithoutPassword } = user;
    console.log(userWithoutPassword);
    console.log(user);

    return userWithoutPassword;
  },
});
