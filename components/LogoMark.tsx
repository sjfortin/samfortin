import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
}

export function LogoMark({ className }: LogoMarkProps) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center border border-gray-400 bg-white text-black text-sm font-semibold uppercase tracking-wide dark:border-white dark:bg-black dark:text-white hover:opacity-80 cursor-pointer transition-all duration-200 ease-in-out  hover:scale-110",
        className,
      )}
    >
      sf
    </div>
  );
}
