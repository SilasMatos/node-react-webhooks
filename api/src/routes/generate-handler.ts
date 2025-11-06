
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z, { boolean } from "zod"
import { createSelectSchema } from "drizzle-zod"
import { webhooks } from "@/db/schema"
import { db } from "@/db/index"
import {  inArray } from "drizzle-orm"
import { generateText } from 'ai';

import { google } from '@ai-sdk/google';
export const generateHandler: FastifyPluginAsyncZod = async (app) => {
app.post('/api/generate', {

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


const { text } = await generateText({
  model: google('gemini-2.5-flash-lite'),
  prompt: `
You are a TypeScript expert. Write a TypeScript function that acts as a webhook handler for the following webhook events. The function should use Zod for schema validation to validate the incoming webhook payloads. Each event has a specific payload structure, and the handler should handle each event appropriately.

Here are the webhook payloads (in JSON format) for the events:
"""
${webhookBodies}
"""
Requirements:
1. The function should be named "handleWebhooks".
2. Use Zod to define schemas for each event type.
3. The function should take the event type and payload as input and handle each event based on its type.
4. For unrecognized event types, the function should throw an error.
5. Return a response indicating the result of handling the event.

Example:
- If the event type is "payment_intent.succeeded", validate the payload using Zod and log a success message.
- If the event type is "invoice.payment_failed", validate the payload and log a failure message.

Generate the complete TypeScript code, including the Zod schemas and the handler function.

Return only the code and do not return \`\`\`typescript or any other markdown symbols , do not incluide any introduction or text before or after the code

`.trim(),
});

  return reply.status(201).send( { code: text } )
})

}