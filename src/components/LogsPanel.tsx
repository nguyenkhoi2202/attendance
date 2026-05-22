import React from "react";
import { LogEntry } from "../types";
import { Terminal, RefreshCw, Trash2, Send, Download } from "lucide-react";

interface LogsPanelProps {
  logs: LogEntry[];
  onRefresh: () => void;
  onClear: () => void;
}

export const LogsPanel: React.FC<LogsPanelProps> = ({ logs, onRefresh, onClear }) => {
  const [selectedLog, setSelectedLog] = React.useState<LogEntry | null>(null);

  return (
    <div className="bg-slate-900 border-t border-slate-800 flex flex-col h-full text-slate-100 font-mono text-xs overflow-hidden">
      {/* Panel Nav */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-emerald-400" />
          <span className="font-semibold text-slate-300 tracking-wide uppercase text-[10px]">
            API Traffic Proxy Terminal & Network Inspection
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-slate-900 rounded transition-colors"
            title="Refresh logs list"
          >
            <RefreshCw size={13} />
          </button>
          <button
            onClick={onClear}
            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded transition-colors"
            title="Clear request history"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 divide-x divide-slate-800">
        {/* Left list */}
        <div className="w-1/2 overflow-y-auto p-2 space-y-2">
          {logs.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-[11px] font-sans">
              <Terminal size={24} className="stroke-1 mb-2 opacity-50" />
              No active HTTP requests captured yet
            </div>
          ) : (
            logs.map((log) => {
              const isSent = log.direction === "SENT";
              const isLogin = log.type === "LOGIN";
              const isSuccess = log.status && log.status >= 200 && log.status < 300;
              const isErr = log.status && log.status >= 400;

              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`p-2 rounded cursor-pointer transition-all border ${
                    selectedLog?.id === log.id
                      ? "bg-slate-800 border-slate-600 text-white"
                      : "bg-slate-950 border-transparent text-slate-300 hover:border-slate-800 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        isLogin
                          ? "bg-indigo-900/40 text-indigo-300 border border-indigo-500/30"
                          : "bg-emerald-900/40 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {log.type}
                    </span>
                    <span className="text-[9px] text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1.5">
                    {isSent ? (
                      <Send size={10} className="text-blue-400 shrink-0" />
                    ) : (
                      <Download size={10} className="text-pink-400 shrink-0" />
                    )}
                    <span className="text-[10px] truncate max-w-[200px]" title={log.url}>
                      {log.url.split("/").slice(-3).join("/")}
                    </span>
                  </div>

                  {!isSent && (
                    <div className="mt-1 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 text-[9px]">Status Code</span>
                      <span
                        className={`font-bold px-1 rounded ${
                          isSuccess
                            ? "text-emerald-400 bg-emerald-950/60"
                            : isErr
                            ? "text-rose-400 bg-rose-950/60"
                            : "text-amber-400 bg-amber-950/60"
                        }`}
                      >
                        {log.status || "PENDING"}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail Pane */}
        <div className="w-1/2 overflow-y-auto p-3 bg-slate-950/40 flex flex-col justify-between">
          {selectedLog ? (
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                <span className="text-[10px] font-bold text-slate-400">
                  REQUEST DETAILS ({selectedLog.id})
                </span>
                <span className="text-slate-500 text-[10px]">
                  {selectedLog.direction}
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-0.5">Url</div>
                  <div className="text-pink-400 break-all select-all font-sans pr-2">
                    {selectedLog.url}
                  </div>
                </div>

                {Object.keys(selectedLog.headers).length > 0 && (
                  <div>
                    <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-1">
                      Custom Application Headers
                    </div>
                    <pre className="p-2 rounded bg-slate-950 text-slate-400 border border-slate-900 overflow-x-auto text-[10px]">
                      {JSON.stringify(selectedLog.headers, null, 2)}
                    </pre>
                  </div>
                )}

                <div>
                  <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-1">
                    JSON Body Payload Configuration
                  </div>
                  <pre className="p-2 rounded bg-slate-950 text-slate-300 border border-slate-900 overflow-x-auto text-[10px] select-all">
                    {JSON.stringify(selectedLog.body, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center font-sans p-4">
              <Terminal size={32} className="stroke-1 mb-2 opacity-30 text-slate-400" />
              <p className="text-[11px] leading-relaxed">
                Select a logged request package on the left side to inspect its transmitted payload, full device parameters, and active headers.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
