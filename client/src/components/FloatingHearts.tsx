import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function FloatingHearts() {
  const [hearts, setHearts] = useState<{ id: number; left: number; delay: number; scale: number }[]>([]);

  useEffect(() => {
    // Generate static hearts on mount to avoid hydration mismatch
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      scale: 0.5 + Math.random() * 0.5,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute bottom-[-50px] text-primary/20"
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: -1200, // Float up past screen height
            opacity: [0, 0.4, 0],
            x: [0, Math.random() * 50 - 25], // Slight drift
          }}
          transition={{
            duration: 8 + Math.random() * 5,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear",
          }}
          style={{
            left: `${heart.left}%`,
            scale: heart.scale,
          }}
        >
          <Heart fill="currentColor" size={48} />
        </motion.div>
      ))}
    </div>
  );
}
