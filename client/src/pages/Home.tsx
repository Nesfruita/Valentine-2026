import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Calendar, Clock, MapPin, Sparkles, Check } from "lucide-react";
import { useCreateResponse } from "@/hooks/use-responses";
import { FloatingHearts } from "@/components/FloatingHearts";
import catGif from "@assets/giphy_1770477628528.gif";
import valentineCat from "@assets/Untitled_design_(6)_1770534483949.png";

export default function Home() {
  const [stage, setStage] = useState<"ask" | "celebrate" | "invite">("ask");
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const [hoverCount, setHoverCount] = useState(0);
  
  const createResponse = useCreateResponse();
  const noBtnRef = useRef<HTMLButtonElement>(null);

  // Run away logic for "No" button
  const handleNoHover = () => {
    const x = Math.random() * 300 - 150; // -150 to 150
    const y = Math.random() * 300 - 150; // -150 to 150
    setNoBtnPos({ x, y });
    setHoverCount((prev) => prev + 1);
  };

  const handleYesClick = () => {
    // Record the "Yes"
    createResponse.mutate("YES");
    
    // Trigger celebration
    setStage("celebrate");
    
    // Confetti explosion
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff69b4', '#ff0000', '#ffb6c1']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff69b4', '#ff0000', '#ffb6c1']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Transition to invite after a delay
    setTimeout(() => {
      setStage("invite");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden font-display">
      <FloatingHearts />
      
      <AnimatePresence mode="wait">
        
        {/* STAGE 1: THE QUESTION */}
        {stage === "ask" && (
          <motion.div
            key="ask"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="z-10 w-full max-w-lg text-center"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 10
              }}
              className="mb-8"
            >
              {/* Cute Cat Image */}
              <div className="relative inline-block">
                <img 
                  src={valentineCat} 
                  alt="Cute Kitten"
                  className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full border-4 border-white shadow-xl mx-auto mb-6"
                />
                <motion.div 
                  className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Heart className="w-8 h-8 text-primary fill-primary" />
                </motion.div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-primary drop-shadow-sm mb-2">
                Will you be my Valentine?
              </h1>
            </motion.div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8 h-32 relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleYesClick}
                className="px-8 py-4 bg-primary text-primary-foreground text-xl font-bold rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all flex items-center gap-2"
              >
                <Heart className="fill-current w-5 h-5" />
                Yes, absolutely!
              </motion.button>

              <motion.button
                ref={noBtnRef}
                onMouseEnter={handleNoHover}
                animate={{ x: noBtnPos.x, y: noBtnPos.y }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="px-8 py-4 bg-white text-muted-foreground border-2 border-muted-foreground/20 text-xl font-bold rounded-full hover:bg-muted/20 transition-colors absolute md:static"
                // Disable clicking by pointer events when it's moving fast, though visual movement helps
                style={{ 
                  position: hoverCount > 0 ? 'absolute' : 'relative',
                  pointerEvents: hoverCount > 10 ? 'none' : 'auto' // Give up after 10 tries
                }}
              >
                {hoverCount > 5 ? "Just say yes!" : "No thanks"}
              </motion.button>
            </div>
            
            {hoverCount > 2 && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="mt-8 text-sm text-muted-foreground italic font-body"
              >
                (You can't escape my love! 😈)
              </motion.p>
            )}
          </motion.div>
        )}

        {/* STAGE 2: CELEBRATION TRANSITION */}
        {stage === "celebrate" && (
          <motion.div
            key="celebrate"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="z-20 text-center flex flex-col items-center gap-6"
          >
            <motion.img 
              src={catGif} 
              alt="Love You Cat" 
              className="w-64 h-64 rounded-2xl shadow-2xl border-4 border-white"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            />
            <div>
              <h1 className="text-6xl md:text-8xl font-bold text-primary font-display mb-4">
                YAYYY!! I LOVE YOU &lt;3
              </h1>
              <p className="text-2xl text-foreground font-body">
                Best. Day. Ever. ❤️
              </p>
            </div>
          </motion.div>
        )}

        {/* STAGE 3: THE INVITATION */}
        {stage === "invite" && (
          <motion.div
            key="invite"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="z-10 w-full max-w-2xl"
          >
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-pink-400 to-primary" />
              
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 text-primary mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-4xl font-bold text-primary mb-2 font-display">It's a Date!</h2>
                <p className="text-muted-foreground font-body">Get ready for an amazing day ✨</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-body">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-pink-50/50 hover:bg-pink-50 transition-colors">
                    <div className="p-3 bg-white rounded-full shadow-sm text-primary">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-1">When</h3>
                      <p className="text-muted-foreground">February 15th, 2026</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-pink-50/50 hover:bg-pink-50 transition-colors">
                    <div className="p-3 bg-white rounded-full shadow-sm text-primary">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-1">Time</h3>
                      <p className="text-muted-foreground">Pick you up at 11:30 AM</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-pink-50/50 hover:bg-pink-50 transition-colors">
                    <div className="p-3 bg-white rounded-full shadow-sm text-primary">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-1">Where</h3>
                      <p className="text-muted-foreground">It's a surprise!</p>
                      <p className="text-sm text-muted-foreground">(But you'll love it)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-pink-50/50 hover:bg-pink-50 transition-colors">
                    <div className="p-3 bg-white rounded-full shadow-sm text-primary">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-1">Dress Code</h3>
                      <p className="text-muted-foreground">Cute & Baddie Vibes</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                 <button 
                  onClick={() => window.print()}
                  className="text-sm text-muted-foreground hover:text-primary underline decoration-dotted underline-offset-4"
                 >
                   Print Invitation 🖨️
                 </button>
              </div>
            </div>
            
            <p className="text-center mt-6 text-primary/60 font-hand text-2xl animate-pulse">
              See you soon! xoxo
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
