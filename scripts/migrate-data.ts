/**
 * Data Migration Script
 * 
 * This script migrates data from SQLite to PostgreSQL.
 * 
 * Usage:
 * 1. Set DATABASE_URL_SQLITE to your SQLite database path
 * 2. Set DATABASE_URL to your PostgreSQL connection string
 * 3. Run: npx tsx scripts/migrate-data.ts
 * 
 * WARNING: This will overwrite existing data in PostgreSQL!
 */

import { PrismaClient } from '@prisma/client'

// SQLite connection (source)
const sqliteClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_SQLITE || 'file:./prisma/dev.db',
    },
  },
})

// PostgreSQL connection (destination)
const postgresClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

async function migrateData() {
  console.log('Starting data migration...')

  try {
    // 1. Migrate Users
    console.log('Migrating users...')
    const users = await sqliteClient.user.findMany()
    console.log(`Found ${users.length} users`)
    
    for (const user of users) {
      try {
        await postgresClient.user.upsert({
          where: { id: user.id },
          update: {
            email: user.email,
            password: user.password,
            name: user.name,
            height: user.height,
            age: user.age,
            lifestyle: user.lifestyle,
            ifType: user.ifType,
            ifStartTime: user.ifStartTime,
          },
          create: {
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
          },
        })
      } catch (error) {
        console.error(`Error migrating user ${user.id}:`, error)
      }
    }
    console.log('✓ Users migrated')

    // 2. Migrate Weight Entries
    console.log('Migrating weight entries...')
    const weights = await sqliteClient.weightEntry.findMany()
    console.log(`Found ${weights.length} weight entries`)
    
    for (const weight of weights) {
      try {
        await postgresClient.weightEntry.upsert({
          where: { id: weight.id },
          update: {
            weight: weight.weight,
            date: weight.date,
          },
          create: {
            id: weight.id,
            userId: weight.userId,
            weight: weight.weight,
            date: weight.date,
            createdAt: weight.createdAt,
          },
        })
      } catch (error) {
        console.error(`Error migrating weight entry ${weight.id}:`, error)
      }
    }
    console.log('✓ Weight entries migrated')

    // 3. Migrate Exercises
    console.log('Migrating exercises...')
    const exercises = await sqliteClient.exercise.findMany()
    console.log(`Found ${exercises.length} exercises`)
    
    for (const exercise of exercises) {
      try {
        await postgresClient.exercise.upsert({
          where: { id: exercise.id },
          update: {
            name: exercise.name,
            calories: exercise.calories,
            duration: exercise.duration,
            date: exercise.date,
          },
          create: {
            id: exercise.id,
            userId: exercise.userId,
            name: exercise.name,
            calories: exercise.calories,
            duration: exercise.duration,
            date: exercise.date,
            createdAt: exercise.createdAt,
          },
        })
      } catch (error) {
        console.error(`Error migrating exercise ${exercise.id}:`, error)
      }
    }
    console.log('✓ Exercises migrated')

    // 4. Migrate Food Entries
    console.log('Migrating food entries...')
    const foods = await sqliteClient.foodEntry.findMany()
    console.log(`Found ${foods.length} food entries`)
    
    for (const food of foods) {
      try {
        await postgresClient.foodEntry.upsert({
          where: { id: food.id },
          update: {
            name: food.name,
            calories: food.calories,
            date: food.date,
          },
          create: {
            id: food.id,
            userId: food.userId,
            name: food.name,
            calories: food.calories,
            date: food.date,
            createdAt: food.createdAt,
          },
        })
      } catch (error) {
        console.error(`Error migrating food entry ${food.id}:`, error)
      }
    }
    console.log('✓ Food entries migrated')

    console.log('\n✅ Migration complete!')
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  } finally {
    await sqliteClient.$disconnect()
    await postgresClient.$disconnect()
  }
}

// Run migration
if (require.main === module) {
  migrateData()
    .then(() => {
      console.log('Migration script finished successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Migration script failed:', error)
      process.exit(1)
    })
}

export { migrateData }


