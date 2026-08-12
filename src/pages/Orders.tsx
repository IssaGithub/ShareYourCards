import { useState } from 'react';
import { Search, ChevronDown, Package } from 'lucide-react';
import { useStore } from '../store/useStore';

const statusOptions = [
  { value: 'pending', label: 'Ausstehend', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'confirmed', label: 'Bestätigt', color: 'bg-blue-100 text-blue-700' },
  { value: 'in_progress', label: 'In Bearbeitung', color: 'bg-purple-100 text-purple-700' },
  { value: 'completed', label: 'Abgeschlossen', color: 'bg-green-100 text-green-700' },
  { value: 'cancelled', label: 'Storniert', color: 'bg-red-100 text-red-700' },
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-gray-900">Bestellungen</h1>
        <p className="text-gray-500 mt-1">{orders.length} Bestellungen insgesamt</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Bestellung oder Kunde suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
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
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{order.id}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status?.color}`}>
                          {status?.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {customer?.firstName} {customer?.lastName} • {new Date(order.createdAt).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-900">
                      €{order.totalAmount.toLocaleString('de-DE')}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="pt-4 space-y-4">
                    {/* Order Items */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Artikel</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => {
                          const product = products.find(p => p.id === item.productId);
                          return (
                            <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                              {product?.image && (
                                <img src={product.image} alt="" className="w-10 h-10 rounded object-cover" />
                              )}
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {product?.name || 'Unbekanntes Produkt'}
                                </p>
                                {item.customization && (
                                  <p className="text-xs text-amber-600">{item.customization}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">€{item.price.toLocaleString('de-DE')}</p>
                                <p className="text-xs text-gray-500">x{item.quantity}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Notizen</h4>
                        <p className="text-sm text-gray-600 p-2 bg-amber-50 rounded-lg">{order.notes}</p>
                      </div>
                    )}

                    {/* Status Update */}
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mr-2">Status ändern:</label>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as typeof order.status)}
                          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          {statusOptions.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                      <p className="text-xs text-gray-500">
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
        <div className="text-center py-12">
          <p className="text-gray-500">Keine Bestellungen gefunden</p>
        </div>
      )}
    </div>
  );
}
