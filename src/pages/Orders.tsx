import { useState } from 'react';
import { Search, ChevronDown, Package, ShoppingCart } from 'lucide-react';
import { useStore } from '../store/useStore';

const statusOptions = [
  { value: 'pending', label: 'Ausstehend', color: 'bg-amber-100 text-amber-700' },
  { value: 'confirmed', label: 'Bestätigt', color: 'bg-blue-100 text-blue-700' },
  { value: 'in_progress', label: 'In Bearbeitung', color: 'bg-violet-100 text-violet-700' },
  { value: 'completed', label: 'Abgeschlossen', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'cancelled', label: 'Storniert', color: 'bg-slate-100 text-slate-500' },
];

export function Orders() {
  const { orders, customers, products, updateOrderStatus } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const customer = customers.find(c => c.id === order.customerId);
    const customerName = customer ? `${customer.firstName} ${customer.lastName}`.toLowerCase() : '';
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customerName.includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Bestellungen</h1>
        <p className="text-slate-500 mt-1">{orders.length} Bestellungen insgesamt</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Bestellung oder Kunde suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent cursor-pointer"
        >
          <option value="">Alle Status</option>
          {statusOptions.map((status) => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const customer = customers.find(c => c.id === order.customerId);
          const status = statusOptions.find(s => s.value === order.status);
          const isExpanded = expandedOrder === order.id;

          return (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-900">{order.id}</span>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status?.color}`}>
                          {status?.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {customer?.firstName} {customer?.lastName} • {new Date(order.createdAt).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xl font-bold text-slate-900">
                      €{order.totalAmount.toLocaleString('de-DE')}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-slate-100">
                  <div className="pt-5 space-y-5">
                    {/* Order Items */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-3">Artikel</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => {
                          const product = products.find(p => p.id === item.productId);
                          return (
                            <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                              {product?.image && (
                                <img src={product.image} alt="" className="w-14 h-14 rounded-xl object-cover shadow-sm" />
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-slate-900">
                                  {product?.name || 'Unbekanntes Produkt'}
                                </p>
                                {item.customization && (
                                  <p className="text-sm text-violet-600 mt-0.5">{item.customization}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-slate-900">€{item.price.toLocaleString('de-DE')}</p>
                                <p className="text-sm text-slate-500">x{item.quantity}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">Notizen</h4>
                        <p className="text-sm text-slate-600 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100">
                          {order.notes}
                        </p>
                      </div>
                    )}

                    {/* Status Update */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-slate-700">Status ändern:</label>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as typeof order.status)}
                          className="px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                        >
                          {statusOptions.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                      <p className="text-xs text-slate-400">
                        Aktualisiert: {new Date(order.updatedAt).toLocaleString('de-DE')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-16">
          <ShoppingCart className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">Keine Bestellungen gefunden</p>
        </div>
      )}
    </div>
  );
}
