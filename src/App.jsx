import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { Dashboard } from './pages/dashboard/Dashboard'
import { Campaigns } from './pages/campaigns/Campaigns'
import { Clients } from './pages/clients/Clients'
import { BriefBuilder } from './pages/brief/BriefBuilder'
import { Settings } from './pages/settings/Settings'
import Login from './components/ui/Login'
import './index.css'

export default function App() {
  return (
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/brief" element={<BriefBuilder />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

      </Routes>
  )
}