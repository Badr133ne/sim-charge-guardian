
export interface SimCard {
  id: string;
  number: string;
  name: string;
  createdAt: string;
}

export interface SimBalance {
  credit: number;
  validityDate: string;
  services: SimService[];
}

export interface SimService {
  name: string;
  minutes?: number;
  data?: number;
  sms?: number;
  details: string;
  expiryDate: string;
}

export interface Recharge {
  id: string;
  simId: string;
  time: string;
  operationId: string;
  amount: number;
  forUser1: boolean;
  forUser2: boolean;
  date: string;
  createdAt: string;
}

export interface RechargesByDate {
  [date: string]: Recharge[];
}

export interface AppState {
  simCards: SimCard[];
  currentSimId: string | null;
  recharges: Recharge[];
  balances: Record<string, SimBalance>;
}
