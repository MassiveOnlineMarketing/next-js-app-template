import { cn } from "@/presentation/components/utils";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white dark:bg-dark-bg-light  rounded-lg   gradient-mask card-gradient relative",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";


interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  total: string | number;
}
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, total, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "p-6",
          className,
        )}
        {...props}
      >
        <p className='dark:text-dark-text-light'>{title}</p>
        <p className='text-sm dark:text-dark-text-dark'>description</p>
        <p className='pt-6 text-4xl font-semibold dark:text-dark-text-light'>{title === "CTR" ? `${total}%` : total}</p>
      </div>
    );
  },
);

CardHeader.displayName = "CardHeader";

export { Card, CardHeader };