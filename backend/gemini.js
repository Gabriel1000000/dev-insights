import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export async function generateInsights(commitMessages) {
  try {
    const prompt = `
    Você é um assistente que analisa produtividade de desenvolvedores.
    Aqui estão as mensagens de commits de um período:

    ${commitMessages}

    Gere insights sobre:
    - Frequência e consistência dos commits
    - Padrões de trabalho (madrugada, fim de semana, etc. se possível)
    - Qualidade e clareza das mensagens
    - Sugestões de melhoria de produtividade
    Responda em formato de lista clara e objetiva.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // desativa "thinking mode"
        },
      },
    });

    return response.text; // no @google/genai a saída é `response.text`
  } catch (error) {
    console.error("Erro ao gerar insights:", error);
    return "Não foi possível gerar insights.";
  }
}

