import { db } from '../db/index.ts'
import { links } from '../db/schema.ts'
import { generateUniqueShortCode } from './generate-unique-short-code.ts'

interface createShortLinkBody {
  title: string
  url: string
}

export async function createShortLink({
  title,
  url: originalUrl,
}: createShortLinkBody) {
  const shortId = await generateUniqueShortCode()

  const [link] = await db
    .insert(links)
    .values({
      title,
      shortId,
      originalUrl,
    })
    .returning()

  return { shortId: link.shortId }
}
