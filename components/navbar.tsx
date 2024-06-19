"use client";
import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
  ProfileItem,
} from "@/components/ui/navbar-menu";
import { cn } from "@/utils/cn";
import { IconMoon, IconSun, IconUser } from "@tabler/icons-react";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function NavbarDemo() {
  return (
    <SessionProvider>
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-6" />
    </div>
    </SessionProvider> 
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean | undefined>(undefined);  // Initially undefined
  const router = useRouter()
  useEffect(() => {
    // Set the initial theme based on localStorage only once when the component mounts
    const storedTheme = localStorage.getItem("theme") === "dark";
    setIsDarkMode(storedTheme);

    const body = document.body;
    // Toggle class on body based on the theme
    body.classList.toggle("dark", storedTheme);
  }, []);

  useEffect(() => {
    if (isDarkMode !== undefined) {
      // Update localStorage and class on body when isDarkMode changes, avoiding this on initial render
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
      document.body.classList.toggle("dark", isDarkMode);
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const { data: session, status } = useSession();
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <button
          className="rounded-full w-fit dark:text-white text-black flex items-center justify-center"
          onClick={toggleTheme}
        >
          {isDarkMode ? <IconMoon size={25} /> : <IconSun size={25} />}
        </button>
        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/web-dev">Web Development</HoveredLink>
            <HoveredLink href="/interface-design">Interface Design</HoveredLink>
            <HoveredLink href="/seo">Search Engine Optimization</HoveredLink>
            <HoveredLink href="/branding">Branding</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Products">
          <div className="text-sm grid gap-10 p-4 md:grid-cols-2 sm:grid-cols-1">
            <ProductItem
              title="Algochurn"
              href="https://algochurn.com"
              src="https://assets.aceternity.com/demos/algochurn.webp"
              description="Prepare for tech interviews like never before."
            />
            <ProductItem
              title="Tailwind Master Kit"
              href="https://tailwindmasterkit.com"
              src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
              description="Production ready Tailwind css components for your next project"
            />
            <ProductItem
              title="Moonbeam"
              href="https://gomoonbeam.com"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
              description="Never write from scratch again. Go from idea to blog in minutes."
            />
            <ProductItem
              title="Rogue"
              href="https://userogue.com"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
              description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
            />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Pricing">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/hobby">Hobby</HoveredLink>
            <HoveredLink href="/individual">Individual</HoveredLink>
            <HoveredLink href="/team">Team</HoveredLink>
            <HoveredLink href="/enterprise">Enterprise</HoveredLink>
          </div>
        </MenuItem>
        {session && session.user &&
          <MenuItem setActive={setActive} active={active} item="" icon={<IconUser />} >
            <ProfileItem title={session.user.name ?? 'No Name'} description={session.user.email ?? 'No Email'} />
            <button
            className="bg-gradient-to-br relative group/btn mt-2 from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            onClick={()=>{
              signOut({redirect:false})
              router.push("/auth/login")
            }}
            >
            Sign out
          </button>
          </MenuItem>
        }
        
          
      </Menu>
    </div>
  );
}
