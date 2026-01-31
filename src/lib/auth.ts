import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";

export const authOptions: NextAuthOptions = {
  // Use a stable secret in development to avoid session invalidation on hot reload
  secret:
    process.env.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV !== "production" ? "dev-secret-change-me" : randomBytes(32).toString("hex")),
  debug: process.env.NODE_ENV !== "production",
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log('Authorization attempt with credentials:', { email: credentials?.email });
        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password) {
          console.log('Missing email or password');
          return null;
        }

        try {
          const user = await prisma.user.findUnique({ where: { email } });
          console.log('User found in database:', user ? { id: user.id, email: user.email, role: user.role } : 'Not found');
          
          if (!user) {
            console.log('No user found with email:', email);
            return null;
          }

          console.log('Comparing password...');
          const ok = await bcrypt.compare(password, user.hashedPassword);
          console.log('Password comparison result:', ok);
          
          if (!ok) {
            console.log('Invalid password for user:', email);
            return null;
          }
          
          console.log('Authentication successful for user:', { id: user.id, email: user.email, role: user.role });
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          } as unknown as { id: string; name: string; email: string; role: string };
        } catch (error) {
          console.error('Error during authentication:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as unknown as { role?: string }).role = (user as unknown as { role?: string }).role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as { role?: string }).role = (token as unknown as { role?: string }).role;
      }
      return session;
    },
  },
};
