import { Carpet, CarpetServices, CarpetShape, WashType } from './types';

// Цены за кв.м
export const WASH_PRICES: Record<WashType, { label: string; price: number; icon: string; description: string }> = {
  basic: { label: 'Базовая стирка', price: 450, icon: '🫧', description: 'Базовая чистка ковровых покрытий' },
  standard: { label: 'Стандартная стирка', price: 650, icon: '✨', description: 'Глубокая чистка с обработкой' },
  express: { label: 'Экспресс стирка', price: 850, icon: '⚡', description: 'Быстрая чистка с сушкой' },
};

// Дополнительные услуги
export const WET_SURCHARGE = 0.15; // +15%
export const PLASTICINE_PRICE = 100; // руб/кв.м
export const ODOR_PRICE = 100; // руб/кв.м
export const DELIVERY_PRICE = 1000; // фиксированная

export const SHAPES: Record<CarpetShape, { label: string; icon: string }> = {
  rectangle: { label: 'Прямоугольник', icon: '▬' },
  oval: { label: 'Овал', icon: '⬮' },
  circle: { label: 'Круг', icon: '⬤' },
};

// Расчёт площади в зависимости от формы
export function calculateArea(length: number, width: number, shape: CarpetShape): number {
  if (length <= 0 || width <= 0) return 0;
  
  switch (shape) {
    case 'rectangle':
      return length * width;
    case 'oval':
      // Площадь эллипса: π × a × b, где a = length/2, b = width/2
      return Math.PI * (length / 2) * (width / 2);
    case 'circle':
      // Площадь круга: π × r², где r = length/2 (длина = диаметр)
      return Math.PI * Math.pow(length / 2, 2);
    default:
      return length * width;
  }
}

// Расчёт стоимости одного ковра
export function calculateCarpetPrice(carpet: Omit<Carpet, 'price' | 'area'> & { area?: number }): number {
  const area = carpet.area ?? calculateArea(carpet.length, carpet.width, carpet.shape);
  const washPrice = WASH_PRICES[carpet.services.washType].price;
  
  let price = area * washPrice;
  
  // Влажный ковер +15%
  if (carpet.services.isWet) {
    price *= (1 + WET_SURCHARGE);
  }
  
  // Удаление пластилина/слайма
  if (carpet.services.removePlasticine) {
    price += area * PLASTICINE_PRICE;
  }
  
  // Удаление запаха
  if (carpet.services.removeOdor) {
    price += area * ODOR_PRICE;
  }
  
  return Math.round(price);
}

export function calculateCarpetArea(length: number, width: number, shape: CarpetShape): number {
  return Math.round(calculateArea(length, width, shape) * 100) / 100;
}

export function createEmptyCarpet(index: number): Carpet {
  return {
    id: `carpet-${Date.now()}-${index}`,
    name: `Ковёр ${index}`,
    length: 0,
    width: 0,
    shape: 'rectangle',
    services: {
      washType: 'standard',
      isWet: false,
      removePlasticine: false,
      removeOdor: false,
    },
    area: 0,
    price: 0,
  };
}
