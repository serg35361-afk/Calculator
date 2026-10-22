export interface CalculatorData {
  fenceType: string;
  length: number;
  height: number;
  material: string;
  gates: number;
  wickets: number;
  installation: boolean;
  totalPrice: number;
}

export interface OrderData {
  calculator: CalculatorData;
  date: string;
  slot: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  comment: string;
}

export interface TimeSlot {
  id: string;
  label: string;
  available: boolean;
}
