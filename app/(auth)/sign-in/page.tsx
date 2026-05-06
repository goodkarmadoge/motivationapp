import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase";
import { signIn } from "../actions";
import { MotivationWordmark } from "@/components/ui/motivation-logo";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C0C0C] py-12 px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10 animate-fade-up">
          <MotivationWordmark size="lg" orientation="vertical" />
          <p className="text-white/30 text-sm mt-4 tracking-wide">Track your habits. Build your life.</p>
        </div>

        {isSupabaseConfigured ? (
          <div
            className="rounded-2xl border border-white/[0.08] p-6 animate-fade-up"
            style={{ animationDelay: '80ms', backgroundColor: 'rgba(255,255,255,0.03)' }}
          >
            <div className="text-center mb-6">
              <h1 className="text-lg font-semibold text-white/85">Welcome back</h1>
              <p className="text-white/35 text-sm mt-1">Sign in to continue</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form action={signIn} className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white/80 placeholder:text-white/18 focus:outline-none focus:border-white/[0.2] transition-colors"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Your password"
                  required
                  className="w-full px-4 py-3 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white/80 placeholder:text-white/18 focus:outline-none focus:border-white/[0.2] transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 text-sm font-semibold bg-white text-[#0C0C0C] rounded-xl hover:bg-white/90 active:scale-[0.99] transition-all mt-1"
              >
                Sign In
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-white/30">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-white/65 hover:text-white/88 transition-colors font-medium">
                Sign up
              </Link>
            </p>

            <div className="mt-5 pt-5 border-t border-white/[0.06] text-center">
              <a
                href="/api/demo/start"
                className="text-sm text-white/25 hover:text-white/55 transition-colors underline underline-offset-2"
              >
                Try demo without an account →
              </a>
            </div>
          </div>
        ) : (
          <div
            className="rounded-2xl border border-white/[0.08] p-6 animate-fade-up"
            style={{ animationDelay: '80ms', backgroundColor: 'rgba(255,255,255,0.03)' }}
          >
            <h2 className="text-lg font-semibold text-white/85 mb-3">Authentication Not Configured</h2>
            <p className="text-white/40 text-sm mb-4">
              Add your Supabase keys to{" "}
              <code className="bg-white/[0.07] px-1.5 py-0.5 rounded text-white/60">.env.local</code>:
            </p>
            <pre className="bg-white/[0.04] border border-white/[0.06] p-3 rounded-xl text-xs text-white/50 overflow-x-auto mb-4">
              {`NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...`}
            </pre>
            <Link href="/">
              <button className="w-full py-3 text-sm font-semibold bg-white/[0.07] text-white/60 border border-white/[0.08] rounded-xl hover:bg-white/[0.1] transition-colors">
                Back to Home
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
