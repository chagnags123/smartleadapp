import React, { useState } from 'react';
import Sidebar from './Sidebar';
import EndpointDetail from './EndpointDetail';
import ApiKeyManager from './ApiKeyManager';
import ApiEnvironmentSettings from './ApiEnvironmentSettings';
import { apiEndpoints, ApiEnvironmentSettings as ApiEnvSettings, defaultApiEnvironmentSettings } from '@/data/apiEndpoints';
import { APIEndpoint } from '@/data/apiEndpoints';
import { Button } from '@/components/ui/button';
import { Home, Settings, Sun, Moon, Info, KeyRound, Globe } from 'lucide-react';
import { getApiKey, hasApiKey } from '@/lib/queryClient';

export default function ApiExplorer() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isApiKeyManagerOpen, setIsApiKeyManagerOpen] = useState(false);
  const [apiEnvSettings, setApiEnvSettings] = useState<ApiEnvSettings>(defaultApiEnvironmentSettings);
  const apiKey = getApiKey();
  const useApiKey = hasApiKey();

  const handleEndpointSelect = (endpoint: APIEndpoint) => {
    setSelectedEndpoint(endpoint);
    setIsMobileSidebarOpen(false);
  };
  
  const goHome = () => {
    setSelectedEndpoint(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const openApiKeyManager = () => {
    setIsApiKeyManagerOpen(true);
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 rounded-md bg-white shadow-md border border-gray-200 text-gray-500 hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar 
        apiEndpoints={apiEndpoints} 
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        onSelectEndpoint={handleEndpointSelect}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={goHome} 
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Home"
              >
                <Home className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">API Endpoint Explorer</h2>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant={useApiKey ? "default" : "outline"}
                size="sm"
                onClick={openApiKeyManager}
                className="flex items-center gap-1"
                title="Configure API Key"
              >
                <KeyRound className="h-4 w-4 mr-1" />
                {useApiKey ? "API Key Active" : "Set API Key"}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleDarkMode}
                className="rounded-full"
                title={isDarkMode ? "Light Mode" : "Dark Mode"}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full"
                title="About"
              >
                <Info className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gray-50 dark:bg-gray-900">
          {selectedEndpoint ? (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  onClick={goHome} 
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Back to Home
                </Button>
                <div className="flex items-center space-x-2">
                  {apiEnvSettings.useRealApi && (
                    <div className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 py-1 px-3 rounded-full flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      Real API Mode
                    </div>
                  )}
                  {useApiKey && apiKey && (
                    <div className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 py-1 px-3 rounded-full flex items-center">
                      <KeyRound className="h-3 w-3 mr-1" />
                      Using API Key
                    </div>
                  )}
                </div>
              </div>
              <EndpointDetail 
                endpoint={selectedEndpoint} 
                apiEnvironment={apiEnvSettings}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary opacity-20 rounded-full blur-xl"></div>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"></path>
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3 bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">Campaign API Explorer</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-lg text-lg">Select an API endpoint from the sidebar to get started with testing and exploration.</p>
              
              {/* API Environment Settings */}
              <div className="w-full max-w-3xl mb-8">
                <ApiEnvironmentSettings onSettingsChange={setApiEnvSettings} />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-5xl">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group hover:border-primary/50">
                  <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-xl mb-4 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Campaign Management</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Create, update, and manage your marketing campaigns.</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group hover:border-primary/50">
                  <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-xl mb-4 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Email Accounts</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage email accounts and configure sending settings.</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group hover:border-primary/50">
                  <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-xl mb-4 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Analytics</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Retrieve campaign statistics and performance metrics.</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group hover:border-primary/50">
                  <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-xl mb-4 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Webhooks</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage webhook integrations for your campaigns.</p>
                </div>
              </div>
              
              <div className="mt-10">
                <p className="text-gray-400 dark:text-gray-500 text-sm">Select a category from the sidebar to explore available API endpoints.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* API Key Manager */}
      <ApiKeyManager 
        isOpen={isApiKeyManagerOpen}
        onClose={() => setIsApiKeyManagerOpen(false)}
      />
    </div>
  );
}
