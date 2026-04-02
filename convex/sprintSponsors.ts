import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submitSponsor = mutation({
  args: {
    // Section 1 – Organization Information
    companyName:           v.string(),
    contactName:           v.string(),
    contactTitle:          v.string(),
    email:                 v.string(),
    phone:                 v.optional(v.string()),
    website:               v.string(),
    linkedin:              v.optional(v.string()),

    // Section 2 – Organization Type
    orgType:               v.string(),
    orgStage:              v.string(),

    // Section 3 – Sponsorship Interest
    involvementTypes:      v.array(v.string()),
    sponsorLevel:          v.string(),
    anchorPartner:         v.string(),

    // Section 4 – Objectives
    primaryGoals:          v.array(v.string()),
    successDefinition:     v.string(),

    // Section 5 – Event Fit
    relevantAreas:         v.array(v.string()),
    participantEngagement: v.array(v.string()),

    // Section 6 – Timing & Format
    preferredTimeframe:    v.string(),
    participationFormat:   v.string(),
    openToExpansion:       v.string(),

    // Section 7 – Internal Process
    isDecisionMaker:       v.string(),
    otherApprovers:        v.optional(v.string()),
    decisionTimeline:      v.string(),

    // Section 8 – Additional Notes
    additionalNotes:       v.optional(v.string()),

    // Section 9 – Source
    referralSource:        v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const existing = await ctx.db
      .query("sprintSponsors")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("An application with this email already exists.");
    }

    const id = await ctx.db.insert("sprintSponsors", {
      ...args,
      status: "submitted",
      submittedAt: now,
      lastUpdatedAt: now,
    });

    return { id, success: true };
  },
});

export const getSponsorByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return ctx.db
      .query("sprintSponsors")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  },
});

export const listSponsors = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, { status }) => {
    if (status) {
      return ctx.db
        .query("sprintSponsors")
        .withIndex("by_status", (q) =>
          q.eq(
            "status",
            status as "submitted" | "under_review" | "in_discussion" | "committed" | "declined"
          )
        )
        .order("desc")
        .collect();
    }
    return ctx.db
      .query("sprintSponsors")
      .withIndex("by_submitted_at")
      .order("desc")
      .collect();
  },
});