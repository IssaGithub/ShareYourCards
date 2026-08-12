import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Mail, Phone, Crown, Users } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Customer } from '../types';

export function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((customer) => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customer.phone.includes(searchTerm);
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

  const getLoyaltyTier = (points: number) => {
    if (points >= 2000) return { tier: 'Platin', color: 'from-slate-400 to-slate-600', bgColor: 'bg-slate-100 text-slate-700' };
    if (points >= 1000) return { tier: 'Gold', color: 'from-amber-400 to-amber-600', bgColor: 'bg-amber-100 text-amber-700' };
    if (points >= 500) return { tier: 'Silber', color: 'from-slate-300 to-slate-400', bgColor: 'bg-slate-100 text-slate-600' };
    return { tier: 'Bronze', color: 'from-orange-400 to-orange-600', bgColor: 'bg-orange-100 text-orange-700' };
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Kunden</h1>
          <p className="text-slate-500 mt-1">{customers.length} registrierte Kunden</p>
        </div>
        <button
          onClick={() => { setEditingCustomer(null); setShowModal(true); }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          Neuer Kunde
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Kunden suchen (Name, E-Mail, Telefon)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => {
          const loyalty = getLoyaltyTier(customer.loyaltyPoints);
          return (
            <div key={customer.id} className="group bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${loyalty.color} flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-lg">
                      {customer.firstName[0]}{customer.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Crown className="w-4 h-4 text-amber-500" />
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${loyalty.bgColor}`}>
                        {loyalty.tier}
                      </span>
                      <span className="text-sm text-slate-500">
                        {customer.loyaltyPoints} Punkte
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditingCustomer(customer); setShowModal(true); }}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-slate-500" />
                  </button>
                  <button
                    onClick={() => deleteCustomer(customer.id)}
                    className="p-2 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <a href={`mailto:${customer.email}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-violet-600 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  {customer.email}
                </a>
                <a href={`tel:${customer.phone}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-violet-600 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  {customer.phone}
                </a>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-sm text-slate-500">Gesamtumsatz</span>
                <span className="text-lg font-bold text-slate-900">
                  €{customer.totalPurchases.toLocaleString('de-DE')}
                </span>
              </div>

              {customer.notes && (
                <div className="mt-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100">
                  <p className="text-sm text-violet-700">{customer.notes}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">Keine Kunden gefunden</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(new FormData(e.currentTarget)); }}>
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingCustomer ? 'Kunde bearbeiten' : 'Neuer Kunde'}
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Vorname</label>
                    <input
                      name="firstName"
                      defaultValue={editingCustomer?.firstName}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nachname</label>
                    <input
                      name="lastName"
                      defaultValue={editingCustomer?.lastName}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">E-Mail</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={editingCustomer?.email}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Telefon</label>
                  <input
                    name="phone"
                    defaultValue={editingCustomer?.phone}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Adresse</label>
                  <input
                    name="address"
                    defaultValue={editingCustomer?.address}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Notizen</label>
                  <textarea
                    name="notes"
                    defaultValue={editingCustomer?.notes}
                    rows={3}
                    placeholder="Vorlieben, wichtige Informationen..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 flex gap-3 justify-end bg-slate-50">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingCustomer(null); }}
                  className="px-5 py-2.5 text-slate-600 hover:text-slate-900 font-medium rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all font-medium"
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
