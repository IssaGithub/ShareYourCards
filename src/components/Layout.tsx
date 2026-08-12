import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Gem, 
  Users, 
  ShoppingBag, 
  Settings, 
  Calendar,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Übersicht' },
  { to: '/products', icon: Gem, label: 'Kollektion' },
  { to: '/customers', icon: Users, label: 'Kunden' },
  { to: '/orders', icon: ShoppingBag, label: 'Aufträge' },
  { to: '/repairs', icon: Settings, label: 'Service' },
  { to: '/appointments', icon: Calendar, label: 'Termine' },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-100 px-5 py-4 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight">Aurum</span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-neutral-100 transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-7 py-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-900 flex items-center justify-center">
                <Gem className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">Aurum</h1>
                <p className="text-[11px] text-neutral-400 uppercase tracking-widest">Juwelier</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-neutral-900 text-white' 
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                  }
                `}
              >
                <item.icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="p-4 mt-auto">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800">
              <p className="text-white/60 text-xs mb-1">Premium</p>
              <p className="text-white text-sm font-medium">Alle Features aktiv</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:pl-[280px] min-h-screen">
        {/* Top bar */}
        <div className="hidden lg:flex items-center justify-end gap-3 px-8 py-5 border-b border-neutral-100 bg-white/50 backdrop-blur-xl sticky top-0 z-30">
          <button className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors">
            <Bell className="w-[18px] h-[18px] text-neutral-600" strokeWidth={1.8} />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center text-amber-900 text-sm font-semibold">
            JM
          </div>
        </div>
        
        <div className="p-6 lg:p-10 pt-24 lg:pt-8 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
