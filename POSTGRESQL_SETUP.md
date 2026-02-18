# PostgreSQL Setup Guide for Inventory Control System

## Overview
This Inventory Control System has been converted to use direct PostgreSQL connections instead of Supabase. Follow these steps to set up your database.

## Prerequisites
- PostgreSQL 12+ installed
- Node.js 16+
- The database schema SQL file: `/scripts/001_create_ics_schema.sql`

## Step 1: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE inventory_control_system;

# Exit
\q
```

## Step 2: Load Schema

```bash
# Load the schema into your database
psql -U postgres -d inventory_control_system -f scripts/001_create_ics_schema.sql
```

## Step 3: Environment Variables

Add the following to your `.env.local` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/inventory_control_system"
```

Replace:
- `username` - Your PostgreSQL username (default: `postgres`)
- `password` - Your PostgreSQL password
- `localhost` - Your database host
- `5432` - Your PostgreSQL port

## Step 4: Add pg Package

The project needs the `pg` package for PostgreSQL connections:

```bash
npm install pg
npm install --save-dev @types/pg
```

Or if using yarn:
```bash
yarn add pg
yarn add -D @types/pg
```

## Step 5: Seed Data (Optional)

To add demo data, run the seed script:

```bash
psql -U postgres -d inventory_control_system -f scripts/002_seed_demo_data.sql
```

## Step 6: Start the App

```bash
npm run dev
```

Visit http://localhost:3000 - you'll be automatically redirected to the dashboard (admin access by default).

## Database Connection

The app uses a connection pool in `/lib/db.ts` to manage PostgreSQL connections. All API routes and server actions use this utility.

### Example Usage in Server Actions:

```typescript
import { query } from '@/lib/db'

export async function getProducts() {
  const result = await query('SELECT * FROM products')
  return result.rows
}
```

## Troubleshooting

### Connection Error: "Cannot find module 'pg'"
Install the pg package: `npm install pg @types/pg`

### Connection Error: "role "postgres" does not exist"
Use your actual PostgreSQL username instead of "postgres"

### Connection Error: "database does not exist"
Run Step 1 to create the database first

### Port Already in Use
PostgreSQL default is 5432. If in use, modify DATABASE_URL with the correct port

## Next Steps

1. Update the API routes and server actions to use `query()` from `/lib/db.ts`
2. Add authentication with PostgreSQL user table
3. Implement role-based access control
4. Add data validation and error handling
