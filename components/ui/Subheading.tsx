import { cn } from "@/lib/utils";

interface SubheadingProps extends React.HTMLAttributes<HTMLParagraphElement> { }

export function Subheading({ className, children, ...props }: SubheadingProps) {
    return (
        <p
            className={cn(
                "mt-8 text-lg font-medium text-gray-500 dark:text-gray-400 sm:text-xl/8",
                className
            )}
            {...props}
        >
            {children}
        </p>
    );
}
