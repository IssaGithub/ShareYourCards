import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Appointment } from '../types';

const appointmentTypes = [
  { value: 'consultation', label: 'Beratung', color: 'bg-blue-500' },
  { value: 'pickup', label: 'Abholung', color: 'bg-emerald-500' },
  { value: 'repair_dropoff', label: 'Abgabe', color: 'bg-violet-500' },
  { value: 'custom_design', label: 'Sonderanfertigung', color: 'bg-amber-500' },
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
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-neutral-900">Termine</h1>
          <p className="text-neutral-400 text-sm mt-1">Kalender & Planung</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Neuer Termin
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-5">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() - 7);
              setSelectedDate(d.toISOString().split('T')[0]);
            }}
            className="w-9 h-9 rounded-xl hover:bg-neutral-100 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <span className="font-semibold text-neutral-900">
            {new Date(selectedDate).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() + 7);
              setSelectedDate(d.toISOString().split('T')[0]);
            }}
            className="w-9 h-9 rounded-xl hover:bg-neutral-100 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-neutral-600" />
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
                className={`p-3 rounded-xl text-center transition-all ${
                  isSelected 
                    ? 'bg-neutral-900 text-white' 
                    : isToday 
                      ? 'bg-neutral-100'
                      : 'hover:bg-neutral-50'
                }`}
              >
                <p className={`text-[10px] font-medium uppercase ${isSelected ? 'text-neutral-400' : 'text-neutral-400'}`}>
                  {dayNames[index]}
                </p>
                <p className="text-xl font-semibold mt-1">{day.getDate()}</p>
                {dayAppointments.length > 0 && (
                  <div className="flex justify-center gap-0.5 mt-2">
                    {dayAppointments.slice(0, 3).map((apt, i) => {
                      const type = appointmentTypes.find(t => t.value === apt.type);
                      return (
                        <div 
                          key={i} 
                          className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/60' : type?.color}`} 
                        />
                      );
                    })}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day View */}
      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
        <div className="p-5 border-b border-neutral-100">
          <h2 className="font-semibold text-neutral-900">
            {new Date(selectedDate).toLocaleDateString('de-DE', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </h2>
          <p className="text-sm text-neutral-400 mt-0.5">
            {filteredAppointments.filter(a => a.status === 'scheduled').length} Termine
          </p>
        </div>

        <div className="divide-y divide-neutral-50">
          {filteredAppointments
            .filter(a => a.status !== 'cancelled')
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((apt) => {
              const customer = customers.find(c => c.id === apt.customerId);
              const type = appointmentTypes.find(t => t.value === apt.type);

              return (
                <div 
                  key={apt.id} 
                  className={`flex items-center gap-4 p-5 ${apt.status === 'completed' ? 'opacity-50' : ''}`}
                >
                  <div className="w-16 text-center">
                    <p className="text-xl font-semibold text-neutral-900">{apt.time}</p>
                  </div>
                  <div className={`w-1 h-12 rounded-full ${type?.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-neutral-900">
                        {customer?.firstName} {customer?.lastName}
                      </span>
                      <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100">
                        {type?.label}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500 truncate">{apt.notes || 'Kein Kommentar'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-400">{apt.duration} min</span>
                    {apt.status === 'scheduled' && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                          className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                        >
                          <Check className="w-4 h-4 text-emerald-600" />
                        </button>
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                          className="w-8 h-8 rounded-lg bg-neutral-50 hover:bg-neutral-100 flex items-center justify-center transition-colors"
                        >
                          <X className="w-4 h-4 text-neutral-400" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          
          {filteredAppointments.filter(a => a.status !== 'cancelled').length === 0 && (
            <div className="p-12 text-center">
              <p className="text-neutral-400">Keine Termine</p>
              <button
                onClick={() => setShowModal(true)}
                className="text-sm text-neutral-900 font-medium mt-2 hover:underline"
              >
                Termin hinzufügen
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(new FormData(e.currentTarget)); }}>
              <div className="flex items-center justify-between p-5 border-b border-neutral-100">
                <h2 className="text-lg font-semibold text-neutral-900">Neuer Termin</h2>
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
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Art</label>
                  <select
                    name="type"
                    required
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm"
                  >
                    {appointmentTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Datum</label>
                    <input
                      name="date"
                      type="date"
                      defaultValue={selectedDate}
                      required
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Uhrzeit</label>
                    <select
                      name="time"
                      required
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm"
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Dauer</label>
                  <select
                    name="duration"
                    required
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm"
                  >
                    <option value="15">15 min</option>
                    <option value="30">30 min</option>
                    <option value="45">45 min</option>
                    <option value="60">60 min</option>
                    <option value="90">90 min</option>
                  </select>
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
