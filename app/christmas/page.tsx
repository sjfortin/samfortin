import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import ChristmasDashboard from "@/components/christmas/ChristmasDashboard";
import { Snowflake } from "lucide-react";

export default function ChristmasPage() {
  return (
    <div className="min-h-screen bg-red-50 dark:bg-slate-950 font-sans">
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center space-y-6">
          <Snowflake className="w-16 h-16 text-red-500 animate-spin" />
          <h1 className="text-4xl font-bold text-red-700 dark:text-red-400 font-serif">
            Christmas List Tracker
          </h1>
          <p className="text-lg text-green-800 dark:text-green-400 max-w-md">
            Keep track of your holiday shopping list, budgets, and gift ideas in one festive place!
          </p>
          <div className="mt-4">
             <SignInButton mode="modal">
                <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold shadow-lg transition-transform hover:scale-105">
                    Start Your List
                </button>
             </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="relative min-h-screen">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-green-500 to-red-500" />
            <ChristmasDashboard />
        </div>
      </SignedIn>
    </div>
  );
}
