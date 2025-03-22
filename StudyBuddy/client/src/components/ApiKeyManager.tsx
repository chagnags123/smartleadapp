import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Key, Copy, Check, KeyRound } from 'lucide-react';

interface ApiKeyManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiKeyManager({ isOpen, onClose }: ApiKeyManagerProps) {
  const [apiKey, setApiKey] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [useApiKey, setUseApiKey] = useState(false);
  const { toast } = useToast();

  // Load saved API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('api_explorer_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    
    const savedUseApiKey = localStorage.getItem('api_explorer_use_api_key');
    if (savedUseApiKey) {
      setUseApiKey(savedUseApiKey === 'true');
    }
  }, []);

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('api_explorer_api_key', apiKey);
    }
  }, [apiKey]);

  // Save use API key setting to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('api_explorer_use_api_key', useApiKey.toString());
  }, [useApiKey]);

  const handleCopyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setIsCopied(true);
      
      toast({
        title: "API Key Copied",
        description: "API key has been copied to your clipboard.",
        duration: 3000,
      });
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  const handleSaveApiKey = () => {
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved successfully.",
      duration: 3000,
    });
    onClose();
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleUseApiKeyChange = (checked: boolean) => {
    setUseApiKey(checked);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        
        <div className="flex items-center mb-4">
          <KeyRound className="text-primary h-6 w-6 mr-2" />
          <h2 className="text-xl font-semibold">API Key Configuration</h2>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Enter your API key below. This key will be included in all API requests.
        </p>
        
        <div className="mb-4">
          <Label htmlFor="api-key" className="mb-2 block">API Key</Label>
          <div className="flex gap-2">
            <Input 
              id="api-key"
              type="text" 
              value={apiKey} 
              onChange={handleApiKeyChange}
              placeholder="Enter your API key" 
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyApiKey}
              disabled={!apiKey}
              title="Copy API Key"
            >
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mb-6">
          <Switch 
            id="use-api-key" 
            checked={useApiKey}
            onCheckedChange={handleUseApiKeyChange}
          />
          <Label htmlFor="use-api-key">Include API key in all requests</Label>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSaveApiKey}>Save Configuration</Button>
        </div>
      </div>
    </div>
  );
}