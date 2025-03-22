import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { APIEndpoint } from '@/data/apiEndpoints';

interface SidebarProps {
  apiEndpoints: { [category: string]: APIEndpoint[] };
  isOpen: boolean;
  onClose: () => void;
  onSelectEndpoint: (endpoint: APIEndpoint) => void;
}

export default function Sidebar({ apiEndpoints, isOpen, onClose, onSelectEndpoint }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    'Campaign Management': true, // Default expanded
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 z-40 w-80 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out overflow-hidden flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h1 className="text-lg font-semibold text-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            API Explorer
          </h1>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="overflow-y-auto custom-scrollbar flex-1">
          {Object.entries(apiEndpoints).map(([category, endpoints]) => (
            <div key={category} className="endpoint-category">
              <div 
                className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 cursor-pointer"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center">
                  {category === 'Campaign Management' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  )}
                  <h2 className="font-medium text-gray-700">{category}</h2>
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 text-gray-500 transform ${expandedCategories[category] ? 'rotate-180' : ''}`} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              
              <div className={`category-endpoints bg-white ${expandedCategories[category] ? '' : 'hidden'}`}>
                {endpoints.map((endpoint) => (
                  <div 
                    key={endpoint.value} 
                    className="endpoint py-2 px-4 hover:bg-gray-50 cursor-pointer border-l-2 border-transparent hover:border-primary"
                    onClick={() => onSelectEndpoint(endpoint)}
                  >
                    <div className="flex items-center">
                      <span 
                        className={`text-xs font-semibold px-2 py-0.5 rounded mr-2 ${
                          endpoint.method === 'GET' ? 'bg-green-100 text-green-700' : 
                          endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' : 
                          'bg-red-100 text-red-700'
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <span className="text-sm text-gray-700">{endpoint.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
