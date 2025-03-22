import React, { useState } from 'react';
import { APIEndpoint, ApiEnvironmentSettings } from '@/data/apiEndpoints';
import ResponseDisplay from './ResponseDisplay';
import { apiRequest, getApiKey, hasApiKey } from '@/lib/queryClient';
import { formatResponse } from '@/utils/formatResponse';
import { KeyRound, Globe, Server } from 'lucide-react';

interface EndpointDetailProps {
  endpoint: APIEndpoint;
  apiEnvironment: ApiEnvironmentSettings;
}

type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

interface ResponseData {
  status: number;
  statusText: string;
  data: any;
  headers: Record<string, string>;
  time: number;
  timestamp: string;
}

export default function EndpointDetail({ endpoint, apiEnvironment }: EndpointDetailProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('idle');
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus('loading');

    // Determine which URL to use based on API environment settings
    let baseUrl = '';
    let targetUrl = '';
    
    if (apiEnvironment.useRealApi) {
      // Use real API URL if available, otherwise fallback to the regular URL
      baseUrl = apiEnvironment.baseApiUrl;
      targetUrl = endpoint.realApiUrl || endpoint.url;
    } else {
      // Use mock API URL
      baseUrl = apiEnvironment.baseApiUrl; 
      targetUrl = endpoint.url;
    }

    // Ensure the URL starts with the correct base
    let url = targetUrl;
    if (!url.startsWith('http') && !url.startsWith('/')) {
      url = `/${url}`;
    }
    
    // Replace path parameters in URL
    endpoint.params.forEach(param => {
      if (param.name && url.includes(`{${param.name}}`)) {
        url = url.replace(`{${param.name}}`, formValues[param.name] || '');
      }
    });

    // Extract query params for GET requests
    const queryParams = new URLSearchParams();
    if (endpoint.method === 'GET') {
      endpoint.params.forEach(param => {
        if (param.name && formValues[param.name] && !url.includes(`{${param.name}}`)) {
          queryParams.append(param.name, formValues[param.name]);
        }
      });
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }

    // Prepare request body for POST/DELETE
    const requestBody: Record<string, any> = {};
    if (endpoint.method !== 'GET') {
      endpoint.params.forEach(param => {
        if (param.name && formValues[param.name] && !url.includes(`{${param.name}}`)) {
          // Handle array parameters
          if (param.type === 'array' && formValues[param.name]) {
            try {
              requestBody[param.name] = JSON.parse(formValues[param.name]);
            } catch {
              requestBody[param.name] = formValues[param.name];
            }
          } else if (param.type === 'number' && formValues[param.name]) {
            requestBody[param.name] = parseFloat(formValues[param.name]);
          } else {
            requestBody[param.name] = formValues[param.name];
          }
        }
      });
    }

    console.log(`Making ${endpoint.method} request to: ${baseUrl}${url}`);
    
    try {
      const response = await apiRequest(
        endpoint.method, 
        `${baseUrl}${url}`.replace(/\/\//g, '/'), // Fix any double slashes
        endpoint.method !== 'GET' ? requestBody : undefined
      );
      
      // Get response time from enhanced Response object (added in apiRequest)
      const responseTime = (response as any).requestTime || 0;

      // Get response headers
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      // Handle different response types
      let responseBody;
      if (endpoint.responseType === 'csv') {
        responseBody = await response.text();
      } else {
        // Default to JSON
        try {
          responseBody = await response.json();
        } catch (e) {
          responseBody = await response.text();
        }
      }

      setResponseData({
        status: response.status,
        statusText: response.statusText,
        data: responseBody,
        headers,
        time: responseTime,
        timestamp: new Date().toLocaleTimeString()
      });
      
      setRequestStatus('success');
    } catch (error) {
      setRequestStatus('error');
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      setErrorMessage(message);
      console.error('Request error:', error);
    }
  };

  const handleCopyUrl = () => {
    // Determine which URL to use based on environment
    let url = apiEnvironment.useRealApi 
      ? (endpoint.realApiUrl || endpoint.url)
      : endpoint.url;
      
    // Replace placeholders with actual values
    endpoint.params.forEach(param => {
      if (param.name && url.includes(`{${param.name}}`)) {
        url = url.replace(`{${param.name}}`, formValues[param.name] || `{${param.name}}`);
      }
    });
    
    // Add base URL for complete path
    const fullUrl = `${apiEnvironment.baseApiUrl}${url}`.replace(/\/\//g, '/');
    navigator.clipboard.writeText(fullUrl);
    
    // Show a small notification that URL was copied
    alert('URL copied to clipboard');
  };

  const apiKey = getApiKey();
  const useApiKey = hasApiKey();

  return (
    <>
      {/* Top section with endpoint info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mr-3">{endpoint.name}</h2>
              <span 
                className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                  endpoint.method === 'GET' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : 
                  endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 
                  'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                }`}
              >
                {endpoint.method}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{endpoint.description}</p>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-end">
              {apiEnvironment.useRealApi ? (
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 py-1 px-3 rounded-full flex items-center">
                  <Globe className="h-3 w-3 mr-1" />
                  Real API Mode {apiEnvironment.proxyEnabled && '(Proxied)'}
                </span>
              ) : (
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 py-1 px-3 rounded-full flex items-center">
                  <Server className="h-3 w-3 mr-1" />
                  Mock API Mode
                </span>
              )}
            </div>
            <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-md px-3 py-2 text-sm font-mono text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
              <span>
                {apiEnvironment.useRealApi 
                  ? (endpoint.realApiUrl || endpoint.url) 
                  : endpoint.url}
              </span>
              <button 
                onClick={handleCopyUrl}
                className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Environment information */}
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Globe className="h-4 w-4 mr-2 text-primary" />
            <span>
              API Mode: <span className={apiEnvironment.useRealApi ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-600 dark:text-gray-400 font-medium"}>
                {apiEnvironment.useRealApi ? 'Real API' : 'Mock API'}
              </span>
            </span>
            <span className="mx-2">•</span>
            <span>
              Base URL: <code className="text-xs bg-gray-100 dark:bg-gray-700 rounded px-1 py-0.5">{apiEnvironment.baseApiUrl}</code>
            </span>
            {apiEnvironment.useRealApi && (
              <>
                <span className="mx-2">•</span>
                <span>
                  Proxy: <span className={apiEnvironment.proxyEnabled ? "text-green-600 dark:text-green-400 font-medium" : "text-gray-600 dark:text-gray-400 font-medium"}>
                    {apiEnvironment.proxyEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* API Key usage information */}
        {useApiKey && apiKey && (
          <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <KeyRound className="h-4 w-4 mr-2 text-primary" />
              <span>API Authentication is <span className="text-green-600 dark:text-green-400 font-medium">enabled</span> for this request</span>
            </div>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-700 rounded px-3 py-2 text-xs">
                <span className="text-gray-500 dark:text-gray-400">Header:</span> <span className="font-mono">X-API-Key: {apiKey.slice(0, 4)}...{apiKey.slice(-4)}</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded px-3 py-2 text-xs">
                <span className="text-gray-500 dark:text-gray-400">Header:</span> <span className="font-mono">Authorization: Bearer {apiKey.slice(0, 4)}...{apiKey.slice(-4)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Parameters form and response section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Request Parameters</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div id="params-container">
                  {endpoint.params.length > 0 ? (
                    endpoint.params.map((param) => (
                      <div key={param.name} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {param.name} {param.required && <span className="text-red-500 dark:text-red-400">*</span>}
                        </label>
                        <input
                          type={param.type === 'number' ? 'number' : 'text'}
                          name={param.name}
                          value={formValues[param.name] || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100 sm:text-sm"
                          required={param.required}
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{param.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                      This endpoint does not require any parameters.
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    type="submit" 
                    disabled={requestStatus === 'loading'}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70"
                  >
                    {requestStatus === 'loading' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        Send Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Response section */}
        <div className="lg:col-span-2">
          <ResponseDisplay 
            status={requestStatus}
            responseData={responseData}
            errorMessage={errorMessage}
            responseType={endpoint.responseType}
          />
        </div>
      </div>
    </>
  );
}
