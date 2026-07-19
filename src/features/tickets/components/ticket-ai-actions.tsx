"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { MessageCircle, Phone, Mail, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  ticket: {
    id: string;
    source: string;

    callRecordingUrl?: string | null;
    whatsappConversationId?: string | null;
    emailMessageId?: string | null;
  };
}

export function TicketAiActions({ ticket }: Props) {
  const t = useTranslations("tickets.aiActions");
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [conversationData, setConversationData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleShowConversation = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/conversation-log`);
      const data = await response.json();
      setConversationData(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleListenRecording = () => {
    if (ticket.callRecordingUrl) {
      window.open(ticket.callRecordingUrl, '_blank');
    }
  };

  const handleViewOriginalEmail = () => {
    // Email viewing logic
    console.log('View original email:', ticket.emailMessageId);
  };

  switch (ticket.source) {
    case "PHONE":
      return (
        <>
          <button
            onClick={handleListenRecording}
            disabled={!ticket.callRecordingUrl}
            className="
            mt-4
            text-xs
            bg-slate-900
            text-white
            px-3
            py-1.5
            rounded-md
            hover:bg-slate-800
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
            flex items-center gap-2
            "
          >
            <Phone className="w-3 h-3" />
            {t("listenRecording")}
          </button>
        </>
      );

    case "WHATSAPP":
      return (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/whatsapp-demo?ticketId=${ticket.id}`);
            }}
            className="
            mt-4
            text-xs
            border
            border-slate-200
            text-slate-700
            px-3
            py-1.5
            rounded-md
            hover:bg-slate-50
            transition
            flex items-center gap-2
            "
          >
            <MessageCircle className="w-3 h-3" />
            {t("chatHistory")}
          </button>
        </>
      );

    case "EMAIL":
      return (
        <button
          onClick={handleViewOriginalEmail}
          className="
          mt-4
          text-xs
          border
          border-slate-200
          text-slate-700
          px-3
          py-1.5
          rounded-md
          hover:bg-slate-50
          transition
          flex items-center gap-2
          "
        >
          <Mail className="w-3 h-3" />
          {t("viewOriginalEmail")}
        </button>
      );

    case "WEB_CHAT":
      return (
        <button
          onClick={handleShowConversation}
          disabled={loading}
          className="
          mt-4
          text-xs
          border
          border-slate-200
          text-slate-700
          px-3
          py-1.5
          rounded-md
          hover:bg-slate-50
          transition
          disabled:opacity-50
          disabled:cursor-not-allowed
          flex items-center gap-2
          "
        >
          <MessageCircle className="w-3 h-3" />
          {loading ? 'Yükleniyor...' : t("chatHistory")}
        </button>
      );

    default:
      return null;
  }
}