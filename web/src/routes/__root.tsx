import { createRootRoute, Outlet } from '@tanstack/react-router'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Sidebar } from '../components/sidebar'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'

const queryClient = new QueryClient()

const RootLayout = () => (
  <>
    <QueryClientProvider client={queryClient}>
      <div className="h-screen bg-zinc-900 ">
        <PanelGroup direction="horizontal">
          <Panel
            defaultSize={20}
            minSize={15}
            maxSize={40}
            className="bg-zinc-800"
          >
            <Sidebar />
          </Panel>
          <PanelResizeHandle className="bg-zinc-700 w-px cursor-col-resize hover:bg-zinc-600 transition-colors duration-150" />
          <Panel defaultSize={80} minSize={60} className="bg-zinc-900">
            <Outlet />
          </Panel>
        </PanelGroup>
      </div>
    </QueryClientProvider>
  </>
)

export const Route = createRootRoute({ component: RootLayout })
