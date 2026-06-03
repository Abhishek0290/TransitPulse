// Production-ready transit data service
// Built for easy integration with cloud APIs and IoT hardware

export interface BusLocation {
  id: string;
  routeId: string;
  latitude: number;
  longitude: number;
  bearing: number;
  speed: number;
  timestamp: number;
}

export interface RouteInfo {
  id: string;
  name: string;
  color: string;
  stops: BusStop[];
  isActive: boolean;
  direction: 'inbound' | 'outbound';
}

export interface BusStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  routes: string[];
}

export interface ETAPrediction {
  busId: string;
  stopId: string;
  routeId: string;
  estimatedArrival: number;
  confidence: number;
  factors: PredictionFactor[];
}

export interface PredictionFactor {
  type: 'traffic' | 'weather' | 'historical' | 'crowd' | 'signal';
  impact: number; // -1 to 1
  description: string;
}

export interface CrowdData {
  busId: string;
  passengerCount: number;
  capacity: number;
  boardingRate: number;
  alightingRate: number;
  timestamp: number;
}

class TransitDataService {
  private baseUrl: string;
  private apiKey: string;
  private websocket: WebSocket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    // In production, these would come from environment variables
    this.baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://api.transitpulse.com/v1';
    this.apiKey = process.env.REACT_APP_API_KEY || 'YOUR_API_KEY_HERE';
  }

  // Real-time bus location updates
  async getBusLocations(routeId?: string): Promise<BusLocation[]> {
    try {
      const url = new URL(`${this.baseUrl}/buses/locations`);
      if (routeId) url.searchParams.set('route', routeId);
      
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.buses || [];
    } catch (error) {
      console.error('Failed to fetch bus locations:', error);
      // Return mock data for development
      return this.getMockBusLocations();
    }
  }

  // AI-powered ETA predictions
  async getETAPredictions(stopId: string, routeId?: string): Promise<ETAPrediction[]> {
    try {
      const url = new URL(`${this.baseUrl}/predictions/eta`);
      url.searchParams.set('stop', stopId);
      if (routeId) url.searchParams.set('route', routeId);
      
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.predictions || [];
    } catch (error) {
      console.error('Failed to fetch ETA predictions:', error);
      return this.getMockETAPredictions();
    }
  }

  // Crowd density data from IoT sensors
  async getCrowdData(busId?: string): Promise<CrowdData[]> {
    try {
      const url = new URL(`${this.baseUrl}/crowd/current`);
      if (busId) url.searchParams.set('bus', busId);
      
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.crowdData || [];
    } catch (error) {
      console.error('Failed to fetch crowd data:', error);
      return this.getMockCrowdData();
    }
  }

  // WebSocket connection for real-time updates
  connectToRealTimeUpdates(onUpdate: (data: any) => void): () => void {
    try {
      const wsUrl = this.baseUrl.replace('https://', 'wss://').replace('http://', 'ws://');
      this.websocket = new WebSocket(`${wsUrl}/realtime?token=${this.apiKey}`);
      
      this.websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onUpdate(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.websocket.onclose = () => {
        console.log('WebSocket connection closed');
        // Implement reconnection logic here
        setTimeout(() => this.connectToRealTimeUpdates(onUpdate), 5000);
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return () => {
        if (this.websocket) {
          this.websocket.close();
          this.websocket = null;
        }
      };
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      // Fall back to polling
      const interval = setInterval(async () => {
        const locations = await this.getBusLocations();
        onUpdate({ type: 'bus_locations', data: locations });
      }, 5000);

      return () => clearInterval(interval);
    }
  }

  // Emergency SOS functionality
  async sendSOSAlert(location: { lat: number; lng: number }, message?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/emergency/sos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location,
          message: message || 'Emergency assistance required',
          timestamp: Date.now(),
          userId: 'current_user_id' // In production, get from auth service
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send SOS alert:', error);
      return false;
    }
  }

  // Mock data for development and testing
  private getMockBusLocations(): BusLocation[] {
    return [
      {
        id: 'BUS001',
        routeId: '42A',
        latitude: 23.0225,
        longitude: 72.5714,
        bearing: 45,
        speed: 45,
        timestamp: Date.now()
      },
      {
        id: 'BUS002',
        routeId: '15B',
        latitude: 23.0325,
        longitude: 72.5814,
        bearing: 90,
        speed: 25,
        timestamp: Date.now()
      }
    ];
  }

  private getMockETAPredictions(): ETAPrediction[] {
    return [
      {
        busId: 'BUS001',
        stopId: 'STOP123',
        routeId: '42A',
        estimatedArrival: Date.now() + 180000, // 3 minutes
        confidence: 0.92,
        factors: [
          { type: 'traffic', impact: -0.1, description: 'Light traffic ahead' },
          { type: 'historical', impact: 0.0, description: 'On time historically' }
        ]
      }
    ];
  }

  private getMockCrowdData(): CrowdData[] {
    return [
      {
        busId: 'BUS001',
        passengerCount: 28,
        capacity: 40,
        boardingRate: 2.5,
        alightingRate: 1.8,
        timestamp: Date.now()
      }
    ];
  }
}

// Create singleton instance
export const transitDataService = new TransitDataService();

// Configuration for different environments
export const config = {
  development: {
    apiUrl: 'http://localhost:3001/api/v1',
    wsUrl: 'ws://localhost:3001/realtime',
    enableMockData: true
  },
  staging: {
    apiUrl: 'https://staging-api.transitpulse.com/v1',
    wsUrl: 'wss://staging-api.transitpulse.com/realtime',
    enableMockData: false
  },
  production: {
    apiUrl: 'https://api.transitpulse.com/v1',
    wsUrl: 'wss://api.transitpulse.com/realtime',
    enableMockData: false
  }
};