import React from 'react';
import { AlertTriangle, RefreshCcw, FileSearch } from 'lucide-react';

interface ErrorScreenProps {
  onRetry: () => void;
  message?: string;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ onRetry, message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 max-w-2xl mx-auto">
      <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-amber-600" />
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">
        Não foi possível concluir a análise
      </h2>

      {message ? (
          <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg mb-8 text-center text-sm font-medium w-full">
            {message}
          </div>
      ) : (
          <p className="text-slate-600 text-center mb-8 leading-relaxed">
            Ocorreu um problema ao processar os currículos ou a descrição da vaga. 
            Isso geralmente acontece quando os dados não estão legíveis para a Inteligência Artificial.
          </p>
      )}

      <div className="w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-blue-600" />
          Boas Práticas para uma Nova Análise:
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-sm text-slate-700">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></span>
            <span>
              <strong>Conteúdo dos Arquivos:</strong> Certifique-se de que os arquivos são realmente currículos. Documentos como receitas, faturas ou imagens aleatórias serão rejeitados.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm text-slate-700">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></span>
            <span>
              <strong>Evite PDFs escaneados (imagens):</strong> O sistema precisa de PDFs onde o texto seja selecionável.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm text-slate-700">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></span>
            <span>
              <strong>Descrição da Vaga:</strong> Verifique se a descrição da vaga é coerente. Textos muito curtos ou sem sentido podem impedir a análise.
            </span>
          </li>
        </ul>
      </div>

      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-8 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all font-medium shadow-lg shadow-blue-100 hover:shadow-xl hover:-translate-y-0.5"
      >
        <RefreshCcw className="w-4 h-4" />
        Tentar Novamente
      </button>
    </div>
  );
};