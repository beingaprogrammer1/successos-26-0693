import * as React from "react";
import { Link } from "wouter";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const brandButton = cva(
  "inline-flex items-center justify-center gap-2 rounded-[10px] border-2 border-ink font-semibold whitespace-nowrap transition-all duration-150 disabled:pointer-events-none disabled:opacity-55 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        navy: "bg-navy text-cream hard-sm hover:bg-navy-deep hover:shadow-[5px_5px_0_0_var(--ink)]",
        ink: "bg-ink text-cream hard-sm hover:shadow-[5px_5px_0_0_var(--navy)]",
        gem: "bg-gem text-ink hard-sm hover:shadow-[5px_5px_0_0_var(--ink)]",
        paper: "bg-paper text-ink hard-sm hover:bg-cream hover:shadow-[5px_5px_0_0_var(--ink)]",
        cream: "bg-cream text-ink shadow-[3px_3px_0_0_var(--cream)] hover:shadow-[5px_5px_0_0_var(--cream)]",
        outlineCream:
          "border-cream bg-transparent text-cream hover:bg-cream hover:text-ink",
        ghost: "border-transparent bg-transparent text-ink hover:border-ink hover:bg-cream",
        danger: "bg-danger text-paper hard-sm hover:shadow-[5px_5px_0_0_var(--ink)]",
      },
      size: {
        sm: "h-9 px-3.5 text-[13px]",
        md: "h-11 px-5 text-[14px]",
        lg: "h-[52px] px-7 text-[15px]",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "navy", size: "md" },
  },
);

type Variants = VariantProps<typeof brandButton>;

export function BrandButton({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & Variants) {
  return <button className={cn(brandButton({ variant, size, className }))} {...props} />;
}

export function BrandLink({
  className,
  variant,
  size,
  to,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Link>, "asChild"> & Variants & { to: string }) {
  return (
    <Link to={to} className={cn(brandButton({ variant, size, className }))} {...props}>
      {children}
    </Link>
  );
}

export function BrandAnchor({
  className,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<"a"> & Variants) {
  return (
    <a className={cn(brandButton({ variant, size, className }))} {...props}>
      {children}
    </a>
  );
}
