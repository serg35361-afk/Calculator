import React, { useState, useEffect } from 'react';
import Calculator from './Calculator';
import DateSlotPicker from './DateSlotPicker';
import ContactForm from './ContactForm';
import SettingsModal from './SettingsModal';
import { CalculatorData, OrderData } from './types';
import { getDefaultCalculatorData, calculatePrice } from './calculator';
import { createBitrixLead, getWebhookUrl } from './bitrixApi';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export default function App() {
  const [calcData, setCalcData] = useState<CalculatorData>(getDefaultCalculatorData());
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [contacts, setContacts] = useState({ name: '', phone: '', email: '', address: '', comment: '' });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [leadId, setLeadId] = useState<number | null>(null);

  // Рассчитываем итоговую цену при изменении данных
  useEffect(() => {
    const price = calculatePrice(calcData);
    if (price !== calcData.totalPrice) {
      setCalcData(prev => ({ ...prev, totalPrice: price }));
    }
  }, [calcData.fenceType, calcData.length, calcData.height, calcData.material, calcData.gates, calcData.wickets, calcData.installation]);

  const handleContactChange = (field: string, value: string) => {
    setContacts(prev => ({ ...prev, [field]: value }));
  };

  const canSubmit = () => {
    return (
      calcData.totalPrice > 0 &&
      selectedDate &&
      selectedSlot &&
      contacts.name.trim() &&
      contacts.phone.trim()
    );
  };

  const handleSubmit = async () => {
    if (!canSubmit()) return;

    setSubmitStatus('loading');
    setErrorMessage('');

    const orderData: OrderData = {
      calculator: calcData,
      date: new Date(selectedDate).toLocaleDateString('ru-RU'),
      slot: selectedSlot,
      ...contacts,
    };

    const result = await createBitrixLead(orderData);

    if (result.success) {
      setSubmitStatus('success');
      setLeadId(result.leadId || null);
    } else {
      setSubmitStatus('error');
      setErrorMessage(result.error || 'Произошла ошибка');
    }
  };

  const handleReset = () => {
    setCalcData(getDefaultCalculatorData());
    setSelectedDate('');
    setSelectedSlot('');
    setContacts({ name: '', phone: '', email: '', address: '', comment: '' });
    setSubmitStatus('idle');
    setLeadId(null);
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Заявка отправлена!</h2>
          {leadId && (
            <p className="text-gray-500 mb-4">ID Лида в Битрикс24: <span className="font-mono font-bold text-blue-600">#{leadId}</span></p>
          )}
          <p className="text-gray-600 mb-6">
            Ваша заявка успешно создана в системе. Наш менеджер свяжется с вами в ближайшее время для подтверждения деталей.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-gray-600"><strong>Дата забора:</strong> {new Date(selectedDate).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            <p className="text-sm text-gray-600"><strong>Слот:</strong> {selectedSlot}</p>
            <p className="text-sm text-gray-600"><strong>Сумма:</strong> {calcData.totalPrice.toLocaleString('ru-RU')} ₽</p>
          </div>
          <button
            onClick={handleReset}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
          >
            Создать новую заявку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏡</span>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Калькулятор забора</h1>
              <p className="text-xs text-gray-500">Расчёт стоимости и онлайн-заявка</p>
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

      {/* Progress indicator */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className={`flex items-center gap-1 px-3 py-1 rounded-full ${calcData.totalPrice > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {calcData.totalPrice > 0 ? '✓' : '1'} Расчёт
          </span>
          <span className="text-gray-300">→</span>
          <span className={`flex items-center gap-1 px-3 py-1 rounded-full ${selectedDate && selectedSlot ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {selectedDate && selectedSlot ? '✓' : '2'} Дата
          </span>
          <span className="text-gray-300">→</span>
          <span className={`flex items-center gap-1 px-3 py-1 rounded-full ${contacts.name && contacts.phone ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {contacts.name && contacts.phone ? '✓' : '3'} Контакты
          </span>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 pb-32 space-y-6">
        <Calculator data={calcData} onChange={setCalcData} />
        <DateSlotPicker
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          onDateChange={setSelectedDate}
          onSlotChange={setSelectedSlot}
        />
        <ContactForm
          name={contacts.name}
          phone={contacts.phone}
          email={contacts.email}
          address={contacts.address}
          comment={contacts.comment}
          onChange={handleContactChange}
        />
      </main>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Итого к оплате:</p>
            <p className="text-2xl font-bold text-gray-800">{calcData.totalPrice.toLocaleString('ru-RU')} ₽</p>
          </div>
          <div className="flex items-center gap-3">
            {submitStatus === 'error' && (
              <p className="text-sm text-red-600 max-w-xs">{errorMessage}</p>
            )}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit() || submitStatus === 'loading'}
              className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                canSubmit() && submitStatus !== 'loading'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {submitStatus === 'loading' ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Отправка...
                </span>
              ) : (
                '📋 Подать заявку'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Webhook not configured warning */}
      {!getWebhookUrl() && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-amber-50 border border-amber-300 text-amber-800 px-4 py-2 rounded-xl shadow-lg text-sm flex items-center gap-2 z-30">
          <span>⚠️</span>
          <span>Настройте вебхук Битрикс24 для отправки заявок</span>
          <button onClick={() => setSettingsOpen(true)} className="underline font-semibold ml-2">Настроить</button>
        </div>
      )}
    </div>
  );
}
