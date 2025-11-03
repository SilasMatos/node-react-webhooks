import { Link } from '@tanstack/react-router'
import { Iconbutton } from './ui/icon-button'
import { formatDistanceToNow } from 'date-fns'
import { Trash2Icon } from 'lucide-react'
import { Checkbox } from './ui/checkbox'

interface WebHooksListItemProps {
  webhook: {
    id: string
    method: string
    pathname: string
    createdAt: Date
  }
}

export function WebHooksListItem({ webhook }: WebHooksListItemProps) {
  return (
    <div className="group rounded-lg transition-colors duration-150 hover:bg-zinc-700/30">
      <div className="flex items-start gap-3 px-4 py-2.5">
        <Checkbox />
        <Link to="/" className=" flex flex-1 min-w-0 items-start gap-2  ">
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
        />
      </div>
    </div>
  )
}
