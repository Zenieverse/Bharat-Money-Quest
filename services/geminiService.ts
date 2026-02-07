
import { GoogleGenAI } from "@google/genai";

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
