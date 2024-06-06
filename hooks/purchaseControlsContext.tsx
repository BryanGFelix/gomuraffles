import { createContext, useContext, useState } from "react";

interface PurchaseControlContextInterface {
    numTicketsHeldContext: number,
    setNumTicketsHeldContext: (value: number) => void;
}

const PurchaseControlsContext = createContext<PurchaseControlContextInterface | undefined>(undefined);

export const usePurchaseControlsContext = () => {
  const context = useContext(PurchaseControlsContext);
  if (context === undefined) {
    throw new Error("usePurchaseControlsContext must be used within a PurchaseControlsProvider");
  }
  return context;
};

export const PurchaseControlsProvider: React.FC = ({ children, numTicketsHeld }) => {
    const [numTicketsHeldContext, setNumTicketsHeldContext] = useState<number>(numTicketsHeld || 0);
  
    return (
      <PurchaseControlsContext.Provider value={{ numTicketsHeldContext, setNumTicketsHeldContext }}>
        {children}
      </PurchaseControlsContext.Provider>
    );
  };

export default PurchaseControlsContext;