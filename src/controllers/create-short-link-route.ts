import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '../db/index.ts'
import { links } from '../db/schema.ts'
import { generateUniqueShortCode } from '../functions/generate-unique-short-code.ts'

export const createShortLinkRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/links',
    {
      schema: {
        summary: 'Create a short link',
        tags: ['link'],
        operationId: 'createShortLinkRoute',
        body: z.object({
          title: z.string(),
          url: z.string().url(),
        }),
        response: {
          201: z.object({ shortId: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { title, url: originalUrl } = request.body

      const shortId = await generateUniqueShortCode()
      const expiresAt = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)

      const [link] = await db
        .insert(links)
        .values({
          title,
          shortId,
          originalUrl,
          expiresAt,
        })
        .returning()

      return reply.status(201).send({ shortId: link.shortId })
    }
  )
}
