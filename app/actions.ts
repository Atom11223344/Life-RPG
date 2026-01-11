// src/app/actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// ---------------------------------------------------------
// 1. Character System & Mechanics
// ---------------------------------------------------------
export async function saveRoutine(loopLength: number, scheduleData: Record<number, string[]>) {
  const char = await getCharacter()
  if (!char) return

  // 1. ล้างตารางเก่าทิ้งก่อน
  await prisma.routine.deleteMany({ where: { characterId: char.id } })

  // 2. บันทึกตารางใหม่
  const promises = []
  for (let day = 1; day <= loopLength; day++) {
      const questIds = scheduleData[day] || []
      for (const qId of questIds) {
          promises.push(prisma.routine.create({
              data: { characterId: char.id, dayIndex: day, questId: qId }
          }))
      }
  }
  await Promise.all(promises)

  // 3. อัปเดตตัวละครให้ใช้แผนนี้ และเริ่มนับ 1 ใหม่ตั้งแต่วันนี้
  await prisma.character.update({
      where: { id: char.id },
      data: { plan: 'CUSTOM_ROUTINE', planStartDate: new Date() } // Reset Start Date
  })

  revalidatePath('/')
  revalidatePath('/diary')
}
export async function getCharacter() {
  const session = await auth()
  if (!session?.user?.email) return null

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { characters: true }
  })

  let char = user?.characters[0]
  if (!char) return null

  // --- Mechanic: Rust / Stat Decay (สนิมเกาะ) ---
  const now = new Date()
  const lastLogin = new Date(char.lastLoginDate)
  const diffTime = Math.abs(now.getTime() - lastLogin.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) 

  if (diffDays > 14) {
    const penaltyRate = 0.9 
    const newStr = Math.max(1, Math.floor(char.str * penaltyRate))
    const newInt = Math.max(1, Math.floor(char.int * penaltyRate))
    const newVit = Math.max(1, Math.floor(char.vit * penaltyRate))

    char = await prisma.character.update({
      where: { id: char.id },
      data: { str: newStr, int: newInt, vit: newVit, lastLoginDate: now }
    })
  } else if (diffDays >= 1) {
    char = await prisma.character.update({
      where: { id: char.id },
      data: { lastLoginDate: now }
    })
  }

  return char
}

export async function createCharacter(formData: FormData) {
  const session = await auth()
  if (!session?.user?.email) return

  const name = formData.get('name') as string
  const selectedClass = formData.get('class') as string
  
  let str = 5, int = 5, vit = 5
  let avatarSeed = 'Novice'

  if (selectedClass === 'Warrior') { str = 8; int = 3; vit = 6; avatarSeed = 'Knight' }
  else if (selectedClass === 'Mage') { str = 3; int = 9; vit = 4; avatarSeed = 'Wizard' }
  else if (selectedClass === 'Rogue') { str = 6; int = 5; vit = 7; avatarSeed = 'Scout' }

  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${selectedClass}-Novice-${name}`

  await prisma.character.create({
    data: {
      user: { connect: { email: session.user.email } },
      name, class: selectedClass, avatarUrl, str, int, vit,
      level: 1, currentXp: 0, nextLevelXp: 100,
      plan: "RANDOM"
    }
  })

  redirect('/')
}

export async function resetCharacter() {
  const char = await getCharacter()
  if (!char) return
  let str = 5, int = 5, vit = 5
  if (char.class === 'Warrior') { str = 8; int = 3; vit = 6 }
  else if (char.class === 'Mage') { str = 3; int = 9; vit = 4 }
  else if (char.class === 'Rogue') { str = 6; int = 5; vit = 7 }
  
  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${char.class}-Novice-${char.name}`

  await prisma.questLog.deleteMany({ where: { characterId: char.id } })
  await prisma.character.update({
    where: { id: char.id },
    data: { level: 1, currentXp: 0, nextLevelXp: 100, str, int, vit, avatarUrl }
  })
  revalidatePath('/')
  revalidatePath('/diary')
}

// ---------------------------------------------------------
// 2. Quest System (Manage & Daily)
// ---------------------------------------------------------

export async function getQuests() {
  return await prisma.quest.findMany()
}

// ✅ 1. แก้ไข createQuest ให้รับค่าถูกต้อง (กันเหนียว)
export async function createQuest(formData: FormData) {
  const title = formData.get('title') as string
  const xp = parseInt(formData.get('xp') as string) || 10
  const statReward = parseInt(formData.get('statReward') as string) || 1 // ใส่ Default กัน Error
  const statType = formData.get('statType') as string

  if (!title) return

  await prisma.quest.create({
    data: { 
        title, 
        xpReward: xp, 
        statReward: statReward, 
        statType, 
        description: "Custom Quest" 
    }
  })
  revalidatePath('/manage')
}
// ✅ แบบใหม่ (แก้ไขเป็นแบบนี้ครับ): รับ FormData
export async function deleteQuest(formData: FormData) {
  const id = formData.get("id") as string // ดึงค่าจาก <input name="id">
  
  if (!id) return

  try {
    await prisma.quest.delete({
      where: { id: id }
    })
    revalidatePath('/manage') // สั่งรีเฟรชหน้า Manage
    revalidatePath('/')       // สั่งรีเฟรชหน้าแรกด้วย
  } catch (error) {
    console.error("Failed to delete quest:", error)
  }
}

// --- Daily & Gym Split Logic ---

export async function switchPlan(newPlan: string) {
  const char = await getCharacter()
  if (!char) return
  await prisma.character.update({
    where: { id: char.id },
    data: { plan: newPlan }
  })
  revalidatePath('/')
}

function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function createVirtualQuest(id: string, title: string, statType: string, xp: number, stat: number) {
    return {
        id, title, statType, xpReward: xp, statReward: stat, 
        description: "Routine Quest", createdAt: new Date(), updatedAt: new Date()
    }
}

// 1. อัปเดต Database เควสให้หลากหลายขึ้น
export async function seedDefaultQuests() {
     //await prisma.quest.deleteMany() // ถ้าอยากล้างของเก่าให้เปิดบรรทัดนี้

    const defaults = [
        // --- Basic & Random ---
        { title: "Push Up (วิดพื้น 20 ครั้ง)", xpReward: 20, statReward: 2, statType: "STR" },
        { title: "Plank (แพลงก์ 1 นาที)", xpReward: 25, statReward: 2, statType: "STR" },
        { title: "Jogging (วิ่งเบาๆ 30 นาที)", xpReward: 30, statReward: 3, statType: "VIT" },
        { title: "Read Book (อ่านหนังสือ 10 หน้า)", xpReward: 15, statReward: 3, statType: "INT" },
        { title: "Drink Water (ดื่มน้ำ 3 ลิตร)", xpReward: 10, statReward: 1, statType: "VIT" },
        { title: "Meditate (นั่งสมาธิ 15 นาที)", xpReward: 15, statReward: 3, statType: "INT" },

        // --- Gym Rat (Main Lifts - แบบเหมาส่วน) ---
        { title: "Chest & Triceps Workout (อก/หลังแขน 1 ชม.)", xpReward: 50, statReward: 5, statType: "STR" },
        { title: "Back & Biceps Workout (หลัง/หน้าแขน 1 ชม.)", xpReward: 50, statReward: 5, statType: "STR" },
        { title: "Leg Day Workout (ขาโหด 1 ชม.)", xpReward: 60, statReward: 6, statType: "VIT" },
        { title: "Shoulder Workout (ไหล่กลม 45 นาที)", xpReward: 40, statReward: 4, statType: "STR" },

        // --- Gym Rat (Support / Health) ---
        { title: "Eat High Protein (กินโปรตีนให้ถึง)", xpReward: 20, statReward: 2, statType: "VIT" },
        { title: "Sleep 8 Hours (นอนครบ 8 ชม.)", xpReward: 30, statReward: 5, statType: "VIT" },
        { title: "Cardio Zone 2 (เดินชัน 30 นาที)", xpReward: 30, statReward: 3, statType: "VIT" },
        { title: "Active Rest (ยืดเหยียด/นวด)", xpReward: 15, statReward: 1, statType: "VIT" },
        { title: "Abs Workout (เล่นท้อง 15 นาที)", xpReward: 25, statReward: 2, statType: "STR" },
    ]

    for (const q of defaults) {
        const exists = await prisma.quest.findFirst({ where: { title: q.title } })
        if (!exists) {
            await prisma.quest.create({
                data: { ...q, description: "System Quest" }
            })
        }
    }
    revalidatePath('/manage')
}

// 2. ตรวจสอบ getDailyQuests (Gym Split Logic) อีกครั้ง
export async function getDailyQuests() {
  const char = await getCharacter()
  if (!char) return []

  if (char.plan === 'GYM_SPLIT') {
      const now = new Date()
      const start = new Date(char.planStartDate)
      now.setHours(0,0,0,0); start.setHours(0,0,0,0);
      const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      const cycleDay = diffDays < 0 ? 1 : (diffDays % 4) + 1

      // Helper function: หาเควสจากชื่อ
      // ใช้ contains เพื่อความยืดหยุ่น (เช่นหา "Chest" จะเจอ "Chest & Triceps...")
      const find = async (key: string) => await prisma.quest.findFirst({ where: { title: { contains: key } } })

      let quests = []
      
      if (cycleDay === 1) { // PUSH
         quests = [
             await find("Chest"),  // Main
             await find("Abs"),    // Support
             await find("Protein") // Habit
         ]
      } 
      else if (cycleDay === 2) { // PULL
         quests = [
             await find("Back"), 
             await find("Cardio"), 
             await find("Water")
         ]
      } 
      else if (cycleDay === 3) { // LEGS
         quests = [
             await find("Leg"), 
             await find("Shoulder"), 
             await find("Sleep")
         ]
      } 
      else { // REST
         quests = [
             await find("Active Rest"),
             await find("Read"),
             await find("Meditate")
         ]
      }
      
      // ถ้าตัวไหนหาไม่เจอ (เป็น null) ให้กรองออก
      const validQuests = quests.filter(Boolean)

      // ถ้าไม่มีเควสเลย (แสดงว่า DB ว่างเปล่า หรือชื่อไม่ตรง)
      // ให้ Return Empty เพื่อให้หน้าเว็บรู้ว่าต้องไป Seed Data
      return validQuests as any[]
  }

  // ... (ส่วน Custom Routine และ Random เหมือนเดิม) ...
  // (อย่าลืมใส่กลับมาด้วยนะครับ ถ้าก๊อปไปทับ)
  
  // Custom
  if (char.plan === 'CUSTOM_ROUTINE') {
        const diffTime = new Date().setHours(0,0,0,0) - new Date(char.planStartDate).setHours(0,0,0,0)
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        const maxDay = await prisma.routine.aggregate({ where: { characterId: char.id }, _max: { dayIndex: true } })
        const loopLength = maxDay._max.dayIndex || 1
        const currentCycleDay = diffDays < 0 ? 1 : (diffDays % loopLength) + 1
        const routines = await prisma.routine.findMany({ where: { characterId: char.id, dayIndex: currentCycleDay }, include: { quest: true } })
        return routines.map(r => r.quest)
  }

  // src/app/actions.ts

// ... (ภายในฟังก์ชัน getDailyQuests) ...

  // -------------------------------------------------------
  // ✅ Case 3: Random (Adenturer Plan) - แบบล็อกรายวัน
  // -------------------------------------------------------
  
  const allQuests = await prisma.quest.findMany()
  if (allQuests.length === 0) return []

  // 1. สร้าง "กุญแจ" จากวันปัจจุบัน (เช่น "2023-10-25")
  // เพื่อให้ทุกครั้งที่รันในวันนี้ จะได้ค่าเดิมเสมอ
  const today = new Date()
  const dateKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`

  // 2. ฟังก์ชันสุ่มตัวเลขแบบกำหนด Seed (Pseudo Random)
  // หลักการ: เอา string มาคำนวณเป็นตัวเลข ถ้า input เหมือนเดิม ตัวเลขที่ได้จะเท่าเดิม 100%
  const getSeededScore = (input: string) => {
      let hash = 0;
      for (let i = 0; i < input.length; i++) {
          const char = input.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash);
  }

  // 3. เรียงลำดับเควส โดยใช้คะแนนที่คำนวณจาก (QuestID + Date + UserID)
  // ผลลัพธ์: ผู้ใช้คนเดิม ในวันเดิม จะได้ลิสต์เควสเรียงเหมือนเดิมเป๊ะๆ ตลอด 24 ชม.
  const shuffled = allQuests.sort((a, b) => {
      const scoreA = getSeededScore(a.id + dateKey + char.id)
      const scoreB = getSeededScore(b.id + dateKey + char.id)
      return scoreA - scoreB // เรียงตามคะแนนที่สุ่มได้
  })

  // ตัดมา 3 อันแรก (3 อันนี้จะเป็นชุดเดิมตลอดทั้งวัน)
  return shuffled.slice(0, 3)
}
export async function getDailyProgress() {
    const char = await getCharacter()
    if (!char) return { completedIds: [], isBonusClaimed: false }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const logs = await prisma.questLog.findMany({
        where: {
            characterId: char.id,
            completedAt: { gte: today, lt: tomorrow }
        }
    })

    const completedIds = logs.map(l => l.customId || l.questId || "")
    const isBonusClaimed = logs.some(l => l.customId === 'DAILY_BONUS')

    return { completedIds, isBonusClaimed }
}

// src/app/actions.ts -> completeQuest (ฉบับอัปเกรด Streak)

export async function completeQuest(questId: string) {
  const session = await auth()
  if (!session?.user?.email) return
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { characters: true } })
  const char = user?.characters[0]
  if (!char) return

  // 1. Find Quest Info
  let questTitle = "Unknown Quest"
  let statType = "STR"
  let xpReward = 0
  let statReward = 0
  let dbQuestId = null

  const dbQuest = await prisma.quest.findUnique({ where: { id: questId } })
  if (dbQuest) {
      questTitle = dbQuest.title
      statType = dbQuest.statType
      xpReward = dbQuest.xpReward
      statReward = dbQuest.statReward
      dbQuestId = dbQuest.id
  } else {
      const daily = await getDailyQuests()
      const found = daily.find((q:any) => q.id === questId)
      if (found) {
          questTitle = found.title
          statType = found.statType
          xpReward = found.xpReward
          statReward = found.statReward
      } else {
          return 
      }
  }

  // 2. Calculate Stats
  let newStr = char.str + (statType === 'STR' ? statReward : 0)
  let newInt = char.int + (statType === 'INT' ? statReward : 0)
  let newVit = char.vit + (statType === 'VIT' ? statReward : 0)
  let newXp = char.currentXp + xpReward

  // 3. 🔥 Streak Logic (New!)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()) // เที่ยงคืนวันนี้
  
  let newStreak = char.streak
  let lastTaskDate = char.lastTaskDate ? new Date(char.lastTaskDate) : null
  
  // ล้างเวลาให้เหลือแค่ "วันที่" เพื่อเทียบ
  const lastTaskDay = lastTaskDate ? new Date(lastTaskDate.getFullYear(), lastTaskDate.getMonth(), lastTaskDate.getDate()) : null
  
  // คำนวณระยะห่าง (วัน)
  const diffTime = lastTaskDay ? Math.abs(today.getTime() - lastTaskDay.getTime()) : 999999999
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) 

  if (!lastTaskDate) {
      // เพิ่งทำครั้งแรก
      newStreak = 1
  } else if (diffDays === 1) {
      // ต่อเนื่องจากเมื่อวาน -> เพิ่ม Streak
      newStreak += 1
  } else if (diffDays > 1) {
      // ขาดช่วงไปนาน -> รีเซ็ตเหลือ 1
      newStreak = 1
  } 
  // else if (diffDays === 0) -> ทำวันเดิม Streak เท่าเดิม

  // 4. Save Log
  await prisma.questLog.create({
    data: { 
        characterId: char.id, 
        questId: dbQuestId,
        questTitle: questTitle,
        customId: questId 
    }
  })

  // 5. Check Bonus
  const dailyQuests = await getDailyQuests()
  const progress = await getDailyProgress()
  const isAllDailyDone = dailyQuests.every(q => progress.completedIds.includes(q.id) || q.id === questId)

  if (isAllDailyDone && !progress.isBonusClaimed) {
      const BONUS_XP = 100
      newXp += BONUS_XP
      await prisma.questLog.create({
          data: { 
              characterId: char.id, 
              questId: null,
              questTitle: "🎉 Daily Bonus",
              customId: "DAILY_BONUS"
          }
      })
  }

  // 6. Level Up & Avatar
  let newLevel = char.level
  let newNextLevelXp = char.nextLevelXp

  while (newXp >= newNextLevelXp) {
    newLevel++
    newXp -= newNextLevelXp
    newNextLevelXp = Math.floor(newNextLevelXp * 1.5)
  }

  let newAvatarUrl = char.avatarUrl
  let rank = "Novice"
  if (newLevel >= 30) rank = "Master"
  else if (newLevel >= 10) rank = "Veteran"
  
  let oldRank = "Novice"
  if (char.level >= 30) oldRank = "Master"
  else if (char.level >= 10) oldRank = "Veteran"

  if (rank !== oldRank || !newAvatarUrl) {
      newAvatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${char.class}-${rank}-${char.name}`
  }

  // 7. Update DB
  await prisma.character.update({
    where: { id: char.id },
    data: { 
        level: newLevel, 
        currentXp: newXp, 
        nextLevelXp: newNextLevelXp, 
        str: newStr, int: newInt, vit: newVit, 
        avatarUrl: newAvatarUrl,
        streak: newStreak,          // ✅ บันทึก Streak
        lastTaskDate: now           // ✅ บันทึกเวลาทำล่าสุด
    }
  })

  revalidatePath('/')
  revalidatePath('/diary')
}
// ---------------------------------------------------------
// 3. History & Smart Undo
// ---------------------------------------------------------

export async function getQuestHistory() {
  const char = await getCharacter()
  if (!char) return []

  const logs = await prisma.questLog.findMany({
    where: { characterId: char.id },
    orderBy: { completedAt: 'desc' }
  })
  return logs
}

function calculateLevelStats(level: number) {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

export async function undoLastQuest() {
  const char = await getCharacter()
  if (!char) return

  const lastLog = await prisma.questLog.findFirst({
    where: { characterId: char.id },
    orderBy: { completedAt: 'desc' },
    include: { quest: true }
  })

  if (!lastLog) return

  // Re-calculate Rewards to remove
  let xpToRemove = 0
  let statToRemove = 0
  let statType = ""

  if (lastLog.customId === 'DAILY_BONUS') {
      xpToRemove = 100
  } else if (lastLog.questId && lastLog.quest) {
      xpToRemove = lastLog.quest.xpReward
      statToRemove = lastLog.quest.statReward
      statType = lastLog.quest.statType
  } else if (lastLog.customId && lastLog.customId.startsWith('gym-')) {
      const daily = await getDailyQuests()
      const found = daily.find((q: any) => q.id === lastLog.customId)
      if (found) {
          xpToRemove = found.xpReward
          statToRemove = found.statReward
          statType = found.statType
      }
  }

  let newStr = char.str
  let newInt = char.int
  let newVit = char.vit

  if (statType === 'STR') newStr = Math.max(1, newStr - statToRemove)
  if (statType === 'INT') newInt = Math.max(1, newInt - statToRemove)
  if (statType === 'VIT') newVit = Math.max(1, newVit - statToRemove)

  let newXp = char.currentXp - xpToRemove
  let newLevel = char.level
  let newNextLevelXp = char.nextLevelXp

  // Reverse Level Up
  while (newXp < 0 && newLevel > 1) {
      newLevel--
      const prevMaxXp = calculateLevelStats(newLevel)
      newNextLevelXp = prevMaxXp
      newXp += prevMaxXp
  }
  
  if (newLevel === 1 && newXp < 0) newXp = 0

  await prisma.questLog.delete({ where: { id: lastLog.id } })

  await prisma.character.update({
    where: { id: char.id },
    data: {
      level: newLevel,
      currentXp: newXp,
      nextLevelXp: newNextLevelXp,
      str: newStr, int: newInt, vit: newVit
    }
  })

  revalidatePath('/')
  revalidatePath('/diary')
}
// src/app/actions.ts

// ...

// 1. แก้ไข getRoutineData ให้ปฏิทินแสดงข้อมูลครบ 3 อย่าง
export async function getRoutineData() {
    const char = await getCharacter()
    if (!char) return { type: 'UNKNOWN', length: 0, data: {}, startDate: new Date() }

    // Case 1: Custom Routine (เหมือนเดิม)
    if (char.plan === 'CUSTOM_ROUTINE') {
        const routines = await prisma.routine.findMany({
            where: { characterId: char.id },
            include: { quest: true }
        })
        const maxDay = Math.max(...routines.map(r => r.dayIndex), 0) || 1
        const data: Record<number, any[]> = {}
        routines.forEach(r => {
            if (!data[r.dayIndex]) data[r.dayIndex] = []
            data[r.dayIndex].push(r.quest)
        })
        return { type: 'CUSTOM', length: maxDay, data, startDate: char.planStartDate }
    }

    // ✅ Case 2: Gym Rat (แก้ตรงนี้! ให้แสดงเควสจำลอง 3 อย่างต่อวัน)
    if (char.plan === 'GYM_SPLIT') {
        // สร้าง Object เควสจำลอง (Title ต้องสื่อความหมาย)
        const q = (title: string) => ({ title }) 

        return { 
            type: 'GYM', 
            length: 4, 
            startDate: char.planStartDate,
            data: {
                // Day 1: PUSH
                1: [q("Chest & Triceps Workout"), q("Abs Workout"), q("Eat High Protein")],
                // Day 2: PULL
                2: [q("Back & Biceps Workout"), q("Cardio Zone 2"), q("Drink 3L Water")],
                // Day 3: LEGS
                3: [q("Leg Day Workout"), q("Shoulder Press"), q("Sleep 8 Hours")],
                // Day 4: REST
                4: [q("Active Rest / Stretching"), q("Read Book"), q("Meditate")]
            }
        }
    }

    // Case 3: Random
    return { type: 'RANDOM', length: 1, data: {}, startDate: new Date() }
}
// src/app/actions.ts

// ... (code เดิม)

// ✅ เพิ่มฟังก์ชันนี้เพื่อดึงเควสทั้งหมดไปให้ ScheduleBuilder เลือก
export async function getAllQuests() {
  const session = await auth()
  if (!session?.user?.email) return []
  
  // ดึงเควสทั้งหมด (เรียงตามชื่อ)
  return await prisma.quest.findMany({
    orderBy: { title: 'asc' }
  })
}
