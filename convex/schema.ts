import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  expenses: defineTable({
    userId: v.optional(v.string()),
    date: v.string(),
    amount: v.number(),
    description: v.optional(v.string()),
    type: v.string(),
    archived: v.boolean(),
  }),
  workdays: defineTable({
    userId: v.string(),
    date: v.string(),
    dayRate: v.number(),
    archived: v.boolean(),
  }),
  user: defineTable({
    f_name: v.string(),
    l_name: v.string(),
    usecode: v.string(),
    password: v.string(),
  }).index("by_usecode", ["usecode"]),
});