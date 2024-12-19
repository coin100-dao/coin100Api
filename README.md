# Coin100 API

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Routes](#api-routes)
- [Testing](#testing)
- [Scheduled Tasks](#scheduled-tasks)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting, ensure you have the following installed:
- Node.js (v18.18.0 or higher)
- npm (comes with Node.js)
- PostgreSQL (latest stable version)
- Git

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd coin100Api
```

2. Install dependencies:
```bash
npm install
```

## Environment Setup

1. Create a `.env` file in the root directory with the following configuration:
```env
# Environment
NODE_ENV=development

# Server Configuration
PORT=5555

# PostgreSQL Configuration
PSQL_HOST=local
DB_HOST_LOCAL=localhost
DB_HOST_REMOTE=your_remote_db_host
DB_PORT=5432
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=coin100_db

# External APIs
COIN_GECKO_API_KEY=your_coingecko_api_key

# SSL Configuration
DB_SSL=false
DB_LOGGING=true
```

## Database Setup

1. Create the development database:
```bash
createdb coin100_db
```

2. Create the test database:
```bash
createdb coin100_db_test
```

3. Run database migrations:
```bash
npm run migrate
```

Additional database commands:
```bash
# Undo last migration
npm run migrate:undo

# Create a new migration
npm run migrate:create --name your_migration_name

# Sync database (alternative to migrations)
npm run sync
```

## Running the Application

1. Development mode (with hot reload):
```bash
npm run dev
```

2. Production mode:
```bash
npm start
```

## API Routes

### Base URL
```
http://localhost:5555/api
```

### Available Endpoints

1. Health Check
- **URL**: `/`
- **Method**: `GET`
- **Response**:
```json
{
  "success": true,
  "message": "Coin100 API is running!",
  "version": "1.0.0"
}
```

2. Coin Routes
- Base path: `/api/coins`
- Protected by API key authentication

3. Coin100 Routes
- Base path: `/api/coin100`
- Protected by API key authentication

## Testing

1. Run all tests:
```bash
npm test
```

2. Run tests in watch mode:
```bash
npm run test:watch
```

3. Run specific test file:
```bash
npm test -- path/to/test/file.test.js
```

## Scheduled Tasks

The application includes automated tasks managed by node-cron. These run automatically when the server starts (except in test environment).

1. View scheduled tasks in:
```
src/utils/scheduler.js
```

2. Tasks are initialized automatically when running:
```bash
npm start
# or
npm run dev
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check allowed origins in `index.js`
   - Verify your client's origin is included in the CORS configuration

2. **Database Connection Issues**
   - Verify PostgreSQL is running: `pg_isready`
   - Check database credentials in `.env`
   - Ensure database exists: `psql -l`

3. **Port Conflicts**
   - Change PORT in `.env`
   - Check for processes using port: `lsof -i :5555`

### Logging

- Logs are managed by Winston
- Check console output for development
- Production logs are stored based on configuration in `src/utils/logger.js`

## License

MIT License
