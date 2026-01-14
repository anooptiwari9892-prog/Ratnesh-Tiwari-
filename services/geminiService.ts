
import { GoogleGenAI, Type } from "@google/genai";
import { JournalEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const solveJournalEntry = async (transaction: string): Promise<JournalEntry> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Translate the following business transaction into a professional double-entry journal entry following Indian accounting standards: "${transaction}"`,
    config: {
      systemInstruction: `You are an expert Indian Chartered Accountant. 
      Analyze the transaction provided by the user. 
      Identify the accounts involved (Real, Personal, Nominal).
      Determine which account is debited and which is credited according to the Golden Rules.
      Provide the result in a strict JSON format.
      The accounts should follow standard Indian naming (e.g., 'Cash A/c', 'Purchases A/c', 'Capital A/c').`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "Current date or suggested transaction date" },
          particulars: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                account: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['Dr', 'Cr'] },
                amount: { type: Type.NUMBER }
              },
              required: ['account', 'type', 'amount']
            }
          },
          narration: { type: Type.STRING, description: "Professional narration starting with 'Being...'" },
          reasoning: { type: Type.STRING, description: "Brief explanation of the golden rules applied" }
        },
        required: ['date', 'particulars', 'narration', 'reasoning']
      }
    }
  });

  return JSON.parse(response.text);
};
