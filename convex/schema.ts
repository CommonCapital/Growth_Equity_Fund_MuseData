import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  scrapingJobs: defineTable({
    userId: v.string(),
    originalPrompt: v.string(),
    analysisPrompt: v.optional(v.string()),
    snapshotId: v.optional(v.string()),
    status: v.union(
      v.literal("pending"), v.literal("scraping"), v.literal("scraped"),
      v.literal("running"), v.literal("analyzing"), v.literal("merging"),
      v.literal("completed"), v.literal("failed"), v.literal("retrying")
    ),
    results: v.optional(v.array(v.any())),
    seoReport: v.optional(v.any()),
    error: v.optional(v.string()),
    messages: v.optional(v.array(v.any())),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
    totalShards: v.optional(v.number()),
    completedGeminis: v.optional(v.number()),
    completedLLMs: v.optional(v.number()),
    shards: v.optional(v.array(v.object({
      shardName: v.string(), shardIndex: v.number(),
      geminiStatus: v.union(
        v.literal("pending"), v.literal("scraping"), v.literal("completed"),
        v.literal("failed"), v.literal("retry_needed")
      ),
      geminiSnapshotId: v.optional(v.string()), geminiRawData: v.optional(v.any()),
      geminiCompletedAt: v.optional(v.number()), geminiError: v.optional(v.string()),
      retryCount: v.optional(v.number()), lastRetryAt: v.optional(v.number()),
      retryReason: v.optional(v.string()),
      llmStatus: v.union(
        v.literal("pending"), v.literal("processing"), v.literal("completed"), v.literal("failed")
      ),
      llmParsedData: v.optional(v.any()), llmStartedAt: v.optional(v.number()),
      llmCompletedAt: v.optional(v.number()), llmError: v.optional(v.string()),
    }))),
  })
    .index("by_status", ["status"]).index("by_created_at", ["createdAt"])
    .index("by_user", ["userId"]).index("by_user_and_created_at", ["userId", "createdAt"])
    .index("by_user_and_status", ["userId", "status"]),

  user_report_limits: defineTable({
    userId: v.string(), totalLimit: v.number(), lastPaymentDate: v.number(),
  }).index("by_user", ["userId"]),

  gemini_job_queue: defineTable({
    job_id: v.id("scrapingJobs"), entity: v.string(),
    user_id: v.string(), status: v.string(), created_at: v.number(),
  }).index("by_status_created", ["status", "created_at"]),

  // ── Job Applications ──────────────────────────────────────────────────────
  jobApplications: defineTable({
    fullName: v.string(), email: v.string(),
    phone: v.optional(v.string()), location: v.string(),
    currentRole: v.string(), experience: v.string(),
    linkedin: v.optional(v.string()), portfolio: v.optional(v.string()),
    position: v.string(), motivation: v.string(), skills: v.string(),
    resumeStorageId: v.optional(v.id("_storage")),        // optional for manual entry
    coverLetterStorageId: v.optional(v.id("_storage")),
    status: v.union(
      v.literal("submitted"), v.literal("under_review"),
      v.literal("interviewing"), v.literal("accepted"), v.literal("rejected")
    ),
    submittedAt: v.number(), lastUpdatedAt: v.number(),
    reviewedBy: v.optional(v.string()), reviewNotes: v.optional(v.string()),
    termsAccepted: v.boolean(),
    manuallyAdded: v.optional(v.boolean()),
    addedBy: v.optional(v.string()),
  })
    .index("by_email", ["email"]).index("by_status", ["status"])
    .index("by_submitted_at", ["submittedAt"]).index("by_position", ["position"])
    .index("by_status_and_position", ["status", "position"])
    .searchIndex("search_name_email", { searchField: "fullName", filterFields: ["email", "status"] }),

  // ── Startup Applications ──────────────────────────────────────────────────
  startupApplications: defineTable({
    founderName: v.string(), founderEmail: v.string(),
    founderPhone: v.optional(v.string()), founderLinkedin: v.optional(v.string()),
    coFounders: v.optional(v.string()),
    companyName: v.string(), companyWebsite: v.optional(v.string()),
    companyLocation: v.string(),
    incorporationStatus: v.union(
      v.literal("incorporated"), v.literal("in_progress"), v.literal("not_yet")
    ),
    incorporationCountry: v.optional(v.string()), foundedDate: v.optional(v.string()),
    industry: v.string(),
    stage: v.union(
      v.literal("idea"), v.literal("prototype"), v.literal("mvp"),
      v.literal("early_revenue"), v.literal("growth")
    ),
    businessModel: v.string(), problemStatement: v.string(),
    solution: v.string(), uniqueValueProposition: v.string(),
    targetMarket: v.string(), marketSize: v.optional(v.string()),
    competitors: v.optional(v.string()), competitiveAdvantage: v.optional(v.string()),
    currentRevenue: v.optional(v.string()), revenueGrowth: v.optional(v.string()),
    numberOfCustomers: v.optional(v.string()), userMetrics: v.optional(v.string()),
    keyMilestones: v.string(),
    fundingStage: v.union(
      v.literal("pre_seed"), v.literal("seed"), v.literal("series_a"),
      v.literal("series_b"), v.literal("series_c_plus")
    ),
    fundingAmount: v.string(), previousFunding: v.optional(v.string()),
    currentInvestors: v.optional(v.string()), useOfFunds: v.string(),
    valuation: v.optional(v.string()), teamSize: v.string(),
    keyTeamMembers: v.string(), advisors: v.optional(v.string()),
    hiringPlans: v.optional(v.string()), productDescription: v.string(),
    technologyStack: v.optional(v.string()), intellectualProperty: v.optional(v.string()),
    productRoadmap: v.optional(v.string()),
    customerAcquisition: v.string(), salesStrategy: v.string(),
    marketingStrategy: v.optional(v.string()), partnershipStrategy: v.optional(v.string()),
    projectedRevenue: v.optional(v.string()), burnRate: v.optional(v.string()),
    runway: v.optional(v.string()), breakEvenTimeline: v.optional(v.string()),
    pitchDeckStorageId: v.optional(v.id("_storage")),     // optional for manual entry
    financialModelStorageId: v.optional(v.id("_storage")),
    businessPlanStorageId: v.optional(v.id("_storage")),
    productDemoStorageId: v.optional(v.id("_storage")),
    whyUs: v.string(), referralSource: v.optional(v.string()),
    exitStrategy: v.optional(v.string()), challenges: v.optional(v.string()),
    status: v.union(
      v.literal("submitted"), v.literal("under_review"), v.literal("due_diligence"),
      v.literal("term_sheet"), v.literal("funded"), v.literal("rejected"), v.literal("on_hold")
    ),
    submittedAt: v.number(), lastUpdatedAt: v.number(),
    reviewedBy: v.optional(v.string()), reviewNotes: v.optional(v.string()),
    internalRating: v.optional(v.number()), termsAccepted: v.boolean(),
    manuallyAdded: v.optional(v.boolean()),
    addedBy: v.optional(v.string()),
  })
    .index("by_founder_email", ["founderEmail"]).index("by_status", ["status"])
    .index("by_submitted_at", ["submittedAt"]).index("by_industry", ["industry"])
    .index("by_stage", ["stage"]).index("by_funding_stage", ["fundingStage"])
    .index("by_status_and_stage", ["status", "stage"])
    .index("by_status_and_industry", ["status", "industry"])
    .searchIndex("search_company_founder", {
      searchField: "companyName", filterFields: ["founderEmail", "status", "industry"],
    }),

  // ── Limited Partners ──────────────────────────────────────────────────────
  limitedPartners: defineTable({
    fullName: v.string(), organization: v.optional(v.string()),
    title: v.optional(v.string()), email: v.string(),
    phone: v.optional(v.string()), location: v.optional(v.string()),
    linkedin: v.optional(v.string()), website: v.optional(v.string()),
    investorType: v.union(
      v.literal("hnwi"), v.literal("family_office"), v.literal("endowment"),
      v.literal("pension_fund"), v.literal("corporate"), v.literal("fund_of_funds"),
      v.literal("sovereign_wealth"), v.literal("other")
    ),
    commitmentAmount: v.optional(v.string()), checkSizeRange: v.optional(v.string()),
    totalAUM: v.optional(v.string()), geographicFocus: v.optional(v.string()),
    sectorPreferences: v.optional(v.string()),
    status: v.union(
      v.literal("prospect"), v.literal("contacted"), v.literal("interested"),
      v.literal("soft_committed"), v.literal("committed"),
      v.literal("closed"), v.literal("declined")
    ),
    lastContactDate: v.optional(v.number()), nextFollowUpDate: v.optional(v.number()),
    meetingCount: v.optional(v.number()), source: v.optional(v.string()),
    referredBy: v.optional(v.string()), internalRating: v.optional(v.number()),
    notes: v.optional(v.string()), reviewNotes: v.optional(v.string()), // After `reviewNotes: v.optional(v.string()),` add:
ndaStorageId: v.optional(v.id("_storage")),
subscriptionAgreementStorageId: v.optional(v.id("_storage")),
    addedBy: v.string(), addedAt: v.number(), lastUpdatedAt: v.number(),
  })
    .index("by_email", ["email"]).index("by_status", ["status"])
    .index("by_added_at", ["addedAt"]).index("by_investor_type", ["investorType"])
    .index("by_status_and_type", ["status", "investorType"])
    .searchIndex("search_name_org", {
      searchField: "fullName", filterFields: ["email", "status", "investorType"],
    }),
    // ─────────────────────────────────────────────────────────────────────────────
// ── Harvard AI Build Sprint — Participant Registrations ───────────────────────
sprintParticipants: defineTable({
  userId:           v.optional(v.string()), // Clerk ID
  fullName:         v.string(),
  email:            v.string(),
  institution:      v.string(),
  programYear:      v.string(),
  areaOfFocus:      v.string(),
  backgrounds:      v.array(v.string()),   // checkboxes
 skills:           v.string(),
executionStyle:   v.string(),            // radio

//   // Section 3 – Experience & Build History
 hasPriorWork:     v.string(),            // Yes / No
 projectSnapshot:  v.string(),
  primaryRole:      v.string(),            // radio
   outcomes:         v.array(v.string()),   // checkboxes (optional)
  linkedinUrl:      v.optional(v.string()),
  portfolioUrl:     v.optional(v.string()),
  proofLinks:       v.optional(v.string()),

//   // Section 4 – Availability & Participation
  availWindow:      v.string(),
  timeCommitment:   v.string(),
  locationPref:     v.optional(v.string()),
  commitSignal:     v.string(),

//   // Section 5 – Teaming & Opportunities
   teamPreference:   v.string(),
   collabStyle:      v.string(),
  interests:        v.array(v.string()),
  postSprintIntent: v.string(),
  openToSponsor:    v.optional(v.string()),

//   // Section 6 – Your Interest
  motivation:       v.string(),

//   // Meta
   status:           v.union(
    v.literal("submitted"), v.literal("under_review"),
    v.literal("accepted"),  v.literal("rejected"), v.literal("waitlisted")
  ),
 submittedAt:      v.number(),
  lastUpdatedAt:    v.number(),
  reviewedBy:       v.optional(v.string()),
  reviewNotes:      v.optional(v.string()),
 })
   .index("by_email",        ["email"])
   .index("by_status",       ["status"])
  .index("by_submitted_at", ["submittedAt"])
  .searchIndex("search_name_email", {
   searchField: "fullName",
     filterFields: ["email", "status"],
  }),

// ── Harvard AI Build Sprint — Sponsor Applications ────────────────────────────
 sprintSponsors: defineTable({
  userId:             v.optional(v.string()), // Clerk ID
  companyName:        v.string(),
  contactName:        v.string(),
  contactTitle:       v.string(),
  email:              v.string(),
  phone:              v.optional(v.string()),
  website:            v.string(),
  linkedin:           v.optional(v.string()),

//   // Section 2 – Organization Type
   orgType:            v.string(),    // radio
   orgStage:           v.string(),    // radio

  // Section 3 – Sponsorship Interest
  involvementTypes:   v.array(v.string()),  // checkboxes
  sponsorLevel:       v.string(),    // radio
  anchorPartner:      v.string(),    // radio

//   // Section 4 – Objectives
   primaryGoals:       v.array(v.string()),  // checkboxes
   successDefinition:  v.string(),    // paragraph

//   // Section 5 – Event Fit
  relevantAreas:      v.array(v.string()),  // checkboxes
  participantEngagement: v.array(v.string()), // checkboxes

//   // Section 6 – Timing & Format
   preferredTimeframe: v.string(),    // radio
  participationFormat: v.string(),   // radio
  openToExpansion:    v.string(),    // radio

//   // Section 7 – Internal Process
  isDecisionMaker:    v.string(),    // radio
  otherApprovers:     v.optional(v.string()),
  decisionTimeline:   v.string(),    // radio

//   // Section 8 – Additional Notes
  additionalNotes:    v.optional(v.string()),

  // Section 9 – Source
  referralSource:     v.string(),    // radio

//   // Meta
  status:             v.union(
     v.literal("submitted"), v.literal("under_review"),
    v.literal("in_discussion"), v.literal("committed"), v.literal("declined")
  ),
  submittedAt:        v.number(),
   lastUpdatedAt:      v.number(),
   reviewedBy:         v.optional(v.string()),
   reviewNotes:        v.optional(v.string()),
   internalRating:     v.optional(v.number()),
 })
   .index("by_email",        ["email"])
   .index("by_status",       ["status"])
   .index("by_submitted_at", ["submittedAt"])
   .index("by_org_type",     ["orgType"])
   .searchIndex("search_company_contact", {
     searchField: "companyName",
     filterFields: ["email", "status", "orgType"],
   }),
  // ── Harvard AI Build Sprint — Teaming & Judging ──────────────────────────────
  sprintTeams: defineTable({
    name: v.string(),
    description: v.string(),
    videoUrl: v.string(),
    githubUrl: v.string(),
    leaderId: v.id("sprintParticipants"),
    inviteCode: v.string(),
    submittedAt: v.number(),
  })
    .index("by_leader", ["leaderId"])
    .index("by_invite_code", ["inviteCode"]),

  sprintMemberships: defineTable({
    teamId: v.id("sprintTeams"),
    participantId: v.id("sprintParticipants"),
    role: v.union(v.literal("leader"), v.literal("member")),
  })
    .index("by_team", ["teamId"])
    .index("by_participant", ["participantId"])
    .index("by_team_and_participant", ["teamId", "participantId"]),

  sprintJudgments: defineTable({
    teamId: v.id("sprintTeams"),
    sponsorId: v.id("sprintSponsors"),
    rating: v.number(), // 1-10
    note: v.string(),
    submittedAt: v.number(),
  })
    .index("by_team", ["teamId"])
    .index("by_sponsor", ["sponsorId"])
    .index("by_team_and_sponsor", ["teamId", "sponsorId"]),
});