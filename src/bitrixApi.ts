import { OrderData, Carpet } from './types';
import { WASH_PRICES, SHAPES, DELIVERY_PRICE } from './carpetCalculator';

const BITRIX_WEBHOOK_URL = 'BITRIX_WEBHOOK_URL';

export function getWebhookUrl(): string {
  return localStorage.getItem(BITRIX_WEBHOOK_URL) || '';
}

export function setWebhookUrl(url: string): void {
  localStorage.setItem(BITRIX_WEBHOOK_URL, url);
}

function formatCarpetInfo(carpet: Carpet, index: number): string {
  const washInfo = WASH_PRICES[carpet.services.washType];
  const shapeInfo = SHAPES[carpet.shape];
  
  const lines = [
    `  Ковёр ${index + 1}: "${carpet.name}"`,
    `    Форма: ${shapeInfo.label}`,
    `    Размер: ${carpet.length} × ${carpet.width} м`,
    `    Площадь: ${carpet.area.toFixed(2)} м²`,
    `    Стирка: ${washInfo.label} (${washInfo.price} ₽/м²)`,
  ];

  const extras: string[] = [];
  if (carpet.services.isWet) extras.push('Влажный (+15%)');
  if (carpet.services.removePlasticine) extras.push('Удаление пластилина/слайма');
  if (carpet.services.removeOdor) extras.push('Удаление запаха');
  
  if (extras.length > 0) {
    lines.push(`    Доп. услуги: ${extras.join(', ')}`);
  }
  
  lines.push(`    Стоимость: ${carpet.price.toLocaleString('ru-RU')} ₽`);
  
  return lines.join('\n');
}

export function formatOrderComment(data: OrderData): string {
  const lines = [
    '=== ЗАКАЗ НА ХИМЧИСТКУ КОВРОВ ===',
    '',
    '--- КОВРЫ ---',
  ];

  data.carpets.forEach((carpet, index) => {
    lines.push(formatCarpetInfo(carpet, index));
    lines.push('');
  });

  lines.push('--- ДОСТАВКА ---');
  lines.push(`Доставка: ${data.delivery ? 'Да' : 'Нет'}${data.delivery ? ` (${DELIVERY_PRICE} ₽)` : ''}`);
  lines.push('');

  lines.push('--- ИТОГО ---');
  lines.push(`Стоимость ковров: ${data.totalCarpetsPrice.toLocaleString('ru-RU')} ₽`);
  if (data.delivery) {
    lines.push(`Доставка: ${data.deliveryPrice.toLocaleString('ru-RU')} ₽`);
  }
  lines.push(`Общая стоимость: ${data.totalPrice.toLocaleString('ru-RU')} ₽`);
  lines.push('');

  lines.push('--- ДАТА И СЛОТ ЗАБОРА ---');
  lines.push(`Дата забора: ${data.date}`);
  lines.push(`Слот забора: ${data.slot}`);
  lines.push('');

  lines.push('--- КОНТАКТНЫЕ ДАННЫЕ ---');
  lines.push(`Имя: ${data.name}`);
  lines.push(`Телефон: ${data.phone}`);
  lines.push(`Адрес: ${data.address}`);

  return lines.join('\n');
}

export async function createBitrixLead(data: OrderData): Promise<{ success: boolean; leadId?: number; error?: string }> {
  const webhookUrl = getWebhookUrl();
  
  if (!webhookUrl) {
    return { success: false, error: 'URL вебхука Битрикс24 не настроен. Откройте настройки (⚙️) и укажите вебхук.' };
  }

  const comment = formatOrderComment(data);

  const leadFields = {
    fields: {
      TITLE: `Химчистка ковров — ${data.name}`,
      NAME: data.name.split(' ')[0] || data.name,
      LAST_NAME: data.name.split(' ').slice(1).join(' ') || '',
      PHONE: [{ VALUE: data.phone, VALUE_TYPE: 'WORK' }],
      COMMENTS: comment,
      SOURCE_ID: 'WEB',
      STATUS_ID: 'NEW',
      OPENED: 'Y',
      UF_CRM_DATE_ZABORA: data.date,
      UF_CRM_SLOT_ZABORA: data.slot,
      UF_CRM_TOTAL_PRICE: data.totalPrice.toString(),
      UF_CRM_ADDRESS: data.address,
    }
  };

  try {
    const response = await fetch(`${webhookUrl}/crm.lead.add.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadFields),
    });

    const result = await response.json();

    if (result.result) {
      return { success: true, leadId: result.result };
    } else {
      return { 
        success: false, 
        error: result.error_description || result.error || 'Неизвестная ошибка при создании лида' 
      };
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Ошибка сети. Проверьте подключение к интернету.' };
  }
}
