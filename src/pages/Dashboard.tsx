import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Wrench, 
  Calendar,
  Euro,
  Package,
  Clock
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
      label: 'Umsatz (abgeschlossen)', 
      value: `€${totalRevenue.toLocaleString('de-DE')}`, 
      icon: Euro, 
      color: 'bg-green-500',
      lightColor: 'bg-green-50'
    },
    { 
      label: 'Aktive Kunden', 
      value: customers.length, 
      icon: Users, 
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50'
    },
    { 
      label: 'Offene Bestellungen', 
      value: pendingOrders, 
      icon: ShoppingCart, 
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50'
    },
    { 
      label: 'Aktive Reparaturen', 
      value: activeRepairs, 
      icon: Wrench, 
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50'
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Willkommen zurück! Hier ist Ihre Übersicht.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.lightColor} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 text-gray-700`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900">Heutige Termine</h2>
            <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded-full">
              {todayAppointments} Termine
            </span>
          </div>
          <div className="space-y-3">
            {appointments
              .filter(a => a.status === 'scheduled')
              .slice(0, 5)
              .map((apt) => {
                const customer = customers.find(c => c.id === apt.customerId);
                return (
                  <div key={apt.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {customer?.firstName} {customer?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{apt.notes}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{apt.time}</p>
                      <p className="text-sm text-gray-500">{apt.duration} Min.</p>
                    </div>
                  </div>
                );
              })}
            {appointments.filter(a => a.status === 'scheduled').length === 0 && (
              <p className="text-gray-500 text-center py-4">Keine Termine geplant</p>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">Niedriger Bestand</h2>
            <span className="ml-auto bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
              {lowStockProducts.length} Produkte
            </span>
          </div>
          <div className="space-y-3">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${product.stock <= 2 ? 'text-red-600' : 'text-amber-600'}`}>
                    {product.stock} Stück
                  </p>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <p className="text-gray-500 text-center py-4">Alle Produkte ausreichend vorrätig</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Letzte Bestellungen</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium">Bestellung</th>
                <th className="pb-3 font-medium">Kunde</th>
                <th className="pb-3 font-medium">Betrag</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.slice(0, 5).map((order) => {
                const customer = customers.find(c => c.id === order.customerId);
                const statusColors: Record<string, string> = {
                  pending: 'bg-yellow-100 text-yellow-700',
                  confirmed: 'bg-blue-100 text-blue-700',
                  in_progress: 'bg-purple-100 text-purple-700',
                  completed: 'bg-green-100 text-green-700',
                  cancelled: 'bg-red-100 text-red-700',
                };
                const statusLabels: Record<string, string> = {
                  pending: 'Ausstehend',
                  confirmed: 'Bestätigt',
                  in_progress: 'In Bearbeitung',
                  completed: 'Abgeschlossen',
                  cancelled: 'Storniert',
                };
                return (
                  <tr key={order.id} className="text-sm">
                    <td className="py-3 font-medium text-gray-900">{order.id}</td>
                    <td className="py-3 text-gray-600">
                      {customer?.firstName} {customer?.lastName}
                    </td>
                    <td className="py-3 text-gray-900 font-medium">
                      €{order.totalAmount.toLocaleString('de-DE')}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">
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
