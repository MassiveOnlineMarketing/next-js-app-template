"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";


import { cn } from "@/presentation/lib/utils";
import { styles } from "@/presentation/styles/styles";


interface TooltipProviderProps extends TooltipPrimitive.TooltipProviderProps {
  delayDuration?: number;
}

const TooltipProvider = (props: TooltipProviderProps) => (
  <TooltipPrimitive.Provider delayDuration={props.delayDuration} {...props} />
);

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipArrow = TooltipPrimitive.Arrow;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={4}
    className={cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5  text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      styles.glass,
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export {
  Tooltip,
  TooltipTrigger,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
};
