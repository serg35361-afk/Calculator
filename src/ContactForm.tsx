import React from 'react';

interface Props {
  name: string;
  phone: string;
  email: string;
  address: string;
  comment: string;
  onChange: (field: string, value: string) => void;
}

export default function ContactForm({ name, phone, email, address, comment, onChange }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-3xl">👤</span> Контактные данные
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            ФИО <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Иванов Иван Иванович"
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Телефон <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="+7 (999) 123-45-67"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="email@example.com"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Адрес установки забора</label>
          <input
            type="text"
            value={address}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="Московская обл., г. Одинцово, ул. Ленина, д. 10"
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Комментарий</label>
          <textarea
            value={comment}
            onChange={(e) => onChange('comment', e.target.value)}
            placeholder="Дополнительные пожелания..."
            rows={3}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition resize-none"
          />
        </div>
      </div>
    </div>
  );
}
