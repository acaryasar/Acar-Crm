"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, RefreshCw, ArrowLeft, Phone, Mic, MicOff } from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface PhoneCallDemoChatProps {
  ticketId?: string;
}

export function PhoneCallDemoChat({ ticketId }: PhoneCallDemoChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReadonly, setIsReadonly] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId] = useState(() => `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (ticketId) {
      setIsReadonly(true);
      fetchPhoneCalls(ticketId);
    }
  }, [ticketId]);

  const fetchPhoneCalls = async (ticketId: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}/conversation-log`);
      const data = await response.json();
      
      if (data.phoneCalls && data.phoneCalls.length > 0) {
        const formattedMessages: Message[] = data.phoneCalls.map((call: any) => ({
          role: 'assistant',
          content: `Ses kaydı: ${call.recordingUrl || 'Kayıt bulunamadı'}`,
          timestamp: new Date(call.createdAt),
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching phone calls:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/phone-call-demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          sessionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Bir hata oluştu");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.answer || "Bir hata oluştu",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: `Bir hata oluştu: ${error instanceof Error ? error.message : 'Lütfen tekrar deneyin.'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real implementation, this would start/stop audio recording
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      {/* Chat Header */}
      <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isReadonly && (
            <Link href="/dashboard/tickets" className="text-white/80 hover:text-white transition-colors" title="Geri Dön">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold">
              {isReadonly ? "Telefon Araması Geçmişi" : "Phone Call AI"}
            </p>
            <p className="text-blue-100 text-xs">
              {isReadonly ? "Sadece görüntüleme modu" : "AI ile telefon araması"}
            </p>
          </div>
        </div>
        {!isReadonly && (
          <button onClick={handleReset} className="text-white/80 hover:text-white transition-colors" title="Sıfırla">
            <RefreshCw className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-slate-600 font-medium">
              {isReadonly ? "Henüz kayıt yok" : "Phone Call AI"}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              {isReadonly
                ? "Bu ticket için telefon arama kaydı bulunmamaktadır."
                : "AI ile Telefon Asistanı. Ses kaydı veya metin girişi ile etkileşim kurabilirsiniz."}
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-700 border border-slate-200"
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.role === "assistant" && (
                    <Bot className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === "user" ? "text-blue-100" : "text-slate-400"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <User className="w-4 h-4 text-blue-100 mt-0.5 shrink-0" />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-600" />
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input - hidden in readonly */}
      {!isReadonly && (
        <div className="border-t border-slate-200 p-4 bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleRecording}
              className={`p-2 rounded-lg transition-colors ${
                isRecording
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              title={isRecording ? "Kaydı Durdur" : "Kayıt Başlat"}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Mesajınızı yazın veya ses kaydı başlatın..."
              className="flex-1 resize-none border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Gönder"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
