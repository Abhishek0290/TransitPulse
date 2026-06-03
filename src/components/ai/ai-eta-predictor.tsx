import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Brain, TrendingUp, TrendingDown, AlertTriangle, Zap, MapPin, Users, Navigation, Bell } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface ETAData {
  routeId: string;
  routeName: string;
  currentETA: number; // in minutes
  confidenceLevel: number; // 0-100
  scenarios: {
    optimistic: number;
    realistic: number;
    pessimistic: number;
  };
  factors: {
    traffic: 'low' | 'medium' | 'high';
    crowd: 'low' | 'medium' | 'high';
    weather: 'clear' | 'rain' | 'heavy_rain';
    roadwork: boolean;
  };
  trend: 'improving' | 'stable' | 'deteriorating';
  lastUpdate: Date;
  accuracy: number; // historical accuracy percentage
  alternatives: {
    routeId: string;
    routeName: string;
    eta: number;
    crowdLevel: 'low' | 'medium' | 'high';
  }[];
}

interface AIETAPredictorProps {
  destination?: string;
  onETAUpdate?: (eta: ETAData) => void;
}

export function AIETAPredictor({ destination = "Your Destination", onETAUpdate }: AIETAPredictorProps) {
  const [etaData, setETAData] = useState<ETAData>({
    routeId: 'RT_42A',
    routeName: 'Route 42A',
    currentETA: 7,
    confidenceLevel: 94,
    scenarios: {
      optimistic: 5,
      realistic: 7,
      pessimistic: 12
    },
    factors: {
      traffic: 'medium',
      crowd: 'low',
      weather: 'clear',
      roadwork: false
    },
    trend: 'stable',
    lastUpdate: new Date(),
    accuracy: 89,
    alternatives: [
      { routeId: 'RT_15B', routeName: 'Route 15B', eta: 11, crowdLevel: 'high' },
      { routeId: 'RT_33C', routeName: 'Route 33C', eta: 9, crowdLevel: 'medium' }
    ]
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Simulate real-time ETA updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);
      
      setTimeout(() => {
        setETAData(prev => {
          const newETA = Math.max(0, prev.currentETA + Math.floor(Math.random() * 3 - 1));
          const newConfidence = Math.max(70, Math.min(99, prev.confidenceLevel + Math.floor(Math.random() * 6 - 3)));
          
          const newData = {
            ...prev,
            currentETA: newETA,
            confidenceLevel: newConfidence,
            scenarios: {
              optimistic: Math.max(0, newETA - 2),
              realistic: newETA,
              pessimistic: newETA + 5
            },
            trend: newETA > prev.currentETA ? 'deteriorating' as const : 
                   newETA < prev.currentETA ? 'improving' as const : 'stable' as const,
            lastUpdate: new Date(),
            factors: {
              ...prev.factors,
              traffic: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'high' : 'medium') as const : prev.factors.traffic,
              crowd: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'high' : 'low') as const : prev.factors.crowd
            }
          };

          // Generate smart notifications
          if (newETA !== prev.currentETA) {
            const change = newETA - prev.currentETA;
            if (change > 2) {
              setNotifications(n => [...n.slice(-2), `⚠️ ETA increased by ${change} minutes due to traffic`]);
            } else if (change < -2) {
              setNotifications(n => [...n.slice(-2), `✅ ETA improved by ${Math.abs(change)} minutes - faster route found!`]);
            }
          }

          onETAUpdate?.(newData);
          return newData;
        });
        setIsUpdating(false);
      }, 1000);
    }, 15000);

    return () => clearInterval(interval);
  }, [onETAUpdate]);

  const getFactorColor = (factor: string, value: string | boolean) => {
    if (typeof value === 'boolean') return value ? '#ff4444' : '#00FF99';
    
    switch (value) {
      case 'low': return '#00FF99';
      case 'medium': return '#ffa500';
      case 'high': return '#ff4444';
      case 'clear': return '#00FF99';
      case 'rain': return '#ffa500';
      case 'heavy_rain': return '#ff4444';
      default: return '#888888';
    }
  };

  const getTrendIcon = () => {
    switch (etaData.trend) {
      case 'improving': return <TrendingDown className="w-4 h-4 text-green-400" />;
      case 'deteriorating': return <TrendingUp className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return '#00FF99';
    if (confidence >= 75) return '#00BFFF';
    if (confidence >= 60) return '#ffa500';
    return '#ff4444';
  };

  return (
    <div className="space-y-4">
      {/* Main ETA Display */}
      <Card className="p-6 bg-gradient-to-br from-primary/20 via-[#00FFFF]/10 to-accent/20 border-primary/40 relative overflow-hidden">
        {/* Background animation */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity }
            }}
            className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-r from-neon-blue/20 to-transparent rounded-full blur-xl"
          />
        </div>

        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: isUpdating ? 360 : 0 }}
                transition={{ duration: 1 }}
                className="p-2 bg-neon-cyan/20 rounded-full"
              >
                <Brain className="w-5 h-5 text-neon-cyan" />
              </motion.div>
              <div>
                <h3 className="font-semibold">AI ETA Predictor</h3>
                <p className="text-sm text-muted-foreground">To {destination}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {getTrendIcon()}
              <Badge 
                className="text-xs"
                style={{ 
                  backgroundColor: `${getConfidenceColor(etaData.confidenceLevel)}20`,
                  color: getConfidenceColor(etaData.confidenceLevel)
                }}
              >
                {etaData.confidenceLevel}% confident
              </Badge>
            </div>
          </div>

          {/* Main ETA */}
          <div className="text-center space-y-2">
            <motion.div
              animate={{ 
                scale: isUpdating ? [1, 1.1, 1] : 1,
                color: isUpdating ? '#00FFFF' : '#00BFFF'
              }}
              transition={{ duration: 0.5 }}
              className="text-6xl font-black"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {etaData.currentETA}<span className="text-2xl ml-1">min</span>
            </motion.div>
            
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-neon-green" />
                <span className="text-neon-green">{etaData.routeName}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3 text-neon-cyan" />
                <span className="text-neon-cyan">{etaData.accuracy}% accurate</span>
              </div>
            </div>
          </div>

          {/* Scenario Range */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Best case</span>
              <span>Worst case</span>
            </div>
            <div className="relative">
              <div className="h-2 bg-muted/20 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-2 bg-gradient-to-r from-neon-green via-neon-cyan to-orange-400 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: `${((etaData.scenarios.realistic - etaData.scenarios.optimistic) / 
                            (etaData.scenarios.pessimistic - etaData.scenarios.optimistic)) * 100}%`
                  }}
                  transition={{ duration: 1 }}
                />
              </div>
              <motion.div
                className="absolute top-0 w-1 h-2 bg-white rounded-full shadow-lg"
                animate={{
                  left: `${((etaData.currentETA - etaData.scenarios.optimistic) / 
                          (etaData.scenarios.pessimistic - etaData.scenarios.optimistic)) * 100}%`
                }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neon-green font-medium">{etaData.scenarios.optimistic}m</span>
              <span className="text-orange-400 font-medium">{etaData.scenarios.pessimistic}m</span>
            </div>
          </div>

          {/* Toggle Details */}
          <Button
            variant="ghost"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-neon-cyan hover:bg-neon-cyan/10"
          >
            {showDetails ? 'Hide Details' : 'Show AI Insights'}
          </Button>
        </div>
      </Card>

      {/* Detailed Analysis */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Influencing Factors */}
            <Card className="p-4 bg-gradient-to-r from-card to-card/80 border-border/50">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">AI Analysis Factors</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Traffic Density</span>
                      <Badge 
                        style={{ 
                          backgroundColor: `${getFactorColor('traffic', etaData.factors.traffic)}20`,
                          color: getFactorColor('traffic', etaData.factors.traffic)
                        }}
                        className="text-xs"
                      >
                        {etaData.factors.traffic.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Crowd Level</span>
                      <Badge 
                        style={{ 
                          backgroundColor: `${getFactorColor('crowd', etaData.factors.crowd)}20`,
                          color: getFactorColor('crowd', etaData.factors.crowd)
                        }}
                        className="text-xs"
                      >
                        {etaData.factors.crowd.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Weather</span>
                      <Badge 
                        style={{ 
                          backgroundColor: `${getFactorColor('weather', etaData.factors.weather)}20`,
                          color: getFactorColor('weather', etaData.factors.weather)
                        }}
                        className="text-xs"
                      >
                        {etaData.factors.weather.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Road Work</span>
                      <Badge 
                        style={{ 
                          backgroundColor: `${getFactorColor('roadwork', etaData.factors.roadwork)}20`,
                          color: getFactorColor('roadwork', etaData.factors.roadwork)
                        }}
                        className="text-xs"
                      >
                        {etaData.factors.roadwork ? 'ACTIVE' : 'NONE'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Alternative Routes */}
            <Card className="p-4 bg-gradient-to-r from-card to-card/80 border-border/50">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Alternative Routes</h4>
                
                <div className="space-y-2">
                  {etaData.alternatives.map((alt, index) => (
                    <motion.div
                      key={alt.routeId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-2 bg-muted/10 rounded-lg hover:bg-muted/20 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <Navigation className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{alt.routeName}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge 
                          style={{ 
                            backgroundColor: `${getFactorColor('crowd', alt.crowdLevel)}20`,
                            color: getFactorColor('crowd', alt.crowdLevel)
                          }}
                          className="text-xs"
                        >
                          <Users className="w-3 h-3 mr-1" />
                          {alt.crowdLevel}
                        </Badge>
                        <span className="text-sm font-bold text-neon-blue">
                          {alt.eta} min
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Update Info */}
            <Card className="p-3 bg-gradient-to-r from-muted/10 to-muted/5 border-muted/30">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Last updated {etaData.lastUpdate.toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Brain className="w-3 h-3" />
                  <span>AI Model v2.1</span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smart Notifications */}
      <AnimatePresence>
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2"
          >
            {notifications.slice(-2).map((notification, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="p-3 bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 border border-neon-cyan/30 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Bell className="w-4 h-4 text-neon-cyan" />
                  </motion.div>
                  <p className="text-sm text-neon-cyan">{notification}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}