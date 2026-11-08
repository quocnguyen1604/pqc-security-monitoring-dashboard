import { AppShell } from './components/layout/AppShell'
import { ConnectionsFeature } from './features/connections/ConnectionsFeature'
import { EventsFeature } from './features/events/EventsFeature'
import { MigrationFeature } from './features/migration/MigrationFeature'
import { OverviewFeature } from './features/overview/OverviewFeature'
import { RisksFeature } from './features/risks/RisksFeature'

function App() {
  return (
    <AppShell>
      <div className="space-y-14">
        <OverviewFeature />
        <MigrationFeature />
        <RisksFeature />
        <ConnectionsFeature />
        <EventsFeature />
        <footer className="border-t border-slate-800 py-5 text-xs leading-5 text-slate-500">
          Dashboard records are fictional and do not represent live monitoring. HNDL classifications describe potential future exposure; fallback indicators are not confirmation of an attack.
        </footer>
      </div>
    </AppShell>
  )
}

export default App
