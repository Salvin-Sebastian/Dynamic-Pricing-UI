import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editable-price',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="editable-price" [class.editing]="isEditing()" (click)="startEdit()">
      @if (!isEditing()) {
        <span class="currency">$</span>
        <span class="amount">{{ value() }}</span>
      } @else {
        <div class="input-wrapper">
          <span class="currency-prefix">$</span>
          <input 
            type="number" 
            [ngModel]="editValue()"
            (ngModelChange)="editValue.set($event)"
            (blur)="saveEdit()"
            (keyup.enter)="saveEdit()"
            (keyup.escape)="cancelEdit()"
            autofocus
            class="price-input"
          />
        </div>
      }
    </div>
  `,
  styles: [`
    .editable-price {
      padding: 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      min-width: 60px;
      justify-content: flex-end;
      transition: background-color 0.2s, box-shadow 0.2s;
    }
    
    .editable-price:hover:not(.editing) {
      background-color: rgba(99, 102, 241, 0.1);
    }
    
    .currency {
      color: #6b7280;
      margin-right: 2px;
      font-size: 0.9em;
    }
    
    .amount {
      font-weight: 600;
      color: #111827;
    }
    
    .input-wrapper {
      display: flex;
      align-items: center;
      background: white;
      border: 1px solid #6366f1;
      border-radius: 4px;
      padding: 0 4px;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }
    
    .currency-prefix {
      color: #6b7280;
      font-size: 0.9em;
    }
    
    .price-input {
      border: none;
      outline: none;
      width: 60px;
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
      text-align: right;
      padding: 4px;
    }
    
    /* Remove arrows from number input */
    .price-input::-webkit-outer-spin-button,
    .price-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .price-input[type=number] {
      -moz-appearance: textfield;
    }
  `]
})
export class EditablePriceComponent {
  // Use Signal Inputs for modern Angular
  value = input.required<number>();
  
  // Output event when value is successfully saved
  valueChange = output<number>();
  
  // Internal component state
  isEditing = signal(false);
  editValue = signal<number>(0);

  startEdit() {
    if (!this.isEditing()) {
      this.editValue.set(this.value());
      this.isEditing.set(true);
    }
  }

  saveEdit() {
    if (this.isEditing()) {
      const newVal = this.editValue();
      if (newVal !== this.value() && newVal !== null && newVal !== undefined) {
        this.valueChange.emit(newVal);
      }
      this.isEditing.set(false);
    }
  }

  cancelEdit() {
    this.isEditing.set(false);
  }
}
