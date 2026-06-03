// Navigation service for managing app routing and screen transitions
// Built for production-ready mobile navigation with proper state management

export type AppScreen = 
  | 'splash' 
  | 'home' 
  | 'smart-map' 
  | 'eta' 
  | 'crowd' 
  | 'sos' 
  | 'eco';

export interface NavigationState {
  currentScreen: AppScreen;
  previousScreen?: AppScreen;
  navigationHistory: AppScreen[];
}

class NavigationService {
  private listeners: ((state: NavigationState) => void)[] = [];
  private state: NavigationState = {
    currentScreen: 'splash',
    navigationHistory: ['splash']
  };

  // Subscribe to navigation changes
  subscribe(listener: (state: NavigationState) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Navigate to a specific screen
  navigateTo(screen: AppScreen) {
    const previousScreen = this.state.currentScreen;
    
    this.state = {
      currentScreen: screen,
      previousScreen,
      navigationHistory: [...this.state.navigationHistory, screen]
    };

    this.notifyListeners();
  }

  // Go back to previous screen
  goBack(): boolean {
    if (this.state.navigationHistory.length <= 1) {
      return false;
    }

    const newHistory = [...this.state.navigationHistory];
    newHistory.pop(); // Remove current screen
    const previousScreen = newHistory[newHistory.length - 1];

    this.state = {
      currentScreen: previousScreen,
      previousScreen: this.state.currentScreen,
      navigationHistory: newHistory
    };

    this.notifyListeners();
    return true;
  }

  // Get current navigation state
  getState(): NavigationState {
    return { ...this.state };
  }

  // Check if we can go back
  canGoBack(): boolean {
    return this.state.navigationHistory.length > 1;
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

// Create singleton instance
export const navigationService = new NavigationService();

// Screen configuration for production setup
export const screenConfig = {
  splash: {
    name: 'Welcome',
    requiresAuth: false,
    showBottomNav: false,
    allowBack: false
  },
  home: {
    name: 'Dashboard',
    requiresAuth: false,
    showBottomNav: true,
    allowBack: false
  },
  'smart-map': {
    name: 'Smart Map',
    requiresAuth: false,
    showBottomNav: true,
    allowBack: true
  },
  eta: {
    name: 'AI ETA',
    requiresAuth: false,
    showBottomNav: true,
    allowBack: true
  },
  crowd: {
    name: 'Crowd Insights',
    requiresAuth: false,
    showBottomNav: true,
    allowBack: true
  },
  sos: {
    name: 'Emergency',
    requiresAuth: false,
    showBottomNav: true,
    allowBack: true
  },
  eco: {
    name: 'Eco Impact',
    requiresAuth: false,
    showBottomNav: true,
    allowBack: true
  }
} as const;