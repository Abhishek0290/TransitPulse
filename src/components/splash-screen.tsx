import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bus, Brain, Wifi, Shield, Zap } from 'lucide-react';
import { Button } from './ui/button';

interface SplashScreenProps {
  onContinue: () => void;
}

export function SplashScreen({ onContinue }: SplashScreenProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-primary/10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity }
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-neon-blue/10 to-transparent rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity }
          }}
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-neon-green/10 to-transparent rounded-full blur-xl"
        />
      </div>

      <div className="text-center space-y-8 max-w-sm z-10 px-6">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0, rotateY: -180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ 
            duration: 1.5, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100 
          }}
          className="relative flex items-center justify-center"
        >
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 30px rgba(0, 191, 255, 0.4), 0 0 60px rgba(0, 255, 153, 0.2)",
                "0 0 50px rgba(0, 255, 153, 0.6), 0 0 80px rgba(0, 191, 255, 0.3)",
                "0 0 30px rgba(0, 191, 255, 0.4), 0 0 60px rgba(0, 255, 153, 0.2)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative p-8 bg-gradient-to-br from-primary/20 via-[#00FFFF]/10 to-accent/20 rounded-2xl border border-primary/40 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Bus className="w-20 h-20 text-transparent bg-gradient-to-br from-neon-blue to-neon-green bg-clip-text" style={{
                filter: 'drop-shadow(0 0 10px rgba(0, 191, 255, 0.5))'
              }} />
            </motion.div>
            
            {/* Floating AI indicators */}
            <motion.div
              animate={{ 
                rotate: 360,
                y: [-5, 5, -5]
              }}
              transition={{ 
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                y: { duration: 2, repeat: Infinity }
              }}
              className="absolute -top-3 -right-3"
            >
              <div className="p-2 bg-gradient-to-r from-[#00FFFF]/30 to-neon-blue/30 rounded-full border border-[#00FFFF]/50 backdrop-blur-sm">
                <Brain className="w-5 h-5 text-[#00FFFF]" />
              </div>
            </motion.div>
            
            <motion.div
              animate={{ 
                rotate: -360,
                x: [-3, 3, -3]
              }}
              transition={{ 
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                x: { duration: 1.5, repeat: Infinity }
              }}
              className="absolute -bottom-3 -left-3"
            >
              <div className="p-2 bg-gradient-to-r from-neon-green/30 to-accent/30 rounded-full border border-neon-green/50 backdrop-blur-sm">
                <Wifi className="w-5 h-5 text-neon-green" />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* App Title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="space-y-3"
        >
          <motion.h1 
            className="text-5xl font-black bg-gradient-to-r from-neon-blue via-[#00FFFF] to-neon-green bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ 
              backgroundSize: "200% 100%",
              fontFamily: 'Montserrat, sans-serif',
              textShadow: '0 0 20px rgba(0, 191, 255, 0.3)'
            }}
          >
            TransitPulse+
          </motion.h1>
          <motion.p 
            className="text-lg text-muted-foreground font-medium"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            AI Mobility for Bharat
          </motion.p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="space-y-6"
        >
          {isLoading ? (
            <div className="space-y-4">
              <div className="relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                  className="h-2 bg-gradient-to-r from-neon-blue via-[#00FFFF] to-neon-green rounded-full"
                  style={{
                    boxShadow: '0 0 10px rgba(0, 191, 255, 0.5), 0 0 20px rgba(0, 255, 153, 0.3)'
                  }}
                />
                <motion.div
                  animate={{ x: [-20, 300] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 w-6 h-2 bg-white rounded-full blur-sm opacity-60"
                />
              </div>
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-sm text-[#00FFFF] font-medium"
              >
                Initializing AI-powered features...
              </motion.p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Button 
                onClick={onContinue}
                className="w-full h-14 bg-gradient-to-r from-neon-blue via-[#00FFFF] to-neon-green hover:from-neon-blue/90 hover:via-[#00FFFF]/90 hover:to-neon-green/90 text-black font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg border-0"
                style={{
                  boxShadow: '0 0 30px rgba(0, 191, 255, 0.4), 0 0 60px rgba(0, 255, 153, 0.2)',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              >
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Experience the Future
                </motion.span>
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* AI Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="grid grid-cols-3 gap-6 text-xs text-center"
        >
          <motion.div 
            className="space-y-2"
            whileHover={{ scale: 1.1 }}
          >
            <motion.div 
              className="w-3 h-3 bg-gradient-to-r from-neon-blue to-[#00FFFF] rounded-full mx-auto"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              style={{ boxShadow: '0 0 10px rgba(0, 191, 255, 0.6)' }}
            />
            <span className="text-neon-blue font-semibold">AI Prediction</span>
          </motion.div>
          <motion.div 
            className="space-y-2"
            whileHover={{ scale: 1.1 }}
          >
            <motion.div 
              className="w-3 h-3 bg-gradient-to-r from-[#00FFFF] to-neon-green rounded-full mx-auto"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
              style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.6)' }}
            />
            <span className="text-[#00FFFF] font-semibold">Live IoT</span>
          </motion.div>
          <motion.div 
            className="space-y-2"
            whileHover={{ scale: 1.1 }}
          >
            <motion.div 
              className="w-3 h-3 bg-gradient-to-r from-neon-green to-accent rounded-full mx-auto"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
              style={{ boxShadow: '0 0 10px rgba(0, 255, 153, 0.6)' }}
            />
            <span className="text-neon-green font-semibold">Smart Safety</span>
          </motion.div>
        </motion.div>

        {/* Version info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="text-xs text-muted-foreground font-medium"
        >
          Next-Gen Transit • v2.0 AI Beta
        </motion.div>
      </div>
    </div>
  );
}