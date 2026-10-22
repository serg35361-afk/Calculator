import { OrderData } from './types';

const BITRIX_WEBHOOK_URL = 'BITRIX_WEBHOOK_URL';

export function getWebhookUrl(): string {
  return localStorage.getItem(BITRIX_WEBHOOK_URL) || '';
}

export function setWebhookUrl(url: string): void {
  localStorage.setItem(BITRIX_WEBHOOK_URL, url);
}

export function formatOrderComment(data: OrderData): string {
  const lines = [
    '=== ДАННЫЕ КАЛЬКУЛЯТОРА ===',
    `Тип забора: ${data.calculator.fenceType}`,
    `Длина: ${data.calculator.length} м`,
    `Высота: ${data.calculator.height} м`,
    `Материал: ${data.calculator.material}`,
    `Ворота: ${data.calculator.gates} шт.`,
    `Калитки: ${data.calculator.wickets} шт.`,
    `Монтаж: ${data.calculator.installation ? 'Да' : 'Нет'}`,
    `Итого: ${data.calculator.totalPrice.toLocaleString('ru-RU')} ₽`,
    '',
    '=== ДАТА И СЛОТ ЗАБОРА ===',
    `Дата забора: ${data.date}`,
    `Слот забора: ${data.slot}`,
    '',
    '=== КОНТАКТНЫЕ ДАННЫЕ ===',
    `Имя: ${data.name}`,
    `Телефон: ${data.phone}`,
    `Email: ${data.email}`,
    `Адрес: ${data.address}`,
    data.comment ? `Комментарий: ${data.comment}` : '',
  ];

  return lines.filter(l => l !== undefined).join('\n');
}

export async function createBitrixLead(data: OrderData): Promise<{ success: boolean; leadId?: number; error?: string }> {
  const webhookUrl = getWebhookUrl();
  
  if (!webhookUrl) {
    return { success: false, error: 'URL вебхука Битрикс24 не настроен' };
  }

  const comment = formatOrderComment(data);

  const leadFields = {
    fields: {
      TITLE: `Заявка на забор — ${data.name}`,
      NAME: data.name.split(' ')[0] || data.name,
      LAST_NAME: data.name.split(' ').slice(1).join(' ') || '',
      PHONE: [{ VALUE: data.phone, VALUE_TYPE: 'WORK' }],
      EMAIL: [{ VALUE: data.email, VALUE_TYPE: 'WORK' }],
      COMMENTS: comment,
      SOURCE_ID: 'WEB',
      STATUS_ID: 'NEW',
      OPENED: 'Y',
      UF_CRM_DATE_ZABORA: data.date,
      UF_CRM_SLOT_ZABORA: data.slot,
      UF_CRM_TOTAL_PRICE: data.calculator.totalPrice.toString(),
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
        error: result.error_description || result.error || 'Неизвестная ошибка' 
      };
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Ошибка сети' };
  }
}
