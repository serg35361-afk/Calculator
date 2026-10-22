import React from 'react';
import { OrderData } from './types';
import { WASH_PRICES, SHAPES, DELIVERY_PRICE } from './carpetCalculator';

interface Props {
  isOpen: boolean;
  orderData: OrderData | null;
  leadId: number | null;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, orderData, leadId, onClose }: Props) {
  if (!isOpen || !orderData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Заказ отправлен!</h2>
          {leadId && (
            <p className="text-gray-500 text-sm">
              Номер заявки: <span className="font-mono font-bold text-blue-600">#{leadId}</span>
            </p>
          )}
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-4 mb-6">
          {/* Ковры */}
          <div>
            <h4 className="font-semibold text-gray-700 text-sm mb-2 flex items-center gap-1">
              🧹 Ковры
            </h4>
            {orderData.carpets.map((carpet, i) => (
              <div key={carpet.id} className="text-sm text-gray-600 mb-2 pl-3 border-l-2 border-blue-200">
                <p className="font-medium text-gray-800">{carpet.name}</p>
                <p>{SHAPES[carpet.shape].label} • {carpet.length}×{carpet.width} м • {carpet.area.toFixed(2)} м²</p>
                <p>{WASH_PRICES[carpet.services.washType].label} — {carpet.price.toLocaleString('ru-RU')} ₽</p>
              </div>
            ))}
          </div>

          {/* Доставка */}
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">🚚 Доставка:</span>{' '}
            {orderData.delivery ? `${DELIVERY_PRICE.toLocaleString('ru-RU')} ₽` : 'Нет'}
          </div>

          {/* Дата и слот */}
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">📅 Дата забора:</span> {orderData.date}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">🕐 Слот:</span> {orderData.slot}
          </div>

          {/* Контакты */}
          <div className="border-t border-gray-200 pt-3 space-y-1">
            <p className="text-sm text-gray-600"><span className="font-medium text-gray-800">👤 Имя:</span> {orderData.name}</p>
            <p className="text-sm text-gray-600"><span className="font-medium text-gray-800">📞 Телефон:</span> {orderData.phone}</p>
            <p className="text-sm text-gray-600"><span className="font-medium text-gray-800">📍 Адрес:</span> {orderData.address}</p>
          </div>

          {/* Итого */}
          <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
            <span className="font-semibold text-gray-800">Итого:</span>
            <span className="text-xl font-bold text-blue-600">{orderData.totalPrice.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
        >
          Ок
        </button>
      </div>
    </div>
  );
}
