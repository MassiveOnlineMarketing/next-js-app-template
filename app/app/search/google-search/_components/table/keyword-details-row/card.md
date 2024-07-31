import { cn } from "@/lib/utils";
import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "p-[6px] w-full h-full bg-primary-50 rounded-2xl",
          className,
        )}
        {...props}
      >
        <div className="w-full p-6 bg-white rounded-xl shadow-base">
          {children}
        </div>
      </div>
    );
  },
);
Card.displayName = "Card";

export interface CardTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  heading: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>(
  ({ className, children, heading, icon: Icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "pb-[16px] mb-7 border-b border-gray-200 w-full flex items-center",
          className,
        )}
        {...props}
      >
        {Icon && <Icon className="mr-2 w-6 h-6" />}
        <p className="text-xl leading-7 font-semibold text-gray-800">
          {heading}
        </p>
        {children}
      </div>
    );
  },
);

CardTitle.displayName = "CardTitle";

export { Card, CardTitle };
