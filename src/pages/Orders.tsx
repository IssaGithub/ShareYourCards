import { useState } from 'react';
import { Search, ChevronDown, Package } from 'lucide-react';
import { useStore } from '../store/useStore';

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Ausstehend', color: 'bg-amber-100 text-amber-700' },
  confirmed: { label: 'Bestätigt', color: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'In Arbeit', color: 'bg-violet-100 text-violet-700' },
  completed: { label: 'Fertig', color: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'Storniert', color: 'bg-neutral-100 text-neutral-500' },
};

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
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight text-neutral-900">Aufträge</h1>
        <p className="text-neutral-400 text-sm mt-1">{orders.length} insgesamt</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              !statusFilter ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-600'
            }`}
          >
            Alle
          </button>
          {Object.entries(statusConfig).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === key ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => {
          const customer = customers.find(c => c.id === order.customerId);
          const status = statusConfig[order.status];
          const isExpanded = expandedOrder === order.id;

          return (
            <div key={order.id} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-lg hover:shadow-neutral-100 transition-all duration-300">
              <button
                className="w-full p-5 flex items-center justify-between text-left"
                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-neutral-500" strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold text-neutral-900">{order.id}</span>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-400 mt-0.5">
                      {customer?.firstName} {customer?.lastName} · {new Date(order.createdAt).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <span className="text-lg font-semibold text-neutral-900">
                    €{order.totalAmount.toLocaleString('de-DE')}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-neutral-100 pt-5 space-y-4">
                  {/* Items */}
                  <div className="space-y-2">
                    {order.items.map((item, index) => {
                      const product = products.find(p => p.id === item.productId);
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                          {product?.image && (
                            <img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-900 text-sm">{product?.name || 'Produkt'}</p>
                            {item.customization && (
                              <p className="text-xs text-neutral-500 mt-0.5">{item.customization}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-neutral-900 text-sm">€{item.price.toLocaleString('de-DE')}</p>
                            <p className="text-xs text-neutral-400">×{item.quantity}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {order.notes && (
                    <div className="p-3 bg-amber-50 rounded-xl">
                      <p className="text-sm text-amber-700">{order.notes}</p>
                    </div>
                  )}

                  {/* Status Update */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-500">Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as typeof order.status)}
                        className="px-3 py-1.5 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      >
                        {Object.entries(statusConfig).map(([key, { label }]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-neutral-400">
                      {new Date(order.updatedAt).toLocaleString('de-DE')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-20">
          <p className="text-neutral-400">Keine Aufträge gefunden</p>
        </div>
      )}
    </div>
  );
}
