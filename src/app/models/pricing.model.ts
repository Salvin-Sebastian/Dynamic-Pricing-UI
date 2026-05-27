export type PriceValue = number | string;

export interface SizeTier {
  size: number;
  price: PriceValue[];
}

export interface AdditionalChargeSize {
  size_tier: number[];
  percentage: PriceValue[];
}

export interface FixedCharge {
  price: number;
}

export interface PercentageCharge {
  percentage: number;
}

export interface VelcroCharge {
  price: number[];
  size_tier: number[];
}

export interface StitchOvercharge {
  over: number;
  every: number;
  price: number;
}

export interface PressureSensitiveCharge {
  price: number[];
  size_tier: number[];
}

export interface NoOfColorOvercharge {
  over: number;
  price: number;
}

export interface RuiAdditionalCharge {
  size?: AdditionalChargeSize;
  blunt_corners?: FixedCharge;
  square_corners?: FixedCharge;
  irregular_shape?: PercentageCharge;
  metallic_merrow?: FixedCharge;
  metallic_thread?: FixedCharge;
  velcro_one_side?: VelcroCharge;
  velcro_two_side?: VelcroCharge;
  stitch_overcharge?: StitchOvercharge;
  pressure_sensitive?: PressureSensitiveCharge;
  sharp_round_corners?: FixedCharge;
  metallic_merrow_thread?: FixedCharge;
  no_of_color_overcharge?: NoOfColorOvercharge;
}

export interface FrCategory {
  discount: number;
  item_tier: number[];
  size_tier: SizeTier[];
  additional_charge: RuiAdditionalCharge;
}

export interface StandardCategory {
  price: PriceValue[];
  discount: number;
  item_tier: number[];
}

export interface RuiData {
  fr: FrCategory;
  fancy: StandardCategory;
  hi_vis: StandardCategory;
  default: StandardCategory;
  inserts: StandardCategory;
  reflective: StandardCategory;
  fancy_inserts: StandardCategory;
  additional_charge: RuiAdditionalCharge;
}

export interface EmbroideredSpecials {
  rui: RuiData;
}

export interface PricingDataRoot {
  data: {
    embroidered_specials: EmbroideredSpecials;
  };
}
