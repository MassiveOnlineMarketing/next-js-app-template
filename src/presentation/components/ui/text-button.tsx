import { VariantProps } from "class-variance-authority";
import React from "react";
import { buttonVariants } from "./button";
import { cn } from "@/presentation/lib/utils";

interface props
  extends React.AnchorHTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  mbFull?: boolean;
  buttonClassName?: string;
  outlineClassName?: string;
}

const TextButton = React.forwardRef<HTMLParagraphElement, props>(
  ({ className, option, size, variant, mbFull, ...props }, ref) => {
    return (
      <p
        ref={ref}
        {...props}
        className={cn(
          buttonVariants({ option, size, variant, className }),
          mbFull ? "w-full md:w-fit" : "",
        )}
      >
        {props.children}
      </p>
    );
  },
);

TextButton.displayName = "TextButton";

/**
 * Renders an outlined text button component.
 *
 * @component
 * @param {string} props.className - The class name for the component.
 * @param {string} props.outlineClassName - The class name for the outline element.
 * @param {string} props.buttonClassName - The class name for the button element.
 * @param {boolean} props.mbFull - Whether the button should take full width on mobile.
 * @returns {React.ReactElement} The rendered outlined text button component.
 */
const OutlinedTextButton = React.forwardRef<HTMLParagraphElement, props>(
  (
    {
      className,
      outlineClassName,
      buttonClassName,
      option,
      size,
      variant,
      mbFull,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("relative w-fit h-fit m-1", className)}>
        <p
          ref={ref}
          {...props}
          className={cn(
            "shadow-base bg-white z-40 rounded-lg relative cursor-pointer",
            buttonVariants({ option, size, variant }),
            mbFull ? "w-full md:w-fit" : "",
            buttonClassName,
          )}
        >
          {props.children}
        </p>
        <div
          className={cn(
            "absolute top-0 left-0 w-full h-full rounded-[8px] outline outline-4 outline-primary-50 bg-primary-50 z-30",
            outlineClassName,
          )}
        ></div>
      </div>
    );
  },
);

OutlinedTextButton.displayName = "OutlinedTextButton";

export { TextButton, OutlinedTextButton };
