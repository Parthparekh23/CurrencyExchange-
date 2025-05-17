# 🌍 ExchangeEase

**ExchangeEase** is a mobile and web-based application designed to facilitate seamless and secure currency exchange operations. The system integrates real-time exchange rate data from the National Bank of Poland and provides users with a comprehensive suite of features to manage their funds and perform transactions effortlessly.

---

## 👥 Project Contributors

- **Parth Parekh** – 39106  
- **Rashi Sonavani** – 58830

---

## 📱 Functional Requirements

### Mobile Application

1. **Account Management**
   - Create an account with required user details.
   - Update user profile.

2. **Account Funding**
   - Virtual transfer functionality to fund user accounts.
   - Updated balance display after a successful transaction.

3. **Fund Withdrawal**
   - Withdraw funds from the ExchangeEase wallet.

4. **Exchange Rate Information**
   - Real-time exchange rate display.
   - Search and filter options for specific currencies.

5. **Archived Exchange Rates**
   - View historical exchange rate data.
   - Sort/filter archived data by date and currency.

6. **Currency Transactions**
   - Buy/sell currency within the app.
   - Real-time balance and holdings updates after each transaction.

7. **Transaction History**
   - Access complete transaction history per user.

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
- **Database:** MongoDB
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
