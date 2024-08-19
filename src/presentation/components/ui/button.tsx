import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

// import "@/styles/globals.css";
import { cn } from "@/presentation/components/utils";
import { styles } from "@/presentation/styles/styles";

// Button variant options
export interface ButtonVariantsProps {
  variant:
    | "primary"
    | "secondary"
    | "light"
    | "dark"
    | "flat"
    | "text"
    | "disabled"
    | "glass"
    | "link"
    | "nav"
    | "outline"
    | "icon";
  size: "xs" | "sm" | "md" | "lg";
  option: "icon" | "rounded";
}

const buttonVariants = cva(
  "rounded-lg  inline-flex items-center justify-center whitespace-nowrap w-fit h-fit",
  // text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300
  {
    variants: {
      variant: {
        primary:
          "text-violet-50 relative gradient-mask primary-button hover:text-white",
        //bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
        secondary:
          "bg-gray-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-white",

        light:
          "border border-gray-200 text-gray-600 hover:shadow-base hover:border-none hover:-translate-y-[1px] hover:mb-[1px] transition-transform duration-100",
        dark: `text-gray-300 ${styles.darkGlass} hover:text-white hover:bg-gray-800`,
        flat: "text-gray-50 bg-gray-800 hover:bg-gray-700",
        text: "text-gray-800 hover:text-primary-500",
        disabled: "text-gray-400 bg-gray-200 cursor-not-allowed",
        glass: `text-gray-800 ${styles.glass} hover:bg-gray-50 hover:text-primary-500 fill-primary-500`,

        link: "text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50",
        nav: "py-[6px] px-4 rounded-full border border-[#000]/10  shadow-md bg-[#fff]/50 transition-all duration-500 hover:shadow-none hover:border-transparent hover:bg-[#fff]/0",
        outline:
          "border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
        icon: "p-4",
        // bg-gradient-to-b from-[#fff]/60 to-[#fff]/50

        dashboard: "p-2 bg-white shadow-base rounded-lg",
        appWhite: "bg-white text-gray-800 shadow-base rounded-lg",






        new: "border border-p-100 dark:border-dark-stroke bg-white/50 dark:bg-dark-bg-light text-p-800 dark:text-dark-text-light rounded-[6px] font-medium",

        "ts-prop": " ",
      },
      size: {
        newXs: "px-[14px] py-[6px] gap-[4px] text-sm",
        xs: "px-[12px] py-[6px] text-xs font-medium leading-4 gap-[4px]",
        sm: "px-[16px] py-[8px] text-sm font-medium leading-5 gap-[6px]",
        md: "px-[24px] py-[12px] text-base font-semibold leading-6 gap-[8px]",
        lg: "px-[32px] py-[14px] text-base font-semibold leading-6 gap-[12px]",

        smD: "px-[16px] h-[36px] text-sm font-medium leading-5 gap-[6px]",
      },
      option: {
        icon: "items-center p-4",
        rounded: "rounded-full",
      },
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  mbFull?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, option, asChild = false, mbFull, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, option, className }),
          mbFull ? "w-full md:w-fit" : "",
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, OutlinedButton, buttonVariants };

interface OutlinedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  className?: string;
  buttonClassName?: string;
}

// In your Button component file
const OutlinedButton = React.forwardRef<HTMLButtonElement, OutlinedButtonProps>(
  (
    { children, className, buttonClassName, variant, size, option, ...props },
    ref,
  ) => {
    return (
      <div className={cn("relative w-fit h-fit m-1", className)}>
        <Button
          ref={ref}
          className={cn(
            "shadow-base bg-white z-40 rounded-lg relative cursor-pointer",
            buttonVariants({ variant, size, option }),
            buttonClassName,
          )}
          {...props}
        >
          {children}
        </Button>
        <div className="absolute top-0 left-0 w-full h-full rounded-[8px] outline outline-4 outline-primary-50 bg-primary-50 z-30"></div>
      </div>
    );
  },
);

OutlinedButton.displayName = "OutlinedButton";
