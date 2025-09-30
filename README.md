# Marketplace Dashboard (Full Solution)

This repository contains a fully functional template for a **multi‑marketplace order dashboard**.  It aggregates orders from multiple marketplaces and presents them in a single, beautiful interface inspired by Apple’s **Liquid Glass** design language.  Both the backend and frontend are included so you can run the entire project locally or deploy it to your own server.

## ✨ Features

- **Aggregated orders** from different marketplaces.  The backend exposes a `/api/orders` endpoint that pulls orders from multiple marketplaces (Ozon, Wildberries, and Yandex Market) and normalises them into a common schema.
- **Liquid Glass design** on the frontend using glassmorphism techniques—blurred panels, soft borders and specular highlights—that create the feeling of translucent glass.  Apple’s new “Liquid Glass” material uses translucent real‑time rendering and specular highlights to create depth【110788105649255†L364-L383】; this template achieves a similar look using modern CSS.
- **Responsive layout** that automatically adapts from desktop to mobile.  Cards wrap into a single column on small screens and retain generous spacing on larger screens.
- **Built with standard tools**—the backend uses **Node.js + Express** and the frontend is plain **HTML/CSS/JS** so there is nothing to compile.  This makes it easy to customise and deploy anywhere.

## 🏗️ Project structure

```
marketplace_dashboard/
├── backend/
│   ├── app.js         # Express server exposing `/api/orders`
│   ├── package.json   # Backend dependencies and scripts
└── frontend/
    ├── index.html     # Main UI (mobile & desktop responsive)
    ├── style.css      # Styling (Liquid Glass / glassmorphism)
    └── script.js      # Fetches orders from backend & renders cards
```

## 🚀 Getting started

1. **Install Node.js** (version 18 or newer).  You can download it from [nodejs.org](https://nodejs.org/).
2. Open a terminal in the `backend` directory and run:

   ```bash
   npm install
   npm start
   ```

   The server starts on port `3001` by default.  You can change this by setting the `PORT` environment variable.
3. In a second terminal, serve the `frontend` directory.  You can use a simple HTTP server like [`http-server`](https://www.npmjs.com/package/http-server) or any other static server.  For example:

   ```bash
   npx http-server ./frontend -p 3000
   ```

4. Navigate to [http://localhost:3000](http://localhost:3000) in your browser.  The dashboard will request order data from `http://localhost:3001/api/orders`.

## 🔧 Configuring marketplace APIs

The backend is already prepared to call the official APIs for Ozon, Wildberries and Yandex Market.  To enable real data, create a `.env` file in the `backend` directory and set the appropriate environment variables:

```env
# Ozon API credentials
OZON_CLIENT_ID=your_client_id_here
OZON_API_KEY=your_api_key_here

# Wildberries API token
WB_API_TOKEN=your_wb_api_token_here

# Yandex Market API credentials
YANDEX_PARTNER_ID=your_partner_id_here
YANDEX_API_TOKEN=your_api_token_here

# Optional: override the server port
PORT=3001
```

**Important:** You will need to request API keys from each marketplace.  Once you have them, place them in the `.env` file as shown above.  If no keys are provided, the backend falls back to returning sample orders.

### Ozon
The Ozon Seller API is documented on their [official site](https://docs.ozon.dev/).  The server uses the `posting/fbs/unfulfilled/list` endpoint to fetch unfulfilled orders.  Liquid Glass design influences include translucent materials that adapt to content and context【110788105649255†L364-L383】, mirrored here by the frosted panels in the UI.

### Wildberries
Wildberries exposes its data via the [Statistics API](https://dev.wildberries.ru/) and the [Orders API](https://openapi.wildberries.ru/).  The server calls the `api/v1/supplier/orders` endpoint to retrieve active orders.  Glassmorphism works well here because it layers information on top of vibrant backgrounds, enhancing depth while maintaining legibility【680031646991631†L70-L97】.

### Yandex Market
Yandex offers a [Partner API](https://yandex.ru/dev/market/) for sellers.  It requires a partner ID and OAuth token.  The server calls `campaigns/{campaignId}/orders` to fetch orders.  According to design guidelines, Liquid Glass dynamically adapts opacity and contrast to underlying content【680031646991631†L100-L112】; our CSS includes dynamic blur and tint effects to evoke this feel.

## 📱 UI design notes

- **Glass panels:** Each order card uses `backdrop-filter: blur()` and a semi‑transparent background to simulate frosted glass.  A subtle border and box‑shadow create a specular highlight, mimicking Apple’s Liquid Glass, which uses real‑time rendering and specular highlights【110788105649255†L364-L383】.
- **Responsive grid:** On desktop, order cards are displayed in a flexible grid with gaps.  On screens narrower than 600 px, cards stack into a single column for easy scrolling.
- **Minimal clutter:** Glassmorphism shines when content is clear and uncluttered【680031646991631†L70-L97】.  The layout focuses on essential information: marketplace, order ID, date and status.
- **Adaptable colours:** The cards pick up hints of colour from the background gradient, similar to how Liquid Glass adapts its tint based on surrounding content【680031646991631†L100-L112】.

Feel free to customise the design further.  The UI is intentionally lightweight so you can extend it—add charts, filters, analytics, or integrate with your own analytics stack.

## 🤝 Support & contributions

This template is provided as a starting point.  Pull requests and suggestions are welcome!