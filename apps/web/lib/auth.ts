import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, anonymous, organization, twoFactor } from "better-auth/plugins";

// DB instance is wired in server/db.ts (Drizzle + Neon).
// Kept minimal so `next dev` boots without env.
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET ?? "dev-secret-change-me",
  emailAndPassword: { enabled: true, requireEmailVerification: false },
  session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
  plugins: [
    anonymous(), // guest shoppers, auto-upgraded on signup
    twoFactor(), // enforced for admin_* roles in middleware
    admin({ defaultRole: "customer" }),
    organization(), // roles: super/support/content/consultant-designer
    nextCookies(), // must be last
  ],
});

export type Session = typeof auth.$Infer.Session;
