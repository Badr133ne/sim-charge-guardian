
export interface SimCard {
  id: string;
  number: string;
  name: string;
  createdAt: string;
  user1Number?: string;
  user2Number?: string;
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

export interface User {
  id: string;
  username: string;
  isLoggedIn: boolean;
}

export interface AppState {
  simCards: SimCard[];
  currentSimId: string | null;
  recharges: Recharge[];
  balances: Record<string, SimBalance>;
  user: User | null;
  
  // Add missing methods to fix TypeScript errors
  addSimCard: (number: string, name: string, user1Number?: string, user2Number?: string) => string;
  setCurrentSim: (id: string) => void;
  updateSimCard: (id: string, data: Partial<SimCard>) => void;
  deleteSimCard: (id: string) => void;
  addRecharge: (recharge: Omit<Recharge, "id" | "createdAt">) => string;
  updateRecharge: (id: string, data: Partial<Recharge>) => void;
  deleteRecharge: (id: string) => void;
  updateSimBalance: (simId: string, balance: SimBalance) => void;
  getSimById: (id: string | null) => SimCard | null;
  getCurrentSim: () => SimCard | null;
  getRechargesBySimAndDate: (simId: string, date: string) => Recharge[];
  getSimBalance: (simId: string) => SimBalance | null;
  getTotalsByDate: (simId: string, date: string) => { 
    total: number, 
    user1Total: number, 
    user2Total: number, 
    user1Number?: string, 
    user2Number?: string 
  };
  getUndeclaredDifference: (simId: string, date: string) => number | null;
  
  // Auth methods
  login: (username: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
  
  // Real SIM balance
  fetchRealSimBalance: () => Promise<void>;
}
