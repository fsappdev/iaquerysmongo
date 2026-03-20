
const { GoogleGenAI } = require('@google/genai');
//apagar ⬇️
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

class GeminiService {
  constructor() {
    //this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
    //this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    //this.genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
    //this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    //this.model = this.genAI.models({ model: "gemini-2.5-pro" });
    //this.model = ai.models.generateContent({ model: "gemini-2.5-pro" });
  }

  async generateMongoQuery(naturalQuery, schema) {
    const prompt = `
        Eres un experto en MongoDB. Convierte la siguiente consulta en lenguaje natural a una consulta MongoDB.
        ESQUEMA: ${JSON.stringify(schema)}
        CONSULTA: "${naturalQuery}"
        Responde solo con un JSON:
        {
        "mongoQuery": { "collection": "...", "operation": "...", "query": {}, "options": {} },
        "explanation": "...",
        "expectedResult": "..."
        }
    `;
    //const result = await this.models.generateContent(prompt);
    //const result = await this.models.generateContent({model: "gemini-2.5-pro", contents: prompt});
    const result = await this.genAI.models.generateContent({model: "gemini-3-flash-preview", contents: prompt});
    //const response = await result;
    //const text = response.text;
    console.log("resultado 📽️ 📊 MQ ",result);
    const text = result.text;
    const jsonMatch = text.match(/{[\s\S]*}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error('No se pudo generar una consulta válida');
  }

  /* async generateMongoQueryNew(naturalQuery, schema){
    const prompt = `
        Eres un experto en MongoDB. Convierte la siguiente consulta en lenguaje natural a una consulta MongoDB.
        ESQUEMA: ${JSON.stringify(schema)}
        CONSULTA: "${naturalQuery}"
        Responde solo con un JSON:
        {
        "mongoQuery": { "collection": "...", "operation": "...", "query": {}, "options": {} },
        "explanation": "...",
        "expectedResult": "..."
        }
    `;
    const result = await ai.models.generateContent({model: "gemini-2.5-pro", contents: prompt});
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/{[\s\S]*}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error('No se pudo generar una consulta válida');
  } */

  async formatResponse(queryResult, originalQuery, mongoQuery) {
    const prompt = `
        Presenta el siguiente resultado de base de datos de forma clara y profesional para un usuario no técnico.
        CONSULTA: "${originalQuery}"
        MONGODB: ${JSON.stringify(mongoQuery)}
        RESULTADO: ${JSON.stringify(queryResult)}
        Responde en JSON:
        {
        "summary": "...",
        "data": "...",
        "insights": "...",
        "count": ...
        }
    `;
    //const result = await ai.models.generateContent({model: "gemini-2.5-pro", contents: prompt});
    const result = await ai.models.generateContent({model: "gemini-3-flash-preview", contents: prompt});
    console.log("resultado FR 📽️ 📊 ",result);
    const response = await result.text;
    console.log("response 📽️ 📊 ",response);
    //const text = response.text();
    //console.log("text 📽️ 📊 ",text);
    const jsonMatch = response.match(/{[\s\S]*}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return {
      summary: "Consulta ejecutada",
      data: JSON.stringify(queryResult, null, 2),
      insights: "",
      count: Array.isArray(queryResult) ? queryResult.length : 1
    };
  }
}

module.exports = new GeminiService();