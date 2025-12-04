export interface SoftSkill {
  skill: string;
  score: number; // 0-100
  reasoning: string;
}

export interface CulturalFit {
  score: number; // 0-100
  reasoning: string;
  orientation: 'Resultados' | 'Processos' | 'Pessoas' | 'Inovação';
}

export interface SkillGap {
  skillName: string;
  type: 'Strong' | 'Medium' | 'Weak';
  impact: 'Baixo' | 'Médio' | 'Alto';
}

export interface InterviewQuestions {
  technical: string[];
  behavioral: string[];
  cultural: string[];
  logistical: string[];
}

export interface InferredInfo {
  salaryExpectation: string; // "Sem dados suficientes" or value
  availability: string;
  workModel: string; // Remote, Hybrid, On-site, or "Sem dados suficientes"
  perceivedSeniority: string; // Junior, Pleno, Senior, Specialist
  selfReportedSeniority: string;
  averageTenure: string; // e.g. "2.5 anos" or "Sem dados suficientes"
  languages: { language: string; proficiency: string; justification: string }[];
  keyTools: string[]; // Only deep knowledge
  certifications: string[];
}

export interface Candidate {
  id: string;
  name: string;
  isResume: boolean;
  notResumeReason?: string;
  
  // Core Metrics
  matchScore: number; // 0-100 (Overall)
  technicalFit: number; // 0-100
  potentialFit: number; // 0-100
  
  // Summaries
  summary: string;
  yearsOfExperience: number;
  
  // New Sections
  inferredInfo: InferredInfo;
  softSkills: SoftSkill[];
  culturalFit: CulturalFit;
  redFlags: string[];
  gapAnalysis: SkillGap[];
  interviewQuestions: InterviewQuestions;
  
  // Comparison
  pros: string[]; // Legacy but useful
  cons: string[]; // Legacy but useful
}

export interface AnalysisResult {
  isJobDescriptionValid: boolean;
  jobDescriptionFeedback?: string;
  candidates: Candidate[];
  recommendation: string;
  bestCandidateId: string;
}

export interface FileData {
  file: File;
  base64: string;
}