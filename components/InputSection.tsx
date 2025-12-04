import React, { useRef } from 'react';
import { FileText, Upload, X, Briefcase, AlertCircle, Info } from 'lucide-react';
import { FileData } from '../types';

interface InputSectionProps {
  files: FileData[];
  onFilesSelected: (files: FileData[]) => void;
  onFileRemove: (index: number) => void;
  jobDescription: string;
  onJobDescriptionChange: (text: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MIN_JD_LENGTH = 50;

export const InputSection: React.FC<InputSectionProps> = ({
  files,
  onFilesSelected,
  onFileRemove,
  jobDescription,
  onJobDescriptionChange,
  onAnalyze,
  isLoading
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Check total files limit
      if (files.length + e.target.files.length > MAX_FILES) {
        alert(`Você só pode adicionar no máximo ${MAX_FILES} currículos por vez.`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const importPromises = Array.from(e.target.files).map(async (file: File) => {
        // Validation for PDF
        if (file.type !== 'application/pdf') {
          alert(`O arquivo "${file.name}" não é um PDF.`);
          return null;
        }

        // Validation for Size
        if (file.size > MAX_FILE_SIZE_BYTES) {
          alert(`O arquivo "${file.name}" excede o limite de ${MAX_FILE_SIZE_MB}MB.`);
          return null;
        }

        return new Promise<FileData>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64 = (reader.result as string).split(',')[1];
                resolve({ file, base64 });
            };
            reader.onerror = reject;
        });
      });

      const processedFiles = await Promise.all(importPromises);
      const validFiles = processedFiles.filter((f): f is FileData => f !== null);
      
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Validation Logic
  const jdLength = jobDescription.trim().length;
  const isJdEmpty = jdLength === 0;
  const isJdTooShort = jdLength > 0 && jdLength < MIN_JD_LENGTH;
  const hasFiles = files.length > 0;
  
  const isValid = !isJdEmpty && !isJdTooShort && hasFiles;
  const isButtonDisabled = isLoading || !isValid;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 h-full flex flex-col gap-8">
      <div>
        <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Descrição da Vaga
            </h2>
            <div className="group relative">
                <Info className="w-4 h-4 text-slate-400 cursor-help" />
                <div className="absolute right-0 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 top-6">
                    Quanto mais detalhes sobre senioridade, ferramentas, idiomas e responsabilidades, mais precisa será a análise.
                </div>
            </div>
        </div>
        
        <div className="relative">
            <textarea
            className={`w-full h-40 p-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none text-sm text-slate-700 transition-all placeholder:text-slate-400 ${
                isJdTooShort ? 'border-amber-300 focus:ring-amber-200' : 'border-slate-200'
            }`}
            placeholder="Cole aqui a descrição da vaga. Inclua requisitos técnicos, comportamentais e senioridade..."
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            />
            <div className={`absolute bottom-3 right-3 text-xs font-medium transition-colors ${
                isJdTooShort ? 'text-amber-600' : jdLength >= MIN_JD_LENGTH ? 'text-emerald-600' : 'text-slate-400'
            }`}>
                {jdLength} / {MIN_JD_LENGTH} min
            </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            Upload de Currículos
            </h2>
            <span className="text-xs text-slate-400 font-medium">Max 10 arquivos (PDF)</span>
        </div>

        <div className={`flex-grow border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 relative transition-all duration-200 ${files.length >= MAX_FILES ? 'bg-slate-100 border-slate-300' : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/30'}`}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                multiple
                disabled={files.length >= MAX_FILES}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className="text-center pointer-events-none">
                <FileText className={`w-10 h-10 mx-auto mb-3 ${files.length >= MAX_FILES ? 'text-slate-300' : 'text-blue-200'}`} />
                <p className={`text-sm font-medium ${files.length >= MAX_FILES ? 'text-slate-400' : 'text-slate-700'}`}>
                    {files.length >= MAX_FILES ? 'Limite atingido' : 'Clique ou arraste arquivos aqui'}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                    {files.length} / {MAX_FILES} selecionados
                </p>
            </div>
        </div>

        {files.length > 0 && (
            <div className="mt-6 space-y-2">
                {files.map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm group transition-colors hover:border-blue-200 hover:bg-blue-50/20">
                        <span className="truncate text-slate-700 font-medium max-w-[80%]" title={f.file.name}>{f.file.name}</span>
                        <div className="flex items-center gap-3">
                             <span className="text-xs text-slate-400">{(f.file.size / 1024 / 1024).toFixed(1)} MB</span>
                            <button 
                                onClick={() => onFileRemove(idx)}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Negative Feedback / Validation Messages */}
      {!isValid && !isLoading && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                  <p className="text-sm font-semibold text-amber-800">Para prosseguir, corrija os itens abaixo:</p>
                  <ul className="text-xs text-amber-700 list-disc list-inside space-y-1">
                      {isJdEmpty && <li>Adicione a descrição da vaga.</li>}
                      {isJdTooShort && <li>A descrição está muito curta. Detalhe mais os requisitos ({jdLength}/{MIN_JD_LENGTH}).</li>}
                      {!hasFiles && <li>Anexe pelo menos um currículo (PDF).</li>}
                  </ul>
              </div>
          </div>
      )}

      <button
        onClick={onAnalyze}
        disabled={isButtonDisabled}
        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-blue-100 transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
            isButtonDisabled 
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
            : 'bg-blue-700 hover:bg-blue-800'
        }`}
      >
        {isLoading ? (
            <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processando...
            </span>
        ) : (
            'Analisar Candidatos'
        )}
      </button>
    </div>
  );
};