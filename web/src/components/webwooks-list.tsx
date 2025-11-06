import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { WebHooksListItem } from './webhooks-list-item'
import { webhookListSchema } from '../http/schemas/webhooks'
import { Loader2, Wand2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function WebhooksList() {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver>(null)

  const [checkedWebhooksIds, setCheckedWebhooksIds] = useState<string[]>([])

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ['webhooks'],
      queryFn: async ({ pageParam }) => {
        const url = new URL('http://localhost:3333/api/webhooks')

        if (pageParam) {
          url.searchParams.set('cursor', pageParam)
        }

        const respose = await fetch(url)
        const data = await respose.json()
        return webhookListSchema.parse(data)
      },
      getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
      initialPageParam: undefined as string | undefined
    })
  const webhooks = data.pages.flatMap(page => page.webhooks)

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  function handleWebhookChecked(webhookId: string) {
    if (checkedWebhooksIds.includes(webhookId)) {
      setCheckedWebhooksIds(state => {
        return state.filter(id => id !== webhookId)
      })
    } else {
      setCheckedWebhooksIds(state => [...state, webhookId])
    }
  }

  function handleGenerateHandler() {
    console.log('Generating handler for webhooks:', checkedWebhooksIds)
  }

  const hasAnyWebhooks = checkedWebhooksIds.length > 0

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-600 hover:scrollbar-thumb-zinc-500 ">
      <div className=" space-y-1 p-2">
        <button
          disabled={!hasAnyWebhooks}
          onClick={handleGenerateHandler}
          className="w-full bg-indigo-400 text-white rounded-lg mb-3 disabled:opacity-50 flex justify-center items-center py-2 gap-3 font-medium text-sm "
        >
          <Wand2 className="inline size-4 mr-2" />
          Gerar handler
        </button>

        {webhooks.map(webhook => (
          <WebHooksListItem
            key={webhook.id}
            webhook={webhook}
            onWebhookChecked={handleWebhookChecked}
            isWebhookChecked={checkedWebhooksIds.includes(webhook.id)}
          />
        ))}
      </div>
      {hasNextPage && (
        <div className="p-2" ref={loadMoreRef}>
          {isFetchingNextPage && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="size-5 text-zinc-500 animate-spin " />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
