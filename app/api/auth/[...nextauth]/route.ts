// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth" // เรียกใช้จากไฟล์ที่เราเพิ่งสร้าง
export const { GET, POST } = handlers