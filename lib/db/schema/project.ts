import type { UIMessage } from 'ai'
import { relations } from 'drizzle-orm'
import { boolean, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { user } from './auth'

export const project = pgTable('project', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  isNameGenerated: boolean('is_name_generated').default(false).notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const projectRelations = relations(project, ({ many, one }) => ({
  messages: many(projectMessages),
  user: one(user, {
    fields: [project.userId],
    references: [user.id],
  }),
}))

export const projectMessages = pgTable('project_messages', {
  id: text('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .references(() => project.id, { onDelete: 'cascade' }),
  role: text('role').$type<UIMessage['role']>().notNull(),
  parts: jsonb('parts').$type<UIMessage['parts']>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const projectMessagesRelations = relations(projectMessages, ({ one }) => ({
  project: one(project, {
    fields: [projectMessages.projectId],
    references: [project.id],
  }),
}))
