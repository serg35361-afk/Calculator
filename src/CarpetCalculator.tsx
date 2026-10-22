import React from 'react';
import { Carpet, CarpetServices, CarpetShape, WashType } from './types';
import { WASH_PRICES, SHAPES, WET_SURCHARGE, PLASTICINE_PRICE, ODOR_PRICE, DELIVERY_PRICE, calculateCarpetPrice, calculateCarpetArea } from './carpetCalculator';

interface Props {
  carpets: Carpet[];
  delivery: boolean;
  onCarpetsChange: (carpets: Carpet[]) => void;
  onDeliveryChange: (delivery: boolean) => void;
  onAddCarpet: () => void;
  onRemoveCarpet: (id: string) => void;
}

export default function CarpetCalculator({ carpets, delivery, onCarpetsChange, onDeliveryChange, onAddCarpet, onRemoveCarpet }: Props) {

  const updateCarpet = (id: string, updates: Partial<Carpet>) => {
    const updated = carpets.map(c => {
      if (c.id !== id) return c;
      const newCarpet = { ...c, ...updates };
      // Пересчитываем площадь и цену
      newCarpet.area = calculateCarpetArea(newCarpet.length, newCarpet.width, newCarpet.shape);
      newCarpet.price = calculateCarpetPrice(newCarpet);
      return newCarpet;
    });
    onCarpetsChange(updated);
  };

  const updateServices = (id: string, services: Partial<CarpetServices>) => {
    const carpet = carpets.find(c => c.id === id);
    if (!carpet) return;
    updateCarpet(id, { services: { ...carpet.services, ...services } });
  };

  const totalCarpetsPrice = carpets.reduce((sum, c) => sum + c.price, 0);
  const totalPrice = totalCarpetsPrice + (delivery ? DELIVERY_PRICE : 0);

  return (
    <div className="space-y-6">
      {/* Ковры */}
      {carpets.map((carpet, index) => (
        <div key={carpet.id} className="bg-white rounded-2xl shadow-lg p-5 md:p-7 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              <input
                type="text"
                value={carpet.name}
                onChange={(e) => updateCarpet(carpet.id, { name: e.target.value })}
                className="bg-transparent border-none focus:outline-none text-lg font-bold text-gray-800 w-40"
              />
            </h3>
            {carpets.length > 1 && (
              <button
                onClick={() => onRemoveCarpet(carpet.id)}
                className="text-red-400 hover:text-red-600 transition p-2 rounded-lg hover:bg-red-50"
                title="Удалить ковёр"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>

          {/* Размеры и форма */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {/* Длина */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Длина (м)</label>
              <input
                type="number"
                min={0}
                max={50}
                step={0.01}
                value={carpet.length || ''}
                onChange={(e) => updateCarpet(carpet.id, { length: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg"
              />
            </div>

            {/* Ширина */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ширина (м)</label>
              <input
                type="number"
                min={0}
                max={50}
                step={0.01}
                value={carpet.width || ''}
                onChange={(e) => updateCarpet(carpet.id, { width: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg"
                disabled={carpet.shape === 'circle'}
              />
              {carpet.shape === 'circle' && (
                <p className="text-xs text-gray-400 mt-1">Для круга ширина = длине (диаметр)</p>
              )}
            </div>

            {/* Форма */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Форма ковра</label>
              <div className="flex gap-2">
                {(Object.entries(SHAPES) as [CarpetShape, { label: string; icon: string }][]).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => updateCarpet(carpet.id, { shape: key })}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all text-center ${
                      carpet.shape === key
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-lg block">{val.icon}</span>
                    <span className="text-xs">{val.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Площадь */}
          {carpet.area > 0 && (
            <div className="bg-blue-50 rounded-xl p-3 mb-5 flex items-center justify-between">
              <span className="text-sm text-blue-700">Площадь ковра:</span>
              <span className="font-bold text-blue-800">{carpet.area.toFixed(2)} м²</span>
            </div>
          )}

          {/* Услуги */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">Услуги для ковра:</p>
            
            {/* Тип стирки */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(Object.entries(WASH_PRICES) as [WashType, { label: string; price: number; icon: string; description: string }][]).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => updateServices(carpet.id, { washType: key })}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    carpet.services.washType === key
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="text-lg">{val.icon}</span>
                  <p className="text-sm font-medium text-gray-800">{val.label}</p>
                  <p className="text-xs text-gray-500">{val.price} ₽/м²</p>
                </button>
              ))}
            </div>

            {/* Дополнительные услуги */}
            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-100 hover:border-blue-200 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={carpet.services.isWet}
                  onChange={(e) => updateServices(carpet.id, { isWet: e.target.checked })}
                  className="w-5 h-5 rounded accent-blue-600"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-800">Ковёр влажный</span>
                  <span className="text-xs text-gray-500 ml-2">+15% к стоимости</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-100 hover:border-blue-200 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={carpet.services.removePlasticine}
                  onChange={(e) => updateServices(carpet.id, { removePlasticine: e.target.checked })}
                  className="w-5 h-5 rounded accent-blue-600"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-800">Удаление пластилина/слайма</span>
                  <span className="text-xs text-gray-500 ml-2">{PLASTICINE_PRICE} ₽/м²</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-100 hover:border-blue-200 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={carpet.services.removeOdor}
                  onChange={(e) => updateServices(carpet.id, { removeOdor: e.target.checked })}
                  className="w-5 h-5 rounded accent-blue-600"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-800">Удаление запаха</span>
                  <span className="text-xs text-gray-500 ml-2">{ODOR_PRICE} ₽/м²</span>
                </div>
              </label>
            </div>
          </div>

          {/* Цена ковра */}
          {carpet.price > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm text-gray-600">Стоимость ковра:</span>
              <span className="text-xl font-bold text-gray-800">{carpet.price.toLocaleString('ru-RU')} ₽</span>
            </div>
          )}
        </div>
      ))}

      {/* Кнопка добавить ковёр */}
      <button
        onClick={onAddCarpet}
        className="w-full py-4 bg-white border-2 border-dashed border-blue-300 rounded-2xl text-blue-600 font-semibold hover:bg-blue-50 hover:border-blue-400 transition-all flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Добавить ещё ковёр
      </button>

      {/* Доставка */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-7">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={delivery}
            onChange={(e) => onDeliveryChange(e.target.checked)}
            className="w-6 h-6 rounded accent-blue-600"
          />
          <div className="flex-1">
            <span className="text-lg font-semibold text-gray-800">🚚 Доставка</span>
            <p className="text-sm text-gray-500">Доставка и возврат ковров</p>
          </div>
          <span className="text-lg font-bold text-gray-800">{DELIVERY_PRICE.toLocaleString('ru-RU')} ₽</span>
        </label>

        {/* Предупреждение при снятой галочке */}
        {!delivery && (
          <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl">
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
      </div>

      {/* Итого */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="space-y-2 mb-3">
          {carpets.filter(c => c.price > 0).map((c, i) => (
            <div key={c.id} className="flex justify-between text-sm opacity-90">
              <span>{c.name} ({c.area.toFixed(2)} м²)</span>
              <span>{c.price.toLocaleString('ru-RU')} ₽</span>
            </div>
          ))}
          {delivery && (
            <div className="flex justify-between text-sm opacity-90">
              <span>🚚 Доставка</span>
              <span>{DELIVERY_PRICE.toLocaleString('ru-RU')} ₽</span>
            </div>
          )}
        </div>
        <div className="border-t border-white/30 pt-3 flex justify-between items-center">
          <span className="text-lg font-medium">Итого:</span>
          <span className="text-3xl font-bold">{totalPrice.toLocaleString('ru-RU')} ₽</span>
        </div>
      </div>
    </div>
  );
}
