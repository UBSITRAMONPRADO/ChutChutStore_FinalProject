import { TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { AppComponent } from './app';
=======
import { App } from './app';
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
<<<<<<< HEAD
      imports: [AppComponent],
=======
      imports: [App],
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
    }).compileComponents();
  });

  it('should create the app', () => {
<<<<<<< HEAD
    const fixture = TestBed.createComponent(AppComponent);
=======
    const fixture = TestBed.createComponent(App);
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
<<<<<<< HEAD
    const fixture = TestBed.createComponent(AppComponent);
=======
    const fixture = TestBed.createComponent(App);
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, Chut-Chut-kiosk');
  });
});
