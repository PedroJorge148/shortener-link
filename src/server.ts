import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { accessOriginalUrlRoute } from './routes/access-original-url-route.ts'
import { createShortLinkRoute } from './routes/create-short-link-route.ts'

const app = fastify()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Shortener Links',
      version: '0.1',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(createShortLinkRoute)
app.register(accessOriginalUrlRoute)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running! Docs on http://localhost:3333/docs')
})
