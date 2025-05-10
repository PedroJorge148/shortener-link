import { eq } from 'drizzle-orm'
import { db } from '../db/index.ts'
import { links } from '../db/schema.ts'
import { generateShortCode } from '../utils/generate-short-code.ts'

export async function generateUniqueShortCode(
  maxAttempts = 5
): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const shortId = generateShortCode()

    const results = await db
      .select()
      .from(links)
      .where(eq(links.shortId, shortId))

    if (results.length <= 0) {
      return shortId
    }
  }

  // Add Observability

  throw new Error(
    'Failed to generate a unique short code after multiple attempts'
  )
}
