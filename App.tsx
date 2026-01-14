
import React, { useState } from 'react';
import Layout from './components/Layout';
import TaxCalculator from './components/TaxCalculator';
import GSTCalculator from './components/GSTCalculator';
import JournalSolver from './components/JournalSolver';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tax');

  const renderContent = () => {
    switch (activeTab) {
      case 'tax':
        return <TaxCalculator />;
      case 'gst':
        return <GSTCalculator />;
      case 'journal':
        return <JournalSolver />;
      default:
        return <TaxCalculator />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-fadeIn">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Namaste! <span className="text-indigo-600">Smart Accounting Simplified.</span>
          </h1>
          <p className="text-gray-500 mt-2">Everything you need to manage Indian Taxes, GST, and Accounting entries in one place.</p>
        </div>

        {renderContent()}

        {/* Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <i className="fa-solid fa-shield-halved text-indigo-500 text-2xl mb-4"></i>
            <h4 className="font-bold text-gray-800 mb-2">Private & Secure</h4>
            <p className="text-sm text-gray-500">Your data stays in your browser. We don't store your personal financial details.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <i className="fa-solid fa-bolt text-amber-500 text-2xl mb-4"></i>
            <h4 className="font-bold text-gray-800 mb-2">Real-time Updates</h4>
            <p className="text-sm text-gray-500">Calculations updated for Finance Bill 2024 and latest GST circulars.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <i className="fa-solid fa-graduation-cap text-emerald-500 text-2xl mb-4"></i>
            <h4 className="font-bold text-gray-800 mb-2">Student Friendly</h4>
            <p className="text-sm text-gray-500">Perfect for CA/CS/CMA students and B.Com graduates to verify journal entries.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
