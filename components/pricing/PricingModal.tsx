'use client';

import { usePricingContext } from "@/contexts/PricingContext";

export default function PricingModal() {
    const {isShowPricingModal} = usePricingContext();

    if (!isShowPricingModal) return null;

    return (
        <div className="z-[9999999999]">Pricing Modal</div>
    )
}