import { Component, inject, OnInit } from '@angular/core';
import { PricingService } from '../../services/pricing.service';
import { CommonModule } from '@angular/common';
import { EditablePriceComponent } from '../editable-price/editable-price.component';

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
      } @else {
        <!-- Accordions -->
        <div class="accordion">
          <!-- DEFAULT Section -->
          <div class="accordion-item" [class.open]="isDefaultOpen">
            <div class="accordion-header" (click)="isDefaultOpen = !isDefaultOpen">
              DEFAULT 
              <span class="icon">{{ isDefaultOpen ? '-' : '+' }}</span>
            </div>
            @if (isDefaultOpen) {
              <div class="accordion-body">
                <button class="add-btn" (click)="addColumn()">+ Add Column</button>
                
                <div class="pricing-grid-container">
                  <!-- Columns Headers -->
                  <div class="grid-row header-row">
                    @for (col of defaultColumns; track $index) {
                      <div class="grid-cell col-header">
                        <button class="remove-col-btn" (click)="removeColumn($index)">✖</button>
                        <app-editable-price 
                          [value]="col" 
                          (valueChange)="updateColumnQuantity($index, $event)">
                        </app-editable-price>
                      </div>
                    }
                  </div>
                  
                  <!-- Price Row -->
                  <div class="grid-row price-labels">
                    @for (col of defaultColumns; track $index) {
                      <div class="grid-cell label">Price</div>
                    }
                  </div>
                  <div class="grid-row price-values">
                    @for (price of defaultPrices; track $index) {
                      <div class="grid-cell">
                        <app-editable-price 
                          [value]="price" 
                          (valueChange)="updateColumnPrice($index, $event)">
                        </app-editable-price>
                      </div>
                    }
                  </div>
                </div>

                <div class="discount-section">
                  <label>Discount <span class="required">*</span></label>
                  <app-editable-price 
                    [value]="defaultDiscount" 
                    (valueChange)="defaultDiscount = $event">
                  </app-editable-price>
                </div>
              </div>
            }
          </div>

          <!-- INSERTS Section -->
          <div class="accordion-item">
            <div class="accordion-header">
              INSERTS <span class="icon">+</span>
            </div>
          </div>
          
          <!-- FR Section -->
          <div class="accordion-item">
            <div class="accordion-header">
              FR <span class="icon">+</span>
            </div>
          </div>

          <!-- ADDITIONAL CHARGE Section -->
          <div class="accordion-item" [class.open]="isAdditionalChargeOpen">
            <div class="accordion-header" (click)="isAdditionalChargeOpen = !isAdditionalChargeOpen">
              ADDITIONAL CHARGE <span class="icon">{{ isAdditionalChargeOpen ? '-' : '+' }}</span>
            </div>
            @if (isAdditionalChargeOpen) {
              <div class="accordion-body">
                <div class="charge-item">
                  <h4>Blunt Corners</h4>
                  <label>Price <span class="required">*</span></label>
                  <app-editable-price [value]="0.14" (valueChange)="0"></app-editable-price>
                </div>
                
                <div class="charge-item">
                  <h4>Square Corners</h4>
                  <label>Price <span class="required">*</span></label>
                  <app-editable-price [value]="0.14" (valueChange)="0"></app-editable-price>
                </div>
                
                <div class="charge-item">
                  <h4>Irregular Shape</h4>
                  <label>Percentage <span class="required">*</span></label>
                  <app-editable-price [value]="20" (valueChange)="0"></app-editable-price>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './pricing-dashboard.component.css'
})
export class PricingDashboardComponent implements OnInit {
  pricingService = inject(PricingService);
  
  isDefaultOpen = true;
  isAdditionalChargeOpen = true;

  // Mock state to reflect the UI until we parse the real 700-line JSON
  defaultColumns = [1, 5, 6, 12, 25, 26, 50, 75];
  defaultPrices = [4.52, 4.52, 2.89, 2.89, 2.89, 2.61, 1.98, 1.50];
  defaultDiscount = 6;

  ngOnInit() {
    // We will hook this up to the real service once the 700-line JSON is available
    // this.pricingService.loadPricingData();
    this.pricingService.loading.set(false);
  }

  addColumn() {
    this.defaultColumns.push(100); // Default placeholder
    this.defaultPrices.push(0.0);
  }

  removeColumn(index: number) {
    this.defaultColumns.splice(index, 1);
    this.defaultPrices.splice(index, 1);
  }

  updateColumnQuantity(index: number, newQty: number) {
    this.defaultColumns[index] = newQty;
  }

  updateColumnPrice(index: number, newPrice: number) {
    this.defaultPrices[index] = newPrice;
  }
}
