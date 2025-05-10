import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '../db/index.ts'
import { links } from '../db/schema.ts'

export const accessOriginalUrlRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/:shortId',
    {
      schema: {
        summary: 'Access the original link',
        operationId: 'accessOriginalUrlRoute',
        tags: ['access-link'],
        params: z.object({
          shortId: z.string(),
        }),
        response: {
          301: z.null(),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { shortId } = request.params

      const results = await db
        .select()
        .from(links)
        .where(eq(links.shortId, shortId))

      if (results.length <= 0) {
        return reply.status(404).send({ message: 'Link not found.' })
      }

      const link = results[0]

      if (link.isActive === 0) {
        return reply.status(400).send()
      }

      if (link.expiresAt <= new Date()) {
        return reply.status(400).send({ message: 'Expired link.' })
      }

      const { originalUrl } = link

      return reply.redirect(originalUrl.toString(), 302)
    }
  )
}
