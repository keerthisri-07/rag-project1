import { Sun, Moon } from 'lucide-react'
import { useState } from 'react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  const toggle = () => {
    setIsDark(!isDark)
    // Note: This is a UI-only toggle since the app is designed for dark mode
    // Full theme switching would require a ThemeContext
  }

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}
