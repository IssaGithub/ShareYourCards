import { useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { RepairOrder } from '../types';

const statusConfig: Record<string, { label: string; color: string }> = {
  received: { label: 'Eingegangen', color: 'bg-neutral-100 text-neutral-600' },
  diagnosing: { label: 'Diagnose', color: 'bg-blue-100 text-blue-700' },
  repairing: { label: 'Reparatur', color: 'bg-violet-100 text-violet-700' },
  completed: { label: 'Fertig', color: 'bg-emerald-100 text-emerald-700' },
  delivered: { label: 'Abgeholt', color: 'bg-amber-100 text-amber-700' },
};

const statusSteps = ['received', 'diagnosing', 'repairing', 'completed', 'delivered'];

export function Repairs() {
  const { repairOrders, customers, addRepairOrder, updateRepairOrderStatus } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filteredRepairs = repairOrders.filter((repair) => {
    const customer = customers.find(c => c.id === repair.customerId);
    const customerName = customer ? `${customer.firstName} ${customer.lastName}`.toLowerCase() : '';
    return repair.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
           repair.itemDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customerName.includes(searchTerm.toLowerCase());
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

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-neutral-900">Service</h1>
          <p className="text-neutral-400 text-sm mt-1">{repairOrders.length} Reparaturen</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Neue Reparatur
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
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm"
        />
      </div>

      {/* Repairs List */}
      <div className="space-y-4">
        {filteredRepairs.map((repair) => {
          const customer = customers.find(c => c.id === repair.customerId);
          const status = statusConfig[repair.status];
          const currentStep = statusSteps.indexOf(repair.status);

          return (
            <div key={repair.id} className="bg-white rounded-2xl border border-neutral-100 p-6 hover:shadow-lg hover:shadow-neutral-100 transition-all duration-300">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono font-semibold text-neutral-900">{repair.id}</span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400">
                    {customer?.firstName} {customer?.lastName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold text-neutral-900">~€{repair.estimatedCost}</p>
                  <p className="text-xs text-neutral-400">geschätzt</p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-5">
                <div className="flex items-center gap-1">
                  {statusSteps.map((step, index) => (
                    <div key={step} className="flex-1 flex items-center">
                      <div className={`w-full h-1.5 rounded-full transition-colors ${
                        index <= currentStep ? 'bg-neutral-900' : 'bg-neutral-100'
                      }`} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {statusSteps.map((step, index) => (
                    <div key={step} className="flex-1 text-center">
                      <span className={`text-[10px] font-medium ${
                        index === currentStep ? 'text-neutral-900' : 'text-neutral-300'
                      }`}>
                        {statusConfig[step].label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-0.5">Artikel</p>
                  <p className="text-sm font-medium text-neutral-900">{repair.itemDescription}</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-0.5">Problem</p>
                  <p className="text-sm font-medium text-neutral-900">{repair.issue}</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-0.5">Eingegangen</p>
                  <p className="text-sm font-medium text-neutral-900">{new Date(repair.receivedAt).toLocaleDateString('de-DE')}</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-0.5">Fertigstellung</p>
                  <p className="text-sm font-medium text-neutral-900">{new Date(repair.estimatedCompletion).toLocaleDateString('de-DE')}</p>
                </div>
              </div>

              {repair.notes && (
                <div className="p-3 bg-amber-50 rounded-xl mb-4">
                  <p className="text-sm text-amber-700">{repair.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-500">Status:</span>
                  <select
                    value={repair.status}
                    onChange={(e) => updateRepairOrderStatus(repair.id, e.target.value as RepairOrder['status'])}
                    className="px-3 py-1.5 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  >
                    {Object.entries(statusConfig).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRepairs.length === 0 && (
        <div className="text-center py-20">
          <p className="text-neutral-400">Keine Reparaturen gefunden</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(new FormData(e.currentTarget)); }}>
              <div className="flex items-center justify-between p-5 border-b border-neutral-100">
                <h2 className="text-lg font-semibold text-neutral-900">Neue Reparatur</h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Kunde</label>
                  <select
                    name="customerId"
                    required
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm"
                  >
                    <option value="">Auswählen...</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Artikel</label>
                  <input
                    name="itemDescription"
                    required
                    placeholder="z.B. Goldkette 18K"
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Problem</label>
                  <textarea
                    name="issue"
                    required
                    rows={2}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Kosten (€)</label>
                    <input
                      name="estimatedCost"
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Fertig bis</label>
                    <input
                      name="estimatedCompletion"
                      type="date"
                      required
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Notizen</label>
                  <textarea
                    name="notes"
                    rows={2}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm resize-none"
                  />
                </div>
              </div>
              <div className="p-5 border-t border-neutral-100 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
