import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, Navigation, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface Bus {
  id: string;
  number: string;
  eta: number;
  status: 'on-time' | 'delayed' | 'early';
  lat: number;
  lng: number;
  route: string;
}

export function LiveTracking() {
  const [buses, setBuses] = useState<Bus[]>([
    {
      id: '1',
      number: '21',
      eta: 6,
      status: 'on-time',
      lat: 23.2599,
      lng: 77.4126,
      route: 'City Center - Railway Station'
    },
    {
      id: '2',
      number: '15',
      eta: 12,
      status: 'delayed',
      lat: 23.2515,
      lng: 77.4025,
      route: 'Mall Road - ISBT'
    },
    {
      id: '3',
      number: '8',
      eta: 3,
      status: 'early',
      lat: 23.2699,
      lng: 77.4226,
      route: 'MP Nagar - Bairagarh'
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prevBuses => 
        prevBuses.map(bus => ({
          ...bus,
          eta: Math.max(0, bus.eta - 1)
        }))
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh with slight ETA changes
    setTimeout(() => {
      setBuses(prevBuses => 
        prevBuses.map(bus => ({
          ...bus,
          eta: Math.max(0, bus.eta + Math.floor(Math.random() * 3) - 1)
        }))
      );
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return '#00FF99';
      case 'delayed': return '#ffa500';
      case 'early': return '#00BFFF';
      default: return '#888888';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 py-6 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Live Tracking</h1>
            <p className="text-sm text-muted-foreground">Real-time bus locations</p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF]/10"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Mock Map Area */}
      <div className="flex-1 relative bg-[#0d1117] overflow-hidden">
        {/* Map Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 191, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 191, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Mock Roads */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#333] to-transparent"></div>
          <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#444] to-transparent"></div>
          <div className="absolute top-3/4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#333] to-transparent"></div>
          <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#333] to-transparent"></div>
          <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#333] to-transparent"></div>
        </div>

        {/* Animated Bus Icons */}
        <AnimatePresence>
          {buses.map((bus, index) => (
            <motion.div
              key={bus.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: [0, 20, -10, 0],
                y: [0, -15, 10, 0]
              }}
              transition={{ 
                duration: 4 + index,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute cursor-pointer"
              style={{
                left: `${30 + index * 25}%`,
                top: `${40 + index * 15}%`
              }}
              onClick={() => setSelectedBus(bus)}
            >
              <div className="relative">
                <motion.div
                  animate={{ 
                    boxShadow: [
                      `0 0 10px ${getStatusColor(bus.status)}40`,
                      `0 0 20px ${getStatusColor(bus.status)}60`,
                      `0 0 10px ${getStatusColor(bus.status)}40`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: getStatusColor(bus.status) }}
                >
                  <span className="text-black text-xs font-bold">{bus.number}</span>
                </motion.div>
                {/* Pulse effect */}
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-lg border-2"
                  style={{ borderColor: getStatusColor(bus.status) }}
                ></motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Location Markers */}
        <div className="absolute top-20 left-8">
          <div className="flex items-center space-x-2 bg-black/50 px-3 py-2 rounded-lg backdrop-blur-sm">
            <MapPin className="w-4 h-4 text-[#00FF99]" />
            <span className="text-xs text-white">Railway Station</span>
          </div>
        </div>
        <div className="absolute bottom-20 right-8">
          <div className="flex items-center space-x-2 bg-black/50 px-3 py-2 rounded-lg backdrop-blur-sm">
            <MapPin className="w-4 h-4 text-[#00BFFF]" />
            <span className="text-xs text-white">City Center</span>
          </div>
        </div>
      </div>

      {/* Bus Info Cards */}
      <div className="px-4 py-4 space-y-3 bg-card border-t border-border">
        {buses.slice(0, 2).map((bus) => (
          <motion.div
            key={bus.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="p-4 bg-secondary border-border hover:border-[#00BFFF]/50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-black text-sm font-bold"
                    style={{ backgroundColor: getStatusColor(bus.status) }}
                  >
                    {bus.number}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{bus.route}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Arriving in {bus.eta} min
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge 
                    variant="secondary"
                    className="text-xs"
                    style={{ 
                      backgroundColor: `${getStatusColor(bus.status)}20`,
                      color: getStatusColor(bus.status),
                      border: `1px solid ${getStatusColor(bus.status)}40`
                    }}
                  >
                    {bus.status.replace('-', ' ')}
                  </Badge>
                  <Navigation className="w-4 h-4 text-[#00BFFF]" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Selected Bus Modal */}
      <AnimatePresence>
        {selectedBus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedBus(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card p-6 rounded-xl border border-border max-w-sm w-full"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-black font-bold"
                  style={{ backgroundColor: getStatusColor(selectedBus.status) }}
                >
                  {selectedBus.number}
                </div>
                <div>
                  <h3 className="font-semibold text-white">Bus {selectedBus.number}</h3>
                  <p className="text-sm text-muted-foreground">{selectedBus.route}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">ETA:</span>
                  <span className="text-sm text-white">{selectedBus.eta} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge 
                    variant="secondary"
                    style={{ 
                      backgroundColor: `${getStatusColor(selectedBus.status)}20`,
                      color: getStatusColor(selectedBus.status)
                    }}
                  >
                    {selectedBus.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
              
              <Button 
                onClick={() => setSelectedBus(null)}
                className="w-full mt-6 bg-[#00BFFF] hover:bg-[#0099CC] text-black"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}