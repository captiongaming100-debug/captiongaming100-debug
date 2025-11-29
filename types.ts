export interface SWPInputs {
  totalInvestment: number;
  withdrawalPerMonth: number;
  expectedReturnRate: number; // Annual percentage
  durationYears: number;
}

export interface MonthlyData {
  monthIndex: number;
  year: number;
  month: number;
  openingBalance: number;
  interestEarned: number;
  withdrawal: number;
  closingBalance: number;
}

export interface CalculationResult {
  monthlyData: MonthlyData[];
  totalWithdrawn: number;
  totalInterestEarned: number;
  finalBalance: number;
  fundsDepletedMonth: number | null; // Month index when funds ran out, null if they lasted
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}