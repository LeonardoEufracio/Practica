import { Component, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

type Paciente = {
  id: number;
  nombre: string;
  cedula: string;
  edad: number;
  telefono: string;
  diagnostico: string;
};

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly fb = new FormBuilder();

  protected readonly capacidadMaxima = 10;
  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly modoEdicion = signal(false);
  protected readonly pacienteEditandoId = signal<number | null>(null);

  protected readonly ocupacionActual = computed(() => this.pacientes().length);
  protected readonly cuposDisponibles = computed(
    () => this.capacidadMaxima - this.ocupacionActual()
  );
  protected readonly capacidadCompleta = computed(
    () => this.ocupacionActual() >= this.capacidadMaxima
  );

  protected readonly formularioPaciente = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    cedula: [
      '',
      [Validators.required, Validators.pattern(/^[0-9]{8,12}$/)]
    ],
    edad: [0, [Validators.required, Validators.min(0), Validators.max(120)]],
    telefono: [
      '',
      [Validators.required, Validators.pattern(/^[0-9]{7,10}$/)]
    ],
    diagnostico: ['', [Validators.required, Validators.minLength(5)]]
  });

  private ultimoId = 0;

  protected guardarPaciente(): void {
    if (this.formularioPaciente.invalid) {
      this.formularioPaciente.markAllAsTouched();
      return;
    }

    const valores = this.formularioPaciente.getRawValue();
    const pacienteBase = {
      nombre: valores.nombre.trim(),
      cedula: valores.cedula.trim(),
      edad: Number(valores.edad),
      telefono: valores.telefono.trim(),
      diagnostico: valores.diagnostico.trim()
    };

    if (this.modoEdicion()) {
      const id = this.pacienteEditandoId();
      if (id === null) {
        return;
      }

      this.pacientes.update((lista) =>
        lista.map((paciente) =>
          paciente.id === id ? { ...paciente, ...pacienteBase } : paciente
        )
      );
      this.cancelarEdicion();
      return;
    }

    if (this.capacidadCompleta()) {
      return;
    }

    this.ultimoId += 1;
    const nuevoPaciente: Paciente = {
      id: this.ultimoId,
      ...pacienteBase
    };

    this.pacientes.update((lista) => [...lista, nuevoPaciente]);
    this.limpiarFormulario();
  }

  protected editarPaciente(paciente: Paciente): void {
    this.modoEdicion.set(true);
    this.pacienteEditandoId.set(paciente.id);
    this.formularioPaciente.patchValue({
      nombre: paciente.nombre,
      cedula: paciente.cedula,
      edad: paciente.edad,
      telefono: paciente.telefono,
      diagnostico: paciente.diagnostico
    });
  }

  protected eliminarPaciente(id: number): void {
    this.pacientes.update((lista) => lista.filter((paciente) => paciente.id !== id));
    if (this.pacienteEditandoId() === id) {
      this.cancelarEdicion();
    }
  }

  protected cancelarEdicion(): void {
    this.modoEdicion.set(false);
    this.pacienteEditandoId.set(null);
    this.limpiarFormulario();
  }

  protected obtenerError(control: keyof typeof this.formularioPaciente.controls): string {
    const campo = this.formularioPaciente.controls[control];
    if (!campo.touched || !campo.errors) {
      return '';
    }

    if (campo.errors['required']) {
      return 'Este campo es obligatorio.';
    }
    if (campo.errors['minlength']) {
      return `Debe tener al menos ${campo.errors['minlength'].requiredLength} caracteres.`;
    }
    if (campo.errors['pattern']) {
      return 'El formato ingresado no es valido.';
    }
    if (campo.errors['min']) {
      return `El valor minimo permitido es ${campo.errors['min'].min}.`;
    }
    if (campo.errors['max']) {
      return `El valor maximo permitido es ${campo.errors['max'].max}.`;
    }

    return 'Dato invalido.';
  }

  private limpiarFormulario(): void {
    this.formularioPaciente.reset({
      nombre: '',
      cedula: '',
      edad: 0,
      telefono: '',
      diagnostico: ''
    });
  }
}
