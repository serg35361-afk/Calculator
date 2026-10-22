import React from 'react';
import { CalculatorData } from './types';
import { FENCE_TYPES, MATERIALS, HEIGHT_OPTIONS, calculatePrice } from './calculator';

interface Props {
  data: CalculatorData;
  onChange: (data: CalculatorData) => void;
}

export default function Calculator({ data, onChange }: Props) {
  const update = (partial: Partial<CalculatorData>) => {
    const newData = { ...data, ...partial };
    newData.totalPrice = calculatePrice(newData);
    onChange(newData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-3xl">🧮</span> Калькулятор забора
      </h2>

      {/* Тип забора */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Тип забора</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(FENCE_TYPES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => update({ fenceType: key })}
              className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                data.fenceType === key
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl block mb-1">{val.icon}</span>
              <span className="text-sm font-medium text-gray-800">{val.label}</span>
              <span className="text-xs text-gray-500 block">{val.basePrice.toLocaleString('ru-RU')} ₽/м</span>
            </button>
          ))}
        </div>
      </div>

      {/* Длина и высота */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Длина забора (м): <span className="text-blue-600">{data.length}</span>
          </label>
          <input
            type="range"
            min={5}
            max={200}
            step={1}
            value={data.length}
            onChange={(e) => update({ length: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>5 м</span>
            <span>200 м</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Высота забора (м)</label>
          <div className="flex gap-2 flex-wrap">
            {HEIGHT_OPTIONS.map((h) => (
              <button
                key={h}
                onClick={() => update({ height: h })}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  data.height === h
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Материал */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Качество материала</label>
        <div className="flex gap-3 flex-wrap">
          {Object.entries(MATERIALS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => update({ material: key })}
              className={`px-5 py-3 rounded-xl font-medium transition-all ${
                data.material === key
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {val.label}
              <span className="text-xs block opacity-75">×{val.multiplier}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Ворота и калитки */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ворота: <span className="text-blue-600">{data.gates} шт.</span>
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => update({ gates: Math.max(0, data.gates - 1) })}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold transition"
            >
              −
            </button>
            <span className="text-xl font-bold w-8 text-center">{data.gates}</span>
            <button
              onClick={() => update({ gates: Math.min(5, data.gates + 1) })}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold transition"
            >
              +
            </button>
            <span className="text-xs text-gray-400 ml-2">15 000 ₽/шт</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Калитки: <span className="text-blue-600">{data.wickets} шт.</span>
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => update({ wickets: Math.max(0, data.wickets - 1) })}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold transition"
            >
              −
            </button>
            <span className="text-xl font-bold w-8 text-center">{data.wickets}</span>
            <button
              onClick={() => update({ wickets: Math.min(5, data.wickets + 1) })}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold transition"
            >
              +
            </button>
            <span className="text-xs text-gray-400 ml-2">5 000 ₽/шт</span>
          </div>
        </div>
      </div>

      {/* Монтаж */}
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.installation}
            onChange={(e) => update({ installation: e.target.checked })}
            className="w-5 h-5 rounded accent-blue-600"
          />
          <span className="text-sm font-semibold text-gray-700">
            Включить монтаж (+30% от стоимости)
          </span>
        </label>
      </div>

      {/* Итого */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium opacity-90">Итого:</span>
          <span className="text-3xl font-bold">
            {data.totalPrice.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </div>
    </div>
  );
}
