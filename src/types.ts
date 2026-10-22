export type CarpetShape = 'rectangle' | 'oval' | 'circle';

export type WashType = 'basic' | 'standard' | 'express';

export interface CarpetServices {
  washType: WashType;
  isWet: boolean;
  removePlasticine: boolean;
  removeOdor: boolean;
}

export interface Carpet {
  id: string;
  name: string;
  length: number;   // метры, с точностью до 0.01
  width: number;    // метры, с точностью до 0.01
  shape: CarpetShape;
  services: CarpetServices;
  area: number;
  price: number;
}

export interface OrderData {
  carpets: Carpet[];
  delivery: boolean;
  totalCarpetsPrice: number;
  deliveryPrice: number;
  totalPrice: number;
  date: string;
  slot: string;
  name: string;
  phone: string;
  address: string;
}

export interface TimeSlot {
  id: string;
  label: string;
  available: boolean;
}
