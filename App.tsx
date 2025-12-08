import React, { useState, useEffect } from 'react';
import { InputSection } from './components/InputSection';
import { ResultsSection } from './components/ResultsSection';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorScreen } from './components/ErrorScreen';
import { analyzeResumes } from './services/geminiService';
import { saveAnalysisHistory } from './services/databaseService';
import { getCurrentUser, logoutUser } from './services/authService';
import { FileData, AnalysisResult, User, TokenUsage } from './types';
import { UserCheck, LogOut, User as UserIcon } from 'lucide-react';
import { supabase } from './supabaseClient';

type Step = 'welcome' | 'input' | 'loading' | 'results' | 'error';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('welcome');
  const [files, setFiles] = useState<FileData[]>([]);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Check auth status on mount and listen for changes
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkUser();

    // Listen for auth state changes (e.g. session expiry, sign in from another tab)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
             const currentUser = await getCurrentUser(); // Re-map to our user type
             setUser(currentUser);
        } else {
             setUser(null);
             setStep('welcome');
        }
    });

    return () => {
        authListener.subscription.unsubscribe();
    };
  }, []);

  const handleFilesSelected = (newFiles: FileData[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileRemove = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    // Stay on welcome screen but update state, user can click "Start" if we add one, 
    // or we can auto-advance. Let's auto-advance to input for better UX.
    setStep('input'); 
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setStep('welcome');
    setFiles([]);
    setJobDescription('');
    setResult(null);
  };

  const handleStart = () => {
    if (user) {
        setStep('input');
    }
  };

  const handleReset = () => {
    // If user is logged in, go to input, else welcome
    setStep(user ? 'input' : 'welcome');
    setFiles([]);
    setJobDescription('');
    setResult(null);
    setErrorMessage(undefined);
    setTokenUsage(null);
  };

  // Used when retrying from error screen - keeps data but goes back to input
  const handleRetry = () => {
    setStep('input');
    setErrorMessage(undefined);
  };

  const handleAnalyze = async () => {
    if (files.length === 0 || !jobDescription) return;

    setStep('loading');
    setErrorMessage(undefined);

    try {
      const data = await analyzeResumes(jobDescription, files);
      
      // Validation Check 1: Job Description
      if (!data.isJobDescriptionValid) {
         setErrorMessage(data.jobDescriptionFeedback || "A descrição da vaga fornecida não parece válida ou está ininteligível.");
         setStep('error');
         return;
      }

      // Validation Check 2: At least one valid resume
      const validCandidates = data.candidates.filter(c => c.isResume);
      if (validCandidates.length === 0) {
        setErrorMessage("Nenhum dos arquivos enviados foi identificado como um currículo válido.");
        setStep('error');
        return;
      }

      setResult(data);
      
      // Handle Token Usage if available
      const usage = data.tokenUsage || { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
      setTokenUsage(usage);

      // Persist to Database (Supabase)
      await saveAnalysisHistory(jobDescription, data, usage);

      setStep('results');
    } catch (err) {
      console.error(err);
      setErrorMessage("Ocorreu um erro técnico ao comunicar com a IA.");
      setStep('error');
    }
  };

  if (isAuthLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
      );
  }

  return (
    <div className="min-h-screen flex flex-col font-inter bg-slate-50">
      {/* Header (Hidden on Print) */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 no-print">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => user ? setStep('input') : setStep('welcome')} 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="bg-blue-700 p-1.5 rounded-lg">
                <UserCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-blue-950 tracking-tight">
              Compare<span className="text-blue-600 font-medium">CV</span>
            </h1>
          </button>
          
          <div className="flex items-center gap-6">
              {/* Progress Indicator - Only show if logged in and analyzing */}
              {user && step !== 'welcome' && step !== 'error' && (
                <div className="hidden md:flex items-center gap-3 text-xs font-medium text-slate-400">
                    <span className={`px-2.5 py-1 rounded-full ${step === 'input' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'}`}>1</span>
                    <div className="w-4 h-px bg-slate-200"></div>
                    <span className={`px-2.5 py-1 rounded-full ${step === 'loading' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'}`}>2</span>
                    <div className="w-4 h-px bg-slate-200"></div>
                    <span className={`px-2.5 py-1 rounded-full ${step === 'results' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'}`}>3</span>
                </div>
              )}

              {/* User Profile / Logout */}
              {user && (
                  <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                      <div className="hidden sm:block text-right">
                          <p className="text-xs font-bold text-slate-800">{user.name}</p>
                          <p className="text-[10px] text-slate-500 truncate max-w-[100px]">{user.company}</p>
                      </div>
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                          <UserIcon className="w-4 h-4" />
                      </div>
                      <button 
                        onClick={handleLogout}
                        title="Sair"
                        className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full text-slate-400 transition-colors"
                      >
                          <LogOut className="w-4 h-4" />
                      </button>
                  </div>
              )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto px-6 py-10 w-full">
        
        {/* Wizard Render Logic */}
        {step === 'welcome' && (
            <WelcomeScreen onStart={handleStart} onLoginSuccess={handleLoginSuccess} />
        )}

        {/* Protected Routes */}
        {user && (
            <>
                {step === 'input' && (
                    <div className="max-w-3xl mx-auto">
                        <InputSection 
                            files={files}
                            onFilesSelected={handleFilesSelected}
                            onFileRemove={handleFileRemove}
                            jobDescription={jobDescription}
                            onJobDescriptionChange={setJobDescription}
                            onAnalyze={handleAnalyze}
                            isLoading={false}
                        />
                    </div>
                )}

                {step === 'loading' && (
                    <LoadingScreen />
                )}

                {step === 'results' && (
                    <ResultsSection result={result} onReset={handleReset} tokenUsage={tokenUsage} />
                )}

                {step === 'error' && (
                    <ErrorScreen onRetry={handleRetry} message={errorMessage} />
                )}
            </>
        )}

        {!user && step !== 'welcome' && (
            <div className="text-center py-20">
                <p className="text-slate-500">Por favor, faça login para continuar.</p>
                <button onClick={() => setStep('welcome')} className="text-blue-600 font-bold mt-4 underline">Voltar ao início</button>
            </div>
        )}

      </main>

      {/* Footer (Hidden on Print) */}
      <footer className="bg-white border-t border-slate-100 mt-auto no-print">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <p className="text-center text-slate-400 text-xs">
            &copy; {new Date().getFullYear()} CompareCV. Ferramenta de apoio à decisão de RH.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;