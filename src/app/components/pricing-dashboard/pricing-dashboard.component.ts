import { Component, inject, OnInit } from '@angular/core';
import { PricingService } from '../../services/pricing.service';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { EditablePriceComponent } from '../editable-price/editable-price.component';
import { RuiData, StandardCategory, PriceValue } from '../../models/pricing.model';

@Component({
  selector: 'app-pricing-dashboard',
  standalone: true,
  imports: [CommonModule, EditablePriceComponent],
  template: `
    <div class="dashboard-container">
      <header class="header">
        <h1>Dynamic Pricing Management</h1>
      </header>
      
      @if (pricingService.loading()) {
        <div class="loader-container">
          <div class="loader"></div>
          <p>Loading pricing data...</p>
        </div>
      } @else if (pricingService.error()) {
        <div class="error-container">
          <p>{{ pricingService.error() }}</p>
        </div>
      } @else if (pricingService.ruiData()) {
        
        <div class="accordion">
          <!-- FR Section (2D Grid) -->
          <div class="accordion-item" [class.open]="openState['fr']">
            <div class="accordion-header" (click)="toggleAccordion('fr')">
              FR
              <span class="icon">{{ openState['fr'] ? '-' : '+' }}</span>
            </div>
            @if (openState['fr']) {
              <div class="accordion-body">
                <div class="discount-section">
                  <label>Discount <span class="required">*</span></label>
                  <app-editable-price 
                    [value]="pricingService.ruiData()!.fr.discount" 
                    (valueChange)="pricingService.updateDiscount('fr', $event)">
                  </app-editable-price>
                </div>
                
                <div class="pricing-grid-container">
                  <!-- Header Row: Item Tiers -->
                  <div class="grid-row header-row" [style.grid-template-columns]="getGridCols(pricingService.ruiData()!.fr.item_tier.length)">
                    <div class="grid-cell col-header condition-header">Size / Items</div>
                    @for (tier of pricingService.ruiData()!.fr.item_tier; track $index) {
                      <div class="grid-cell col-header">
                        <app-editable-price 
                          [value]="tier" 
                          (valueChange)="pricingService.updateItemTier('fr', $index, $event)">
                        </app-editable-price>
                      </div>
                    }
                  </div>
                  
                  <!-- Body Rows: Sizes -->
                  @for (sizeTier of pricingService.ruiData()!.fr.size_tier; track sizeTierIndex; let sizeTierIndex = $index) {
                    <div class="grid-row price-values" [style.grid-template-columns]="getGridCols(pricingService.ruiData()!.fr.item_tier.length)">
                      <div class="grid-cell label">{{ sizeTier.size }}</div>
                      @for (price of sizeTier.price; track priceIndex; let priceIndex = $index) {
                        <div class="grid-cell">
                          <app-editable-price 
                            [value]="price" 
                            (valueChange)="pricingService.updateFrPrice(sizeTierIndex, priceIndex, $event)">
                          </app-editable-price>
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Standard Sections -->
          @for (cat of standardCategories; track cat) {
            <div class="accordion-item" [class.open]="openState[cat]">
              <div class="accordion-header" (click)="toggleAccordion(cat)">
                {{ cat | uppercase }}
                <span class="icon">{{ openState[cat] ? '-' : '+' }}</span>
              </div>
              @if (openState[cat]) {
                <div class="accordion-body">
                  <div class="discount-section">
                    <label>Discount <span class="required">*</span></label>
                    <app-editable-price 
                      [value]="$any(pricingService.ruiData())[cat].discount" 
                      (valueChange)="pricingService.updateDiscount(cat, $event)">
                    </app-editable-price>
                  </div>
                  
                  <div class="pricing-grid-container">
                    <div class="grid-row header-row" [style.grid-template-columns]="getGridCols($any(pricingService.ruiData())[cat].item_tier.length)">
                      <div class="grid-cell col-header condition-header">Items</div>
                      @for (tier of $any(pricingService.ruiData())[cat].item_tier; track $index) {
                        <div class="grid-cell col-header">
                          <app-editable-price 
                            [value]="tier" 
                            (valueChange)="pricingService.updateItemTier(cat, $index, $event)">
                          </app-editable-price>
                        </div>
                      }
                    </div>
                    
                    <div class="grid-row price-values" [style.grid-template-columns]="getGridCols($any(pricingService.ruiData())[cat].price.length)">
                      <div class="grid-cell label">Price</div>
                      @for (price of $any(pricingService.ruiData())[cat].price; track $index) {
                        <div class="grid-cell">
                          <app-editable-price 
                            [value]="price" 
                            (valueChange)="pricingService.updateStandardCategoryPrice(cat, $index, $event)">
                          </app-editable-price>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './pricing-dashboard.component.css'
})
export class PricingDashboardComponent implements OnInit {
  pricingService = inject(PricingService);
  
  openState: Record<string, boolean> = { fr: true };
  
  standardCategories: (keyof RuiData)[] = [
    'fancy', 'hi_vis', 'default', 'inserts', 'reflective', 'fancy_inserts'
  ];

  ngOnInit() {
    this.pricingService.loadPricingData();
  }

  toggleAccordion(id: string) {
    this.openState[id] = !this.openState[id];
  }
  
  getGridCols(count: number): string {
    return `120px repeat(${count}, 1fr)`;
  }
}
