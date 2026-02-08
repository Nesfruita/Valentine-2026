## Packages
framer-motion | Essential for the "running away" button and page transitions
canvas-confetti | For the celebration confetti effect
@types/canvas-confetti | Types for confetti
clsx | Utility for conditional classes (standard in shadcn/ui but good to ensure)
tailwind-merge | Utility for merging tailwind classes (standard in shadcn/ui)

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
  hand: ["var(--font-hand)"],
}
