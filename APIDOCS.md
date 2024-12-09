## Coin100 API Documentation

## Installation and Deployment

### Local Development
1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file with the required environment variables
4. Start the development server:
```bash
npm start
```

### Production Deployment with PM2
PM2 is used for process management in production. Here are the common commands:

#### Starting/Restarting the Service
```bash
# Restart if exists, otherwise start new instance
pm2 restart coin100-api || pm2 start /home/ec2-user/coin100Api/index.js --name "coin100-api"
```

#### Monitoring
```bash
# View logs in real-time
pm2 logs coin100-api

# View last 1000 lines of logs
pm2 logs coin100-api --lines 1000

# View dashboard
pm2 monit
```

#### Other Useful PM2 Commands
```bash
# List all processes
pm2 list

# Stop the service
pm2 stop coin100-api

# Delete the service
pm2 delete coin100-api

# View process details
pm2 show coin100-api
```

### Authentication
All API endpoints (except the health check endpoint) require an API key to be included in the request headers:

```
x-api-key: your-api-key-here
```

### Base URL
The base URL for all endpoints is:
```
http://localhost:5555  # For local development
https://api.coin100.link  # For production
```

### Database Configuration
The API supports both local and remote database connections. Set the `PSQL_HOST` environment variable to either `local` or `remote` to switch between configurations.

### Endpoints

#### 1. Health Check
Check if the API is running.

```
GET /
```

#### Response
```json
{
    "success": true,
    "message": "Coin100 API is running!",
    "version": "1.0.0"
}
```

#### 2. Get All Coins Data
Retrieve data for all coins within a specified date range.

```
GET /api/coins
```

#### Query Parameters
- `start` (optional): Start date in ISO 8601 format (e.g., "2024-01-01T00:00:00Z")
  - If not provided, defaults to 5 minutes ago
- `end` (optional): End date in ISO 8601 format
  - If not provided, defaults to current time

#### Response
```json
{
  "success": true,
  "dateRange": {
    "start": "2024-01-01T00:00:00.000Z",
    "end": "2024-01-08T00:00:00.000Z"
  },
  "count": 100,
  "data": [
    {
      "id": "bitcoin",
      "symbol": "btc",
      "name": "Bitcoin",
      "market_cap_rank": 1,
      "current_price": 50000,
      "market_cap": 1000000000000,
      "last_updated": "2024-01-08T00:00:00.000Z"
    }
    // ... more coins
  ]
}
```

#### 3. Get Specific Coin Data
Retrieve data for a specific coin within a specified date range.

```
GET /api/coins/:symbol
```

#### Parameters
- `symbol` (required): Coin symbol (e.g., "BTC", "ETH")

#### Query Parameters
- `start` (optional): Start date in ISO 8601 format (e.g., "2024-01-01T00:00:00Z")
  - If not provided, defaults to 5 minutes ago
- `end` (optional): End date in ISO 8601 format
  - If not provided, defaults to current time

#### Response
```json
{
  "success": true,
  "dateRange": {
    "start": "2024-01-01T00:00:00.000Z",
    "end": "2024-01-08T00:00:00.000Z"
  },
  "count": 168,
  "data": [
    {
      "id": "bitcoin",
      "symbol": "btc",
      "name": "Bitcoin",
      "market_cap_rank": 1,
      "current_price": 50000,
      "market_cap": 1000000000000,
      "last_updated": "2024-01-08T00:00:00.000Z"
    }
    // ... more historical data points
  ]
}
```

#### Error Responses

```json
// Invalid date format
{
  "success": false,
  "error": "Invalid date format. Use ISO 8601 format (e.g., 2024-01-01T00:00:00Z)"
}

// Missing symbol
{
  "success": false,
  "error": "Symbol is required"
}

// No data found
{
  "success": false,
  "error": "No data found for symbol: XYZ"
}
```

#### 4. Get Total Market Cap
Retrieve the total market capitalization of the top 100 cryptocurrencies over the specified time period.

```
GET /api/coins/market/total
```

#### Query Parameters
- `start` (optional): Start date in ISO 8601 format (e.g., "2024-01-01T00:00:00Z")
  - If not provided, defaults to 5 minutes ago
- `end` (optional): End date in ISO 8601 format
  - If not provided, defaults to current time

#### Response
```json
{
  "success": true,
  "dateRange": {
    "start": "2024-01-01T00:00:00.000Z",
    "end": "2024-01-08T00:00:00.000Z"
  },
  "data": [
    {
      "timestamp": "2024-01-01T00:00:00.000Z",
      "total_market_cap": "2000000000000"
    },
    {
      "timestamp": "2024-01-01T01:00:00.000Z",
      "total_market_cap": "2001000000000"
    }
    // ... more data points
  ]
}
```

#### Error Responses

```json
// Invalid date format
{
  "success": false,
  "error": "Invalid date format. Use ISO 8601 format (e.g., 2024-01-01T00:00:00Z)"
}
```

#### 5. Get Total Market Cap
Retrieve the total market capitalization of the top 100 cryptocurrencies over the specified time period.

```
GET /api/coins/market/total
```

#### Query Parameters
- `period` (optional): Time period for data retrieval
  - Format: `[number][m/h/d/w/y]`
  - Examples: `5m`, `1h`, `1d`
  - Default: `5m`

#### Response
```json
{
    "success": true,
    "data": [
        {
            "timestamp": "2024-12-06T18:35:00.000Z",
            "total_market_cap": "2000000000000"
        },
        {
            "timestamp": "2024-12-06T18:30:00.000Z",
            "total_market_cap": "1950000000000"
        }
    ]
}
```

#### Error Response
```json
{
    "success": false,
    "error": "Invalid period format. Use: 5m, 15m, 1h, 4h, 1d, 7d"
}
```
