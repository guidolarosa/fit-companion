/**
 * Quick Migration Script: SQLite to PostgreSQL
 * 
 * This script migrates data from your SQLite database to PostgreSQL.
 * Run: npx tsx scripts/migrate-sqlite-to-postgres.ts
 */

import { PrismaClient } from '@prisma/client'
import * as path from 'path'
import * as fs from 'fs'

// Create a temporary Prisma client for SQLite
// We'll use a direct SQLite connection approach
const sqlitePath = path.join(process.cwd(), 'prisma', 'dev.db')

if (!fs.existsSync(sqlitePath)) {
  console.error('❌ SQLite database not found at:', sqlitePath)
  process.exit(1)
}

// For SQLite, we need to temporarily change the schema
// Let's use a simpler approach with direct database queries
const { PrismaClient: PrismaClientSQLite } = require('@prisma/client')

// PostgreSQL connection (destination)
const postgresClient = new PrismaClient()

// PostgreSQL connection (destination)
const postgresClient = new PostgresClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

async function migrateData() {
  console.log('🔄 Starting data migration from SQLite to PostgreSQL...\n')

  try {
    // 1. Migrate Users
    console.log('📦 Migrating users...')
    const users = await sqliteClient.user.findMany()
    console.log(`   Found ${users.length} users`)
    
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
      } catch (error: any) {
        console.error(`   ❌ Error migrating user ${user.id}:`, error.message)
      }
    }
    console.log('   ✅ Users migrated\n')

    // 2. Migrate Weight Entries
    console.log('📦 Migrating weight entries...')
    const weights = await sqliteClient.weightEntry.findMany()
    console.log(`   Found ${weights.length} weight entries`)
    
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
      } catch (error: any) {
        console.error(`   ❌ Error migrating weight entry ${weight.id}:`, error.message)
      }
    }
    console.log('   ✅ Weight entries migrated\n')

    // 3. Migrate Exercises
    console.log('📦 Migrating exercises...')
    const exercises = await sqliteClient.exercise.findMany()
    console.log(`   Found ${exercises.length} exercises`)
    
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
      } catch (error: any) {
        console.error(`   ❌ Error migrating exercise ${exercise.id}:`, error.message)
      }
    }
    console.log('   ✅ Exercises migrated\n')

    // 4. Migrate Food Entries
    console.log('📦 Migrating food entries...')
    const foods = await sqliteClient.foodEntry.findMany()
    console.log(`   Found ${foods.length} food entries`)
    
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
      } catch (error: any) {
        console.error(`   ❌ Error migrating food entry ${food.id}:`, error.message)
      }
    }
    console.log('   ✅ Food entries migrated\n')

    console.log('🎉 Migration complete!')
    
    // Show summary
    const postgresUsers = await postgresClient.user.count()
    const postgresWeights = await postgresClient.weightEntry.count()
    const postgresExercises = await postgresClient.exercise.count()
    const postgresFoods = await postgresClient.foodEntry.count()
    
    console.log('\n📊 PostgreSQL Database Summary:')
    console.log(`   Users: ${postgresUsers}`)
    console.log(`   Weight Entries: ${postgresWeights}`)
    console.log(`   Exercises: ${postgresExercises}`)
    console.log(`   Food Entries: ${postgresFoods}`)
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await sqliteClient.$disconnect()
    await postgresClient.$disconnect()
  }
}

// Run migration
migrateData()
  .then(() => {
    console.log('\n✅ Migration script finished successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Migration script failed:', error)
    process.exit(1)
  })

