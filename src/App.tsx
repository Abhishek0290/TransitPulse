import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SplashScreen } from './components/core/splash-screen';
import { HomeDashboard } from './components/core/home-dashboard';
import { SmartLiveMap } from './components/features/smart-live-map';
import { ETADashboard } from './components/features/eta-dashboard';
import { CrowdPrediction } from './components/features/crowd-prediction';
import { SOSEmergency } from './components/features/sos-emergency';
import { EcoImpactDashboard } from './components/features/eco-impact-dashboard';
import { BottomNavigation } from './components/core/bottom-navigation';
import { ToastProvider } from './components/shared/toast-provider';
import { navigationService, type AppScreen, type NavigationState } from './services/navigation-service';

export default function App() {
  const [navigationState, setNavigationState] = useState<NavigationState>(navigationService.getState());

  useEffect(() => {
    const unsubscribe = navigationService.subscribe(setNavigationState);
    return unsubscribe;
  }, []);

  const handleSplashContinue = () => {
    navigationService.navigateTo('home');
  };

  const handleScreenChange = (screen: string) => {
    navigationService.navigateTo(screen as AppScreen);
  };

  const renderScreen = () => {
    switch (navigationState.currentScreen) {
      case 'splash':
        return <SplashScreen onContinue={handleSplashContinue} />;
      case 'home':
        return <HomeDashboard />;
      case 'smart-map':
        return <SmartLiveMap />;
      case 'eta':
        return <ETADashboard />;
      case 'crowd':
        return <CrowdPrediction />;
      case 'sos':
        return <SOSEmergency />;
      case 'eco':
        return <EcoImpactDashboard />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <ToastProvider>
      <div className="w-full min-h-screen bg-background text-foreground dark">
        <AnimatePresence mode="wait">
          <motion.div
            key={navigationState.currentScreen}
            initial={{ opacity: 0, x: navigationState.currentScreen === 'splash' ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: navigationState.currentScreen === 'splash' ? 0 : -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full min-h-screen"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Navigation - Hidden on splash screen */}
        <AnimatePresence>
          {navigationState.currentScreen !== 'splash' && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <BottomNavigation 
                activeScreen={navigationState.currentScreen} 
                onScreenChange={handleScreenChange} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastProvider>
  );
}