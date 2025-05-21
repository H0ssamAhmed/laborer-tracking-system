const dummay = {
  id: "00x5kohppkhpmaqxhv00",
  date: "2025-05-15",
  amount: 100,
  description: "مصاريف للاسبوع",
  type: "expense"
}

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  expenses: defineTable({
    date: v.string(),
    amount: v.number(),
    description: v.optional(v.string()),
    type: v.string(),
    archived: v.boolean(),
  }),
  workdays: defineTable({
    date: v.string(),
    dayRate: v.number(),
    archived: v.boolean(),
  }),
});