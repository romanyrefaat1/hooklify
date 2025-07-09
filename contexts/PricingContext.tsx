"use client";

import { createContext, useContext, useState } from "react";

const PricingContext = createContext({
    isShowPricingModal: false,
    showPricingModal: () => {},
});

export default function PricingProvider({children}: {children: React.ReactNode}) {
    const [isShowPricingModal, setIsShowPricingModal] = useState(false);

    const showPricingModal = () => {
        setIsShowPricingModal(true);
    }
    
    return (
        <PricingContext.Provider value={{isShowPricingModal, showPricingModal}}>
            {children}
        </PricingContext.Provider>
    )
}

export function usePricingContext() {
    const ctx = useContext(PricingContext);
    if (!ctx) throw new Error("usePricingContext must be used within a PricingProvider");

    return ctx;
}