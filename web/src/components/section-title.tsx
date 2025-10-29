import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

interface SectionTitleProps extends ComponentPropsWithoutRef<'h3'> {}

export function SectionTitle({ className, ...props }: SectionTitleProps) {
  return (
	<h3 className={twMerge("text-base font-semibold text-zinc-100", className)} {...props}>
    {props.children}
    
	</h3>
  );
}