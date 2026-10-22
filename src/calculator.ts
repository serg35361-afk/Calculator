import { CalculatorData } from './types';

// Цены за погонный метр
export const FENCE_TYPES: Record<string, { label: string; basePrice: number; icon: string }> = {
  'profiled': { label: 'Профнастил', basePrice: 2500, icon: '🏗️' },
  'mesh': { label: 'Сетка-рабица', basePrice: 1200, icon: '🔗' },
  'eurowicket': { label: 'Евроштакетник', basePrice: 3200, icon: '🪵' },
  'wooden': { label: 'Деревянный', basePrice: 3800, icon: '🌲' },
  'wrought': { label: 'Кованый', basePrice: 6500, icon: '⚒️' },
  'brick': { label: 'Кирпичный', basePrice: 12000, icon: '🧱' },
};

export const MATERIALS: Record<string, { label: string; multiplier: number }> = {
  'standard': { label: 'Стандарт', multiplier: 1 },
  'premium': { label: 'Премиум', multiplier: 1.4 },
  'lux': { label: 'Люкс', multiplier: 1.8 },
};

export const HEIGHT_OPTIONS = [1.5, 1.8, 2.0, 2.5, 3.0];

export const GATE_PRICE = 15000;
export const WICKET_PRICE = 5000;
export const INSTALLATION_RATE = 0.3; // 30% от стоимости материалов

export function calculatePrice(data: {
  fenceType: string;
  length: number;
  height: number;
  material: string;
  gates: number;
  wickets: number;
  installation: boolean;
}): number {
  const fenceConfig = FENCE_TYPES[data.fenceType];
  const materialConfig = MATERIALS[data.material];

  if (!fenceConfig || !materialConfig) return 0;

  // Базовая стоимость забора (зависит от высоты)
  const heightMultiplier = data.height / 1.5;
  const fenceCost = fenceConfig.basePrice * data.length * heightMultiplier * materialConfig.multiplier;

  // Ворота и калитки
  const gatesCost = data.gates * GATE_PRICE * materialConfig.multiplier;
  const wicketsCost = data.wickets * WICKET_PRICE * materialConfig.multiplier;

  // Монтаж
  const installationCost = data.installation 
    ? (fenceCost + gatesCost + wicketsCost) * INSTALLATION_RATE 
    : 0;

  return Math.round(fenceCost + gatesCost + wicketsCost + installationCost);
}

export function getDefaultCalculatorData(): CalculatorData {
  return {
    fenceType: 'profiled',
    length: 20,
    height: 2.0,
    material: 'standard',
    gates: 1,
    wickets: 1,
    installation: true,
    totalPrice: 0,
  };
}
