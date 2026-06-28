export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  answer: string;
}

export interface ExtractedTicket {
  title: string;
  description: string;
  priority: string;
  appointment?: string;
}

export interface AITicketAnalysis {
  title: string;

  category:| "PLUMBING" | "ELECTRICAL" | "HEATING" | "GENERAL";
  priority:| "LOW"      | "MEDIUM"     | "HIGH"    | "URGENT";
  summary: string;
  confidence: number;
  customerAddress?: string;
  appointmentHint?: string;
}