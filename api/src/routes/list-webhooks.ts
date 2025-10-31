import { createSelectSchema } from "drizzle-zod"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { webhooks } from "@/db/schema"
import { db } from "@/db/index"
import { desc, lt } from "drizzle-orm"

export const listWebhooks: FastifyPluginAsyncZod = async (app) => {
  app.get('/api/webhooks', {
    schema: {
      summary: 'List Webhooks',
      tags: ['Webhooks'],
      querystring: z.object({
        limit: z.coerce.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      }),
      response: {
        200: z.object({
          webhooks: z.array(createSelectSchema(webhooks).pick({
            id: true,
            method: true,
            pathname: true, 
            createdAt: true,
          })),
          nextCursor: z.string().optional(),
        })
      }
    }
  }, async (request, reply) => {
    const { limit, cursor } = request.query

    const result = await db
      .select({
        id: webhooks.id,
        method: webhooks.method,
        pathname: webhooks.pathname,
        createdAt: webhooks.createdAt,
      })
      .from(webhooks)
      .where(cursor ? lt(webhooks.id, cursor) : undefined)
      .orderBy(desc(webhooks.createdAt))
      .limit(limit + 1)

    const hasMore = result.length > limit
    const items = hasMore ? result.slice(0, limit) : result
    const nextCursor = hasMore ? items[items.length - 1].id : undefined // Mudança: null → undefined

    return reply.send({
      webhooks: items,
      nextCursor,
    })
  })
}