import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-paciente-form',
  imports: [ReactiveFormsModule],
  templateUrl: './paciente-form.html',
  styleUrl: './paciente-form.css'
})
export class PacienteFormComponent {
  // Este componente contiene solo la captura/validacion de datos.
  // Asi el formulario queda reutilizable y separado del listado.
  readonly formularioPaciente = input.required<FormGroup>();
  readonly modoEdicion = input.required<boolean>();
  readonly capacidadCompleta = input.required<boolean>();

  readonly guardar = output<void>();
  readonly cancelar = output<void>();

  onGuardar(): void {
    if (this.formularioPaciente().invalid) {
      this.formularioPaciente().markAllAsTouched();
      return;
    }
    this.guardar.emit();
  }

  onCancelar(): void {
    this.cancelar.emit();
  }

  obtenerError(control: string): string {
    const campo = this.formularioPaciente().get(control);
    if (!campo || !campo.touched || !campo.errors) {
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
}
