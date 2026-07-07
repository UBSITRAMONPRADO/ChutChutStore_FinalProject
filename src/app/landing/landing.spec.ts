import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<< HEAD
import { LandingComponent } from './landing';

describe('Landing', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
=======
import { Landing } from './landing';

describe('Landing', () => {
  let component: Landing;
  let fixture: ComponentFixture<Landing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Landing],
    }).compileComponents();

    fixture = TestBed.createComponent(Landing);
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
