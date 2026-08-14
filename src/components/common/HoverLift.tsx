import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function HoverLift({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      {...(reduced
        ? {}
        : {
            whileHover: {
              scale: 1.02,
              boxShadow: "0 15px 35px -5px rgba(241,113,65,0.08)",
            },
          })}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
