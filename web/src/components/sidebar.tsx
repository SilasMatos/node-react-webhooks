import { CopyIcon } from "lucide-react";
import { Iconbutton } from "./ui/icon-button";
import { WebhooksList } from "./webwooks-list";

export function Sidebar() {
  return (
    <div className="flex flex-col h-screen ">
      <div className="border-b flex items-center justify-between border-zinc-700 px-4 py-5">
        <div className="flex items-baseline">
          <span className="font-semibold text-zinc-100">webhook</span>
          <span className="font-normal text-zinc-400">.inspect</span>
        </div>
      </div>
      <div className="flex items-center  w-full gap-2 border-b border-zinc-700 bg-zinc-800 px-4 py-2.5">
        <div className="flex-1 min-w-0 flex items-center gap-1 text-xs font-mono text-zinc-300">
        <span className="truncate">http://localhost:3333/api/capture</span>
        </div>
        <Iconbutton 
        icon={<CopyIcon className="size-4" />}
         />

      </div>
      <WebhooksList />
    </div>
  )
}