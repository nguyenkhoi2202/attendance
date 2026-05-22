import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Smartphone, 
  Wifi, 
  Clock, 
  KeyRound, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  FileCode, 
  History, 
  RefreshCw, 
  CornerDownRight, 
  Copy,
  Check,
  Cpu,
  Database,
  ArrowRight,
  Sparkles,
  Layers,
  Settings,
  Flame,
  Globe2,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DEFAULT_PROFILES, DEFAULT_WIFI_PRESETS } from "./presets";
import { LogEntry, LoginPayload, CapturePayload, DeviceProfile } from "./types";

export default function App() {
  // --- Active Tab State ---
  const [activeTab, setActiveTab] = useState<"attendance" | "profiles" | "curl">("attendance");

  // --- Dynamic Local Clock Simulation ---
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Corporate Credentials Configuration State ---
  const [selectedProfile, setSelectedProfile] = useState<DeviceProfile>(DEFAULT_PROFILES[0]);
  const [username, setUsername] = useState<string>("khoitn1");
  const [password, setPassword] = useState<string>("Khanhvy2222@");
  const [company, setCompany] = useState<string>("HDBANK");
  const [langId, setLangId] = useState<string>("VN");
  const [versionApp, setVersionApp] = useState<string>("PNJ_20210105_V1");

  // Custom Editable Device parameters (defaults from profile)
  const [deviceId, setDeviceId] = useState<string>(DEFAULT_PROFILES[0].DeviceID);
  const [deviceName, setDeviceName] = useState<string>(DEFAULT_PROFILES[0].DeviceName);
  const [osType, setOsType] = useState<string>(DEFAULT_PROFILES[0].OS);
  const [osVersion, setOsVersion] = useState<string>(DEFAULT_PROFILES[0].Version);
  const [deviceToken, setDeviceToken] = useState<string>(DEFAULT_PROFILES[0].DeviceToken);
  const [buildNo, setBuildNo] = useState<string>(DEFAULT_PROFILES[0].build);

  // Sync profile values when selected profile changes
  const applyProfile = (profile: DeviceProfile) => {
    setSelectedProfile(profile);
    setDeviceId(profile.DeviceID);
    setDeviceName(profile.DeviceName);
    setOsType(profile.OS);
    setOsVersion(profile.Version);
    setDeviceToken(profile.DeviceToken);
    setBuildNo(profile.build);
  };

  // --- WIFI Signal Simulation Configuration State ---
  const [selectedWifi, setSelectedWifi] = useState(DEFAULT_WIFI_PRESETS[0]);
  const [wifiSsid, setWifiSsid] = useState<string>("GIH_8F");
  const [wifiMac, setWifiMac] = useState<string>("9a:2a:6f:a4:8f:49");
  
  // Extra customizable Capture fields
  const [stoken, setStoken] = useState<string>("4425a3f376cb4add8a2dfc12b38b1174");
  const [p0Value, setP0Value] = useState<string>("5b94710cd969863346a4170315d49e80");
  const [p1Value, setP1Value] = useState<string>("i");
  const [p2Value, setP2Value] = useState<string>("BBD9614B-4DA3-4567-A348-86CCA865001F");
  const [captureRedirectVersion, setCaptureRedirectVersion] = useState<string>("2.8");

  // Keep P4 (timestamp) automatically synced to active login execution or let user tweak
  const [customTimestamp, setCustomTimestamp] = useState<string>("2026-03-18 18:32:05");
  const [autoTimestamp, setAutoTimestamp] = useState<boolean>(true);

  // Auto Bind P0 from Login response option
  const [autoBindP0, setAutoBindP0] = useState<boolean>(true);

  // --- Request/Execution State ---
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [lastLoginDetails, setLastLoginDetails] = useState<{
    status: number;
    ok: boolean;
    data: any;
    timestamp: string;
    payloadRaw: any;
  } | null>(null);

  const [lastCaptureDetails, setLastCaptureDetails] = useState<{
    status: number;
    ok: boolean;
    data: any;
    timestamp: string;
    payloadRaw: any;
  } | null>(null);

  // --- Log Storage State ---
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem("attendance_logs_raw");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    // Default mock logs matching the Design visual specification
    return [
      {
        id: "log_initial_1",
        type: "success",
        title: "Attendance Success",
        description: "Capturing WiFi signal at GIH_8F...",
        timestamp: "2026-03-18 10:41:02",
        responsePayload: { status: "200", message: "Success", error: "0" }
      },
      {
        id: "log_initial_2",
        type: "login",
        title: "Login Authorized",
        description: "Session initialized for device iPhone 7 Plus",
        timestamp: "2026-03-18 08:30:15",
        responsePayload: { status: "200", message: "5b94710cd969863346a4170315d49e80" }
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("attendance_logs_raw", JSON.stringify(logs));
  }, [logs]);

  // Save new log
  const addLog = (type: LogEntry["type"], title: string, description: string, reqRaw?: any, resRaw?: any) => {
    const freshLog: LogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      title,
      description,
      timestamp: formatLocalTime(new Date()),
      requestPayload: reqRaw,
      responsePayload: resRaw
    };
    setLogs(prev => [freshLog, ...prev]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  // Helper formatting for timestamps
  const formatLocalTime = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // --- Dynamic timestamp logic ---
  useEffect(() => {
    if (autoTimestamp) {
      setCustomTimestamp(formatLocalTime(currentTime));
    }
  }, [currentTime, autoTimestamp]);

  // Sync state values when custom WiFi selection changes
  const applyWifiPreset = (ssid: string, mac: string) => {
    setWifiSsid(ssid);
    setWifiMac(mac);
  };

  // State to inspect a selected log detail
  const [inspectedLog, setInspectedLog] = useState<LogEntry | null>(null);

  // Copied indicator for code snippets
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // --- API Execution Methods ---

  // 1. Post Login Flow
  const triggerLoginAPI = async () => {
    setIsLoggingIn(true);
    setLastLoginDetails(null);

    const loginPayload: LoginPayload = {
      username,
      Password: password,
      OS: osType,
      DeviceID: deviceId,
      Version: osVersion,
      LangID: langId,
      DeviceName: deviceName,
      DeviceToken: deviceToken,
      company,
      build: buildNo,
    };

    try {
      addLog("info", "Auth Request Initiated", `Sending corporate session auth credentials for ${username}...`);

      const res = await fetch("/api/proxy/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginPayload),
      });

      const result = await res.json();
      const timestampStr = formatLocalTime(new Date());

      setLastLoginDetails({
        status: res.status,
        ok: res.ok,
        data: result,
        timestamp: timestampStr,
        payloadRaw: loginPayload,
      });

      if (res.ok && result.data) {
        const responseData = result.data;
        const msgToken = responseData.message || "";
        
        addLog(
          "success", 
          "Login Authorized", 
          `Authorized. Server msg response contains token target: ${msgToken.substring(0, 12)}...`,
          loginPayload,
          responseData
        );

        if (autoBindP0 && msgToken) {
          setP0Value(msgToken);
          addLog("info", "Token Auto-Bound", `Successfully updated parameter P0 with returned message field token signature.`);
        }
      } else {
        addLog(
          "error", 
          "Login Failed", 
          `Received status ${res.status}: ${result.error || JSON.stringify(result.data)}`,
          loginPayload,
          result
        );
      }
    } catch (err: any) {
      console.error(err);
      addLog("error", "Network Disconnected", `Failed to route request: ${err.message}`, loginPayload);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 2. Post Capture Flow
  const triggerCaptureAPI = async () => {
    setIsCapturing(true);
    setLastCaptureDetails(null);

    const capturePayload: CapturePayload = {
      Stoken: stoken,
      LangID: langId,
      AppVersion: versionApp,
      OS: osType,
      company: company,
      DataHeader: {
        P0: p0Value,
        P1: p1Value,
        P2: p2Value || deviceId, // Use preset or fall back to device id
        P3: wifiMac,
        P4: customTimestamp,
        P5: wifiSsid,
        P6: "",
      }
    };

    try {
      addLog("info", "Capture Hook Sent", `Posting attendance stamp for ${username} at SSID: ${wifiSsid}...`);

      const res = await fetch("/api/proxy/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(capturePayload),
      });

      const result = await res.json();
      const timestampStr = formatLocalTime(new Date());

      setLastCaptureDetails({
        status: res.status,
        ok: res.ok,
        data: result,
        timestamp: timestampStr,
        payloadRaw: capturePayload,
      });

      if (res.ok && result.data) {
        addLog(
          "success", 
          "Attendance Registered", 
          `WIFI capture verified. Msg: ${JSON.stringify(result.data.message || result.data)}`,
          capturePayload,
          result.data
        );
      } else {
        addLog(
          "error", 
          "Capture Refused", 
          `Corporate platform refused transaction (Status ${res.status}).`,
          capturePayload,
          result
        );
      }
    } catch (err: any) {
      console.error(err);
      addLog("error", "Network Failure", `Capture failed to route: ${err.message}`, capturePayload);
    } finally {
      setIsCapturing(false);
    }
  };

  // Formatted cURL command string helpers to let users inspect & copy easily
  const loginCurlStr = `curl --location 'https://in-prod-svc-peopleapp-api.galaxy.one/sovico/api/user/login' \\
--header 'Host: in-prod-svc-peopleapp-api.galaxy.one' \\
--header 'deviceid;' \\
--header 'Connection: keep-alive' \\
--header 'version-app: ${versionApp}' \\
--header 'Accept: */*' \\
--header 'Accept-Language: vi-VN,vi;q=0.9' \\
--header 'User-Agent: People/50 CFNetwork/1335.0.3.4 Darwin/21.6.0' \\
--header 'Content-Type: application/json' \\
--data-raw '{
    "username": "${username}",
    "Password": "${password}",
    "OS": "${osType}",
    "DeviceID": "${deviceId}",
    "Version": "${osVersion}",
    "LangID": "${langId}",
    "DeviceName": "${deviceName}",
    "DeviceToken": "${deviceToken}",
    "company": "${company}",
    "build": "${buildNo}"
}';`;

  const captureCurlStr = `curl --location 'https://in-prod-svc-peopleapp-api.galaxy.one/sovico/api/ticket/attendance/wifi/capture' \\
--header 'Host: in-prod-svc-peopleapp-api.galaxy.one' \\
--header 'deviceid: ${deviceId}' \\
--header 'Connection: keep-alive' \\
--header 'Accept: */*' \\
--header 'version-app: ${versionApp}' \\
--header 'version-app-redirect: ${captureRedirectVersion}' \\
--header 'Accept-Language: vi-VN,vi;q=0.9' \\
--header 'User-Agent: People/50 CFNetwork/1335.0.3.4 Darwin/21.6.0' \\
--header 'Content-Type: application/json' \\
--data '{
    "Stoken": "${stoken}",
    "LangID": "${langId}",
    "AppVersion": "${versionApp}",
    "OS": "${osType}",
    "DataHeader": {
        "P0": "${p0Value}",
        "P1": "${p1Value}",
        "P2": "${p2Value || deviceId}",
        "P3": "${wifiMac}",
        "P4": "${customTimestamp}",
        "P5": "${wifiSsid}",
        "P6": ""
      },
    "company": "${company}"
}';`;

  return (
    <div className="bg-slate-100 min-h-screen w-full flex flex-col font-sans text-slate-800" id="main_container">
      
      {/* Dynamic Header incorporating the Professional Polish elements */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4" id="top_app_navbar">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-200">
            H
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-none tracking-tight font-display">{company}</h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Corporate Attendance Portal</p>
          </div>
        </div>

        {/* Action Bar Indicators */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-slate-700">Account: <span className="text-blue-600">{username || "Guest"}</span></p>
            <p className="text-xs text-green-600 font-medium flex items-center gap-1 justify-end">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span> 
              Active Node • Sandbox Safe
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-sky-50 border border-slate-300 flex items-center justify-center text-slate-700 font-bold">
            {(username || "KT").substring(0, 2).toUpperCase()}
          </div>
        </div>
      </nav>

      {/* Primary Layout Frame */}
      <div className="flex flex-1 flex-col lg:flex-row" id="body_layout_frame">
        
        {/* Left Sidebar control configuration */}
        <aside className="w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col p-5 space-y-6" id="dashboard_sidebar">
          
          {/* Main Selectable Navigation Tabs */}
          <div className="space-y-1">
            <button 
              onClick={() => setActiveTab("attendance")}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all font-medium text-sm ${
                activeTab === "attendance" 
                  ? "bg-blue-50 text-blue-700 shadow-sm" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Attendance Monitor</span>
            </button>

            <button 
              onClick={() => setActiveTab("profiles")}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all font-medium text-sm ${
                activeTab === "profiles" 
                  ? "bg-blue-50 text-blue-700 shadow-sm" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Device Profile Presets</span>
            </button>

            <button 
              onClick={() => setActiveTab("curl")}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all font-medium text-sm ${
                activeTab === "curl" 
                  ? "bg-blue-50 text-blue-700 shadow-sm" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Shell cURL Generator</span>
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Quick Active Config Information */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Environment Preset</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[10px] uppercase">
                {osType === "2" ? "iOS" : "Android"}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <p className="flex justify-between">
                <span className="text-slate-400">Device model:</span>
                <span className="font-semibold text-slate-700">{deviceName}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-400">App Version:</span>
                <span className="font-mono text-slate-700">{versionApp}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-400">Company Host:</span>
                <span className="font-semibold text-slate-700">{company}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-400">Build code:</span>
                <span className="font-mono">{buildNo}</span>
              </p>
            </div>
          </div>

          {/* Connected Network Status Panel */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-4 relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full transform translate-x-8 -translate-y-8" />
            <div className="flex items-center space-x-2.5 mb-2.5">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
              <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Corporate WIFI State</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-wide">{wifiSsid}</p>
              <p className="text-[10px] font-mono text-slate-400 mt-1">MAC: {wifiMac}</p>
            </div>
          </div>

          <div className="mt-auto hidden lg:block pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            <p className="font-medium">Company Portal Client v1.2</p>
            <p className="mt-0.5 font-mono">Time Sync: UTC +0</p>
          </div>
        </aside>

        {/* Central Work Space and Interaction columns */}
        <main className="flex-1 p-4 lg:p-6 grid grid-cols-1 xl:grid-cols-12 gap-6" id="dashboard_workspace">
          
          <div className="xl:col-span-8 flex flex-col space-y-6">

            {/* Simulated Live Alert Banner if P0 is extracted and bound */}
            {autoBindP0 && lastLoginDetails?.ok && lastLoginDetails?.data?.message && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>
                    <strong>P0 Handshake token initialized:</strong> Automatically synced the Login message field token <code>{lastLoginDetails.data.message.substring(0, 16)}...</code>.
                  </span>
                </div>
                <button 
                  onClick={() => setP0Value(lastLoginDetails.data.message)} 
                  className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded font-bold text-[10px] uppercase transition-colors"
                >
                  Force Apply
                </button>
              </div>
            )}

            {/* TAB 1: Attendance Operations Monitor */}
            {activeTab === "attendance" && (
              <AnimatePresence mode="wait">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  
                  {/* Step Sequence Guide banner */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex-shrink-0 flex items-center justify-center font-bold">1</div>
                      <div>
                        <p className="font-bold text-slate-800">Identify Profile</p>
                        <p className="text-slate-500 text-[11px]">Select credentials, company host (HDBANK) & OS context.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex-shrink-0 flex items-center justify-center font-bold">2</div>
                      <div>
                        <p className="font-bold text-slate-800">Session Authorized</p>
                        <p className="text-slate-500 text-[11px]">Deploy login payload to extract the dynamic message string.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex-shrink-0 flex items-center justify-center font-bold">3</div>
                      <div>
                        <p className="font-bold text-slate-800">WIFI Signature Capture</p>
                        <p className="text-slate-500 text-[11px]">Feed the message token into P0 structure to seal attendance.</p>
                      </div>
                    </div>
                  </div>

                  {/* STEP 1 & 2: LOGIN INTERFACE BOX */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <KeyRound className="w-5 h-5 text-blue-600" />
                          <span>Step 1: Session Authorization Gateway</span>
                        </h2>
                        <p className="text-xs text-slate-500">Transmit corporate login payloads via backend proxy to extract message variables.</p>
                      </div>
                      <span className="text-xs bg-slate-100 font-mono text-slate-500 px-3 py-1 rounded-full border border-slate-200">
                        POST sovico/api/user/login
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* USERNAME */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Corporate Username</label>
                        <input 
                          type="text" 
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-sm text-slate-800 font-medium"
                          placeholder="username"
                        />
                      </div>
                      
                      {/* PASSWORD */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Password Key</label>
                        <input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-sm text-slate-800 font-mono"
                          placeholder="••••••••"
                        />
                      </div>

                      {/* COMPANY */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Company Code</label>
                        <input 
                          type="text" 
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-sm text-slate-800 font-semibold text-blue-600 uppercase"
                          placeholder="HDBANK"
                        />
                      </div>
                    </div>

                    {/* Expandable Device Parameters during Login */}
                    <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 text-blue-800">
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Bound Device Hardware Simulation Parameters</span>
                        </span>
                        <span className="text-[10px] text-slate-400 italic">Pre-loaded from &quot;{selectedProfile.name}&quot;</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div>
                          <label className="block text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">OS / Code</label>
                          <select 
                            value={osType}
                            onChange={(e) => setOsType(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-2 py-1 w-full text-xs font-medium"
                          >
                            <option value="2">iOS (OS code: 2)</option>
                            <option value="1">Android (OS code: 1)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Device Name</label>
                          <input 
                            type="text"
                            value={deviceName}
                            onChange={(e) => setDeviceName(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-2 py-1 w-full text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Build Version</label>
                          <input 
                            type="text"
                            value={buildNo}
                            onChange={(e) => setBuildNo(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-2 py-1 w-full text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">App Rel Version</label>
                          <input 
                            type="text"
                            value={versionApp}
                            onChange={(e) => setVersionApp(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-2 py-1 w-full text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Unique SIM Device ID Parameter</label>
                        <input 
                          type="text"
                          value={deviceId}
                          onChange={(e) => setDeviceId(e.target.value)}
                          className="bg-white border border-slate-200 rounded-lg px-2 py-1 w-full font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="auto_bind_p0_checkbox"
                          checked={autoBindP0}
                          onChange={(e) => setAutoBindP0(e.target.checked)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                        />
                        <label htmlFor="auto_bind_p0_checkbox" className="text-xs text-slate-600 cursor-pointer">
                          Auto-extract <code>message</code> field from response & feed to <strong>P0 Attendance</strong>
                        </label>
                      </div>

                      <button 
                        onClick={triggerLoginAPI}
                        disabled={isLoggingIn}
                        className={`py-3.5 px-6 rounded-2xl text-white font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 ${
                          isLoggingIn 
                            ? "bg-slate-400 cursor-not-allowed" 
                            : "bg-blue-600 hover:bg-blue-700 shadow-blue-100 hover:shadow-lg hover:shadow-blue-200"
                        }`}
                      >
                        {isLoggingIn ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Verifying Credentials Platform...</span>
                          </>
                        ) : (
                          <>
                            <Building2 className="w-4 h-4" />
                            <span>Transmit Authen Session Login</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Display Last Login Reply Payload inline */}
                    {lastLoginDetails && (
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 animate-fadeIn">
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Login Platform Reply Panel</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            lastLoginDetails.ok 
                              ? "bg-emerald-100 text-emerald-800" 
                              : "bg-rose-100 text-rose-800"
                          }`}>
                            HTTP {lastLoginDetails.status} • {lastLoginDetails.ok ? "Success" : "Denied"}
                          </span>
                        </div>
                        <div className="text-xs grid grid-cols-1 md:grid-cols-12 gap-3 font-mono">
                          <div className="md:col-span-5 bg-slate-900 text-slate-300 p-3 rounded-xl overflow-x-auto space-y-1 max-h-48">
                            <p className="text-blue-400 text-[10px] uppercase font-bold mb-1">// Sent Credentials Payload</p>
                            <pre className="text-[10px]">{JSON.stringify(lastLoginDetails.payloadRaw, null, 2)}</pre>
                          </div>
                          <div className="md:col-span-7 bg-slate-950 text-white p-3 rounded-xl overflow-x-auto max-h-48">
                            <div className="flex justify-between text-slate-400 text-[10px] uppercase font-bold mb-1">
                              <span>// Returned Server JSON</span>
                              <button 
                                onClick={() => handleCopy(JSON.stringify(lastLoginDetails.data), "res_login")}
                                className="hover:text-white flex items-center gap-0.5"
                              >
                                {copiedText === "res_login" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                Copy
                              </button>
                            </div>
                            <pre className="text-[10px] text-emerald-400">{JSON.stringify(lastLoginDetails.data, null, 2)}</pre>
                          </div>
                        </div>
                        {lastLoginDetails.ok && lastLoginDetails.data?.message && (
                          <div className="mt-2.5 p-2 bg-blue-50 border border-blue-200 rounded-xl text-xs flex items-center justify-between text-blue-900">
                            <div>
                              <span>🎯 Extracted Key Message: </span>
                              <strong className="font-mono text-blue-700 font-bold ml-1">{lastLoginDetails.data.message}</strong>
                            </div>
                            <span className="text-[10px] bg-blue-600 text-white rounded px-1.5 py-0.5 tracking-wider font-bold">P0 SYNC</span>
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                  {/* STEP 3: WIFI CAPTURE ATTENDANCE CARD */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <Wifi className="w-5 h-5 text-emerald-600" />
                          <span>Step 2: Sign Corporate Attendance Capture</span>
                        </h2>
                        <p className="text-xs text-slate-500">Inject parameters and post WiFi tracking credentials to register your shift stamp.</p>
                      </div>
                      <span className="text-xs bg-slate-100 font-mono text-slate-500 px-3 py-1 rounded-full border border-slate-200">
                        POST sovico/api/ticket/attendance/wifi/capture
                      </span>
                    </div>

                    {/* Pre-fill WiFi Signals toolbar */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Local Office Wifi Hotspot</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {DEFAULT_WIFI_PRESETS.map((wifi) => (
                          <button
                            key={wifi.ssid}
                            type="button"
                            onClick={() => applyWifiPreset(wifi.ssid, wifi.mac)}
                            className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-start ${
                              wifiSsid === wifi.ssid 
                                ? "bg-emerald-50 border-emerald-400 text-emerald-900 ring-1 ring-emerald-400 font-semibold" 
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <span className="truncate">{wifi.ssid}</span>
                            <span className="text-[9px] font-mono opacity-65 tracking-tighter">{wifi.mac}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Main Capture Parameters Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {/* P0 (Dynamic Token from Login) */}
                      <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">P0 Token Parameter (From Login Message)</label>
                          {lastLoginDetails?.data?.message && (
                            <button
                              type="button"
                              onClick={() => setP0Value(lastLoginDetails.data.message)}
                              className="text-[9px] text-blue-600 hover:underline font-bold flex items-center"
                            >
                              Reset to session message token
                            </button>
                          )}
                        </div>
                        <input 
                          type="text" 
                          value={p0Value}
                          onChange={(e) => setP0Value(e.target.value)}
                          className="w-full bg-emerald-50/50 border border-emerald-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2 text-sm text-emerald-950 font-mono"
                          placeholder="e.g. 5b94710cd969863346a4170315d49e80"
                        />
                      </div>

                      {/* Stoken */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">SToken</label>
                        <input 
                          type="text" 
                          value={stoken}
                          onChange={(e) => setStoken(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-sm text-slate-800 font-mono text-center"
                          placeholder="Stoken"
                        />
                      </div>

                      {/* WiFi SSID Custom Field */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">WiFi SSID (P5)</label>
                        <input 
                          type="text" 
                          value={wifiSsid}
                          onChange={(e) => setWifiSsid(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-sm text-slate-800 font-medium"
                          placeholder="GIH_8F"
                        />
                      </div>

                      {/* WiFi MAC Address Custom Input (P3) */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">WiFi MAC Address (P3)</label>
                        <input 
                          type="text" 
                          value={wifiMac}
                          onChange={(e) => setWifiMac(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-sm text-slate-800 font-mono"
                          placeholder="00:00:00:00:00:00"
                        />
                      </div>

                      {/* Redirect version */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Redirect version (Header)</label>
                        <input 
                          type="text" 
                          value={captureRedirectVersion}
                          onChange={(e) => setCaptureRedirectVersion(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-sm text-slate-800 font-mono text-center"
                          placeholder="2.8"
                        />
                      </div>

                      {/* Captured Timestamp (P4) with Toggle */}
                      <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Clock Timestamp (P4)</label>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-500">Live Clock Sync:</span>
                            <button
                              type="button"
                              onClick={() => setAutoTimestamp(!autoTimestamp)}
                              className={`w-11 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                                autoTimestamp ? "bg-emerald-500" : "bg-slate-300"
                              }`}
                            >
                              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                autoTimestamp ? "translate-x-6" : "translate-x-0"
                              }`} />
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                            <input 
                              type="text" 
                              value={customTimestamp}
                              disabled={autoTimestamp}
                              onChange={(e) => setCustomTimestamp(e.target.value)}
                              className={`w-full border rounded-xl pl-10 pr-3.5 py-2 text-sm font-mono tracking-tight ${
                                autoTimestamp 
                                  ? "bg-slate-100 border-slate-200 text-slate-500" 
                                  : "bg-white border-slate-300 text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              }`}
                              placeholder="2026-03-18 18:32:05"
                            />
                          </div>
                        </div>
                      </div>

                      {/* P1 State (Clock Mode code) */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Clock Mode (P1)</label>
                        <select 
                          value={p1Value}
                          onChange={(e) => setP1Value(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-sm text-slate-800 font-semibold"
                        >
                          <option value="i">Inbound (In: &apos;i&apos;)</option>
                          <option value="o">Outbound (Out: &apos;o&apos;)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="text-xs text-slate-500">
                        <span>Associated device: </span>
                        <strong className="text-slate-700 font-mono font-medium">{deviceName}</strong>
                      </div>

                      <div className="flex gap-3 w-full sm:w-auto">
                        <button 
                          onClick={() => {
                            setP1Value("i");
                            triggerCaptureAPI();
                          }}
                          disabled={isCapturing}
                          className={`flex-1 sm:flex-none py-3.5 px-8 rounded-2xl text-white font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 ${
                            isCapturing 
                              ? "bg-slate-400 cursor-not-allowed" 
                              : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100 hover:shadow-lg hover:shadow-emerald-200"
                          }`}
                        >
                          {isCapturing && p1Value === "i" ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          <span>Record Clock In</span>
                        </button>

                        <button 
                          onClick={() => {
                            setP1Value("o");
                            triggerCaptureAPI();
                          }}
                          disabled={isCapturing}
                          className={`flex-1 sm:flex-none py-3.5 px-8 rounded-2xl border-2 border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50 transition-all text-sm flex items-center justify-center gap-2`}
                        >
                          {isCapturing && p1Value === "o" ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-slate-400" />
                          )}
                          <span>Record Clock Out</span>
                        </button>
                      </div>
                    </div>

                    {/* Display Last Capture Response */}
                    {lastCaptureDetails && (
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 animate-fadeIn">
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">// Attendance Signal Reply Logs</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            lastCaptureDetails.ok 
                              ? "bg-green-100 text-green-800" 
                              : "bg-rose-100 text-rose-800"
                          }`}>
                            HTTP {lastCaptureDetails.status} • {lastCaptureDetails.ok ? "Success" : "Failed"}
                          </span>
                        </div>
                        <div className="text-xs grid grid-cols-1 md:grid-cols-12 gap-3 font-mono">
                          <div className="md:col-span-5 bg-slate-900 text-slate-300 p-3 rounded-xl overflow-x-auto max-h-48">
                            <p className="text-emerald-400 text-[10px] uppercase font-bold mb-1">// Outgoing Payload Structure</p>
                            <pre className="text-[10px]">{JSON.stringify(lastCaptureDetails.payloadRaw, null, 2)}</pre>
                          </div>
                          <div className="md:col-span-7 bg-slate-950 text-white p-3 rounded-xl overflow-x-auto max-h-48">
                            <div className="flex justify-between text-slate-400 text-[10px] uppercase font-bold mb-1">
                              <span>// Returned Server JSON Response</span>
                              <button 
                                onClick={() => handleCopy(JSON.stringify(lastCaptureDetails.data), "res_capture")}
                                className="hover:text-white flex items-center gap-0.5"
                              >
                                {copiedText === "res_capture" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                Copy
                              </button>
                            </div>
                            <pre className="text-[10px] text-emerald-400">{JSON.stringify(lastCaptureDetails.data, null, 2)}</pre>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                </motion.div>
              </AnimatePresence>
            )}

            {/* TAB 2: Device Profiles Presets */}
            {activeTab === "profiles" && (
              <AnimatePresence mode="wait">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6"
                >
                  <div>
                    <h2 className="text-[17px] font-bold text-slate-950 flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                      <span>Corporate Mobile Device Emulator Config Profiles</span>
                    </h2>
                    <p className="text-xs text-slate-500">Corporate servers validate specific physical parameters. Select any profile below to quickly populate values suited for HDBANK API queries.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {DEFAULT_PROFILES.map((profile) => (
                      <div 
                        key={profile.id}
                        role="button"
                        onClick={() => applyProfile(profile)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                          selectedProfile.id === profile.id 
                            ? "border-blue-600 bg-blue-50/50 shadow-sm" 
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2.5">
                          <span className="font-bold text-sm text-slate-900 block truncate">{profile.name}</span>
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] uppercase tracking-wide font-mono">OS: {profile.OS}</span>
                        </div>
                        <div className="space-y-1 text-[11px] text-slate-500 font-mono">
                          <p className="truncate"><strong className="text-slate-400">ID:</strong> {profile.DeviceID}</p>
                          <p><strong className="text-slate-400">V:</strong> {profile.Version}</p>
                          <p><strong className="text-slate-400">Build:</strong> {profile.build}</p>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <span className={`text-[10px] font-bold uppercase ${
                            selectedProfile.id === profile.id ? "text-blue-700" : "text-slate-400"
                          }`}>
                            {selectedProfile.id === profile.id ? "Active Selected Profile ✓" : "Activate"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Manual Editor Profile Panel */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                      <Settings className="w-4 h-4" />
                      <span>Fine-Tune Active Simulated Device Attributes Directly</span>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Simulated Device Name</label>
                        <input 
                          type="text" 
                          value={deviceName}
                          onChange={(e) => setDeviceName(e.target.value)}
                          className="bg-white border border-slate-200 rounded-lg px-3 py-2 w-full font-mono text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">OS System Version Label</label>
                        <input 
                          type="text" 
                          value={osVersion}
                          onChange={(e) => setOsVersion(e.target.value)}
                          className="bg-white border border-slate-200 rounded-lg px-3 py-2 w-full font-mono text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-slate-400 mb-1">Detailed Simulated Device ID (DeviceID Header & P2 payload attribute)</label>
                        <input 
                          type="text" 
                          value={deviceId}
                          onChange={(e) => setDeviceId(e.target.value)}
                          className="bg-white border border-slate-200 rounded-lg px-3 py-2 w-full font-mono text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-slate-400 mb-1">Corporate App Firebase Cloud Token (DeviceToken)</label>
                        <textarea 
                          rows={2}
                          value={deviceToken}
                          onChange={(e) => setDeviceToken(e.target.value)}
                          className="bg-white border border-slate-200 rounded-lg px-3 py-2 w-full font-mono text-[10px] focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2">
                      <span className="text-slate-500">Device profiles allow replicating strict app tracking constraints safely.</span>
                      <button 
                        type="button"
                        onClick={() => applyProfile(DEFAULT_PROFILES[0])}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Reset to default setup profile
                      </button>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            )}

            {/* TAB 3: Shell cURL Generators */}
            {activeTab === "curl" && (
              <AnimatePresence mode="wait">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6"
                >
                  <div>
                    <h2 className="text-[17px] font-bold text-slate-950 flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-indigo-600" />
                      <span>Unix Shell cURL Terminal Simulation Outputs</span>
                    </h2>
                    <p className="text-xs text-slate-500">Copy the exact parsed curl commands below to execute check-ins natively from standard Mac and Linux terminal prompts.</p>
                  </div>

                  {/* 1. Login cURL Box */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-slate-100 px-4 py-2.5 rounded-t-xl border border-slate-200">
                      <span className="text-xs font-bold text-slate-700 font-mono">// 1. Corporate Auth Login API</span>
                      <button 
                        onClick={() => handleCopy(loginCurlStr, "curl_login")}
                        className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1.5"
                      >
                        {copiedText === "curl_login" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600">Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Command</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-slate-900 rounded-b-xl p-4 overflow-x-auto border-x border-b border-slate-950 shadow-inner">
                      <pre className="text-[11px] text-indigo-400 font-mono select-all leading-relaxed">{loginCurlStr}</pre>
                    </div>
                  </div>

                  {/* 2. Capture API cURL Box */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-slate-100 px-4 py-2.5 rounded-t-xl border border-slate-200">
                      <span className="text-xs font-bold text-slate-700 font-mono">// 2. Capture WiFi Attendance API</span>
                      <button 
                        onClick={() => handleCopy(captureCurlStr, "curl_capture")}
                        className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1.5"
                      >
                        {copiedText === "curl_capture" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600">Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Command</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-slate-900 rounded-b-xl p-4 overflow-x-auto border-x border-b border-indigo-950 shadow-inner">
                      <pre className="text-[11px] text-emerald-400 font-mono select-all leading-relaxed">{captureCurlStr}</pre>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex gap-2">
                    <span className="font-bold">Important Node:</span>
                    <span>Corporate gateways restrict check-ins from outside authorized WiFi subnets. Ensure you are physically connected in range of corporate WiFi MAC routing nodes for accurate API acceptance!</span>
                  </div>

                </motion.div>
              </AnimatePresence>
            )}

          </div>

          {/* Right Column: Recent activity log sidebar */}
          <div className="xl:col-span-4" id="recent_logs_panel">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col h-full space-y-4">
              
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-blue-600" />
                  <span>Interactive Recent Logs</span>
                </h3>
                {logs.length > 0 && (
                  <button 
                    onClick={clearLogs}
                    className="text-[10px] text-slate-400 hover:text-rose-500 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear logs</span>
                  </button>
                )}
              </div>

              {logs.length === 0 ? (
                <div className="flex-1 flex flex-col justify-center items-center p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                  <Clock className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-700">No logs generated yet</p>
                  <p className="text-[11px] text-slate-400 mt-1">Simulate corporate auth or clock actions to inspect dynamic client logs live.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                  {logs.map((log) => (
                    <div 
                      key={log.id} 
                      onClick={() => setInspectedLog(log)}
                      className={`flex items-start space-x-3 p-3 rounded-xl transition-all cursor-pointer border ${
                        inspectedLog?.id === log.id 
                          ? "bg-slate-100 border-slate-300 shadow-inner" 
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100/55"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs mt-0.5 ${
                        log.type === "success" 
                          ? "bg-emerald-100 text-emerald-800" 
                          : log.type === "error" 
                          ? "bg-rose-100 text-rose-800" 
                          : log.type === "login"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-indigo-100 text-indigo-800"
                      }`}>
                        {log.type === "success" ? "✓" : log.type === "error" ? "✕" : "⌥"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-xs font-bold text-slate-950 truncate leading-none mb-1">{log.title}</p>
                          <span className="text-[9px] font-mono text-slate-400 select-none whitespace-nowrap ml-1">{log.timestamp.split(" ")[1]}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-tight">{log.description}</p>
                        <span className="text-[9px] font-mono text-blue-600 hover:underline inline-block mt-1 font-medium whitespace-nowrap">
                          {log.requestPayload || log.responsePayload ? "Inspect raw payloads ⇿" : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-slate-900 rounded-2xl p-4 text-slate-300 font-mono text-[10px] space-y-2 mt-auto">
                <p className="text-blue-400 font-bold uppercase tracking-wide flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-blue-500" />
                  <span>Active Payload P0 Binding</span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block">Stoken:</span>
                    <span className="text-white font-bold block truncate">{stoken || "none"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Bound P0:</span>
                    <span className={`font-bold block truncate ${p0Value ? "text-emerald-400" : "text-amber-500"}`}>
                      {p0Value ? `${p0Value.substring(0, 10)}...` : "not bound"}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>

      {/* INSPECT LOGS OVERLAY MODAL */}
      <AnimatePresence>
        {inspectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full flex flex-col overflow-hidden max-h-[85vh]"
            >
              <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
                <div className="flex items-center space-x-2.5">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    inspectedLog.type === "success" 
                      ? "bg-emerald-500 text-white" 
                      : inspectedLog.type === "error" 
                      ? "bg-rose-500 text-white" 
                      : "bg-blue-600 text-white"
                  }`}>
                    {inspectedLog.type === "success" ? "✓" : inspectedLog.type === "error" ? "✕" : "i"}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{inspectedLog.title}</h4>
                    <p className="text-xs text-slate-400">{inspectedLog.timestamp}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setInspectedLog(null)}
                  className="text-xs text-slate-400 hover:text-white font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Close Panel
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5">
                <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium leading-relaxed">
                  {inspectedLog.description}
                </p>

                {inspectedLog.requestPayload && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">// Request Payload Tracing</span>
                      <button 
                        onClick={() => handleCopy(JSON.stringify(inspectedLog.requestPayload, null, 2), "modal_req")}
                        className="text-xs text-blue-600 hover:underline flex items-center gap-0.5"
                      >
                        {copiedText === "modal_req" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        Copy request payload
                      </button>
                    </div>
                    <pre className="bg-slate-950 text-indigo-300 p-4 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed max-h-56">
                      {JSON.stringify(inspectedLog.requestPayload, null, 2)}
                    </pre>
                  </div>
                )}

                {inspectedLog.responsePayload ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">// Captured Server JSON Reply</span>
                      <button 
                        onClick={() => handleCopy(JSON.stringify(inspectedLog.responsePayload, null, 2), "modal_res")}
                        className="text-xs text-blue-600 hover:underline flex items-center gap-0.5"
                      >
                        {copiedText === "modal_res" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        Copy response payload
                      </button>
                    </div>
                    <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed max-h-56">
                      {JSON.stringify(inspectedLog.responsePayload, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 text-slate-400 text-xs text-center rounded-xl font-mono">
                    // No server body payload recorded for this message
                  </div>
                )}
              </div>

              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setInspectedLog(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-blue-100 transition-all"
                >
                  OK, Close Inspect Panel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
