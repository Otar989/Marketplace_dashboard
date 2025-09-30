// script.js

// Fetch orders from the backend and render them
async function loadOrders() {
  const ordersContainer = document.getElementById('orders');
  ordersContainer.innerHTML = '<p>Загрузка…</p>';
  try {
    // Use the same origin for API calls unless overridden
    const apiUrl = `${window.location.protocol}//${window.location.hostname}:3001/api/orders`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const orders = data.orders || [];
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
    ordersContainer.innerHTML = '<p>Не удалось загрузить заказы.</p>';
  }
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