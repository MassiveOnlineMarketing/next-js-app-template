import { cn } from "@/presentation/components/utils";
import { cva, VariantProps } from "class-variance-authority";


const pillVariants = cva("rounded-full text-xs leading-4 font-medium border", {
  variants: {
    color: {
      primary:
        "border-primary-100 text-primary-500 bg-gradient-to-b from-white to-[#f8f8ff]",
      green:
        "border-green-100 text-green-500 bg-gradient-to-b from-white to-[#ecfdf5]",
      red: "border-red-100 text-red-500 bg-gradient-to-b from-white to-[#fef2f2]",
      yellow:
        "border-yellow-100 text-yellow-500 bg-gradient-to-b from-white to-[#fffbeb]",
    },
    variant: {
      text: "px-3 py-[6px]",
      icon: "pl-3 pr-4 py-[6px]",
    },
  },
});

interface PillProps extends VariantProps<typeof pillVariants> {
  children: React.ReactNode;
  className?: string;

  onClick?: () => void; 
}

const Pill = ({ children, className, variant, color, onClick, ...rest }: PillProps) => {
  return (
    <span className={cn(pillVariants({ variant, color }), className)} onClick={onClick} {...rest}>
      {children}
    </span>
  );
};

export { Pill };
