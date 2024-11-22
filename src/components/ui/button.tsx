import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "whitespace-nowrap rounded-md text-sm font-medium",
    "ring-offset-background",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "transform-gpu will-change-transform",
    "touch-none", // Optimize touch events
    "contain-paint contain-layout", // CSS containment
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "transition-colors duration-150",
          "active:translate-y-px",
        ].join(" "),
        destructive: [
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          "transition-colors duration-150",
          "active:translate-y-px",
        ].join(" "),
        outline: [
          "border border-input bg-background",
          "hover:bg-accent hover:text-accent-foreground",
          "transition-colors duration-150",
          "active:translate-y-px",
        ].join(" "),
        secondary: [
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          "transition-colors duration-150",
          "active:translate-y-px",
        ].join(" "),
        ghost: [
          "hover:bg-accent hover:text-accent-foreground",
          "transition-colors duration-150",
          "active:translate-y-px",
        ].join(" "),
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
}

const Button = React.memo(
  React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
      // Memoize component type
      const Comp = React.useMemo(
        () => asChild ? Slot : "button",
        [asChild]
      )

      // Memoize className
      const buttonClassName = React.useMemo(
        () => cn(buttonVariants({ variant, size, className })),
        [variant, size, className]
      )

      // Use passive event listener for touch events
      React.useEffect(() => {
        const button = ref?.current
        if (!button) return

        const options = { passive: true }
        button.addEventListener('touchstart', () => {}, options)
        button.addEventListener('touchend', () => {}, options)

        return () => {
          button.removeEventListener('touchstart', () => {}, options)
          button.removeEventListener('touchend', () => {}, options)
        }
      }, [ref])

      return (
        <Comp
          className={buttonClassName}
          ref={ref}
          {...props}
        />
      )
    }
  )
)

Button.displayName = "Button"

export { Button, buttonVariants }
