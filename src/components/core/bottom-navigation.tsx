import { motion } from 'motion/react';
import { Home, MapPin, Clock, Users, Shield, Leaf } from 'lucide-react';

interface BottomNavigationProps {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
}

export function BottomNavigation({ activeScreen, onScreenChange }: BottomNavigationProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'smart-map', icon: MapPin, label: 'Map' },
    { id: 'eta', icon: Clock, label: 'ETA' },
    { id: 'crowd', icon: Users, label: 'Crowd' },
    { id: 'sos', icon: Shield, label: 'SOS' },
    { id: 'eco', icon: Leaf, label: 'Eco' },
  ];

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 px-2 py-3 safe-area-pb"
      style={{ zIndex: 50 }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onScreenChange(item.id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                isActive ? 'text-neon-cyan' : 'text-muted-foreground hover:text-foreground'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className={`p-1.5 rounded-lg ${
                  isActive 
                    ? 'bg-neon-cyan/20 text-neon-cyan' 
                    : 'bg-transparent'
                }`}
                animate={isActive ? { 
                  boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
                  scale: [1, 1.1, 1]
                } : {}}
                transition={{ 
                  boxShadow: { duration: 0.3 },
                  scale: { duration: 2, repeat: Infinity }
                }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <span className="text-xs font-medium">{item.label}</span>
              
              {isActive && (
                <motion.div
                  className="w-4 h-0.5 bg-neon-cyan rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: 16 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}