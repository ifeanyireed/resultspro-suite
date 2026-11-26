import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-[#146ef5] text-white shadow hover:bg-[#105bd1]",
  destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
  outline: "border border-gray-200 bg-white text-gray-900 shadow-sm hover:bg-gray-50 hover:text-gray-900",
  secondary: "bg-[#0D1060] text-white shadow-sm hover:bg-[#151980]",
  ghost: "hover:bg-gray-100 hover:text-gray-900",
  link: "text-[#146ef5] underline-offset-4 hover:underline",
}

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-9 px-4 py-2",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-8",
  icon: "h-9 w-9",
}

export function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  className?: string
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    variantClasses[variant],
    sizeClasses[size],
    className
  )
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const classes = buttonVariants({ variant, size, className })
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(classes, (children.props as any)?.className),
        ...props,
      })
    }
    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
