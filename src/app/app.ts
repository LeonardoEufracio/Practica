import { Component, computed, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PanelAforoComponent } from './components/panel-aforo/panel-aforo';
import { PacienteFormComponent } from './components/paciente-form/paciente-form';
import { PacienteListComponent } from './components/paciente-list/paciente-list';
import { Paciente } from './models/paciente.model';

@Component({
  selector: 'app-root',
  imports: [PanelAforoComponent, PacienteFormComponent, PacienteListComponent],
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

  // El estado global queda en App para coordinar todo el CRUD con signals.
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
