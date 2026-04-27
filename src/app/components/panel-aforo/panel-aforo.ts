import { Component, input } from '@angular/core';

@Component({
  selector: 'app-panel-aforo',
  imports: [],
  templateUrl: './panel-aforo.html',
  styleUrl: './panel-aforo.css'
})
export class PanelAforoComponent {
  // Este componente centraliza la informacion del aforo para mantener
  // visible la regla principal de negocio (maximo 10 pacientes).
  readonly ocupacionActual = input.required<number>();
  readonly capacidadMaxima = input.required<number>();
  readonly cuposDisponibles = input.required<number>();
  readonly capacidadCompleta = input.required<boolean>();
  readonly modoEdicion = input.required<boolean>();
}
