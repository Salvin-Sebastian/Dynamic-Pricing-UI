import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PricingDataRoot, RuiData, PriceValue } from '../models/pricing.model';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  private http = inject(HttpClient);
  
  // Primary state signal
  public ruiData = signal<RuiData | null>(null);
  public loading = signal<boolean>(true);
  public error = signal<string | null>(null);

  constructor() {}

  loadPricingData() {
    this.loading.set(true);
    this.http.get<PricingDataRoot>('/Pricing.json').pipe(
      tap(data => {
        if (data && data.data && data.data.embroidered_specials && data.data.embroidered_specials.rui) {
          this.ruiData.set(data.data.embroidered_specials.rui);
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

  // --- Example granular updates (can be expanded as needed) ---

  // Standard category price updates
  updateStandardCategoryPrice(category: keyof RuiData, index: number, newPrice: PriceValue) {
    this.ruiData.update(data => {
      if (!data) return data;
      const targetCategory = data[category];
      // Only valid for standard categories containing a 'price' array
      if (targetCategory && 'price' in targetCategory && Array.isArray(targetCategory.price)) {
        const updatedPrices = [...targetCategory.price];
        updatedPrices[index] = newPrice;
        return {
          ...data,
          [category]: {
            ...targetCategory,
            price: updatedPrices
          }
        };
      }
      return data;
    });
  }

  // FR Category Price updates (2D grid)
  updateFrPrice(sizeIndex: number, itemIndex: number, newPrice: PriceValue) {
    this.ruiData.update(data => {
      if (!data || !data.fr) return data;
      const updatedSizeTiers = [...data.fr.size_tier];
      const targetSize = { ...updatedSizeTiers[sizeIndex] };
      const updatedPrices = [...targetSize.price];
      
      updatedPrices[itemIndex] = newPrice;
      targetSize.price = updatedPrices;
      updatedSizeTiers[sizeIndex] = targetSize;
      
      return {
        ...data,
        fr: {
          ...data.fr,
          size_tier: updatedSizeTiers
        }
      };
    });
  }

  // Update item tiers (columns)
  updateItemTier(category: keyof RuiData, index: number, newTier: PriceValue) {
    this.ruiData.update(data => {
      if (!data) return data;
      const targetCategory = data[category];
      if (targetCategory && 'item_tier' in targetCategory && Array.isArray(targetCategory.item_tier)) {
        const updatedTiers = [...targetCategory.item_tier];
        // Parse numbers when possible, but allow strings if the user types them
        updatedTiers[index] = typeof newTier === 'string' && !isNaN(Number(newTier)) ? Number(newTier) : newTier as number;
        return {
          ...data,
          [category]: {
            ...targetCategory,
            item_tier: updatedTiers
          }
        };
      }
      return data;
    });
  }

  updateDiscount(category: keyof RuiData, newDiscount: PriceValue) {
    this.ruiData.update(data => {
      if (!data) return data;
      const targetCategory = data[category];
      if (targetCategory && 'discount' in targetCategory) {
        return {
          ...data,
          [category]: {
            ...targetCategory,
            discount: typeof newDiscount === 'string' ? Number(newDiscount) : newDiscount
          }
        };
      }
      return data;
    });
  }
}
