import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PricingTier, PricingData } from '../models/pricing.model';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  private http = inject(HttpClient);
  
  // Primary state signal
  public pricingTiers = signal<PricingTier[]>([]);
  public loading = signal<boolean>(true);
  public error = signal<string | null>(null);

  constructor() {}

  loadPricingData() {
    this.loading.set(true);
    this.http.get<PricingData>('/Pricing.json').pipe(
      tap(data => {
        if (data && data.pricingTiers) {
          this.pricingTiers.set(data.pricingTiers);
        }
        this.loading.set(false);
      }),
      catchError(err => {
        this.error.set('Failed to load pricing data.');
        this.loading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  // Column management
  addColumn(newTier: PricingTier) {
    this.pricingTiers.update(tiers => [...tiers, newTier]);
  }

  removeColumn(tierId: string) {
    this.pricingTiers.update(tiers => tiers.filter(t => t.id !== tierId));
  }

  // Update specific tier property
  updateTierName(tierId: string, newName: string) {
    this.pricingTiers.update(tiers => 
      tiers.map(tier => tier.id === tierId ? { ...tier, name: newName } : tier)
    );
  }

  // Cell updates
  updateFlatPrice(tierId: string, index: number, newPrice: number) {
    this.pricingTiers.update(tiers => tiers.map(tier => {
      if (tier.id === tierId) {
        const flatPricing = [...tier.flatPricing];
        flatPricing[index] = { ...flatPricing[index], price: newPrice };
        return { ...tier, flatPricing };
      }
      return tier;
    }));
  }

  updateSizeBasedPrice(tierId: string, index: number, newPrice: number) {
    this.pricingTiers.update(tiers => tiers.map(tier => {
      if (tier.id === tierId) {
        const sizeBasedPricing = [...tier.sizeBasedPricing];
        sizeBasedPricing[index] = { ...sizeBasedPricing[index], price: newPrice };
        return { ...tier, sizeBasedPricing };
      }
      return tier;
    }));
  }

  updateAdditionalChargeFixed(tierId: string, newPrice: number) {
    this.pricingTiers.update(tiers => tiers.map(tier => {
      if (tier.id === tierId) {
        return { 
          ...tier, 
          additionalCharges: { ...tier.additionalCharges, fixed: newPrice } 
        };
      }
      return tier;
    }));
  }

  updateAdditionalChargePercentage(tierId: string, newPercentage: number) {
    this.pricingTiers.update(tiers => tiers.map(tier => {
      if (tier.id === tierId) {
        return { 
          ...tier, 
          additionalCharges: { ...tier.additionalCharges, percentage: newPercentage } 
        };
      }
      return tier;
    }));
  }

  updateAdditionalChargeTierBased(tierId: string, index: number, newPrice: number) {
    this.pricingTiers.update(tiers => tiers.map(tier => {
      if (tier.id === tierId) {
        const tierBased = [...tier.additionalCharges.tierBased];
        tierBased[index] = { ...tierBased[index], price: newPrice };
        return { 
          ...tier, 
          additionalCharges: { ...tier.additionalCharges, tierBased } 
        };
      }
      return tier;
    }));
  }
}
