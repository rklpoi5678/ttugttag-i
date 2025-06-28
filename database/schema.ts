// database/schema.ts
import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const userProjects = sqliteTable('UserProjects', {
  id: text('id').primaryKey(), // UUID 등을 위한 TEXT 타입
  clerkUserId: text('clerkUserId').notNull(),
  
  projectName: text('projectName').notNull(),
  projectDescription: text('projectDescription'), 
  tldrawContent: text('tldrawContent').notNull(),

  screenSize: text('screenSize'), 
  canvasWidth: integer('canvas_width'),
  canvasHeight: integer('canvas_height'),
  projectType: text('projectType'), 

  tags: text('tags'),

  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
  // imageUrl: text('imageUrl').notNull().default(''),
});
