import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, FileData } from "../types";

const parseJSON = (text: string): any => {
    try {
        // Attempt to parse strictly first
        return JSON.parse(text);
    } catch (e) {
        // If strict parsing fails, try to clean markdown code blocks
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
    }
};

export const analyzeResumes = async (
  jobDescription: string,
  files: FileData[]
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Construct parts: 1 Text part for JD + N InlineData parts for PDFs
  const parts = [
    {
      text: `Você é um Recrutador Sênior Especialista e um Assistente de RH Brasileiro.
      
      IDIOMA DE SAÍDA: PORTUGUÊS (PT-BR).
      Todas as strings, feedbacks, motivos de erro, resumos, prós e contras DEVEM ser escritos em Português do Brasil.

      CONTEXTO:
      Estou fornecendo um texto que DEVE SER uma Descrição de Vaga (Job Description) e ${files.length} arquivos PDF que DEVEM SER currículos.
      
      TAREFA DE VALIDAÇÃO (CRÍTICA):
      1. Verifique se o texto da "JOB DESCRIPTION" abaixo é realmente uma descrição de vaga válida e compreensível. Se for apenas caracteres aleatórios, muito curto, ou algo sem sentido (ex: receita de bolo, lorem ipsum, "teste"), marque "isJobDescriptionValid": false.
         No campo "jobDescriptionFeedback", escreva em PORTUGUÊS por que é inválido (ex: "O texto fornecido não parece uma descrição de vaga válida.").
      2. Para CADA arquivo PDF, verifique se é um currículo profissional (CV/Resume). Se for um documento não relacionado (ex: fatura, receita, texto aleatório, imagem sem texto), marque "isResume": false.
         No campo "notResumeReason", escreva em PORTUGUÊS o motivo (ex: "O arquivo parece ser um boleto bancário e não um currículo.").

      TAREFA DE ANÁLISE (Para itens válidos):
      Se a JD for válida e o arquivo for um currículo:
      1. Extraia o nome do candidato.
      2. Avalie a "Adequação Técnica" (0 a 100).
      3. Avalie a "Adequação de Potencial/Cultural" (0 a 100).
      4. Liste pros/cons, resumo e anos de experiência.

      JOB DESCRIPTION ENVIADA:
      "${jobDescription}"
      
      INSTRUÇÕES DE SAÍDA:
      Retorne APENAS um objeto JSON válido seguindo estritamente este schema.`
    },
    ...files.map((f) => ({
      inlineData: {
        mimeType: f.file.type,
        data: f.base64,
      },
    })),
  ];

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      isJobDescriptionValid: { type: Type.BOOLEAN, description: "True se a JD for válida." },
      jobDescriptionFeedback: { type: Type.STRING, description: "Motivo em PT-BR se a JD for inválida." },
      candidates: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            isResume: { type: Type.BOOLEAN, description: "True se o arquivo for um currículo." },
            notResumeReason: { type: Type.STRING, description: "Motivo em PT-BR se o arquivo não for currículo." },
            matchScore: { type: Type.NUMBER, description: "Nota geral 0-100" },
            technicalFit: { type: Type.NUMBER, description: "Eixo X nota 0-100" },
            potentialFit: { type: Type.NUMBER, description: "Eixo Y nota 0-100" },
            summary: { type: Type.STRING, description: "Resumo em PT-BR" },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },
            yearsOfExperience: { type: Type.NUMBER },
          },
          required: ["name", "isResume", "matchScore", "technicalFit", "potentialFit", "summary", "pros", "cons"],
        },
      },
      marketSummary: { type: Type.STRING, description: "Resumo de mercado comparando os candidatos VÁLIDOS em PT-BR." },
      recommendation: { type: Type.STRING, description: "Recomendação final sobre quem entrevistar em PT-BR." },
      bestCandidateId: { type: Type.STRING },
    },
    required: ["candidates", "marketSummary", "recommendation", "isJobDescriptionValid"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        role: "user",
        parts: parts,
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return parseJSON(text);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};