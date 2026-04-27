import { Component, input, output } from '@angular/core';
import { Paciente } from '../../models/paciente.model';

@Component({
  selector: 'app-paciente-list',
  imports: [],
  templateUrl: './paciente-list.html',
  styleUrl: './paciente-list.css'
})
export class PacienteListComponent {
  // Este componente concentra la vista de lectura (Read) del CRUD
  // y emite eventos para editar/eliminar sin mezclar reglas de negocio.
  // App decide que hacer con esos eventos (actualizar estado).
  readonly pacientes = input.required<Paciente[]>();
  readonly editar = output<Paciente>();
  readonly eliminar = output<number>();

  onEditar(paciente: Paciente): void {
    // Reenvia el paciente seleccionado al componente padre.
    this.editar.emit(paciente);
  }

  onEliminar(id: number): void {
    // Reenvia el id para aplicar la eliminacion en App.
    this.eliminar.emit(id);
  }
}
