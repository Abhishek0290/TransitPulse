import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, Users, Zap, Brain, Navigation, TrendingUp, Star } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface RouteOption {
  id: string;
  buses: string[];
  totalTime: string;
  walkTime: string;
  waitTime: string;
  transfers: number;
  crowdLevel: 'low' | 'medium' | 'high';
  confidence: number;
  cost: number;
  ecoScore: number;
  recommendation: 'fastest' | 'least-crowded' | 'cheapest' | 'eco-friendly';
}

export function AIRouteSuggestions() {
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const mockRoutes: RouteOption[] = [
    {
      id: '1',
      buses: ['42A', '15B'],
      totalTime: '18 mins',
      walkTime: '5 mins',
      waitTime: '2 mins',
      transfers: 1,
      crowdLevel: 'low',
      confidence: 94,
      cost: 25,
      ecoScore: 85,
      recommendation: 'fastest'
    },
    {
      id: '2',
      buses: ['33C'],
      totalTime: '23 mins',
      walkTime: '8 mins',
      waitTime: '1 min',
      transfers: 0,
      crowdLevel: 'medium',
      confidence: 87,
      cost: 20,
      ecoScore: 92,
      recommendation: 'least-crowded'
    },
    {
      id: '3',
      buses: ['67D', '89E'],
      totalTime: '25 mins',
      walkTime: '4 mins',
      waitTime: '3 mins',
      transfers: 1,
      crowdLevel: 'high',
      confidence: 78,
      cost: 15,
      ecoScore: 78,
      recommendation: 'cheapest'
    }
  ];

  const handleSearch = () => {
    if (!destination.trim()) return;
    
    setIsSearching(true);
    
    setTimeout(() => {
      setRoutes(mockRoutes);
      setIsSearching(false);
    }, 2000);
  };

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'low': return '#00FF99';
      case 'medium': return '#ffa500';
      case 'high': return '#ff4444';
      default: return '#888888';
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'fastest': return <Zap className="w-4 h-4" />;
      case 'least-crowded': return <Users className="w-4 h-4" />;
      case 'cheapest': return <TrendingUp className="w-4 h-4" />;
      case 'eco-friendly': return <Star className="w-4 h-4" />;
      default: return <Navigation className="w-4 h-4" />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'fastest': return '#00BFFF';
      case 'least-crowded': return '#00FF99';
      case 'cheapest': return '#ffa500';
      case 'eco-friendly': return '#00FFFF';
      default: return '#888888';
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
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-green bg-clip-text text-transparent" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            AI Route Planner
          </h1>
          <p className="text-sm text-muted-foreground">Smart multi-route suggestions powered by AI</p>
        </div>

        {/* Search Input */}
        <Card className="p-4 bg-gradient-to-r from-card to-card/80 border-primary/20">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-neon-blue" />
              <span>From: Current Location</span>
            </div>
            
            <div className="relative">
              <Input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where do you want to go?"
                className="pl-10 h-12 bg-input/50 border-primary/30 focus:border-primary/60 text-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>

            <Button 
              onClick={handleSearch}
              disabled={!destination.trim() || isSearching}
              className="w-full h-12 bg-gradient-to-r from-neon-blue to-neon-cyan hover:from-neon-blue/90 hover:to-neon-cyan/90 text-black font-bold"
            >
              {isSearching ? (
                <motion.div
                  className="flex items-center space-x-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Brain className="w-5 h-5" />
                  <span>AI Processing...</span>
                </motion.div>
              ) : (
                <>
                  <Navigation className="w-5 h-5 mr-2" />
                  Find Best Routes
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Loading Animation */}
        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center space-y-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto bg-gradient-to-r from-neon-blue/20 to-neon-cyan/20 rounded-full flex items-center justify-center"
              >
                <Brain className="w-8 h-8 text-neon-cyan" />
              </motion.div>
              <p className="text-neon-cyan font-medium">Analyzing traffic patterns & crowd data...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Route Results */}
        <AnimatePresence>
          {routes.length > 0 && !isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Smart Recommendations</h2>
                <Badge className="bg-gradient-to-r from-neon-green/20 to-accent/20 text-neon-green border-neon-green/30">
                  <Brain className="w-3 h-3 mr-1" />
                  AI Powered
                </Badge>
              </div>

              {routes.map((route, index) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card 
                    className={`p-4 cursor-pointer transition-all duration-300 ${
                      selectedRoute === route.id 
                        ? 'border-primary/60 bg-gradient-to-r from-primary/10 to-accent/10' 
                        : 'border-border/50 hover:border-primary/30 bg-gradient-to-r from-card to-card/80'
                    }`}
                    onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
                  >
                    <div className="space-y-3">
                      {/* Recommendation Badge */}
                      <div className="flex items-center justify-between">
                        <Badge 
                          className="text-xs"
                          style={{ 
                            backgroundColor: `${getRecommendationColor(route.recommendation)}20`,
                            color: getRecommendationColor(route.recommendation),
                            borderColor: `${getRecommendationColor(route.recommendation)}40`
                          }}
                        >
                          {getRecommendationIcon(route.recommendation)}
                          <span className="ml-1 capitalize">{route.recommendation.replace('-', ' ')}</span>
                        </Badge>
                        
                        <div className="flex items-center space-x-1 text-xs">
                          <Brain className="w-3 h-3 text-neon-cyan" />
                          <span className="text-neon-cyan">{route.confidence}%</span>
                        </div>
                      </div>

                      {/* Route Info */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            {route.buses.map((bus, i) => (
                              <div key={i} className="flex items-center">
                                <Badge variant="outline" className="text-xs font-mono border-primary/40 text-primary">
                                  {bus}
                                </Badge>
                                {i < route.buses.length - 1 && (
                                  <div className="mx-2 w-2 h-2 bg-muted-foreground rounded-full" />
                                )}
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {route.transfers === 0 ? 'Direct route' : `${route.transfers} transfer${route.transfers > 1 ? 's' : ''}`}
                          </p>
                        </div>

                        <div className="text-right">
                          <motion.p 
                            className="text-xl font-bold text-neon-blue"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {route.totalTime}
                          </motion.p>
                          <p className="text-xs text-muted-foreground">Total time</p>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{route.waitTime}</span>
                          </div>
                          <p className="text-muted-foreground mt-1">Wait</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Users className="w-3 h-3" style={{ color: getCrowdColor(route.crowdLevel) }} />
                            <span style={{ color: getCrowdColor(route.crowdLevel) }}>
                              {route.crowdLevel.charAt(0).toUpperCase() + route.crowdLevel.slice(1)}
                            </span>
                          </div>
                          <p className="text-muted-foreground mt-1">Crowd</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-neon-green font-bold">₹{route.cost}</span>
                          </div>
                          <p className="text-muted-foreground mt-1">Cost</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Star className="w-3 h-3 text-neon-cyan" />
                            <span className="text-neon-cyan">{route.ecoScore}</span>
                          </div>
                          <p className="text-muted-foreground mt-1">Eco</p>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {selectedRoute === route.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-border/30 pt-3 space-y-3"
                          >
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-muted-foreground">Walking time</p>
                                <p className="font-medium">{route.walkTime}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Eco impact</p>
                                <p className="font-medium text-neon-green">-{route.ecoScore}% CO₂</p>
                              </div>
                            </div>
                            
                            <Button 
                              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle route selection
                              }}
                            >
                              <Navigation className="w-4 h-4 mr-2" />
                              Start Navigation
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Destinations */}
        {routes.length === 0 && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold">Popular Destinations</h2>
            <div className="grid grid-cols-2 gap-3">
              {['City Center', 'Railway Station', 'Hospital', 'University'].map((place, index) => (
                <motion.div
                  key={place}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="p-4 cursor-pointer hover:border-primary/30 transition-all duration-300 bg-gradient-to-r from-card to-card/80"
                    onClick={() => setDestination(place)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/20 rounded-lg">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{place}</p>
                        <p className="text-xs text-muted-foreground">Tap to set destination</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}