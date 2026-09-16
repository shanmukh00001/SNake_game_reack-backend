import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils.js";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a] disabled:pointer-events-none disabled:opacity-40 select-none shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-[#10b981] text-[#022c22] font-bold font-mono uppercase tracking-wider hover:bg-[#34d399] active:translate-y-px shadow-md shadow-emerald-950/40 border border-[#059669]",
        destructive:
          "bg-rose-500/15 text-[#f87171] border border-rose-500/40 hover:bg-rose-500/25 active:translate-y-px font-mono uppercase",
        outline:
          "border border-slate-600/80 bg-slate-800 text-slate-100 hover:border-emerald-500/60 hover:bg-slate-700/90 active:translate-y-px shadow-sm",
        secondary:
          "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white hover:border-slate-500 active:translate-y-px shadow-sm",
        ghost:
          "hover:bg-slate-800 hover:text-slate-100 text-slate-300 border border-transparent active:translate-y-px",
        link: "text-[#10b981] underline-offset-4 hover:underline hover:text-[#34d399]",
        dpad: "bg-slate-800/90 border border-slate-700 text-slate-200 hover:border-emerald-500/60 hover:bg-slate-700 active:bg-[#10b981] active:text-[#022c22] active:translate-y-px font-mono text-base shadow-sm",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7.5 rounded px-2.5 text-xs",
        lg: "h-11 rounded px-6 text-sm font-bold",
        icon: "h-8.5 w-8.5 rounded",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
