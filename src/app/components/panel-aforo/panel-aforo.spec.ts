import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelAforoComponent } from './panel-aforo';

describe('PanelAforoComponent', () => {
  let component: PanelAforoComponent;
  let fixture: ComponentFixture<PanelAforoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelAforoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelAforoComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('ocupacionActual', 0);
    fixture.componentRef.setInput('capacidadMaxima', 10);
    fixture.componentRef.setInput('cuposDisponibles', 10);
    fixture.componentRef.setInput('capacidadCompleta', false);
    fixture.componentRef.setInput('modoEdicion', false);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
