import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
// import { mutation, query } from "./server";

// Get all todos
export const getTodos = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("todos")
      .withIndex("by_order")
      .order("asc")
      .collect();
  },
});

// Create todo
export const createTodo = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const todos = await ctx.db.query("todos").collect();
    const maxOrder = todos.length > 0 ? Math.max(...todos.map(t => t.order)) : 0;
    
    return await ctx.db.insert("todos", {
      title: args.title,
     completed: false,
      createdAt: Date.now(),
      order: maxOrder + 1,
    });
  },
});

// Update todo
export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    title: v.optional(v.string()),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Delete todo
export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Toggle todo completion
export const toggleTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) throw new Error("Todo not found");

    await ctx.db.patch(args.id, {
      completed: !todo.completed,
    });
  },
});

export const reorderTodos = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("todos"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const update of args.updates) {
      await ctx.db.patch(update.id, { order: update.order });
    }
  },
});

export const clearCompleted = mutation({
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();
    const completed = todos.filter(t => t.completed);
    
    for (const todo of completed) {
      await ctx.db.delete(todo._id);
    }
  },
});