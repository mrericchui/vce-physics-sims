import { GoogleGenerativeAI } from "@google/generative-ai";

// Use Vite's environment variable syntax
const API_KEY = import.meta.env.VITE_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const getPhysicsGuidance = async (prompt: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "I'm having trouble connecting to my physics brain. Let's try again soon!";
  }
};