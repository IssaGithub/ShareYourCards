import { useState } from 'react';
import { Plus, Search, Wrench, Clock, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { RepairOrder } from '../types';

const statusOptions = [
  { value: 'received', label: 'Eingegangen', color: 'bg-gray-100 text-gray-700', icon: Clock },
  { value: 'diagnosing', label: 'Diagnose', color: 'bg-blue-100 text-blue-700', icon: Wrench },
  { value: 'repairing', label: 'In Reparatur', color: 'bg-purple-100 text-purple-700', icon: Wrench },
  { value: 'completed', label: 'Fertig', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'delivered', label: 'Ausgeliefert', color: 'bg-amber-100 text-amber-700', icon: CheckCircle },
];

export function Repairs() {
  const { repairOrders, customers, addRepairOrder, updateRepairOrderStatus } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filteredRepairs = repairOrders.filter((repair) => {
    const customer = customers.find(c => c.id === repair.customerId);
    const customerName = customer ? `${customer.firstName} ${customer.lastName}`.toLowerCase() : '';
    const matchesSearch = repair.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repair.itemDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customerName.includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || repair.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSave = (formData: FormData) => {
    const repairData: RepairOrder = {
      id: `REP-${String(repairOrders.length + 1).padStart(3, '0')}`,
      customerId: formData.get('customerId') as string,
      itemDescription: formData.get('itemDescription') as string,
      issue: formData.get('issue') as string,
      status: 'received',
      estimatedCost: parseFloat(formData.get('estimatedCost') as string) || 0,
      receivedAt: new Date(),
      estimatedCompletion: new Date(formData.get('estimatedCompletion') as string),
      notes: formData.get('notes') as string,
    };
    addRepairOrder(repairData);
    setShowModal(false);
  };

  const getProgressPercentage = (status: string) => {
    const stages = ['received', 'diagnosing', 'repairing', 'completed', 'delivered'];
    const index = stages.indexOf(status);
    return ((index + 1) / stages.length) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-gray-900">Reparaturen</h1>
          <p className="text-gray-500 mt-1">{repairOrders.length} Reparaturaufträge</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Neue Reparatur
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Reparatur suchen..."
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

      {/* Repairs List */}
      <div className="space-y-4">
        {filteredRepairs.map((repair) => {
          const customer = customers.find(c => c.id === repair.customerId);
          const status = statusOptions.find(s => s.value === repair.status);
          const progress = getProgressPercentage(repair.status);

          return (
            <div key={repair.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{repair.id}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status?.color}`}>
                        {status?.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {customer?.firstName} {customer?.lastName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ~€{repair.estimatedCost.toLocaleString('de-DE')}
                  </p>
                  <p className="text-xs text-gray-500">geschätzte Kosten</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  {statusOptions.map((s, i) => (
                    <div key={s.value} className="flex flex-col items-center">
                      <s.icon className={`w-4 h-4 ${
                        statusOptions.findIndex(opt => opt.value === repair.status) >= i
                          ? 'text-amber-500'
                          : 'text-gray-300'
                      }`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Artikel</p>
                  <p className="font-medium text-gray-900">{repair.itemDescription}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Problem</p>
                  <p className="font-medium text-gray-900">{repair.issue}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Eingegangen</p>
                  <p className="font-medium text-gray-900">
                    {new Date(repair.receivedAt).toLocaleDateString('de-DE')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Geschätzte Fertigstellung</p>
                  <p className="font-medium text-gray-900">
                    {new Date(repair.estimatedCompletion).toLocaleDateString('de-DE')}
                  </p>
                </div>
              </div>

              {repair.notes && (
                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                  <p className="text-sm text-gray-600">{repair.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <label className="text-sm font-medium text-gray-700">Status ändern:</label>
                <select
                  value={repair.status}
                  onChange={(e) => updateRepairOrderStatus(repair.id, e.target.value as RepairOrder['status'])}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {statusOptions.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRepairs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Keine Reparaturen gefunden</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(new FormData(e.currentTarget)); }}>
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Neue Reparatur</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kunde</label>
                  <select
                    name="customerId"
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Kunde auswählen...</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Artikelbeschreibung</label>
                  <input
                    name="itemDescription"
                    required
                    placeholder="z.B. Goldkette 18K, Damenarmbanduhr..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Problem / Reparaturbedarf</label>
                  <textarea
                    name="issue"
                    required
                    rows={3}
                    placeholder="Beschreiben Sie das Problem..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Geschätzte Kosten (€)</label>
                    <input
                      name="estimatedCost"
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Geschätzte Fertigstellung</label>
                    <input
                      name="estimatedCompletion"
                      type="date"
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notizen</label>
                  <textarea
                    name="notes"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
