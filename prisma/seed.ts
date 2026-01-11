// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Start seeding...')

  // 1. เคลียร์ Quest เก่าทิ้งก่อน (กันเควสซ้ำเวลา Seed หลายรอบ)
  await prisma.quest.deleteMany({})

  // 2. สร้างเควสชุดใหญ่ (Master Quests)
  const quests = [
    // --- สาย STR (Warrior Path) ---
    { title: 'Push-ups 20 reps', description: 'วิดพื้น 20 ครั้ง', xpReward: 50, statType: 'STR', statReward: 2 },
    { title: 'Plank 1 min', description: 'แพลงก์ 1 นาที', xpReward: 40, statType: 'STR', statReward: 1 },
    { title: 'Weight Training', description: 'ยกเวท 45 นาที', xpReward: 100, statType: 'STR', statReward: 3 },
    
    // --- สาย INT (Mage Path) ---
    { title: 'Read Book 1 Chapter', description: 'อ่านหนังสือ 1 บท', xpReward: 50, statType: 'INT', statReward: 2 },
    { title: 'Study Code 30 mins', description: 'ฝึกเขียนโค้ด', xpReward: 60, statType: 'INT', statReward: 2 },
    { title: 'Analyze Stock Market', description: 'วิเคราะห์กราฟหุ้น', xpReward: 40, statType: 'INT', statReward: 1 },
    
    // --- สาย VIT (Adventurer/Recovery Path) ---
    { title: 'Drink Water 2L', description: 'ดื่มน้ำให้ครบ 2 ลิตร', xpReward: 20, statType: 'VIT', statReward: 1 },
    { title: 'Walk 5,000 Steps', description: 'เดิน 5,000 ก้าว', xpReward: 50, statType: 'VIT', statReward: 2 },
    { title: 'Sleep 8 Hours', description: 'นอนหลับให้เพียงพอ', xpReward: 60, statType: 'VIT', statReward: 3 },
    { title: 'Meditate 10 mins', description: 'นั่งสมาธิ (Active Recovery)', xpReward: 30, statType: 'VIT', statReward: 1 }, // สำหรับ Rest Day
  ]

  for (const q of quests) {
    await prisma.quest.create({
      data: {
        title: q.title,
        description: q.description,
        xpReward: q.xpReward,
        statType: q.statType as any,
        statReward: q.statReward,
      }
    })
  }

  console.log(`✅ Seeding finished. Added ${quests.length} quests.`)
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })