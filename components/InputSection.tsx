import React, { useRef } from 'react';
import { FileText, Upload, X, Briefcase, AlertCircle, Info, Beaker } from 'lucide-react';
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

// --- TEST DATA ---
const TEST_JD = `Título: Customer Success Manager – SaaS B2B (Pleno/Sênior)
Responsabilidades:
● Gerir carteira de clientes B2B de médio e grande porte em modelo de assinatura (SaaS).
● Conduzir reuniões de onboarding, QBRs e planos de sucesso com foco em adoção, engajamento e expansão.
● Mapear stakeholders, entender objetivos de negócio e conectar o uso do produto aos resultados do cliente.
● Monitorar indicadores como churn, NRR, uso da plataforma e NPS, propondo planos de ação.
● Trabalhar em parceria com times de Vendas, Produto e Suporte para garantir experiência consistente.
● Produzir relatórios executivos com insights e recomendações estratégicas.

Requisitos obrigatórios:
● Experiência mínima de 3 anos em Customer Success, Account Management ou Pós-venda B2B.
● Vivência com produto em modelo SaaS ou software B2B.
● Habilidade de conduzir reuniões com decisores (gestores, diretores, C-level).
● Boa capacidade analítica para interpretar dados de uso e indicadores de sucesso.
● Comunicação clara, escrita e falada, com foco em negócios.

Diferenciais:
● Experiência em empresas de tecnologia em crescimento (startups/scale-ups).
● Atuação prévia com ferramentas de CS (ex: Gainsight, HubSpot, CustomerX, Planhat ou similares).
● Inglês avançado para calls com clientes internacionais.
● Experiência com clientes de RH, financeiro ou operações.

Outras informações relevantes:
● Senioridade desejada: Pleno/Sênior
● Faixa de experiência: 4 a 10 anos total, sendo pelo menos 3 em CS ou pós-venda B2B
● Idiomas: Inglês desejável (mínimo intermediário), espanhol é plus
● Tipo de empresa: SaaS B2B em crescimento, ticket recorrente
● Tipo de carteira: 30–60 contas ativas, foco em retenção e expansão`;

const TEST_RESUMES = [
    {
        name: "Beatriz Lima.pdf",
        content: `Nome: Beatriz Lima
Cargo atual: Analista de Dados de Produto
Local: Belo Horizonte – MG
Resumo profissional:
Analista de dados com 5 anos de experiência em empresas SaaS, responsável por acompanhar métricas de uso, engajamento e retenção. Forte visão analítica e boa capacidade de comunicação com áreas de negócio.
Experiência:
Analista de Dados de Produto – SaaS de logística (2021 – atual)
● Construção de painéis para monitorar churn, engajamento e NRR.
● Apoio ao time de CS na definição de health score.
● Análises de cohort e segmentação de clientes.
Assistente de BI – consultoria de tecnologia (2019 – 2021)
● Criação de relatórios gerenciais para diretoria.
● Consolidação de dados em ferramentas de visualização.
Formação:
● Estatística – UFMG (2014 – 2018)
Idiomas:
● Inglês avançado
Outros:
● Domínio de SQL, Power BI e Looker
● Não possui experiência direta como dona de carteira de clientes`
    },
    {
        name: "João Pedro Carvalho.pdf",
        content: `João Pedro Carvalho
Rio de Janeiro – RJ
35 anos
Telefone: (21) 9 9999-9999
E-mail: joaopcarvalho@exemplo.com
LinkedIn: /in/joaop-atendimento
Objetivo
Continuar minha carreira na área de atendimento ao cliente e operação de contact center, podendo contribuir com gestão de times, metas de atendimento e melhorias em NPS.
Resumo de experiência
Trabalho há mais de 8 anos com atendimento ao cliente em larga escala, em especial B2C (telecom, varejo online). Tenho vivência forte em coordenação de equipes, acompanhamento de indicadores (TMA, fila, ocupação, absenteísmo, NPS, CSAT) e operação de canais (telefone, chat, e-mail, redes sociais). Pouca atuação com carteira de clientes B2B ou software em modelo SaaS.
Histórico profissional
2019 – atual: Coordenador de Atendimento – Grande E-commerce nacional
● Coordenação direta de um time com cerca de 25 atendentes em regime de escala.
● Acompanhamento de metas de TMA, abandono, produtividade por hora e qualidade de atendimento.
● Treinamento de novos colaboradores em scripts, procedimentos e sistema interno.
Antes disso:
2015 – 2019: Supervisor de Call Center – Operadora de Telecom
● Supervisão de operação receptiva e ativa.
Formação acadêmica: Administração de Empresas – Estácio (2012 – 2016)
Idiomas: Inglês: básico.`
    },
    {
        name: "Lucas Ferreira.pdf",
        content: `Nome: Lucas Ferreira
Cargo atual: Customer Success Pleno
Local: Curitiba – PR
Resumo profissional:
Profissional com 4 anos de experiência em atendimento B2B em empresas de tecnologia, atuando nos últimos 2 anos como Customer Success em SaaS voltado para pequenas e médias empresas.
Experiência profissional:
Customer Success Pleno – SaaS de Gestão Financeira (2022 – atual)
● Gestão de carteira com ~80 clientes PMEs.
● Responsável por onboarding, suporte consultivo e renovações.
● Criação de materiais educativos, webinars e treinamentos para clientes.
● Uso de HubSpot, RD Station e dashboards internos.
Analista de Suporte Técnico – Software de automação comercial (2020 – 2022)
● Atendimento N2 a clientes B2B.
Formação:
● Sistemas de Informação – Universidade Positivo (2016 – 2020)
Idiomas:
● Inglês intermediário (consumo de conteúdos e suporte pontual escrito)
Outros:
● Conhecimento em NPS, CSAT, churn, tickets e funil de adoção
● Experiência em startups em fase de crescimento`
    },
    {
        name: "Mariana Souza.pdf",
        content: `Nome: Mariana Souza
Cargo atual: Customer Success Manager Sênior
Local: São Paulo – SP
Resumo profissional:
Profissional com 7 anos de experiência em relacionamento B2B, sendo os últimos 5 anos dedicados a Customer Success em empresas SaaS. Especialista em gestão de carteira, aumento de NRR e redução de churn. Forte atuação estratégica junto a gestores e diretores de RH e Operações.
Experiência profissional:
Customer Success Manager Sênior – HRTech SaaS (2021 – atual)
● Gestão de carteira com ~45 clientes B2B (médio e grande porte).
● Redução de churn de 8% para 3,5% em 2 anos.
● Aumento de NRR médio de 103% para 115% através de expansão de módulos.
● Condução de QBRs com C-level de RH, DP e Operações.
● Uso intensivo de ferramentas como CustomerX, HubSpot e Power BI.
Customer Success Pleno – SaaS de ERP (2019 – 2021)
● Responsável por onboarding e adoção de novos clientes.
● Estruturação de playbooks de jornada por segmento.
Formação:
● Administração de Empresas – FGV (2013 – 2017)
Idiomas:
● Inglês avançado (reuniões e negociações)
● Espanhol intermediário
Outros:
● Certificação em Customer Success – CS Academy
● Conhecimento em NPS, CSAT, churn, NRR e cohort analysis`
    },
    {
        name: "Rafael Almeida.pdf",
        content: `Rafael Almeida
São Paulo – SP
Sobre mim: Trabalho com implantação de sistemas há cerca de 6 anos. Minha atuação está muito conectada a projetos de entrada do cliente no produto (onboarding técnico), definição de escopo, configuração de plataforma e go-live.
Experiência profissional:
2017 – 2020: Analista de Implantação – ERP para indústria
● Responsável por parametrizar módulos financeiros, estoque e produção.
● Viagens frequentes para acompanhar projetos on-site.
2020 – até o momento: Implementation Specialist – SaaS de Gestão de Projetos
● Conduzir projetos de implantação de software para empresas B2B.
● Coletar requisitos e alinhar escopo com stakeholders de negócio e TI.
● Criar o ambiente do cliente, configurar usuários, permissões e integrações básicas.
● Acompanhar o cliente até o go-live e então fazer a transição para o time de CS.
Formação: Engenharia de Produção – Universidade Presbiteriana Mackenzie (2012 – 2017)
Idiomas: Inglês: nível intermediário.
Informações adicionais:
● Foco é implantação e projeto, não gestão contínua de resultados de negócio.
● Interesse em conhecer melhor áreas como Customer Success, mas experiência principal é técnico/projetos.`
    }
];

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

  const handleTestFill = async () => {
    // 1. Fill Job Description
    onJobDescriptionChange(TEST_JD);

    // 2. Create File Objects for Resumes
    const filePromises = TEST_RESUMES.map(async (resume) => {
        // We create a File object with type 'text/plain' so Gemini reads it easily,
        // but name it .pdf so it looks correct in the UI list.
        const file = new File([resume.content], resume.name, { type: 'text/plain' });
        
        return new Promise<FileData>((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64 = (reader.result as string).split(',')[1];
                resolve({ file, base64 });
            };
        });
    });

    const newFiles = await Promise.all(filePromises);
    onFilesSelected(newFiles);
  };

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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 h-full flex flex-col gap-8 relative">
      
      {/* Test Button - Top Right */}
      <div className="absolute top-4 right-4">
          <button
            onClick={handleTestFill}
            disabled={isLoading || hasFiles}
            title="Preencher com dados de exemplo (Teste)"
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Beaker className="w-4 h-4" />
            TESTE RÁPIDO
          </button>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Descrição da Vaga
            </h2>
            <div className="group relative mr-24 md:mr-0"> {/* Margin right to avoid overlapping test button on mobile */}
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
                             <span className="text-xs text-slate-400">
                                {f.file.size > 0 ? (f.file.size / 1024 / 1024).toFixed(1) : '< 0.1'} MB
                             </span>
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