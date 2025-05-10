import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '../db/index.ts'
import { links, linksSelectSchema } from '../db/schema.ts'

export const getAllShortLinksRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/links',
    {
      schema: {
        summary: 'Get all short links',
        tags: ['link'],
        operationId: 'getAllShortLinksRoute',
        response: {
          200: z.array(linksSelectSchema),
        },
      },
    },
    async (_, reply) => {
      const data = await db.select().from(links)

      return reply.status(200).send(data)
    }
  )
}
