
import { TaxBreakdown, TaxRegime, GSTBreakdown } from '../types';

/**
 * FY 2024-25 / AY 2025-26 New Tax Regime (Budget 2024 update)
 */
export const calculateNewRegimeTax = (income: number): TaxBreakdown => {
  const standardDeduction = 75000;
  const taxableIncome = Math.max(0, income - standardDeduction);
  let tax = 0;
  const slabs = [];

  const config = [
    { limit: 300000, rate: 0, label: "0 - 3L" },
    { limit: 700000, rate: 0.05, label: "3L - 7L" },
    { limit: 1000000, rate: 0.10, label: "7L - 10L" },
    { limit: 1200000, rate: 0.15, label: "10L - 12L" },
    { limit: 1500000, rate: 0.20, label: "12L - 15L" },
    { limit: Infinity, rate: 0.30, label: "Above 15L" }
  ];

  let remaining = taxableIncome;
  let prevLimit = 0;

  for (const step of config) {
    const range = step.limit - prevLimit;
    const applicable = Math.min(Math.max(0, remaining), range);
    const stepTax = applicable * step.rate;
    
    if (applicable > 0) {
      tax += stepTax;
      slabs.push({ slab: step.label, rate: `${step.rate * 100}%`, amount: stepTax });
    }
    
    remaining -= applicable;
    prevLimit = step.limit;
    if (remaining <= 0) break;
  }

  // Tax Rebate u/s 87A for income up to 7L in New Regime
  if (taxableIncome <= 700000) {
    tax = 0;
  }

  const cess = tax * 0.04;

  return {
    regime: 'NEW',
    grossIncome: income,
    deductions: standardDeduction,
    taxableIncome,
    taxAmount: tax,
    cess,
    totalTax: tax + cess,
    slabs
  };
};

/**
 * Old Regime Calculation (Simplified)
 */
export const calculateOldRegimeTax = (income: number, deductionsInput: number): TaxBreakdown => {
  const standardDeduction = 50000;
  const deductions = standardDeduction + deductionsInput;
  const taxableIncome = Math.max(0, income - deductions);
  let tax = 0;
  const slabs = [];

  const config = [
    { limit: 250000, rate: 0, label: "0 - 2.5L" },
    { limit: 500000, rate: 0.05, label: "2.5L - 5L" },
    { limit: 1000000, rate: 0.20, label: "5L - 10L" },
    { limit: Infinity, rate: 0.30, label: "Above 10L" }
  ];

  let remaining = taxableIncome;
  let prevLimit = 0;

  for (const step of config) {
    const range = step.limit - prevLimit;
    const applicable = Math.min(Math.max(0, remaining), range);
    const stepTax = applicable * step.rate;
    
    if (applicable > 0) {
      tax += stepTax;
      slabs.push({ slab: step.label, rate: `${step.rate * 100}%`, amount: stepTax });
    }
    
    remaining -= applicable;
    prevLimit = step.limit;
    if (remaining <= 0) break;
  }

  // Rebate u/s 87A for income up to 5L in Old Regime
  if (taxableIncome <= 500000) {
    tax = 0;
  }

  const cess = tax * 0.04;

  return {
    regime: 'OLD',
    grossIncome: income,
    deductions,
    taxableIncome,
    taxAmount: tax,
    cess,
    totalTax: tax + cess,
    slabs
  };
};

export const calculateGST = (amount: number, rate: number, isInclusive: boolean): GSTBreakdown => {
  let baseAmount, totalGst;

  if (isInclusive) {
    baseAmount = amount / (1 + rate / 100);
    totalGst = amount - baseAmount;
  } else {
    baseAmount = amount;
    totalGst = (amount * rate) / 100;
  }

  return {
    baseAmount,
    gstRate: rate,
    cgst: totalGst / 2,
    sgst: totalGst / 2,
    igst: totalGst,
    totalAmount: baseAmount + totalGst,
    isInclusive
  };
};
