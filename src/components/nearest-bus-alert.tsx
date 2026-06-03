import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin, Bell, BellOff, Navigation2 } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { toast } from "sonner@2.0.3";

interface BusAlert {
  id: string;
  number: string;
  route: string;
  eta: number;
  distance: string;
  status: 'on-time' | 'delayed' | 'early';
  stops: string[];
  nextStop: string;
  alertEnabled: boolean;
}

export function NearestBusAlert() {
  const [buses, setBuses] = useState<BusAlert[]>([
    {
      id: '1',
      number: '21',
      route: 'City Center - Railway Station',
      eta: 6,
      distance: '0.8 km',
      status: 'on-time',
      stops: ['MP Nagar', 'DB City Mall', 'Railway Station'],
      nextStop: 'MP Nagar',
      alertEnabled: true
    },
    {
      id: '2',
      number: '15',
      route: 'Mall Road - ISBT',
      eta: 12,
      distance: '1.2 km',
      status: 'delayed',
      stops: ['Palasia', 'Treasure Island', 'ISBT'],
      nextStop: 'Palasia',
      alertEnabled: false
    },
    {
      id: '3',
      number: '8',
      route: 'MP Nagar - Bairagarh',
      eta: 3,
      distance: '0.5 km',
      status: 'early',
      stops: ['New Market', 'TT Nagar', 'Bairagarh'],
      nextStop: 'New Market',
      alertEnabled: true
    },
    {
      id: '4',
      number: '33',
      route: 'Habibganj - Karond',
      eta: 18,
      distance: '2.1 km',
      status: 'on-time',
      stops: ['Bittan Market', 'Ashoka Garden', 'Karond'],
      nextStop: 'Bittan Market',
      alertEnabled: false
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return '#00FF99';
      case 'delayed': return '#ffa500';
      case 'early': return '#00BFFF';
      default: return '#888888';
    }
  };

  const toggleAlert = (busId: string) => {
    const bus = buses.find(b => b.id === busId);
    setBuses(buses.map(b => 
      b.id === busId 
        ? { ...b, alertEnabled: !b.alertEnabled }
        : b
    ));
    
    if (bus) {
      toast.success(
        bus.alertEnabled 
          ? `Alert disabled for Bus ${bus.number}` 
          : `Alert enabled for Bus ${bus.number}`,
        {
          description: bus.alertEnabled 
            ? 'You will no longer receive notifications'
            : `You'll be notified when Bus ${bus.number} arrives`
        }
      );
    }
  };

  // Simulate real-time ETA updates
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 py-6 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Nearby Buses</h1>
            <p className="text-sm text-muted-foreground">Live arrival times</p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-[#00BFFF] rounded-full animate-pulse"></div>
            <span>Live Updates</span>
          </div>
        </div>
      </div>

      {/* Current Location */}
      <div className="px-4 py-4 bg-secondary/30">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-[#00FF99] rounded-full animate-pulse"></div>
          <div>
            <p className="text-sm font-medium text-white">Your Location</p>
            <p className="text-xs text-muted-foreground">MP Nagar, Zone 1, Bhopal</p>
          </div>
        </div>
      </div>

      {/* Bus List */}
      <div className="px-4 py-4 space-y-4">
        {buses.map((bus, index) => (
          <motion.div
            key={bus.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="p-4 bg-card border border-border hover:border-[#00BFFF]/50 transition-colors">
              {/* Bus Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-bold"
                    style={{ backgroundColor: getStatusColor(bus.status) }}
                  >
                    {bus.number}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{bus.route}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{bus.distance} away</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-[#00BFFF]" />
                      <span className="text-lg font-bold text-white">{bus.eta}</span>
                      <span className="text-xs text-muted-foreground">min</span>
                    </div>
                    <Badge 
                      variant="secondary"
                      className="text-xs mt-1"
                      style={{ 
                        backgroundColor: `${getStatusColor(bus.status)}20`,
                        color: getStatusColor(bus.status),
                        border: `1px solid ${getStatusColor(bus.status)}40`
                      }}
                    >
                      {bus.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Next Stop */}
              <div className="flex items-center justify-between mb-3 p-2 bg-secondary/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Navigation2 className="w-4 h-4 text-[#00FF99]" />
                  <span className="text-sm text-white">Next: {bus.nextStop}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">Alert</span>
                  <Switch 
                    checked={bus.alertEnabled}
                    onCheckedChange={() => toggleAlert(bus.id)}
                    className="data-[state=checked]:bg-[#00BFFF]"
                  />
                  {bus.alertEnabled ? (
                    <Bell className="w-4 h-4 text-[#00BFFF]" />
                  ) : (
                    <BellOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Route Stops */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                {bus.stops.map((stop, stopIndex) => (
                  <div key={stopIndex} className="flex items-center space-x-2 flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full ${
                      stopIndex === 0 ? 'bg-[#00FF99]' : 'bg-muted-foreground/30'
                    }`}></div>
                    <span className={`text-xs whitespace-nowrap ${
                      stopIndex === 0 ? 'text-[#00FF99]' : 'text-muted-foreground'
                    }`}>
                      {stop}
                    </span>
                    {stopIndex < bus.stops.length - 1 && (
                      <div className="w-4 h-px bg-muted-foreground/30"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF]/10"
                  onClick={() => {
                    toast.info(`Now tracking Bus ${bus.number}`, {
                      description: 'Real-time location updates enabled'
                    });
                  }}
                >
                  Track Live
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-[#00FF99] text-[#00FF99] hover:bg-[#00FF99]/10"
                  onClick={() => toggleAlert(bus.id)}
                >
                  {bus.alertEnabled ? 'Remove Alert' : 'Set Alert'}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bottom Alert Summary */}
      <div className="px-4 py-4 bg-card border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-[#00BFFF]" />
            <span className="text-sm text-white">
              {buses.filter(b => b.alertEnabled).length} active alerts
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-[#00FF99] hover:bg-[#00FF99]/10"
          >
            Manage All
          </Button>
        </div>
      </div>
    </div>
  );
}