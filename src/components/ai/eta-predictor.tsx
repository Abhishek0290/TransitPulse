import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Brain, TrendingUp, TrendingDown, AlertTriangle, Zap, MapPin, Users, Navigation, Bell } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

// Data structure for transit ETA information
interface TransitETAData {
  routeId: string;
  routeName: string;
  estimatedMinutes: number;
  confidencePercentage: number;
  predictions: {
    bestCase: number;
    mostLikely: number;
    worstCase: number;
  };
  currentConditions: {
    trafficLevel: 'low' | 'medium' | 'high';
    passengerLoad: 'low' | 'medium' | 'high';
    weatherCondition: 'clear' | 'rain' | 'heavy_rain';
    hasRoadwork: boolean;
  };
  trendDirection: 'improving' | 'stable' | 'deteriorating';
  lastUpdatedAt: Date;
  historicalAccuracy: number;
  alternativeRoutes: {
    routeId: string;
    routeName: string;
    minutes: number;
    crowdLevel: 'low' | 'medium' | 'high';
  }[];
}

interface SmartETAPredictorProps {
  destinationName?: string;
  onETAChange?: (data: TransitETAData) => void;
}

export function SmartETAPredictor({ destinationName = "Your Destination", onETAChange }: SmartETAPredictorProps) {
  // Current ETA prediction data
  const [currentPrediction, setCurrentPrediction] = useState<TransitETAData>({
    routeId: 'RT_42A',
    routeName: 'Route 42A',
    estimatedMinutes: 7,
    confidencePercentage: 94,
    predictions: {
      bestCase: 5,
      mostLikely: 7,
      worstCase: 12
    },
    currentConditions: {
      trafficLevel: 'medium',
      passengerLoad: 'low',
      weatherCondition: 'clear',
      hasRoadwork: false
    },
    trendDirection: 'stable',
    lastUpdatedAt: new Date(),
    historicalAccuracy: 89,
    alternativeRoutes: [
      { routeId: 'RT_15B', routeName: 'Route 15B', minutes: 11, crowdLevel: 'high' },
      { routeId: 'RT_33C', routeName: 'Route 33C', minutes: 9, crowdLevel: 'medium' }
    ]
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [showAdvancedInfo, setShowAdvancedInfo] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState<string[]>([]);

  // Simulate real-time AI predictions with periodic updates
  useEffect(() => {
    const predictionUpdater = setInterval(() => {
      setIsCalculating(true);
      
      // Simulate AI processing time
      setTimeout(() => {
        setCurrentPrediction(previousData => {
          // Generate realistic ETA changes
          const newEstimate = Math.max(0, previousData.estimatedMinutes + Math.floor(Math.random() * 3 - 1));
          const newConfidence = Math.max(70, Math.min(99, previousData.confidencePercentage + Math.floor(Math.random() * 6 - 3)));
          
          const updatedPrediction = {
            ...previousData,
            estimatedMinutes: newEstimate,
            confidencePercentage: newConfidence,
            predictions: {
              bestCase: Math.max(0, newEstimate - 2),
              mostLikely: newEstimate,
              worstCase: newEstimate + 5
            },
            trendDirection: newEstimate > previousData.estimatedMinutes ? 'deteriorating' as const : 
                           newEstimate < previousData.estimatedMinutes ? 'improving' as const : 'stable' as const,
            lastUpdatedAt: new Date(),
            currentConditions: {
              ...previousData.currentConditions,
              trafficLevel: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'high' : 'medium') as const : previousData.currentConditions.trafficLevel,
              passengerLoad: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'high' : 'low') as const : previousData.currentConditions.passengerLoad
            }
          };

          // Generate smart user notifications based on changes
          if (newEstimate !== previousData.estimatedMinutes) {
            const timeDifference = newEstimate - previousData.estimatedMinutes;
            if (timeDifference > 2) {
              setRecentNotifications(existing => [...existing.slice(-2), `⚠️ ETA increased by ${timeDifference} minutes due to traffic`]);
            } else if (timeDifference < -2) {
              setRecentNotifications(existing => [...existing.slice(-2), `✅ ETA improved by ${Math.abs(timeDifference)} minutes - faster route found!`]);
            }
          }

          onETAChange?.(updatedPrediction);
          return updatedPrediction;
        });
        setIsCalculating(false);
      }, 1000);
    }, 15000); // Update every 15 seconds

    return () => clearInterval(predictionUpdater);
  }, [onETAChange]);

  // Helper function to get appropriate color for different condition levels
  const getConditionStatusColor = (conditionType: string, value: string | boolean) => {
    if (typeof value === 'boolean') return value ? '#ff4444' : '#00FF99';
    
    const colorMap = {
      'low': '#00FF99',      // Green - good condition
      'medium': '#ffa500',   // Orange - moderate condition 
      'high': '#ff4444',     // Red - poor condition
      'clear': '#00FF99',    // Green - good weather
      'rain': '#ffa500',     // Orange - moderate weather
      'heavy_rain': '#ff4444' // Red - poor weather
    };
    
    return colorMap[value as keyof typeof colorMap] || '#888888';
  };

  // Get appropriate icon for trend direction
  const getTrendIndicator = () => {
    switch (currentPrediction.trendDirection) {
      case 'improving': return <TrendingDown className="w-4 h-4 text-green-400" />;
      case 'deteriorating': return <TrendingUp className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  // Get color based on confidence level
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return '#00FF99';  // High confidence - green
    if (confidence >= 75) return '#00BFFF';  // Good confidence - blue
    if (confidence >= 60) return '#ffa500';  // Moderate confidence - orange
    return '#ff4444';                        // Low confidence - red
  };

  return (
    <div className="space-y-4">
      {/* Main ETA Prediction Display */}
      <Card className="p-6 bg-gradient-to-br from-primary/20 via-[#00FFFF]/10 to-accent/20 border-primary/40 relative overflow-hidden">
        {/* Animated background elements */}
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
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: isCalculating ? 360 : 0 }}
                transition={{ duration: 1 }}
                className="p-2 bg-neon-cyan/20 rounded-full"
              >
                <Brain className="w-5 h-5 text-neon-cyan" />
              </motion.div>
              <div>
                <h3 className="font-semibold">AI ETA Predictor</h3>
                <p className="text-sm text-muted-foreground">To {destinationName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {getTrendIndicator()}
              <Badge 
                className="text-xs"
                style={{ 
                  backgroundColor: `${getConfidenceColor(currentPrediction.confidencePercentage)}20`,
                  color: getConfidenceColor(currentPrediction.confidencePercentage)
                }}
              >
                {currentPrediction.confidencePercentage}% confident
              </Badge>
            </div>
          </div>

          {/* Main ETA Display */}
          <div className="text-center space-y-2">
            <motion.div
              animate={{ 
                scale: isCalculating ? [1, 1.1, 1] : 1,
                color: isCalculating ? '#00FFFF' : '#00BFFF'
              }}
              transition={{ duration: 0.5 }}
              className="text-6xl font-black"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {currentPrediction.estimatedMinutes}<span className="text-2xl ml-1">min</span>
            </motion.div>
            
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-neon-green" />
                <span className="text-neon-green">{currentPrediction.routeName}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3 text-neon-cyan" />
                <span className="text-neon-cyan">{currentPrediction.historicalAccuracy}% accurate</span>
              </div>
            </div>
          </div>

          {/* Prediction Range Visualization */}
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
                    width: `${((currentPrediction.predictions.mostLikely - currentPrediction.predictions.bestCase) / 
                            (currentPrediction.predictions.worstCase - currentPrediction.predictions.bestCase)) * 100}%`
                  }}
                  transition={{ duration: 1 }}
                />
              </div>
              <motion.div
                className="absolute top-0 w-1 h-2 bg-white rounded-full shadow-lg"
                animate={{
                  left: `${((currentPrediction.estimatedMinutes - currentPrediction.predictions.bestCase) / 
                          (currentPrediction.predictions.worstCase - currentPrediction.predictions.bestCase)) * 100}%`
                }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neon-green font-medium">{currentPrediction.predictions.bestCase}m</span>
              <span className="text-orange-400 font-medium">{currentPrediction.predictions.worstCase}m</span>
            </div>
          </div>

          {/* Toggle Advanced Details */}
          <Button
            variant="ghost"
            onClick={() => setShowAdvancedInfo(!showAdvancedInfo)}
            className="w-full text-neon-cyan hover:bg-neon-cyan/10"
          >
            {showAdvancedInfo ? 'Hide Details' : 'Show AI Insights'}
          </Button>
        </div>
      </Card>

      {/* Advanced Analysis Section */}
      <AnimatePresence>
        {showAdvancedInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Current Conditions Analysis */}
            <Card className="p-4 bg-gradient-to-r from-card to-card/80 border-border/50">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">AI Analysis Factors</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Traffic Density</span>
                      <Badge 
                        style={{ 
                          backgroundColor: `${getConditionStatusColor('traffic', currentPrediction.currentConditions.trafficLevel)}20`,
                          color: getConditionStatusColor('traffic', currentPrediction.currentConditions.trafficLevel)
                        }}
                        className="text-xs"
                      >
                        {currentPrediction.currentConditions.trafficLevel.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Passenger Load</span>
                      <Badge 
                        style={{ 
                          backgroundColor: `${getConditionStatusColor('crowd', currentPrediction.currentConditions.passengerLoad)}20`,
                          color: getConditionStatusColor('crowd', currentPrediction.currentConditions.passengerLoad)
                        }}
                        className="text-xs"
                      >
                        {currentPrediction.currentConditions.passengerLoad.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Weather</span>
                      <Badge 
                        style={{ 
                          backgroundColor: `${getConditionStatusColor('weather', currentPrediction.currentConditions.weatherCondition)}20`,
                          color: getConditionStatusColor('weather', currentPrediction.currentConditions.weatherCondition)
                        }}
                        className="text-xs"
                      >
                        {currentPrediction.currentConditions.weatherCondition.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Road Work</span>
                      <Badge 
                        style={{ 
                          backgroundColor: `${getConditionStatusColor('roadwork', currentPrediction.currentConditions.hasRoadwork)}20`,
                          color: getConditionStatusColor('roadwork', currentPrediction.currentConditions.hasRoadwork)
                        }}
                        className="text-xs"
                      >
                        {currentPrediction.currentConditions.hasRoadwork ? 'ACTIVE' : 'NONE'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Alternative Route Options */}
            <Card className="p-4 bg-gradient-to-r from-card to-card/80 border-border/50">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Alternative Routes</h4>
                
                <div className="space-y-2">
                  {currentPrediction.alternativeRoutes.map((alternativeRoute, routeIndex) => (
                    <motion.div
                      key={alternativeRoute.routeId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: routeIndex * 0.1 }}
                      className="flex items-center justify-between p-2 bg-muted/10 rounded-lg hover:bg-muted/20 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <Navigation className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{alternativeRoute.routeName}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge 
                          style={{ 
                            backgroundColor: `${getConditionStatusColor('crowd', alternativeRoute.crowdLevel)}20`,
                            color: getConditionStatusColor('crowd', alternativeRoute.crowdLevel)
                          }}
                          className="text-xs"
                        >
                          <Users className="w-3 h-3 mr-1" />
                          {alternativeRoute.crowdLevel}
                        </Badge>
                        <span className="text-sm font-bold text-neon-blue">
                          {alternativeRoute.minutes} min
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>

            {/* System Information */}
            <Card className="p-3 bg-gradient-to-r from-muted/10 to-muted/5 border-muted/30">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Last updated {currentPrediction.lastUpdatedAt.toLocaleTimeString()}</span>
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

      {/* Smart Notification System */}
      <AnimatePresence>
        {recentNotifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2"
          >
            {recentNotifications.slice(-2).map((notification, notificationIndex) => (
              <motion.div
                key={notificationIndex}
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