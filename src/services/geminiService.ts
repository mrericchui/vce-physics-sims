import { GoogleGenAI } from "@google/genai";

export const askPhysicsTutor = async (question: string) => {
  // Always initialize a new client within the request scope to ensure the latest key from process.env is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      // Using gemini-3-pro-preview for higher-quality reasoning in STEM (Physics).
      model: 'gemini-3-pro-preview',
      contents: question,
      config: {
        systemInstruction: `You are Mr. Eric Chui's AI Assistant for VCE Physics. 
        Your goal is to help students understand complex physics concepts in the VCE curriculum (Units 3 & 4). 
        Be professional, encouraging, and provide clear explanations. 
        Use common VCE terminology (e.g., Area of Study, dot points, specific formulas from the VCAA data sheet).
        Keep answers concise and visually structured with bullet points.`,
        temperature: 0.7,
      },
    });

    // Directly access .text property.
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to the AI Physics Tutor. Please try again later.";
  }
};