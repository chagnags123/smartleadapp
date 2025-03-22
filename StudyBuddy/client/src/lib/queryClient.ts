import { QueryClient, QueryFunction } from "@tanstack/react-query";

// SmartLead API base URL
const SMARTLEAD_API_BASE_URL = "https://server.smartlead.ai/api/v1";

// Function to get API key from localStorage
export function getApiKey() {
  return localStorage.getItem('api_explorer_api_key') || '';
}

// Function to check if API key is set
export function hasApiKey() {
  return !!getApiKey();
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: unknown | undefined,
  options?: {
    customHeaders?: Record<string, string>;
    skipAuth?: boolean;
  }
): Promise<Response> {
  const apiKey = getApiKey();
  
  // Prepare headers
  const headers: Record<string, string> = {
    "Accept": "application/json",
    ...(options?.customHeaders || {})
  };
  
  // Add content-type for requests with body
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  // Build the URL with the API key as a query parameter (per SmartLead API docs)
  let url = endpoint;
  
  // Determine if we're using a real API or a mock endpoint
  const isRealApi = endpoint.startsWith(SMARTLEAD_API_BASE_URL);
  
  // If it's a real API and we have an API key, add it as a query parameter
  if (isRealApi && apiKey && !options?.skipAuth) {
    const separator = endpoint.includes('?') ? '&' : '?';
    url = `${endpoint}${separator}api_key=${apiKey}`;
  }

  // Log request details (helps with debugging)
  console.log(`Making ${method} request to: ${url}`);

  const startTime = performance.now();
  
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    // Calculate request time
    const endTime = performance.now();
    const requestTime = Math.round(endTime - startTime);
    
    // Add request time to response object for display purposes
    Object.defineProperty(res, 'requestTime', {
      value: requestTime,
      writable: false
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    // Log authentication errors in a helpful way
    if (!getApiKey()) {
      console.error('API request failed - No API key provided');
    }
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      // Determine the URL for the request
      let url = queryKey[0] as string;
      
      // If the URL is a relative path, prefix it with the SmartLead API base URL
      if (!url.startsWith('http')) {
        // Make sure we don't double up on slashes
        const endpoint = url.startsWith('/') ? url : `/${url}`;
        url = `${SMARTLEAD_API_BASE_URL}${endpoint}`;
      }
      
      const response = await apiRequest('GET', url, undefined);
      
      // Handle 401 based on specified behavior
      if (unauthorizedBehavior === "returnNull" && response.status === 401) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      if (unauthorizedBehavior === "returnNull" && error instanceof Response && error.status === 401) {
        return null;
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ 
        on401: "throw"
      }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
