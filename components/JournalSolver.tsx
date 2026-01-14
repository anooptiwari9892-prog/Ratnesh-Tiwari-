
import React, { useState } from 'react';
import { solveJournalEntry } from '../services/geminiService';
import { JournalEntry } from '../types';

const JournalSolver: React.FC = () => {
  const [transaction, setTransaction] = useState('');
  const [result, setResult] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSolve = async () => {
    if (!transaction.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const entry = await solveJournalEntry(transaction);
      setResult(entry);
    } catch (err) {
      setError('Could not solve the entry. Please try a different description.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <i className="fa-solid fa-brain text-purple-600"></i>
          AI Journal Solver
        </h2>
        <p className="text-gray-500 mb-8">Type any business transaction to get the official Journal Entry.</p>

        <div className="space-y-4">
          <textarea
            value={transaction}
            onChange={(e) => setTransaction(e.target.value)}
            placeholder="e.g. Purchased furniture worth 50,000 for cash, with 10% trade discount."
            className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-gray-700"
          />
          <button
            onClick={handleSolve}
            disabled={loading || !transaction.trim()}
            className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                Analyzing Transaction...
              </span>
            ) : (
              'Generate Journal Entry'
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation"></i>
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-slideUp">
          <div className="bg-gray-50 px-8 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Journal Entry Output</h3>
            <span className="text-sm text-gray-500">{result.date}</span>
          </div>
          
          <div className="p-8">
            <table className="w-full mb-8">
              <thead>
                <tr className="text-left text-xs uppercase text-gray-400 font-bold border-b border-gray-100">
                  <th className="pb-2">Particulars</th>
                  <th className="pb-2 text-right">Debit (Dr)</th>
                  <th className="pb-2 text-right">Credit (Cr)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {result.particulars.map((p, idx) => (
                  <tr key={idx}>
                    <td className={`py-4 ${p.type === 'Cr' ? 'pl-12' : ''}`}>
                      <span className="font-semibold text-gray-800">{p.account}</span>
                      <span className="text-xs text-gray-400 ml-2">{p.type}</span>
                    </td>
                    <td className="py-4 text-right font-mono text-emerald-600 font-bold">
                      {p.type === 'Dr' ? formatCurrency(p.amount) : '-'}
                    </td>
                    <td className="py-4 text-right font-mono text-rose-600 font-bold">
                      {p.type === 'Cr' ? formatCurrency(p.amount) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <span className="text-xs font-bold text-gray-400 block mb-1">NARRATION</span>
              <p className="text-gray-700 italic">({result.narration})</p>
            </div>

            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-xl">
              <span className="text-xs font-bold text-purple-600 block mb-1">ACCOUNTING REASONING</span>
              <p className="text-sm text-purple-900">{result.reasoning}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalSolver;
