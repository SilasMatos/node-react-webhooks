import { createFileRoute } from '@tanstack/react-router'

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Sidebar } from '../components/sidebar'
export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="h-screen bg-zinc-900 ">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={20} minSize={15} maxSize={40} className="bg-zinc-800">
            <Sidebar />
          </Panel>
          <PanelResizeHandle className="bg-zinc-700 w-px cursor-col-resize hover:bg-zinc-600 transition-colors duration-150" />
          <Panel defaultSize={80} minSize={60} className="bg-zinc-900">
            <div className="p-4 text-zinc-200">Main Content Area</div>
          </Panel>
        </PanelGroup>
    </div>
  )
}
