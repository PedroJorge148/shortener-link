import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '../db/index.ts'
import { links } from '../db/schema.ts'
import { generateUniqueShortCode } from '../functions/generate-unique-short-code.ts'

export const desactiveShortLinkRoute: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/links/:id/desactive',
    {
      schema: {
        summary: 'Create a short link',
        tags: ['link'],
        operationId: 'desactiveShortLinkRoute',
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params

      // TODO: validate if link exists

      await db
        .update(links)
        .set({
          isActive: 0,
        })
        .where(eq(links.id, id))

      return reply.status(204).send()
    }
  )
}
