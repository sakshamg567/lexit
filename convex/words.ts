import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createWord = mutation({
  args: {
    owner: v.string(),
    word: v.string(),
    meaning: v.string(),
    examples: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("words", {
      owner: args.owner,
      word: args.word,
      meaning: args.meaning,
      examples: args.examples,
    });
    return id;
  },
});

export const getWords = query({
  args: {},
  handler: async (ctx, args) => {
    const words = await ctx.db.query("words").collect();
    return words;
  },
});

export const getWordByName = query({
  args: { word: v.string() },
  handler: async (ctx, args) => {
    const allWords = await ctx.db.query("words").collect();
    return allWords.find(
      (w) => w.word.toLowerCase() === args.word.toLowerCase()
    );
  },
});

export const deleteWord = mutation({
  args: { word: v.string() },
  handler: async (ctx, args) => {
    const word = await ctx.db
      .query("words")
      .withIndex("by_word", (q) => q.eq("word", args.word))
      .first();
    if (word) {
      await ctx.db.delete(word._id);
      return true;
    }
    return false;
  },
});

export const updateCount = mutation({
  args: {},
  handler: async (ctx) => {
    const metadata = await ctx.db.query("metadata").collect();
    let count = 0;
    if (metadata.length === 0) {
      count = 1;
      await ctx.db.insert("metadata", { word_count: count });
    } else {
      count = metadata[0].word_count + 1;
      await ctx.db.patch(metadata[0]._id, { word_count: count });
    }
    return count;
  },
});

export const getTotalWordCount = query({
  args: {},
  handler: async (ctx) => {
    const metadata = await ctx.db.query("metadata").collect();
    const count = metadata?.[0]?.word_count || 0;
    return count;
  },
});

export const getUserWord = query({
  args: { owner: v.string() },
  handler: async (ctx, args) => {
    const userWords = await ctx.db
      .query("words")
      .filter((q) => q.eq(q.field("owner"), args.owner))
      .collect();
    console.log("owner: ", args.owner);
    return userWords;
  },
});
