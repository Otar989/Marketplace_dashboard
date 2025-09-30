// script.js

// Fetch orders from the backend and render them
async function loadOrders() {
  const ordersContainer = document.getElementById('orders');
  ordersContainer.innerHTML = '<p>Загрузка…</p>';
  try {
    const orders = await retrieveOrders();
    renderSummary(orders);
    if (!orders.length) {
      ordersContainer.innerHTML = '<p>Нет заказов для отображения.</p>';
      return;
    }
    ordersContainer.innerHTML = '';
    orders.forEach((order) => {
      const card = document.createElement('div');
      card.className = 'order-card';
      card.innerHTML = `
        <h3>${order.marketplace}</h3>
        <p><strong>ID:</strong> ${order.id}</p>
        <p><strong>Дата:</strong> ${formatDate(order.createdAt)}</p>
        <p class="status"><strong>Статус:</strong> ${translateStatus(order.status)}</p>
      `;
      ordersContainer.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    renderSummary([]);
    ordersContainer.innerHTML = '<p>Не удалось загрузить заказы.</p>';
  }
}

// Render a lightweight dashboard summary with counts per marketplace.
function renderSummary(orders) {
  const summaryContainer = document.getElementById('summary');
  if (!summaryContainer) return;
  const stats = aggregateByMarketplace(orders);
  if (!stats.length) {
    summaryContainer.innerHTML = '<p>Данных пока нет.</p>';
    return;
  }
  summaryContainer.innerHTML = '';
  stats.forEach(({ marketplace, count }) => {
    const card = document.createElement('div');
    card.className = 'summary-card';
    card.innerHTML = `
      <h2>${count}</h2>
      <p>${marketplace}</p>
    `;
    summaryContainer.appendChild(card);
  });
}

// Count orders per marketplace and sort alphabetically.
function aggregateByMarketplace(orders) {
  if (!orders || !orders.length) return [];
  const map = new Map();
  orders.forEach((order) => {
    const key = order.marketplace || 'Другие';
    const current = map.get(key) || 0;
    map.set(key, current + 1);
  });
  return Array.from(map.entries())
    .map(([marketplace, count]) => ({ marketplace, count }))
    .sort((a, b) => a.marketplace.localeCompare(b.marketplace));
}

// Decide which API endpoint should be used and fetch orders.
async function retrieveOrders() {
  const apiBaseUrl = resolveApiBaseUrl();
  if (apiBaseUrl) {
    try {
      const response = await fetch(`${apiBaseUrl}/api/orders`);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      return data.orders || [];
    } catch (error) {
      console.warn('Не удалось получить данные с бэкенда. Используем демо‑данные.', error);
    }
  }
  return loadSampleOrders();
}

// Fallback: load bundled sample orders for demo mode.
async function loadSampleOrders() {
  const response = await fetch('sample-orders.json');
  if (!response.ok) {
    throw new Error('Не удалось загрузить демонстрационные данные');
  }
  const data = await response.json();
  return data.orders || [];
}

// Determine backend URL based on config and environment.
function resolveApiBaseUrl() {
  const config = window.APP_CONFIG || {};
  if (config.API_BASE_URL && typeof config.API_BASE_URL === 'string') {
    return config.API_BASE_URL.replace(/\/$/, '');
  }
  const { hostname, protocol } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const port = config.LOCAL_BACKEND_PORT || 3001;
    return `${protocol}//${hostname}:${port}`;
  }
  return '';
}

// Format ISO date string to human‑readable (DD.MM.YYYY HH:MM)
function formatDate(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// Translate status codes into Russian (feel free to extend)
function translateStatus(status) {
  const map = {
    awaiting_confirmation: 'Ожидает подтверждения',
    new: 'Новый',
    processing: 'В обработке',
    delivered: 'Доставлен',
    cancelled: 'Отменён',
  };
  return map[status] || status;
}

// Load orders when the page loads
document.addEventListener('DOMContentLoaded', loadOrders);
