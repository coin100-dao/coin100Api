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

## Authentication

All API endpoints require an API key to be included in the request headers:

```
x-api-key: your-api-key-here
```

If no API key is provided or an invalid key is used, the API will return a 401 Unauthorized response.

## Base URL
The base URL for all endpoints is:
```
http://localhost:5555  # For local development
https://api.coin100.link  # For production
```

## Database Configuration
The API supports both local and remote database connections. Set the `PSQL_HOST` environment variable to either `local` or `remote` to switch between configurations.

## Endpoints
## Health Check

```
GET /
```

Check if the API is running.

#### Response
```json
{
    "success": true,
    "message": "Coin100 API is running!",
    "version": "1.0.0"
}
```


### Get All Coins Data

```
GET /api/coins
```

Retrieves data for all coins. By default, returns data from the last 5 minutes.

#### Query Parameters

- `start` (optional): Start date in ISO format (e.g., "2023-12-09T00:00:00Z")
- `end` (optional): End date in ISO format (e.g., "2023-12-09T23:59:59Z")

#### Response

```json
{
  "success": true,
  "dateRange": {
    "start": "2023-12-09T00:00:00.000Z",
    "end": "2023-12-09T23:59:59.999Z"
  },
  "data": [
    {
      "symbol": "btc",
      "name": "Bitcoin",
      "current_price": 42000,
      "market_cap": 820000000000,
      "market_cap_rank": 1,
      // ... other coin properties
    }
    // ... other coins
  ]
}
```

### Get Specific Coin Data

```
GET /api/coins/symbol/:symbol
```

Retrieves data for a specific coin by its symbol (e.g., "btc" for Bitcoin).

#### URL Parameters

- `symbol`: The coin symbol (e.g., "btc", "eth")

#### Query Parameters

- `start` (optional): Start date in ISO format
- `end` (optional): End date in ISO format

#### Response

```json
{
  "success": true,
  "dateRange": {
    "start": "2023-12-09T00:00:00.000Z",
    "end": "2023-12-09T23:59:59.999Z"
  },
  "data": [
    {
      "symbol": "btc",
      "name": "Bitcoin",
      "current_price": 42000,
      // ... other coin properties
    }
  ]
}
```

If no data is found within the specified date range, the API will return the most recent data available for that coin.

#### Error Response

If the coin symbol doesn't exist:

```json
{
  "success": false,
  "error": "No data found for the specified coin"
}
```

### Get Total Market Data

```
GET /api/coins/market/total
```

Retrieves total market capitalization data.

#### Query Parameters

- `start` (optional): Start date in ISO format
- `end` (optional): End date in ISO format

#### Response

```json
{
  "success": true,
  "dateRange": {
    "start": "2023-12-09T00:00:00.000Z",
    "end": "2023-12-09T23:59:59.999Z"
  },
  "data": [
    {
      "total_market_cap": 1650000000000,
      "timestamp": "2023-12-09T12:00:00.000Z"
    }
    // ... other time points
  ]
}
```

### COIN100 Contract Endpoints

#### Execute Rebase Operation
```http
POST /api/coin100/rebase
```

Executes a rebase operation on the COIN100 contract. Requires admin wallet authorization via MetaMask.

##### Request Body
```json
{
  "newMarketCap": "1000000000",  // New market cap value in wei
  "walletAddress": "0x..."       // MetaMask wallet address with admin rights
}
```

##### Response
```json
{
  "success": true,
  "data": {
    "to": "0x1459884924e7e973d1579ee4ebcaa4ef0b1c8f21",
    "from": "0x...",
    "data": "0x...",
    "gasLimit": "0x493e0",
    "chainId": 137
  }
}
```

##### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error description"
}
```

#### Get Contract Metrics
```http
GET /api/coin100/metrics
```

Retrieves current metrics from the COIN100 contract including total supply and last market cap.

##### Response
```json
{
  "success": true,
  "data": {
    "totalSupply": "1000000000",
    "lastMarketCap": "1000000000",
    "gonsPerFragment": "1000000000000000000",
    "network": "Polygon Mainnet",
    "contractAddress": "0x1459884924e7e973d1579ee4ebcaa4ef0b1c8f21"
  }
}
```

##### Error Response
```json
{
  "success": false,
  "message": "Error fetching contract metrics",
  "error": "Detailed error description"
}
```

## Error Responses

### Authentication Error (401)

```json
{
  "message": "API key is required"
}
```

### Invalid Date Format (400)

```json
{
  "success": false,
  "error": "Invalid date format"
}
```

### Resource Not Found (404)

```json
{
  "success": false,
  "error": "No data found for the specified coin"
}
```
