import React, { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  delivery: boolean;
  onClose: () => void;
  onSubmit: (name: string, phone: string, address: string) => void;
  isLoading: boolean;
}

export default function OrderModal({ isOpen, delivery, onClose, onSubmit, isLoading }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Сброс при открытии
  useEffect(() => {
    if (isOpen) {
      setName('');
      setPhone('');
      setAddress('');
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Введите имя';
    if (!phone.trim()) newErrors.phone = 'Введите телефон';
    // Адрес обязателен только если заказана доставка
    if (delivery && !address.trim()) newErrors.address = 'Введите адрес доставки';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(name.trim(), phone.trim(), address.trim());
    }
  };

  const handleClose = () => {
    setName('');
    setPhone('');
    setAddress('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">📝</span> Оформление заказа
          </h3>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Имя */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Имя <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
              placeholder="Ваше имя"
              className={`w-full p-3 border-2 rounded-xl focus:outline-none transition ${
                errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Телефон */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Телефон <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setErrors(prev => ({ ...prev, phone: '' })); }}
              placeholder="+7 (999) 123-45-67"
              className={`w-full p-3 border-2 rounded-xl focus:outline-none transition ${
                errors.phone ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          {/* Адрес */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Адрес {delivery ? <span className="text-red-500">*</span> : <span className="text-gray-400 font-normal">(необязательно)</span>}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => { setAddress(e.target.value); setErrors(prev => ({ ...prev, address: '' })); }}
              placeholder={delivery ? 'Адрес для забора ковров' : 'Ваш адрес (если хотите оставить комментарий)'}
              className={`w-full p-3 border-2 rounded-xl focus:outline-none transition ${
                errors.address ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
            />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
          </div>

          {/* Предупреждение при отсутствии доставки */}
          {!delivery && (
            <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl">
              <div className="flex items-start gap-2">
                <span className="text-xl flex-shrink-0">⚠️</span>
                <div className="text-sm text-amber-900">
                  <p className="font-semibold mb-1">Внимание! Вы не заказали доставку.</p>
                  <p>
                    В этом случае Вам необходимо доставить и забрать ковры по адресу:{' '}
                    <span className="font-semibold">ул. Багрицкого, 10 корпус 2, Москва</span>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Кнопки */}
          <div className="pt-2 flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              Отмена
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Отправка...
                </>
              ) : (
                '📋 Отправить'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
