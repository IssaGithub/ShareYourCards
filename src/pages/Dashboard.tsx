import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Clock,
  ArrowUpRight,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';

export function Dashboard() {
  const { products, customers, orders, repairOrders, appointments } = useStore();
  
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'in_progress').length;
  const activeRepairs = repairOrders.filter(r => r.status !== 'delivered' && r.status !== 'completed').length;
  
  const lowStockProducts = products.filter(p => p.stock < 5);

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div>
        <p className="text-neutral-400 text-sm mb-1">Willkommen zurück</p>
        <h1 className="text-[28px] font-semibold tracking-tight text-neutral-900">Übersicht</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" strokeWidth={1.8} />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              12%
            </span>
          </div>
          <p className="text-[26px] font-semibold text-neutral-900 tracking-tight">
            €{totalRevenue.toLocaleString('de-DE')}
          </p>
          <p className="text-neutral-400 text-sm mt-1">Umsatz</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" strokeWidth={1.8} />
            </div>
          </div>
          <p className="text-[26px] font-semibold text-neutral-900 tracking-tight">{customers.length}</p>
          <p className="text-neutral-400 text-sm mt-1">Kunden</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-amber-600" strokeWidth={1.8} />
            </div>
            {pendingOrders > 0 && (
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                {pendingOrders} offen
              </span>
            )}
          </div>
          <p className="text-[26px] font-semibold text-neutral-900 tracking-tight">{orders.length}</p>
          <p className="text-neutral-400 text-sm mt-1">Aufträge</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-violet-600" strokeWidth={1.8} />
            </div>
            {activeRepairs > 0 && (
              <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded-full">
                {activeRepairs} aktiv
              </span>
            )}
          </div>
          <p className="text-[26px] font-semibold text-neutral-900 tracking-tight">{repairOrders.length}</p>
          <p className="text-neutral-400 text-sm mt-1">Service</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Appointments */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-neutral-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-neutral-100">
            <h2 className="font-semibold text-neutral-900">Heutige Termine</h2>
            <button className="text-sm text-neutral-400 hover:text-neutral-600 flex items-center gap-1 transition-colors">
              Alle <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-neutral-50">
            {appointments
              .filter(a => a.status === 'scheduled')
              .slice(0, 4)
              .map((apt) => {
                const customer = customers.find(c => c.id === apt.customerId);
                return (
                  <div key={apt.id} className="flex items-center gap-4 p-5 hover:bg-neutral-50/50 transition-colors">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex flex-col items-center justify-center">
                      <span className="text-lg font-semibold text-neutral-900">{apt.time.split(':')[0]}</span>
                      <span className="text-[10px] text-neutral-400 uppercase">Uhr</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900">
                        {customer?.firstName} {customer?.lastName}
                      </p>
                      <p className="text-sm text-neutral-400 truncate">{apt.notes || 'Kein Kommentar'}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-full">
                        {apt.duration} min
                      </span>
                    </div>
                  </div>
                );
              })}
            {appointments.filter(a => a.status === 'scheduled').length === 0 && (
              <div className="p-12 text-center">
                <Clock className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
                <p className="text-neutral-400 text-sm">Keine Termine heute</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-neutral-100">
            <h2 className="font-semibold text-neutral-900">Niedriger Bestand</h2>
            <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
              {lowStockProducts.length}
            </span>
          </div>
          <div className="divide-y divide-neutral-50">
            {lowStockProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-neutral-50/50 transition-colors">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900 text-sm truncate">{product.name}</p>
                  <p className="text-xs text-neutral-400">{product.material}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  product.stock <= 2 
                    ? 'text-rose-600 bg-rose-50' 
                    : 'text-amber-600 bg-amber-50'
                }`}>
                  {product.stock}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <h2 className="font-semibold text-neutral-900">Letzte Aufträge</h2>
          <button className="text-sm text-neutral-400 hover:text-neutral-600 flex items-center gap-1 transition-colors">
            Alle <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wider px-5 py-4">Auftrag</th>
                <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wider px-5 py-4">Kunde</th>
                <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wider px-5 py-4">Betrag</th>
                <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wider px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {orders.slice(0, 5).map((order) => {
                const customer = customers.find(c => c.id === order.customerId);
                const statusConfig: Record<string, { label: string; class: string }> = {
                  pending: { label: 'Ausstehend', class: 'text-amber-600 bg-amber-50' },
                  confirmed: { label: 'Bestätigt', class: 'text-blue-600 bg-blue-50' },
                  in_progress: { label: 'In Arbeit', class: 'text-violet-600 bg-violet-50' },
                  completed: { label: 'Fertig', class: 'text-emerald-600 bg-emerald-50' },
                  cancelled: { label: 'Storniert', class: 'text-neutral-500 bg-neutral-100' },
                };
                const status = statusConfig[order.status];
                return (
                  <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm font-medium text-neutral-900">{order.id}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center text-neutral-600 text-xs font-medium">
                          {customer?.firstName[0]}{customer?.lastName[0]}
                        </div>
                        <span className="text-sm text-neutral-600">{customer?.firstName} {customer?.lastName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-neutral-900">€{order.totalAmount.toLocaleString('de-DE')}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${status.class}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
