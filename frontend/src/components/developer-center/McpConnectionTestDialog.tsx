import { Play, RotateCw, Terminal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeveloperAsset } from "../../types/developer-center";
import { McpTestTimeline } from "./McpTestTimeline";
import { McpTerminalLog } from "./McpTerminalLog";

interface McpConnectionTestDialogProps {
  open: boolean;
  onClose: () => void;
  debugAsset: DeveloperAsset | null;
  langCode: string;
  debugStatus: "idle" | "testing" | "pass" | "fail";
  currentStepIndex: number;
  terminalLogs: Array<{ time: string; type: string; text: string }>;
  testStarted: boolean;
  onStartTest: () => void;
  onClearLogs: () => void;
  onTriggerAlert: (msg: string) => void;
}

export function McpConnectionTestDialog({
  open,
  onClose,
  debugAsset,
  langCode,
  debugStatus,
  currentStepIndex,
  terminalLogs,
  testStarted,
  onStartTest,
  onClearLogs,
  onTriggerAlert,
}: McpConnectionTestDialogProps) {
  if (!open || !debugAsset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs select-none p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative flex h-[580px] w-full max-w-4xl flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-xl transition-all">
        {/* Modal Title Banner */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 text-left">
            <Terminal size={14} className="text-blue-500" />
            <span>
              {langCode === "ZH"
                ? `MCP在线沙箱测试`
                : langCode === "JA"
                ? `MCP オンラインサンドボックスデバッグ`
                : langCode === "ES"
                ? `MCP Depuración en línea`
                : `MCP Live Sandbox Debug`}
            </span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Core Panels Grid layout */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 py-4 lg:grid-cols-[250px_1fr]">
          {/* Left Side: Test Steps Timeline */}
          <McpTestTimeline
            currentStepIndex={currentStepIndex}
            langCode={langCode}
          />

          {/* Right Side: Log Console / Terminal Output */}
          <McpTerminalLog
            terminalLogs={terminalLogs}
            langCode={langCode}
            onClearLogs={onClearLogs}
            onTriggerAlert={onTriggerAlert}
          />
        </div>

        {/* Modal Bottom Control Action Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-slate-100 pt-3.5 select-none">
          {/* Bottom Left: Play/Retest trigger */}
          <Button
            variant="outline"
            size="sm"
            onClick={onStartTest}
            disabled={debugStatus === "testing"}
            className="h-9 px-3.5 text-xs font-semibold rounded-lg"
          >
            {testStarted ? (
              <>
                <RotateCw
                  className={`h-3.5 w-3.5 mr-1.5 ${
                    debugStatus === "testing" ? "animate-spin" : ""
                  }`}
                />
                <span>{langCode === "ZH" ? "重新测试" : "Retest"}</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                <span>{langCode === "ZH" ? "开始测试" : "Start Test"}</span>
              </>
            )}
          </Button>

          {/* Bottom Right: Close action */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={onClose}
              className="h-9 px-4 text-xs font-bold rounded-lg bg-black text-white hover:bg-zinc-900 border-none select-none transition-all cursor-pointer"
            >
              {langCode === "ZH" ? "关闭测试" : "Close Test"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
