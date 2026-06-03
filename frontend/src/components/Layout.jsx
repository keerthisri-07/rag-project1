import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Wifi, WifiOff, Menu, X } from 'lucide-react'
import Sidebar from './Sidebar'
import { getStatus } from '../services/api'

const pageTitles = {
  '/': 'Dashboard',
  '/documents': 'Document Manager',
  '/chat': 'Assistant Chat',
  '/history': 'Chat History',
  '/learning': 'Learning Hub',
  '/evaluation': 'Evaluation',
}

export default function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [systemOnline, setSystemOnline] = useState(false)
  const [statusChecking, setStatusChecking] = useState(true)
  const location = useLocation()

  // Determine page title
  const getPageTitle = () => {
    for (const [path, title] of Object.entries(pageTitles)) {
      if (path === '/' && location.pathname === '/') return title
      if (path !== '/' && location.pathname.startsWith(path)) return title
    }
    return 'Dashboard'
  }

  // Check system status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        setStatusChecking(true)
        const res = await getStatus()
        setSystemOnline(res.data?.status === 'online' || res.status === 200)
      } catch {
        setSystemOnline(false)
      } finally {
        setStatusChecking(false)
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const sidebarWidth = sidebarCollapsed ? 72 : 260

  return (
    <div className="min-h-screen bg-navy-950 font-inter">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - desktop */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Sidebar - mobile */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main Content */}
      <div
        className="transition-all duration-300 min-h-screen"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-navy-950/80 border-b border-navy-500/30">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Page Title */}
            <div>
              <h2 className="text-lg font-semibold text-white">{getPageTitle()}</h2>
            </div>

            {/* System Status */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                statusChecking
                  ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  : systemOnline
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              {statusChecking ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="hidden sm:inline">Checking...</span>
                </>
              ) : systemOnline ? (
                <>
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
                  </div>
                  <span className="hidden sm:inline">System Online</span>
                  <Wifi className="w-3.5 h-3.5 sm:hidden" />
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="hidden sm:inline">System Offline</span>
                  <WifiOff className="w-3.5 h-3.5 sm:hidden" />
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 animate-fade-in">
          {children}
        </main>
      </div>

      {/* Mobile bottom margin fix */}
      <style>{`
        @media (max-width: 1023px) {
          .min-h-screen > div:last-of-type:not(.fixed) {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
