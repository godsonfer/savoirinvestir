"use client"
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary";
    children: React.ReactNode;
}

export const AnimatedButton = ({ 
    variant = "primary", 
    children, 
    className,
    ...props 
}: AnimatedButtonProps) => {
    return (
        <motion.button
            className={cn(
                "relative px-8 py-4 rounded-lg overflow-hidden group",
                variant === "primary" ? 
                    "bg-[#0097A7] text-white hover:bg-[#00838F]" : 
                    "border-2 border-[#D6620F] text-[#D6620F] hover:bg-[#FFF8F3]",
                className
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            {...props}
        >
            <motion.span
                className={cn(
                    "absolute inset-0",
                    variant === "primary" ? 
                        "bg-gradient-to-r from-[#0097A7] to-[#00838F]" : 
                        "bg-gradient-to-r from-[#FFF8F3] to-[#FFE5D6]"
                )}
                initial={{ x: "100%", opacity: 0 }}
                whileHover={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
}; 
