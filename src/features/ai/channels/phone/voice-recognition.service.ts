import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export class VoiceRecognitionService {
  /**
   * Ses kaydını metne çevir (Transcription)
   */
  async transcribeAudio(audioUrl: string): Promise<string> {
    try {
      // OpenAI Whisper API kullanarak transkripsiyon
      const response = await openai.audio.transcriptions.create({
        file: await this.fetchAudioFile(audioUrl),
        model: 'whisper-1',
        language: 'tr'
      });

      return response.text;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw new Error('Audio transcription failed');
    }
  }

  /**
   * Ses dosyasını fetch et
   */
  private async fetchAudioFile(url: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    
    return new File([blob], 'audio.mp3', { type: 'audio/mpeg' });
  }

  /**
   * Gerçek zamanlı ses tanıma (WebRTC için)
   */
  async startRealTimeTranscription(): Promise<void> {
    // İleride WebRTC ile gerçek zamanlı transkripsiyon eklenebilir
    console.log('Real-time transcription not yet implemented');
  }

  /**
   * Ses kaydı kalitesini analiz et
   */
  async analyzeAudioQuality(audioUrl: string): Promise<{
    duration: number;
    quality: 'good' | 'fair' | 'poor';
    clarity: number;
  }> {
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      
      // Basit kalite analizi
      const duration = 0; // İlerinde audio duration hesaplanabilir
      const size = blob.size;
      
      let quality: 'good' | 'fair' | 'poor' = 'good';
      if (size < 10000) quality = 'poor';
      else if (size < 50000) quality = 'fair';

      return {
        duration,
        quality,
        clarity: quality === 'good' ? 0.9 : quality === 'fair' ? 0.6 : 0.3
      };
    } catch (error) {
      console.error('Error analyzing audio quality:', error);
      return {
        duration: 0,
        quality: 'poor',
        clarity: 0
      };
    }
  }
}
