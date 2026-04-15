import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submitParticipant = mutation({
  args: {
    // Section 1 – About You
    fullName:         v.string(),
    email:            v.string(),
    institution:      v.string(),
    programYear:      v.string(),
    areaOfFocus:      v.string(),

    // Section 2 – Skills & Capabilities
    backgrounds:      v.array(v.string()),
    skills:           v.string(),
    executionStyle:   v.string(),

    // Section 3 – Experience & Build History
    hasPriorWork:     v.string(),
    projectSnapshot:  v.string(),
    primaryRole:      v.string(),
    outcomes:         v.array(v.string()),
    linkedinUrl:      v.optional(v.string()),
    portfolioUrl:     v.optional(v.string()),
    proofLinks:       v.optional(v.string()),

    // Section 4 – Availability & Participation
    availWindow:      v.string(),
    timeCommitment:   v.string(),
    locationPref:     v.optional(v.string()),
    commitSignal:     v.string(),

    // Section 5 – Teaming & Opportunities
    teamPreference:   v.string(),
    collabStyle:      v.string(),
    interests:        v.array(v.string()),
    postSprintIntent: v.string(),
    openToSponsor:    v.optional(v.string()),

    motivation:       v.string(),
    userId:           v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Prevent duplicate submissions by email
    const existing = await ctx.db
      .query("sprintParticipants")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("An application with this email already exists.");
    }

    const id = await ctx.db.insert("sprintParticipants", {
      ...args,
      status: "submitted",
      submittedAt: now,
      lastUpdatedAt: now,
    });

    return { id, success: true };
  },
});

export const getParticipantByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return ctx.db
      .query("sprintParticipants")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  },
});

export const listParticipants = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, { status }) => {
    if (status) {
      return ctx.db
        .query("sprintParticipants")
        .withIndex("by_status", (q) =>
          q.eq("status", status as "submitted" | "under_review" | "accepted" | "rejected" | "waitlisted")
        )
        .order("desc")
        .collect();
    }
    return ctx.db
      .query("sprintParticipants")
      .withIndex("by_submitted_at")
      .order("desc")
      .collect();
  },
});