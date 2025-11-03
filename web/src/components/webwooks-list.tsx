import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { WebHooksListItem } from './webhooks-list-item'
import { webhookListSchema } from '../http/schemas/webhooks'

export function WebhooksList() {
  const { data } = useSuspenseQuery({
    queryKey: ['webhooks'],
    queryFn: async () => {
      const respose = await fetch('http://localhost:3333/api/webhooks')
      const data = await respose.json()
      return webhookListSchema.parse(data)
    }
  })

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-600 hover:scrollbar-thumb-zinc-500">
      <div className=" space-y-1 p-2">
        {data.webhooks.map(webhook => (
          <WebHooksListItem key={webhook.id} webhook={webhook} />
        ))}
      </div>
    </div>
  )
}
