
const { GoogleGenAI } = require('@google/genai');
class GeminiService {
    constructor() {this.genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);}

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
        const result = await this.genAI.models.generateContent({ model: "gemini-3.1-pro-preview", contents: prompt });
        //console.log("resultado 📽️ 📊 MQ ", result);
        const text = result.text;
        const jsonMatch = text.match(/{[\s\S]*}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        throw new Error('No se pudo generar una consulta válida');
    }

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
        const result = await this.genAI.models.generateContent({ model: "gemini-3.1-pro-preview", contents: prompt });
        //console.log("resultado FR 📽️ 📊 ", result);
        const response = await result.text;
        //console.log("response 📽️ 📊 ", response);
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