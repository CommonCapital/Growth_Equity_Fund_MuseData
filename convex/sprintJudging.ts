import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submitRating = mutation({
  args: {
    teamId: v.id("sprintTeams"),
    sponsorId: v.id("sprintSponsors"),
    rating: v.number(), // 1-10
    note: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if sponsor already rated this team
    const existing = await ctx.db
      .query("sprintJudgments")
      .withIndex("by_team_and_sponsor", (q) =>
        q.eq("teamId", args.teamId).eq("sponsorId", args.sponsorId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        rating: args.rating,
        note: args.note,
        submittedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("sprintJudgments", {
      ...args,
      submittedAt: Date.now(),
    });
  },
});

export const listTeamsForJudging = query({
  args: {},
  handler: async (ctx) => {
    const teams = await ctx.db.query("sprintTeams").order("desc").collect();

    return await Promise.all(
      teams.map(async (t) => {
        const memberships = await ctx.db
          .query("sprintMemberships")
          .withIndex("by_team", (q) => q.eq("teamId", t._id))
          .collect();

        const participants = await Promise.all(
          memberships.map((m) => ctx.db.get(m.participantId))
        );

        return {
          ...t,
          members: participants.filter((p) => p !== null),
        };
      })
    );
  },
});

export const getRegistrationStatus = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const participant = await ctx.db
      .query("sprintParticipants")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (participant) return { type: "participant", data: participant };

    const sponsor = await ctx.db
      .query("sprintSponsors")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (sponsor) return { type: "sponsor", data: sponsor };

    return null;
  },
});
