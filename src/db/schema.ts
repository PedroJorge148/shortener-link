import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { createSelectSchema } from 'drizzle-zod'

export const links = pgTable('links', {
  id: uuid().primaryKey().defaultRandom(),
  // TODO: add user_id to know the links for a user
  shortId: text('short_id').unique().notNull(),
  originalUrl: text('original_url').notNull(),
  clicks: integer('clicks').default(0).notNull(),
  title: text('title'),
  isActive: integer('is_active').default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
})

export const linksSelectSchema = createSelectSchema(links)
