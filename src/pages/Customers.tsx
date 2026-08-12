import { useState } from 'react';
import { Plus, Search, MoreHorizontal, Edit2, Trash2, Mail, Phone, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Customer } from '../types';

export function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filteredCustomers = customers.filter((customer) => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           customer.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSave = (formData: FormData) => {
    const customerData: Customer = {
      id: editingCustomer?.id || Date.now().toString(),
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      notes: formData.get('notes') as string,
      createdAt: editingCustomer?.createdAt || new Date(),
      totalPurchases: editingCustomer?.totalPurchases || 0,
      loyaltyPoints: editingCustomer?.loyaltyPoints || 0,
    };

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, customerData);
    } else {
      addCustomer(customerData);
    }
    setShowModal(false);
    setEditingCustomer(null);
  };

  const getTier = (points: number) => {
    if (points >= 2000) return { name: 'Platin', color: 'bg-neutral-900 text-white' };
    if (points >= 1000) return { name: 'Gold', color: 'bg-amber-100 text-amber-700' };
    if (points >= 500) return { name: 'Silber', color: 'bg-neutral-200 text-neutral-700' };
    return { name: 'Bronze', color: 'bg-orange-100 text-orange-700' };
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-neutral-900">Kunden</h1>
          <p className="text-neutral-400 text-sm mt-1">{customers.length} registriert</p>
        </div>
        <button
          onClick={() => { setEditingCustomer(null); setShowModal(true); }}
          className="inline-flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Hinzufügen
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm transition-shadow"
        />
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => {
          const tier = getTier(customer.loyaltyPoints);
          return (
            <div key={customer.id} className="bg-white rounded-2xl border border-neutral-100 p-5 hover:shadow-lg hover:shadow-neutral-100 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                    <span className="text-neutral-600 font-semibold">
                      {customer.firstName[0]}{customer.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${tier.color}`}>
                      {tier.name}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setActiveMenu(activeMenu === customer.id ? null : customer.id)}
                    className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                  </button>
                  {activeMenu === customer.id && (
                    <div className="absolute top-9 right-0 bg-white rounded-xl shadow-lg border border-neutral-100 py-1 min-w-[140px] z-10">
                      <button
                        onClick={() => { setEditingCustomer(customer); setShowModal(true); setActiveMenu(null); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
                      >
                        <Edit2 className="w-4 h-4" />
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => { deleteCustomer(customer.id); setActiveMenu(null); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Löschen
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <a href={`mailto:${customer.email}`} className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  <Mail className="w-4 h-4" />
                  {customer.email}
                </a>
                <a href={`tel:${customer.phone}`} className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  <Phone className="w-4 h-4" />
                  {customer.phone}
                </a>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-400">Umsatz</p>
                  <p className="font-semibold text-neutral-900">€{customer.totalPurchases.toLocaleString('de-DE')}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-400">Punkte</p>
                  <p className="font-semibold text-neutral-900">{customer.loyaltyPoints}</p>
                </div>
              </div>

              {customer.notes && (
                <div className="mt-4 p-3 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-500">{customer.notes}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-20">
          <p className="text-neutral-400">Keine Kunden gefunden</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(new FormData(e.currentTarget)); }}>
              <div className="flex items-center justify-between p-5 border-b border-neutral-100">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {editingCustomer ? 'Bearbeiten' : 'Neuer Kunde'}
                </h2>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingCustomer(null); }}
                  className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Vorname</label>
                    <input
                      name="firstName"
                      defaultValue={editingCustomer?.firstName}
                      required
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Nachname</label>
                    <input
                      name="lastName"
                      defaultValue={editingCustomer?.lastName}
                      required
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">E-Mail</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={editingCustomer?.email}
                    required
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Telefon</label>
                  <input
                    name="phone"
                    defaultValue={editingCustomer?.phone}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Adresse</label>
                  <input
                    name="address"
                    defaultValue={editingCustomer?.address}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Notizen</label>
                  <textarea
                    name="notes"
                    defaultValue={editingCustomer?.notes}
                    rows={2}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm resize-none"
                  />
                </div>
              </div>
              <div className="p-5 border-t border-neutral-100 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingCustomer(null); }}
                  className="px-5 py-2.5 text-neutral-600 hover:text-neutral-900 text-sm font-medium"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 text-sm font-medium"
                >
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
