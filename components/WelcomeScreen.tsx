import React from 'react';
import { ArrowRight, Upload, UserCheck, FileText, CheckCircle2 } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4">
      <div className="max-w-4xl w-full text-center">
        
        {/* Logo Mark */}
        <div className="mx-auto w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-200">
            <UserCheck className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-blue-950 tracking-tight mb-6">
          Compare<span className="text-blue-600">CV</span>
        </h1>
        
        <p className="text-lg text-slate-600 mb-12 font-normal leading-relaxed max-w-lg mx-auto">
          Simplifique seu processo de recrutamento. Nossa IA lê currículos e indica os melhores candidatos para sua vaga com precisão e rapidez.
        </p>

        {/* Informative Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 hover:border-blue-200 group">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <Upload className="w-5 h-5 text-blue-700" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">1. Enviar Dados</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Faça o upload dos currículos (PDF) e cole a descrição detalhada da vaga. Quanto mais detalhes, melhor a análise.
                </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 hover:border-blue-200 group">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <FileText className="w-5 h-5 text-blue-700" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">2. Análise Inteligente</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  O sistema avalia critérios técnicos (Hard Skills) e comportamentais (Soft Skills) automaticamente.
                </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 hover:border-blue-200 group">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-blue-700" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">3. Ranking e Decisão</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Receba uma matriz visual, tabela comparativa e recomendação do candidato ideal para entrevista.
                </p>
            </div>
        </div>

        <button 
            onClick={onStart}
            className="group inline-flex items-center justify-center px-10 py-4 text-base font-medium text-white bg-blue-700 rounded-full hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5"
        >
            Começar Agora
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};