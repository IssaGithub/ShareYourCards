import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Wrench, 
  Calendar,
  Euro,
  Package,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useStore } from '../store/useStore';

export function Dashboard() {
  const { products, customers, orders, repairOrders, appointments } = useStore();
  
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'in_progress').length;
  const activeRepairs = repairOrders.filter(r => r.status !== 'delivered' && r.status !== 'completed').length;
  const todayAppointments = appointments.filter(a => {
    const today = new Date();
    const aptDate = new Date(a.date);
    return aptDate.toDateString() === today.toDateString() && a.status === 'scheduled';
  }).length;
  
  const lowStockProducts = products.filter(p => p.stock < 5);

  const stats = [
    { 
      label: 'Gesamtumsatz', 
      value: `€${totalRevenue.toLocaleString('de-DE')}`, 
      icon: Euro, 
      change: '+12.5%',
      positive: true,
      gradient: 'from-emerald-500 to-teal-600'
    },
    { 
      label: 'Aktive Kunden', 
      value: customers.length, 
      icon: Users, 
      change: '+3',
      positive: true,
      gradient: 'from-blue-500 to-cyan-600'
    },
    { 
      label: 'Offene Bestellungen', 
      value: pendingOrders, 
      icon: ShoppingCart, 
      change: pendingOrders > 0 ? `${pendingOrders} offen` : 'Keine',
      positive: pendingOrders === 0,
      gradient: 'from-violet-500 to-purple-600'
    },
    { 
      label: 'Aktive Reparaturen', 
      value: activeRepairs, 
      icon: Wrench, 
      change: `${activeRepairs} in Arbeit`,
      positive: true,
      gradient: 'from-orange-500 to-amber-600'
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Willkommen zurück! Hier ist Ihre aktuelle Übersicht.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  stat.positive ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                }`}>
                  {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">Heutige Termine</h2>
                  <p className="text-xs text-slate-500">{todayAppointments} Termine geplant</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {appointments
              .filter(a => a.status === 'scheduled')
              .slice(0, 4)
              .map((apt) => {
                const customer = customers.find(c => c.id === apt.customerId);
                return (
                  <div key={apt.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex flex-col items-center justify-center border border-slate-200">
                      <span className="text-lg font-bold text-slate-900">{apt.time.split(':')[0]}</span>
                      <span className="text-xs text-slate-400">{apt.time.split(':')[1]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {customer?.firstName} {customer?.lastName}
                      </p>
                      <p className="text-sm text-slate-500 truncate">{apt.notes}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-violet-100 text-violet-700">
                        {apt.duration} Min
                      </span>
                    </div>
                  </div>
                );
              })}
            {appointments.filter(a => a.status === 'scheduled').length === 0 && (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500">Keine Termine geplant</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">Niedriger Bestand</h2>
                  <p className="text-xs text-slate-500">{lowStockProducts.length} Produkte nachbestellen</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {lowStockProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-14 h-14 rounded-xl object-cover shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{product.name}</p>
                  <p className="text-sm text-slate-500 capitalize">{product.category}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                  product.stock <= 2 
                    ? 'bg-rose-100 text-rose-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {product.stock} Stk.
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500">Alle Produkte ausreichend vorrätig</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Letzte Bestellungen</h2>
              <p className="text-xs text-slate-500">Aktuelle Transaktionen</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Bestellung</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Kunde</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Betrag</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((order) => {
                const customer = customers.find(c => c.id === order.customerId);
                const statusStyles: Record<string, string> = {
                  pending: 'bg-amber-100 text-amber-700',
                  confirmed: 'bg-blue-100 text-blue-700',
                  in_progress: 'bg-violet-100 text-violet-700',
                  completed: 'bg-emerald-100 text-emerald-700',
                  cancelled: 'bg-slate-100 text-slate-700',
                };
                const statusLabels: Record<string, string> = {
                  pending: 'Ausstehend',
                  confirmed: 'Bestätigt',
                  in_progress: 'In Bearbeitung',
                  completed: 'Abgeschlossen',
                  cancelled: 'Storniert',
                };
                return (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-slate-900">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                          {customer?.firstName[0]}{customer?.lastName[0]}
                        </div>
                        <span className="text-sm text-slate-700">{customer?.firstName} {customer?.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900">€{order.totalAmount.toLocaleString('de-DE')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusStyles[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('de-DE')}
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
