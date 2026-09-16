import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils.js";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold select-none",
  {
    variants: {
      variant: {
        default: "border-slate-700 bg-slate-800 text-slate-300",
        primary: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
        gold: "border-amber-500/40 bg-amber-500/10 text-amber-300",
        silver: "border-slate-500/40 bg-slate-500/10 text-slate-300",
        bronze: "border-amber-700/40 bg-amber-700/10 text-amber-500",
        destructive: "border-rose-500/40 bg-rose-500/10 text-rose-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
