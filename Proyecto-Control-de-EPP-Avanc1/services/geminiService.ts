
import { GoogleGenAI } from "@google/genai";
import { InventoryItem } from "../types";

// In a browser environment without a build process, process.env is not available.
// We check for its existence and handle the API key gracefully.
// The API_KEY will be undefined, and the feature will be disabled.
const API_KEY = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    ai = null;
  }
} else {
    console.warn("API_KEY for Gemini is not available. AI assistant will be disabled.");
}

export const getInventoryInsights = async (inventory: InventoryItem[], query: string): Promise<string> => {
  if (!ai) {
    return "El servicio de asistente IA no está disponible. La clave de API no está configurada o es inválida.";
  }

  const model = "gemini-2.5-flash";
  const systemInstruction = `You are an expert inventory assistant for a safety equipment warehouse. 
  Your name is 'CYBER-CLERK'. Analyze the following inventory data, which is provided in JSON format, and answer the user's question in Spanish.
  Be concise, friendly, and helpful. Respond only with information derivable from the data. Do not make up information.
  If the question cannot be answered from the data, say so clearly.
  
  Inventory Data:
  ${JSON.stringify(inventory, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: query,
        config: {
            systemInstruction,
        }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Hubo un error al contactar al asistente de IA. Por favor, inténtelo de nuevo más tarde.";
  }
};
