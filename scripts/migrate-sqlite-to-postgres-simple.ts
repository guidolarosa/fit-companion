/**
 * Simple Migration Script: SQLite to PostgreSQL
 * Uses direct SQLite queries to read data and Prisma to write to PostgreSQL
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
    // 1. Migrate Users
    console.log('📦 Migrating users...')
    const users = db.prepare('SELECT * FROM User').all() as any[]
    console.log(`   Found ${users.length} users`)
    
    for (const user of users) {
      try {
        // Check if user exists
        const existingUser = await postgresClient.user.findUnique({
          where: { id: user.id },
        })
        
        if (!existingUser) {
          await postgresClient.user.create({
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
              createdAt: new Date(user.createdAt),
              updatedAt: new Date(user.updatedAt),
            },
          })
          console.log(`   ✓ Created user: ${user.email}`)
        } else {
          console.log(`   ⚠️  User already exists: ${user.email}`)
        }
      } catch (error: any) {
        if (error.code === 'P2002') {
          // Unique constraint - user already exists, try to update
          try {
            await postgresClient.user.update({
              where: { id: user.id },
              data: {
                password: user.password,
                name: user.name,
                height: user.height,
                age: user.age,
                lifestyle: user.lifestyle,
                ifType: user.ifType,
                ifStartTime: user.ifStartTime,
              },
            })
            console.log(`   ✓ Updated user: ${user.email}`)
          } catch (updateError: any) {
            console.error(`   ❌ Error updating user ${user.id}:`, updateError.message)
          }
        } else {
          console.error(`   ❌ Error migrating user ${user.id}:`, error.message)
        }
      }
    }
    console.log('   ✅ Users migrated\n')

    // 2. Migrate Weight Entries
    console.log('📦 Migrating weight entries...')
    const weights = db.prepare('SELECT * FROM WeightEntry').all() as any[]
    console.log(`   Found ${weights.length} weight entries`)
    
    for (const weight of weights) {
      try {
        await postgresClient.weightEntry.upsert({
          where: { id: weight.id },
          update: {
            weight: weight.weight,
            date: new Date(weight.date),
          },
          create: {
            id: weight.id,
            userId: weight.userId,
            weight: weight.weight,
            date: new Date(weight.date),
            createdAt: new Date(weight.createdAt),
          },
        })
      } catch (error: any) {
        console.error(`   ❌ Error migrating weight entry ${weight.id}:`, error.message)
      }
    }
    console.log('   ✅ Weight entries migrated\n')

    // 3. Migrate Exercises
    console.log('📦 Migrating exercises...')
    const exercises = db.prepare('SELECT * FROM Exercise').all() as any[]
    console.log(`   Found ${exercises.length} exercises`)
    
    for (const exercise of exercises) {
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
            userId: exercise.userId,
            name: exercise.name,
            calories: exercise.calories,
            duration: exercise.duration,
            date: new Date(exercise.date),
            createdAt: new Date(exercise.createdAt),
          },
        })
      } catch (error: any) {
        console.error(`   ❌ Error migrating exercise ${exercise.id}:`, error.message)
      }
    }
    console.log('   ✅ Exercises migrated\n')

    // 4. Migrate Food Entries
    console.log('📦 Migrating food entries...')
    const foods = db.prepare('SELECT * FROM FoodEntry').all() as any[]
    console.log(`   Found ${foods.length} food entries`)
    
    for (const food of foods) {
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
            userId: food.userId,
            name: food.name,
            calories: food.calories,
            date: new Date(food.date),
            createdAt: new Date(food.createdAt),
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

