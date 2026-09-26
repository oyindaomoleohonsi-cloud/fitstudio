// Drizzle + Neon schema (subset: sizing taxonomy + try-on privacy + BetterAuth core).
// Run: drizzle-kit generate && drizzle-kit migrate

import { boolean, integer, pgTable, text, timestamp, real } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("customer"), // customer|admin_super|admin_support|admin_content|admin_consultant_designer
  createdAt: timestamp("created_at").defaultNow(),
});

// BetterAuth core (simplified; `better-auth` CLI can expand)
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(), userId: text("user_id").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(), userId: text("user_id").notNull(), providerId: text("provider_id").notNull(),
});
export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(), identifier: text("identifier").notNull(), expiresAt: timestamp("expires_at").notNull(),
});

export const measurements = pgTable("measurements", {
  id: text("id").primaryKey(), userId: text("user_id").notNull(),
  bustCm: real("bust_cm"), waistCm: real("waist_cm"), hipsCm: real("hips_cm"),
  heightCm: real("height_cm"), updatedAt: timestamp("updated_at").defaultNow(),
});

export const sizeSystems = pgTable("size_systems", { id: text("id").primaryKey(), code: text("code").notNull().unique() });
export const sizeLabels = pgTable("size_labels", {
  id: text("id").primaryKey(), systemId: text("system_id").notNull(), label: text("label").notNull(), sortOrder: integer("sort_order").notNull().default(0),
});
export const sizeIntervals = pgTable("size_intervals", {
  id: text("id").primaryKey(), labelId: text("label_id").notNull(), area: text("area").notNull(),
  minCm: real("min_cm").notNull(), maxCm: real("max_cm").notNull(),
});
export const regionMappings = pgTable("region_mappings", {
  id: text("id").primaryKey(), fromSystem: text("from_system").notNull(), fromLabel: text("from_label").notNull(),
  toSystem: text("to_system").notNull(), toLabel: text("to_label").notNull(),
});

export const garments = pgTable("garments", {
  id: text("id").primaryKey(), brand: text("brand").notNull(), name: text("name").notNull(),
  status: text("status").notNull().default("draft"), // draft|published|archived
});
export const garmentSizes = pgTable("garment_sizes", {
  id: text("id").primaryKey(), garmentId: text("garment_id").notNull(), labelId: text("label_id").notNull(),
});

export const tryonSessions = pgTable("tryon_sessions", {
  id: text("id").primaryKey(), userId: text("user_id").notNull(), garmentId: text("garment_id").notNull(),
  mode: text("mode").notNull().default("live_ephemeral"), stored: boolean("stored").notNull().default(false),
  consentId: text("consent_id"), createdAt: timestamp("created_at").defaultNow(),
});
export const consents = pgTable("consents", {
  id: text("id").primaryKey(), userId: text("user_id"), kind: text("kind").notNull(), // process-live|save-result|analytics
  createdAt: timestamp("created_at").defaultNow(),
});
export const adminAuditLogs = pgTable("admin_audit_logs", {
  id: text("id").primaryKey(), adminId: text("admin_id").notNull(), action: text("action").notNull(),
  targetUserId: text("target_user_id"), reason: text("reason"), createdAt: timestamp("created_at").defaultNow(),
});
