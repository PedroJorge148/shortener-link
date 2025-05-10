import { eq } from 'drizzle-orm'
import { db } from '../db/index.ts'
import { links } from '../db/schema.ts'

interface GetOriginalUrlParams {
  shortId: string
}

export async function getOriginalUrl({ shortId }: GetOriginalUrlParams) {
  const [link] = await db.select().from(links).where(eq(links.shortId, shortId))

  const { originalUrl } = link

  return { originalUrl }
}
