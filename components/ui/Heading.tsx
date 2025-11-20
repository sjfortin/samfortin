import { cn } from "@/lib/utils";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function Heading({ 
  className, 
  as: Component = "h1", 
  children, 
  ...props 
}: HeadingProps) {
  return (
    <Component 
      className={cn(
        "text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-7xl",
        className
      )} 
      {...props}
    >
      {children}
    </Component>
  );
}
