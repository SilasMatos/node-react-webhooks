import { Link } from '@tanstack/react-router'
import { Iconbutton } from './ui/icon-button'
import { formatDistanceToNow } from 'date-fns'
import { Trash2Icon } from 'lucide-react'
import { Checkbox } from './ui/checkbox'
import { useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

interface WebHooksListItemProps {
  webhook: {
    id: string
    method: string
    pathname: string
    createdAt: Date
  }
  onWebhookChecked: (webhookId: string) => void
  isWebhookChecked: boolean
}

export function WebHooksListItem({
  webhook,
  isWebhookChecked,
  onWebhookChecked
}: WebHooksListItemProps) {
  const [isChecked, setIsChecked] = useState(false)
  const queryClient = useQueryClient()
  const { mutate: deleteWebhook } = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`http://localhost:3333/api/webhooks/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete webhook')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['webhooks']
        // type: 'all'
      })

      // queryClient.resetQueries({ queryKey: ['webhooks'] })
    }
  })

  return (
    <div className="group rounded-lg transition-colors duration-150 hover:bg-zinc-700/30">
      <div className="flex items-start gap-3 px-4 py-2.5">
        <Checkbox
          onCheckedChange={value => {
            onWebhookChecked(webhook.id)
          }}
          checked={isWebhookChecked}
        />
        <Link
          to="/webhooks/$id"
          params={{ id: webhook.id }}
          className=" flex flex-1 min-w-0 items-start gap-2  "
        >
          <span className="w-12 shrink-0 font-mono text-xs font-semibold text-zinc-300 text-right">
            {webhook.method}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono  text-zinc-200 leading-tight truncate">
              {webhook.pathname}
            </p>
            <p className="text-xs text-zin-500 font-medium mt-1">
              {formatDistanceToNow(webhook.createdAt, { addSuffix: true })}
            </p>
          </div>
        </Link>
        <Iconbutton
          className="opacity-0 transition-opacity group-hover:opacity-100"
          icon={<Trash2Icon className="size-3.5 text-zinc-400" />}
          onClick={() => deleteWebhook(webhook.id)}
        />
      </div>
    </div>
  )
}
