import { AnalysisResult, TokenUsage } from "../types";
import { saveRecord } from "../supabaseClient";
import { getCurrentUser } from "./authService";

/**
 * Saves the analysis result to Supabase.
 * Requires a table named 'analysis_history' in Supabase.
 */
export const saveAnalysisHistory = async (
    jobDescription: string,
    result: AnalysisResult,
    tokenUsage: TokenUsage
): Promise<void> => {
    try {
        const user = await getCurrentUser();
        
        // Prepare payload for Supabase
        const payload = {
            user_id: user?.id || null, // If authenticated, link to user
            job_description: jobDescription,
            recommendation: result.recommendation,
            best_candidate_name: result.candidates.find(c => c.id === result.bestCandidateId)?.name || 'Unknown',
            candidates_count: result.candidates.length,
            tokens_input: tokenUsage.inputTokens,
            tokens_output: tokenUsage.outputTokens,
            tokens_total: tokenUsage.totalTokens,
            created_at: new Date().toISOString(),
            full_result_json: result // Storing full JSON for future reference
        };

        // Use the generic save function
        await saveRecord('analysis_history', payload);
        
        console.log("Analysis saved to Supabase successfully.");
    } catch (error: any) {
        // We log the error but don't stop the UI flow, as saving history is a background task
        console.error("Failed to save analysis history to Supabase:", error);
        
        // Helper for developers/setup
        if (error.message?.includes('relation "public.analysis_history" does not exist') || error.code === '42P01') {
            console.warn("⚠️ A tabela 'analysis_history' não foi encontrada no Supabase. Execute o script 'supabase_setup.sql' no seu SQL Editor.");
        }
    }
};