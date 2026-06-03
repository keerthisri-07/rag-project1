import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  History,
  GraduationCap,
  BarChart3,
  Cloud,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/documents', label: 'Document Manager', icon: FileText },
  { path: '/chat', label: 'Assistant Chat', icon: MessageSquare },
  { path: '/history', label: 'Chat History', icon: History },
  { path: '/learning', label: 'Learning Hub', icon: GraduationCap },
  { path: '/evaluation', label: 'Evaluation', icon: BarChart3 },
]

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation()

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
      style={{
        background: 'linear-gradient(180deg, #0b1121 0%, #0a0e1a 100%)',
        borderRight: '1px solid rgba(30, 41, 59, 0.5)',
      }}
    >
      {/* Logo Area */}
      <div className="px-5 py-6 border-b border-navy-500/50">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-navy-900" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-bold leading-tight">
                <span className="text-white">Cloud</span>
                <span className="gradient-text">RAG</span>
                <span className="text-white"> AI</span>
              </h1>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-cyan-400/70 uppercase">
                Learning Assistant
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path)

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
              )}

              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                  isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'
                }`}
              />

              {!collapsed && (
                <span
                  className={`text-sm font-medium truncate transition-colors duration-200 ${
                    isActive ? 'text-cyan-400' : ''
                  }`}
                >
                  {item.label}
                </span>
              )}

              {/* Tooltip for collapsed mode */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-navy-600 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-navy-500">
                  {item.label}
                </div>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 py-2 border-t border-navy-500/50">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all duration-200"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* Version */}
      {!collapsed && (
        <div className="px-5 py-3 border-t border-navy-500/50">
          <p className="text-[10px] text-gray-600 font-medium">CloudRAG v1.0</p>
        </div>
      )}
    </aside>
  )
}
