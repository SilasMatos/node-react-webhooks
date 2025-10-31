
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { createSelectSchema } from "drizzle-zod"
import { webhooks } from "@/db/schema"
import { db } from "@/db/index"
import { eq } from "drizzle-orm"

export const captureWebHooks: FastifyPluginAsyncZod = async (app) => {
app.all('/api/capture/*', {

  schema: {
    summary: 'Capture incoming webhook requests',
    tags: ['External'],
    params: z.object({
      id: z.uuidv7(),
    }),
    response: {
      200: z.object({
        id: z.uuidv7(),
      }),
      
    }
  }
} , async (request, reply) => {
  const method = request.method
  const ip = request.ip
  const contentType = request.headers['content-type'] || ''
  const contentLength = request.headers['content-length'] 
  ? Number(request.headers['content-length']) 
  : null

})

}