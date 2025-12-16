import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { AnimatedLogo } from "../AnimatedLogo";

export default function PlaylistHeader() {
    return (
        <header className="flex justify-between items-center w-full p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
                <Link href="/">
                    <AnimatedLogo className="rounded-full" />
                </Link>
            </div>
            <h1 className="text-xl font-bold">Playlists</h1>
            {/* <input type="text" placeholder="Search" /> */}
            <div className="flex items-center gap-2">
                <ThemeSwitcher />
                <SignedIn>
                    <UserButton />
                </SignedIn>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
            </div>
        </header>
    );
}