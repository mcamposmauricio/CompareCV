import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, FileData } from "../types";

const parseJSON = (text: string): any => {
    try {
        return JSON.parse(text);
    } catch (e) {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
    }
};

export const analyzeResumes = async (
  jobDescription: string,
  files: FileData[]
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Convert text/plain files to text parts to avoid 500 errors with inlineData for text
  const fileParts = files.map((f) => {
    if (f.file.type === 'text/plain') {
        try {
            const textContent = atob(f.base64);
            return {
                text: `\n=== CONTEÚDO DO ARQUIVO: ${f.file.name} ===\n${textContent}\n=== FIM DO ARQUIVO ===\n`
            };
        } catch (e) {
            // Fallback if decode fails
            return {
                inlineData: {
                    mimeType: f.file.type,
                    data: f.base64,
                },
            };
        }
    }
    
    return {
      inlineData: {
        mimeType: f.file.type,
        data: f.base64,
      },
    };
  });

  const promptPart = {
      text: `Você é um Headhunter de Elite e Especialista em Psicologia Organizacional.
      
      IDIOMA DE SAÍDA: PORTUGUÊS (PT-BR).
      
      REGRA DE OURO (ANTI-ALUCINAÇÃO):
      NUNCA invente informações. Se uma informação específica (como pretensão salarial, tempo médio, ou modelo de trabalho) não estiver explícita ou fortemente implícita no documento, o valor deve ser EXATAMENTE a string "Sem dados suficientes". Não tente adivinhar.

      CONTEXTO:
      Analise ${files.length} arquivos (candidatos) contra uma Descrição de Vaga (Job Description).
      
      TAREFA DE VALIDAÇÃO:
      1. Valide a Job Description (isJobDescriptionValid).
      2. Valide se cada arquivo é um currículo (isResume).

      TAREFA DE ANÁLISE PROFUNDA (Para currículos válidos):
      
      1. **Informações Inferidas:**
         - Calcule o tempo médio de permanência (Tenure). Se não houver datas, "Sem dados suficientes".
         - Compare a senioridade que ele diz ter vs. a que ele aparenta ter.
         - Identifique pretensão salarial e modelo de trabalho. Se não mencionado, use "Sem dados suficientes".
      
      2. **Soft Skills (0-100):**
         Avalie: Comunicação, Organização, Autonomia, Capacidade Analítica, Colaboração, Aprendizado Rápido, Resolução de Problemas, Clareza na Escrita.
         Se não houver evidências no texto para avaliar uma skill, coloque nota 0 e no reasoning coloque "Sem dados suficientes para avaliar".
      
      3. **Fit Cultural:**
         Defina se o candidato é orientado a: Resultados, Processos, Pessoas ou Inovação. Dê uma nota de aderência cultural geral.
      
      4. **Red Flags (Riscos):**
         Identifique Job Hopping (alta rotatividade), lacunas (gaps) não explicados, estagnação, regressão de cargo, ou falta de resultados quantitativos.
      
      5. **Gap Analysis:**
         Mapeie skills Fortes, Medianas e Fracas/Inexistentes e o impacto disso na vaga (Baixo/Médio/Alto).
      
      6. **Recomendação Final:**
         Escreva um parágrafo MUITO SUCINTO (máximo 5 linhas) justificando a escolha do melhor candidato. Seja direto.

      JOB DESCRIPTION:
      "${jobDescription}"
      
      SAÍDA ESPERADA: JSON estrito seguindo o schema.`
  };

  const parts = [promptPart, ...fileParts];

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      isJobDescriptionValid: { type: Type.BOOLEAN },
      jobDescriptionFeedback: { type: Type.STRING },
      candidates: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            isResume: { type: Type.BOOLEAN },
            notResumeReason: { type: Type.STRING },
            
            // Core
            matchScore: { type: Type.NUMBER },
            technicalFit: { type: Type.NUMBER },
            potentialFit: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            yearsOfExperience: { type: Type.NUMBER },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },

            // Inferred Info
            inferredInfo: {
                type: Type.OBJECT,
                properties: {
                    salaryExpectation: { type: Type.STRING, description: "Valor ou 'Sem dados suficientes'" },
                    availability: { type: Type.STRING, description: "Ex: Imediata, ou 'Sem dados suficientes'" },
                    workModel: { type: Type.STRING, description: "Remoto, Híbrido, Presencial ou 'Sem dados suficientes'" },
                    perceivedSeniority: { type: Type.STRING },
                    selfReportedSeniority: { type: Type.STRING },
                    averageTenure: { type: Type.STRING, description: "Tempo médio ou 'Sem dados suficientes'" },
                    languages: { 
                        type: Type.ARRAY, 
                        items: { 
                            type: Type.OBJECT,
                            properties: {
                                language: { type: Type.STRING },
                                proficiency: { type: Type.STRING },
                                justification: { type: Type.STRING }
                            }
                        } 
                    },
                    keyTools: { type: Type.ARRAY, items: { type: Type.STRING } },
                    certifications: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            },

            // Soft Skills
            softSkills: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        skill: { type: Type.STRING },
                        score: { type: Type.NUMBER },
                        reasoning: { type: Type.STRING }
                    }
                }
            },

            // Cultural Fit
            culturalFit: {
                type: Type.OBJECT,
                properties: {
                    score: { type: Type.NUMBER },
                    reasoning: { type: Type.STRING },
                    orientation: { type: Type.STRING, enum: ['Resultados', 'Processos', 'Pessoas', 'Inovação'] }
                }
            },

            // Red Flags
            redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },

            // Gap Analysis
            gapAnalysis: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        skillName: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ['Strong', 'Medium', 'Weak'] },
                        impact: { type: Type.STRING, enum: ['Baixo', 'Médio', 'Alto'] }
                    }
                }
            }
          },
          required: ["name", "isResume", "matchScore", "inferredInfo", "softSkills", "culturalFit", "redFlags", "gapAnalysis"]
        },
      },
      recommendation: { type: Type.STRING },
      bestCandidateId: { type: Type.STRING },
    },
    required: ["candidates", "recommendation", "isJobDescriptionValid"],
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
        temperature: 0.1, // Lower temp for more analytical/strict output
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const parsedData = parseJSON(text);

    return {
        ...parsedData,
        tokenUsage: {
            inputTokens: response.usageMetadata?.promptTokenCount || 0,
            outputTokens: response.usageMetadata?.candidatesTokenCount || 0,
            totalTokens: response.usageMetadata?.totalTokenCount || 0
        }
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};