import React, { useState, useMemo } from 'react';
import CarpetCalculator from './CarpetCalculator';
import DateSlotPicker from './DateSlotPicker';
import OrderModal from './OrderModal';
import SuccessModal from './SuccessModal';
import SettingsModal from './SettingsModal';
import { Carpet, OrderData } from './types';
import { createEmptyCarpet, DELIVERY_PRICE } from './carpetCalculator';
import { createBitrixLead } from './bitrixApi';

export default function App() {
  const [carpets, setCarpets] = useState<Carpet[]>([createEmptyCarpet(1)]);
  const [delivery, setDelivery] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [lastOrderData, setLastOrderData] = useState<OrderData | null>(null);
  const [lastLeadId, setLastLeadId] = useState<number | null>(null);

  // Подсчёт итогов
  const totals = useMemo(() => {
    const totalCarpetsPrice = carpets.reduce((sum, c) => sum + c.price, 0);
    const deliveryPrice = delivery ? DELIVERY_PRICE : 0;
    const totalPrice = totalCarpetsPrice + deliveryPrice;
    return { totalCarpetsPrice, deliveryPrice, totalPrice };
  }, [carpets, delivery]);

  const handleAddCarpet = () => {
    setCarpets(prev => [...prev, createEmptyCarpet(prev.length + 1)]);
  };

  const handleRemoveCarpet = (id: string) => {
    setCarpets(prev => {
      const filtered = prev.filter(c => c.id !== id);
      // Переименовываем оставшиеся
      return filtered.map((c, i) => ({ ...c, name: c.name.startsWith('Ковёр') ? `Ковёр ${i + 1}` : c.name }));
    });
  };

  const canSubmitOrder = () => {
    const hasValidCarpets = carpets.some(c => c.length > 0 && c.width > 0 && c.price > 0);
    return hasValidCarpets && selectedDate && selectedSlot;
  };

  const handleMakeOrder = () => {
    if (!canSubmitOrder()) return;
    setOrderError('');
    setOrderModalOpen(true);
  };

  const handleOrderSubmit = async (name: string, phone: string, address: string) => {
    setIsLoading(true);
    setOrderError('');

    const orderData: OrderData = {
      carpets,
      delivery,
      totalCarpetsPrice: totals.totalCarpetsPrice,
      deliveryPrice: totals.deliveryPrice,
      totalPrice: totals.totalPrice,
      date: new Date(selectedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' }),
      slot: selectedSlot,
      name,
      phone,
      address,
    };

    const result = await createBitrixLead(orderData);

    setIsLoading(false);

    if (result.success) {
      setOrderModalOpen(false);
      setLastOrderData(orderData);
      setLastLeadId(result.leadId || null);
      setSuccessModalOpen(true);
    } else {
      setOrderError(result.error || 'Произошла ошибка при отправке');
    }
  };

  const handleSuccessClose = () => {
    setSuccessModalOpen(false);
    // Сброс
    setCarpets([createEmptyCarpet(1)]);
    setDelivery(false);
    setSelectedDate('');
    setSelectedSlot('');
    setLastOrderData(null);
    setLastLeadId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧹</span>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Химчистка ковров</h1>
              <p className="text-xs text-gray-500">Расчёт стоимости и заказ</p>
            </div>
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            title="Настройки Битрикс24"
          >
            <span className="text-xl">⚙️</span>
          </button>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
          <span className={`flex items-center gap-1 px-3 py-1 rounded-full ${
            carpets.some(c => c.price > 0) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            {carpets.some(c => c.price > 0) ? '✓' : '1'} Ковры
          </span>
          <span className="text-gray-300">→</span>
          <span className={`flex items-center gap-1 px-3 py-1 rounded-full ${
            selectedDate && selectedSlot ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            {selectedDate && selectedSlot ? '✓' : '2'} Дата забора
          </span>
          <span className="text-gray-300">→</span>
          <span className={`flex items-center gap-1 px-3 py-1 rounded-full ${
            'bg-gray-100 text-gray-500'
          }`}>
            3 Заказ
          </span>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 pb-36 space-y-6">
        {/* Калькулятор ковров */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-3xl">🧮</span> Калькулятор
          </h2>
          <CarpetCalculator
            carpets={carpets}
            delivery={delivery}
            onCarpetsChange={setCarpets}
            onDeliveryChange={setDelivery}
            onAddCarpet={handleAddCarpet}
            onRemoveCarpet={handleRemoveCarpet}
          />
        </div>

        {/* Дата и слот забора */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-3xl">📅</span> Дата забора
          </h2>
          <DateSlotPicker
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            onDateChange={setSelectedDate}
            onSlotChange={setSelectedSlot}
          />
        </div>
      </main>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Итого:</p>
            <p className="text-2xl font-bold text-gray-800">{totals.totalPrice.toLocaleString('ru-RU')} ₽</p>
          </div>
          <div className="flex items-center gap-3">
            {orderError && (
              <p className="text-sm text-red-600 max-w-xs">{orderError}</p>
            )}
            <button
              onClick={handleMakeOrder}
              disabled={!canSubmitOrder()}
              className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                canSubmitOrder()
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              📋 Сделать заказ
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <OrderModal
        isOpen={orderModalOpen}
        delivery={delivery}
        onClose={() => setOrderModalOpen(false)}
        onSubmit={handleOrderSubmit}
        isLoading={isLoading}
      />

      <SuccessModal
        isOpen={successModalOpen}
        orderData={lastOrderData}
        leadId={lastLeadId}
        onClose={handleSuccessClose}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {/* Webhook info */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-xl shadow-lg text-sm flex items-center gap-2 z-30">
        <span>🔗</span>
        <span>Вебхук Битрикс24 подключён</span>
        <button onClick={() => setSettingsOpen(true)} className="underline font-semibold ml-2">Изменить</button>
      </div>
    </div>
  );
}
