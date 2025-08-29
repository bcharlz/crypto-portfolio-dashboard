# 🚀 Crypto Portfolio Dashboard

A beautiful, modern cryptocurrency portfolio tracker built with React, Vite, and Tailwind CSS. Track your investments, analyze performance, and visualize your crypto journey with stunning charts and responsive design.

![Dashboard Preview](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Crypto+Portfolio+Dashboard)

## ✨ Features

- **📊 Real-time Price Data** - Live cryptocurrency prices from CoinGecko API
- **💰 Portfolio Tracking** - Track BTC, ETH, LINK, DOGE, XRP, and USD holdings
- **📈 Performance Analytics** - Detailed profit/loss analysis per asset
- **🎨 Beautiful UI** - Modern glassmorphism design with dark/light mode
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **⚡ Lightning Fast** - Built with Vite for optimal performance
- **🔄 Auto-refresh** - Price updates every 60 seconds
- **📊 Interactive Charts** - Portfolio timeline, allocation pie charts, and trading activity

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **API**: CoinGecko (free tier)
- **Build Tool**: Vite
- **Package Manager**: npm

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/crypto-portfolio-dashboard.git
   cd crypto-portfolio-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## 📁 Project Structure

```
crypto-portfolio-dashboard/
├── public/
│   └── crypto-icon.svg
├── src/
│   ├── components/
│   │   └── CryptoPortfolioDashboard.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Customization

### Adding Your Own Data

Replace the `rawTransactions` array in `CryptoPortfolioDashboard.jsx` with your own transaction history:

```javascript
const rawTransactions = [
  {
    date: '2021-01-08',
    type: 'Buy',
    symbol: 'BTCUSD',
    usdAmount: -1000,
    fee: 15,
    btcBalance: 0.025,
    ethBalance: 0,
    // ... other balances
  },
  // ... your transactions
];
```

### Adding New Cryptocurrencies

1. Update the `CG_IDS` object with CoinGecko IDs:
```javascript
const CG_IDS = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana", // Add new crypto
  // ...
};
```

2. Add fallback prices and update transaction structure accordingly.

### Styling Customization

The dashboard uses Tailwind CSS. Customize colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      brand: '#your-brand-color',
      // ... custom colors
    }
  }
}
```

## 🌐 Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Drag & drop the 'dist' folder to netlify.com/drop
```

### Linode VPS
See the detailed [Linode deployment guide](DEPLOYMENT.md) for VPS setup instructions.

## 📊 API Usage

The dashboard uses the free CoinGecko API:
- **Endpoint**: `https://api.coingecko.com/api/v3/simple/price`
- **Rate Limit**: 10-30 calls/minute (free tier)
- **No API key required** for basic price data

### API Response Format
```json
{
  "bitcoin": { "usd": 45000 },
  "ethereum": { "usd": 3000 },
  "chainlink": { "usd": 25 }
}
```

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env` file for custom settings:

```env
VITE_API_REFRESH_INTERVAL=60000
VITE_COINGECKO_API_URL=https://api.coingecko.com/api/v3
```

### Performance Optimization

The build is optimized with:
- **Code splitting** for vendor libraries
- **Tree shaking** to remove unused code
- **Asset optimization** and compression
- **Lazy loading** for better initial load times

## 🎯 Features Breakdown

### 📈 Overview Tab
- Portfolio value and performance metrics
- Interactive growth timeline chart
- Asset allocation pie chart
- Quick asset performance cards

### 💰 Profits Tab
- Total ROI calculation
- Per-asset profit/loss breakdown
- Performance timeline visualization
- Detailed profit analysis table

### 💼 Holdings Tab
- Current asset balances
- Real-time values and prices
- Allocation percentages with progress bars

### ⏱️ Timeline Tab
- Historical balance evolution
- Stacked area chart by asset
- Portfolio composition over time

### 📊 Activity Tab
- Trading volume visualization
- Complete transaction history
- Transaction type indicators

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [CoinGecko](https://coingecko.com) for providing free cryptocurrency data
- [Tailwind CSS](https://tailwindcss.com) for the amazing utility-first CSS framework
- [Recharts](https://recharts.org) for beautiful React charts
- [Lucide](https://lucide.dev) for the clean icon set

## 📞 Support

If you have any questions or run into issues:

1. Check the [Issues](https://github.com/yourusername/crypto-portfolio-dashboard/issues) page
2. Create a new issue with detailed information
3. Reach out on [Twitter](https://twitter.com/yourusername)

---

**⭐ Star this repo if you found it helpful!**