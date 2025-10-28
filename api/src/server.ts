import { fastify } from 'fastify'
import {
  serializerCompiler, 
  validatorCompiler, 
  jsonSchemaTransform,
  type ZodTypeProvider,
} from  'fastify-type-provider-zod'
import {fastifySwagger } from '@fastify/swagger'
import { fastifyCors} from '@fastify/cors'
import ScalarApiReference from '@scalar/fastify-api-reference'
import { listWebhooks } from './routes/list-webhooks'
import { env } from './env'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)


app.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

})
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Webhoo Inspector API',
      description: 'API documentation for Webhoo Inspector',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(ScalarApiReference, {
routePrefix: '/docs',
})

app.register(listWebhooks)

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
	console.log('HTTP server running on http://localhost:3333')
	console.log('Docs http://localhost:3333/docs')
})
