
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { AppState, Recharge, SimBalance, SimCard } from "@/types";
import { toast } from "sonner";

const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      simCards: [],
      currentSimId: null,
      recharges: [],
      balances: {},
      user: null,
      
      addSimCard: (number: string, name: string, user1Number = 'User 1', user2Number = 'User 2') => {
        const newSimCard: SimCard = {
          id: uuidv4(),
          number,
          name,
          createdAt: new Date().toISOString(),
          user1Number,
          user2Number,
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
        const sim = get().getSimById(simId);
        
        const total = recharges.reduce((sum, recharge) => sum + recharge.amount, 0);
        const user1Total = recharges
          .filter((recharge) => recharge.forUser1)
          .reduce((sum, recharge) => sum + recharge.amount, 0);
        const user2Total = recharges
          .filter((recharge) => recharge.forUser2)
          .reduce((sum, recharge) => sum + recharge.amount, 0);
        
        return { 
          total, 
          user1Total, 
          user2Total,
          user1Number: sim?.user1Number || 'User 1',
          user2Number: sim?.user2Number || 'User 2',
        };
      },
      
      getUndeclaredDifference: (simId: string, date: string) => {
        const balance = get().getSimBalance(simId);
        if (!balance) return null;
        
        const { total } = get().getTotalsByDate(simId, date);
        return balance.credit - total;
      },
      
      // Authentication methods
      login: (username: string) => {
        set({ 
          user: {
            id: uuidv4(),
            username,
            isLoggedIn: true
          }
        });
        toast.success(`Welcome, ${username}!`);
      },
      
      logout: () => {
        set({ user: null });
        toast.info("You've been logged out");
      },
      
      isLoggedIn: () => {
        return get().user !== null && get().user?.isLoggedIn === true;
      },
      
      // Real SIM balance fetch function (mobile-only)
      fetchRealSimBalance: async () => {
        const { currentSimId } = get();
        
        if (!currentSimId) {
          toast.error("Please select a SIM card first");
          return;
        }
        
        try {
          // Check if running in a browser or mobile environment
          if (typeof navigator === "undefined" || !navigator.permissions) {
            toast.error("This feature is only available on mobile devices");
            return;
          }

          // Most browsers don't provide direct access to SIM information
          // This would typically require a Capacitor/Cordova plugin in a real mobile app
          toast.info("Attempting to read SIM balance...");
          
          // In reality, this is a placeholder - in a production app you would:
          // 1. Use a Capacitor plugin to access the SIM information
          // 2. Or use a USSD code to query the balance (carrier-specific)
          // 3. Or parse SMS messages containing balance information
          
          setTimeout(() => {
            toast.info("For security reasons, browsers cannot directly access SIM card data");
            toast.info("This would require a Capacitor/Cordova plugin in a production app");
          }, 2000);
          
        } catch (error) {
          console.error("Error accessing SIM information:", error);
          toast.error("Could not access SIM information");
        }
      }
    }),
    {
      name: "sim-recharge-manager",
    }
  )
);

export default useStore;
