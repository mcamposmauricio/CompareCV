import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  ReferenceLine,
  Cell,
  LabelList
} from 'recharts';
import { Candidate } from '../types';

interface NineBoxChartProps {
  candidates: Candidate[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg text-sm z-50">
        <p className="font-bold text-blue-900 mb-1">{data.name}</p>
        <p className="text-blue-600 font-semibold">Match: {data.matchScore}%</p>
        <p className="text-gray-500 text-xs">Técnico: {data.technicalFit} | Soft/Potencial: {data.potentialFit}</p>
      </div>
    );
  }
  return null;
};

export const NineBoxChart: React.FC<NineBoxChartProps> = ({ candidates }) => {
  
  // Explicitly filter for candidates with >= 50 match score to avoid pollution, even if parent filters too.
  const validCandidates = candidates.filter(c => c.isResume && c.matchScore >= 50);

  const getColor = (score: number) => {
      if (score >= 85) return '#10b981'; 
      if (score >= 60) return '#f59e0b'; 
      return '#ef4444'; 
  };

  return (
    <div className="w-full h-[500px] relative bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-slate-800 mb-2 text-center">Matriz de Adequação (9-Box)</h3>
      
      {/* Background Labels for Quadrants */}
      <div className="absolute inset-0 pt-12 pb-10 pl-12 pr-4 pointer-events-none z-0 grid grid-cols-3 grid-rows-3 gap-0.5 opacity-10">
         <div className="bg-gray-400"></div> {/* High Pot / Low Tech */}
         <div className="bg-gray-600"></div>
         <div className="bg-green-600"></div> {/* High Pot / High Tech (Star) */}
         
         <div className="bg-gray-300"></div>
         <div className="bg-gray-400"></div>
         <div className="bg-gray-600"></div>

         <div className="bg-gray-200"></div>
         <div className="bg-gray-300"></div>
         <div className="bg-gray-400"></div>
      </div>
      
      <div className="absolute top-1/2 left-4 -translate-y-1/2 -rotate-90 text-xs font-bold text-slate-400 tracking-wider">
        POTENCIAL / SOFT SKILLS
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400 tracking-wider">
        TÉCNICO / HARD SKILLS
      </div>

      <div className="absolute top-12 right-6 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100">
        CANDIDATO IDEAL
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 30,
            right: 30,
            bottom: 30,
            left: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={false} />
          <XAxis 
            type="number" 
            dataKey="technicalFit" 
            name="Técnico" 
            domain={[0, 100]} 
            tick={false} 
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            type="number" 
            dataKey="potentialFit" 
            name="Potencial" 
            domain={[0, 100]} 
            tick={false} 
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <ZAxis type="number" range={[100, 100]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          
          <ReferenceLine x={33.3} stroke="#e5e7eb" strokeDasharray="3 3" />
          <ReferenceLine x={66.6} stroke="#e5e7eb" strokeDasharray="3 3" />
          <ReferenceLine y={33.3} stroke="#e5e7eb" strokeDasharray="3 3" />
          <ReferenceLine y={66.6} stroke="#e5e7eb" strokeDasharray="3 3" />

          <Scatter name="Candidatos" data={validCandidates} fill="#1d4ed8">
            {validCandidates.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.matchScore)} stroke="#fff" strokeWidth={2} />
            ))}
            <LabelList dataKey="name" position="top" style={{ fontSize: '11px', fontWeight: 600, fill: '#1e3a8a' }} />
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};