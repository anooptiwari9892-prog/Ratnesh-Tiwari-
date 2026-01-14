
export interface JournalEntry {
  date: string;
  particulars: {
    account: string;
    type: 'Dr' | 'Cr';
    amount: number;
  }[];
  narration: string;
  reasoning: string;
}

export type TaxRegime = 'OLD' | 'NEW';

export interface TaxBreakdown {
  regime: TaxRegime;
  grossIncome: number;
  deductions: number;
  taxableIncome: number;
  taxAmount: number;
  cess: number;
  totalTax: number;
  slabs: {
    slab: string;
    rate: string;
    amount: number;
  }[];
}

export interface GSTBreakdown {
  baseAmount: number;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  isInclusive: boolean;
}
