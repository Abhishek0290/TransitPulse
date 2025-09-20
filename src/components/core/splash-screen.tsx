import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Brain, Zap, Navigation, Users, Leaf, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { TransitPulseLogo } from '../shared/transit-pulse-logo';

interface SplashScreenProps {
  onContinue: () => void;
}

export function SplashScreen({ onContinue }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setShowFeatures(true), 500);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered ETAs",
      description: "Smart predictions with 95% accuracy"
    },
    {
      icon: <Navigation className="w-6 h-6" />,
      title: "Smart Live Map",
      description: "Real-time bus tracking & routes"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Crowd Prediction",
      description: "IoT-based occupancy insights"
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Eco Impact",
      description: "Track your environmental savings"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="space-y-8 w-full max-w-sm"
      >
        {/* Logo & Brand */}
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <TransitPulseLogo size="lg" variant="vertical" />
          </motion.div>
          
          <motion.p
            className="text-neon-cyan font-medium text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            AI Mobility for Bharat
          </motion.p>
        </div>

        {/* Loading Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="space-y-3"
        >
          <div className="w-full bg-muted/20 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-2 bg-gradient-to-r from-neon-blue via-[#00FFFF] to-neon-green rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>
          <motion.p
            className="text-sm text-muted-foreground"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Initializing AI Engine...
          </motion.p>
        </motion.div>

        {/* Features Preview */}
        {showFeatures && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-3 bg-gradient-to-br from-card/50 to-muted/20 rounded-xl border border-border/30"
                >
                  <div className="text-neon-cyan mb-2 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xs font-semibold mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Continue Button */}
        {progress === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Button
              onClick={onContinue}
              className="w-full h-12 bg-gradient-to-r from-primary via-[#00FFFF] to-accent hover:from-primary/90 hover:via-[#00FFFF]/90 hover:to-accent/90 border-0 text-black font-bold"
              style={{
                boxShadow: '0 0 20px rgba(0, 191, 255, 0.3)',
                fontFamily: 'Montserrat, sans-serif'
              }}
            >
              <motion.span
                className="flex items-center space-x-2"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Button>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <Zap className="w-3 h-3 text-neon-green" />
            <span>Next-Gen Public Transport</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Powered by AI • Built for Tier-2/3 Cities
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}