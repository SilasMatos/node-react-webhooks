
import { Link } from "@tanstack/react-router"
import { Iconbutton } from "./ui/icon-button"
import { Trash2Icon } from "lucide-react"
export function WebHooksListItem() {
  return (
    <div className="group rounded-lg transition-colors duration-150 hover:bg-zinc-700/30">
        <div className="flex items-start gap-3 px-4 py-2.5">
        
        <Link to="/" className=" flex flex-1 min-w-0 items-start gap-2  ">
          <span className="w-12 shrink-0 font-mono text-xs font-semibold text-zinc-300 text-right">POST</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono  text-zinc-200 leading-tight truncate">/video/status </p>
            <p className="text-xs text-zin-500 font-medium mt-1">
              1 min ago
            </p>
          </div>
        </Link>
        <Iconbutton className="opacity-0 transition-opacity group-hover:opacity-100" icon={<Trash2Icon className="size-3.5 text-zinc-400"/>} />
        </div>
    </div>
  )
}


