export interface LogEntry {
  id: string;
  timestamp: string;
  type: "LOGIN" | "ATTENDANCE";
  direction: "SENT" | "RECEIVED";
  url: string;
  headers: Record<string, string>;
  body: any;
  status?: number;
}

export type OS_TYPE = "1" | "2" | "3"; // 1 Android, 2 iOS, etc

export interface LoginRequestData {
  username: string;
  Password:  string;
  OS: string;
  DeviceID: string;
  Version: string;
  LangID: string;
  DeviceName: string;
  DeviceToken: string;
  company: string;
  build: string;
}

export interface AttendancePayload {
  Stoken: string;
  LangID: string;
  AppVersion: string;
  OS: string;
  DataHeader: {
    P0: string; // Dynamic parameter or employee session context
    P1: "i" | "o"; // i for checkin, o for checkout
    P2: string; // Dynamic UUID or installation UID
    P3: string; // WiFi BSSID/MAC
    P4: string; // Captured date time e.g. "2026-03-18 18:32:05"
    P5: string; // WiFi SSID or location tag
    P6: string; // Auxiliary data
  };
  company: string;
}
