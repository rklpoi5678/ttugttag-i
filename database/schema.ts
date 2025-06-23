// database/schema.ts
import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const userProjects = sqliteTable('UserProjects', {
  id: text('id').primaryKey(), // UUID 등을 위한 TEXT 타입
  clerkUserId: text('clerkUserId').notNull(),
  projectName: text('projectName').notNull(),
  projectDescription: text('projectDescription'), // <-- 이 필드가 있는지 확인
  tldrawContent: text('tldrawContent').notNull(),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
  screenSize: text('screenSize'), // <-- 이 필드가 있는지 확인
  projectType: text('projectType'), // <-- 이 필드가 있는지 확인
  tags: text('tags'), // <-- 이 필드가 있는지 확인
  // imageUrl 필드를 추가할 수도 있습니다.
  // imageUrl: text('imageUrl').notNull().default(''),
});
