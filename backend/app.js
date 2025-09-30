const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file if present
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Allow cross-origin requests so static frontends (e.g. GitHub Pages) can call the API.
app.use(cors());

// Helper: fetch unfulfilled orders from Ozon Seller API
async function fetchOzonOrders() {
  const clientId = process.env.OZON_CLIENT_ID;
  const apiKey = process.env.OZON_API_KEY;
  // If no credentials provided, return sample data
  if (!clientId || !apiKey) {
    return [
      {
        id: '123456',
        createdAt: new Date().toISOString(),
        status: 'awaiting_confirmation',
        marketplace: 'Ozon',
      },
    ];
  }
  try {
    const response = await axios.post(
      'https://api-seller.ozon.ru/v3/posting/fbs/unfulfilled/list',
      {
        limit: 50,
        offset: 0,
      },
      {
        headers: {
          'Client-Id': clientId,
          'Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    const postings = response.data?.result?.postings || [];
    // Map to unified schema
    return postings.map((p) => ({
      id: p.posting_number,
      createdAt: p.in_process_at || p.shipment_date || new Date().toISOString(),
      status: p.status,
      marketplace: 'Ozon',
    }));
  } catch (error) {
    console.error('Error fetching Ozon orders:', error.response?.data || error.message);
    return [];
  }
}

// Helper: fetch orders from Wildberries API
async function fetchWildberriesOrders() {
  const token = process.env.WB_API_TOKEN;
  if (!token) {
    return [
      {
        id: 'WB-987654',
        createdAt: new Date().toISOString(),
        status: 'new',
        marketplace: 'Wildberries',
      },
    ];
  }
  try {
    const response = await axios.get('https://suppliers-api.wildberries.ru/api/v3/orders', {
      headers: {
        Authorization: token,
      },
      params: {
        // Return only active orders; adjust parameters as needed
        limit: 50,
        next: 0,
      },
    });
    const orders = response.data?.orders || [];
    return orders.map((o) => ({
      id: o.id?.toString() || o.number || '',
      createdAt: o.created_at || new Date().toISOString(),
      status: o.status,
      marketplace: 'Wildberries',
    }));
  } catch (error) {
    console.error('Error fetching Wildberries orders:', error.response?.data || error.message);
    return [];
  }
}

// Helper: fetch orders from Yandex Market Partner API
async function fetchYandexOrders() {
  const partnerId = process.env.YANDEX_PARTNER_ID;
  const token = process.env.YANDEX_API_TOKEN;
  if (!partnerId || !token) {
    return [
      {
        id: 'YM-543210',
        createdAt: new Date().toISOString(),
        status: 'processing',
        marketplace: 'Yandex Market',
      },
    ];
  }
  try {
    const response = await axios.get(
      `https://api.partner.market.yandex.ru/v2/campaigns/${partnerId}/orders.json`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: {
          status: 'PROCESSING',
          // Additional filters can be added here
        },
      }
    );
    const orders = response.data?.orders || [];
    return orders.map((o) => ({
      id: o.id?.toString() || '',
      createdAt: o.creationDate || new Date().toISOString(),
      status: o.status?.status || o.status || '',
      marketplace: 'Yandex Market',
    }));
  } catch (error) {
    console.error('Error fetching Yandex Market orders:', error.response?.data || error.message);
    return [];
  }
}

// Endpoint to aggregate orders
app.get('/api/orders', async (req, res) => {
  // Fetch in parallel
  const [ozonOrders, wbOrders, ymOrders] = await Promise.all([
    fetchOzonOrders(),
    fetchWildberriesOrders(),
    fetchYandexOrders(),
  ]);
  // Combine into a single array
  const allOrders = [...ozonOrders, ...wbOrders, ...ymOrders];
  res.json({ orders: allOrders });
});

// Health check
app.get('/', (_req, res) => {
  res.send('Marketplace Dashboard backend is running');
});

// When running locally we start the HTTP server. In serverless environments
// (e.g. Vercel) the app is exported and Vercel handles the request lifecycle.
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Marketplace Dashboard backend listening on port ${port}`);
  });
}

module.exports = app;
