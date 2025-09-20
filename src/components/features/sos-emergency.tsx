import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Phone, MessageSquare, MapPin, Users, Shield, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { useToast } from '../shared/toast-provider';
import { NavigationHeader } from '../shared/navigation-header';

interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  type: 'police' | 'medical' | 'family' | 'transport';
}

export function SOSEmergency() {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [emergencyType, setEmergencyType] = useState<string | null>(null);
  const { showToast } = useToast();

  const emergencyContacts: EmergencyContact[] = [
    { id: '1', name: 'Police Control Room', number: '100', type: 'police' },
    { id: '2', name: 'Medical Emergency', number: '108', type: 'medical' },
    { id: '3', name: 'Transit Authority', number: '1800-XXX-XXXX', type: 'transport' },
    { id: '4', name: 'Emergency Contact', number: '+91-XXXXX-XXXXX', type: 'family' }
  ];

  const emergencyTypes = [
    { id: 'medical', name: 'Medical Emergency', icon: '🏥', color: '#ff4444' },
    { id: 'harassment', name: 'Harassment', icon: '⚠️', color: '#ffa500' },
    { id: 'accident', name: 'Accident', icon: '🚨', color: '#ff6b6b' },
    { id: 'robbery', name: 'Theft/Robbery', icon: '🚔', color: '#ff4444' },
    { id: 'breakdown', name: 'Vehicle Breakdown', icon: '🔧', color: '#00BFFF' },
    { id: 'other', name: 'Other Emergency', icon: '❗', color: '#ffa500' }
  ];

  const activateSOS = (type: string) => {
    setEmergencyType(type);
    setCountdown(5);
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSOSActive(true);
          showToast('SOS Alert Activated', 'info');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelSOS = () => {
    setCountdown(0);
    setIsSOSActive(false);
    setEmergencyType(null);
    showToast('SOS Alert Cancelled', 'info');
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'police': return '🚔';
      case 'medical': return '🏥';
      case 'transport': return '🚌';
      case 'family': return '👥';
      default: return '📞';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header with clickable logo */}
      <NavigationHeader />
      
      {/* Header */}
      <div className="px-4 py-6 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white flex items-center space-x-2">
              <Shield className="w-5 h-5 text-[#ff4444]" />
              <span>Emergency SOS</span>
            </h1>
            <p className="text-sm text-muted-foreground">Quick access to emergency services</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#00FF99] rounded-full animate-pulse"></div>
            <span className="text-xs text-[#00FF99]">GPS Active</span>
          </div>
        </div>
      </div>

      {/* SOS Status */}
      <AnimatePresence>
        {isSOSActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-4 bg-[#ff4444]/10 border-b border-[#ff4444]/30"
          >
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <AlertTriangle className="w-6 h-6 text-[#ff4444]" />
              </motion.div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#ff4444]">SOS ALERT ACTIVE</p>
                <p className="text-xs text-muted-foreground">Emergency services have been notified</p>
              </div>
              <Button 
                onClick={cancelSOS}
                variant="outline"
                size="sm"
                className="border-[#ff4444] text-[#ff4444] hover:bg-[#ff4444]/10"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Countdown */}
      <AnimatePresence>
        {countdown > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <div className="bg-card p-8 rounded-2xl text-center border border-[#ff4444]">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-6xl font-bold text-[#ff4444] mb-4"
              >
                {countdown}
              </motion.div>
              <p className="text-white mb-4">Activating SOS in...</p>
              <Button 
                onClick={cancelSOS}
                variant="outline"
                className="border-[#ff4444] text-[#ff4444] hover:bg-[#ff4444]/10"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 py-6 space-y-6">
        {/* Emergency Types */}
        <div>
          <h2 className="text-lg font-medium text-white mb-4">Select Emergency Type</h2>
          <div className="grid grid-cols-2 gap-3">
            {emergencyTypes.map((type) => (
              <motion.div
                key={type.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="p-4 bg-card border border-border hover:border-[#ff4444]/50 transition-colors cursor-pointer"
                  onClick={() => activateSOS(type.id)}
                >
                  <div className="text-center space-y-2">
                    <div className="text-2xl">{type.icon}</div>
                    <p className="text-sm font-medium text-white">{type.name}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick SOS Button */}
        <div className="text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => activateSOS('emergency')}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-[#ff4444] to-[#cc3333] hover:from-[#ff6666] hover:to-[#ff4444] text-white font-bold text-lg shadow-2xl shadow-[#ff4444]/50"
              disabled={isSOSActive || countdown > 0}
            >
              <div className="text-center">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                <div>SOS</div>
              </div>
            </Button>
          </motion.div>
          <p className="text-xs text-muted-foreground mt-3">Hold for 3 seconds to activate emergency alert</p>
        </div>

        {/* Emergency Contacts */}
        <div>
          <h2 className="text-lg font-medium text-white mb-4">Emergency Contacts</h2>
          <div className="space-y-3">
            {emergencyContacts.map((contact) => (
              <motion.div
                key={contact.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="p-4 bg-card border border-border hover:border-[#00BFFF]/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getContactIcon(contact.type)}</div>
                      <div>
                        <p className="text-sm font-medium text-white">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.number}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-[#00FF99] text-[#00FF99] hover:bg-[#00FF99]/10"
                        onClick={() => {
                          showToast(`Calling ${contact.name}`, 'success');
                        }}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF]/10"
                        onClick={() => {
                          showToast(`Message sent to ${contact.name}`, 'success');
                        }}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Current Location */}
        <Card className="p-4 bg-secondary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-[#00FF99]" />
              <div>
                <p className="text-sm font-medium text-white">Current Location</p>
                <p className="text-xs text-muted-foreground">MP Nagar, Zone 1, Bhopal, MP</p>
                <p className="text-xs text-muted-foreground">Lat: 23.2599, Lng: 77.4126</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-[#00FF99]/20 text-[#00FF99]">
              GPS Active
            </Badge>
          </div>
        </Card>

        {/* Safety Tips */}
        <Card className="p-4 bg-card border border-border">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center space-x-2">
            <Shield className="w-4 h-4 text-[#00BFFF]" />
            <span>Safety Tips</span>
          </h3>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>• Share your trip details with trusted contacts</p>
            <p>• Keep your phone charged during travel</p>
            <p>• Stay aware of your surroundings</p>
            <p>• Use well-lit and populated bus stops</p>
          </div>
        </Card>
      </div>
    </div>
  );
}