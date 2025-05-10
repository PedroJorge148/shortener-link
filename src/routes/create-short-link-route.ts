import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '../db/index.ts'
import { links } from '../db/schema.ts'
import { createShortLink } from '../functions/create-short-link.ts'
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
      const { title, url } = request.body

      const { shortId } = await createShortLink({ title, url })

      return reply.status(201).send({ shortId })
    }
  )
}
