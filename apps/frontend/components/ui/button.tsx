import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'default';
  variant?: 'secondary' | 'primary';
  asChild?: boolean;
  children?: React.ReactNode;
}

const buttonVariants = cva(
  'capitalize cursor-pointer relative inline-flex items-center justify-center rounded-lg',
  {
    variants: {
      size: {
        default: 'px-3 py-2',
      },
      variant: {
        primary:
          'button-primary-gradient button-primary-shadow text-white text-opacity-95 font-medium leading-[1.5] text-sm font-display hover:opacity-90 transition-opacity duration-200',
        secondary:
          'button-secondary-gradient border border-border-secondary text-text-primary font-medium text-sm font-display hover:opacity-90 transition-opacity duration-200',
      },
    },
  }
);

export function Button({
  className,
  children,
  size = 'default',
  variant = 'primary',
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp type="button" className={cn(buttonVariants({ size, variant }), className)} {...props}>
      {children}
    </Comp>
  );
}
