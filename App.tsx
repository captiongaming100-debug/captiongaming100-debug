import React, { useState, useMemo } from 'react';
import InputSlider from './components/InputSlider';
import SWPChart from './components/SWPChart';
import AIAdvisor from './components/AIAdvisor';
import { calculateSWP, formatCurrency } from './utils/calculations';
import { SWPInputs } from './types';
import { Wallet, TrendingUp, Calendar, AlertTriangle, ArrowRightCircle } from 'lucide-react';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<SWPInputs>({
    totalInvestment: 500000,
    withdrawalPerMonth: 3000,
    expectedReturnRate: 8,
    durationYears: 20
  });

  const results = useMemo(() => calculateSWP(inputs), [inputs]);

  const updateInput = (key: keyof SWPInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const isDepleted = results.fundsDepletedMonth !== null;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg text-white">
                <Wallet className="w-8 h-8" />
            </div>
            Smart SWP Calculator
          </h1>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Visualize your retirement cash flow. Adjust your Systematic Withdrawal Plan (SWP) parameters to see how long your investments will last.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                Plan Configuration
              </h2>
              
              <InputSlider
                label="Total Investment"
                value={inputs.totalInvestment}
                onChange={(val) => updateInput('totalInvestment', val)}
                min={10000}
                max={5000000}
                step={10000}
                prefix="$"
              />

              <InputSlider
                label="Monthly Withdrawal"
                value={inputs.withdrawalPerMonth}
                onChange={(val) => updateInput('withdrawalPerMonth', val)}
                min={500}
                max={50000}
                step={100}
                prefix="$"
              />

              <InputSlider
                label="Expected Return Rate (Annual)"
                value={inputs.expectedReturnRate}
                onChange={(val) => updateInput('expectedReturnRate', val)}
                min={1}
                max={20}
                step={0.1}
                suffix="%"
              />

              <InputSlider
                label="Duration"
                value={inputs.durationYears}
                onChange={(val) => updateInput('durationYears', val)}
                min={1}
                max={50}
                step={1}
                suffix=" Years"
              />
            </div>
          </div>

          {/* Right Column: Results & Analysis */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Wallet className="w-4 h-4" />
                    <span className="text-sm font-medium">Total Withdrawn</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                    {formatCurrency(results.totalWithdrawn)}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Interest Earned</span>
                </div>
                <div className="text-2xl font-bold text-emerald-600">
                    +{formatCurrency(results.totalInterestEarned)}
                </div>
              </div>

              <div className={`p-5 rounded-xl shadow-sm border ${isDepleted ? 'bg-red-50 border-red-100' : 'bg-white border-slate-200'}`}>
                <div className={`flex items-center gap-2 mb-1 ${isDepleted ? 'text-red-600' : 'text-slate-500'}`}>
                    {isDepleted ? <AlertTriangle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                    <span className="text-sm font-medium">Sustainability</span>
                </div>
                {isDepleted ? (
                    <div>
                         <div className="text-lg font-bold text-red-700">Depleted in Year {Math.ceil((results.fundsDepletedMonth || 0) / 12)}</div>
                         <div className="text-xs text-red-500">Month {(results.fundsDepletedMonth || 0) % 12 || 12}</div>
                    </div>
                ) : (
                    <div className="text-lg font-bold text-emerald-700">Sustainable</div>
                )}
                 {!isDepleted && <div className="text-xs text-slate-400">Final Balance: {formatCurrency(results.finalBalance)}</div>}
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-slate-800">Portfolio Projection</h3>
                    <div className="flex gap-4 text-sm">
                         <div className="flex items-center gap-1">
                             <span className="w-3 h-3 bg-emerald-500 rounded-full opacity-20"></span>
                             <span className="text-slate-500">Balance</span>
                         </div>
                    </div>
                </div>
                <SWPChart data={results.monthlyData} totalInvestment={inputs.totalInvestment} />
            </div>

            {/* AI Advisor Section */}
            <AIAdvisor inputs={inputs} results={results} />

            {/* Detailed Stats / Table Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-800">Annual Breakdown</h3>
                    <span className="text-xs text-slate-500">First 10 Years Preview</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-4 py-3">Year</th>
                                <th className="px-4 py-3 text-right">Start Balance</th>
                                <th className="px-4 py-3 text-right">Withdrawals</th>
                                <th className="px-4 py-3 text-right">Interest</th>
                                <th className="px-4 py-3 text-right">End Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {/* Aggregate monthly data by year for concise table */}
                            {Array.from({ length: Math.min(inputs.durationYears, 10) }).map((_, idx) => {
                                const year = idx + 1;
                                const yearData = results.monthlyData.filter(d => d.year === year);
                                if (yearData.length === 0) return null;
                                
                                const startBal = yearData[0].openingBalance;
                                const yearWithdrawal = yearData.reduce((acc, curr) => acc + curr.withdrawal, 0);
                                const yearInterest = yearData.reduce((acc, curr) => acc + curr.interestEarned, 0);
                                const endBal = yearData[yearData.length - 1].closingBalance;

                                return (
                                    <tr key={year} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-700">{year}</td>
                                        <td className="px-4 py-3 text-right text-slate-600">{formatCurrency(startBal)}</td>
                                        <td className="px-4 py-3 text-right text-slate-600">-{formatCurrency(yearWithdrawal)}</td>
                                        <td className="px-4 py-3 text-right text-emerald-600">+{formatCurrency(yearInterest)}</td>
                                        <td className="px-4 py-3 text-right font-medium text-slate-900">{formatCurrency(endBal)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                 {inputs.durationYears > 10 && (
                    <div className="p-3 text-center bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
                        Detailed breakdown available for full duration in report export.
                    </div>
                )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;