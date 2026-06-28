import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    // Intent dağılımı
    const intents = [
      { name: 'Yeni Müşteri', value: 35 },
      { name: 'Randevu', value: 25 },
      { name: 'Follow-up', value: 20 },
      { name: 'Acil', value: 10 },
      { name: 'Genel', value: 10 }
    ];

    // Kanal kullanımı
    const channels = [
      { name: 'WhatsApp', value: 450 },
      { name: 'Web Chat', value: 320 },
      { name: 'Email', value: 280 },
      { name: 'Telefon', value: 184 }
    ];

    // Yanıt süreleri
    const responseTimes = [
      { time: '09:00', whatsapp: 2.1, webChat: 1.8, email: 5.2 },
      { time: '12:00', whatsapp: 2.3, webChat: 2.0, email: 5.5 },
      { time: '15:00', whatsapp: 2.5, webChat: 2.2, email: 5.8 },
      { time: '18:00', whatsapp: 2.8, webChat: 2.5, email: 6.0 }
    ];

    // Müşteri memnuniyeti
    const satisfaction = [
      { channel: 'WhatsApp', score: 4.6 },
      { channel: 'Web Chat', score: 4.4 },
      { channel: 'Email', score: 4.2 },
      { channel: 'Telefon', score: 4.8 }
    ];

    return NextResponse.json({
      intents,
      channels,
      responseTimes,
      satisfaction
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
