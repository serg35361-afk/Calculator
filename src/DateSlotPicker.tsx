import React, { useMemo } from 'react';
import { TimeSlot } from './types';

interface Props {
  selectedDate: string;
  selectedSlot: string;
  onDateChange: (date: string) => void;
  onSlotChange: (slot: string) => void;
}

const TIME_SLOTS: TimeSlot[] = [
  { id: '08:00-10:00', label: '08:00 — 10:00', available: true },
  { id: '10:00-12:00', label: '10:00 — 12:00', available: true },
  { id: '12:00-14:00', label: '12:00 — 14:00', available: true },
  { id: '14:00-16:00', label: '14:00 — 16:00', available: true },
  { id: '16:00-18:00', label: '16:00 — 18:00', available: true },
];

// Имитация занятых слотов (зависит от даты)
function getBusySlots(date: string): string[] {
  if (!date) return [];
  const day = new Date(date).getDate();
  const busy: string[] = [];
  // Псевдослучайная генерация на основе дня
  if (day % 3 === 0) busy.push('08:00-10:00');
  if (day % 2 === 0) busy.push('12:00-14:00');
  if (day % 4 === 0) busy.push('16:00-18:00');
  return busy;
}

export default function DateSlotPicker({ selectedDate, selectedSlot, onDateChange, onSlotChange }: Props) {
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const busySlots = useMemo(() => getBusySlots(selectedDate), [selectedDate]);

  const slots = TIME_SLOTS.map(slot => ({
    ...slot,
    available: !busySlots.includes(slot.id),
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-3xl">📅</span> Дата и слот забора
      </h2>

      {/* Выбор даты */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Выберите дату</label>
        <input
          type="date"
          min={minDate}
          max={maxDate}
          value={selectedDate}
          onChange={(e) => {
            onDateChange(e.target.value);
            onSlotChange('');
          }}
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg transition"
        />
        <p className="text-xs text-gray-400 mt-1">Доступно бронирование на 30 дней вперёд</p>
      </div>

      {/* Выбор слота */}
      {selectedDate && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Выберите временной слот</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {slots.map((slot) => (
              <button
                key={slot.id}
                disabled={!slot.available}
                onClick={() => onSlotChange(slot.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  !slot.available
                    ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                    : selectedSlot === slot.id
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">{slot.label}</span>
                  {slot.available ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Свободно</span>
                  ) : (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Занято</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedDate && selectedSlot && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-green-800 font-medium">
            ✅ Выбрано: {new Date(selectedDate).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} — {selectedSlot}
          </p>
        </div>
      )}
    </div>
  );
}
