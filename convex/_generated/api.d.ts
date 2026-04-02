/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as analysis from "../analysis.js";
import type * as http from "../http.js";
import type * as jobApplications from "../jobApplications.js";
import type * as limitedPartnerApplications from "../limitedPartnerApplications.js";
import type * as scrapingJobs from "../scrapingJobs.js";
import type * as sprintParticipants from "../sprintParticipants.js";
import type * as sprintSponsors from "../sprintSponsors.js";
import type * as startupApplications from "../startupApplications.js";
import type * as subscriptions from "../subscriptions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  analysis: typeof analysis;
  http: typeof http;
  jobApplications: typeof jobApplications;
  limitedPartnerApplications: typeof limitedPartnerApplications;
  scrapingJobs: typeof scrapingJobs;
  sprintParticipants: typeof sprintParticipants;
  sprintSponsors: typeof sprintSponsors;
  startupApplications: typeof startupApplications;
  subscriptions: typeof subscriptions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
