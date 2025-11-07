import { type DefaultSession } from 'next-auth';

// هنا بنعرف TypeScript إن الـ User بتاعنا جواه guestId
declare module 'next-auth' {
  interface User {
    guestId?: number; // أو string حسب نوع الـ ID عندك
  }

  // بنعدل الـ Session عشان تستخدم الـ User الجديد بتاعنا
  interface Session {
    user: User & DefaultSession['user']; // ادمج الـ User بتاعنا مع الافتراضي
  }
}
