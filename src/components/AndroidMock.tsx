import React from "react";
import { 
  Wifi, 
  Battery, 
  MapPin, 
  ShieldAlert, 
  CheckCircle, 
  X, 
  User, 
  Key, 
  Building2, 
  Database,
  RefreshCw,
  LogOut,
  Clock,
  Send,
  HelpCircle,
  Menu,
  ChevronRight,
  Fingerprint
} from "lucide-react";
import { LoginRequestData, AttendancePayload } from "../types";

interface AndroidMockProps {
  loginData: LoginRequestData;
  setLoginData: React.Dispatch<React.SetStateAction<LoginRequestData>>;
  stoken: string;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  attendancePayload: AttendancePayload;
  onUpdateAttendance: (updates: Partial<AttendancePayload["DataHeader"]>) => void;
  onTriggerAttendance: (direction: "i" | "o") => void;
  isLoading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

export const AndroidMock: React.FC<AndroidMockProps> = ({
  loginData,
  setLoginData,
  stoken,
  isLoggedIn,
  onLogin,
  onLogout,
  attendancePayload,
  onUpdateAttendance,
  onTriggerAttendance,
  isLoading,
  successMessage,
  errorMessage,
}) => {
  const [activeTab, setActiveTab] = React.useState<"login" | "attendance">("login");
  const [showConfigHelper, setShowConfigHelper] = React.useState<boolean>(false);

  // Synchronize dynamic system date clock for phone mock navbar
  const [deviceTime, setDeviceTime] = React.useState("09:02");
  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setDeviceTime(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 15000);
    return () => clearInterval(timer);
  }, []);

  // Update default states when logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      setActiveTab("attendance");
    } else {
      setActiveTab("login");
    }
  }, [isLoggedIn]);

  return (
    <div className="w-[390px] h-[780px] rounded-[52px] bg-slate-950 p-[12px] shadow-2xl relative border-[12px] border-slate-900 box-content shrink-0 select-none flex flex-col overflow-hidden">
      
      {/* Phone Camera Notch punch-hole */}
      <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-[110px] h-[18px] bg-black rounded-full z-50 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 absolute left-[14px]"></div>
        <div className="w-6 h-1 bg-slate-900 absolute right-[15px] rounded-full"></div>
      </div>

      {/* Internal Screen Area */}
      <div className="flex-1 bg-slate-900 rounded-[40px] overflow-hidden flex flex-col relative text-white border border-slate-800">
        
        {/* Android Native Bar Top Info */}
        <div className="h-10 pt-3 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-300 z-40 bg-slate-950/85 backdrop-blur shrink-0">
          <span className="font-sans text-xs">{deviceTime}</span>
          <div className="flex items-center gap-1.5">
            <Wifi size={13} className="text-emerald-400" />
            <span className="text-[10px] font-sans text-emerald-300 truncate max-w-[65px]">
              {attendancePayload.DataHeader.P5 || "Offline"}
            </span>
            <Battery size={13} className="text-slate-200" />
          </div>
        </div>

        {/* Dynamic App Brand Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 pb-4 pt-3 px-5 flex flex-col relative shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 font-black bg-white rounded text-teal-800 tracking-tighter text-[11px] h-6 w-6 flex items-center justify-center">
                P
              </div>
              <div>
                <h1 className="text-sm font-extrabold tracking-tight">People App</h1>
                <p className="text-[9px] opacity-75">vPNJ_20210105_V1 (Sovico)</p>
              </div>
            </div>
            
            {isLoggedIn && (
              <button
                onClick={onLogout}
                className="p-1 px-1.5 text-[10px] bg-teal-800/80 hover:bg-rose-900 duration-150 rounded border border-teal-600 text-teal-100 flex items-center gap-1"
                title="Log Out Session"
              >
                <LogOut size={10} />
                <span>Exit</span>
              </button>
            )}
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-1 text-center rounded text-[11px] font-semibold transition-all ${
                activeTab === "login"
                  ? "bg-white text-teal-900 shadow-sm font-bold"
                  : "bg-teal-800/50 text-teal-200 hover:bg-teal-800"
              }`}
            >
              1. Account Session
            </button>
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  // Alert via beautiful error or slide over
                }
                setActiveTab("attendance");
              }}
              className={`flex-1 py-1 text-center rounded text-[11px] font-semibold transition-all flex items-center justify-center gap-1 ${
                activeTab === "attendance"
                  ? "bg-white text-teal-900 shadow-sm font-bold"
                  : "bg-teal-800/50 text-teal-200 hover:bg-teal-800"
              }`}
            >
              2. Check attendance
              {isLoggedIn && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>}
            </button>
          </div>
        </div>

        {/* Simulated System Notification Popup Overlay */}
        {successMessage && (
          <div className="absolute top-28 left-4 right-4 bg-emerald-950/95 border border-emerald-500/40 text-emerald-200 p-2.5 rounded-xl z-50 text-[11px] flex items-start gap-2 shadow-lg backdrop-blur">
            <CheckCircle className="text-emerald-400 shrink-0 mt-0.5" size={14} />
            <div className="flex-1 font-sans leading-tight">
              {successMessage}
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="absolute top-28 left-4 right-4 bg-rose-950/95 border border-rose-500/40 text-rose-200 p-2.5 rounded-xl z-50 text-[11px] flex items-start gap-2 shadow-lg backdrop-blur">
            <ShieldAlert className="text-rose-400 shrink-0 mt-0.5" size={14} />
            <div className="flex-1 font-sans leading-tight">
              {errorMessage}
            </div>
          </div>
        )}

        {/* Content Screens Container */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col pb-10">
          {activeTab === "login" ? (
            <div className="space-y-3 flex-1 flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="p-3 bg-indigo-950/40 border border-indigo-900/40 rounded-xl space-y-1">
                  <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                    <Fingerprint size={12} fill="currentColor" className="opacity-70" />
                    Authentication Credentials
                  </h4>
                  <p className="text-[10px] text-indigo-200/70 leading-relaxed font-sans">
                    Authenticate directly into Sovico HRMS system via real endpoints using your user credentials to generate a valid <code className="bg-black/30 px-1 py-0.5 rounded text-white font-mono">Stoken</code>.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-slate-500" size={13} />
                    <input
                      type="text"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      className="w-full bg-slate-950 text-[11px] text-white pl-8 pr-3 py-2 border border-slate-800 rounded-lg focus:outline-none focus:border-teal-500"
                      placeholder="Username (e.g., khoitn1)"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight">Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 text-slate-500" size={13} />
                    <input
                      type="password"
                      value={loginData.Password}
                      onChange={(e) => setLoginData({ ...loginData, Password: e.target.value })}
                      className="w-full bg-slate-950 text-[11px] text-white pl-8 pr-3 py-2 border border-slate-800 rounded-lg focus:outline-none focus:border-teal-500"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight">Company Group ID</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 text-slate-500" size={13} />
                    <input
                      type="text"
                      value={loginData.company}
                      onChange={(e) => setLoginData({ ...loginData, company: e.target.value })}
                      className="w-full bg-slate-950 text-[11px] text-white pl-8 pr-3 py-2 border border-slate-800 rounded-lg focus:outline-none focus:border-teal-500"
                      placeholder="HDBANK, SOVICO, etc."
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onLogin}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 duration-150 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md text-slate-950"
                  >
                    {isLoading ? (
                      <RefreshCw className="animate-spin" size={12} />
                    ) : (
                      "Establish Session (Login)"
                    )}
                  </button>
                </div>
              </div>

              {/* Token State Indicator */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/60 font-mono text-[10px] space-y-2 mt-auto">
                <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-900">
                  <span>HR SYSTEM STOKEN</span>
                  <Database size={12} />
                </div>
                {stoken ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-emerald-400 font-bold select-all break-all">{stoken}</span>
                    <span className="text-[9px] text-slate-500 font-sans">
                      Successfully authenticated from PeopleApp server response.
                    </span>
                  </div>
                ) : (
                  <span className="text-rose-400 italic">No valid token found. Please sign-in above.</span>
                )}
              </div>

            </div>
          ) : (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              
              {/* Token check warning if offline/un-logged */}
              {!stoken && (
                <div className="p-2.5 bg-amber-950/40 border border-amber-600/30 text-amber-200 rounded-xl text-[10.5px]">
                  <strong>Warning:</strong> You must first authenticate in the "Account Session" tab to capture active, valid session signatures. Running with manual token overrides is allowed below, but may return server validation errors.
                </div>
              )}

              {/* Wifi Config / DataHeader Panel */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                    WiFi & GPS Configuration Headers
                  </h4>
                  <button
                    onClick={() => setShowConfigHelper(!showConfigHelper)}
                    className="text-[10px] text-teal-400 flex items-center gap-0.5 hover:underline"
                  >
                    {showConfigHelper ? "Hide Info" : "View Help"}
                  </button>
                </div>

                {showConfigHelper && (
                  <div className="p-3 bg-slate-950 rounded-xl text-[10px] font-sans text-slate-400 leading-normal space-y-1 my-1">
                    <p><strong>P0:</strong> Employee Session check-in code block metadata.</p>
                    <p><strong>P1:</strong> Transmitted direction. Auto-computed (i = Check-In, o = Check-Out).</p>
                    <p><strong>P2:</strong> Application installation context token payload.</p>
                    <p><strong>P3:</strong> Target Office BSSID (Wireless Access Point MAC Address format).</p>
                    <p><strong>P5:</strong> Workplace Wireless Signal Network Name.</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[9px] text-slate-400 font-mono uppercase">P0 (Emp Session Context)</label>
                    <input
                      type="text"
                      value={attendancePayload.DataHeader.P0}
                      onChange={(e) => onUpdateAttendance({ P0: e.target.value })}
                      className="w-full bg-slate-950 text-[10px] text-emerald-400 font-mono border border-slate-800 rounded p-1.5 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] text-slate-400 font-mono uppercase">P1 (Computed Status)</label>
                    <input
                      type="text"
                      disabled
                      value={attendancePayload.DataHeader.P1}
                      className="w-full bg-slate-950/60 text-[10px] text-slate-500 font-mono border border-slate-800 p-1.5 rounded cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] text-slate-400 font-mono uppercase">P2 (Installation UUID Context)</label>
                  <input
                    type="text"
                    value={attendancePayload.DataHeader.P2}
                    onChange={(e) => onUpdateAttendance({ P2: e.target.value })}
                    className="w-full bg-slate-950 text-[10px] text-slate-300 font-mono border border-slate-800 rounded p-1.5 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-[9px] text-slate-400 font-mono uppercase">P3 (Target WiFi MAC - BSSID)</label>
                    <button
                      onClick={() => onUpdateAttendance({ P3: "0c:80:63:da:6b:c4" })}
                      className="text-[9px] text-slate-500 hover:text-teal-400"
                    >
                      Default HQ AP
                    </button>
                  </div>
                  <input
                    type="text"
                    value={attendancePayload.DataHeader.P3}
                    onChange={(e) => onUpdateAttendance({ P3: e.target.value })}
                    className="w-full bg-slate-950 text-[10px] text-teal-400 font-mono border border-slate-800 rounded p-1.5 focus:outline-none"
                    placeholder="e.g., 9a:2a:6f:a4:8f:49"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[9px] text-slate-400 font-mono uppercase">P5 (Target WiFi Name - SSID)</label>
                    <input
                      type="text"
                      value={attendancePayload.DataHeader.P5}
                      onChange={(e) => onUpdateAttendance({ P5: e.target.value })}
                      className="w-full bg-slate-950 text-[10px] text-teal-400 font-mono border border-slate-800 rounded p-1.5 focus:outline-none"
                      placeholder="e.g. GIH_8F, HD_HQ_STAFF"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] text-slate-400 font-mono uppercase">Captured (Auto Update)</label>
                    <div className="bg-slate-950 text-[10px] text-slate-400 border border-slate-800 rounded p-1.5 flex items-center gap-1">
                      <Clock size={10} />
                      <span className="font-mono text-[9px] truncate">
                        {attendancePayload.DataHeader.P4.split(" ")[1]}
                      </span>
                    </div>
                  </div>
                </div>

                {stoken && (
                  <div className="p-2 border border-emerald-900/30 bg-emerald-950/20 rounded-lg text-[9.5px] font-mono flex items-center gap-1 text-slate-400 overflow-hidden">
                    <span className="text-emerald-400 shrink-0 font-bold font-sans">Stoken used:</span>
                    <span className="truncate">{stoken}</span>
                  </div>
                )}
              </div>

              {/* Action Operations Area */}
              <div className="space-y-2 mt-auto">
                <button
                  onClick={() => onTriggerAttendance("i")}
                  disabled={isLoading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 font-bold text-xs uppercase tracking-wider shadow-md border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-all text-white"
                >
                  {isLoading ? (
                    <RefreshCw className="animate-spin" size={12} />
                  ) : (
                    <>
                      <CheckCircle size={14} />
                      Check-In Attendance (i)
                    </>
                  )}
                </button>

                <button
                  onClick={() => onTriggerAttendance("o")}
                  disabled={isLoading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 font-bold text-xs uppercase tracking-wider shadow-md border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all text-white"
                >
                  {isLoading ? (
                    <RefreshCw className="animate-spin" size={12} />
                  ) : (
                    <>
                      <LogOut size={14} />
                      Check-Out Attendance (o)
                    </>
                  )}
                </button>

                <div className="text-center">
                  <span className="text-[9px] text-slate-500">
                    Sends location packet to Sovico gateway via PeopleApp protocols
                  </span>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Android Navigation Bar Bottom Buttons */}
        <div className="h-12 bg-slate-950 border-t border-slate-950 flex items-center justify-around px-8 shrink-0 pb-1">
          <button className="p-2 text-slate-500 hover:text-slate-300">
            <ChevronRight size={14} className="rotate-180" />
          </button>
          <button className="h-2.5 w-16 rounded-full bg-slate-700 hover:bg-slate-500 transition-colors"></button>
          <button className="p-2 text-slate-500 hover:text-slate-300">
            <Menu size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};
