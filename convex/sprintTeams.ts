import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Helper to generate a random invite code
function generateInviteCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export const createTeam = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    videoUrl: v.string(),
    githubUrl: v.string(),
    leaderId: v.id("sprintParticipants"),
  },
  handler: async (ctx, args) => {
    // Check if user is already in a team
    const existingMembership = await ctx.db
      .query("sprintMemberships")
      .withIndex("by_participant", (q) => q.eq("participantId", args.leaderId))
      .first();

    if (existingMembership) {
      throw new Error("You are already a member of a team.");
    }

    const inviteCode = generateInviteCode();
    const teamId = await ctx.db.insert("sprintTeams", {
      ...args,
      inviteCode,
      submittedAt: Date.now(),
    });

    // Add leader to memberships
    await ctx.db.insert("sprintMemberships", {
      teamId,
      participantId: args.leaderId,
      role: "leader",
    });

    return teamId;
  },
});

export const joinTeamByInvite = mutation({
  args: {
    inviteCode: v.string(),
    participantId: v.id("sprintParticipants"),
  },
  handler: async (ctx, args) => {
    const team = await ctx.db
      .query("sprintTeams")
      .withIndex("by_invite_code", (q) => q.eq("inviteCode", args.inviteCode))
      .unique();

    if (!team) {
      throw new Error("Invalid invite code.");
    }

    // Check if already a member
    const existingMembership = await ctx.db
      .query("sprintMemberships")
      .withIndex("by_participant", (q) => q.eq("participantId", args.participantId))
      .first();

    if (existingMembership) {
      if (existingMembership.teamId === team._id) {
        return team._id; // Already in this team
      }
      throw new Error("You are already a member of another team.");
    }

    await ctx.db.insert("sprintMemberships", {
      teamId: team._id,
      participantId: args.participantId,
      role: "member",
    });

    return team._id;
  },
});

export const updateProject = mutation({
  args: {
    teamId: v.id("sprintTeams"),
    leaderId: v.id("sprintParticipants"),
    name: v.string(),
    description: v.string(),
    videoUrl: v.string(),
    githubUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const team = await ctx.db.get(args.teamId);
    if (!team || team.leaderId !== args.leaderId) {
      throw new Error("Only the team leader can update project details.");
    }

    await ctx.db.patch(args.teamId, {
      name: args.name,
      description: args.description,
      videoUrl: args.videoUrl,
      githubUrl: args.githubUrl,
    });
  },
});

export const getTeamInfo = query({
  args: { teamId: v.id("sprintTeams") },
  handler: async (ctx, args) => {
    const team = await ctx.db.get(args.teamId);
    if (!team) return null;

    const memberships = await ctx.db
      .query("sprintMemberships")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();

    const participants = await Promise.all(
      memberships.map((m) => ctx.db.get(m.participantId))
    );

    const judgments = await ctx.db
      .query("sprintJudgments")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();

    const feedback = await Promise.all(
      judgments.map(async (j) => {
        const sponsor = await ctx.db.get(j.sponsorId);
        return {
          ...j,
          sponsorName: sponsor?.companyName || "Unknown Sponsor",
        };
      })
    );

    return {
      ...team,
      members: participants.filter((p) => p !== null),
      feedback,
    };
  },
});

export const getMyTeam = query({
  args: { participantId: v.id("sprintParticipants") },
  handler: async (ctx, args) => {
    const membership = await ctx.db
      .query("sprintMemberships")
      .withIndex("by_participant", (q) => q.eq("participantId", args.participantId))
      .first();

    if (!membership) return null;

    return ctx.db.get(membership.teamId);
  },
});
