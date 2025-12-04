export interface Candidate {
  id: string;
  name: string;
  matchScore: number; // 0-100 (Overall)
  technicalFit: number; // 0-100 (X-axis)
  potentialFit: number; // 0-100 (Y-axis: Soft skills, adaptability, potential)
  summary: string;
  pros: string[];
  cons: string[];
  yearsOfExperience: number;
  isResume: boolean; // New: Validation flag
  notResumeReason?: string; // New: Reason if invalid
}

export interface AnalysisResult {
  isJobDescriptionValid: boolean; // New: Validation flag
  jobDescriptionFeedback?: string; // New: Reason if invalid
  candidates: Candidate[];
  marketSummary: string;
  recommendation: string;
  bestCandidateId: string;
}

export interface FileData {
  file: File;
  base64: string;
}