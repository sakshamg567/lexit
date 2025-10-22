import { v } from 'convex/values'
import { mutation } from './_generated/server'

export const createWord = mutation({
  args: {
    word: v.string(),
    meaning: v.string(),
    examples: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('words', {
      word: args.word,
      meaning: args.meaning,
      examples: args.examples,
    })
    return id
  }
})
