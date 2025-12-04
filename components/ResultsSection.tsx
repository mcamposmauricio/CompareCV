import React, { useState } from 'react';
import { AnalysisResult, Candidate, SkillGap, SoftSkill } from '../types';
import { NineBoxChart } from './NineBoxChart';
import { 
    CheckCircle, AlertTriangle, User, Star, TrendingUp, Table as TableIcon, 
    Download, RefreshCcw, ArrowLeft, UserCheck, FileWarning, Briefcase, 
    Clock, Award, Brain, Target, MessageSquare, Zap, AlertCircle, HelpCircle,
    ChevronDown, ChevronUp
} from 'lucide-react';

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

const ImpactBadge = ({ impact }: { impact: 'Baixo' | 'Médio' | 'Alto' }) => {
    const colors = {
        'Baixo': 'bg-slate-100 text-slate-600',
        'Médio': 'bg-amber-100 text-amber-700',
        'Alto': 'bg-red-100 text-red-700'
    };
    return <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${colors[impact]}`}>{impact}</span>;
};

// Component for Soft Skill Bar
const SoftSkillBar: React.FC<{ skill: SoftSkill }> = ({ skill }) => (
    <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-slate-700">{skill.skill}</span>
            <span className="text-slate-500 font-bold">{skill.score > 0 ? skill.score : 'N/A'}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
            <div 
                className={`h-2 rounded-full ${skill.score === 0 ? 'bg-slate-300' : skill.score >= 80 ? 'bg-emerald-500' : skill.score >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`} 
                style={{ width: `${skill.score}%` }}
            ></div>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 truncate" title={skill.reasoning}>{skill.reasoning}</p>
    </div>
);

// Component for Individual Candidate Detail
const CandidateDetailCard: React.FC<{ candidate: Candidate }> = ({ candidate }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden avoid-break hover:border-blue-300 transition-colors mb-8">
            {/* Header */}
            <div 
                className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer bg-slate-50/30"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <User className="w-6 h-6 text-blue-700" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-slate-900">{candidate.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {candidate.yearsOfExperience} anos exp.</span>
                            <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {candidate.inferredInfo.perceivedSeniority}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-2xl font-bold text-blue-900">{candidate.matchScore}%</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Match Geral</div>
                    </div>
                    {isExpanded ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                </div>
            </div>

            {isExpanded && (
                <div className="p-6 md:p-8 space-y-8">
                    
                    {/* Section 1: Inferred Info & Cultural Fit */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            <h5 className="text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                                <Brain className="w-4 h-4" /> Inteligência de Dados
                            </h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <div className="text-xs text-slate-500 mb-1">Pretensão (Est.)</div>
                                    <div className="text-sm font-bold text-slate-800 truncate" title={candidate.inferredInfo.salaryExpectation}>{candidate.inferredInfo.salaryExpectation}</div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <div className="text-xs text-slate-500 mb-1">Tenure Médio</div>
                                    <div className="text-sm font-bold text-slate-800">{candidate.inferredInfo.averageTenure}</div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <div className="text-xs text-slate-500 mb-1">Modelo Ideal</div>
                                    <div className="text-sm font-bold text-slate-800">{candidate.inferredInfo.workModel}</div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <div className="text-xs text-slate-500 mb-1">Senioridade Real</div>
                                    <div className="text-sm font-bold text-slate-800">{candidate.inferredInfo.perceivedSeniority}</div>
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <h6 className="text-xs font-semibold text-slate-700 mb-2">Resumo Profissional</h6>
                                <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-blue-200 pl-3">"{candidate.summary}"</p>
                            </div>
                        </div>

                        {/* Cultural Fit */}
                        <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                            <h5 className="text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2 mb-4">
                                <Target className="w-4 h-4" /> Fit Cultural
                            </h5>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-3xl font-bold text-blue-800">{candidate.culturalFit.score}</span>
                                <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded font-bold uppercase">{candidate.culturalFit.orientation}</span>
                            </div>
                            <div className="w-full bg-white rounded-full h-2 mb-3">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${candidate.culturalFit.score}%` }}></div>
                            </div>
                            <p className="text-xs text-slate-600 leading-snug">{candidate.culturalFit.reasoning}</p>
                        </div>
                    </div>

                    {/* Section 2: Skills & Gaps */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-slate-100 pt-6">
                        {/* Soft Skills */}
                        <div>
                            <h5 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-4">
                                <Zap className="w-4 h-4 text-amber-500" /> Soft Skills (Comportamental)
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                {candidate.softSkills.map((skill, idx) => (
                                    <SoftSkillBar key={idx} skill={skill} />
                                ))}
                            </div>
                        </div>

                        {/* Gap Analysis */}
                        <div>
                             <h5 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-4">
                                <AlertCircle className="w-4 h-4 text-slate-500" /> Gap Analysis (Técnico)
                            </h5>
                            <div className="overflow-hidden border border-slate-100 rounded-lg">
                                <table className="min-w-full divide-y divide-slate-100">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Skill</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Nível</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Impacto</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-100">
                                        {candidate.gapAnalysis.map((gap, idx) => (
                                            <tr key={idx}>
                                                <td className="px-3 py-2 text-sm text-slate-700">{gap.skillName}</td>
                                                <td className="px-3 py-2 text-xs">
                                                    <span className={`px-2 py-0.5 rounded-full font-medium ${
                                                        gap.type === 'Strong' ? 'bg-emerald-100 text-emerald-700' :
                                                        gap.type === 'Medium' ? 'bg-blue-100 text-blue-700' : 'bg-red-50 text-red-700'
                                                    }`}>{gap.type}</span>
                                                </td>
                                                <td className="px-3 py-2"><ImpactBadge impact={gap.impact} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Risks & Interviews */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-slate-100 pt-6">
                         {/* Red Flags */}
                         <div className="bg-red-50/30 rounded-xl p-5 border border-red-100">
                            <h5 className="text-sm font-bold text-red-800 uppercase tracking-wider flex items-center gap-2 mb-4">
                                <AlertTriangle className="w-4 h-4" /> Red Flags (Riscos)
                            </h5>
                            {candidate.redFlags.length > 0 ? (
                                <ul className="space-y-2">
                                    {candidate.redFlags.map((flag, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-red-900 bg-white/60 p-2 rounded">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                            {flag}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-emerald-600 font-medium flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Nenhum risco crítico identificado.
                                </p>
                            )}
                        </div>

                        {/* Interview Guide */}
                        <div className="lg:col-span-2">
                            <h5 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-4">
                                <MessageSquare className="w-4 h-4 text-blue-600" /> Sugestões para uma possível entrevista
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <h6 className="text-xs font-bold text-blue-700 uppercase mb-2">Validação Técnica</h6>
                                    <ul className="list-disc list-inside space-y-1">
                                        {candidate.interviewQuestions.technical.slice(0, 3).map((q, i) => (
                                            <li key={i} className="text-xs text-slate-700">{q}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <h6 className="text-xs font-bold text-purple-700 uppercase mb-2">Comportamental</h6>
                                    <ul className="list-disc list-inside space-y-1">
                                        {candidate.interviewQuestions.behavioral.slice(0, 3).map((q, i) => (
                                            <li key={i} className="text-xs text-slate-700">{q}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <h6 className="text-xs font-bold text-emerald-700 uppercase mb-2">Fit Cultural</h6>
                                    <ul className="list-disc list-inside space-y-1">
                                        {candidate.interviewQuestions.cultural.slice(0, 3).map((q, i) => (
                                            <li key={i} className="text-xs text-slate-700">{q}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <h6 className="text-xs font-bold text-amber-700 uppercase mb-2">Logística & Expectativas</h6>
                                    <ul className="list-disc list-inside space-y-1">
                                        {candidate.interviewQuestions.logistical.slice(0, 3).map((q, i) => (
                                            <li key={i} className="text-xs text-slate-700">{q}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export const ResultsSection: React.FC<ResultsSectionProps> = ({ result, onReset }) => {
  if (!result) return null;

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
                Baixar Relatório
            </button>
        </div>
      </div>

      {/* Report Header (Visible mainly on Print) */}
      <div className="hidden print:flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
        <div>
            <h1 className="text-2xl font-bold text-blue-950">Relatório Executivo de Recrutamento</h1>
            <p className="text-slate-500 text-sm mt-1">Gerado por CompareCV</p>
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
            <ul className="space-y-1">
                {invalidFiles.map((file, idx) => (
                    <li key={idx} className="text-sm text-amber-900 flex items-start gap-2">
                        <span className="font-semibold">- {file.name || 'Arquivo sem nome'}:</span>
                        <span className="italic opacity-80">{file.notResumeReason}</span>
                    </li>
                ))}
            </ul>
          </div>
      )}

      {/* Matrix Chart */}
      <div className="avoid-break bg-white rounded-2xl shadow-sm border border-slate-200 p-1">
           <NineBoxChart candidates={validCandidates} />
      </div>

      {/* Recommendation Card */}
      <div className="bg-blue-900 rounded-2xl shadow-xl p-8 text-white flex flex-col justify-between print:bg-white print:text-black print:border print:border-slate-300 print:shadow-none avoid-break">
        <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-white/10 rounded-lg print:bg-slate-100">
                        <Star className="w-5 h-5 text-yellow-300 fill-yellow-300 print:text-slate-900" />
                    </div>
                    <h2 className="text-lg font-bold tracking-wide text-white print:text-slate-900">Recomendação da IA</h2>
                </div>
                <p className="text-blue-100 leading-relaxed font-light print:text-slate-800 text-sm md:text-base">
                    {result.recommendation}
                </p>
            </div>
            
            {bestCandidate && (
                <div className="md:w-1/3 min-w-[250px]">
                    <div className="bg-white/5 rounded-xl p-5 backdrop-blur-sm border border-white/10 print:border-slate-200 print:bg-slate-50 h-full flex flex-col justify-center">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-blue-200 mb-2 print:text-slate-500">Top Pick</p>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-xl font-bold truncate text-white print:text-slate-900">{bestCandidate.name}</span>
                            <span className="text-xl font-bold text-emerald-300 print:text-emerald-700">{bestCandidate.matchScore}%</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>

      <div className="page-break"></div>

      {/* Comparative Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200 avoid-break">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 print:bg-white">
           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <TableIcon className="w-5 h-5 text-blue-600" />
            Comparativo Estratégico
           </h3>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50 print:bg-slate-100">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Candidato</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Score</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Tech / Soft</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Fit Cultural</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Riscos</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Nível Est.</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                    {validCandidates.map((candidate, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm font-bold text-slate-900">{candidate.name}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <ScoreBadge score={candidate.matchScore} />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                                <div className="flex gap-2 text-xs">
                                    <span className="font-bold text-blue-600">T: {candidate.technicalFit}</span>
                                    <span className="text-slate-300">|</span>
                                    <span className="font-bold text-purple-600">S: {candidate.potentialFit}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-xs">
                                    <span className="block font-bold text-slate-700">{candidate.culturalFit.score}%</span>
                                    <span className="text-[10px] text-slate-500 uppercase">{candidate.culturalFit.orientation}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                {candidate.redFlags.length > 0 ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                                        <AlertTriangle className="w-3 h-3" /> {candidate.redFlags.length}
                                    </span>
                                ) : (
                                    <span className="text-xs text-emerald-600 font-medium">Safe</span>
                                )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600">
                                {candidate.inferredInfo.perceivedSeniority}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      <div className="page-break"></div>

      {/* Detailed Cards Section */}
      <div>
         <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            Análise Individual Aprofundada
         </h3>
         {validCandidates.map((candidate, idx) => (
             <CandidateDetailCard key={idx} candidate={candidate} />
         ))}
      </div>
    </div>
  );
};