# 🌍 ExchangeEase

**ExchangeEase** is a cross-platform mobile application designed for seamless currency exchange operations. It provides real-time and historical exchange rates, secure wallet management, and streamlined currency transactions through a mobile-friendly interface.

---

## 📲 Features

### ✅ Mobile Application

- **Account Management**
  - User registration and profile updates.
- **Account Funding**
  - Fund your wallet via virtual transfers.
- **Withdrawals**
  - Securely withdraw funds from your wallet.
- **Live Exchange Rates**
  - View real-time currency exchange data.
  - Search and filter by currency.
- **Historical Exchange Rates**
  - Browse and filter archived data.
- **Currency Transactions**
  - Buy and sell currencies with real-time wallet updates.
- **Transaction History**
  - View your complete transaction log.

---

## 🌐 Web Service

- **Business Logic**
  - Full validation, currency operations, and error handling.
- **API Integration**
  - Connects to the [National Bank of Poland API](https://api.nbp.pl/) for real-time and historical exchange rates.
- **Service Interface**
  - REST/SOAP endpoints for mobile interaction.

---

## 🗄️ Database Schema

- **User Data**
  - Secure storage of personal details and credentials.
- **Transaction Data**
  - Full record of each currency transaction.
- **Currency Balances**
  - Real-time wallet tracking per user.

---

## ⚙️ Non-Functional Requirements

| Feature         | Description |
|----------------|-------------|
| **Performance** | Handles 1,000+ concurrent users, API response < 2s |
| **Scalability** | Horizontally scalable backend |
| **Security**    | Encrypted data (in transit & at rest), OAuth 2.0 |
| **Reliability** | 99.9% uptime, robust error recovery |
| **Usability**   | Intuitive UI with localization support |
| **Maintainability** | Modular code with documentation and standards |
| **Compliance**  | GDPR + financial regulation adherence |
| **Monitoring**  | Logging + tools like Sentry, Grafana |
| **Cross-Platform** | Supports Android & iOS (React Native + Expo) |

---

## 🔌 Technologies Used

- **Frontend:** React Native + Expo
- **Backend:** Node.js / Express (or other)
- **APIs:** National Bank of Poland API
- **Database:** PostgreSQL / MongoDB / Firebase
- **Authentication:** OAuth 2.0 / JWT

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Parthparekh23/CurrencyExchange-.git
cd exchangeease

# Install dependencies
npm install

# Start the development server
npm start
