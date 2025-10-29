import { WebHooksListItem } from './webhooks-list-item'

export function WebhooksList() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className=" space-y-1 p-2">
        <WebHooksListItem />
        <WebHooksListItem />
        <WebHooksListItem />
        <WebHooksListItem />
        <WebHooksListItem />
        <WebHooksListItem />
        <WebHooksListItem />
        <WebHooksListItem />
      </div>
    </div>
  )
}
