import React, { useState, useEffect } from 'react';
import { ApiEnvironmentSettings as ApiEnvSettings, defaultApiEnvironmentSettings } from '@/data/apiEndpoints';
import { KeyRound, Globe, Server } from 'lucide-react';

interface ApiEnvironmentSettingsProps {
  onSettingsChange: (settings: ApiEnvSettings) => void;
}

const API_SETTINGS_STORAGE_KEY = 'api_explorer_environment_settings';

export default function ApiEnvironmentSettings({ onSettingsChange }: ApiEnvironmentSettingsProps) {
  const [settings, setSettings] = useState<ApiEnvSettings>(() => {
    const savedSettings = localStorage.getItem(API_SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        console.error('Error parsing saved API environment settings:', e);
      }
    }
    return defaultApiEnvironmentSettings;
  });

  // Set the environment for real API
  const [useRealApi, setUseRealApi] = useState(settings.useRealApi);
  
  // Toggle between using proxy or direct API calls
  const [proxyEnabled, setProxyEnabled] = useState(settings.proxyEnabled);
  
  // URL for the API requests
  const [baseApiUrl, setBaseApiUrl] = useState(settings.baseApiUrl);

  useEffect(() => {
    // Save settings to localStorage whenever they change
    const newSettings: ApiEnvSettings = {
      useRealApi,
      baseApiUrl: useRealApi 
        ? (proxyEnabled ? '/api/proxy' : 'https://api.campaignmanagement.example.com')
        : '/api/v1',
      proxyEnabled
    };

    localStorage.setItem(API_SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    setSettings(newSettings);
    onSettingsChange(newSettings);
  }, [useRealApi, proxyEnabled, onSettingsChange]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
        <Globe className="mr-2 h-5 w-5" />
        API Environment Settings
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="flex items-center">
            <div className="form-control">
              <input
                type="checkbox"
                checked={useRealApi}
                onChange={(e) => setUseRealApi(e.target.checked)}
                className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
              />
            </div>
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex items-center">
              <KeyRound className="mr-1 h-4 w-4 text-primary" />
              Use Real API (requires API key)
            </span>
          </label>
          {useRealApi && (
            <div className="mt-2 pl-7">
              <label className="flex items-center">
                <div className="form-control">
                  <input
                    type="checkbox"
                    checked={proxyEnabled}
                    onChange={(e) => setProxyEnabled(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                </div>
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex items-center">
                  <Server className="mr-1 h-4 w-4 text-primary" />
                  Use API Proxy (recommended)
                </span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-7">
                {proxyEnabled 
                  ? 'Requests will be proxied through our server to avoid CORS issues.' 
                  : 'Direct API calls might face CORS issues - only disable if necessary.'}
              </p>
            </div>
          )}
        </div>
        
        <div className="text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded">
          <span className="font-medium text-gray-700 dark:text-gray-300">Current API URL:</span> <code className="ml-1 text-primary">{settings.baseApiUrl}</code>
          <div className="mt-1 text-gray-500 dark:text-gray-400">
            {useRealApi 
              ? 'Using real API endpoints with live data. API key required.' 
              : 'Using mock API endpoints with sample data. No API key required.'}
          </div>
        </div>
      </div>
    </div>
  );
}