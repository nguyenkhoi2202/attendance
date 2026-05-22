export interface DeviceProfile {
  id: string;
  name: string;
  DeviceID: string;
  DeviceName: string;
  OS: string;
  Version: string;
  DeviceToken: string;
  build: string;
  userAgent: string;
}

export interface LoginPayload {
  username: string;
  Password?: string;
  OS: string;
  DeviceID: string;
  Version: string;
  LangID: string;
  DeviceName: string;
  DeviceToken: string;
  company: string;
  build: string;
}

export interface CapturePayload {
  Stoken: string;
  LangID: string;
  AppVersion: string;
  OS: string;
  DataHeader: {
    P0: string; // The extracted token/message from Login API
    P1: string; // 'o' or custom
    P2: string; // Device ID (corresponds to P2 in DataHeader)
    P3: string; // MAC address (e.g. 9a:2a:6f:a4:8f:49)
    P4: string; // Timestamp (e.g. 2026-03-18 18:32:05)
    P5: string; // WiFi SSID (e.g. GIH_8F)
    P6: string; // empty or optional
  };
  company: string;
}

export interface LogEntry {
  id: string;
  type: "info" | "success" | "error" | "login" | "capture";
  title: string;
  description: string;
  timestamp: string;
  responsePayload?: any;
  requestPayload?: any;
}
