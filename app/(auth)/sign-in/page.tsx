import { isSupabaseConfigured } from "@/lib/supabase";
import { signInWithGoogle } from "../actions";
import { MotivationWordmark } from "@/components/ui/motivation-logo";
import Link from "next/link";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C0C0C] py-12 px-4">
      <div className="w-full max-w-sm">

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

            <form action={signInWithGoogle}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 py-3 text-sm font-semibold bg-white text-[#0C0C0C] rounded-xl hover:bg-white/90 active:scale-[0.99] transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </form>

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
