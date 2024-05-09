import { sql } from 'drizzle-orm';
import { mysqlTable, serial, varchar, datetime } from 'drizzle-orm/mysql-core';

export const blessing = mysqlTable('Blessing', {
  id: serial('id').primaryKey(),
  nickname: varchar('nickname', { length: 128 }).default('匿名用户').unique(),
  advice: varchar('advice', { length: 512 }),
  blessing: varchar('blessing', { length: 512 }),
  createdAt: datetime('createDate', { fsp: 3, mode: 'date' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
});
