
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { AppState, Recharge, SimBalance, SimCard } from "@/types";

const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      simCards: [],
      currentSimId: null,
      recharges: [],
      balances: {},
      
      addSimCard: (number: string, name: string) => {
        const newSimCard: SimCard = {
          id: uuidv4(),
          number,
          name,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          simCards: [...state.simCards, newSimCard],
          currentSimId: state.currentSimId || newSimCard.id,
        }));
        
        return newSimCard.id;
      },
      
      setCurrentSim: (id: string) => {
        set({ currentSimId: id });
      },
      
      updateSimCard: (id: string, data: Partial<SimCard>) => {
        set((state) => ({
          simCards: state.simCards.map((sim) =>
            sim.id === id ? { ...sim, ...data } : sim
          ),
        }));
      },
      
      deleteSimCard: (id: string) => {
        set((state) => {
          const newSimCards = state.simCards.filter((sim) => sim.id !== id);
          const newCurrentSimId = state.currentSimId === id
            ? newSimCards.length > 0 ? newSimCards[0].id : null
            : state.currentSimId;
          
          return {
            simCards: newSimCards,
            currentSimId: newCurrentSimId,
            recharges: state.recharges.filter((recharge) => recharge.simId !== id),
          };
        });
      },
      
      addRecharge: (recharge: Omit<Recharge, "id" | "createdAt">) => {
        const newRecharge: Recharge = {
          ...recharge,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          recharges: [...state.recharges, newRecharge],
        }));
        
        return newRecharge.id;
      },
      
      updateRecharge: (id: string, data: Partial<Recharge>) => {
        set((state) => ({
          recharges: state.recharges.map((recharge) =>
            recharge.id === id ? { ...recharge, ...data } : recharge
          ),
        }));
      },
      
      deleteRecharge: (id: string) => {
        set((state) => ({
          recharges: state.recharges.filter((recharge) => recharge.id !== id),
        }));
      },
      
      updateSimBalance: (simId: string, balance: SimBalance) => {
        set((state) => ({
          balances: {
            ...state.balances,
            [simId]: balance,
          },
        }));
      },
      
      getSimById: (id: string | null) => {
        if (!id) return null;
        return get().simCards.find((sim) => sim.id === id) || null;
      },
      
      getCurrentSim: () => {
        const { currentSimId, simCards } = get();
        if (!currentSimId) return null;
        return simCards.find((sim) => sim.id === currentSimId) || null;
      },
      
      getRechargesBySimAndDate: (simId: string, date: string) => {
        return get().recharges.filter(
          (recharge) => recharge.simId === simId && recharge.date === date
        );
      },
      
      getSimBalance: (simId: string) => {
        return get().balances[simId] || null;
      },
      
      getTotalsByDate: (simId: string, date: string) => {
        const recharges = get().getRechargesBySimAndDate(simId, date);
        const total = recharges.reduce((sum, recharge) => sum + recharge.amount, 0);
        const user1Total = recharges
          .filter((recharge) => recharge.forUser1)
          .reduce((sum, recharge) => sum + recharge.amount, 0);
        const user2Total = recharges
          .filter((recharge) => recharge.forUser2)
          .reduce((sum, recharge) => sum + recharge.amount, 0);
        
        return { total, user1Total, user2Total };
      },
      
      getUndeclaredDifference: (simId: string, date: string) => {
        const balance = get().getSimBalance(simId);
        if (!balance) return null;
        
        const { total } = get().getTotalsByDate(simId, date);
        return balance.credit - total;
      },
    }),
    {
      name: "sim-recharge-manager",
    }
  )
);

export default useStore;
