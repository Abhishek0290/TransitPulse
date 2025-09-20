import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bus, MapPin, Clock, Users, AlertTriangle, Navigation, Zap, Brain } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { NavigationHeader } from '../shared/navigation-header';

interface BusData {
  id: string;
  route: string;
  status: 'on-time' | 'delayed' | 'breakdown' | 'early';
  position: { x: number; y: number };
  speed: number;
  passengers: number;
  capacity: number;
  eta: string;
  confidence: number;
}

export function SmartLiveMap() {
  const [buses, setBuses] = useState<BusData[]>([
    { id: 'BUS001', route: '42A', status: 'on-time', position: { x: 20, y: 30 }, speed: 45, passengers: 28, capacity: 40, eta: '3 min', confidence: 92 },
    { id: 'BUS002', route: '15B', status: 'delayed', position: { x: 60, y: 45 }, speed: 25, passengers: 35, capacity: 40, eta: '8 min', confidence: 78 },
    { id: 'BUS003', route: '33C', status: 'on-time', position: { x: 75, y: 60 }, speed: 50, passengers: 15, capacity: 35, eta: '1 min', confidence: 95 },
    { id: 'BUS004', route: '67D', status: 'breakdown', position: { x: 40, y: 70 }, speed: 0, passengers: 42, capacity: 50, eta: 'N/A', confidence: 0 },
  ]);

  const [selectedBus, setSelectedBus] = useState<BusData | null>(null);
  const [userLocation] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prevBuses => 
        prevBuses.map(bus => ({
          ...bus,
          position: {
            x: Math.min(90, Math.max(10, bus.position.x + (Math.random() - 0.5) * 4)),
            y: Math.min(90, Math.max(10, bus.position.y + (Math.random() - 0.5) * 4))
          },
          speed: bus.status === 'breakdown' ? 0 : Math.max(0, bus.speed + (Math.random() - 0.5) * 10),
          passengers: Math.max(0, Math.min(bus.capacity, bus.passengers + Math.floor(Math.random() * 6 - 3))),
          confidence: bus.status === 'breakdown' ? 0 : Math.max(60, Math.min(99, bus.confidence + Math.floor(Math.random() * 6 - 3)))
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return '#00FF99';
      case 'early': return '#00BFFF';
      case 'delayed': return '#ffa500';
      case 'breakdown': return '#ff4444';
      default: return '#888888';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'on-time': return 'from-green-500/20 to-green-400/20';
      case 'early': return 'from-blue-500/20 to-blue-400/20';
      case 'delayed': return 'from-orange-500/20 to-orange-400/20';
      case 'breakdown': return 'from-red-500/20 to-red-400/20';
      default: return 'from-gray-500/20 to-gray-400/20';
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
        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-green bg-clip-text text-transparent" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Smart Live Map
            </h1>
            <p className="text-sm text-muted-foreground">AI-Powered Real-time Tracking</p>
          </div>
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-gradient-to-r from-neon-blue/20 to-neon-cyan/20 rounded-full"
            >
              <Brain className="w-5 h-5 text-neon-cyan" />
            </motion.div>
            <Badge className="bg-gradient-to-r from-neon-green/20 to-accent/20 text-neon-green border-neon-green/30">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-neon-green rounded-full mr-2"
              />
              LIVE
            </Badge>
          </div>
        </div>

        {/* Live Map Container */}
        <Card className="relative h-96 bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 overflow-hidden">
          {/* Map Grid */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Roads */}
          <svg className="absolute inset-0 w-full h-full">
            <motion.path
              d="M 0 30% Q 50% 40% 100% 50%"
              stroke="rgba(0, 191, 255, 0.3)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="10,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            <motion.path
              d="M 20% 0 Q 40% 50% 60% 100%"
              stroke="rgba(0, 255, 153, 0.3)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="10,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.7 }}
            />
          </svg>

          {/* User Location */}
          <motion.div
            className="absolute"
            style={{
              left: `${userLocation.x}%`,
              top: `${userLocation.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="relative">
              <div className="w-4 h-4 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-full border-2 border-white shadow-lg"></div>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-neon-cyan"
                animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Bus Icons */}
          {buses.map((bus) => (
            <motion.div
              key={bus.id}
              className="absolute cursor-pointer"
              style={{
                left: `${bus.position.x}%`,
                top: `${bus.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              animate={{
                x: [0, 2, 0, -2, 0],
                y: [0, -1, 0, 1, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              onClick={() => setSelectedBus(bus)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                className={`relative p-2 bg-gradient-to-r ${getStatusBgColor(bus.status)} rounded-lg border-2 backdrop-blur-sm`}
                style={{ borderColor: getStatusColor(bus.status) }}
                animate={bus.status !== 'breakdown' ? {
                  boxShadow: [
                    `0 0 10px ${getStatusColor(bus.status)}40`,
                    `0 0 20px ${getStatusColor(bus.status)}60`,
                    `0 0 10px ${getStatusColor(bus.status)}40`
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Bus 
                  className="w-6 h-6" 
                  style={{ color: getStatusColor(bus.status) }}
                />
                {bus.status === 'breakdown' && (
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <AlertTriangle className="w-3 h-3 text-destructive" />
                  </motion.div>
                )}
              </motion.div>
              
              {/* Speed indicator */}
              {bus.speed > 0 && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <div className="text-xs bg-black/70 text-white px-1 rounded">
                    {Math.round(bus.speed)}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </Card>

        {/* Enhanced AI ETA Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">AI-Powered ETAs</h2>
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-4 h-4 text-neon-cyan" />
              </motion.div>
              <Badge className="bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 text-neon-cyan border-neon-cyan/30 text-xs">
                <Brain className="w-3 h-3 mr-1" />
                Real-time ML
              </Badge>
            </div>
          </div>
          
          <div className="grid gap-3">
            {buses.filter(bus => bus.status !== 'breakdown').map((bus, index) => (
              <motion.div
                key={bus.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-4 bg-gradient-to-r from-card to-card/80 border-border/50 hover:border-primary/30 transition-all duration-300">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${getStatusColor(bus.status)}20` }}
                        >
                          <Bus className="w-5 h-5" style={{ color: getStatusColor(bus.status) }} />
                        </div>
                        <div>
                          <p className="font-semibold">Route {bus.route}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Users className="w-3 h-3" />
                            <span>{bus.passengers}/{bus.capacity}</span>
                            <span className="text-xs">•</span>
                            <span>{Math.round((bus.passengers / bus.capacity) * 100)}% full</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <motion.div
                          className="text-xl font-bold"
                          style={{ color: getStatusColor(bus.status) }}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {bus.eta}
                        </motion.div>
                        <div className="flex items-center space-x-1 text-xs">
                          <Brain className="w-3 h-3 text-neon-cyan" />
                          <span className="text-neon-cyan">{bus.confidence}% confident</span>
                        </div>
                      </div>
                    </div>

                    {/* ETA Range Indicator */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Best case</span>
                        <span>Worst case</span>
                      </div>
                      <div className="relative">
                        <div className="h-1.5 bg-muted/20 rounded-full overflow-hidden">
                          <motion.div
                            className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-neon-green via-neon-cyan to-orange-400 rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: '70%' }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                          />
                        </div>
                        <motion.div
                          className="absolute top-0 w-0.5 h-1.5 bg-white rounded-full shadow-lg"
                          animate={{ left: `${(parseInt(bus.eta) / 15) * 100}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-neon-green font-medium">{Math.max(1, parseInt(bus.eta) - 2)}m</span>
                        <span className="text-orange-400 font-medium">{parseInt(bus.eta) + 5}m</span>
                      </div>
                    </div>

                    {/* Quick Factors */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                        <span className="text-muted-foreground">Low traffic</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-neon-cyan rounded-full"></div>
                        <span className="text-muted-foreground">Clear route</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
                        <span className="text-muted-foreground">On schedule</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Live Stats */}
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-neon-blue">{buses.filter(b => b.status !== 'breakdown').length}</p>
              <p className="text-xs text-muted-foreground">Active Buses</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-neon-green">{Math.round(buses.reduce((acc, bus) => acc + bus.speed, 0) / buses.length)}</p>
              <p className="text-xs text-muted-foreground">Avg Speed (km/h)</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-neon-cyan">{Math.round(buses.reduce((acc, bus) => acc + (bus.passengers / bus.capacity), 0) / buses.length * 100)}%</p>
              <p className="text-xs text-muted-foreground">Avg Occupancy</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Bus Detail Modal */}
      <AnimatePresence>
        {selectedBus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBus(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card border border-primary/20 rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <div className="p-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl">
                  <Bus className="w-12 h-12 mx-auto" style={{ color: getStatusColor(selectedBus.status) }} />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold">Route {selectedBus.route}</h3>
                  <p className="text-sm text-muted-foreground">Bus ID: {selectedBus.id}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Status</p>
                    <Badge style={{ backgroundColor: `${getStatusColor(selectedBus.status)}20`, color: getStatusColor(selectedBus.status) }}>
                      {selectedBus.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">ETA</p>
                    <p className="font-semibold" style={{ color: getStatusColor(selectedBus.status) }}>{selectedBus.eta}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Speed</p>
                    <p className="font-semibold">{Math.round(selectedBus.speed)} km/h</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Occupancy</p>
                    <p className="font-semibold">{selectedBus.passengers}/{selectedBus.capacity}</p>
                  </div>
                </div>

                <Button 
                  onClick={() => setSelectedBus(null)}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}