import Image from "next/image";

interface LogoMarkProps {
  className?: string;
  height?: number;
  width?: number;
}

export function LogoMark({ className, height = 40, width = 40 }: LogoMarkProps) {
  return (
    <Image src="/images/sam-in-a-box-logo.png" alt="Logo" width={width} height={height} className={className} />
  );
}
