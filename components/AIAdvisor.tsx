import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SWPInputs, CalculationResult, AnalysisStatus } from '../types';
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AIAdvisorProps {
  inputs: SWPInputs;
  results: CalculationResult;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ inputs, results }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);

  // Debounce the analysis request to avoid API spam while sliding
  useEffect(() => {
    const timer = setTimeout(() => {
      generateInsight();
    }, 1500); // Wait 1.5s after user stops interacting

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  const generateInsight = async () => {
    if (!process.env.API_KEY) {
      setAnalysis("API Key is missing. Please configure the environment.");
      setStatus(AnalysisStatus.ERROR);
      return;
    }

    setStatus(AnalysisStatus.LOADING);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        You are a financial advisor. Analyze this Systematic Withdrawal Plan (SWP).
        
        Data:
        - Initial Corpus: $${inputs.totalInvestment}
        - Monthly Withdrawal: $${inputs.withdrawalPerMonth}
        - Expected Return Rate: ${inputs.expectedReturnRate}% per annum
        - Planned Duration: ${inputs.durationYears} years
        
        Result:
        - Funds Depleted Month: ${results.fundsDepletedMonth ? `Month ${results.fundsDepletedMonth} (Year ${(results.fundsDepletedMonth/12).toFixed(1)})` : 'Funds lasted the entire duration'}
        - Final Balance: $${results.finalBalance.toFixed(0)}
        
        Provide:
        1. A one-sentence assessment of sustainability.
        2. Three brief, actionable bullet points for the user to optimize their plan or risks to consider (inflation, market volatility, etc.).
        
        Format as clear Markdown. Keep it friendly but professional.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setAnalysis(response.text || "Could not generate analysis.");
      setStatus(AnalysisStatus.SUCCESS);

    } catch (error) {
      console.error("AI Error", error);
      setAnalysis("Unable to generate AI insights at this moment.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 shadow-sm mt-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-indigo-900">AI Financial Insights</h3>
      </div>

      {status === AnalysisStatus.LOADING && (
        <div className="flex flex-col gap-2 animate-pulse">
            <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
            <div className="h-4 bg-indigo-200 rounded w-full"></div>
            <div className="h-4 bg-indigo-200 rounded w-5/6"></div>
        </div>
      )}

      {status === AnalysisStatus.SUCCESS && (
        <div className="prose prose-sm prose-indigo text-slate-700">
             {/* Simple markdown renderer since we don't have a library */}
             {analysis.split('\n').map((line, i) => {
                 if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc">{line.substring(2)}</li>
                 if (line.match(/^\d\./)) return <div key={i} className="mb-1 font-medium">{line}</div>
                 if (line.trim() === '') return <br key={i}/>
                 return <p key={i} className="mb-2">{line}</p>
             })}
        </div>
      )}
      
      {status === AnalysisStatus.ERROR && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <p>{analysis}</p>
          </div>
      )}

      {status === AnalysisStatus.IDLE && (
          <p className="text-slate-500 text-sm italic">Adjust inputs to generate new insights...</p>
      )}
    </div>
  );
};

export default AIAdvisor;