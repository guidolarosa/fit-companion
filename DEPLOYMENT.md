# Production Deployment Guide

This guide will help you deploy Fit Companion to production while retaining your database data.

## Prerequisites

- A production database (PostgreSQL recommended)
- A deployment platform account (Vercel, Railway, or similar)
- Your OpenAI API key
- A secure NEXTAUTH_SECRET

## Step 1: Choose a Production Database

SQLite is not suitable for production. You need a PostgreSQL database. Recommended options:

### Option A: Railway (Easiest)
- Visit [railway.app](https://railway.app)
- Create a new project
- Add a PostgreSQL database
- Copy the connection string

### Option B: Supabase (Free tier available)
- Visit [supabase.com](https://supabase.com)
- Create a new project
- Go to Settings > Database
- Copy the connection string

### Option C: Neon (Serverless PostgreSQL)
- Visit [neon.tech](https://neon.tech)
- Create a new project
- Copy the connection string

## Step 2: Update Prisma Schema

Update `prisma/schema.prisma` to use PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Step 3: Export Your Current Data

Before migrating, export your SQLite data:

```bash
# Create a backup of your SQLite database
cp prisma/dev.db prisma/dev.db.backup

# Export data to SQL (optional, for manual inspection)
sqlite3 prisma/dev.db .dump > backup.sql
```

## Step 4: Set Up Production Database

1. **Create the database schema:**
   ```bash
   # Update your .env with the production DATABASE_URL
   DATABASE_URL="your-postgresql-connection-string"
   
   # Push the schema to production database
   npx prisma db push
   
   # Generate Prisma client
   npx prisma generate
   ```

2. **Migrate your data (if you have existing data):**

   You'll need to write a migration script. Create `scripts/migrate-data.ts`:

   ```typescript
   import { PrismaClient as SQLiteClient } from '@prisma/client'
   import { PrismaClient as PostgresClient } from '@prisma/client'
   
   // This is a template - you'll need to adapt it based on your data
   // Run this script to migrate data from SQLite to PostgreSQL
   ```

   Or use a tool like [pgloader](https://pgloader.readthedocs.io/) to migrate directly.

## Step 5: Environment Variables

Set these environment variables in your production environment:

```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# NextAuth
NEXTAUTH_SECRET="generate-a-secure-random-string"
NEXTAUTH_URL="https://your-domain.com"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

## Step 6: Deploy to Vercel (Recommended)

### 6.1 Prepare for Deployment

1. **Update `package.json` scripts:**
   ```json
   {
     "scripts": {
       "postinstall": "prisma generate"
     }
   }
   ```

2. **Create `vercel.json` (optional):**
   ```json
   {
     "buildCommand": "prisma generate && next build"
   }
   ```

### 6.2 Deploy Steps

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set environment variables in Vercel dashboard:**
   - Go to your project settings
   - Add all environment variables from Step 5

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

## Step 7: Deploy to Railway (Alternative)

Railway is great because it can host both your app and database:

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Initialize project:**
   ```bash
   railway init
   ```

3. **Add PostgreSQL database:**
   ```bash
   railway add postgresql
   ```

4. **Set environment variables:**
   ```bash
   railway variables set NEXTAUTH_SECRET="your-secret"
   railway variables set NEXTAUTH_URL="https://your-app.railway.app"
   railway variables set OPENAI_API_KEY="your-key"
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

## Step 8: Data Migration Script

If you need to migrate existing SQLite data, create this script:

```typescript
// scripts/migrate-to-postgres.ts
import { PrismaClient } from '@prisma/client'

const sqlite = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db'
    }
  }
})

const postgres = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function migrate() {
  // Migrate users
  const users = await sqlite.user.findMany()
  for (const user of users) {
    await postgres.user.create({
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        height: user.height,
        age: user.age,
        lifestyle: user.lifestyle,
        ifType: user.ifType,
        ifStartTime: user.ifStartTime,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    })
  }

  // Migrate weight entries
  const weights = await sqlite.weightEntry.findMany()
  for (const weight of weights) {
    await postgres.weightEntry.create({
      data: {
        id: weight.id,
        userId: weight.userId,
        weight: weight.weight,
        date: weight.date,
        createdAt: weight.createdAt,
      }
    })
  }

  // Migrate exercises
  const exercises = await sqlite.exercise.findMany()
  for (const exercise of exercises) {
    await postgres.exercise.create({
      data: {
        id: exercise.id,
        userId: exercise.userId,
        name: exercise.name,
        calories: exercise.calories,
        duration: exercise.duration,
        date: exercise.date,
        createdAt: exercise.createdAt,
      }
    })
  }

  // Migrate food entries
  const foods = await sqlite.foodEntry.findMany()
  for (const food of foods) {
    await postgres.foodEntry.create({
      data: {
        id: food.id,
        userId: food.userId,
        name: food.name,
        calories: food.calories,
        date: food.date,
        createdAt: food.createdAt,
      }
    })
  }

  console.log('Migration complete!')
  await sqlite.$disconnect()
  await postgres.$disconnect()
}

migrate().catch(console.error)
```

## Step 9: Post-Deployment Checklist

- [ ] Database schema is deployed
- [ ] All environment variables are set
- [ ] NEXTAUTH_SECRET is secure and random
- [ ] NEXTAUTH_URL matches your production domain
- [ ] Database connection is working
- [ ] Authentication is working
- [ ] All API routes are functional
- [ ] Data has been migrated (if applicable)

## Step 10: Backup Strategy

Set up regular backups for your production database:

### For Supabase:
- Automatic daily backups (included)

### For Railway:
- Use Railway's backup feature or set up pg_dump cron job

### For Neon:
- Automatic backups (included)

### Manual Backup:
```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
```

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check if database allows connections from your deployment IP
- Ensure SSL is configured if required

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain exactly
- Clear browser cookies and try again

### Build Errors
- Ensure `prisma generate` runs before build
- Check all environment variables are set
- Verify Prisma schema matches database

## Recommended Production Settings

1. **Enable Prisma Query Logging (optional, for debugging):**
   ```typescript
   const prisma = new PrismaClient({
     log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
   })
   ```

2. **Set up error monitoring:**
   - Consider adding Sentry or similar service

3. **Enable HTTPS:**
   - Most platforms (Vercel, Railway) provide this automatically

4. **Set up custom domain:**
   - Configure in your deployment platform's settings

## Cost Estimates

- **Vercel**: Free tier available (Hobby plan)
- **Railway**: ~$5/month for small apps
- **Supabase**: Free tier available
- **Neon**: Free tier available
- **OpenAI API**: Pay per use

## Support

If you encounter issues:
1. Check deployment platform logs
2. Verify all environment variables
3. Test database connection locally with production URL
4. Review Prisma migration status

