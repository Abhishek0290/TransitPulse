import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Settings, Bell, Globe, Shield, Info, LogOut, Edit3, MapPin, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from "sonner@2.0.3";

interface UserSettings {
  notifications: boolean;
  locationServices: boolean;
  autoRefresh: boolean;
  nightMode: boolean;
  language: 'en' | 'hi';
  emergencyAlerts: boolean;
}

export function UserProfile() {
  const [settings, setSettings] = useState<UserSettings>({
    notifications: true,
    locationServices: true,
    autoRefresh: true,
    nightMode: true,
    language: 'en',
    emergencyAlerts: true
  });

  const [userStats] = useState({
    tripsThisWeek: 12,
    totalTrips: 89,
    avgWaitTime: '6 min',
    favoriteRoute: 'Bus 21'
  });

  const updateSetting = (key: keyof UserSettings, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const settingsSections = [
    {
      title: 'Notifications',
      items: [
        {
          key: 'notifications' as keyof UserSettings,
          label: 'Push Notifications',
          description: 'Receive bus alerts and updates',
          icon: Bell,
          type: 'switch'
        },
        {
          key: 'emergencyAlerts' as keyof UserSettings,
          label: 'Emergency Alerts',
          description: 'Critical safety notifications',
          icon: Shield,
          type: 'switch'
        }
      ]
    },
    {
      title: 'Location & Tracking',
      items: [
        {
          key: 'locationServices' as keyof UserSettings,
          label: 'Location Services',
          description: 'Allow location access for better service',
          icon: MapPin,
          type: 'switch'
        },
        {
          key: 'autoRefresh' as keyof UserSettings,
          label: 'Auto Refresh',
          description: 'Automatically update bus locations',
          icon: Clock,
          type: 'switch'
        }
      ]
    },
    {
      title: 'App Preferences',
      items: [
        {
          key: 'nightMode' as keyof UserSettings,
          label: 'Dark Mode',
          description: 'Use dark theme',
          icon: Settings,
          type: 'switch'
        },
        {
          key: 'language' as keyof UserSettings,
          label: 'Language',
          description: 'English / हिंदी',
          icon: Globe,
          type: 'language'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 py-6 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Profile</h1>
            <p className="text-sm text-muted-foreground">Manage your account settings</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF]/10"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* User Info */}
        <Card className="p-6 bg-card border border-border">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-16 h-16 bg-gradient-to-br from-[#00BFFF] to-[#00FF99] rounded-full flex items-center justify-center"
              >
                <User className="w-8 h-8 text-black" />
              </motion.div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#00FF99] rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white">Transit User</h2>
              <p className="text-sm text-muted-foreground">user@transitpulse.com</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="bg-[#00BFFF]/20 text-[#00BFFF] text-xs">
                  Premium User
                </Badge>
                <Badge variant="secondary" className="bg-[#00FF99]/20 text-[#00FF99] text-xs">
                  Verified
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Usage Stats */}
        <Card className="p-4 bg-card border border-border">
          <h3 className="text-sm font-medium text-white mb-4">Your Transit Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <div className="text-2xl font-bold text-[#00BFFF]">{userStats.tripsThisWeek}</div>
              <div className="text-xs text-muted-foreground">Trips This Week</div>
            </div>
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <div className="text-2xl font-bold text-[#00FF99]">{userStats.totalTrips}</div>
              <div className="text-xs text-muted-foreground">Total Trips</div>
            </div>
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <div className="text-lg font-bold text-[#ffa500]">{userStats.avgWaitTime}</div>
              <div className="text-xs text-muted-foreground">Avg Wait Time</div>
            </div>
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <div className="text-lg font-bold text-[#ff6b6b]">{userStats.favoriteRoute}</div>
              <div className="text-xs text-muted-foreground">Favorite Route</div>
            </div>
          </div>
        </Card>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <Card key={section.title} className="p-4 bg-card border border-border">
            <h3 className="text-sm font-medium text-white mb-4">{section.title}</h3>
            <div className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <item.icon className="w-5 h-5 text-[#00BFFF]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.type === 'switch' ? (
                        <Switch
                          checked={settings[item.key] as boolean}
                          onCheckedChange={(checked) => updateSetting(item.key, checked)}
                          className="data-[state=checked]:bg-[#00BFFF]"
                        />
                      ) : item.type === 'language' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateSetting(item.key, settings.language === 'en' ? 'hi' : 'en')}
                          className="border-[#00FF99] text-[#00FF99] hover:bg-[#00FF99]/10"
                        >
                          {settings.language === 'en' ? 'EN' : 'हिं'}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                  {itemIndex < section.items.length - 1 && (
                    <Separator className="mt-4 bg-border" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}

        {/* Quick Actions */}
        <Card className="p-4 bg-card border border-border">
          <h3 className="text-sm font-medium text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF]/10"
              onClick={() => alert('TransitPulse v1.0\nSmart Mobility for Smart Towns\nDeveloped for SIH 2024')}
            >
              <Info className="w-4 h-4 mr-2" />
              About TransitPulse
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-[#00FF99] text-[#00FF99] hover:bg-[#00FF99]/10"
              onClick={() => alert('Privacy Policy: Your data is secure and encrypted.')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Privacy Policy
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-[#ffa500] text-[#ffa500] hover:bg-[#ffa500]/10"
              onClick={() => alert('Advanced settings coming soon!')}
            >
              <Settings className="w-4 h-4 mr-2" />
              App Settings
            </Button>
          </div>
        </Card>

        {/* Logout */}
        <Card className="p-4 bg-card border border-[#ff4444]/30">
          <Button 
            variant="outline" 
            className="w-full justify-start border-[#ff4444] text-[#ff4444] hover:bg-[#ff4444]/10"
            onClick={() => {
              if (confirm('Are you sure you want to sign out?')) {
                alert('Signed out successfully');
              }
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </Card>

        {/* App Info */}
        <div className="text-center py-4 space-y-1">
          <p className="text-xs text-muted-foreground">TransitPulse v1.0.0</p>
          <p className="text-xs text-muted-foreground">Made for Smart India Hackathon 2024</p>
        </div>
      </div>
    </div>
  );
}