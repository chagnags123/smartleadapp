export interface APIEndpoint {
  name: string;
  value: string;
  method: 'GET' | 'POST' | 'DELETE';
  description: string;
  params: { name: string; type: string; required: boolean; description: string }[];
  url: string;
  realApiUrl?: string; // URL for the real API (used when useRealApi is true)
  responseType?: 'json' | 'csv';
}

// Environment settings for the API Explorer
export interface ApiEnvironmentSettings {
  useRealApi: boolean;     // If true, use real API endpoints; if false, use mock API
  baseApiUrl: string;      // Base URL for the API
  proxyEnabled: boolean;   // If true, requests go through our proxy; if false, direct to API
}

// Default environment settings
export const defaultApiEnvironmentSettings: ApiEnvironmentSettings = {
  useRealApi: false,
  baseApiUrl: '/api/v1',   // Default mock API path
  proxyEnabled: true
};

// API data from the provided document, grouped by category
export const apiEndpoints: { [category: string]: APIEndpoint[] } = {
  'Campaign Management': [
    {
      name: 'Create Campaign',
      value: 'createCampaign',
      method: 'POST',
      description: 'Creates a new campaign.',
      params: [
        { name: 'name', type: 'string', required: true, description: 'Name of the campaign' },
        { name: 'client_id', type: 'string', required: false, description: 'Client ID (optional)' },
      ],
      url: '/api/v1/campaigns/create',
    },
    {
      name: 'Update Campaign Schedule',
      value: 'updateCampaignSchedule',
      method: 'POST',
      description: 'Updates the schedule of an existing campaign',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
      ],
      url: '/api/v1/campaigns/{campaign_id}/schedule',
    },
    {
      name: 'Update Campaign Settings',
      value: 'updateCampaignSettings',
      method: 'POST',
      description: 'Updates general campaign settings.',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
      ],
      url: '/api/v1/campaigns/{campaign_id}/settings',
    },
    {
      name: 'Get Campaign By Id',
      value: 'getCampaignById',
      method: 'GET',
      description: 'Retrieves campaign details by ID.',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
      ],
      url: '/api/v1/campaigns/{campaign_id}',
    },
    {
      name: 'Save Campaign Sequence',
      value: 'saveCampaignSequence',
      method: 'POST',
      description: 'Saves the sequence for a campaign.',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
        { name: 'sequences', type: 'array', required: true, description: 'Array of sequence steps' },
      ],
      url: '/api/v1/campaigns/{campaign_id}/sequences',
    },
    {
      name: 'List all Campaigns',
      value: 'listCampaigns',
      method: 'GET',
      description: 'Retrieves a list of all campaigns.',
      params: [],
      url: '/api/v1/campaigns',
    },
    {
      name: 'Patch campaign status',
      value: 'patchCampaignStatus',
      method: 'POST',
      description: 'Updates the status of a campaign.',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
      ],
      url: '/api/v1/campaigns/{campaign_id}/status',
    },
    {
      name: 'Fetch Campaign Sequence By Campaign ID',
      value: 'fetchCampaignSequenceById',
      method: 'GET',
      description: 'Fetches the sequence of a campaign by its ID',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
      ],
      url: '/api/v1/campaigns/{campaign_id}/sequences',
    },
    {
      name: 'Fetch all Campaigns Using Lead ID',
      value: 'fetchCampaignsByLeadId',
      method: 'GET',
      description: 'Fetches all campaigns a lead is in.',
      params: [
        { name: 'lead_id', type: 'string', required: true, description: 'Lead ID' },
      ],
      url: '/api/v1/leads/{lead_id}/campaigns',
    },
    {
      name: 'Export data from a campaign',
      value: 'exportCampaignData',
      method: 'GET',
      description: 'Exports data from a campaign.',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
      ],
      url: '/api/v1/campaigns/{campaign_id}/export',
      responseType: 'csv',
    },
    {
      name: 'Delete Campaign',
      value: 'deleteCampaign',
      method: 'DELETE',
      description: 'Deletes a campaign.',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
      ],
      url: '/api/v1/campaigns/{campaign_id}',
    },
  ],
  'Email Account Management': [
    {
      name: 'List all email accounts per campaign',
      value: 'listEmailAccountsPerCampaign',
      method: 'GET',
      description: 'Retrieves all email accounts associated with a specific campaign',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
      ],
      url: '/api/v1/campaigns/{campaign_id}/email-accounts',
    },
    {
      name: 'Add Email Account to a Campaign',
      value: 'addEmailAccountToCampaign',
      method: 'POST',
      description: 'Associates an existing email account with a specified campaign',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
      ],
      url: '/api/v1/campaigns/{campaign_id}/email-accounts',
    },
    {
      name: 'Remove Email Account from a Campaign',
      value: 'removeEmailAccountFromCampaign',
      method: 'DELETE',
      description: 'Disassociates an email account from a campaign',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
        { name: 'email_account_id', type: 'string', required: true, description: 'Email Account ID' },
      ],
      url: '/api/v1/campaigns/{campaign_id}/email-accounts/{email_account_id}',
    },
    {
      name: 'Fetch all email accounts associated to a user',
      value: 'fetchAllEmailAccounts',
      method: 'GET',
      description: 'Retrieves a list of all email accounts associated with the authenticated user',
      params: [
        { name: 'offset', type: 'number', required: false, description: 'Pagination offset' },
        { name: 'limit', type: 'number', required: false, description: 'Pagination limit' },
      ],
      url: '/api/v1/email-accounts',
    },
    {
      name: 'Create an Email Account',
      value: 'createEmailAccount',
      method: 'POST',
      description: 'Creates a new email account',
      params: [
        { name: 'from_name', type: 'string', required: true, description: 'Sender name' },
        { name: 'from_email', type: 'string', required: true, description: 'Sender email' },
        { name: 'user_name', type: 'string', required: true, description: 'Username' },
        { name: 'password', type: 'string', required: true, description: 'Password' },
        { name: 'smtp_host', type: 'string', required: true, description: 'SMTP Host' },
        { name: 'smtp_port', type: 'number', required: true, description: 'SMTP Port' },
        { name: 'smtp_security', type: 'string', required: true, description: 'SMTP Security (e.g., TLS, SSL)' },
        { name: 'max_email_per_day', type: 'number', required: false, description: 'Max emails per day' },
      ],
      url: '/api/v1/email-accounts/save',
    },
    {
      name: 'Update Email Account',
      value: 'updateEmailAccount',
      method: 'POST',
      description: 'Modifies the settings of an existing email account',
      params: [
        { name: 'email_account_id', type: 'string', required: true, description: 'Email account ID' },
        { name: 'max_email_per_day', type: 'number', required: false, description: 'Max emails per day' },
        { name: 'custom_tracking_url', type: 'string', required: false, description: 'Custom tracking URL' },
        { name: 'signature', type: 'string', required: false, description: 'Email signature' },
      ],
      url: '/api/v1/email-accounts/{email_account_id}',
    },
    {
      name: 'Fetch Email Account By ID',
      value: 'fetchEmailAccountById',
      method: 'GET',
      description: 'Retrieves the details of a specific email account using its ID',
      params: [
        { name: 'account_id', type: 'string', required: true, description: 'Account ID' },
      ],
      url: '/api/v1/email-accounts/{account_id}',
    },
    {
      name: 'Add/Update Warmup To Email Account',
      value: 'addUpdateWarmupToEmailAccount',
      method: 'POST',
      description: 'Adds or updates the warmup settings for an email account',
      params: [
        { name: 'email_account_id', type: 'string', required: true, description: 'Email account ID' },
        { name: 'warmup_enabled', type: 'boolean', required: false, description: 'Is warmup enabled?' },
        { name: 'total_warmup_per_day', type: 'number', required: false, description: 'Total warmup emails per day' },
        { name: 'daily_rampup', type: 'number', required: false, description: 'Daily rampup value' },
      ],
      url: '/api/v1/email-accounts/{email_account_id}/warmup',
    },
    {
      name: 'Reconnect failed email accounts',
      value: 'reconnectFailedEmailAccounts',
      method: 'POST',
      description: 'Attempts to reconnect email accounts that have previously failed',
      params: [],
      url: '/api/v1/email-accounts/reconnect',
    },
    {
      name: 'Update Email Account Tag',
      value: 'updateEmailAccountTag',
      method: 'POST',
      description: 'Updates the tag associated with an email account',
      params: [
        { name: 'email_account_id', type: 'string', required: true, description: 'Email account ID' },
        { name: 'tag', type: 'string', required: true, description: 'Tag to add/update' },
      ],
      url: '/api/v1/email-accounts/{email_account_id}/tag',
    },
  ],
  'Analytics': [
    {
      name: 'Fetch Campaign Analytics by Date range',
      value: 'fetchCampaignAnalyticsByDateRange',
      method: 'GET',
      description: 'Retrieves campaign statistics within a specified date range',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
        { name: 'start_date', type: 'string', required: true, description: 'Start date (YYYY-MM-DD)' },
        { name: 'end_date', type: 'string', required: true, description: 'End date (YYYY-MM-DD)' },
      ],
      url: '/api/v1/campaigns/{campaign_id}/analytics-by-date',
    },
    {
      name: 'Get Campaign Sequence Analytics',
      value: 'getCampaignSequenceAnalytics',
      method: 'GET',
      description: 'Retrieves analytics specific to the sequence of a campaign',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
      ],
      url: '/api/v1/campaigns/{campaign_id}/sequence-analytics',
    },
    {
      name: 'Get Campaign Statistics',
      value: 'getCampaignStatistics',
      method: 'GET',
      description: 'Retrieves overall campaign statistics and performance metrics',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
      ],
      url: '/api/v1/campaigns/{campaign_id}/statistics',
    },
    {
      name: 'Get Campaign Top-Level Analytics',
      value: 'getCampaignTopLevelAnalytics',
      method: 'GET',
      description: 'Retrieves high-level analytics for a campaign',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
      ],
      url: '/api/v1/campaigns/{campaign_id}/analytics',
    },
    {
      name: 'Get Campaign Analytics by Date',
      value: 'getCampaignAnalyticsByDate',
      method: 'GET',
      description: 'Retrieves campaign analytics broken down by date',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
        { name: 'start_date', type: 'string', required: false, description: 'Start date (YYYY-MM-DD)' },
        { name: 'end_date', type: 'string', required: false, description: 'End date (YYYY-MM-DD)' },
      ],
      url: '/api/v1/campaigns/{campaign_id}/top-level-analytics-by-date',
    },
    {
      name: 'Get Campaign Lead Statistics',
      value: 'getCampaignLeadStatistics',
      method: 'GET',
      description: 'Retrieves statistics about leads in a campaign',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
      ],
      url: '/api/v1/campaigns/{campaign_id}/lead-statistics',
    },
    {
      name: 'Get Campaign Mailbox Statistics',
      value: 'getCampaignMailboxStatistics',
      method: 'GET',
      description: 'Retrieves statistics about email accounts used in a campaign',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
      ],
      url: '/api/v1/campaigns/{campaign_id}/mailbox-statistics',
    },
  ],
  'Lead Management': [
    {
      name: 'Get Campaign Leads',
      value: 'getCampaignLeads',
      method: 'GET',
      description: 'Retrieves all leads associated with a campaign',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
        { name: 'page', type: 'number', required: false, description: 'Page number (for pagination)' },
        { name: 'limit', type: 'number', required: false, description: 'Number of leads per page' },
      ],
      url: '/api/v1/campaigns/{campaign_id}/leads',
    },
    {
      name: 'Get Lead Categories',
      value: 'getLeadCategories',
      method: 'GET',
      description: 'Retrieves all available lead categories',
      params: [],
      url: '/api/v1/leads/categories',
    },
    {
      name: 'Get Lead by Email',
      value: 'getLeadByEmail',
      method: 'GET',
      description: 'Retrieves a lead by their email address',
      params: [
        { name: 'email', type: 'string', required: true, description: 'Lead email address' },
      ],
      url: '/api/v1/leads/email/{email}',
    },
    {
      name: 'Update Lead in Campaign',
      value: 'updateLeadInCampaign',
      method: 'POST',
      description: 'Updates a lead within a specific campaign',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
        { name: 'lead_id', type: 'string', required: true, description: 'Lead ID' },
        { name: 'status', type: 'string', required: false, description: 'Lead status' },
        { name: 'category', type: 'string', required: false, description: 'Lead category' },
      ],
      url: '/api/v1/campaigns/{campaign_id}/leads/{lead_id}',
    },
    {
      name: 'Get Lead Message History',
      value: 'getLeadMessageHistory',
      method: 'GET',
      description: 'Retrieves message history for a lead in a campaign',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
        { name: 'lead_id', type: 'string', required: true, description: 'Lead ID' },
      ],
      url: '/api/v1/campaigns/{campaign_id}/leads/{lead_id}/message-history',
    },
  ],
  'Webhooks': [
    {
      name: 'Get Campaign Webhooks',
      value: 'getCampaignWebhooks',
      method: 'GET',
      description: 'Retrieves all webhooks configured for a campaign',
      params: [
        { name: 'campaign_id', type: 'string', required: true, description: 'Campaign ID' },
      ],
      url: '/api/v1/campaigns/{campaign_id}/webhooks',
    },
  ],
};
