
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'tax', name: 'Income Tax', icon: 'fa-file-invoice-dollar' },
    { id: 'gst', name: 'GST Calculator', icon: 'fa-percent' },
    { id: 'journal', name: 'AI Journal Solver', icon: 'fa-brain' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-indian-rupee-sign text-2xl text-emerald-400"></i>
              <span className="text-xl font-bold tracking-tight">BharatAccountant</span>
            </div>
            <nav className="hidden md:flex space-x-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-600'
                  }`}
                >
                  <i className={`fa-solid ${tab.icon} mr-2`}></i>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} BharatAccountant - Your Trusted Indian Financial Companion.</p>
          <p className="mt-1">Designed for accuracy as per Budget 2024.</p>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-50 shadow-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === tab.id ? 'text-indigo-700' : 'text-gray-400'
            }`}
          >
            <i className={`fa-solid ${tab.icon} text-lg`}></i>
            <span className="text-[10px] mt-1 font-semibold uppercase">{tab.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Layout;
