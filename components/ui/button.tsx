import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles with micro-interactions per UI/UX guidelines
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium ring-offset-background transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98] min-h-8 text-sm",
  {
    variants: {
      variant: {
        default: 
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: 
          "hover:bg-accent hover:text-accent-foreground",
        link: 
          "text-primary underline-offset-4 hover:underline",
        // New success variant for positive actions (deficit achieved, goals met)
        success:
          "bg-deficit text-white shadow-sm hover:bg-deficit/90 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm",
      },
      size: {
        default: "h-8 px-6 py-2",
        sm: "h-6 rounded-sm px-5 text-sm",
        lg: "h-11 rounded-sm px-8",
        // Icon button with proper touch target (44x44px minimum)
        icon: "h-11 w-11 min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const classes = cn(
      buttonVariants({ variant, size, className }),
      loading && "relative text-transparent pointer-events-none"
    )

    // Slot requires exactly one child element — skip the loading overlay for asChild
    if (asChild) {
      return (
        <Comp className={classes} ref={ref} {...props}>
          {children}
        </Comp>
      )
    }

    return (
      <Comp
        className={classes}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {children}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
