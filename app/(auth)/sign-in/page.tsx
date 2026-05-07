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
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1
