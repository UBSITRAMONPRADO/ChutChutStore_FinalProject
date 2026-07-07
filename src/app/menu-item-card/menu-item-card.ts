import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from '../cart-services';

@Component({
  selector: 'app-menu-item-card',
  imports: [],
  templateUrl: './menu-item-card.html',
  styleUrl: './menu-item-card.css'
})
export class MenuItemCardComponent {
  @Input() item!: MenuItem;
  @Output() addToCart = new EventEmitter<MenuItem>();

  onAdd(): void {
    this.addToCart.emit(this.item);
  }
}