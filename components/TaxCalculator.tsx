
import React, { useState, useEffect } from 'react';
import { calculateNewRegimeTax, calculateOldRegimeTax } from '../utils/calculations';
import { TaxBreakdown } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const TaxCalculator: React.FC = () => {
  const [income, setIncome] = useState<number>(1200000);
  const [deductions, setDeductions] = useState<number>(150000); // 80C etc.
  const [newResult, setNewResult] = useState<TaxBreakdown | null>(null);
  const [oldResult, setOldResult] = useState<TaxBreakdown | null>(null);

  useEffect(() => {
    setNewResult(calculateNewRegimeTax(income));
    setOldResult(calculateOldRegimeTax(income, deductions));
  }, [income, deductions]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  const getChartData = (res: TaxBreakdown) => [
    { name: 'Tax', value: res.taxAmount },
    { name: 'Cess', value: res.cess },
    { name: 'Take Home', value: res.grossIncome - res.totalTax }
  ];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <i className="fa-solid fa-coins text-indigo-600"></i>
          Income Tax Calculator (FY 2024-25)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Gross Income (₹)</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g. 1500000"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Deductions (Old Regime only - 80C, 80D, etc.) (₹)</label>
              <input
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g. 200000"
              />
              <p className="mt-1 text-xs text-gray-500">*Standard Deduction is automatically included for both.</p>
            </div>
          </div>
          
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">Recommendation</h3>
            {newResult && oldResult && (
              <p className="text-indigo-800 text-sm">
                {newResult.totalTax < oldResult.totalTax 
                  ? `Based on your inputs, the **New Regime** saves you ${formatCurrency(oldResult.totalTax - newResult.totalTax)}.`
                  : `Based on your inputs, the **Old Regime** saves you ${formatCurrency(newResult.totalTax - oldResult.totalTax)}.`}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* New Regime Card */}
        <div className="bg-white rounded-2xl shadow-sm border-t-4 border-emerald-500 p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-gray-800">New Regime</h3>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Default</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Taxable Income</span>
              <span className="font-semibold">{formatCurrency(newResult?.taxableIncome || 0)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Basic Tax</span>
              <span className="font-semibold">{formatCurrency(newResult?.taxAmount || 0)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50 text-indigo-600 font-bold text-lg">
              <span>Total Tax Payable</span>
              <span>{formatCurrency(newResult?.totalTax || 0)}</span>
            </div>
          </div>

          <div className="mt-6 h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={newResult ? getChartData(newResult) : []}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {getChartData(newResult!).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Old Regime Card */}
        <div className="bg-white rounded-2xl shadow-sm border-t-4 border-indigo-500 p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-gray-800">Old Regime</h3>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">With Deductions</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Taxable Income</span>
              <span className="font-semibold">{formatCurrency(oldResult?.taxableIncome || 0)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Basic Tax</span>
              <span className="font-semibold">{formatCurrency(oldResult?.taxAmount || 0)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50 text-indigo-600 font-bold text-lg">
              <span>Total Tax Payable</span>
              <span>{formatCurrency(oldResult?.totalTax || 0)}</span>
            </div>
          </div>

          <div className="mt-6 h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={oldResult ? getChartData(oldResult) : []}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {getChartData(oldResult!).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;
