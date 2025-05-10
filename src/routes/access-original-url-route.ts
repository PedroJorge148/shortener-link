import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '../db/index.ts'
import { links } from '../db/schema.ts'
import { getOriginalUrl } from '../functions/get-original-url.ts'

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
        },
      },
    },
    async (request, reply) => {
      const { shortId } = request.params

      const originalUrl = getOriginalUrl({ shortId })

      return reply.redirect(originalUrl.toString(), 302)
    }
  )
}
