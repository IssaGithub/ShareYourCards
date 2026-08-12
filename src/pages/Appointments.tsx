import { useState } from 'react';
import { Plus, Calendar, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Appointment } from '../types';

const appointmentTypes = [
  { value: 'consultation', label: 'Beratung', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  { value: 'pickup', label: 'Abholung', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  { value: 'repair_dropoff', label: 'Reparatur-Abgabe', color: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  { value: 'custom_design', label: 'Sonderanfertigung', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
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

  const navigateWeek = (direction: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + (direction * 7));
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Termine</h1>
          <p className="text-slate-500 mt-1">Terminverwaltung und Kalender</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          Neuer Termin
        </button>
      </div>

      {/* Week Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <span className="font-bold text-lg text-slate-900">
            {new Date(selectedDate).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => navigateWeek(1)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
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
                className={`p-4 rounded-2xl text-center transition-all duration-200 ${
                  isSelected 
                    ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30' 
                    : isToday 
                      ? 'bg-violet-50 text-violet-700 hover:bg-violet-100'
                      : 'hover:bg-slate-50'
                }`}
              >
                <p className={`text-xs font-medium ${isSelected ? 'text-violet-200' : 'text-slate-400'}`}>
                  {dayNames[index]}
                </p>
                <p className="text-2xl font-bold mt-1">{day.getDate()}</p>
                {dayAppointments.length > 0 && (
                  <div className="flex justify-center gap-1 mt-2">
                    {dayAppointments.slice(0, 3).map((apt, i) => {
                      const type = appointmentTypes.find(t => t.value === apt.type);
                      return (
                        <div 
                          key={i} 
                          className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/70' : type?.dot}`} 
                        />
                      );
                    })}
                    {dayAppointments.length > 3 && (
                      <span className={`text-xs ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                        +{dayAppointments.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Schedule */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <h2 className="text-xl font-bold text-slate-900">
            {new Date(selectedDate).toLocaleDateString('de-DE', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {filteredAppointments.filter(a => a.status === 'scheduled').length} Termine geplant
          </p>
        </div>

        <div className="p-6">
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
                      className={`p-5 rounded-2xl border transition-all duration-200 ${
                        apt.status === 'cancelled' 
                          ? 'bg-slate-50 border-slate-200 opacity-50' 
                          : apt.status === 'completed'
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'bg-white border-slate-200 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/5'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-16 text-center p-3 bg-slate-50 rounded-xl">
                            <p className="text-2xl font-bold text-slate-900">{apt.time.split(':')[0]}</p>
                            <p className="text-sm text-slate-400">{apt.time.split(':')[1]}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold`}>
                                  {customer?.firstName[0]}{customer?.lastName[0]}
                                </div>
                                <span className="font-semibold text-slate-900">
                                  {customer?.firstName} {customer?.lastName}
                                </span>
                              </div>
                              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${type?.color}`}>
                                {type?.label}
                              </span>
                            </div>
                            {apt.notes && (
                              <p className="text-sm text-slate-500">{apt.notes}</p>
                            )}
                            <p className="text-xs text-slate-400 mt-2">Dauer: {apt.duration} Minuten</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {apt.status === 'scheduled' && (
                            <>
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                                title="Als erledigt markieren"
                              >
                                <Check className="w-4 h-4 text-emerald-600" />
                              </button>
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                                className="p-2.5 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                                title="Stornieren"
                              >
                                <X className="w-4 h-4 text-rose-600" />
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
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 text-lg mb-4">Keine Termine an diesem Tag</p>
              <button
                onClick={() => setShowModal(true)}
                className="text-violet-600 hover:text-violet-700 font-medium"
              >
                + Termin hinzufügen
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(new FormData(e.currentTarget)); }}>
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Neuer Termin</h2>
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Terminart</label>
                  <select
                    name="type"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
                  >
                    {appointmentTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Datum</label>
                    <input
                      name="date"
                      type="date"
                      defaultValue={selectedDate}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Uhrzeit</label>
                    <select
                      name="time"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Dauer</label>
                  <select
                    name="duration"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Notizen</label>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="Zusätzliche Informationen zum Termin..."
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
