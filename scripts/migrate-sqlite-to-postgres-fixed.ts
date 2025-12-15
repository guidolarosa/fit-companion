/**
 * Fixed Migration Script: SQLite to PostgreSQL
 * Handles user ID mapping and foreign key constraints
 */

import { PrismaClient } from '@prisma/client'
import Database from 'better-sqlite3'
import * as path from 'path'

const sqlitePath = path.join(process.cwd(), 'prisma', 'dev.db')
const db = new Database(sqlitePath)
const postgresClient = new PrismaClient()

async function migrateData() {
  console.log('🔄 Starting data migration from SQLite to PostgreSQL...\n')

  try {
    // Step 1: Get or create user mapping
    console.log('📦 Setting up user mapping...')
    const sqliteUsers = db.prepare('SELECT * FROM User').all() as any[]
    const postgresUsers = await postgresClient.user.findMany()
    
    // Create a mapping: SQLite user ID -> PostgreSQL user ID
    const userIdMap = new Map<string, string>()
    
    for (const sqliteUser of sqliteUsers) {
      // Try to find PostgreSQL user by email (since emails should match)
      const postgresUser = postgresUsers.find(u => u.email === sqliteUser.email)
      
      if (postgresUser) {
        userIdMap.set(sqliteUser.id, postgresUser.id)
        console.log(`   ✓ Mapped user ${sqliteUser.email}: ${sqliteUser.id} -> ${postgresUser.id}`)
      } else {
        // User doesn't exist in PostgreSQL, create it with original ID
        try {
          const newUser = await postgresClient.user.create({
            data: {
              id: sqliteUser.id,
              email: sqliteUser.email,
              password: sqliteUser.password,
              name: sqliteUser.name,
              height: sqliteUser.height,
              age: sqliteUser.age,
              lifestyle: sqliteUser.lifestyle,
              ifType: sqliteUser.ifType,
              ifStartTime: sqliteUser.ifStartTime,
              createdAt: new Date(sqliteUser.createdAt),
              updatedAt: new Date(sqliteUser.updatedAt),
            },
          })
          userIdMap.set(sqliteUser.id, newUser.id)
          console.log(`   ✓ Created user ${sqliteUser.email} with original ID`)
        } catch (error: any) {
          console.error(`   ❌ Error creating user ${sqliteUser.email}:`, error.message)
        }
      }
    }
    console.log('   ✅ User mapping complete\n')

    // Step 2: Migrate Weight Entries
    console.log('📦 Migrating weight entries...')
    const weights = db.prepare('SELECT * FROM WeightEntry').all() as any[]
    console.log(`   Found ${weights.length} weight entries`)
    
    let weightSuccess = 0
    for (const weight of weights) {
      const mappedUserId = userIdMap.get(weight.userId)
      if (!mappedUserId) {
        console.error(`   ⚠️  Skipping weight entry ${weight.id}: user ${weight.userId} not found`)
        continue
      }
      
      try {
        await postgresClient.weightEntry.upsert({
          where: { id: weight.id },
          update: {
            weight: weight.weight,
            date: new Date(weight.date),
          },
          create: {
            id: weight.id,
            userId: mappedUserId,
            weight: weight.weight,
            date: new Date(weight.date),
            createdAt: new Date(weight.createdAt),
          },
        })
        weightSuccess++
      } catch (error: any) {
        console.error(`   ❌ Error migrating weight entry ${weight.id}:`, error.message)
      }
    }
    console.log(`   ✅ Migrated ${weightSuccess}/${weights.length} weight entries\n`)

    // Step 3: Migrate Exercises
    console.log('📦 Migrating exercises...')
    const exercises = db.prepare('SELECT * FROM Exercise').all() as any[]
    console.log(`   Found ${exercises.length} exercises`)
    
    let exerciseSuccess = 0
    for (const exercise of exercises) {
      const mappedUserId = userIdMap.get(exercise.userId)
      if (!mappedUserId) {
        console.error(`   ⚠️  Skipping exercise ${exercise.id}: user ${exercise.userId} not found`)
        continue
      }
      
      try {
        await postgresClient.exercise.upsert({
          where: { id: exercise.id },
          update: {
            name: exercise.name,
            calories: exercise.calories,
            duration: exercise.duration,
            date: new Date(exercise.date),
          },
          create: {
            id: exercise.id,
            userId: mappedUserId,
            name: exercise.name,
            calories: exercise.calories,
            duration: exercise.duration,
            date: new Date(exercise.date),
            createdAt: new Date(exercise.createdAt),
          },
        })
        exerciseSuccess++
      } catch (error: any) {
        console.error(`   ❌ Error migrating exercise ${exercise.id}:`, error.message)
      }
    }
    console.log(`   ✅ Migrated ${exerciseSuccess}/${exercises.length} exercises\n`)

    // Step 4: Migrate Food Entries
    console.log('📦 Migrating food entries...')
    const foods = db.prepare('SELECT * FROM FoodEntry').all() as any[]
    console.log(`   Found ${foods.length} food entries`)
    
    let foodSuccess = 0
    for (const food of foods) {
      const mappedUserId = userIdMap.get(food.userId)
      if (!mappedUserId) {
        console.error(`   ⚠️  Skipping food entry ${food.id}: user ${food.userId} not found`)
        continue
      }
      
      try {
        await postgresClient.foodEntry.upsert({
          where: { id: food.id },
          update: {
            name: food.name,
            calories: food.calories,
            date: new Date(food.date),
          },
          create: {
            id: food.id,
            userId: mappedUserId,
            name: food.name,
            calories: food.calories,
            date: new Date(food.date),
            createdAt: new Date(food.createdAt),
          },
        })
        foodSuccess++
      } catch (error: any) {
        console.error(`   ❌ Error migrating food entry ${food.id}:`, error.message)
      }
    }
    console.log(`   ✅ Migrated ${foodSuccess}/${foods.length} food entries\n`)

    console.log('🎉 Migration complete!')
    
    // Show summary
    const postgresUsersCount = await postgresClient.user.count()
    const postgresWeights = await postgresClient.weightEntry.count()
    const postgresExercises = await postgresClient.exercise.count()
    const postgresFoods = await postgresClient.foodEntry.count()
    
    console.log('\n📊 PostgreSQL Database Summary:')
    console.log(`   Users: ${postgresUsersCount}`)
    console.log(`   Weight Entries: ${postgresWeights}`)
    console.log(`   Exercises: ${postgresExercises}`)
    console.log(`   Food Entries: ${postgresFoods}`)
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    db.close()
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


