import { useState } from 'react';
import { Plus, Search, Wrench, CheckCircle, Circle } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { RepairOrder } from '../types';

const statusOptions = [
  { value: 'received', label: 'Eingegangen', color: 'bg-slate-100 text-slate-700' },
  { value: 'diagnosing', label: 'Diagnose', color: 'bg-blue-100 text-blue-700' },
  { value: 'repairing', label: 'In Reparatur', color: 'bg-violet-100 text-violet-700' },
  { value: 'completed', label: 'Fertig', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'delivered', label: 'Ausgeliefert', color: 'bg-amber-100 text-amber-700' },
];

const statusSteps = ['received', 'diagnosing', 'repairing', 'completed', 'delivered'];

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

  const getStepIndex = (status: string) => statusSteps.indexOf(status);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reparaturen</h1>
          <p className="text-slate-500 mt-1">{repairOrders.length} Reparaturaufträge</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          Neue Reparatur
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Reparatur suchen..."
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

      {/* Repairs List */}
      <div className="space-y-6">
        {filteredRepairs.map((repair) => {
          const customer = customers.find(c => c.id === repair.customerId);
          const status = statusOptions.find(s => s.value === repair.status);
          const currentStep = getStepIndex(repair.status);

          return (
            <div key={repair.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                      <Wrench className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-900 text-lg">{repair.id}</span>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status?.color}`}>
                          {status?.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {customer?.firstName} {customer?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      ~€{repair.estimatedCost.toLocaleString('de-DE')}
                    </p>
                    <p className="text-xs text-slate-500">geschätzte Kosten</p>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="mb-6">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-100" />
                    <div 
                      className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-500"
                      style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                    />
                    {statusSteps.map((step, index) => {
                      const isCompleted = index <= currentStep;
                      const isCurrent = index === currentStep;
                      return (
                        <div key={step} className="relative flex flex-col items-center z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30' 
                              : 'bg-slate-100'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-white" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300" />
                            )}
                          </div>
                          <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-violet-600' : 'text-slate-400'}`}>
                            {statusOptions[index]?.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Artikel</p>
                    <p className="font-medium text-slate-900">{repair.itemDescription}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Problem</p>
                    <p className="font-medium text-slate-900">{repair.issue}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Eingegangen</p>
                    <p className="font-medium text-slate-900">
                      {new Date(repair.receivedAt).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Geschätzte Fertigstellung</p>
                    <p className="font-medium text-slate-900">
                      {new Date(repair.estimatedCompletion).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                </div>

                {repair.notes && (
                  <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100 mb-4">
                    <p className="text-sm text-violet-700">{repair.notes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-slate-700">Status ändern:</label>
                    <select
                      value={repair.status}
                      onChange={(e) => updateRepairOrderStatus(repair.id, e.target.value as RepairOrder['status'])}
                      className="px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                    >
                      {statusOptions.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRepairs.length === 0 && (
        <div className="text-center py-16">
          <Wrench className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">Keine Reparaturen gefunden</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(new FormData(e.currentTarget)); }}>
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Neue Reparatur</h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Kunde</label>
                  <select
                    name="customerId"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
                  >
                    <option value="">Kunde auswählen...</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Artikelbeschreibung</label>
                  <input
                    name="itemDescription"
                    required
                    placeholder="z.B. Goldkette 18K, Damenarmbanduhr..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Problem / Reparaturbedarf</label>
                  <textarea
                    name="issue"
                    required
                    rows={3}
                    placeholder="Beschreiben Sie das Problem..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Geschätzte Kosten (€)</label>
                    <input
                      name="estimatedCost"
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Geschätzte Fertigstellung</label>
                    <input
                      name="estimatedCompletion"
                      type="date"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Notizen</label>
                  <textarea
                    name="notes"
                    rows={2}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 flex gap-3 justify-end bg-slate-50">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
