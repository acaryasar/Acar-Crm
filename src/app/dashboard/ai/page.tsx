import { ChatWindow } from "@/features/ai/components/chat-window";
import { Brain } from "lucide-react";

export default function AIPage() {
  return (
    <div className="space-y-5 h-full flex flex-col">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center">
          <Brain size={20} className="text-violet-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">AI Assistant</h1>
          <p className="text-sm text-slate-500">Ask anything about your business</p>
        </div>
      </div>

      <div className="flex-1">
        <ChatWindow />
      </div>
    </div>
  );
}
