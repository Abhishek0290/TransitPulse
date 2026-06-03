import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bus, Clock, MapPin, AlertTriangle, Navigation, Brain, Zap, Users, TrendingUp, Leaf } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface BusRoute {
  id: string;
  name: string;
  status: 'on-time' | 'delayed' | 'early';
  nextArrival: string;
  distance: string;
  confidence: number;
  crowdLevel: 'low' | 'medium' | 'high';
}

export function HomeDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nearbyBuses, setNearbyBuses] = useState<BusRoute[]>([
    { id: '1', name: 'Route 42A', status: 'on-time', nextArrival: '3 min', distance: '0.2 km', confidence: 94, crowdLevel: 'low' },
    { id: '2', name: 'Route 15B', status: 'delayed', nextArrival: '8 min', distance: '0.5 km', confidence: 76, crowdLevel: 'high' },
    { id: '3', name: 'Route 33C', status: 'early', nextArrival: '1 min', distance: '0.1 km', confidence: 98, crowdLevel: 'medium' },
  ]);

  const [todaysStats] = useState({
    activeFleet: 24,
    avgSpeed: 42,
    ecoSavings: 1240,
    co2Saved: 15.6
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate real-time updates
      setNearbyBuses(prev => prev.map(bus => ({
        ...bus,
        nextArrival: Math.max(1, parseInt(bus.nextArrival) + Math.floor(Math.random() * 2 - 1)) + ' min',
        confidence: Math.max(70, Math.min(99, bus.confidence + Math.floor(Math.random() * 6 - 3)))
      })));
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return '#00FF99';
      case 'delayed': return '#ff4444';
      case 'early': return '#00BFFF';
      default: return '#888888';
    }
  };

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'low': return '#00FF99';
      case 'medium': return '#ffa500';
      case 'high': return '#ff4444';
      default: return '#888888';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-time': return <Clock className="w-3 h-3" />;
      case 'delayed': return <AlertTriangle className="w-3 h-3" />;
      case 'early': return <Navigation className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pt-8 pb-24 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <motion.h1 
            className="text-4xl font-black bg-gradient-to-r from-neon-blue via-[#00FFFF] to-neon-green bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ 
              scale: 1,
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ 
              scale: { duration: 0.5, delay: 0.2 },
              backgroundPosition: { duration: 4, repeat: Infinity }
            }}
            style={{ 
              backgroundSize: "200% 100%",
              fontFamily: 'Montserrat, sans-serif'
            }}
          >
            TransitPulse+
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-1"
          >
            <p className="text-lg font-medium text-neon-cyan">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </motion.div>
        </div>

        {/* AI Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-4 bg-gradient-to-r from-primary/20 via-[#00FFFF]/10 to-accent/20 border-primary/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="p-2 bg-neon-cyan/20 rounded-full"
                >
                  <Brain className="w-5 h-5 text-neon-cyan" />
                </motion.div>
                <div>
                  <p className="font-semibold">AI Transit Engine</p>
                  <p className="text-sm text-muted-foreground">Real-time optimization active</p>
                </div>
              </div>
              <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-neon-green rounded-full mr-2"
                />
                LIVE
              </Badge>
            </div>
          </Card>
        </motion.div>

        {/* Smart Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-4 bg-gradient-to-br from-card via-card to-primary/5 border-primary/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-neon-blue/20 rounded-lg">
                <Bus className="w-5 h-5 text-neon-blue" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Smart Fleet</p>
                <motion.p 
                  className="text-xl font-bold text-neon-blue"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {todaysStats.activeFleet}
                </motion.p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-card via-card to-accent/5 border-accent/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-neon-green/20 rounded-lg">
                <Zap className="w-5 h-5 text-neon-green" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Speed</p>
                <motion.p 
                  className="text-xl font-bold text-neon-green"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  {todaysStats.avgSpeed} <span className="text-sm">km/h</span>
                </motion.p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-card via-card to-[#00FFFF]/5 border-[#00FFFF]/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#00FFFF]/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-[#00FFFF]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Savings</p>
                <motion.p 
                  className="text-xl font-bold text-[#00FFFF]"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  ₹{todaysStats.ecoSavings.toLocaleString()}
                </motion.p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-card via-card to-neon-green/5 border-neon-green/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-neon-green/20 rounded-lg">
                <Leaf className="w-5 h-5 text-neon-green" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                <motion.p 
                  className="text-xl font-bold text-neon-green"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                >
                  {todaysStats.co2Saved} <span className="text-sm">kg</span>
                </motion.p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI-Powered Nearby Buses with Enhanced ETAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Smart ETA Predictions</h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-xs">
                <Brain className="w-3 h-3 text-neon-cyan" />
                <span className="text-neon-cyan">AI Enhanced</span>
              </div>
              <Badge className="bg-gradient-to-r from-neon-green/20 to-accent/20 text-neon-green border-neon-green/30 text-xs">
                <Clock className="w-3 h-3 mr-1" />
                LIVE
              </Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            {nearbyBuses.map((bus, index) => (
              <motion.div
                key={bus.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Card className="p-4 bg-gradient-to-r from-card to-card/50 border-border/50 hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Bus className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{bus.name}</p>
                        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                          <span>{bus.distance} away</span>
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" style={{ color: getCrowdColor(bus.crowdLevel) }} />
                            <span style={{ color: getCrowdColor(bus.crowdLevel) }}>
                              {bus.crowdLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <motion.div 
                        className="text-lg font-bold"
                        style={{ color: getStatusColor(bus.status) }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {bus.nextArrival}
                      </motion.div>
                      
                      {/* Enhanced ETA Range */}
                      <div className="w-16 mb-2">
                        <div className="h-1 bg-muted/20 rounded-full overflow-hidden">
                          <motion.div
                            className="h-1 bg-gradient-to-r from-neon-green to-orange-400 rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: `${(bus.confidence / 100) * 100}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge 
                          className="text-xs"
                          style={{ 
                            backgroundColor: `${getStatusColor(bus.status)}20`,
                            color: getStatusColor(bus.status)
                          }}
                        >
                          <span className="mr-1">{getStatusIcon(bus.status)}</span>
                          {bus.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 text-xs">
                        <Brain className="w-3 h-3 text-neon-cyan" />
                        <span className="text-neon-cyan">{bus.confidence}% confident</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-xl font-semibold mb-4">Quick Launch</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              className="h-20 bg-gradient-to-br from-primary via-[#00FFFF] to-primary/80 hover:from-primary/90 hover:via-[#00FFFF]/90 hover:to-primary/70 border-0 text-black font-bold"
              style={{
                boxShadow: '0 0 20px rgba(0, 191, 255, 0.3)',
                fontFamily: 'Montserrat, sans-serif'
              }}
              onClick={() => {}}
            >
              <div className="text-center">
                <Navigation className="w-6 h-6 mb-1 mx-auto" />
                <span className="text-sm">Smart Map</span>
              </div>
            </Button>
            
            <Button 
              className="h-20 bg-gradient-to-br from-neon-cyan via-neon-blue to-neon-cyan/80 hover:from-neon-cyan/90 hover:via-neon-blue/90 hover:to-neon-cyan/70 border-0 text-black font-bold"
              style={{
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
                fontFamily: 'Montserrat, sans-serif'
              }}
              onClick={() => {}}
            >
              <div className="text-center">
                <Clock className="w-6 h-6 mb-1 mx-auto" />
                <span className="text-sm">AI ETA</span>
              </div>
            </Button>

            <Button 
              className="h-20 bg-gradient-to-br from-accent via-neon-green to-accent/80 hover:from-accent/90 hover:via-neon-green/90 hover:to-accent/70 border-0 text-black font-bold"
              style={{
                boxShadow: '0 0 20px rgba(0, 255, 153, 0.3)',
                fontFamily: 'Montserrat, sans-serif'
              }}
              onClick={() => {}}
            >
              <div className="text-center">
                <Users className="w-6 h-6 mb-1 mx-auto" />
                <span className="text-sm">Crowd Info</span>
              </div>
            </Button>
            
            <Button 
              className="h-20 bg-gradient-to-br from-neon-green to-neon-green/80 hover:from-neon-green/90 hover:to-neon-green/70 border-0 text-black font-bold"
              style={{
                boxShadow: '0 0 20px rgba(0, 255, 153, 0.3)',
                fontFamily: 'Montserrat, sans-serif'
              }}
              onClick={() => {}}
            >
              <div className="text-center">
                <Leaf className="w-6 h-6 mb-1 mx-auto" />
                <span className="text-sm">Eco Impact</span>
              </div>
            </Button>
          </div>
        </motion.div>

        {/* Smart Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
          
          <Card className="p-4 bg-gradient-to-r from-muted/10 to-muted/5 border-border/30">
            <div className="space-y-3">
              <motion.div 
                className="flex items-center space-x-3 text-sm"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                <span className="text-muted-foreground">Route 33C has lowest crowd - perfect for travel!</span>
                <span className="text-xs text-muted-foreground ml-auto">AI Tip</span>
              </motion.div>
              
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-neon-cyan rounded-full"></div>
                <span className="text-muted-foreground">Peak traffic predicted at 5:30 PM today</span>
                <span className="text-xs text-muted-foreground ml-auto">2 min ago</span>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
                <span className="text-muted-foreground">You saved ₹125 this week by choosing public transport</span>
                <span className="text-xs text-muted-foreground ml-auto">Today</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}