
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
Retrieve data for all coins within a specified time period.

```
GET /api/coins
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
            "id": "bitcoin",
            "symbol": "btc",
            "name": "Bitcoin",
            "market_cap_rank": 1,
            "current_price": 43521.12,
            "market_cap": 851234567890,
            "total_volume": 28901234567,
            "high_24h": 44123.45,
            "low_24h": 42987.65,
            "price_change_24h": 534.21,
            "price_change_percentage_24h": 1.23,
            "last_updated": "2024-01-10T12:34:56.789Z"
        },
        // ... more coins
    ]
}
```

#### 3. Get Specific Coin Data
Retrieve data for a specific coin by its symbol.

```
GET /api/coins/:symbol
```

#### Parameters
- `symbol` (required): Coin symbol (e.g., "BTC", "ETH")

#### Query Parameters
- `period` (optional): Time period for data retrieval
  - Format: `[number][m/h/d/w/y]`
  - Examples: `5m`, `1h`, `1d`
  - Default: `5m`

#### Response
```json
{
    "success": true,
    "data": {
        "id": "bitcoin",
        "symbol": "btc",
        "name": "Bitcoin",
        "market_cap_rank": 1,
        "current_price": 43521.12,
        "market_cap": 851234567890,
        "total_volume": 28901234567,
        "high_24h": 44123.45,
        "low_24h": 42987.65,
        "price_change_24h": 534.21,
        "price_change_percentage_24h": 1.23,
        "last_updated": "2024-01-10T12:34:56.789Z"
    }
}
```

#### 4. Get Total Market Cap
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
