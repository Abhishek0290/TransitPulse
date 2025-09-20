import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, TrendingUp, TrendingDown, Brain, Clock, Bus, BarChart3, Wifi } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { NavigationHeader } from '../shared/navigation-header';

interface BusCrowdData {
  id: string;
  route: string;
  currentOccupancy: number;
  capacity: number;
  prediction: {
    next15min: number;
    next30min: number;
    next60min: number;
  };
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
  peakTime: string;
  recommendedTime: string;
}

interface HourlyData {
  hour: string;
  occupancy: number;
  prediction: number;
}

export function CrowdPrediction() {
  const [busData] = useState<BusCrowdData[]>([
    {
      id: 'BUS001',
      route: '42A',
      currentOccupancy: 28,
      capacity: 40,
      prediction: { next15min: 32, next30min: 38, next60min: 25 },
      trend: 'increasing',
      confidence: 92,
      peakTime: '5:30 PM',
      recommendedTime: '4:45 PM'
    },
    {
      id: 'BUS002',
      route: '15B',
      currentOccupancy: 35,
      capacity: 40,
      prediction: { next15min: 30, next30min: 25, next60min: 20 },
      trend: 'decreasing',
      confidence: 87,
      peakTime: '6:00 PM',
      recommendedTime: '6:15 PM'
    },
    {
      id: 'BUS003',
      route: '33C',
      currentOccupancy: 15,
      capacity: 35,
      prediction: { next15min: 18, next30min: 22, next60min: 28 },
      trend: 'increasing',
      confidence: 94,
      peakTime: '5:45 PM',
      recommendedTime: 'Now'
    }
  ]);

  const [hourlyPattern] = useState<HourlyData[]>([
    { hour: '6 AM', occupancy: 45, prediction: 50 },
    { hour: '8 AM', occupancy: 85, prediction: 90 },
    { hour: '10 AM', occupancy: 35, prediction: 40 },
    { hour: '12 PM', occupancy: 60, prediction: 65 },
    { hour: '2 PM', occupancy: 40, prediction: 45 },
    { hour: '4 PM', occupancy: 75, prediction: 80 },
    { hour: '6 PM', occupancy: 95, prediction: 100 },
    { hour: '8 PM', occupancy: 70, prediction: 75 },
    { hour: '10 PM', occupancy: 30, prediction: 35 }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getOccupancyColor = (percentage: number) => {
    if (percentage < 50) return '#00FF99';
    if (percentage < 80) return '#ffa500';
    return '#ff4444';
  };

  const getOccupancyLevel = (percentage: number) => {
    if (percentage < 30) return 'Low';
    if (percentage < 60) return 'Moderate';
    if (percentage < 90) return 'High';
    return 'Very High';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-orange-400" />;
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-green-400" />;
      default: return <BarChart3 className="w-4 h-4 text-blue-400" />;
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-green bg-clip-text text-transparent" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Crowd Insights
          </h1>
          <p className="text-sm text-muted-foreground">AI-powered occupancy predictions</p>
        </div>

        {/* Live Status */}
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-2 bg-neon-cyan/20 rounded-full"
              >
                <Wifi className="w-4 h-4 text-neon-cyan" />
              </motion.div>
              <span className="font-semibold">Live IoT Data</span>
            </div>
            <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 bg-neon-green rounded-full mr-2"
              />
              Real-time
            </Badge>
          </div>
          
          <div className="text-center">
            <p className="text-3xl font-bold text-neon-cyan">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </Card>

        {/* Bus Crowd Data */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Live Bus Occupancy</h2>
            <div className="flex items-center space-x-1 text-xs">
              <Brain className="w-3 h-3 text-neon-cyan" />
              <span className="text-neon-cyan">AI Predicted</span>
            </div>
          </div>

          {busData.map((bus, index) => {
            const currentPercentage = Math.round((bus.currentOccupancy / bus.capacity) * 100);
            const next15Percentage = Math.round((bus.prediction.next15min / bus.capacity) * 100);

            return (
              <motion.div
                key={bus.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-4 bg-gradient-to-r from-card to-card/80 border-border/50 hover:border-primary/30 transition-all duration-300">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <Bus className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">Route {bus.route}</p>
                          <p className="text-sm text-muted-foreground">Bus {bus.id}</p>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(bus.trend)}
                          <Badge 
                            style={{ 
                              backgroundColor: `${getOccupancyColor(currentPercentage)}20`,
                              color: getOccupancyColor(currentPercentage)
                            }}
                            className="text-xs"
                          >
                            {getOccupancyLevel(currentPercentage)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{bus.confidence}% accuracy</p>
                      </div>
                    </div>

                    {/* Current Occupancy */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Current</span>
                        <span className="font-semibold">
                          {bus.currentOccupancy}/{bus.capacity} ({currentPercentage}%)
                        </span>
                      </div>
                      
                      <div className="relative">
                        <Progress 
                          value={currentPercentage} 
                          className="h-3"
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                          }}
                        />
                        <motion.div
                          className="absolute top-0 left-0 h-3 rounded-full"
                          style={{ 
                            backgroundColor: getOccupancyColor(currentPercentage),
                            width: `${currentPercentage}%`,
                            boxShadow: `0 0 10px ${getOccupancyColor(currentPercentage)}40`
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${currentPercentage}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                    </div>

                    {/* Predictions */}
                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">+15 min</p>
                        <motion.p 
                          className="font-bold"
                          style={{ color: getOccupancyColor(next15Percentage) }}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                        >
                          {next15Percentage}%
                        </motion.p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">+30 min</p>
                        <p className="font-bold" style={{ color: getOccupancyColor(Math.round((bus.prediction.next30min / bus.capacity) * 100)) }}>
                          {Math.round((bus.prediction.next30min / bus.capacity) * 100)}%
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">+1 hour</p>
                        <p className="font-bold" style={{ color: getOccupancyColor(Math.round((bus.prediction.next60min / bus.capacity) * 100)) }}>
                          {Math.round((bus.prediction.next60min / bus.capacity) * 100)}%
                        </p>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-gradient-to-r from-muted/10 to-muted/5 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-neon-cyan" />
                          <span className="text-muted-foreground">Peak time</span>
                        </div>
                        <span className="font-medium">{bus.peakTime}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <TrendingDown className="w-4 h-4 text-neon-green" />
                          <span className="text-muted-foreground">Best time</span>
                        </div>
                        <span className="font-medium text-neon-green">{bus.recommendedTime}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Hourly Pattern Chart */}
        <Card className="p-4 bg-gradient-to-r from-card to-card/80 border-primary/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Daily Crowd Pattern</h3>
              <Badge className="bg-gradient-to-r from-neon-blue/20 to-neon-cyan/20 text-neon-blue border-neon-blue/30">
                <BarChart3 className="w-3 h-3 mr-1" />
                Trend Analysis
              </Badge>
            </div>

            <div className="space-y-3">
              {hourlyPattern.map((data, index) => (
                <motion.div
                  key={data.hour}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-12 text-xs text-muted-foreground font-mono">
                    {data.hour}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    {/* Current/Historical */}
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-muted/20 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-neon-blue to-neon-cyan rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${data.occupancy}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          style={{
                            boxShadow: '0 0 8px rgba(0, 191, 255, 0.4)'
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium w-8">{data.occupancy}%</span>
                    </div>
                    
                    {/* Prediction */}
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-muted/20 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-neon-green to-accent rounded-full opacity-70"
                          initial={{ width: 0 }}
                          animate={{ width: `${data.prediction}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                          style={{
                            boxShadow: '0 0 8px rgba(0, 255, 153, 0.4)'
                          }}
                        />
                      </div>
                      <span className="text-xs text-neon-green w-8">{data.prediction}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-center space-x-6 text-xs pt-3 border-t border-border/30">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-2 bg-gradient-to-r from-neon-blue to-neon-cyan rounded"></div>
                <span className="text-muted-foreground">Current</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-2 bg-gradient-to-r from-neon-green to-accent rounded opacity-70"></div>
                <span className="text-muted-foreground">AI Prediction</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Smart Tips */}
        <Card className="p-4 bg-gradient-to-r from-accent/10 to-neon-green/10 border-accent/20">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-neon-green" />
              <h3 className="font-semibold text-neon-green">Smart Travel Tips</h3>
            </div>
            
            <div className="space-y-2 text-sm">
              <motion.div
                className="flex items-start space-x-2"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="w-1.5 h-1.5 bg-neon-green rounded-full mt-2 flex-shrink-0" />
                <p>Route 33C has lowest crowd right now - perfect time to travel!</p>
              </motion.div>
              
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full mt-2 flex-shrink-0" />
                <p>Avoid Route 15B between 5:30-6:30 PM for comfortable journey</p>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-neon-blue rounded-full mt-2 flex-shrink-0" />
                <p>Peak hours prediction: 8-9 AM & 5:30-6:30 PM today</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}