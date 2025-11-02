import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
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
