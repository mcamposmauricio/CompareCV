import React from 'react';
import { Upload, UserCheck, FileText, CheckCircle2 } from 'lucide-react';
import { AuthForm } from './AuthForm';
import { User } from '../types';

interface WelcomeScreenProps {
  onStart: () => void;
  onLoginSuccess: (user: User) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLoginSuccess }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-[80vh] gap-12 lg:gap-24 px-4 py-8">
      
      {/* Left Column: Value Proposition */}
      <div className="max-w-xl w-full text-center lg:text-left">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <UserCheck className="w-4 h-4" />
            Inteligência Artificial para RH
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-950 tracking-tight mb-6 leading-tight">
          Encontre o talento certo, <span className="text-blue-600">mais rápido.</span>
        </h1>
        
        <p className="text-lg text-slate-600 mb-10 font-normal leading-relaxed">
          O CompareCV lê currículos, compara com sua vaga e entrega um ranking detalhado com análise técnica e comportamental em segundos.
        </p>

        {/* Informative Steps Small */}
        <div className="space-y-6">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 text-blue-600">
                    <Upload className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">1. Upload Simples</h3>
                    <p className="text-sm text-slate-500">Envie currículos em PDF e a descrição da vaga.</p>
                </div>
            </div>
            
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 text-blue-600">
                    <FileText className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">2. Análise Profunda</h3>
                    <p className="text-sm text-slate-500">IA avalia Hard & Soft Skills, Gaps e Fit Cultural.</p>
                </div>
            </div>

            <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 text-blue-600">
                    <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">3. Decisão Inteligente</h3>
                    <p className="text-sm text-slate-500">Ranking 9-Box e tabela comparativa para decisão.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="w-full max-w-md flex justify-center lg:justify-end">
          <AuthForm onSuccess={onLoginSuccess} />
      </div>
    </div>
  );
};