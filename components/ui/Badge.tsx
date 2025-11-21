import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  theme?: 'light' | 'dark';
}

export function Badge({ className, children, theme, ...props }: BadgeProps) {
  const adaptiveStyles = "bg-white border-gray-300 text-gray-600 dark:bg-transparent dark:border-gray-500 dark:text-gray-300";
  const lightStyles = "bg-white border-gray-300 text-gray-600 dark:bg-white dark:border-gray-300 dark:text-gray-600";
  const darkStyles = "bg-transparent border-gray-500 text-gray-300 dark:bg-transparent dark:border-gray-500 dark:text-gray-300";

  let themeClasses = adaptiveStyles;
  if (theme === 'light') themeClasses = lightStyles;
  if (theme === 'dark') themeClasses = darkStyles;

  return (
    <span 
      className={cn(
        "relative z-10 inline-flex items-center rounded-xl border px-3 py-1 text-xs max-w-fit",
        themeClasses,
        className
      )} 
      {...props}
    >
      {children}
    </span>
  );
}
