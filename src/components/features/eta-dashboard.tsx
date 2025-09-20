import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, MapPin, Navigation, Bell, Brain, Zap, TrendingUp, AlertTriangle, Settings } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { AIETAPredictor } from '../ai/ai-eta-predictor';
import { NavigationHeader } from '../shared/navigation-header';

interface SavedRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  favorite: boolean;
  lastUsed: Date;
  avgETA: number;
}

interface ETAAlert {
  id: string;
  routeId: string;
  type: 'departure' | 'delay' | 'improvement';
  message: string;
  timestamp: Date;
  read: boolean;
}

export function ETADashboard() {
  const [selectedDestination, setSelectedDestination] = useState('City Center');
  const [savedRoutes] = useState<SavedRoute[]>([
    { id: '1', name: 'Home to Work', from: 'Current Location', to: 'Tech Park', favorite: true, lastUsed: new Date(), avgETA: 25 },
    { id: '2', name: 'Work to Mall', from: 'Tech Park', to: 'Phoenix Mall', favorite: true, lastUsed: new Date(Date.now() - 86400000), avgETA: 18 },
    { id: '3', name: 'Home to Airport', from: 'Current Location', to: 'Airport Terminal', favorite: false, lastUsed: new Date(Date.now() - 172800000), avgETA: 45 }
  ]);

  const [alerts, setAlerts] = useState<ETAAlert[]>([
    { id: '1', routeId: 'RT_42A', type: 'improvement', message: 'Route 42A is now 3 minutes faster than usual!', timestamp: new Date(), read: false },
    { id: '2', routeId: 'RT_15B', type: 'delay', message: 'Expect 5-minute delays on Route 15B due to traffic', timestamp: new Date(Date.now() - 300000), read: false },
  ]);

  const [etaHistory, setETAHistory] = useState([
    { time: '09:00', predicted: 7, actual: 6 },
    { time: '09:15', predicted: 8, actual: 9 },
    { time: '09:30', predicted: 6, actual: 6 },
    { time: '09:45', predicted: 9, actual: 8 },
    { time: '10:00', predicted: 7, actual: 7 },
  ]);

  const [quickDestinations] = useState([
    'City Center', 'Railway Station', 'Hospital', 'University', 'Airport', 'Mall'
  ]);

  const handleETAUpdate = (etaData: any) => {
    // Update ETA history for accuracy tracking
    const newEntry = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      predicted: etaData.currentETA,
      actual: etaData.currentETA // Would be actual arrival time in real implementation
    };
    
    setETAHistory(prev => [...prev.slice(-4), newEntry]);
  };

  const markAlertAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'delay': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'improvement': return <TrendingUp className="w-4 h-4 text-green-400" />;
      default: return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'delay': return '#ffa500';
      case 'improvement': return '#00FF99';
      default: return '#00BFFF';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pt-8 pb-24 overflow-y-auto">
      {/* Navigation Header with clickable logo */}
      <NavigationHeader />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2 mt-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Smart ETA Center
          </h1>
          <p className="text-sm text-muted-foreground">AI-powered arrival predictions & insights</p>
        </div>

        {/* Quick Destination Selector */}
        <Card className="p-4 bg-gradient-to-r from-card to-card/80 border-primary/20">
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Select Destination</span>
            </h3>
            
            <Input
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              placeholder="Where are you going?"
              className="bg-input/50 border-primary/30 focus:border-primary/60"
            />
            
            <div className="grid grid-cols-3 gap-2">
              {quickDestinations.map((dest, index) => (
                <motion.button
                  key={dest}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedDestination(dest)}
                  className={`p-2 text-xs rounded-lg border transition-all duration-200 ${
                    selectedDestination === dest 
                      ? 'bg-primary/20 border-primary/40 text-primary' 
                      : 'bg-muted/10 border-muted/30 text-muted-foreground hover:border-primary/30'
                  }`}
                >
                  {dest}
                </motion.button>
              ))}
            </div>
          </div>
        </Card>

        {/* Main ETA Predictor */}
        <AIETAPredictor 
          destination={selectedDestination} 
          onETAUpdate={handleETAUpdate}
        />

        {/* Saved Routes */}
        <Card className="p-4 bg-gradient-to-r from-card to-card/80 border-border/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Saved Routes</h3>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {savedRoutes.map((route, index) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-muted/10 rounded-lg hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => setSelectedDestination(route.to)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Navigation className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{route.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {route.from} → {route.to}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="flex items-center space-x-2">
                      {route.favorite && (
                        <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 text-xs">
                          ⭐
                        </Badge>
                      )}
                      <span className="text-sm font-bold text-primary">
                        ~{route.avgETA} min
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {route.lastUsed.toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        {/* ETA Accuracy Tracking */}
        <Card className="p-4 bg-gradient-to-r from-card to-card/80 border-border/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Prediction Accuracy</h3>
              <Badge className="bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 text-neon-cyan border-neon-cyan/30">
                <Brain className="w-3 h-3 mr-1" />
                AI Learning
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-5 gap-2">
                {etaHistory.map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="text-center space-y-1"
                  >
                    <p className="text-xs text-muted-foreground">{entry.time}</p>
                    <div className="space-y-1">
                      <div className="h-1 bg-neon-cyan/30 rounded">
                        <div 
                          className="h-1 bg-neon-cyan rounded"
                          style={{ width: `${(entry.predicted / 10) * 100}%` }}
                        />
                      </div>
                      <div className="h-1 bg-neon-green/30 rounded">
                        <div 
                          className="h-1 bg-neon-green rounded"
                          style={{ width: `${(entry.actual / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-xs">
                      <span className="text-neon-cyan">{entry.predicted}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-neon-green">{entry.actual}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex items-center justify-center space-x-6 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-neon-cyan rounded"></div>
                  <span className="text-muted-foreground">Predicted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-neon-green rounded"></div>
                  <span className="text-muted-foreground">Actual</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Smart Alerts */}
        {alerts.filter(alert => !alert.read).length > 0 && (
          <Card className="p-4 bg-gradient-to-r from-card to-card/80 border-accent/20">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center space-x-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Bell className="w-4 h-4 text-neon-cyan" />
                </motion.div>
                <span>Smart Alerts</span>
              </h3>
              
              <div className="space-y-3">
                {alerts.filter(alert => !alert.read).map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-3 rounded-lg border cursor-pointer hover:bg-muted/10 transition-colors"
                    style={{ 
                      backgroundColor: `${getAlertColor(alert.type)}10`,
                      borderColor: `${getAlertColor(alert.type)}30`
                    }}
                    onClick={() => markAlertAsRead(alert.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: getAlertColor(alert.type) }}>
                          {alert.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {alert.timestamp.toLocaleTimeString()} • Tap to dismiss
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* ETA Insights */}
        <Card className="p-4 bg-gradient-to-r from-muted/10 to-muted/5 border-muted/30">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-neon-green" />
              <h3 className="font-semibold text-neon-green">Today's ETA Insights</h3>
            </div>
            
            <div className="space-y-2 text-sm">
              <motion.div
                className="flex items-center space-x-3"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                <span className="text-muted-foreground">Your average ETA accuracy improved by 12% this week</span>
              </motion.div>
              
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-neon-cyan rounded-full"></div>
                <span className="text-muted-foreground">Best travel time to City Center: 4:30 PM (3 mins faster)</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
                <span className="text-muted-foreground">Monday mornings have 15% longer ETAs than usual</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}