
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z, { boolean } from "zod"
import { createSelectSchema } from "drizzle-zod"
import { webhooks } from "@/db/schema"
import { db } from "@/db/index"
import { eq, inArray } from "drizzle-orm"

export const generateHandler: FastifyPluginAsyncZod = async (app) => {
app.delete('/api/generate', {

  schema: {
    summary: 'Generate typescript handler',
    tags: ['Webhooks'],
  body: z.object({
    webhookIds: z.array(z.string())
  }),
    response: {
      201: z.object({
        code: z.string().default('Handler generated successfully'),
      }),

    }
  }
} , async (request, reply) => {

  const { webhookIds } = request.body
  const result = await db
  .select({body: webhooks.body})
  .from(webhooks)
  .where(inArray(webhooks.id, webhookIds))


  const webhookBodies = result.map(r => r.body).join('\n\n')



  return reply.status(201).send( { code: webhookBodies } )
})

}