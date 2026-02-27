import { GoogleGenerativeAI } from "@google/genai";

// Vite uses import.meta.env instead of process.env
const API_KEY = import.meta.env.VITE_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const getPhysicsGuidance = async (prompt: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "I'm having trouble connecting to my physics brain right now. Let's try that again shortly.";
  }
};