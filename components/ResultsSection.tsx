import React from 'react';
import { AnalysisResult } from '../types';
import { NineBoxChart } from './NineBoxChart';
import { CheckCircle, AlertTriangle, User, Star, TrendingUp, Table as TableIcon, Download, RefreshCcw, ArrowLeft, UserCheck, FileWarning } from 'lucide-react';

interface ResultsSectionProps {
  result: AnalysisResult | null;
  onReset: () => void;
}

const ScoreBadge = ({ score }: { score: number }) => {
  let colorClass = 'bg-red-50 text-red-700 border-red-100';
  if (score >= 85) colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-100';
  else if (score >= 60) colorClass = 'bg-amber-50 text-amber-700 border-amber-100';

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${colorClass} print:border-slate-300`}>
      {score}% Match
    </span>
  );
};

export const ResultsSection: React.FC<ResultsSectionProps> = ({ result, onReset }) => {
  if (!result) return null;

  // Split candidates into Valid (Resumes) and Invalid (Not Resumes)
  const validCandidates = result.candidates.filter(c => c.isResume).sort((a, b) => b.matchScore - a.matchScore);
  const invalidFiles = result.candidates.filter(c => !c.isResume);
  
  const bestCandidate = validCandidates[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Action Bar (Hidden on Print) */}
      <div className="no-print flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <button 
            onClick={onReset}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-900 font-medium transition-colors text-sm"
        >
            <ArrowLeft className="w-4 h-4" />
            Voltar
        </button>
        
        <div className="flex gap-3">
            <button 
                onClick={onReset}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none"
            >
                <RefreshCcw className="w-4 h-4" />
                Nova Análise
            </button>
            <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-700 border border-transparent rounded-lg hover:bg-blue-800 transition-all shadow-sm focus:outline-none hover:-translate-y-0.5"
            >
                <Download className="w-4 h-4" />
                Baixar PDF
            </button>
        </div>
      </div>

      {/* Report Header (Visible mainly on Print) */}
      <div className="hidden print:flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
        <div>
            <h1 className="text-2xl font-bold text-blue-950">Relatório Comparativo</h1>
            <p className="text-slate-500 text-sm mt-1">Gerado por CompareCV em {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-700" />
            <span className="font-bold text-blue-900">CompareCV</span>
        </div>
      </div>

      {/* WARNING SECTION FOR INVALID FILES */}
      {invalidFiles.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 avoid-break">
            <h4 className="text-amber-800 font-bold flex items-center gap-2 mb-2 text-sm uppercase tracking-wide">
                <FileWarning className="w-4 h-4" />
                Arquivos Ignorados
            </h4>
            <p className="text-xs text-amber-700 mb-3">
                Os seguintes arquivos foram ignorados pois não foram identificados como currículos válidos:
            </p>
            <ul className="space-y-1">
                {invalidFiles.map((file, idx) => (
                    <li key={idx} className="text-sm text-amber-900 flex items-start gap-2 bg-white/50 p-2 rounded border border-amber-100">
                        <span className="font-semibold">{file.name || 'Arquivo sem nome'}:</span>
                        <span className="italic opacity-80">{file.notResumeReason || 'Conteúdo não compatível'}</span>
                    </li>
                ))}
            </ul>
          </div>
      )}

      {/* Matrix Chart - Full Width */}
      <div className="avoid-break bg-white rounded-2xl shadow-sm border border-slate-200 p-1">
           <NineBoxChart candidates={validCandidates} />
      </div>

      {/* Recommendation Card - Below Matrix */}
      <div className="bg-blue-900 rounded-2xl shadow-xl p-8 text-white flex flex-col justify-between print:bg-white print:text-black print:border print:border-slate-300 print:shadow-none avoid-break">
        <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-white/10 rounded-lg print:bg-slate-100">
                        <Star className="w-5 h-5 text-yellow-300 fill-yellow-300 print:text-slate-900" />
                    </div>
                    <h2 className="text-lg font-bold tracking-wide text-white print:text-slate-900">Recomendação</h2>
                </div>
                <p className="text-blue-100 leading-relaxed font-light print:text-slate-800 text-sm md:text-base">
                    {result.recommendation}
                </p>
            </div>
            
            {bestCandidate && (
                <div className="md:w-1/3 min-w-[250px]">
                    <div className="bg-white/5 rounded-xl p-5 backdrop-blur-sm border border-white/10 print:border-slate-200 print:bg-slate-50 h-full flex flex-col justify-center">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-blue-200 mb-2 print:text-slate-500">Candidato em Destaque</p>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-xl font-bold truncate text-white print:text-slate-900">{bestCandidate.name}</span>
                            <span className="text-xl font-bold text-emerald-300 print:text-emerald-700">{bestCandidate.matchScore}%</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Market Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 avoid-break">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Panorama Geral
        </h3>
        <p className="text-slate-600 leading-relaxed text-sm text-justify">
            {result.marketSummary}
        </p>
      </div>

      <div className="page-break"></div>

      {/* Comparative Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200 avoid-break">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 print:bg-white">
           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <TableIcon className="w-5 h-5 text-blue-600" />
            Ranking Detalhado
           </h3>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50 print:bg-slate-100">
                    <tr>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Rank</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidato</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Técnico</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Potencial</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Exp.</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                    {validCandidates.map((candidate, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-medium">
                                #{idx + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-slate-900">{candidate.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <ScoreBadge score={candidate.matchScore} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                <span className="print:hidden">
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[80px] mb-1">
                                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${candidate.technicalFit}%` }}></div>
                                    </div>
                                </span>
                                <span className="text-xs block font-medium">{candidate.technicalFit}%</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                <span className="print:hidden">
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[80px] mb-1">
                                        <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${candidate.potentialFit}%` }}></div>
                                    </div>
                                </span>
                                <span className="text-xs block font-medium">{candidate.potentialFit}%</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                {candidate.yearsOfExperience} anos
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      <div className="page-break"></div>

      {/* Candidate Detail Cards */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-800 px-1 mt-8 border-b border-slate-200 pb-3">Análise Individual</h3>
        {validCandidates.map((candidate, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 avoid-break hover:border-blue-200 transition-colors">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-xl print:border print:border-slate-200">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{candidate.name}</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded">Exp: {candidate.yearsOfExperience} anos</span>
                    <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded">Técnico: {candidate.technicalFit}/100</span>
                    <span className="text-xs font-medium text-purple-700 bg-purple-50 border border-purple-100 px-2 py-1 rounded">Potencial: {candidate.potentialFit}/100</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <ScoreBadge score={candidate.matchScore} />
              </div>
            </div>

            <p className="text-slate-600 text-sm mb-6 border-l-2 border-blue-100 pl-4 italic leading-relaxed print:border-slate-300">
              "{candidate.summary}"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100 print:bg-white print:border print:border-slate-200">
                <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Pontos Fortes
                </h5>
                <ul className="space-y-2">
                  {candidate.pros.map((pro, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="w-1 h-1 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                        {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50/50 rounded-xl p-5 border border-red-100 print:bg-white print:border print:border-slate-200">
                <h5 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Pontos de Atenção
                </h5>
                <ul className="space-y-2">
                  {candidate.cons.map((con, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                        {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};