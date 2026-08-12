import { useState } from 'react';
import { Plus, Calendar, User, X, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Appointment } from '../types';

const appointmentTypes = [
  { value: 'consultation', label: 'Beratung', color: 'bg-blue-100 text-blue-700' },
  { value: 'pickup', label: 'Abholung', color: 'bg-green-100 text-green-700' },
  { value: 'repair_dropoff', label: 'Reparatur-Abgabe', color: 'bg-purple-100 text-purple-700' },
  { value: 'custom_design', label: 'Sonderanfertigung', color: 'bg-amber-100 text-amber-700' },
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

export function Appointments() {
  const { appointments, customers, addAppointment, updateAppointmentStatus } = useStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);

  const filteredAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.date).toISOString().split('T')[0];
    return aptDate === selectedDate;
  });

  const handleSave = (formData: FormData) => {
    const appointmentData: Appointment = {
      id: `APT-${String(appointments.length + 1).padStart(3, '0')}`,
      customerId: formData.get('customerId') as string,
      type: formData.get('type') as Appointment['type'],
      date: new Date(formData.get('date') as string),
      time: formData.get('time') as string,
      duration: parseInt(formData.get('duration') as string),
      notes: formData.get('notes') as string,
      status: 'scheduled',
    };
    addAppointment(appointmentData);
    setShowModal(false);
  };

  const getWeekDays = () => {
    const days = [];
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay() + 1);
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-gray-900">Termine</h1>
          <p className="text-gray-500 mt-1">Terminverwaltung und Kalender</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Neuer Termin
        </button>
      </div>

      {/* Week Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() - 7);
              setSelectedDate(d.toISOString().split('T')[0]);
            }}
            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            ← Vorherige Woche
          </button>
          <span className="font-medium text-gray-900">
            {new Date(selectedDate).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() + 7);
              setSelectedDate(d.toISOString().split('T')[0]);
            }}
            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Nächste Woche →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const dateStr = day.toISOString().split('T')[0];
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const dayAppointments = appointments.filter(apt => 
              new Date(apt.date).toISOString().split('T')[0] === dateStr && apt.status === 'scheduled'
            );

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`p-3 rounded-lg text-center transition-colors ${
                  isSelected 
                    ? 'bg-amber-500 text-white' 
                    : isToday 
                      ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                      : 'hover:bg-gray-50'
                }`}
              >
                <p className="text-xs font-medium">{dayNames[index]}</p>
                <p className="text-lg font-semibold mt-1">{day.getDate()}</p>
                {dayAppointments.length > 0 && (
                  <div className={`mt-1 text-xs ${isSelected ? 'text-amber-100' : 'text-amber-600'}`}>
                    {dayAppointments.length} Termin{dayAppointments.length > 1 ? 'e' : ''}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Termine am {new Date(selectedDate).toLocaleDateString('de-DE', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })}
        </h2>

        {filteredAppointments.length > 0 ? (
          <div className="space-y-3">
            {filteredAppointments
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((apt) => {
                const customer = customers.find(c => c.id === apt.customerId);
                const type = appointmentTypes.find(t => t.value === apt.type);

                return (
                  <div 
                    key={apt.id} 
                    className={`p-4 rounded-lg border ${
                      apt.status === 'cancelled' 
                        ? 'bg-gray-50 border-gray-200 opacity-50' 
                        : apt.status === 'completed'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-16 text-center">
                          <p className="text-lg font-semibold text-gray-900">{apt.time}</p>
                          <p className="text-xs text-gray-500">{apt.duration} Min.</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">
                              {customer?.firstName} {customer?.lastName}
                            </span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${type?.color}`}>
                              {type?.label}
                            </span>
                          </div>
                          {apt.notes && (
                            <p className="text-sm text-gray-600 mt-1">{apt.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {apt.status === 'scheduled' && (
                          <>
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                              className="p-2 hover:bg-green-100 rounded-lg"
                              title="Als erledigt markieren"
                            >
                              <Check className="w-4 h-4 text-green-600" />
                            </button>
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                              className="p-2 hover:bg-red-100 rounded-lg"
                              title="Stornieren"
                            >
                              <X className="w-4 h-4 text-red-600" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Keine Termine an diesem Tag</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-3 text-amber-600 hover:text-amber-700 text-sm font-medium"
            >
              + Termin hinzufügen
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(new FormData(e.currentTarget)); }}>
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Neuer Termin</h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Terminart</label>
                  <select
                    name="type"
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {appointmentTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
                    <input
                      name="date"
                      type="date"
                      defaultValue={selectedDate}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Uhrzeit</label>
                    <select
                      name="time"
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dauer (Minuten)</label>
                  <select
                    name="duration"
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="15">15 Minuten</option>
                    <option value="30">30 Minuten</option>
                    <option value="45">45 Minuten</option>
                    <option value="60">60 Minuten</option>
                    <option value="90">90 Minuten</option>
                    <option value="120">120 Minuten</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notizen</label>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="Zusätzliche Informationen zum Termin..."
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
