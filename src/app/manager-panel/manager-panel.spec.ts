import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerPanelComponent } from './manager-panel';

describe('ManagerPanel', () => {
  let component: ManagerPanelComponent;
  let fixture: ComponentFixture<ManagerPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerPanelComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
