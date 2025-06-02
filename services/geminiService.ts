
import { GoogleGenAI, GenerateContentResponse, GenerateContentParameters } from "@google/genai";

interface GenerateConfig extends GenerateContentParameters {
    systemInstruction?: string;
    topK?: number;
    topP?: number;
    temperature?: number;
    responseMimeType?: "text/plain" | "application/json";
    seed?: number;
    thinkingConfig?: { thinkingBudget: number };
}

export class GeminiService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("Gemini API key is required.");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateText(
    prompt: string, 
    modelName: string = 'gemini-2.5-flash-preview-04-17',
    config?: Partial<GenerateConfig>
  ): Promise<string> {
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: modelName,
        contents: prompt,
        ...(config && { config })
      });
      return response.text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      if (error instanceof Error) {
         throw new Error(`Gemini API request failed: ${error.message}`);
      }
      throw new Error('Gemini API request failed with an unknown error.');
    }
  }

  // Add other methods for chat, streaming, image generation if needed
  // For example, a method to specifically ask for JSON and parse it
  async generateJson(
    prompt: string,
    modelName: string = 'gemini-2.5-flash-preview-04-17',
    config?: Partial<GenerateConfig>
  ): Promise<any> {
    const fullConfig = { ...config, responseMimeType: "application/json" as const };
    const rawResponse = await this.generateText(prompt, modelName, fullConfig);
    
    let jsonStr = rawResponse.trim();
    const fenceRegex = /^\`\`\`(\w*)?\s*\n?(.*?)\n?\s*\`\`\`$/s; // Matches ```json ... ``` or ``` ... ```
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim(); // Extracted content
    }

    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse JSON response from Gemini:", e);
      console.error("Original Gemini response:", rawResponse);
      throw new Error(`Failed to parse JSON response: ${(e as Error).message}. Original response: ${rawResponse.substring(0,1000)}`);
    }
  }
}
