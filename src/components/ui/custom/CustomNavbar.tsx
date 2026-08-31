"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignInButton, SignUpButton, UserButton, useClerk } from "@clerk/nextjs";

export const CustomNavbar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn, isLoaded, user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Testimonials",
      link: "#testimonials",
    },
    {
      name: "Contact",
      link: "#contact",
    }
  ];

  return (
    <div className="sticky top-0 z-50 w-full">
      <Navbar className="sticky top-0 z-50">
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4 relative z-30 pointer-events-auto">
            {!isLoaded ? (
              <div className="w-24 h-10 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
            ) : isSignedIn ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-sm font-bold text-emerald-400 hover:text-emerald-300 tracking-wide px-3.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 transition-all hover:bg-emerald-900/50"
                >
                  Dashboard
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-10 h-10 border-2 border-emerald-500/40 hover:border-emerald-400 transition-colors",
                    },
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-sm font-medium text-neutral-200 hover:text-white transition-colors cursor-pointer font-sans">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 cursor-pointer font-space">
                    Get Started
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4 mt-4">
              {!isLoaded ? (
                <div className="w-full h-10 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
              ) : isSignedIn ? (
                <div className="flex flex-col gap-3 w-full">
                  <NavbarButton
                    onClick={handleSignOut}
                    variant="primary"
                    className="w-full"
                  >
                    Sign Out ({user?.firstName || 'User'})
                  </NavbarButton>
                </div>
              ) : (
                <div className="flex flex-col gap-3 w-full">
                  <SignInButton mode="modal">
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-2.5 px-4 text-center rounded-lg bg-neutral-800 text-white font-medium text-sm"
                    >
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-2.5 px-4 text-center rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-bold text-sm"
                    >
                      Get Started
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
};
