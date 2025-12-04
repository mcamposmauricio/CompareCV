import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-700 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🔎</span>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-blue-950 mb-2">Analisando Perfis...</h2>
      <p className="text-slate-500 max-w-md animate-pulse">
        Nossa IA está lendo os currículos, comparando com a descrição da vaga e gerando os resultados.
      </p>
      
      <div className="mt-8 space-y-2 max-w-xs w-full mx-auto">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-700 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
      
      <style>{`
        @keyframes loading {
            0% { width: 0%; margin-left: 0; }
            50% { width: 100%; margin-left: 0; }
            100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
};