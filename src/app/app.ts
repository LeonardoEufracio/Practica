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

  // Regla de negocio fija del enunciado: el hospital no admite mas de 10 pacientes.
  protected readonly capacidadMaxima = 10;
  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly modoEdicion = signal(false);
  protected readonly pacienteEditandoId = signal<number | null>(null);

  // Signals derivados para reflejar el estado de aforo en tiempo real en la UI.
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
      [Validators.required, Validators.pattern(/^[0-9]{10}$/)]
    ],
    edad: [0, [Validators.required, Validators.min(0), Validators.max(120)]],
    telefono: [
      '',
      [Validators.required, Validators.pattern(/^[0-9]{9}$/)]
    ],
    diagnostico: ['', [Validators.required, Validators.minLength(5)]]
  });

  private ultimoId = 0;

  protected guardarPaciente(): void {
    // Se normalizan datos antes de crear/actualizar para evitar espacios innecesarios.
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

    // En modo creacion se respeta el aforo maximo.
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
    // Carga datos existentes para editar sin perder validaciones del formulario.
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
    // Si se elimina el paciente que estaba en edicion, se limpia el formulario.
    this.pacientes.update((lista) => lista.filter((paciente) => paciente.id !== id));
    if (this.pacienteEditandoId() === id) {
      this.cancelarEdicion();
    }
  }

  protected cancelarEdicion(): void {
    // Restaurar modo creacion para continuar el flujo normal del CRUD.
    this.modoEdicion.set(false);
    this.pacienteEditandoId.set(null);
    this.limpiarFormulario();
  }

  private limpiarFormulario(): void {
    // Valores base del formulario para alta/edicion.
    this.formularioPaciente.reset({
      nombre: '',
      cedula: '',
      edad: 0,
      telefono: '',
      diagnostico: ''
    });
  }
}
