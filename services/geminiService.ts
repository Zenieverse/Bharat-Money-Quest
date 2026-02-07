
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getFinancialInsight = async (userState: any, action: string) => {
  if (!API_KEY) return "Great job on making a financial decision! Keep learning.";
  
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User is a ${userState.persona} with goal ${userState.goal}. They just ${action}. Provide a 1-sentence supportive financial tip in a friendly Indian context.`,
      config: {
        systemInstruction: "You are Bharat Finance Buddy, a friendly mentor for Indian users learning money management. Use simple English mixed with occasional common Indian financial terms.",
      }
    });
    return response.text || "Good decision! Every rupee saved is a rupee earned.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Great progress! Keep going on your quest.";
  }
};

export const narrateText = async (text: string) => {
  if (!API_KEY) return;
  
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const dataInt16 = new Int16Array(bytes.buffer);
      const frameCount = dataInt16.length;
      const buffer = audioContext.createBuffer(1, frameCount, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();
    }
  } catch (error) {
    console.error("TTS Error:", error);
  }
};
