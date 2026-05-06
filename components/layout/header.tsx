/**
 * Header Component
 *
 * Main navigation header with logo, nav links, and auth buttons.
 */

import Link from "next/link";
import { Container } from "./container";
import { Button } from "@/components/ui/button";
import {
  isSupabaseConfigured,
  createServerSupabaseClient,
} from "@/lib/supabase";
import { SignOutButton } from "./sign-out-button";

export async function Header() {
  // Get current user if Supabase is configured
  let userEmail: string | null = null;

  if (isSupabaseConfigured) {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email ?? null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-lg">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
              <span className="text-lg font-bold text-white">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">AppName</span>
          </Link>

          {/* Navigation Links - Add more as needed */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Auth buttons - only show when Supabase is configured */}
          {isSupabaseConfigured && (
            <div className="flex items-center gap-3">
              {userEmail ? (
                <>
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    {userEmail}
                  </span>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <SignOutButton />
                </>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button variant="primary" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
