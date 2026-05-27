export interface FlatPricing {
  name: string;
  price: number;
}

export interface SizeBasedPricing {
  size: string;
  price: number;
}

export interface TierBasedCharge {
  condition: string;
  price: number;
}

export interface AdditionalCharges {
  fixed: number;
  percentage: number;
  tierBased: TierBasedCharge[];
}

export interface PricingTier {
  id: string;
  name: string;
  flatPricing: FlatPricing[];
  sizeBasedPricing: SizeBasedPricing[];
  additionalCharges: AdditionalCharges;
}

export interface PricingData {
  pricingTiers: PricingTier[];
}
