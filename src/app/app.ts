import { Component } from '@angular/core';
import { PricingDashboardComponent } from './components/pricing-dashboard/pricing-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PricingDashboardComponent],
  template: `<app-pricing-dashboard></app-pricing-dashboard>`,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background-color: #f8fafc; /* light background to match UI */
      }
    `,
  ],
})
export class App {}
