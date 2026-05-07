import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Use NEXT_PUBLIC_APP_URL for production, fall back to request origin
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || origin;
      return NextResponse.redirect(`${appUrl}${next}`);
    }
  }

  // Something went wrong — send to sign-in with error
  // Use NEXT_PUBLIC_APP_URL for production, fall back to request origin
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || origin;
  return NextResponse.redirect(`${appUrl}/sign-in?error=Could+not+sign+in+with+Google`);
}
