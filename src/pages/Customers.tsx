import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Mail, Phone, Star } from 'lucide-react';
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
    if (points >= 2000) return { tier: 'Platin', color: 'text-purple-600 bg-purple-50' };
    if (points >= 1000) return { tier: 'Gold', color: 'text-amber-600 bg-amber-50' };
    if (points >= 500) return { tier: 'Silber', color: 'text-gray-600 bg-gray-100' };
    return { tier: 'Bronze', color: 'text-orange-600 bg-orange-50' };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-gray-900">Kunden</h1>
          <p className="text-gray-500 mt-1">{customers.length} registrierte Kunden</p>
        </div>
        <button
          onClick={() => { setEditingCustomer(null); setShowModal(true); }}
          className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Neuer Kunde
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Kunden suchen (Name, E-Mail, Telefon)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCustomers.map((customer) => {
          const loyalty = getLoyaltyTier(customer.loyaltyPoints);
          return (
            <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-amber-700 font-semibold text-lg">
                      {customer.firstName[0]}{customer.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${loyalty.color}`}>
                        {loyalty.tier}
                      </span>
                      <span className="text-sm text-gray-500">
                        {customer.loyaltyPoints} Punkte
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditingCustomer(customer); setShowModal(true); }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteCustomer(customer.id)}
                    className="p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${customer.email}`} className="hover:text-amber-600">
                    {customer.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${customer.phone}`} className="hover:text-amber-600">
                    {customer.phone}
                  </a>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                <span className="text-gray-500">Gesamtumsatz</span>
                <span className="font-semibold text-gray-900">
                  €{customer.totalPurchases.toLocaleString('de-DE')}
                </span>
              </div>

              {customer.notes && (
                <div className="mt-3 p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-800">{customer.notes}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Keine Kunden gefunden</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(new FormData(e.currentTarget)); }}>
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingCustomer ? 'Kunde bearbeiten' : 'Neuer Kunde'}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vorname</label>
                    <input
                      name="firstName"
                      defaultValue={editingCustomer?.firstName}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nachname</label>
                    <input
                      name="lastName"
                      defaultValue={editingCustomer?.lastName}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={editingCustomer?.email}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input
                    name="phone"
                    defaultValue={editingCustomer?.phone}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    name="address"
                    defaultValue={editingCustomer?.address}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notizen</label>
                  <textarea
                    name="notes"
                    defaultValue={editingCustomer?.notes}
                    rows={3}
                    placeholder="Vorlieben, wichtige Informationen..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingCustomer(null); }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
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
