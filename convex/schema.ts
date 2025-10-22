import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  words: defineTable({
    word: v.string(),
    meaning: v.string(),
    examples: v.array(v.string()),
  })
})
