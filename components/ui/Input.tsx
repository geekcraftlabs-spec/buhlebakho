import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sand placeholder:text-sand/30",
      "focus:outline-none focus:border-terracotta transition-colors",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sand placeholder:text-sand/30",
      "focus:outline-none focus:border-terracotta transition-colors resize-none",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
