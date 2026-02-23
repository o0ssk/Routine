"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

// --- Button ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "glow" | "soft";
    size?: "default" | "sm" | "lg" | "icon" | "xl";
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
        const variants = {
            default: "bg-primary text-primary-foreground shadow-md hover:bg-primary-dark hover:shadow-lg",
            destructive: "bg-error text-white shadow-md hover:bg-red-600 hover:shadow-lg",
            outline: "border-2 border-border bg-transparent hover:bg-surface-1 text-text-primary",
            secondary: "bg-surface-2 text-text-primary hover:bg-surface-3",
            ghost: "hover:bg-surface-1 text-text-secondary hover:text-primary",
            link: "text-primary underline-offset-4 hover:underline px-0",
            glow: "bg-primary text-white shadow-glow hover:shadow-lg hover:shadow-primary/50 border border-primary-light/20",
            soft: "bg-primary/10 text-primary hover:bg-primary/20",
        };

        const sizes = {
            default: "h-10 px-5 py-2",
            sm: "h-8 rounded-md px-3 text-xs",
            lg: "h-12 rounded-lg px-8 text-base",
            xl: "h-14 rounded-xl px-10 text-lg",
            icon: "h-10 w-10",
        };

        return (
            <motion.button
                ref={ref as any}
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                disabled={isLoading || props.disabled}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...(props as any)}
            >
                {isLoading && (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                {children}
            </motion.button>
        );
    }
);
Button.displayName = "Button";

// --- Checkbox ---
export const Checkbox = React.forwardRef<HTMLButtonElement, any>(
    ({ className, checked, onCheckedChange, ...props }, ref) => {
        return (
            <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => onCheckedChange?.(!checked)}
                ref={ref}
                className={cn(
                    "peer h-5 w-5 shrink-0 rounded-md border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                    checked ? "bg-primary text-primary-foreground" : "bg-transparent",
                    className
                )}
                {...props}
            >
                {checked && (
                    <div className="flex items-center justify-center text-white">
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10 3L4.5 8.5L2 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                )}
            </button>
        );
    }
);
Checkbox.displayName = "Checkbox";

// --- Input ---
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, icon, ...props }, ref) => {
        return (
            <div className="relative w-full">
                {icon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-11 w-full rounded-xl border border-border bg-surface-0 px-4 py-2 text-sm text-text-primary ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm",
                        icon ? "pr-10" : "", // Add padding if icon exists
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);
Input.displayName = "Input";

// --- Card ---
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass" | "outline" | "elevated";
    noPadding?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", noPadding = false, ...props }, ref) => {
        const variants = {
            default: "bg-surface-0 border border-border shadow-sm",
            glass: "glass shadow-md",
            outline: "bg-transparent border border-border",
            elevated: "bg-surface-0 border-none shadow-premium",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-2xl text-card-foreground transition-all duration-300",
                    variants[variant],
                    className
                )}
                {...props}
            />
        );
    }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
    )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3 ref={ref} className={cn("text-xl font-bold leading-none tracking-tight text-gradient", className)} {...props} />
    )
);
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
    )
);
CardContent.displayName = "CardContent";

// --- Label ---
export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className, ...props }, ref) => (
        <label
            ref={ref}
            className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-text-secondary select-none",
                className
            )}
            {...props}
        />
    )
);
Label.displayName = "Label";

// --- Badge ---
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
    const variants = {
        default: "border-transparent bg-primary/10 text-primary hover:bg-primary/20",
        secondary: "border-transparent bg-secondary/10 text-secondary hover:bg-secondary/20",
        destructive: "border-transparent bg-error/10 text-error hover:bg-error/20",
        outline: "text-text-primary border-border",
        success: "border-transparent bg-success/15 text-success",
        warning: "border-transparent bg-warning/15 text-warning",
    };

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}

// --- Switch ---
interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
        return (
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onCheckedChange?.(!checked)}
                className={cn(
                    "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
                    checked ? "bg-primary" : "bg-surface-2",
                    className
                )}
                ref={ref}
                {...props}
            >
                <span
                    className={cn(
                        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
                        checked ? "translate-x-0" : "-translate-x-5"
                    )}
                    style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
                />
            </button>
        );
    }
);
Switch.displayName = "Switch";

// --- Separator ---
export const Separator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("shrink-0 bg-border h-[1px] w-full", className)}
            {...props}
        />
    )
);
Separator.displayName = "Separator";

// --- Textarea ---
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[80px] w-full rounded-xl border border-border bg-surface-0 px-4 py-3 text-sm ring-offset-background placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-all duration-200 shadow-sm",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Textarea.displayName = "Textarea";

// --- Select (Native wrapper for simplicity but premium style) ---
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    icon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, icon, ...props }, ref) => {
        return (
            <div className="relative w-full">
                <select
                    className={cn(
                        "flex h-11 w-full appearance-none rounded-xl border border-border bg-surface-0 px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm text-text-primary",
                        icon ? "pl-10" : "", // Icon adjustment
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </select>
                {/* Custom Arrow */}
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                {icon && (
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                        {icon}
                    </div>
                )}
            </div>
        );
    }
);
Select.displayName = "Select";
