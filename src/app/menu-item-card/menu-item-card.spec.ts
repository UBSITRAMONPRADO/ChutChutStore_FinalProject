import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemCardComponent } from './menu-item-card';

describe('MenuItemCard', () => {
  let component: MenuItemCardComponent;
  let fixture: ComponentFixture<MenuItemCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuItemCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
