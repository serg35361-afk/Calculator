import React, { useState } from 'react';
import { getWebhookUrl, setWebhookUrl } from './bitrixApi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  const [url, setUrl] = useState(getWebhookUrl());
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setWebhookUrl(url.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">⚙️</span> Настройки Битрикс24
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              URL вебхука Битрикс24
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-domain.bitrix24.ru/rest/1/your-webhook-code"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition text-sm"
            />
            <p className="text-xs text-gray-400 mt-2">
              Создайте входящий вебхук в Битрикс24 с правами доступа к CRM (crm). 
              Формат: https://ваш-домен.bitrix24.ru/rest/1/код-вебхука
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-800 text-sm mb-2">📋 Инструкция:</h4>
            <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
              <li>Откройте Битрикс24 → Приложения → Вебхуки → Добавить вебхук</li>
              <li>Установите права: <code className="bg-blue-100 px-1 rounded">crm</code></li>
              <li>Скопируйте URL вебхука</li>
              <li>Вставьте URL в поле выше и сохраните</li>
            </ol>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
          >
            {saved ? '✅ Сохранено!' : '💾 Сохранить настройки'}
          </button>
        </div>
      </div>
    </div>
  );
}
