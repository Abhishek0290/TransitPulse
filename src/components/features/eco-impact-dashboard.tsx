import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Leaf, TreePine, Clock, IndianRupee, Car, Bus, TrendingUp, Award, Target } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { NavigationHeader } from '../shared/navigation-header';

// Types for the eco statistics
interface EcoStats {
  todayTrips: number;
  co2Saved: number;
  moneySaved: number;
  timeSaved: number;
  totalTrips: number;
  totalCo2Saved: number;
  totalMoneySaved: number;
  carbonFootprintReduction: number;
  treesEquivalent: number;
  rank: number;
  totalUsers: number;
}

// Achievement structure
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  progress: number;
  maxValue: number;
  unlocked: boolean;
  color: string;
}

export function EcoImpactDashboard() {
  // User's environmental impact data
  const [userEcoData] = useState<EcoStats>({
    todayTrips: 3,
    co2Saved: 2.4,
    moneySaved: 185,
    timeSaved: 25,
    totalTrips: 127,
    totalCo2Saved: 89.6,
    totalMoneySaved: 5420,
    carbonFootprintReduction: 34,
    treesEquivalent: 12,
    rank: 847,
    totalUsers: 15420
  });

  // Available eco achievements 
  const [userAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Eco Warrior',
      description: 'Complete 100 eco-friendly trips',
      icon: Leaf,
      progress: 127,
      maxValue: 100,
      unlocked: true,
      color: '#00FF99'
    },
    {
      id: '2',
      title: 'Tree Hugger',
      description: 'Save equivalent of 20 trees',
      icon: TreePine,
      progress: 12,
      maxValue: 20,
      unlocked: false,
      color: '#00BFFF'
    },
    {
      id: '3',
      title: 'Budget Saver',
      description: 'Save ₹10,000 on transport',
      icon: IndianRupee,
      progress: 5420,
      maxValue: 10000,
      unlocked: false,
      color: '#ffa500'
    },
    {
      id: '4',
      title: 'Carbon Crusher',
      description: 'Reduce CO₂ by 100kg',
      icon: Target,
      progress: 89.6,
      maxValue: 100,
      unlocked: false,
      color: '#00FFFF'
    }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Animated counters for stats display
  const [displayStats, setDisplayStats] = useState({
    co2: 0,
    money: 0,
    time: 0,
    trees: 0
  });

  // Update time and animate statistics on component load
  useEffect(() => {
    // Update current time every minute
    const timeUpdater = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Create smooth counting animation for statistics
    const startStatsAnimation = () => {
      const animationDuration = 2000; // 2 seconds
      const frameRate = 60; // 60 FPS
      const totalFrames = (animationDuration / 1000) * frameRate;
      const frameDuration = animationDuration / totalFrames;

      let currentFrame = 0;
      const animationTimer = setInterval(() => {
        const animationProgress = currentFrame / totalFrames;
        
        setDisplayStats({
          co2: userEcoData.co2Saved * animationProgress,
          money: userEcoData.moneySaved * animationProgress,
          time: userEcoData.timeSaved * animationProgress,
          trees: userEcoData.treesEquivalent * animationProgress
        });

        currentFrame++;
        if (currentFrame > totalFrames) {
          clearInterval(animationTimer);
        }
      }, frameDuration);
    };

    startStatsAnimation();
    return () => clearInterval(timeUpdater);
  }, [userEcoData]);

  // Weekly environmental progress data
  const weeklyEnvironmentalData = [
    { day: 'Mon', trips: 2, co2: 1.8 },
    { day: 'Tue', trips: 3, co2: 2.4 },
    { day: 'Wed', trips: 1, co2: 0.9 },
    { day: 'Thu', trips: 4, co2: 3.2 },
    { day: 'Fri', trips: 3, co2: 2.4 },
    { day: 'Sat', trips: 2, co2: 1.6 },
    { day: 'Sun', trips: 1, co2: 0.8 }
  ];

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
        {/* Dashboard Header */}
        <div className="text-center space-y-2">
          <h1 
            className="text-2xl font-bold bg-gradient-to-r from-neon-green to-accent bg-clip-text text-transparent" 
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Eco Impact
          </h1>
          <p className="text-sm text-muted-foreground">Your positive environmental footprint</p>
        </div>

        {/* Today's Environmental Impact */}
        <Card className="p-4 bg-gradient-to-r from-neon-green/10 to-accent/10 border-neon-green/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="p-2 bg-neon-green/20 rounded-full"
                >
                  <Leaf className="w-5 h-5 text-neon-green" />
                </motion.div>
                <span className="font-semibold">Today's Green Impact</span>
              </div>
              <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                {userEcoData.todayTrips} trips
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <motion.p 
                  className="text-2xl font-bold text-neon-green"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {displayStats.co2.toFixed(1)} kg
                </motion.p>
                <p className="text-xs text-muted-foreground">CO₂ Saved</p>
              </div>
              <div className="text-center">
                <motion.p 
                  className="text-2xl font-bold text-neon-green"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  ₹{displayStats.money.toFixed(0)}
                </motion.p>
                <p className="text-xs text-muted-foreground">Money Saved</p>
              </div>
            </div>

            <div className="text-center">
              <motion.p 
                className="text-lg font-semibold text-neon-cyan"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                +{displayStats.time.toFixed(0)} minutes saved vs driving
              </motion.p>
            </div>
          </div>
        </Card>

        {/* Transportation Method Comparison */}
        <Card className="p-4 bg-gradient-to-r from-card to-card/80 border-border/50">
          <div className="space-y-4">
            <h3 className="font-semibold text-center">Smart Choice Comparison</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Public Transport Benefits */}
              <div className="space-y-3 p-3 bg-neon-green/10 rounded-lg border border-neon-green/20">
                <div className="text-center">
                  <Bus className="w-8 h-8 mx-auto text-neon-green mb-2" />
                  <p className="font-semibold text-neon-green">Public Transport</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost/trip</span>
                    <span className="font-medium">₹{(userEcoData.moneySaved / userEcoData.todayTrips / 3).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CO₂/trip</span>
                    <span className="font-medium text-neon-green">Low</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stress</span>
                    <span className="font-medium text-neon-green">Minimal</span>
                  </div>
                </div>
              </div>

              {/* Private Car Drawbacks */}
              <div className="space-y-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <div className="text-center">
                  <Car className="w-8 h-8 mx-auto text-destructive mb-2" />
                  <p className="font-semibold text-destructive">Private Car</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost/trip</span>
                    <span className="font-medium">₹{(userEcoData.moneySaved / userEcoData.todayTrips).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CO₂/trip</span>
                    <span className="font-medium text-destructive">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stress</span>
                    <span className="font-medium text-destructive">High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Weekly Environmental Progress */}
        <Card className="p-4 bg-gradient-to-r from-card to-card/80 border-primary/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Weekly Eco Progress</h3>
              <Badge className="bg-gradient-to-r from-neon-blue/20 to-neon-cyan/20 text-neon-blue border-neon-blue/30">
                <TrendingUp className="w-3 h-3 mr-1" />
                Growing
              </Badge>
            </div>

            <div className="space-y-3">
              {weeklyEnvironmentalData.map((dayData, dayIndex) => (
                <motion.div
                  key={dayData.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: dayIndex * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-8 text-xs font-medium">{dayData.day}</div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Trips: {dayData.trips}</span>
                      <span className="text-neon-green">{dayData.co2} kg CO₂</span>
                    </div>
                    
                    <div className="h-2 bg-muted/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-neon-green to-accent rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(dayData.co2 / 3.2) * 100}%` }}
                        transition={{ duration: 1, delay: dayIndex * 0.1 }}
                        style={{
                          boxShadow: '0 0 8px rgba(0, 255, 153, 0.4)'
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        {/* Lifetime Environmental Impact */}
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="space-y-4">
            <h3 className="font-semibold text-center">Lifetime Impact</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center space-y-2">
                <TreePine className="w-8 h-8 mx-auto text-neon-green" />
                <motion.p 
                  className="text-xl font-bold text-neon-green"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {displayStats.trees.toFixed(0)}
                </motion.p>
                <p className="text-xs text-muted-foreground">Trees Worth of CO₂ Saved</p>
              </div>
              
              <div className="text-center space-y-2">
                <IndianRupee className="w-8 h-8 mx-auto text-neon-cyan" />
                <motion.p 
                  className="text-xl font-bold text-neon-cyan"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  ₹{userEcoData.totalMoneySaved.toLocaleString()}
                </motion.p>
                <p className="text-xs text-muted-foreground">Total Money Saved</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                You've reduced your carbon footprint by <span className="text-neon-green font-semibold">{userEcoData.carbonFootprintReduction}%</span>
              </p>
            </div>
          </div>
        </Card>

        {/* User Achievements System */}
        <Card className="p-4 bg-gradient-to-r from-card to-card/80 border-accent/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Eco Achievements</h3>
              <div className="flex items-center space-x-1 text-xs">
                <Award className="w-3 h-3 text-neon-cyan" />
                <span className="text-neon-cyan">Rank #{userEcoData.rank.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {userAchievements.map((achievement, achievementIndex) => {
                const IconComponent = achievement.icon;
                const completionPercentage = Math.min((achievement.progress / achievement.maxValue) * 100, 100);

                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: achievementIndex * 0.1 }}
                    className={`p-3 rounded-lg border ${achievement.unlocked ? 'bg-gradient-to-r from-accent/20 to-neon-green/20 border-neon-green/30' : 'bg-muted/10 border-muted/30'}`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <IconComponent 
                          className="w-5 h-5" 
                          style={{ color: achievement.unlocked ? achievement.color : '#888888' }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {achievement.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {achievement.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            {achievement.progress.toFixed(achievement.id === '2' || achievement.id === '4' ? 1 : 0)}/{achievement.maxValue}
                          </span>
                          <span className={achievement.unlocked ? 'text-neon-green' : 'text-muted-foreground'}>
                            {completionPercentage.toFixed(0)}%
                          </span>
                        </div>
                        
                        <div className="h-1.5 bg-muted/20 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ 
                              background: achievement.unlocked 
                                ? `linear-gradient(to right, ${achievement.color}80, ${achievement.color})`
                                : '#888888',
                              boxShadow: achievement.unlocked ? `0 0 8px ${achievement.color}40` : 'none'
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${completionPercentage}%` }}
                            transition={{ duration: 1, delay: achievementIndex * 0.2 }}
                          />
                        </div>
                      </div>

                      {achievement.unlocked && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-center"
                        >
                          <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 text-xs">
                            <Award className="w-3 h-3 mr-1" />
                            Unlocked!
                          </Badge>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Community Environmental Impact */}
        <Card className="p-4 bg-gradient-to-r from-neon-cyan/10 to-neon-blue/10 border-neon-cyan/20">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold text-neon-cyan">Community Impact</h3>
              <p className="text-sm text-muted-foreground">Together we're making a difference</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-neon-cyan">{userEcoData.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Active Users</p>
              </div>
              <div>
                <p className="text-lg font-bold text-neon-green">2.4T</p>
                <p className="text-xs text-muted-foreground">CO₂ Saved</p>
              </div>
              <div>
                <p className="text-lg font-bold text-neon-blue">₹15.2Cr</p>
                <p className="text-xs text-muted-foreground">Community Savings</p>
              </div>
            </div>

            <div className="text-center">
              <motion.p 
                className="text-sm font-medium"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🌱 Equivalent to planting <span className="text-neon-green">45,000 trees</span> this year!
              </motion.p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}