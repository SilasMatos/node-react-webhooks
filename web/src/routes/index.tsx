import { createFileRoute } from '@tanstack/react-router'

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Sidebar } from '../components/sidebar'
import { WebhookDetailHeader } from '../components/webhook-detail-header'
import { SectionTitle } from '../components/section-title'
import { SectionDataTable } from '../components/section-data-table'
import { CodeBlock } from '../components/ui/code-block'

export const Route = createFileRoute('/')({
  component: Index,
})

interface OverviewItem {
  key: string
  value: string
}

function Index() {
  const overviewData: OverviewItem[] = [
    { key: 'Method', value: 'POST' },
    { key: 'URL', value: '/video/status' },
    { key: 'Status', value: '200 OK' },
    { key: 'Response Time', value: '120ms' },
    { key: 'IP Address', value: '222' },
  ]

  return (
    <div className="h-screen bg-zinc-900 ">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={20} minSize={15} maxSize={40} className="bg-zinc-800">
          <Sidebar />
        </Panel>
        <PanelResizeHandle className="bg-zinc-700 w-px cursor-col-resize hover:bg-zinc-600 transition-colors duration-150" />
        <Panel defaultSize={80} minSize={60} className="bg-zinc-900">
          <div className="w-full flex flex-col ">
            <WebhookDetailHeader />
            <div className='flex-1 overflow-y-auto'>
              <div className='space-y-6 p-6'>
                <div className='space-y-4'>
                   <SectionTitle>Request Overview</SectionTitle>
          
              <SectionDataTable data={overviewData} />
              <CodeBlock code={JSON.stringify(overviewData, null, 2)} />
                   </div>
                <div>

                </div>
              </div>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}