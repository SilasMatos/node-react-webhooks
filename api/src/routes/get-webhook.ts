
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { createSelectSchema } from "drizzle-zod"
import { webhooks } from "@/db/schema"

export const getWebhook: FastifyPluginAsyncZod = async (app) => {
app.get('/api/webhooks/:id', {

  schema: {
    summary: 'Get a specific webhook by ID',
    tags: ['Webhooks'],
    params: z.object({
      id: z.uuidv7(),
    }),
    response: {
      200: createSelectSchema(webhooks)
    }
  }
} , async (request, reply) => {

  const { limit } = request.query

  return [
    {
      id: 'webhook_1',
      method: 'POST',
    }
  ]
})

}