import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';

import { PacienteFormComponent } from './paciente-form';

describe('PacienteFormComponent', () => {
  let component: PacienteFormComponent;
  let fixture: ComponentFixture<PacienteFormComponent>;
  const fb = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PacienteFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput(
      'formularioPaciente',
      fb.group({
        nombre: ['', [Validators.required]],
        cedula: ['', [Validators.required]],
        edad: [0, [Validators.required]],
        telefono: ['', [Validators.required]],
        diagnostico: ['', [Validators.required]]
      })
    );
    fixture.componentRef.setInput('modoEdicion', false);
    fixture.componentRef.setInput('capacidadCompleta', false);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
