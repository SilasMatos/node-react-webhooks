import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { WebHooksListItem } from './webhooks-list-item'
import { webhookListSchema } from '../http/schemas/webhooks'
import { Loader2, Wand2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { CodeBlock } from './ui/code-block'

export function WebhooksList() {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver>(null)
  const [generatedHandlerCode, setGeneratedHandlerCode] = useState<
    string | null
  >(null)
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

  async function handleGenerateHandler() {
    const response = await fetch('http://localhost:3333/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        webhookIds: checkedWebhooksIds
      })
    })

    type GenerateResponse = {
      code: string
    }

    const data: GenerateResponse = await response.json()

    setGeneratedHandlerCode(data.code)
  }

  const hasAnyWebhooks = checkedWebhooksIds.length > 0

  return (
    <>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-600 hover:scrollbar-thumb-zinc-500 ">
        <div className=" space-y-1 p-2">
          <button
            disabled={!hasAnyWebhooks}
            onClick={handleGenerateHandler}
            className="w-full bg-teal-400 text-white rounded-lg mb-3 disabled:opacity-50 flex justify-center items-center py-2 gap-3 font-medium text-sm "
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

      {!!generatedHandlerCode && (
        <Dialog.Root defaultOpen>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 z-20" />

          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 p-6 rounded-lg w-[90vw] max-w-3xl z-30 shadow-lg shadow-black/25">
            <Dialog.Title className="text-xl font-bold mb-4">
              Generated Handler Code
            </Dialog.Title>
            <pre className="bg-zinc-800 p-4 rounded-lg overflow-x-auto max-h-[70vh]">
              <CodeBlock language="typescript" code={generatedHandlerCode} />
            </pre>
            <div className="mt-4 flex justify-end">
              <Dialog.Close
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors bg-"
                onClick={() => setGeneratedHandlerCode(null)}
              >
                Close
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </>
  )
}
