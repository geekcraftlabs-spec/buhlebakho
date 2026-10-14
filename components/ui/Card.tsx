import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white/[0.03] border border-white/10 rounded-2xl",
        className
      )}
    >
      {children}
    </div>
  ); 
}
