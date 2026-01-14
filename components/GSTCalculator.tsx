
import React, { useState, useEffect } from 'react';
import { calculateGST } from '../utils/calculations';
import { GSTBreakdown } from '../types';

const GSTCalculator: React.FC = () => {
  const [amount, setAmount] = useState<number>(10000);
  const [rate, setRate] = useState<number>(18);
  const [isInclusive, setIsInclusive] = useState<boolean>(false);
  const [result, setResult] = useState<GSTBreakdown | null>(null);

  useEffect(() => {
    setResult(calculateGST(amount, rate, isInclusive));
  }, [amount, rate, isInclusive]);

  const rates = [5, 12, 18, 28];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <i className="fa-solid fa-calculator text-emerald-600"></i>
          GST Calculator (CGST + SGST)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Base Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-lg font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">GST Rate (%)</label>
              <div className="grid grid-cols-4 gap-2">
                {rates.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRate(r)}
                    className={`py-2 px-3 rounded-lg text-sm font-bold transition-all ${
                      rate === r 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {r}%
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-sm font-semibold text-gray-700">Calculation Type</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsInclusive(false)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    !isInclusive ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200'
                  }`}
                >
                  Exclusive
                </button>
                <button
                  onClick={() => setIsInclusive(true)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isInclusive ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200'
                  }`}
                >
                  Inclusive
                </button>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-emerald-900 font-bold text-lg mb-6 border-b border-emerald-200 pb-2">Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-emerald-800">
                  <span>Net Amount</span>
                  <span className="font-semibold">{formatCurrency(result?.baseAmount || 0)}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-800">
                  <span>CGST (Central - {rate/2}%)</span>
                  <span className="font-semibold">{formatCurrency(result?.cgst || 0)}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-800">
                  <span>SGST (State - {rate/2}%)</span>
                  <span className="font-semibold">{formatCurrency(result?.sgst || 0)}</span>
                </div>
                <div className="pt-4 mt-4 border-t border-emerald-200 flex justify-between items-center text-emerald-900">
                  <span className="text-lg font-bold">Grand Total</span>
                  <span className="text-2xl font-black">{formatCurrency(result?.totalAmount || 0)}</span>
                </div>
              </div>
            </div>
            {/* Decoration */}
            <i className="fa-solid fa-receipt absolute -bottom-4 -right-4 text-emerald-100 text-9xl opacity-50 transform -rotate-12"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GSTCalculator;
