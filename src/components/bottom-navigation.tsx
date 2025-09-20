import { motion } from 'motion/react';
import { Home, MapPin, Clock, Users, AlertTriangle, BarChart3 } from 'lucide-react';

interface BottomNavigationProps {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
}

export function BottomNavigation({ activeScreen, onScreenChange }: BottomNavigationProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, color: '#00BFFF' },
    { id: 'smart-map', label: 'Live', icon: MapPin, color: '#00FFFF' },
    { id: 'eta', label: 'ETA', icon: Clock, color: '#00BFFF' },
    { id: 'crowd', label: 'Crowd', icon: Users, color: '#ffa500' },
    { id: 'sos', label: 'SOS', icon: AlertTriangle, color: '#ff4444' },
    { id: 'eco', label: 'Eco', icon: BarChart3, color: '#00FF99' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-card via-card/95 to-card/90 border-t border-primary/20 backdrop-blur-xl safe-area-pb z-50">
      <div className="flex items-center justify-around py-1 px-1">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onScreenChange(item.id)}
              className="flex flex-col items-center p-2 min-w-[50px] relative rounded-xl hover:bg-secondary/30 active:bg-secondary/50 transition-colors"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full"
                  style={{ backgroundColor: item.color }}
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  color: isActive ? item.color : '#888888'
                }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Icon className="w-6 h-6" />
                
                {/* Glow effect for active icon */}
                {isActive && (
                  <motion.div
                    animate={{
                      boxShadow: [
                        `0 0 10px ${item.color}40`,
                        `0 0 20px ${item.color}60`,
                        `0 0 10px ${item.color}40`
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full"
                  />
                )}
              </motion.div>
              
              <motion.span
                animate={{
                  color: isActive ? item.color : '#888888',
                  fontWeight: isActive ? 700 : 500
                }}
                transition={{ duration: 0.2 }}
                className="text-[10px] mt-1 font-medium"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {item.label}
              </motion.span>
              
              {/* Special indicator for SOS */}
              {item.id === 'sos' && (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute top-1 right-1 w-2 h-2 bg-[#ff4444] rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}