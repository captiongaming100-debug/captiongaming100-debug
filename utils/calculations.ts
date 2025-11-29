import { SWPInputs, CalculationResult, MonthlyData } from '../types';

export const calculateSWP = (inputs: SWPInputs): CalculationResult => {
  const { totalInvestment, withdrawalPerMonth, expectedReturnRate, durationYears } = inputs;
  
  let currentBalance = totalInvestment;
  const monthlyRate = expectedReturnRate / 100 / 12;
  const totalMonths = durationYears * 12;
  const monthlyData: MonthlyData[] = [];
  
  let totalWithdrawn = 0;
  let totalInterestEarned = 0;
  let fundsDepletedMonth: number | null = null;

  for (let i = 1; i <= totalMonths; i++) {
    const openingBalance = currentBalance;
    
    // Calculate interest for the month
    const interestEarned = openingBalance * monthlyRate;
    
    // Calculate closing balance before withdrawal check
    let closingBalance = openingBalance + interestEarned - withdrawalPerMonth;
    
    // Actual withdrawal logic (cannot withdraw more than balance)
    let actualWithdrawal = withdrawalPerMonth;

    if (closingBalance < 0) {
      // If funds run out this month
      actualWithdrawal = openingBalance + interestEarned;
      closingBalance = 0;
      if (fundsDepletedMonth === null) {
        fundsDepletedMonth = i;
      }
    }

    currentBalance = closingBalance;
    totalWithdrawn += actualWithdrawal;
    totalInterestEarned += interestEarned;

    monthlyData.push({
      monthIndex: i,
      year: Math.floor((i - 1) / 12) + 1,
      month: ((i - 1) % 12) + 1,
      openingBalance,
      interestEarned,
      withdrawal: actualWithdrawal,
      closingBalance
    });

    if (closingBalance === 0 && fundsDepletedMonth !== null) {
      // Continue adding empty rows? Or stop?
      // Usually better to show flat line at 0 for charts.
      // But we can stop the loop to save generic cycles if the chart handles it.
      // Let's continue filling with zeros so the chart X-axis stays consistent with the requested duration.
    }
  }

  return {
    monthlyData,
    totalWithdrawn,
    totalInterestEarned,
    finalBalance: currentBalance,
    fundsDepletedMonth
  };
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};