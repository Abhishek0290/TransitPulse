// Hardware Integration Service
// Built for seamless IoT device communication and data collection

export interface DeviceStatus {
  deviceId: string;
  type: 'gps' | 'passenger_counter' | 'environmental' | 'emergency_button';
  status: 'online' | 'offline' | 'error';
  lastHeartbeat: number;
  batteryLevel?: number;
  signalStrength?: number;
}

export interface SensorData {
  deviceId: string;
  timestamp: number;
  sensorType: string;
  value: number | string | boolean;
  unit?: string;
  accuracy?: number;
}

export interface GPSData extends SensorData {
  latitude: number;
  longitude: number;
  altitude?: number;
  speed?: number;
  bearing?: number;
  accuracy: number;
}

export interface PassengerCountData extends SensorData {
  busId: string;
  entering: number;
  exiting: number;
  currentCount: number;
  confidence: number;
}

export interface EnvironmentalData extends SensorData {
  temperature?: number;
  humidity?: number;
  airQuality?: number;
  noiseLevel?: number;
}

class HardwareIntegrationService {
  private mqttClient: any = null; // In production, use proper MQTT client
  private deviceRegistry: Map<string, DeviceStatus> = new Map();
  private dataBuffer: Map<string, SensorData[]> = new Map();
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeMQTTConnection();
    this.startHealthMonitoring();
  }

  // Initialize MQTT connection for IoT device communication
  private async initializeMQTTConnection() {
    try {
      // In production, use proper MQTT library like mqtt.js
      // this.mqttClient = mqtt.connect(process.env.REACT_APP_MQTT_URL, {
      //   username: process.env.REACT_APP_MQTT_USERNAME,
      //   password: process.env.REACT_APP_MQTT_PASSWORD
      // });

      console.log('MQTT connection initialized (mock)');
      
      // Mock data simulation for development
      this.simulateDeviceData();
    } catch (error) {
      console.error('Failed to initialize MQTT connection:', error);
    }
  }

  // Register a new IoT device
  async registerDevice(deviceId: string, type: DeviceStatus['type']): Promise<boolean> {
    try {
      const device: DeviceStatus = {
        deviceId,
        type,
        status: 'online',
        lastHeartbeat: Date.now(),
        batteryLevel: Math.floor(Math.random() * 100),
        signalStrength: Math.floor(Math.random() * 100)
      };

      this.deviceRegistry.set(deviceId, device);
      this.notifyListeners('device_registered', device);
      
      console.log(`Device ${deviceId} registered successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to register device ${deviceId}:`, error);
      return false;
    }
  }

  // Get all registered devices
  getDevices(): DeviceStatus[] {
    return Array.from(this.deviceRegistry.values());
  }

  // Get device status
  getDeviceStatus(deviceId: string): DeviceStatus | null {
    return this.deviceRegistry.get(deviceId) || null;
  }

  // Subscribe to real-time sensor data
  subscribeToSensorData(
    deviceId: string,
    callback: (data: SensorData) => void
  ): () => void {
    const listeners = this.listeners.get(deviceId) || [];
    listeners.push(callback);
    this.listeners.set(deviceId, listeners);

    return () => {
      const currentListeners = this.listeners.get(deviceId) || [];
      const index = currentListeners.indexOf(callback);
      if (index > -1) {
        currentListeners.splice(index, 1);
        this.listeners.set(deviceId, currentListeners);
      }
    };
  }

  // Send command to IoT device
  async sendCommand(deviceId: string, command: string, payload?: any): Promise<boolean> {
    try {
      // In production, send via MQTT
      // await this.mqttClient.publish(`devices/${deviceId}/commands`, JSON.stringify({
      //   command,
      //   payload,
      //   timestamp: Date.now()
      // }));

      console.log(`Command sent to device ${deviceId}:`, command, payload);
      return true;
    } catch (error) {
      console.error(`Failed to send command to device ${deviceId}:`, error);
      return false;
    }
  }

  // Process GPS data from vehicle tracking devices
  processGPSData(data: GPSData): void {
    this.storeData(data.deviceId, data);
    this.notifyListeners(data.deviceId, data);
    
    // Update vehicle location in transit system
    this.updateVehicleLocation(data);
  }

  // Process passenger count data from IoT sensors
  processPassengerCountData(data: PassengerCountData): void {
    this.storeData(data.deviceId, data);
    this.notifyListeners(data.deviceId, data);
    
    // Update crowd prediction models
    this.updateCrowdPredictions(data);
  }

  // Process environmental sensor data
  processEnvironmentalData(data: EnvironmentalData): void {
    this.storeData(data.deviceId, data);
    this.notifyListeners(data.deviceId, data);
    
    // Check for environmental alerts
    this.checkEnvironmentalAlerts(data);
  }

  // Emergency button integration
  async triggerEmergencyAlert(deviceId: string, location?: GPSData): Promise<boolean> {
    try {
      const alertData = {
        deviceId,
        timestamp: Date.now(),
        location,
        type: 'emergency_button',
        severity: 'high'
      };

      // Send to emergency services API
      // In production, integrate with local emergency services
      console.log('Emergency alert triggered:', alertData);
      
      this.notifyListeners('emergency_alert', alertData);
      return true;
    } catch (error) {
      console.error('Failed to trigger emergency alert:', error);
      return false;
    }
  }

  // Health monitoring for connected devices
  private startHealthMonitoring(): void {
    setInterval(() => {
      const now = Date.now();
      const offlineThreshold = 60000; // 1 minute

      this.deviceRegistry.forEach((device, deviceId) => {
        if (now - device.lastHeartbeat > offlineThreshold) {
          device.status = 'offline';
          this.notifyListeners('device_offline', device);
        }
      });
    }, 30000); // Check every 30 seconds
  }

  // Store sensor data with automatic cleanup
  private storeData(deviceId: string, data: SensorData): void {
    const buffer = this.dataBuffer.get(deviceId) || [];
    buffer.push(data);
    
    // Keep only last 1000 readings per device
    if (buffer.length > 1000) {
      buffer.splice(0, buffer.length - 1000);
    }
    
    this.dataBuffer.set(deviceId, buffer);
  }

  // Update vehicle location based on GPS data
  private updateVehicleLocation(gpsData: GPSData): void {
    // In production, update the transit data service
    console.log('Updating vehicle location:', gpsData);
  }

  // Update crowd prediction models
  private updateCrowdPredictions(countData: PassengerCountData): void {
    // In production, feed data to ML models
    console.log('Updating crowd predictions:', countData);
  }

  // Check for environmental alerts
  private checkEnvironmentalAlerts(envData: EnvironmentalData): void {
    // Check thresholds and trigger alerts if needed
    if (envData.temperature && envData.temperature > 40) {
      this.notifyListeners('environmental_alert', {
        type: 'high_temperature',
        value: envData.temperature,
        deviceId: envData.deviceId
      });
    }
  }

  // Notify event listeners
  private notifyListeners(event: string, data: any): void {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }

  // Simulate device data for development
  private simulateDeviceData(): void {
    // Register some mock devices
    this.registerDevice('GPS_001', 'gps');
    this.registerDevice('COUNTER_001', 'passenger_counter');
    this.registerDevice('ENV_001', 'environmental');
    this.registerDevice('SOS_001', 'emergency_button');

    // Simulate periodic data updates
    setInterval(() => {
      // Mock GPS data
      const gpsData: GPSData = {
        deviceId: 'GPS_001',
        timestamp: Date.now(),
        sensorType: 'gps',
        value: 'location',
        latitude: 23.0225 + (Math.random() - 0.5) * 0.01,
        longitude: 72.5714 + (Math.random() - 0.5) * 0.01,
        speed: Math.random() * 60,
        bearing: Math.random() * 360,
        accuracy: Math.random() * 10 + 2
      };
      this.processGPSData(gpsData);

      // Mock passenger count data
      const countData: PassengerCountData = {
        deviceId: 'COUNTER_001',
        timestamp: Date.now(),
        sensorType: 'passenger_count',
        value: Math.floor(Math.random() * 5),
        busId: 'BUS001',
        entering: Math.floor(Math.random() * 3),
        exiting: Math.floor(Math.random() * 2),
        currentCount: Math.floor(Math.random() * 40),
        confidence: 0.85 + Math.random() * 0.15
      };
      this.processPassengerCountData(countData);

      // Mock environmental data
      const envData: EnvironmentalData = {
        deviceId: 'ENV_001',
        timestamp: Date.now(),
        sensorType: 'environmental',
        value: 'readings',
        temperature: 25 + Math.random() * 15,
        humidity: 40 + Math.random() * 40,
        airQuality: Math.floor(Math.random() * 200),
        noiseLevel: 40 + Math.random() * 40
      };
      this.processEnvironmentalData(envData);
    }, 5000); // Update every 5 seconds
  }
}

// Create singleton instance
export const hardwareService = new HardwareIntegrationService();

// Hardware configuration for different deployment scenarios
export const hardwareConfig = {
  development: {
    enableSimulation: true,
    mqttUrl: 'ws://localhost:1883',
    updateInterval: 5000
  },
  staging: {
    enableSimulation: false,
    mqttUrl: 'wss://staging-mqtt.transitpulse.com:8883',
    updateInterval: 3000
  },
  production: {
    enableSimulation: false,
    mqttUrl: 'wss://mqtt.transitpulse.com:8883',
    updateInterval: 1000
  }
};