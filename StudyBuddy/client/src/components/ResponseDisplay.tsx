import React, { useState } from 'react';
import { formatResponse } from '@/utils/formatResponse';
import { getApiKey, hasApiKey } from '@/lib/queryClient';
import { KeyRound } from 'lucide-react';

interface ResponseDisplayProps {
  status: 'idle' | 'loading' | 'success' | 'error';
  responseData: {
    status: number;
    statusText: string;
    data: any;
    headers: Record<string, string>;
    time: number;
    timestamp: string;
  } | null;
  errorMessage: string;
  responseType?: 'json' | 'csv';
}

export default function ResponseDisplay({ 
  status, 
  responseData, 
  errorMessage,
  responseType = 'json'
}: ResponseDisplayProps) {
  const [headersVisible, setHeadersVisible] = useState(false);

  const handleCopyResponse = () => {
    if (!responseData) return;
    
    let textToCopy;
    if (typeof responseData.data === 'string') {
      textToCopy = responseData.data;
    } else {
      textToCopy = JSON.stringify(responseData.data, null, 2);
    }
    
    navigator.clipboard.writeText(textToCopy);
  };

  const apiKey = getApiKey();
  const useApiKey = hasApiKey();
  const [requestVisible, setRequestVisible] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">Response</h3>
        {status === 'success' && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setRequestVisible(!requestVisible)}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              title="View request details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
            </button>
            <button 
              onClick={handleCopyResponse}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Copy response"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Request information (if API key is being used) */}
      {useApiKey && apiKey && requestVisible && (
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center mb-2">
            <KeyRound className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Request sent with API authentication</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-white dark:bg-gray-800 rounded px-2 py-1.5 border border-gray-200 dark:border-gray-600">
              <span className="text-primary dark:text-primary-foreground">X-API-Key:</span> {apiKey.slice(0, 4)}...{apiKey.slice(-4)}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded px-2 py-1.5 border border-gray-200 dark:border-gray-600">
              <span className="text-primary dark:text-primary-foreground">Authorization:</span> Bearer {apiKey.slice(0, 4)}...{apiKey.slice(-4)}
            </div>
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {status === 'loading' && (
        <div className="p-6 flex flex-col items-center justify-center h-64">
          <svg className="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Sending request...</p>
        </div>
      )}
      
      {/* Empty state */}
      {status === 'idle' && (
        <div className="p-6 flex flex-col items-center justify-center h-64 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path></svg>
          <h4 className="text-gray-900 dark:text-gray-100 font-medium mb-1">No Response Yet</h4>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">Submit the request to see the response data here</p>
        </div>
      )}
      
      {/* Error state */}
      {status === 'error' && (
        <div className="p-6">
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 dark:text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Request Error</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                  <p>{errorMessage}</p>
                </div>
              </div>
            </div>
          </div>
          
          {useApiKey && (
            <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <KeyRound className="h-5 w-5 text-yellow-400 dark:text-yellow-500" />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">API Key Authentication</h3>
                  <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                    <p>This error may be related to API authentication. Check that your API key is valid and has the correct permissions.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Success state */}
      {status === 'success' && responseData && (
        <div className="p-6">
          {/* Status bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span 
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  responseData.status >= 200 && responseData.status < 300
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : responseData.status >= 400
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                }`}
              >
                <svg className={`-ml-0.5 mr-1.5 h-2 w-2 ${
                  responseData.status >= 200 && responseData.status < 300
                    ? 'text-green-400 dark:text-green-500'
                    : responseData.status >= 400
                    ? 'text-red-400 dark:text-red-500'
                    : 'text-yellow-400 dark:text-yellow-500'
                }`} fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
                {responseData.status} {responseData.statusText}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">{responseData.time}ms</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <span>{responseData.timestamp}</span>
            </div>
          </div>
          
          {/* Response headers (collapsible) */}
          <div className="mb-4">
            <button 
              onClick={() => setHeadersVisible(!headersVisible)}
              className="flex items-center justify-between w-full py-2 text-sm font-medium text-left text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded px-3 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none"
            >
              <span>Response Headers</span>
              <svg 
                className={`h-5 w-5 text-gray-400 dark:text-gray-500 transform ${headersVisible ? 'rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            <div className={`${headersVisible ? '' : 'hidden'} mt-2 bg-gray-50 dark:bg-gray-700 p-3 rounded text-xs font-mono text-gray-600 dark:text-gray-300 max-h-32 overflow-y-auto custom-scrollbar`}>
              {Object.entries(responseData.headers).map(([key, value]) => (
                <p key={key}>{key}: {value}</p>
              ))}
            </div>
          </div>
          
          {/* Response body */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Response Body</h4>
            <pre className="bg-gray-50 dark:bg-gray-700 rounded p-4 overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 max-h-96 custom-scrollbar">
              {responseType === 'csv' 
                ? responseData.data
                : formatResponse(responseData.data)
              }
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
