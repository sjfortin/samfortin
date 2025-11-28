import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const ctaVariants = cva(
    "group relative flex items-center gap-3 px-6 py-4 transition-all w-full justify-between",
    {
        variants: {
            variant: {
                primary: "bg-black dark:bg-white",
                secondary: "border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 bg-white/20 dark:bg-white/5",
            },
        },
        defaultVariants: {
            variant: "primary",
        },
    }
);

interface HomeCTAProps extends VariantProps<typeof ctaVariants> {
    href: string;
    title: string;
    description: string;
    eyebrow?: string;
    className?: string;
}

export function HomeCTA({
    href,
    title,
    description,
    eyebrow,
    variant,
    className,
}: HomeCTAProps) {
    return (
        <Link href={href} className={cn(ctaVariants({ variant }), className)}>
            <div className="flex flex-col">
                {eyebrow && (
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                        {eyebrow}
                    </span>
                )}
                <span
                    className={cn(
                        "text-sm font-semibold",
                        variant === "primary"
                            ? "text-white dark:text-black"
                            : "text-black dark:text-white"
                    )}
                >
                    {title}
                </span>
                <span
                    className={cn(
                        "text-xs mt-0.5",
                        variant === "primary"
                            ? "text-gray-400 dark:text-gray-500"
                            : "text-gray-500 dark:text-gray-400"
                    )}
                >
                    {description}
                </span>
            </div>
            <ArrowRightIcon
                className={cn(
                    "ml-2 h-5 w-5 transition-colors group-hover:scale-125 transition-transform duration-200 ease-in-out",
                    variant === "primary"
                        ? "text-gray-400 dark:text-gray-500"
                        : "text-gray-400 group-hover:text-black dark:group-hover:text-white"
                )}
            />
        </Link>
    );
}
