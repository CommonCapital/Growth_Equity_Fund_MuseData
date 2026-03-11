import { v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * Public-facing LP interest form submission.
 * Inserts into the existing `limitedPartners` table with status "prospect"
 * and manuallyAdded: false so the admin CRM can distinguish self-submitted LPs
 * from manually entered ones.
 */
export const submitLPApplication = mutation({
  args: {
    // Required
    fullName: v.string(),
    email: v.string(),

    // Identity
    organization: v.optional(v.string()),
    title: v.optional(v.string()),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    website: v.optional(v.string()),

    // Investor classification
    investorType: v.union(
      v.literal("hnwi"),
      v.literal("family_office"),
      v.literal("endowment"),
      v.literal("pension_fund"),
      v.literal("corporate"),
      v.literal("fund_of_funds"),
      v.literal("sovereign_wealth"),
      v.literal("other")
    ),

    // Investment profile
    commitmentAmount: v.optional(v.string()),
    checkSizeRange: v.optional(v.string()),
    totalAUM: v.optional(v.string()),
    geographicFocus: v.optional(v.string()),
    sectorPreferences: v.optional(v.string()),

    // How they found us
    source: v.optional(v.string()),
    referredBy: v.optional(v.string()),

    // Free-text notes / questions
    notes: v.optional(v.string()),
  },
  returns: v.object({
    lpId: v.id("limitedPartners"),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email)) {
      throw new Error("Invalid email address");
    }

    // Duplicate guard — same email already exists as a prospect/contacted record
    const existing = await ctx.db
      .query("limitedPartners")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error(
        "We already have your details on file. Please contact us at partners@musedata.ai for an update."
      );
    }

    const now = Date.now();

    const lpId = await ctx.db.insert("limitedPartners", {
      fullName: args.fullName,
      email: args.email,
      organization: args.organization,
      title: args.title,
      phone: args.phone,
      location: args.location,
      linkedin: args.linkedin,
      website: args.website,
      investorType: args.investorType,
      commitmentAmount: args.commitmentAmount,
      checkSizeRange: args.checkSizeRange,
      totalAUM: args.totalAUM,
      geographicFocus: args.geographicFocus,
      sectorPreferences: args.sectorPreferences,
      // Pipeline entry point — always starts as "prospect" for self-submitted LPs
      status: "prospect",
      source: args.source,
      referredBy: args.referredBy,
      notes: args.notes,
      // Audit fields
      addedBy: "public_form",
      addedAt: now,
      lastUpdatedAt: now,
      // Not manually added by an admin
      
    });

    // TODO: Send confirmation email to LP
    // TODO: Notify investor relations team

    return {
      lpId,
      message:
        "Thank you for your interest. Our investor relations team will be in touch within 5 business days.",
    };
  },
});