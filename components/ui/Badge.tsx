import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function Badge({ className, children, ...props }: BadgeProps) {
  return (
    <span 
      className={cn(
        "relative z-10 inline-flex items-center rounded-xl bg-white border border-gray-300 px-3 py-1 text-xs text-gray-600 dark:bg-black dark:border-gray-500 dark:border dark:text-gray-300 max-w-fit",
        className
      )} 
      {...props}
    >
      {children}
    </span>
  );
}
