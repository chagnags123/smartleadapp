import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";

// API base URL for the external campaign management API
const API_BASE_URL = "https://api.campaignmanagement.example.com";

// Mock server responses for API explorer
function mockResponse(method: string, path: string, data: any) {
  return (req: any, res: any) => {
    // Simulate network latency
    setTimeout(() => {
      res.json(data);
    }, 400); // 400ms delay to show loading state
  };
}

// Sample response data for Campaign Management endpoints
const campaignSampleData = {
  success: true,
  data: {
    campaign_id: "camp_1a2b3c4d5e6f",
    name: "Example Campaign",
    created_at: new Date().toISOString(),
    client_id: "client_123456",
    status: "draft"
  },
  message: "Operation successful"
};

// Sample response data for Email Account endpoints
const emailAccountSampleData = {
  success: true,
  data: {
    email_account_id: "ea_123456789",
    from_name: "John Doe",
    from_email: "john.doe@example.com",
    status: "active",
    max_email_per_day: 100,
    created_at: new Date().toISOString()
  },
  message: "Operation successful"
};

// Sample response data for lead endpoints
const leadSampleData = {
  success: true,
  data: {
    lead_id: "lead_123456",
    email: "contact@example.com",
    first_name: "John",
    last_name: "Smith",
    status: "active",
    created_at: new Date().toISOString()
  },
  message: "Operation successful"
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Campaign Management Endpoints
  app.post('/api/v1/campaigns/create', mockResponse('POST', '/api/v1/campaigns/create', {
    ...campaignSampleData,
    message: "Campaign created successfully"
  }));
  
  app.post('/api/v1/campaigns/:campaign_id/schedule', mockResponse('POST', '/api/v1/campaigns/:campaign_id/schedule', {
    ...campaignSampleData,
    message: "Campaign schedule updated successfully"
  }));
  
  app.post('/api/v1/campaigns/:campaign_id/settings', mockResponse('POST', '/api/v1/campaigns/:campaign_id/settings', {
    ...campaignSampleData,
    message: "Campaign settings updated successfully"
  }));
  
  app.get('/api/v1/campaigns/:campaign_id', mockResponse('GET', '/api/v1/campaigns/:campaign_id', {
    ...campaignSampleData,
    message: "Campaign fetched successfully"
  }));
  
  app.post('/api/v1/campaigns/:campaign_id/sequences', mockResponse('POST', '/api/v1/campaigns/:campaign_id/sequences', {
    ...campaignSampleData,
    data: {
      ...campaignSampleData.data,
      sequences: [
        { id: "seq_1", type: "email", delay_hours: 0 },
        { id: "seq_2", type: "email", delay_hours: 24 },
        { id: "seq_3", type: "email", delay_hours: 72 }
      ]
    },
    message: "Campaign sequences saved successfully"
  }));
  
  app.get('/api/v1/campaigns', mockResponse('GET', '/api/v1/campaigns', {
    success: true,
    data: {
      campaigns: [
        { ...campaignSampleData.data, name: "First Campaign" },
        { ...campaignSampleData.data, name: "Second Campaign", campaign_id: "camp_2a2b3c4d5e6f" },
        { ...campaignSampleData.data, name: "Third Campaign", campaign_id: "camp_3a2b3c4d5e6f" }
      ],
      total: 3,
      page: 1,
      limit: 10
    },
    message: "Campaigns fetched successfully"
  }));
  
  app.post('/api/v1/campaigns/:campaign_id/status', mockResponse('POST', '/api/v1/campaigns/:campaign_id/status', {
    ...campaignSampleData,
    data: {
      ...campaignSampleData.data,
      status: "active"
    },
    message: "Campaign status updated successfully"
  }));
  
  app.get('/api/v1/campaigns/:campaign_id/sequences', mockResponse('GET', '/api/v1/campaigns/:campaign_id/sequences', {
    success: true,
    data: {
      campaign_id: "camp_1a2b3c4d5e6f",
      sequences: [
        { id: "seq_1", type: "email", delay_hours: 0 },
        { id: "seq_2", type: "email", delay_hours: 24 },
        { id: "seq_3", type: "email", delay_hours: 72 }
      ]
    },
    message: "Campaign sequences fetched successfully"
  }));
  
  app.get('/api/v1/leads/:lead_id/campaigns', mockResponse('GET', '/api/v1/leads/:lead_id/campaigns', {
    success: true,
    data: {
      lead_id: "lead_123456",
      campaigns: [
        { ...campaignSampleData.data, name: "First Campaign" },
        { ...campaignSampleData.data, name: "Second Campaign", campaign_id: "camp_2a2b3c4d5e6f" }
      ]
    },
    message: "Lead campaigns fetched successfully"
  }));
  
  app.get('/api/v1/campaigns/:campaign_id/export', (req, res) => {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=campaign_export.csv');
    
    setTimeout(() => {
      res.send(`id,name,email,status,created_at
1,John Doe,john@example.com,active,2023-01-01T12:00:00Z
2,Jane Smith,jane@example.com,pending,2023-01-02T14:30:00Z
3,Bob Johnson,bob@example.com,inactive,2023-01-03T09:15:00Z
4,Alice Williams,alice@example.com,active,2023-01-04T16:45:00Z
5,Charlie Brown,charlie@example.com,pending,2023-01-05T10:20:00Z`);
    }, 400);
  });
  
  app.delete('/api/v1/campaigns/:campaign_id', mockResponse('DELETE', '/api/v1/campaigns/:campaign_id', {
    success: true,
    data: {
      campaign_id: "camp_1a2b3c4d5e6f",
      deleted: true
    },
    message: "Campaign deleted successfully"
  }));
  
  // Email Account Management Endpoints
  app.get('/api/v1/campaigns/:campaign_id/email-accounts', mockResponse('GET', '/api/v1/campaigns/:campaign_id/email-accounts', {
    success: true,
    data: {
      campaign_id: "camp_1a2b3c4d5e6f",
      email_accounts: [
        { ...emailAccountSampleData.data, from_email: "sales1@example.com" },
        { ...emailAccountSampleData.data, from_email: "sales2@example.com", email_account_id: "ea_987654321" }
      ]
    },
    message: "Campaign email accounts fetched successfully"
  }));
  
  app.post('/api/v1/campaigns/:campaign_id/email-accounts', mockResponse('POST', '/api/v1/campaigns/:campaign_id/email-accounts', {
    success: true,
    data: {
      campaign_id: "camp_1a2b3c4d5e6f",
      email_account_id: "ea_123456789",
      associated: true
    },
    message: "Email account added to campaign successfully"
  }));
  
  app.delete('/api/v1/campaigns/:campaign_id/email-accounts/:email_account_id', mockResponse('DELETE', '/api/v1/campaigns/:campaign_id/email-accounts/:email_account_id', {
    success: true,
    data: {
      campaign_id: "camp_1a2b3c4d5e6f",
      email_account_id: "ea_123456789",
      removed: true
    },
    message: "Email account removed from campaign successfully"
  }));
  
  app.get('/api/v1/email-accounts', mockResponse('GET', '/api/v1/email-accounts', {
    success: true,
    data: {
      email_accounts: [
        { ...emailAccountSampleData.data, from_email: "sales1@example.com" },
        { ...emailAccountSampleData.data, from_email: "sales2@example.com", email_account_id: "ea_987654321" },
        { ...emailAccountSampleData.data, from_email: "sales3@example.com", email_account_id: "ea_555555555" }
      ],
      total: 3,
      offset: 0,
      limit: 10
    },
    message: "Email accounts fetched successfully"
  }));
  
  app.post('/api/v1/email-accounts/save', mockResponse('POST', '/api/v1/email-accounts/save', {
    ...emailAccountSampleData,
    message: "Email account created successfully"
  }));
  
  app.post('/api/v1/email-accounts/:email_account_id', mockResponse('POST', '/api/v1/email-accounts/:email_account_id', {
    ...emailAccountSampleData,
    message: "Email account updated successfully"
  }));
  
  app.get('/api/v1/email-accounts/:account_id', mockResponse('GET', '/api/v1/email-accounts/:account_id', {
    ...emailAccountSampleData,
    message: "Email account fetched successfully"
  }));
  
  app.post('/api/v1/email-accounts/:email_account_id/warmup', mockResponse('POST', '/api/v1/email-accounts/:email_account_id/warmup', {
    success: true,
    data: {
      email_account_id: "ea_123456789",
      warmup_enabled: true,
      total_warmup_per_day: 20,
      daily_rampup: 5
    },
    message: "Email account warmup settings updated successfully"
  }));
  
  app.post('/api/v1/email-accounts/reconnect', mockResponse('POST', '/api/v1/email-accounts/reconnect', {
    success: true,
    data: {
      reconnected_accounts: 2,
      failed_accounts: 1
    },
    message: "Attempted to reconnect failed email accounts"
  }));
  
  app.post('/api/v1/email-accounts/:email_account_id/tag', mockResponse('POST', '/api/v1/email-accounts/:email_account_id/tag', {
    success: true,
    data: {
      email_account_id: "ea_123456789",
      tag: "sales"
    },
    message: "Email account tag updated successfully"
  }));

  // Lead Management Endpoints
  app.get('/api/v1/campaigns/:campaign_id/leads', mockResponse('GET', '/api/v1/campaigns/:campaign_id/leads', {
    success: true,
    data: {
      campaign_id: "camp_1a2b3c4d5e6f",
      leads: [
        { ...leadSampleData.data, email: "lead1@example.com" },
        { ...leadSampleData.data, email: "lead2@example.com", lead_id: "lead_234567" },
        { ...leadSampleData.data, email: "lead3@example.com", lead_id: "lead_345678" }
      ],
      total: 3,
      page: 1,
      limit: 10
    },
    message: "Campaign leads fetched successfully"
  }));

  app.get('/api/v1/leads/categories', mockResponse('GET', '/api/v1/leads/categories', {
    success: true,
    data: {
      categories: [
        { id: "cat_1", name: "Hot Lead" },
        { id: "cat_2", name: "Warm Lead" },
        { id: "cat_3", name: "Cold Lead" },
        { id: "cat_4", name: "Customer" },
        { id: "cat_5", name: "Not Interested" }
      ]
    },
    message: "Lead categories fetched successfully"
  }));

  app.get('/api/v1/leads/email/:email', mockResponse('GET', '/api/v1/leads/email/:email', {
    ...leadSampleData,
    message: "Lead fetched successfully"
  }));

  app.post('/api/v1/campaigns/:campaign_id/leads/:lead_id', mockResponse('POST', '/api/v1/campaigns/:campaign_id/leads/:lead_id', {
    success: true,
    data: {
      lead_id: "lead_123456",
      campaign_id: "camp_1a2b3c4d5e6f",
      updated: true
    },
    message: "Lead updated successfully"
  }));

  app.get('/api/v1/campaigns/:campaign_id/leads/:lead_id/message-history', mockResponse('GET', '/api/v1/campaigns/:campaign_id/leads/:lead_id/message-history', {
    success: true,
    data: {
      lead_id: "lead_123456",
      campaign_id: "camp_1a2b3c4d5e6f",
      messages: [
        { id: "msg_1", type: "email", direction: "outbound", subject: "Initial Outreach", body: "Hello, I wanted to reach out...", timestamp: "2023-01-01T10:00:00Z" },
        { id: "msg_2", type: "email", direction: "inbound", subject: "Re: Initial Outreach", body: "Thanks for reaching out...", timestamp: "2023-01-02T14:30:00Z" },
        { id: "msg_3", type: "email", direction: "outbound", subject: "Re: Initial Outreach", body: "I'm glad you're interested...", timestamp: "2023-01-03T09:15:00Z" }
      ]
    },
    message: "Lead message history fetched successfully"
  }));

  // Analytics Endpoints
  app.get('/api/v1/campaigns/:campaign_id/analytics-by-date', mockResponse('GET', '/api/v1/campaigns/:campaign_id/analytics-by-date', {
    success: true,
    data: {
      campaign_id: "camp_1a2b3c4d5e6f",
      analytics: {
        total_emails_sent: 1250,
        open_rate: 0.42,
        click_rate: 0.18,
        reply_rate: 0.08,
        bounce_rate: 0.02,
        daily_stats: [
          { date: "2023-01-01", emails_sent: 250, opens: 110, clicks: 45, replies: 20 },
          { date: "2023-01-02", emails_sent: 300, opens: 135, clicks: 60, replies: 25 },
          { date: "2023-01-03", emails_sent: 200, opens: 80, clicks: 30, replies: 15 },
          { date: "2023-01-04", emails_sent: 250, opens: 100, clicks: 40, replies: 18 },
          { date: "2023-01-05", emails_sent: 250, opens: 110, clicks: 50, replies: 22 }
        ]
      }
    },
    message: "Campaign analytics fetched successfully"
  }));
  
  app.get('/api/v1/campaigns/:campaign_id/sequence-analytics', mockResponse('GET', '/api/v1/campaigns/:campaign_id/sequence-analytics', {
    success: true,
    data: {
      campaign_id: "camp_1a2b3c4d5e6f",
      sequence_analytics: [
        { 
          sequence_id: "seq_1", 
          emails_sent: 500, 
          open_rate: 0.45, 
          click_rate: 0.20, 
          reply_rate: 0.10 
        },
        { 
          sequence_id: "seq_2", 
          emails_sent: 400, 
          open_rate: 0.40, 
          click_rate: 0.18, 
          reply_rate: 0.08 
        },
        { 
          sequence_id: "seq_3", 
          emails_sent: 350, 
          open_rate: 0.38, 
          click_rate: 0.15, 
          reply_rate: 0.06 
        }
      ]
    },
    message: "Sequence analytics fetched successfully"
  }));

  app.get('/api/v1/campaigns/:campaign_id/statistics', mockResponse('GET', '/api/v1/campaigns/:campaign_id/statistics', {
    success: true,
    data: {
      campaign_id: "camp_1a2b3c4d5e6f",
      statistics: {
        total_leads: 1500,
        active_leads: 875,
        completed_leads: 450,
        paused_leads: 175,
        emails_sent: 3250,
        emails_opened: 1365,
        clicks: 585,
        replies: 260,
        bounces: 65
      }
    },
    message: "Campaign statistics fetched successfully"
  }));

  app.get('/api/v1/campaigns/:campaign_id/analytics', mockResponse('GET', '/api/v1/campaigns/:campaign_id/analytics', {
    success: true,
    data: {
      campaign_id: "camp_1a2b3c4d5e6f",
      analytics: {
        open_rate: 0.42,
        click_rate: 0.18,
        reply_rate: 0.08,
        bounce_rate: 0.02,
        conversion_rate: 0.05
      }
    },
    message: "Campaign top level analytics fetched successfully"
  }));

  app.get('/api/v1/campaigns/:campaign_id/top-level-analytics-by-date', mockResponse('GET', '/api/v1/campaigns/:campaign_id/top-level-analytics-by-date', {
    success: true,
    data: {
      campaign_id: "camp_1a2b3c4d5e6f",
      start_date: "2023-01-01",
      end_date: "2023-01-31",
      analytics: {
        open_rate: 0.42,
        click_rate: 0.18,
        reply_rate: 0.08,
        bounce_rate: 0.02,
        daily_metrics: [
          { date: "2023-01-01", open_rate: 0.40, click_rate: 0.15, reply_rate: 0.07 },
          { date: "2023-01-02", open_rate: 0.42, click_rate: 0.18, reply_rate: 0.08 },
          { date: "2023-01-03", open_rate: 0.45, click_rate: 0.20, reply_rate: 0.09 }
        ]
      }
    },
    message: "Campaign top level analytics by date fetched successfully"
  }));

  app.get('/api/v1/campaigns/:campaign_id/lead-statistics', mockResponse('GET', '/api/v1/campaigns/:campaign_id/lead-statistics', {
    success: true,
    data: {
      campaign_id: "camp_1a2b3c4d5e6f",
      lead_statistics: {
        total_leads: 1500,
        status_breakdown: {
          active: 875,
          completed: 450,
          paused: 175
        },
        category_breakdown: {
          "Hot Lead": 320,
          "Warm Lead": 530,
          "Cold Lead": 400,
          "Customer": 150,
          "Not Interested": 100
        }
      }
    },
    message: "Campaign lead statistics fetched successfully"
  }));

  app.get('/api/v1/campaigns/:campaign_id/mailbox-statistics', mockResponse('GET', '/api/v1/campaigns/:campaign_id/mailbox-statistics', {
    success: true,
    data: {
      campaign_id: "camp_1a2b3c4d5e6f",
      mailbox_statistics: [
        { 
          email_account_id: "ea_123456789", 
          from_email: "sales1@example.com",
          emails_sent: 850,
          emails_opened: 357,
          clicks: 153,
          replies: 68,
          bounces: 17,
          daily_sends: [
            { date: "2023-01-01", sent: 150 },
            { date: "2023-01-02", sent: 200 },
            { date: "2023-01-03", sent: 180 },
            { date: "2023-01-04", sent: 170 },
            { date: "2023-01-05", sent: 150 }
          ]
        },
        { 
          email_account_id: "ea_987654321", 
          from_email: "sales2@example.com",
          emails_sent: 650,
          emails_opened: 273,
          clicks: 117,
          replies: 52,
          bounces: 13,
          daily_sends: [
            { date: "2023-01-01", sent: 100 },
            { date: "2023-01-02", sent: 150 },
            { date: "2023-01-03", sent: 120 },
            { date: "2023-01-04", sent: 130 },
            { date: "2023-01-05", sent: 150 }
          ]
        }
      ]
    },
    message: "Campaign mailbox statistics fetched successfully"
  }));

  // Webhook Endpoints
  app.get('/api/v1/campaigns/:campaign_id/webhooks', mockResponse('GET', '/api/v1/campaigns/:campaign_id/webhooks', {
    success: true,
    data: {
      campaign_id: "camp_1a2b3c4d5e6f",
      webhooks: [
        { 
          id: "wh_123456", 
          name: "Lead Reply Notification",
          url: "https://example.com/webhook/lead-reply",
          events: ["lead_reply"],
          active: true,
          created_at: "2023-01-01T10:00:00Z" 
        },
        { 
          id: "wh_234567", 
          name: "Lead Status Change",
          url: "https://example.com/webhook/status-change",
          events: ["lead_status_change"],
          active: true,
          created_at: "2023-01-02T14:30:00Z" 
        }
      ]
    },
    message: "Campaign webhooks fetched successfully"
  }));

  // API Proxy middleware - handles real API requests when API key is provided
  app.use('/api/proxy', async (req: Request, res: Response) => {
    const apiKey = req.headers['x-api-key'] || '';
    const authHeader = req.headers['authorization'] || '';
    
    // If no API key, return error
    if (!apiKey && !authHeader) {
      return res.status(401).json({
        success: false,
        message: 'API key is required for external API requests',
        error: 'missing_api_key'
      });
    }
    
    try {
      // Extract the actual endpoint path from the request URL
      const targetPath = req.originalUrl.replace('/api/proxy', '');
      const targetUrl = `${API_BASE_URL}${targetPath}`;
      
      console.log(`Proxying request to: ${targetUrl}`);
      
      // Forward the request to the external API
      const response = await fetch(targetUrl, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey as string,
          'Authorization': authHeader,
        },
        body: req.method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined,
      });
      
      // Get response data based on content type
      const contentType = response.headers.get('content-type') || '';
      let data;
      
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      // Copy response headers
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      
      // Send the response with the correct status code
      return res.status(response.status).send(data);
      
    } catch (error) {
      console.error('API proxy error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error proxying request to external API',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
