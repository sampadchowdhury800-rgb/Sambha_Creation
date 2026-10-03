import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/secure-admin-login',
    error: '/secure-admin-login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl;

      // Protect admin routes
      if (pathname.startsWith('/admin')) {
        return !!session?.user;
      }

      return true;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
