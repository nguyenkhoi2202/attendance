import { useState, useEffect } from "react";
import { LoginRequestData, AttendancePayload, LogEntry } from "./types";
import { AndroidMock } from "./components/AndroidMock";
import { LogsPanel } from "./components/LogsPanel";
import { 
  Building2, 
  HelpCircle, 
  Wifi, 
  ShieldCheck, 
  Info,
  RefreshCw,
  Clock,
  CheckCircle2,
  Terminal,
  Activity,
  LogOut,
  Sliders,
  Sparkles,
  UserCheck
} from "lucide-react";

export default function App() {
  // Account login settings mock data
  const [loginData, setLoginData] = useState<LoginRequestData>({
    username: "khoitn1",
    Password: "",
    OS: "2",
    DeviceID: "iPhone 7 Plus_Apple_iPhone9,4_15.8.5_414x736_1777944534648_5631520931",
    Version: "15.8.5",
    LangID: "VN",
    DeviceName: "iPhone 7 Plus",
    DeviceToken: "f-tBlHZQQUeZu3rcVl2RCA:APA91bEj29H6q00n2QpW1p7K2Avo3-FXhlXFa6j-Rf0oGyuVnZEje9FXpNr9ljAL_QoxDMSY0NpbvjtKX0itRqWxwdiLzD6BBG57ZzVUX_0yyW8SHxqhQuw",
    company: "HDBANK",
    build: "10"
  });

  // Received active token state 
  const [stoken, setStoken] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Attendance layout payload coordinates state
  const [attendancePayload, setAttendancePayload] = useState<AttendancePayload>({
    Stoken: "",
    LangID: "VN",
    AppVersion: "PNJ_20210105_V1",
    OS: "2",
    DataHeader: {
      P0: "5b94710cd969863346a4170315d49e80",
      P1: "o",
      P2: "BBD9614B-4DA3-4567-A348-86CCA865001F",
      P3: "9a:2a:6f:a4:8f:49",
      P4: "2026-05-22 09:02:44",
      P5: "GIH_8F",
      P6: ""
    },
    company: "HDBANK"
  });

  // Server logger database proxy list
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVercelOrStaticMode, setIsVercelOrStaticMode] = useState<boolean>(false);

  // Load logs from browser local storage as a fallback
  const loadLocalLogs = () => {
    try {
      const stored = localStorage.getItem("attendance_pro_logs");
      if (stored) {
        setLogs(JSON.parse(stored));
      } else {
        setLogs([]);
      }
    } catch (e) {
      console.error("Failed to read local storage logs", e);
    }
  };

  // Append logs to browser local storage
  const addLocalLog = (
    type: "LOGIN" | "ATTENDANCE",
    direction: "SENT" | "RECEIVED",
    url: string,
    headers: Record<string, string>,
    body: any,
    status?: number
  ) => {
    try {
      const newEntry: LogEntry = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        type,
        direction,
        url,
        headers,
        body,
        status
      };

      const stored = localStorage.getItem("attendance_pro_logs");
      let currentLogs: LogEntry[] = [];
      if (stored) {
        try {
          currentLogs = JSON.parse(stored);
        } catch (e) {
          currentLogs = [];
        }
      }
      currentLogs.unshift(newEntry);
      if (currentLogs.length > 50) {
        currentLogs.pop();
      }
      localStorage.setItem("attendance_pro_logs", JSON.stringify(currentLogs));
      setLogs(currentLogs);
    } catch (e) {
      console.error("Failed to write offline log entry", e);
    }
  };

  // Live beautifully formatted real-time states
  const [liveTime, setLiveTime] = useState<string>("09:02:44");
  const [liveDate, setLiveDate] = useState<string>("Friday, May 22, 2026");

  // Keep live dynamic timestamps with correct formatting for clock and parameters
  useEffect(() => {
    const clockUpdater = () => {
      const now = new Date();
      
      // Live dynamic time ticker
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setLiveTime(`${hours}:${minutes}:${seconds}`);
      
      // Beautiful locale day ticker
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      setLiveDate(now.toLocaleDateString("en-US", options));

      // Synchronize in the payload's P4 format for the real REST payload tracking
      const year = now.getFullYear();
      const monthStr = String(now.getMonth() + 1).padStart(2, "0");
      const dayStr = String(now.getDate()).padStart(2, "0");
      const formattedTimestamp = `${year}-${monthStr}-${dayStr} ${hours}:${minutes}:${seconds}`;

      setAttendancePayload((prev) => ({
        ...prev,
        DataHeader: {
          ...prev.DataHeader,
          P4: formattedTimestamp
        }
      }));
    };

    clockUpdater();
    const intervalId = setInterval(clockUpdater, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Fetch updated proxy traffic logs from standard API
  const fetchLogs = async () => {
    try {
      const resp = await fetch("/api/logs");
      if (resp.ok) {
        const contentType = resp.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await resp.json();
          if (Array.isArray(data)) {
            setLogs(data);
            setIsVercelOrStaticMode(false);
            return;
          }
        }
      }
      // If endpoint returns non-JSON (like Vercel index.html fallback or 404), activate Vercel static fallback
      setIsVercelOrStaticMode(true);
      loadLocalLogs();
    } catch (e) {
      console.warn("Retrying logs gateway stream -> falling back to local logs...", e);
      setIsVercelOrStaticMode(true);
      loadLocalLogs();
    }
  };

  useEffect(() => {
    fetchLogs();
    const intervalLogs = setInterval(fetchLogs, 4000);
    return () => clearInterval(intervalLogs);
  }, []);

  // Clear proxy history list
  const handleClearLogs = async () => {
    try {
      if (isVercelOrStaticMode) {
        localStorage.removeItem("attendance_pro_logs");
        setLogs([]);
      } else {
        const resp = await fetch("/api/logs/clear", { method: "POST" });
        if (resp.ok) {
          setLogs([]);
        } else {
          localStorage.removeItem("attendance_pro_logs");
          setLogs([]);
        }
      }
    } catch (e) {
      console.error(e);
      localStorage.removeItem("attendance_pro_logs");
      setLogs([]);
    }
  };

  // Perform Account Authentication Proxy Request
  const triggerLogin = async () => {
    setIsLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const requestHeaders = {
      "Content-Type": "application/json",
      "deviceid": loginData.DeviceID
    };

    // Log the initiation of request
    if (isVercelOrStaticMode) {
      addLocalLog("LOGIN", "SENT", "/api/proxy/login", requestHeaders, loginData);
    }

    try {
      const resp = await fetch("/api/proxy/login", {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(loginData)
      });

      const respText = await resp.text();
      let data: any = null;
      let validJson = true;
      try {
        data = JSON.parse(respText);
      } catch (e) {
        validJson = false;
      }

      if (isVercelOrStaticMode) {
        addLocalLog(
          "LOGIN",
          "RECEIVED",
          "/api/proxy/login",
          {},
          validJson ? data : { rawResponse: respText.substring(0, 300) },
          resp.status
        );
      } else {
        await fetchLogs();
      }

      if (!validJson) {
        const errorDetail = respText.substring(0, 80);
        setErrorMsg(
          `Router returned a non-JSON page (Possible 404 or index HTML fallback). Raw text starts with: "${errorDetail}...". Please make sure your deploy uses the included vercel.json rewrites or check the backend server status.`
        );
        return;
      }

      if (resp.ok) {
        let parsedToken = "";
        if (data && data.message) {
          parsedToken = data.message;
        } else if (data && data.data && data.data.Stoken) {
          parsedToken = data.data.Stoken;
        } else if (data && data.Stoken) {
          parsedToken = data.Stoken;
        } else {
          parsedToken = "4425a3f376cb4add8a2dfc12b38b1174";
        }

        setStoken(parsedToken);
        setIsLoggedIn(true);
        setSuccessMsg(`Session logged in! Acquired authorization Stoken: "${parsedToken}"`);
      } else {
        setErrorMsg(data.error || `Authentication request returned status ${resp.status}`);
      }
    } catch (err: any) {
      setErrorMsg(`Gateway error: ${err.message || "Failed to make connection"}`);
      if (isVercelOrStaticMode) {
        addLocalLog("LOGIN", "RECEIVED", "/api/proxy/login", {}, { error: err.message }, 500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Terminate local session tokens
  const handleLogout = () => {
    setStoken("");
    setIsLoggedIn(false);
    setSuccessMsg("Corporate session cleared.");
  };

  // Capture attendance protocol via proxy (i = checkin, o = checkout)
  const triggerAttendance = async (direction: "i" | "o") => {
    setIsLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const activePayload: AttendancePayload = {
      ...attendancePayload,
      Stoken: stoken || "4425a3f376cb4add8a2dfc12b38b1174",
      DataHeader: {
        ...attendancePayload.DataHeader,
        P1: direction
      }
    };

    const requestHeaders = {
      "Content-Type": "application/json",
      "deviceid": loginData.DeviceID
    };

    if (isVercelOrStaticMode) {
      addLocalLog("ATTENDANCE", "SENT", "/api/proxy/capture", requestHeaders, activePayload);
    }

    try {
      const resp = await fetch("/api/proxy/capture", {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(activePayload)
      });

      const respText = await resp.text();
      let data: any = null;
      let validJson = true;
      try {
        data = JSON.parse(respText);
      } catch (e) {
        validJson = false;
      }

      if (isVercelOrStaticMode) {
        addLocalLog(
          "ATTENDANCE",
          "RECEIVED",
          "/api/proxy/capture",
          {},
          validJson ? data : { rawResponse: respText.substring(0, 300) },
          resp.status
        );
      } else {
        await fetchLogs();
      }

      if (!validJson) {
        const errorDetail = respText.substring(0, 80);
        setErrorMsg(
          `Router returned a non-JSON page (Possible 404 or index HTML fallback). Raw text starts with: "${errorDetail}...". Please make sure your deploy uses the included vercel.json rewrites or check the backend server status.`
        );
        return;
      }

      if (resp.ok) {
        const directionLabel = direction === "i" ? "Check-In" : "Check-Out";
        setSuccessMsg(`Registered attendance event: ${directionLabel}! Status returned: ${data.message || data.status || "SUCCESS"}`);
      } else {
        setErrorMsg(data.error || `Attendance event rejected. Status: ${resp.status}`);
      }
    } catch (err: any) {
      setErrorMsg(`Network timeout: ${err.message || "Endpoint not reachable"}`);
      if (isVercelOrStaticMode) {
        addLocalLog("ATTENDANCE", "RECEIVED", "/api/proxy/capture", {}, { error: err.message }, 500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Context updates for data headers
  const handleUpdateHeader = (updates: Partial<AttendancePayload["DataHeader"]>) => {
    setAttendancePayload((prev) => ({
      ...prev,
      DataHeader: {
        ...prev.DataHeader,
        ...updates
      }
    }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col justify-between overflow-x-hidden p-4 md:p-8 selection:bg-teal-200">
      
      {/* Bento Layout Master Frame Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg border-2 border-white">
            H
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">Attendance Pro</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold font-sans">Corporate Portal System</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 bg-white p-2 pr-6 rounded-full border border-slate-200/80 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 border-2 border-white shadow-sm font-mono text-sm uppercase">
            {loginData.username.substring(0, 2)}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-700">{loginData.username}@hdbank.com.vn</span>
            <span className="text-[9.5px] text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              {isLoggedIn ? "Session Active" : "Guest Simulator Session"}
            </span>
          </div>
        </div>
      </header>

      {/* Bento Grid layout workspace */}
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
        
        {/* Core Tile 1 - Visual Android Native Device Mockup (span-4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Link</span>
              <h2 className="text-sm font-black text-slate-700">Mobile Terminal Sandbox</h2>
            </div>
            <div className="px-2 py-0.5 rounded-full text-[9px] bg-slate-100 border border-slate-200 text-slate-500 font-bold">
              PORT 3000
            </div>
          </div>

          {/* Interactive Mobile Container */}
          <div className="flex justify-center items-center bg-slate-50 border border-slate-100/80 rounded-2xl p-4 shadow-inner">
            <AndroidMock
              loginData={loginData}
              setLoginData={setLoginData}
              stoken={stoken}
              isLoggedIn={isLoggedIn}
              onLogin={triggerLogin}
              onLogout={handleLogout}
              attendancePayload={attendancePayload}
              onUpdateAttendance={handleUpdateHeader}
              onTriggerAttendance={triggerAttendance}
              isLoading={isLoading}
              successMessage={successMsg}
              errorMessage={errorMsg}
            />
          </div>

          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/40 text-[10.5px] leading-relaxed text-amber-800 font-sans flex items-start gap-1.5 matches">
            <Info size={14} className="text-amber-600 mt-0.5 shrink-0" />
            <span>
              All HTTP requests on the phone frame are proxied local to our server, bypassing CORS blockades. Live authorization headers are attached.
            </span>
          </div>
        </div>

        {/* Bento Board Grid Section (span-8) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-6 lg:grid-cols-8 gap-6">

          {/* Bento Block 2 - Dynamic Big Clock Card (span-5) */}
          <div className="md:col-span-4 lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all hover:border-slate-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
            
            <div>
              <div className="inline-flex items-center px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold mb-5 uppercase tracking-wider">
                Current Connected Server Clock
              </div>
              
              {/* Responsive Elegant Clock display rendering */}
              <div className="text-5xl md:text-6xl font-extralight text-slate-800 tracking-tighter tabular-nums leading-none">
                {liveTime}
              </div>
              <div className="text-sm text-slate-400 mt-2 font-medium">
                {liveDate}
              </div>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-1">Corporate WIFI SSID</p>
                  <p className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    <Wifi size={13} className="text-emerald-500" />
                    {attendancePayload.DataHeader.P5 || "GIH_8F"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-1">Connection State</p>
                  <p className="text-xs font-mono text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded inline-block">
                    {attendancePayload.DataHeader.P3 || "9a:2a:6f:a4:8f:49"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Block 3 - Interactive REST Check-In Action Cell (span-3) */}
          <button
            onClick={() => triggerAttendance("i")}
            disabled={isLoading}
            className="md:col-span-2 lg:col-span-3 bg-emerald-500 rounded-3xl p-6 flex flex-col items-center justify-center text-white cursor-pointer hover:bg-emerald-600 active:scale-95 duration-150 shadow-md hover:shadow-lg hover:shadow-emerald-200/50 disabled:opacity-50 select-none text-center outline-none relative group"
          >
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 transform group-hover:scale-110 duration-200 shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight leading-none mb-1">Check In</span>
            <span className="text-emerald-100/80 text-[10px] uppercase font-bold tracking-widest font-mono">Status: P1["i"]</span>
          </button>

          {/* Bento Block 4 - Interactive REST Check-Out Action Cell (span-3) */}
          <button
            onClick={() => triggerAttendance("o")}
            disabled={isLoading}
            className="md:col-span-2 lg:col-span-3 bg-rose-500 rounded-3xl p-6 flex flex-col items-center justify-center text-white cursor-pointer hover:bg-rose-600 active:scale-95 duration-150 shadow-md hover:shadow-lg hover:shadow-rose-200/50 disabled:opacity-50 select-none text-center outline-none relative group"
          >
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 transform group-hover:scale-110 duration-200 shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight leading-none mb-1">Check Out</span>
            <span className="text-rose-100/80 text-[10px] uppercase font-bold tracking-widest font-mono">Status: P1["o"]</span>
          </button>

          {/* Bento Block 5 - Live System Parameters Data (span-5) */}
          <div className="md:col-span-4 lg:col-span-5 bg-slate-900 rounded-3xl p-6 flex flex-col justify-between text-white shadow-sm border border-slate-800 transition-all hover:border-slate-700">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Sliders size={12} className="text-teal-400" />
                  Active System Parameters
                </h3>
                <span className="text-[9px] text-[#f8fafc]/40 font-mono">HD_2026</span>
              </div>
              
              <div className="space-y-3 font-sans text-xs">
                <div className="flex justify-between items-center bg-slate-950/40 p-2 rounded-xl border border-slate-800/40">
                  <span className="text-slate-400 font-medium">Device Identifier</span>
                  <span className="font-mono text-[11px] text-teal-300 max-w-[200px] truncate" title={loginData.DeviceID}>
                    {loginData.DeviceID}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-slate-950/40 p-2 rounded-xl border border-slate-800/40">
                  <span className="text-slate-400 font-medium">Authentication Token</span>
                  <span className="font-mono text-[11.5px] text-emerald-400 uppercase tracking-wider max-w-[200px] truncate font-bold" title={stoken || "Bypassed Token Preset"}>
                    {stoken || "4425a3f376cb4add8a2dfc12b38b1174"}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-slate-950/40 p-2 rounded-xl border border-slate-800/40">
                  <span className="text-slate-400 font-medium">BSSID Target Address</span>
                  <span className="font-mono text-[11px] text-slate-300">
                    {attendancePayload.DataHeader.P3 || "9a:2a:6f:a4:8f:49"}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-3.5 mt-5 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Sparkles size={11} className="text-amber-400 animate-spin" />
                Active Redirect Version: PNJ_20210105_V1
              </span>
              <span className="font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                OS: Android (2)
              </span>
            </div>
          </div>

          {/* Bento Block 6 - Full Width Interactive Logs Monitor (span-8) */}
          <div className="md:col-span-6 lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col min-h-[420px]">
            <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-slate-600" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-700 uppercase">Live REST Gateway Proxy Monitor</h3>
                    {isVercelOrStaticMode && (
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-100 border border-amber-200/60 px-2 py-0.5 rounded animate-pulse">
                        Vercel/Static Offline Logging Fallback Active
                      </span>
                    )}
                  </div>
                  <p className="text-[9.5px] text-slate-400">Secure real-time network request verification against company endpoints</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchLogs}
                  className="p-1.5 text-slate-500 hover:text-emerald-500 rounded bg-white border border-slate-200 shadow-sm transition-all focus:outline-none"
                  title="Force refresh database logs"
                >
                  <RefreshCw size={12} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 bg-slate-950 min-h-0">
              <LogsPanel 
                logs={logs} 
                onRefresh={fetchLogs} 
                onClear={handleClearLogs} 
              />
            </div>
          </div>

        </div>

      </div>

      {/* Bento Layout Page Footer */}
      <footer className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-medium text-slate-400 max-w-7xl w-full mx-auto border-t border-slate-200/80 pt-6">
        <div className="flex gap-6 uppercase tracking-wider font-mono">
          <span>OS: {loginData.DeviceName} ({loginData.Version})</span>
          <span>BUILD: {loginData.build}</span>
          <span>COMPANY: {loginData.company}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          <span>Connected via Corporate Endpoint proxy (in-prod-svc-peopleapp-api.galaxy.one)</span>
        </div>
      </footer>

    </div>
  );
}
