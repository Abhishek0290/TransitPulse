import { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Bus, Users, MapPin, AlertTriangle, Activity, TrendingUp, Clock, Shield } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface BusData {
  id: string;
  number: string;
  route: string;
  status: 'active' | 'inactive' | 'maintenance';
  passengers: number;
  delay: number;
  location: string;
}

export function WebDashboard() {
  const [buses] = useState<BusData[]>([
    { id: '1', number: '21', route: 'City Center - Railway Station', status: 'active', passengers: 35, delay: 2, location: 'MP Nagar' },
    { id: '2', number: '15', route: 'Mall Road - ISBT', status: 'active', passengers: 28, delay: 8, location: 'Palasia' },
    { id: '3', number: '8', route: 'MP Nagar - Bairagarh', status: 'active', passengers: 42, delay: -3, location: 'New Market' },
    { id: '4', number: '33', route: 'Habibganj - Karond', status: 'maintenance', passengers: 0, delay: 0, location: 'Depot' },
    { id: '5', number: '12', route: 'TT Nagar - Airport', status: 'active', passengers: 18, delay: 5, location: 'TT Nagar' },
  ]);

  const routeAnalytics = [
    { route: 'Route 21', passengers: 1250, revenue: 25000, efficiency: 85 },
    { route: 'Route 15', passengers: 980, revenue: 19600, efficiency: 78 },
    { route: 'Route 8', passengers: 1100, revenue: 22000, efficiency: 82 },
    { route: 'Route 33', passengers: 750, revenue: 15000, efficiency: 70 },
    { route: 'Route 12', passengers: 650, revenue: 13000, efficiency: 68 }
  ];

  const weeklyData = [
    { day: 'Mon', passengers: 2800, revenue: 56000 },
    { day: 'Tue', passengers: 3200, revenue: 64000 },
    { day: 'Wed', passengers: 2900, revenue: 58000 },
    { day: 'Thu', passengers: 3400, revenue: 68000 },
    { day: 'Fri', passengers: 3800, revenue: 76000 },
    { day: 'Sat', passengers: 2400, revenue: 48000 },
    { day: 'Sun', passengers: 2200, revenue: 44000 }
  ];

  const statusDistribution = [
    { name: 'Active', value: 15, color: '#00FF99' },
    { name: 'Delayed', value: 8, color: '#ffa500' },
    { name: 'Maintenance', value: 3, color: '#ff4444' },
    { name: 'Inactive', value: 2, color: '#888888' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#00FF99';
      case 'maintenance': return '#ff4444';
      case 'inactive': return '#888888';
      default: return '#888888';
    }
  };

  const getDelayColor = (delay: number) => {
    if (delay <= 0) return '#00FF99';
    if (delay <= 5) return '#ffa500';
    return '#ff4444';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-6 py-6 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">TransitPulse Dashboard</h1>
            <p className="text-muted-foreground">Real-time fleet management and analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#00FF99] rounded-full animate-pulse"></div>
              <span className="text-sm text-[#00FF99]">Live Data</span>
            </div>
            <Button className="bg-[#00BFFF] hover:bg-[#0099CC] text-black">
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Buses</p>
                  <p className="text-2xl font-bold text-[#00FF99]">15</p>
                  <p className="text-xs text-muted-foreground">+2 from yesterday</p>
                </div>
                <Bus className="w-8 h-8 text-[#00FF99]" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Passengers</p>
                  <p className="text-2xl font-bold text-[#00BFFF]">3,247</p>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
                <Users className="w-8 h-8 text-[#00BFFF]" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Delay</p>
                  <p className="text-2xl font-bold text-[#ffa500]">4.2 min</p>
                  <p className="text-xs text-muted-foreground">-1.3 from yesterday</p>
                </div>
                <Clock className="w-8 h-8 text-[#ffa500]" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">SOS Alerts</p>
                  <p className="text-2xl font-bold text-[#ff4444]">2</p>
                  <p className="text-xs text-muted-foreground">Active incidents</p>
                </div>
                <Shield className="w-8 h-8 text-[#ff4444]" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Passengers Chart */}
          <Card className="p-6 bg-card border border-border">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-[#00BFFF]" />
              <span>Weekly Passenger Trend</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="passengers" 
                  stroke="#00BFFF" 
                  strokeWidth={3}
                  dot={{ fill: '#00BFFF', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Bus Status Distribution */}
          <Card className="p-6 bg-card border border-border">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-[#00FF99]" />
              <span>Fleet Status</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {statusDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Route Analytics */}
        <Card className="p-6 bg-card border border-border">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-[#00FF99]" />
            <span>Route Performance</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={routeAnalytics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="route" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #333',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="passengers" fill="#00BFFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Live Bus Status */}
        <Card className="p-6 bg-card border border-border">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Bus className="w-5 h-5 text-[#00BFFF]" />
            <span>Live Bus Status</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Bus</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Route</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Passengers</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Delay</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Location</th>
                </tr>
              </thead>
              <tbody>
                {buses.map((bus) => (
                  <tr key={bus.id} className="border-b border-border/50 hover:bg-secondary/20">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-black text-sm font-bold"
                          style={{ backgroundColor: getStatusColor(bus.status) }}
                        >
                          {bus.number}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-white">{bus.route}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant="secondary"
                        style={{ 
                          backgroundColor: `${getStatusColor(bus.status)}20`,
                          color: getStatusColor(bus.status),
                          border: `1px solid ${getStatusColor(bus.status)}40`
                        }}
                      >
                        {bus.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-white">{bus.passengers}</td>
                    <td className="py-3 px-4">
                      <span 
                        className="text-sm font-medium"
                        style={{ color: getDelayColor(bus.delay) }}
                      >
                        {bus.delay > 0 ? `+${bus.delay}` : bus.delay} min
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{bus.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}