import { betterAuth } from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { nextCookies } from "better-auth/next-js";

console.log("AUTH PRISMA VERIFICATION:", !!prisma.verification);

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: { 
    github: { 
      clientId: process.env.GITHUB_CLIENT_ID as string, 
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
    }, 
  },

  plugins: [nextCookies()] // make sure this is the last plugin in the array
});