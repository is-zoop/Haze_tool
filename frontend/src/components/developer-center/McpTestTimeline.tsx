import { Check, HelpCircle } from "lucide-react";
import { MCP_TEST_STEPS } from "./config";

interface McpTestTimelineProps {
  currentStepIndex: number;
  langCode: string;
}

export function McpTestTimeline({ currentStepIndex, langCode }: McpTestTimelineProps) {
  return (
    <div className="min-h-0 flex flex-col rounded-xl border border-slate-100 bg-slate-50/50 p-4 shrink-0 justify-between select-none">
      <div>
        <div className="mb-4 flex items-center gap-1.5">
          <span className="text-xs font-extrabold text-slate-800 tracking-wide uppercase">
            {langCode === "ZH" ? "测试流程" : langCode === "JA" ? "テストフロー" : langCode === "ES" ? "Flujo de prueba" : "Test Flow"}
          </span>
          <HelpCircle size={13} className="text-slate-400 hover:text-slate-600 cursor-pointer" />
        </div>

        {/* Steps Progress Checklist */}
        <div className="space-y-3.5 relative">
          {MCP_TEST_STEPS.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;

            return (
              <div 
                key={idx} 
                className={`relative flex gap-3 p-2 rounded-xl transition-all duration-200 border ${
                  isActive 
                    ? "bg-blue-50/80 border-blue-100/60 shadow-xs" 
                    : "border-transparent"
                }`}
              >
                {/* Vertical Connector Line */}
                {idx < 5 && (
                  <div
                    className={`absolute left-[17px] top-6.5 bottom-[-16px] w-0.5 transition-colors duration-300 ${
                      idx < currentStepIndex ? "bg-emerald-400" : "bg-slate-250 border-l border-dashed"
                    }`}
                  />
                )}

                {/* Step Icon Indicator */}
                <div className="relative z-10 shrink-0">
                  {isCompleted ? (
                    <div className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-emerald-500 text-white shadow-xs">
                      <Check className="h-2.5 w-2.5 stroke-[3.5]" />
                    </div>
                  ) : isActive ? (
                    <div className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-blue-500 text-white animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-slate-100 text-slate-400 border border-slate-200 text-xs font-mono font-bold select-none">
                      {idx + 1}
                    </div>
                  )}
                </div>

                {/* Step description block */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className={`text-xs font-bold truncate tracking-tight ${
                      isCompleted ? "text-slate-700" : isActive ? "text-blue-600" : "text-slate-400"
                    }`}>
                      {step.name}
                    </span>
                    {isCompleted && step.duration && (
                      <span className="text-xs font-mono font-medium text-slate-400 shrink-0 select-none">
                        {step.duration}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs leading-normal truncate ${
                    isCompleted ? "text-slate-500" : isActive ? "text-blue-500/85" : "text-slate-400/70"
                  }`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
